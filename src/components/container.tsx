import { cn } from "@/libs/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full py-4 px-12", className)}>{children}</div>;
}
