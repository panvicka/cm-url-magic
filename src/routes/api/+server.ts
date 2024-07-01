export const OPTIONS = async ({ request }) => {
	const body = await request.json();
	const res = await fetch(body || '');
	return new Response(JSON.stringify({ message: 'checked link' }), { status: res.status });
};
