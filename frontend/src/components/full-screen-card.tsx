import { ReactNode } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

type FullScreenCardProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
};
export default function FullScreenCard(props: FullScreenCardProps) {
  const { title, subtitle, className, children } = props;
  const displayHeader = title || subtitle;
  return (
    <div
      className={cn(
        "flex items-center justify-center grow h-full m-auto",
        className
      )}
    >
      <Card className="p-8 bg-card text-card-foreground shadow">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {displayHeader && (
            <div className="flex flex-col space-y-2 text-center">
              {title && (
                <h1 className="text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-3">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </Card>
    </div>
  );
}
