import type { Link } from '$lib/types';

export async function isLinkWorking(url: string): Promise<boolean> {
	const corsUrl = 'https://thingproxy.freeboard.io/fetch/' + encodeURIComponent(url);

	return fetch(corsUrl, {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'GET'
	})
		.then((response) => {
			return response.ok || response.status === 401;
		})
		.catch(() => {
			return false;
		});
}

export async function checkLinks(
	urls: Array<{
		href: string;
		name: string;
	}>
): Promise<Array<Link>> {
	const results = await Promise.all(
		urls.map(async (url) => {
			const isWorking = await isLinkWorking(url.href);
			return { ...url, isWorking };
		})
	);
	return results;
}
