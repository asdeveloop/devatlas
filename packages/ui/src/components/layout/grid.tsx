import * as React from "react"

import { cn } from "../../lib/utils"

type GridColumns = 1 | 2 | 3 | 4

type GridProps = React.ComponentProps<"div"> & {
  columns?: GridColumns
  gap?: "sm" | "md" | "lg"
}

const gridColumnsClassName: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
}

const gridGapClassName: Record<NonNullable<GridProps["gap"]>, string> = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6"
}

function Grid({
  className,
  columns = 1,
  gap = "md",
  ...props
}: GridProps) {
  return (
    <div
      data-slot="grid"
      className={cn(
        "grid w-full",
        gridColumnsClassName[columns],
        gridGapClassName[gap],
        className
      )}
      {...props}
    />
  )
}

export { Grid }
