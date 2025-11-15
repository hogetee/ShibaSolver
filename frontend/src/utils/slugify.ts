export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // replace spaces/symbols with -
    .replace(/(^-|-$)+/g, '')     // remove leading/trailing -
}