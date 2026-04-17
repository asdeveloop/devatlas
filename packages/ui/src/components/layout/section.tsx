import * as React from "react"

import { cn } from "../../lib/utils"

type SectionProps = React.ComponentProps<"section"> & {
  spacing?: "sm" | "md" | "lg"
}

const sectionSpacingClassName: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16"
}

function Section({
  className,
  spacing = "md",
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn("w-full", sectionSpacingClassName[spacing], className)}
      {...props}
    />
  )
}

export { Section }
