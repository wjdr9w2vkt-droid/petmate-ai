interface WeightDisplayProps {
  latestWeight: string | null
  previousWeight?: string | null
}

/**
 * 体重数字展示：最新体重 / 上次体重 / 变化值。
 */
export function WeightDisplay({ latestWeight, previousWeight }: WeightDisplayProps) {
  if (!latestWeight) return null

  const latest = parseFloat(latestWeight)

  let change: number | null = null
  let changeLabel = ''

  if (previousWeight) {
    change = latest - parseFloat(previousWeight)
    changeLabel =
      change > 0 ? `↑ ${change.toFixed(1)}` : change < 0 ? `↓ ${Math.abs(change).toFixed(1)}` : '→ 0'
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4 text-center">
      <p className="text-sm text-muted-foreground">最新体重</p>
      <p className="mt-1 text-3xl font-bold">
        {latestWeight}
        <span className="text-lg font-normal text-muted-foreground"> kg</span>
      </p>
      {previousWeight && (
        <p className="mt-2 text-sm text-muted-foreground">
          上次：{previousWeight} kg
          {change !== null && (
            <span
              className={`ml-2 font-medium ${
                change > 0 ? 'text-amber-500' : change < 0 ? 'text-green-500' : 'text-muted-foreground'
              }`}
            >
              {changeLabel} kg
            </span>
          )}
        </p>
      )}
    </div>
  )
}
