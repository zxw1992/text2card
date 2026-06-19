import { type ChangeEvent } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  className?: string
}

const SAMPLES: { label: string; text: string }[] = [
  {
    label: '金句',
    text: '愿你慢慢长大，愿你有好运气，如果没有，愿你在不幸中学会慈悲。',
  },
  {
    label: '代码',
    text: `function greet(name: string) {\n  const message = \`Hello, \${name}!\`\n  console.log(message)\n  return message\n}\n\ngreet('world')`,
  },
  {
    label: '长文',
    text: `# 关于写作的笔记\n\n写作是一种思考方式。\n\n## 第一原则\n\n- 先把想法写下来，不要怕粗糙\n- 把动词改得更精确\n- 删掉每一个不必要的形容词\n\n> 写作的核心，是把模糊的想法变成清晰的句子。\n\n参考：\`https://example.com\``,
  },
  {
    label: '诗词',
    text: '《山居秋暝》\n空山新雨后\n天气晚来秋\n明月松间照\n清泉石上流',
  },
]

export function Editor({ value, onChange, className = '' }: Props) {
  // 仅当用户输入了自己的内容（非空且不等于任一示例/默认文本）时才二次确认，
  // 避免手滑点示例覆盖掉正在编辑的文字
  function applySample(sampleText: string) {
    const dirty = value.trim() !== '' && !SAMPLES.some((s) => s.text === value)
    if (dirty && !window.confirm('用示例替换当前内容？正在编辑的文字会被覆盖。')) return
    onChange(sampleText)
  }

  return (
    <aside className={`h-full w-full shrink-0 flex-col border-r border-ink-200/60 bg-white/60 backdrop-blur md:w-[360px] ${className}`}>
      <div className="flex items-center justify-between border-b border-ink-200/60 px-5 py-4">
        <h2 className="font-serif text-lg font-semibold text-ink-800">编辑</h2>
        <div className="flex gap-1.5">
          {SAMPLES.map((s) => (
            <button
              key={s.label}
              onClick={() => applySample(s.text)}
              className="rounded-full border border-ink-200 px-2.5 py-1 text-xs text-ink-600 transition hover:border-ink-400 hover:text-ink-800"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder="在这里粘贴你想分享的文字、代码、Markdown 或诗词……"
        className="font-mono flex-1 resize-none bg-transparent p-5 text-[14px] leading-relaxed text-ink-800 outline-none placeholder:text-ink-300"
        spellCheck={false}
      />
      <div className="border-t border-ink-200/60 px-5 py-3 text-xs text-ink-400">
        {value.length} 字
      </div>
    </aside>
  )
}
