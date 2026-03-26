import React from "react";
import { ChevronRight, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MemberActiveDfcAlertProps {
  hasActiveDFC: boolean;
  contributionDueDate?: string;
}

export function MemberActiveDfcAlert({ hasActiveDFC, contributionDueDate }: MemberActiveDfcAlertProps) {
  const navigate = useNavigate();

  if (!hasActiveDFC) return null;

  const getDaysUntilDue = () => {
    if (!contributionDueDate) return 0;
    const due = new Date(contributionDueDate);
    const today = new Date();
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysUntilDue = getDaysUntilDue();
  const isOverdue = daysUntilDue < 0;
  const isWithinDueWindow = daysUntilDue >= 0 && daysUntilDue <= 30;

  return (
    <section 
      onClick={() => navigate("/member/active-dfc")}
      className="bg-gradient-to-r from-accent to-accent/60 rounded-xl border-2 border-accent-foreground/30 p-6 shadow-md cursor-pointer hover:shadow-lg transition-all"
    >
      <div className="flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2 items-start flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-foreground font-medium">DFC Request</span>
              <span className="px-2 py-1 bg-accent-foreground/10 text-accent-foreground rounded-md border border-accent-foreground/30 text-sm font-medium">
                1 Active
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              View and respond to active requests
            </span>
          </div>
          <ChevronRight className="w-6 h-6 text-accent-foreground flex-shrink-0" />
        </div>

        {/* Contribution Status */}
        <div className="pt-4 border-t border-accent-foreground/20">
          {isOverdue ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg">
                <AlertCircle className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">
                  Contribution Overdue
                </span>
              </div>
            </div>
          ) : isWithinDueWindow ? (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-foreground" />
              <span className="text-foreground font-medium">
                Contribution due in {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
