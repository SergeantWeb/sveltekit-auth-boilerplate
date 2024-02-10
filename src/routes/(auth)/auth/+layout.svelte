<script lang="ts">
	import config from '$lib/config';
	import Logo from '$lib/front/components/Logo.svelte';

	export let form;
</script>

<div class="flex flex-col items-center gap-4 py-8 px-2 m-auto">
	<a href="/" class="flex flex-col items-center">
		<Logo />
		<div class="text-xl font-bold text-center">{config.siteTitle}</div>
	</a>
	<div class="flex flex-col gap-4 p-4 sm:w-[500px] max-w-full rounded-lg bg-base-200">
		{#if form?.error}
			<div class="alert alert-error">Error: {form?.error}</div>
		{/if}
		<slot />
	</div>
</div>
