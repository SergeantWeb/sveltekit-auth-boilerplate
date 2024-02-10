<script lang="ts">
	import { PUBLIC_ALLOW_REGISTRATION, PUBLIC_ALLOW_PASSWORD_RESET } from '$env/static/public';
	import { page } from '$app/stores';
	import FormField from '$lib/front/components/form/FormField.svelte';
	import Head from '$lib/front/components/Head.svelte';
	import Alert from '$lib/front/components/Alert.svelte';

	export let form;

	let message: { title?: string; description?: string } | null = null;
	$: if ($page.url.searchParams.get('message') !== null) {
		switch ($page.url.searchParams.get('message')) {
			case 'activate-account':
				message = {
					title: 'Activate your account',
					description:
						'An activation link was sent to your email address. Please check your inbox, including spam folder.'
				};
				break;
			case 'reset-success':
				message = {
					title: 'Password reset',
					description: 'Your password was successfully reset, you can now login.'
				};
				break;
		}
	}
</script>

<Head title="Login" />

<form method="post" class="flex flex-col gap-2 w-full">
	<div class="text-xl font-bold text-center">Login</div>

	<Alert
		closed={!form?.errors?.error}
		title="Error :"
		description={form?.errors?.error}
		color="error"
		dismissible
	/>

	<Alert
		closed={message === null}
		title={message?.title}
		description={message?.description}
		bordered={false}
		color="success"
		dismissible
	/>

	<FormField
		label="Username or Email"
		name="username"
		value={form?.data?.username ?? null}
		error={form?.errors?.username}
		required
	/>
	<FormField
		label="Password"
		name="password"
		type="password"
		error={form?.errors?.password}
		required
	/>

	{#if $page.url.searchParams.get('redirect_to')}
		<input type="hidden" name="redirect_to" value={$page.url.searchParams.get('redirect_to')} />
	{/if}

	<input type="submit" value="Login" class="btn btn-primary text-lg my-2 px-12" />

	<div class="flex flex-wrap items-center justify-between px-1 gap-4 w-full">
		{#if !['0', 'false'].includes(PUBLIC_ALLOW_REGISTRATION)}
			<a href="/auth/register" class="hover:link">No account yet ?</a>
		{/if}
		{#if !['0', 'false'].includes(PUBLIC_ALLOW_PASSWORD_RESET)}
			<a href="/auth/reset-password" class="hover:link">Forgot your password ?</a>
		{/if}
	</div>
</form>
