import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.set('jwt', '', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 0
	});
	throw redirect(302, '/');
};
