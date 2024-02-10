import type { Writable } from 'svelte/store';
import type { User } from '$lib/server/models/UserModel'
import { writable } from 'svelte/store';

export const user: Writable<User | null> = writable(null);