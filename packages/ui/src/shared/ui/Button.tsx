import type { ComponentProps } from "react"
import { Button as BaseButton } from "../../components/button"

type ButtonProps = ComponentProps<typeof BaseButton>

function Button(props: ButtonProps) {
  return <BaseButton {...props} />
}

export default Button
export type { ButtonProps }
