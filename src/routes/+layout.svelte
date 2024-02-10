<script lang="ts">
	import '../app.css';
	import {user} from "$lib/front/stores";

	export let data;
	$: $user = data?.user;
</script>

<div class="flex flex-col min-h-screen w-full" data-theme="light">
	<slot />
</div>
