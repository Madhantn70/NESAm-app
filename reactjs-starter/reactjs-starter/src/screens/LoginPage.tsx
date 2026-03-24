import React from "react";
import { Header } from "../components/shared/Header";
import { LoginForm } from "../features/auth/components/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-[400px]">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
