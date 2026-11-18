export const markdownPages = {
	"/": "index",
	"/about/": "about",
	"/work/": "work"
} as const;

export function markdownPath(pathname: string): string | undefined {
	const document = markdownPages[pathname as keyof typeof markdownPages];
	return document ? `/${document}.md` : undefined;
}
