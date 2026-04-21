import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card"
import { cn } from "./cx"

export type ToolCardProps = React.ComponentProps<typeof Card> & {
  title?: React.ReactNode
  description?: React.ReactNode
}

function ToolCard({ title, description, children, className, ...props }: ToolCardProps) {
  return (
    <Card className={cn("gap-3", className)} {...props}>
      <CardHeader>
        {title ? <CardTitle>{title}</CardTitle> : null}
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  )
}

export default ToolCard
