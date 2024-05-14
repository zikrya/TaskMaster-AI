import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/protected");
  };


  return (
    <div>
      <form>
        <label htmlFor="email">
          Email
        </label>
        <input
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        {searchParams?.message && (
          <p>
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
