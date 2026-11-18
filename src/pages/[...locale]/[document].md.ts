import type { APIRoute } from "astro";
import type { Locale } from "../../i18n";
import { markdownPages } from "../../lib/markdown-paths";
import { markdownDocuments, textDocument, textDocumentLocales } from "../../lib/site-markdown";

export function getStaticPaths() {
	return textDocumentLocales.flatMap(({ params, props }) =>
		Object.values(markdownPages).map(document => ({
			params: { ...params, document },
			props: { ...props, document }
		}))
	);
}

export const GET: APIRoute<{ locale: Locale; document: keyof typeof markdownDocuments }> = ({ site, props }) =>
	textDocument(markdownDocuments[props.document]({ site: site!, locale: props.locale }), props.locale);
