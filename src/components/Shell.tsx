
import React from "react";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
