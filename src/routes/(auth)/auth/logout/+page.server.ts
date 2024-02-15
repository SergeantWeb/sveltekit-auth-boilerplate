import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ cookies, url }) => {
	cookies.set('jwt', '', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 0
	});
	const redirectTo = url.searchParams.get('redirect_to')
	throw redirect(302, redirectTo ?? '/');
};
