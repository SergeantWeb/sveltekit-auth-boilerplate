import type { Handle } from '@sveltejs/kit';
import { DB_STRING, DB_NAME } from '$env/static/private';
import { connect as mongooseConnect } from 'mongoose';
import * as dotenv from 'dotenv';
import serverUtils from "$lib/server/serverUtils";

dotenv.config();

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ resolve, event }) => {
	mongooseConnect(DB_STRING as string, {
		dbName: DB_NAME
	}).catch((e: any) => {
		console.error('> Database error');
		console.error(e);
	});

	event.locals = {
		user: await serverUtils.getCurrentUser(event.cookies)
	};

	return await resolve(event);
};
