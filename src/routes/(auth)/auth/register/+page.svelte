<script lang="ts">
	import { PUBLIC_ALLOW_REGISTRATION } from '$env/static/public';
	import {page} from "$app/stores";
	import FormField from '$lib/front/components/form/FormField.svelte';
	import Head from '$lib/front/components/Head.svelte';
	import Alert from '$lib/front/components/Alert.svelte';

	export let form;
</script>

<Head title="Register" />

<form method="post" class="flex flex-col gap-2">
	<div class="text-xl font-bold text-center">Register</div>

	{#if ['0', 'false'].includes(PUBLIC_ALLOW_REGISTRATION)}
		<div class="text-lg font-medium text-center my-4">New account registration is disabled</div>
		<div class="flex items-center gap-2">
			<a href="/" class="flex-1 btn btn-neutral">Back to homepage</a>
			<a href="/auth/login" class="flex-1 btn btn-primary">Login</a>
		</div>
	{:else}
		<Alert
				closed={!form?.errors?.error}
				title="Error :"
				description={form?.errors?.error}
				color="error"
				dismissible
		/>

		<FormField
				label="Email"
				name="email"
				type="email"
				value={form?.data?.email ?? null}
				error={form?.errors?.email}
				required
		/>
		<FormField
				label="Username"
				name="username"
				value={form?.data?.username ?? null}
				error={form?.errors?.username}
				required
		/>
		<div class="flex flex-wrap items-start gap-2">
			<FormField
					label="Password"
					name="password"
					type="password"
					error={form?.errors?.password}
					required
			/>
			<FormField
					label="Password confirmation"
					name="confirmation"
					type="password"
					error={form?.errors?.confirmation}
					required
			/>
		</div>

		<div class="flex items-center mt-2">
			<input
					name="terms"
					type="checkbox"
					class="checkbox bg-base-100 {form?.errors?.terms ? 'checkbox-error' : ''}"
					on:click={() => {
					if (form) {
						form.errors.terms = null;
					}
				}}
					required
			/>
			<div class="ml-2 text-sm select-none">
				I agree to the <a target="_blank" href="/terms" class="font-medium hover:link"
			>Terms of Service</a
			>
				and
				<a target="_blank" href="/privacy-policy" class="font-medium hover:link">Privacy Policy</a>
			</div>
		</div>
		{#if form?.errors?.terms}
			<div class="text-error">{form?.errors?.terms}</div>
		{/if}

		{#if $page.url.searchParams.get('redirect_to')}
			<input type="hidden" name="redirect_to" value={$page.url.searchParams.get('redirect_to')} />
		{/if}

		<input type="submit" value="Register" class="btn btn-primary text-lg my-2 px-12" />

		<div class="flex flex-wrap items-center justify-center gap-4 w-full">
			<a href="/auth/login" class="hover:link">Already registered ?</a>
		</div>
	{/if}
</form>
