import React from "react";
import { Bell, User } from "lucide-react";

interface MemberGreetingProps {
  memberName: string;
}

export function MemberGreeting({ memberName }: MemberGreetingProps) {
  return (
    <div className="w-full bg-accent/40 border-b border-border">
      <div className="w-full max-w-md mx-auto px-6 py-5 flex items-center justify-between">
        <h1 className="text-foreground">Hi, {memberName ?? "Member"}</h1>
        <div className="flex items-center gap-1">
          <button className="p-2.5 rounded-lg hover:bg-accent transition-colors">
            <Bell className="w-5 h-5 text-primary" />
          </button>
          <button className="p-2.5 rounded-lg hover:bg-accent transition-colors">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
