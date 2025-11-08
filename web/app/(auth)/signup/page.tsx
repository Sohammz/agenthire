// server wrapper for the Signup client component
import dynamic from 'next/dynamic';
import React from 'react';
import SignupClient from './SignupClient';

// const SignupClient = dynamic(() => import('./SignupClient'), { ssr: false });

export default function Page() {
  return <SignupClient />;
}
