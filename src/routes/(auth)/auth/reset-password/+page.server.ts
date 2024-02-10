import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_ALLOW_PASSWORD_RESET } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import AuthService from '$lib/server/services/AuthService';
import validation from '$lib/server/validation';

export const load: PageServerLoad = async ({ url }) => {
	if (['0', 'false'].includes(PUBLIC_ALLOW_PASSWORD_RESET)) {
		throw redirect(301, '/auth/login');
	}
	try {
		const code = url.searchParams.get('code') as string;
		if (code) {
			await AuthService.checkResetCode(code);
			return { code };
		} else {
			return {};
		}
	} catch (errors: any) {
		return { errors };
	}
};

export const actions: Actions = {
	sendResetLink: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		try {
			await AuthService.sendResetPasswordLink(email);
		} catch (errors: any) {
			return fail(400, {
				data: { email },
				errors
			});
		}
		return { sent: true };
	},

	resetPassword: async ({ request }) => {
		const data = await request.formData();
		const password = data.get('password') as string;
		const confirmation = data.get('confirmation') as string;

		try {
			validation.validatePassword(password, confirmation);
			await AuthService.newPassword(data.get('code') as string, password);
		} catch (errors: any) {
			return fail(400, { errors });
		}

		throw redirect(302, '/auth/login?message=reset-success');
	}
};
