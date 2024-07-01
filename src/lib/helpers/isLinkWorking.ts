import type { Link } from '$lib/types';

export async function isLinkWorking(url: string): Promise<boolean> {
	const res = await fetch('/api', {
		method: 'OPTIONS',
		body: JSON.stringify(url)
	});

	if (res.status === 200 || res.status === 401) {
		return true;
	}
	return false;
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
