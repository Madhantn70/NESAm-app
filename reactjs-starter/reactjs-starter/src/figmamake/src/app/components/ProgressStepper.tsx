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
    <div className="w-full bg-white border-b border-border">
      <div className="w-full max-w-md mx-auto px-6 py-5">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-border -z-10">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center gap-2 relative"
              >
                {/* Circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                    ${
                      isCompleted
                        ? "bg-primary border-primary"
                        : isCurrent
                        ? "bg-primary border-primary"
                        : "bg-white border-border"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="size-4 text-white" />
                  ) : (
                    <span
                      className={`text-sm ${
                        isCurrent ? "text-white font-medium" : "text-muted-foreground"
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
                      ? "text-foreground font-medium"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
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