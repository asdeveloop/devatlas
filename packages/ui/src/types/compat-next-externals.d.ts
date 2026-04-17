declare module "next/link" {
  import type * as React from "react"

  export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    replace?: boolean
    scroll?: boolean
  }

  const Link: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<LinkProps> & React.RefAttributes<HTMLAnchorElement>
  >

  export default Link
}

declare module "next/image" {
  import type * as React from "react"

  export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string
    alt: string
    width?: number
    height?: number
    fill?: boolean
    priority?: boolean
    placeholder?: "blur" | "empty"
    quality?: number
  }

  const Image: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<ImageProps> & React.RefAttributes<HTMLImageElement>
  >

  export default Image
}

declare module "next/dynamic" {
  import type * as React from "react"

  export interface DynamicOptions {
    ssr?: boolean
    loading?: () => React.ReactNode
  }

  export default function dynamic<TProps>(
    load: () => Promise<{ default: React.ComponentType<TProps> }>,
    options?: DynamicOptions,
  ): React.ComponentType<TProps>
}

declare module "next/navigation" {
  export function usePathname(): string | null
}

declare module "next-themes" {
  import type * as React from "react"

  export interface UseThemeResult {
    theme?: string
    setTheme: (theme: string) => void
    resolvedTheme?: string
    themes?: string[]
  }

  export function useTheme(): UseThemeResult

  export const ThemeProvider: React.FC<{
    children: React.ReactNode
    attribute?: string
    defaultTheme?: string
    enableSystem?: boolean
  }>
}

declare module "framer-motion" {
  import type * as React from "react"

  type MotionComponentProps = React.HTMLAttributes<HTMLElement> & {
    initial?: unknown
    animate?: unknown
    transition?: unknown
  }

  type MotionElement = React.FC<MotionComponentProps>

  export const motion: {
    div: MotionElement
    span: MotionElement
    [key: string]: MotionElement
  }
}
