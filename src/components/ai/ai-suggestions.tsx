'use client'

const SUGGESTIONS = [
  '狗狗不爱吃饭怎么办？',
  '猫咪掉毛严重正常吗？',
  '幼犬一天应该喂几次？',
  '宠物疫苗多久打一次？',
]

interface AiSuggestionsProps {
  onSelect: (question: string) => void
}

/**
 * 推荐问题快捷入口。
 */
export function AiSuggestions({ onSelect }: AiSuggestionsProps) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="mb-2 text-xs text-muted-foreground">💡 试试这些问题：</p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="rounded-full border bg-background px-3 py-1 text-xs transition-colors hover:bg-muted"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
