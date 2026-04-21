import * as React from "react"

import { cn } from "../ui/cx"

export type ContainerProps = React.ComponentProps<"div">

function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      data-slot="shared-container"
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  )
}

export default Container
