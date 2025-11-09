import en from './en.json'

const dictionary = en as Record<string, unknown>

const resolvePath = (path: string) => {
  const segments = path.split('.')
  let current: unknown = dictionary

  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in current) {
      current = (current as Record<string, unknown>)[segment]
    } else {
      return undefined
    }
  }

  return current
}

const applyReplacements = (
  value: string,
  replacements?: Record<string, string | number>,
) => {
  if (!replacements) {
    return value
  }

  return Object.entries(replacements).reduce(
    (acc, [token, replacement]) =>
      acc.replaceAll(`{${token}}`, String(replacement)),
    value,
  )
}

export const t = (
  key: string,
  fallback?: string,
  replacements?: Record<string, string | number>,
) => {
  const result = resolvePath(key)
  if (typeof result === 'string') {
    return applyReplacements(result, replacements)
  }
  if (fallback) {
    return applyReplacements(fallback, replacements)
  }
  return applyReplacements(key, replacements)
}

export const useI18n = () => {
  return {
    t,
    lang: 'en',
    dir: 'ltr' as const,
    dictionary: en,
  }
}

