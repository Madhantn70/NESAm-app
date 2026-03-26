import React from 'react';
import { Header } from "@/shared/components/shared/Header";
import { ImpactHero } from "@/domains/public/landing/components/ImpactHero";
import { ImpactStats } from "@/domains/public/landing/components/ImpactStats";
import { Button } from "@/shared/components/shared/Button";
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 py-8 w-full max-w-md mx-auto space-y-10">
        <ImpactHero />
        
        <ImpactStats />

        <section className="w-full flex flex-col gap-4">
          <Button
            variant="outline"
            className="text-lg shadow-sm"
            onClick={() => alert("How NESAm Works screen will be shown here")}
          >
            How NESAm Works
          </Button>

          <button
            className="w-full py-3 text-teal-600 font-medium hover:text-teal-700 hover:underline transition-colors focus:outline-none"
            onClick={() => navigate('/login')}
          >
            Already a Member? Login
          </button>
        </section>

        <footer className="text-center pt-6 w-full mt-auto">
          <p className="text-xs text-gray-400">
            An Initiative of IRTT Alumni Association
          </p>
        </footer>
      </main>
    </div>
  );
}
