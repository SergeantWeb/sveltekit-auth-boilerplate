import type { Cookies } from '@sveltejs/kit';
import AuthService from '$lib/server/services/AuthService';

const serverUtils = {
	formatEntry: (entry: any) => {
		const data = { ...entry };
		if (typeof data?._doc?._id !== 'undefined') {
			data._doc.id = data._doc._id.toString();
			delete data._doc._id;
			delete data._doc.password;
			delete data._doc.validationToken;
			delete data._doc.sessionToken;
			delete data._doc.sessionExpire;
		}
		if (typeof data?._doc?.__v !== 'undefined') {
			delete data._doc.__v;
		}
		// Format array children
		if (typeof data._doc === 'object') {
			for (const [k, v] of Object.entries(data._doc)) {
				if (Array.isArray(v)) {
					data._doc[k] = v.map((val) => {
						if (val._id) {
							val.id = val._id.toString();
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							const { _id, ...value } = { ...val }._doc;
							return JSON.parse(JSON.stringify(value));
						}
					});
				}
			}
		}
		return data?._doc;
	},

	formatEntries: (entries: any[]) => {
		return entries.map(serverUtils.formatEntry);
	},

	getCurrentUser: async (cookies: Cookies) => {
		const jwt = cookies.get('jwt') as string;
		const session = await AuthService.checkSession(jwt);
		return session?.user;
	}
};

export default serverUtils;
