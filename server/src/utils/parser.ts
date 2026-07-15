export const parseId = (val: any): number | null => {
  if (val === undefined || val === null || val === '') return null
  
  // Convert to string and strip prefix if present (e.g. sh-1 -> 1, case-2 -> 2)
  const str = String(val).trim()
  const cleaned = str.replace(/^(sh|case|ani|res|treat|inc|log|team)-/, '')
  
  const parsed = parseInt(cleaned, 10)
  return isNaN(parsed) ? null : parsed
}