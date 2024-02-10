<script lang="ts">
	import Head from '$lib/front/components/Head.svelte';
	import FormField from '$lib/front/components/form/FormField.svelte';
	import Alert from '$lib/front/components/Alert.svelte';

	export let form;
	export let data;

	$: formAction = data?.code ? '?/resetPassword&code=' + data.code : '?/sendResetLink';
</script>

<Head title="Password recovery" />

<form action={formAction} method="post" class="flex flex-col gap-2">
	<div class="text-lg font-bold text-center">Reset your password</div>
	<Alert
		closed={!form?.errors?.error && !data?.errors?.error}
		title="Error :"
		description={data?.errors?.error ? data.errors?.error : form?.errors?.error}
		color="error"
		dismissible
	/>

	{#if data?.code}
		<FormField
			type="password"
			name="password"
			error={form?.errors?.password}
			label="Your new password"
			required
		/>
		<FormField
			type="password"
			name="confirmation"
			error={form?.errors?.confirmation}
			label="Confirm the password"
			required
		/>
		<FormField type="hidden" name="code" value={data.code} />
		<FormField type="submit" value="Reset your password" class="btn btn-primary" />
	{:else}
		<Alert
			closed={!form?.errors?.error}
			title="Error :"
			description={form?.errors?.error}
			color="error"
			dismissible
		/>
		<Alert
			closed={!form?.sent}
			title="Email sent !"
			description="A reset link was sent to your email address"
			bordered={false}
			color="success"
			dismissible
		/>

		<div class="px-1">Enter your email address to receive a password reset link</div>
		<FormField name="email" error={form?.errors?.email} label="You email address" required />
		<FormField type="submit" value="Send reset link" class="btn btn-primary" />
	{/if}
</form>
