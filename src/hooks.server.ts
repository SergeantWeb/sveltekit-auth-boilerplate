import type { Handle } from '@sveltejs/kit';
import { DB_STRING, DB_NAME } from '$env/static/private';
import { connect as mongooseConnect } from 'mongoose';
import AuthService from '$lib/server/services/AuthService';
import { redirect } from '@sveltejs/kit';
import * as dotenv from 'dotenv';

dotenv.config();

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ resolve, event }) => {
	mongooseConnect(DB_STRING as string, {
		dbName: DB_NAME
	}).catch((e: any) => {
		console.error('> Database error');
		console.error(e);
	});

	event.locals = {};
	const jwt = event.cookies.get('jwt') as string;
	const session = await AuthService.checkSession(jwt);

	if (session.success && session.user) {
		event.locals.user = session.user;
	}

	if (!event.url.pathname.startsWith('/auth') && !session?.user) {
		throw redirect(302, `/auth/login?redirect_to=${event.url.pathname}`);
	}

	return await resolve(event);
};
