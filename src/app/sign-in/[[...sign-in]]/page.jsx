import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div>
        <SignIn
          path="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary: "bg-slate-500 hover:bg-slate-400 text-sm normal-case",
            },
          }}
        />
      </div>
    </div>
  );
}

