import type { CSSProperties, ReactNode } from "react"
import { cn } from "crustack/utils"

type Props = {
  width?: string | number
  className?: string
  children?: ReactNode
  style?: CSSProperties
}

export const Text = ({
  width = "100%",
  children = " ",
  className,
  style,
}: Props) => {
  return (
    <span
      style={{ width, color: "transparent", ...style }}
      className={cn(
        className,
        "block !scale-y-[0.8] !whitespace-pre !rounded !bg-surface-3/20 !no-underline",
      )}
    >
      {children}
    </span>
  )
}
