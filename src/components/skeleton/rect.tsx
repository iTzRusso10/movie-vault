import { px } from "crustack/utils"

type Props = {
  width?: string | number
  height: string | number
  color?: string
}

export const Rect = ({ width = "100%", height, color }: Props) => {
  return (
    <div
      style={{
        width: px(width),
        height: px(height),
        backgroundColor: color,
      }}
      className="!bg-surface-4/20 animate-pulse rounded"
    />
  )
}
