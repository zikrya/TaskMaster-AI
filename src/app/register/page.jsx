import React from 'react'
import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers'

const Register = () => {

  const handleRegister = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const origin = headers().get("origin");
      const email = formData.get("email");
      const password = formData.get("password");
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
              emailRedirectTo: `${origin}/auth/callback`,
          },
      });

      if (error) {
          router.redirect("/login?message=Could not authenticate user");
      } else {
          router.redirect("/login?message=Check email to continue sign in process");
      }
  };

  return (
      <form onSubmit={handleRegister}>
          <label htmlFor="email">Email</label>
          <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
          />
          <label htmlFor="password">Password</label>
          <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
          />
          <button type="submit">Register</button>
      </form>
  );
};

export default Register;