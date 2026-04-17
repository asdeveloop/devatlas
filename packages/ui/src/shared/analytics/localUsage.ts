export function recordPageView(pathname: string | null | undefined) {
  if (typeof pathname !== "string" || pathname.length === 0) {
    return
  }

  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(
    new CustomEvent("app-page-view", {
      detail: { pathname, ts: Date.now() },
    }),
  )
}
