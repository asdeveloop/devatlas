import { Card, CardContent, CardHeader } from './card'

export function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="aspect-video bg-muted rounded-lg mb-4" />
        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-full" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-20 bg-muted rounded-full" />
          <div className="h-6 w-14 bg-muted rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

export function BlogCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="aspect-video bg-muted rounded-lg mb-4" />
        <div className="h-6 bg-muted rounded w-full mb-2" />
        <div className="h-4 bg-muted rounded w-full mb-3" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </CardHeader>
    </Card>
  )
}