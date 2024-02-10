import type { PageServerLoad } from './$types';
import AuthService from '$lib/server/services/AuthService';

export const load: PageServerLoad = async ({ url }) => {
	const code = url.searchParams.get('code');
	return await AuthService.activateAccount(code as string);
};
