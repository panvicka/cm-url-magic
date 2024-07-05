import { BASE_AUTH_ADMIN_LOGIN } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({
	event,
	resolve
}: Parameters<Handle>[0]): Promise<ReturnType<Handle>> {
	const url = new URL(event.request.url);

	if (url.pathname.startsWith('/') && !url.pathname.startsWith('/api')) {
		const auth = event.request.headers.get('Authorization');
		if (auth !== `Basic ${btoa(BASE_AUTH_ADMIN_LOGIN)}`) {
			return new Response('Not authorized', {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="User Visible Realm", charset="UTF-8"'
				}
			});
		}
	}

	return resolve(event);
}
