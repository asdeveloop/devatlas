"use client"

import * as React from "react"

type DirectionMode = "ltr" | "rtl"

const DirectionContext = React.createContext<DirectionMode>("ltr")

function DirectionProvider({
  children,
  dir,
  direction,
  ...props
}: {
  children: React.ReactNode
  dir?: DirectionMode
  direction?: DirectionMode
} & React.HTMLAttributes<HTMLDivElement>) {
  const value = direction ?? dir ?? "ltr"

  return (
    <DirectionContext.Provider value={value}>
      <div data-direction={value} {...props}>
        {children}
      </div>
    </DirectionContext.Provider>
  )
}

function useDirection() {
  return React.useContext(DirectionContext)
}

export { DirectionProvider, useDirection, type DirectionMode }
