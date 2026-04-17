export type DeferredTaskOptions = {
  fallbackDelayMs?: number
  idleTimeoutMs?: number
  maxWaitMs?: number
}

export function scheduleDeferredTask(
  task: () => void,
  options: DeferredTaskOptions = {}
): () => void {
  const {
    fallbackDelayMs = 200,
    idleTimeoutMs = 800,
    maxWaitMs = 2500,
  } = options

  let timeout: ReturnType<typeof setTimeout> | null = null
  let idleTimeout: ReturnType<typeof setTimeout> | null = null
  let cancelled = false

  const wrappedTask = () => {
    if (cancelled) {
      return
    }
    task()
  }

  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const handle = window.requestIdleCallback(
      () => {
        wrappedTask()
      },
      { timeout: idleTimeoutMs }
    )

    timeout = setTimeout(
      () => {
        if (!cancelled) {
          wrappedTask()
          window.cancelIdleCallback(handle)
        }
      },
      maxWaitMs
    )

    idleTimeout = null
  } else {
    timeout = setTimeout(wrappedTask, fallbackDelayMs)
  }

  return () => {
    cancelled = true
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    if (idleTimeout) {
      clearTimeout(idleTimeout)
      idleTimeout = null
    }
  }
}
