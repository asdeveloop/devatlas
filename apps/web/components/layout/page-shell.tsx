import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps): React.JSX.Element {
  return <main className="min-h-screen bg-background text-foreground">{children}</main>;
}
