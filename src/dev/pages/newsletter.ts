import type { APIRoute } from "astro";
import { handleNewsletter } from "../../server/newsletter";

export const prerender = false;
export const ALL: APIRoute = ({ request }) => handleNewsletter(request);
