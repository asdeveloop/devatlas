export const analytics = {
  trackEvent: (event: string, payload?: Record<string, unknown>) => {
    if (typeof window === "undefined") {
      return
    }

    window.dispatchEvent(
      new CustomEvent("app-analytics", {
        detail: { event, payload, ts: Date.now() },
      }),
    )
  },
}
