export function formatDate(iso) {
  if (!iso) return 'No due date';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return iso;
  }
}
