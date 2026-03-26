import React from 'react';
import { Button } from "@/shared/components/shared/Button";
import { useNavigate } from 'react-router-dom';

export function ImpactHero() {
  const navigate = useNavigate();

  return (
    <section className="text-center w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
        Community Support.<br />Built on Trust.
      </h1>
      <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-sm mx-auto px-2">
        NESAm is an alumni family support initiative where members contribute together to help families during difficult times. A transparent, dignified approach to community welfare.
      </p>
      <Button
        className="text-lg shadow-sm"
        onClick={() => navigate('/register')}
      >
        Join NESAm
      </Button>
    </section>
  );
}
