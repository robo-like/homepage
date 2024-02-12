//@ts-expect-error - i don't think the ts-config is setup to look for html files
import homePage from './pages/home.html';
//@ts-expect-error - i don't think the ts-config is setup to look for js files
import scriptJs from './pages/script.html';

// a function to bundle the dynamic posts into a single object key store
const pages = {
	blog: {
		'hello-world': 'Hello, world!',
		'another-post': 'This',
	},
};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const origin = url.origin;

		if (path.startsWith('/blog/')) {
			const slug = path.split('/').pop();
			if (slug) {
				//@ts-ignore - i know what i'm doing
				return new Response(pages.blog[slug], {
					headers: { 'Content-Type': 'text/html; charset=utf-8' },
				});
			}
		}
		switch (path) {
			case '/':
				return new Response(homePage, {
					headers: { 'Content-Type': 'text/html; charset=utf-8' },
				});
			case '/script.js':
				return new Response(scriptJs, {
					headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
				});
			case '/sitemap.xml':
				const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
				<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				  <url>
					<loc>${origin}</loc>
					<lastmod>${new Date().toISOString()}</lastmod>
					<changefreq>monthly</changefreq>
					<priority>1.0</priority>
				  </url>
				</urlset>`;

				return new Response(sitemap, {
					headers: { 'Content-Type': 'application/xml' },
				});
			default:
				return new Response('Page not found', {
					status: 404,
					statusText: 'Not Found',
					headers: { 'Content-Type': 'text/plain; charset=utf-8' },
				});
		}
	},
};
