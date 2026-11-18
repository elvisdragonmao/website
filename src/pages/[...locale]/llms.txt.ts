import type { APIRoute } from "astro";
import type { Locale } from "../../i18n";
import { llmsIndex, textDocument, textDocumentLocales } from "../../lib/site-markdown";

export const getStaticPaths = () => textDocumentLocales;

export const GET: APIRoute<{ locale: Locale }> = ({ site, props }) => textDocument(llmsIndex({ site: site!, locale: props.locale }), props.locale);
