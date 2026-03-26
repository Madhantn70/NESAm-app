import React from "react";
import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

interface ProgressStepperProps {
  currentStep: number; // 1-indexed
}

const steps: Step[] = [
  { number: 1, label: "Contact" },
  { number: 2, label: "Age" },
  { number: 3, label: "Nominee" },
  { number: 4, label: "Contribution" },
  { number: 5, label: "Payment" },
];

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="w-full max-w-md mx-auto px-6 py-5">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div
              className="h-full bg-teal-600 transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center gap-2 relative bg-white"
              >
                {/* Circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all bg-white
                    ${
                      isCompleted
                        ? "bg-teal-600 border-teal-600"
                        : isCurrent
                        ? "bg-teal-600 border-teal-600"
                        : "bg-white border-gray-300"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  ) : (
                    <span
                      className={`text-sm ${
                        isCurrent ? "text-white font-medium" : "text-gray-400"
                      }`}
                    >
                      {step.number}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs whitespace-nowrap ${
                    isCurrent
                      ? "text-gray-900 font-medium"
                      : isCompleted
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
