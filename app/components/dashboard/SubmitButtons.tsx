"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface iAppProps {
  text: string;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  disabled?: boolean;
}

export function SubmitButton({ text, className, variant, disabled }: iAppProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <Button
      disabled={isDisabled}
      className={cn("w-fit", className)}
      variant={variant}
      type="submit"
    >
      {isDisabled ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" /> Please Wait
        </>
      ) : (
        text
      )}
    </Button>
  );
}
