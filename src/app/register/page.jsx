'use client'
import React, { useState } from 'react'
import { signUp } from '@/lib/auth';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e) => {
      e.preventDefault();
      const { user, session, error } = await signUp(email, password);
      if (error) alert(error.message);
      else alert('Registration successful!');
    };

    return (
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
    );
  }
export default Register