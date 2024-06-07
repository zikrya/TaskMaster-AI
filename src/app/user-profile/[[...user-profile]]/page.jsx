import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <UserProfile path="/user-profile" />
  </div>
);

export default UserProfilePage;
