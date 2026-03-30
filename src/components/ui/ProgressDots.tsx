interface Props {
  total: number
  current: number
}

export function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? 'w-6 h-2 bg-sand-600'
              : i < current
              ? 'w-2 h-2 bg-sand-400'
              : 'w-2 h-2 bg-sand-200'
          }`}
        />
      ))}
    </div>
  )
}
