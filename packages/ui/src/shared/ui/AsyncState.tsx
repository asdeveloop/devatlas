import * as React from "react"

export type AsyncStateProps = {
  loading?: boolean
  error?: unknown
  children: React.ReactNode
  renderLoading?: React.ReactNode
  renderError?: (error: unknown) => React.ReactNode
}

function AsyncState({
  loading,
  error,
  children,
  renderLoading,
  renderError,
}: AsyncStateProps) {
  if (loading) {
    return <>{renderLoading ?? <div className="text-sm text-muted-foreground">در حال بارگذاری...</div>}</>
  }

  if (error) {
    return <>{renderError ? renderError(error) : <div className="text-sm text-destructive">خطا: {String(error)}</div>}</>
  }

  return <>{children}</>
}

export default AsyncState
