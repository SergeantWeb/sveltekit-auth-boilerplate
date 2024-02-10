<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { fade } from 'svelte/transition';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import CheckCircle from 'virtual:icons/ri/checkbox-circle-line';
	import Close from 'virtual:icons/ri/close-line';
	import CloseCircle from 'virtual:icons/ri/close-circle-line';
	import ErrorWarning from 'virtual:icons/ri/error-warning-line';
	import Information from 'virtual:icons/ri/information-line';

	let className = '';
	export { className as class };

	export let title = '';
	export let color = 'default';
	export let bordered = true;
	export let description: string | typeof SvelteComponent | null = null;
	export let icon: typeof SvelteComponent | null | false = null;
	export let dismissible = false;
	export let closed = false;

	const defaultClasses = 'border-base-content text-base-content';

	let classes = '';
	$: classes = [
		...(color && !bordered
			? [
					color === 'info' && 'alert-info',
					color === 'warning' && 'alert-warning',
					color === 'error' && 'alert-error',
					color === 'success' && 'alert-success'
				]
			: []),
		...(color && bordered
			? [
					color === 'info' && 'border-info text-info',
					color === 'warning' && 'border-warning text-warning',
					color === 'error' && 'border-error text-error',
					color === 'success' && 'border-success text-success'
				]
			: []),
		bordered && 'bordered'
	]
		.filter(Boolean)
		.join(' ');

	const onClick = () => {
		dispatch('click');
	};

	const onClose = (e: any) => {
		closed = true;
		dispatch('close', e);
	};
</script>

{#if closed === false}
	<div
		class="alert {classes ? classes : defaultClasses} {className}"
		on:click|preventDefault={onClick}
		on:keypress|preventDefault={(event) => {
			if (['Enter', 'Space'].includes(event.code)) onClick();
		}}
		tabindex="0"
		role="link"
		transition:fade={{ duration: 200 }}
		{...$$restProps}
	>
		<div class="flex items-center gap-2">
			<span class="text-xl">
				{#if icon !== false}
					{#if icon !== null}
						<svelte:component this={icon} />
					{:else if color === 'success'}
						<CheckCircle />
					{:else if color === 'error'}
						<CloseCircle />
					{:else if color === 'warning'}
						<ErrorWarning />
					{:else}
						<Information />
					{/if}
				{/if}
			</span>
			<div>
				<span>{title}</span>
				<div class="description text-sm font-medium">
					{#if typeof description === 'string'}
						{description}
					{:else}
						<svelte:component this={description} />
					{/if}
				</div>
			</div>
		</div>
		<slot />
		<div class="flex-none flex items-center gap-2 ml-auto">
			{#if dismissible}
				<button on:click={onClose}><Close /></button>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	.alert {
		@apply flex items-center justify-start gap-2 py-2 px-3 text-left leading-tight font-bold;
	}
	.alert.bordered {
		@apply bg-transparent border-2;
	}
	.description:empty {
		display: none;
	}
</style>
