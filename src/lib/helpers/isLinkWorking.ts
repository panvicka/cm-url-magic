import type { Link } from '$lib/types';

export async function isLinkWorking(url: string): Promise<boolean> {
	const corsUrl = 'https://thingproxy.freeboard.io/fetch/' + encodeURIComponent(url);
	return fetch(corsUrl, {
		method: 'GET'
	})
		.then((response) => {
			console.log(response);
			return response.ok || response.status === 401 || response.status === 302;
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
