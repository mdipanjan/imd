export const formatLongDate = (date: Date) =>
  new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(date);

export const formatShortDate = (date: Date, includeYear = false) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    ...(includeYear ? { year: 'numeric' as const } : {}),
  }).format(date);

export const formatTaxonomy = (tag: string) => tag.charAt(0).toUpperCase() + tag.slice(1);
