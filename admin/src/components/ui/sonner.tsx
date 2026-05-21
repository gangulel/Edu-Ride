"use client";

import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";
import { useTheme } from "../../lib/theme";

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--er-bg-elevated)",
          "--normal-text": "var(--er-text)",
          "--normal-border": "var(--er-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
