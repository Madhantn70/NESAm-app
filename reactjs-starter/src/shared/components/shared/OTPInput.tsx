import React, { useRef, useState, useEffect } from "react";

interface OTPInputProps {
  maxLength: number;
  value: string;
  onChange: (val: string) => void;
}

export function OTPInput({ maxLength, value, onChange }: OTPInputProps) {
  const [internalValue, setInternalValue] = useState<string[]>(Array(maxLength).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const chars = value.split("");
    const newVals = Array(maxLength).fill("");
    chars.forEach((c, i) => {
      if (i < maxLength) newVals[i] = c;
    });
    setInternalValue(newVals);
  }, [value, maxLength]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return;

    const newArr = [...internalValue];
    newArr[index] = val.slice(-1);
    const newValue = newArr.join("");
    
    onChange(newValue);

    if (val && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !internalValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newArr = [...internalValue];
      newArr[index - 1] = "";
      onChange(newArr.join(""));
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxLength }).map((_, i) => (
        <input
          key={i}
          id={i === 0 ? "otp" : undefined}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          maxLength={1}
          value={internalValue[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="relative flex w-12 h-14 text-xl items-center justify-center text-center border-2 border-input bg-input-background transition-all outline-none rounded-md focus:z-10 focus:ring-[3px] focus:ring-ring/50 focus:border-ring"
        />
      ))}
    </div>
  );
}
