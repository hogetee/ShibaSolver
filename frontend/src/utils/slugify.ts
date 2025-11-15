export function slugify(title: string): string {
  title = "NanoShiba-" + title;
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // replace spaces/symbols with -
    .replace(/(^-|-$)+/g, '')     // remove leading/trailing -
}