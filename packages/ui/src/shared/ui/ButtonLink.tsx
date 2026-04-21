import { Slot } from "@radix-ui/react-slot"
import * as React from "react"

import { Button } from "../../components/button"

export type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  asChild?: boolean
}

function ButtonLink({ className, asChild = false, ...props }: ButtonLinkProps) {
  return (
    <Button asChild={true} className={className}>
      {asChild ? <Slot {...props} /> : <a {...props} />}
    </Button>
  )
}

export default ButtonLink
