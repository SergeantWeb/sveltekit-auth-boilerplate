// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User } from '$lib/server/models/UserModel';

declare global {
	namespace App {
		interface Locals {
			user?: Partial<User>;
		}
	}

	/* Unplugin-icons */
	declare module 'virtual:icons/*' {
		export { SvelteComponentDev as default } from 'svelte/internal';
	}
	/// <reference types="@sveltejs/kit" />
	/// <reference types="unplugin-icons/types/svelte" />
}

export {};
