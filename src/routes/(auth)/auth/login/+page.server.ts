import type { Actions } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import AuthService from '$lib/server/services/AuthService';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const redirectTo = data.get('redirect_to') as string;
		const username = data.get('username') as string;
		try {
			const jwt = await AuthService.login(username, data.get('password') as string);
			cookies.set('jwt', jwt, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: !dev,
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});
		} catch (errors: any) {
			return fail(400, {
				data: { username },
				errors
			});
		}
		throw redirect(302, redirectTo ? redirectTo : '/');
	}
};
