<script lang="ts">
	export let label: string | null = null;
	export let labelAlt: string | null = null;
	export let description: string | null = null;
	export let descriptionAlt: string | null = null;
	export let error: string | null = null;
	export let formControlClass: string = '';
</script>

<div class="form-control flex-1 {formControlClass}">
	{#if label || labelAlt}
		<label for="form-field" class="label py-0.5">
			{#if label}
				<span class="label-text">{label}</span>
			{/if}
			{#if labelAlt}
				<span class="label-text">{labelAlt}</span>
			{/if}
		</label>
	{/if}
	<input
		id="form-field"
		type={$$props.type ? $$props.type : 'text'}
		class="input input-bordered{error ? ' input-error' : ''}"
		on:input={() => (error = null)}
		{...$$restProps}
	/>
	{#if description || descriptionAlt}
		<label for="form-field" class="label py-0.5">
			{#if description}
				<span class="label-text">{description}</span>
			{/if}
			{#if descriptionAlt}
				<span class="label-text">{descriptionAlt}</span>
			{/if}
		</label>
	{/if}
	{#if error}
		<label for="form-field" class="label flex-col items-start w-full py-0.5">
			{#each error.split(', ') as err}
				<span class="label-text text-error w-full first-letter:capitalize">{err}</span>
			{/each}
		</label>
	{/if}
</div>
