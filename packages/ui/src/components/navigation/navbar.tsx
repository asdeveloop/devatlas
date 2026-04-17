import * as React from "react"

import { cn } from "../../lib/utils"

type NavbarProps = React.ComponentProps<"header"> & {
  sticky?: boolean
}

function Navbar({
  className,
  sticky = true,
  ...props
}: NavbarProps) {
  return (
    <header
      data-slot="navbar"
      className={cn(
        "z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        sticky && "sticky top-0",
        className
      )}
      {...props}
    />
  )
}

export { Navbar }
