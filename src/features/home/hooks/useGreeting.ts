import { useEffect, useState } from 'react'

function getCurrentGreeting(date = new Date()) {
  const h = date.getHours()
  if (h >= 5 && h < 12) return 'Good Morning!'
  if (h >= 12 && h < 17) return 'Good Afternoon!'
  return 'Good Evening!'
}

function msUntilNextBoundary(date = new Date()) {
  const h = date.getHours()
  let next: Date
  if (h < 5) next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 0, 0, 0)
  else if (h < 12) next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
  else if (h < 17) next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 0, 0, 0)
  else next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 5, 0, 0, 0)
  return Math.max(1, next.getTime() - date.getTime())
}

export default function useGreeting(): string {
  const [greeting, setGreeting] = useState<string>(() => getCurrentGreeting())

  useEffect(() => {
    let mounted = true
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    function scheduleNext() {
      const ms = msUntilNextBoundary(new Date())
      timeoutId = setTimeout(() => {
        if (!mounted) return
        setGreeting(getCurrentGreeting())
        scheduleNext()
      }, ms)
    }

    // ensure greeting is correct on mount and schedule updates
    setGreeting(getCurrentGreeting())
    scheduleNext()

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return greeting
}
