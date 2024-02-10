<script lang="ts">
	import Alert from '$lib/front/components/Alert.svelte';
	import Head from '$lib/front/components/Head.svelte';

	export let data;
</script>

<Head title="Account activation" />

<div class="flex flex-col gap-2 w-full">
	<Alert closed={!data?.error} title="Error :" description={data?.error} color="error" />
	<Alert
		closed={!!data?.error}
		title="Account activated !"
		description="Your account is activated, you can now login to your account"
		bordered={false}
		color="success"
	/>
	<a href="/auth/login" class="btn btn-primary">Login</a>
</div>
