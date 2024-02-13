import { PUBLIC_ACCOUNT_ACTIVATION } from '$env/static/public';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import AuthService from '$lib/server/services/AuthService';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const username = data.get('username') as string;
		const redirectTo = data.get('redirect_to') as string
		try {
			await AuthService.register({
				email,
				username,
				password: data.get('password') as string,
				confirmation: data.get('confirmation') as string,
				terms: data.get('terms') as unknown as boolean
			}, redirectTo);
		} catch (errors: any) {
			return fail(400, {
				data: {
					email: email,
					username: username
				},
				errors
			});
		}
		throw redirect(
			302,
			'/auth/login' +
				(!['0', 'false'].includes(PUBLIC_ACCOUNT_ACTIVATION) ? '?message=activate-account' : `?redirect_to=${redirectTo}`)
		);
	}
};
