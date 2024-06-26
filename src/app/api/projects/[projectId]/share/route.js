import { prisma } from "../../../../../server/db";
import { currentUser } from "@clerk/nextjs/server";
import pusher from "../../../../../server/pusher";

export async function POST(request, { params }) {
    const { projectId } = params;
    const { emailOrUsername } = await request.json();
    const user = await currentUser();

    if (!user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            headers: { "Content-Type": "application/json" },
            status: 401,
        });
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(projectId, 10) },
            include: { user: true },
        });

        if (!project || project.user.clerkId !== user.id) {
            return new Response(JSON.stringify({ message: "Forbidden" }), {
                headers: { "Content-Type": "application/json" },
                status: 403,
            });
        }

        const shareWithUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
                ]
            }
        });

        if (!shareWithUser) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                headers: { "Content-Type": "application/json" },
                status: 404,
            });
        }

        // Check if the project is already shared with the user
        const existingSharedProject = await prisma.sharedProject.findFirst({
            where: {
                projectId: project.id,
                userId: shareWithUser.id,
            }
        });

        if (!existingSharedProject) {
            await prisma.sharedProject.create({
                data: {
                    projectId: project.id,
                    userId: shareWithUser.id,
                },
            });

            const notification = await prisma.notification.create({
                data: {
                    userId: shareWithUser.id,
                    message: `You have been added to the project "${project.name}"`,
                    url: `/project/${project.id}`,
                },
            });

            // Trigger Pusher event
            pusher.trigger('notifications', 'new-notification', notification);

            console.log('Notification created:', notification);
        }

        return new Response(JSON.stringify({ message: "Project shared successfully" }), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    } catch (error) {
        console.error("Error sharing project:", error);
        return new Response(JSON.stringify({ message: "Failed to share project" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
