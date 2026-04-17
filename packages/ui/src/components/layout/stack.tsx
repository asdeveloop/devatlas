import * as React from "react"

import { cn } from "../../lib/utils"

type StackProps = React.ComponentProps<"div"> & {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl"
  align?: "start" | "center" | "end" | "stretch"
}

const stackGapClassName: Record<NonNullable<StackProps["gap"]>, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8"
}

const stackAlignClassName: Record<NonNullable<StackProps["align"]>, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch"
}

function Stack({
  className,
  gap = "md",
  align = "stretch",
  ...props
}: StackProps) {
  return (
    <div
      data-slot="stack"
      className={cn(
        "flex flex-col",
        stackGapClassName[gap],
        stackAlignClassName[align],
        className
      )}
      {...props}
    />
  )
}

export { Stack }
