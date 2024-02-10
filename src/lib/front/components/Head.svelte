<script lang="ts">
	import { page } from '$app/stores';
	import config from '$lib/config';

	export let title: string | null = null;
	export let description: string | null = null;
	export let image = `${$page.url.origin}/banner.jpg`;
	export let logo = `${$page.url.origin}/logo.png`;
	export let themeColor = '#000000';

	export let author: string | null = null;
	export let publisher: string | null = null;
	export let twitterSite: string | null = null;
	export let twitterCreator: string | null = null;

	$: pageTitle = (title ? `${title} | ` : '') + config.siteTitle;
</script>

<svelte:head>
	<title>{pageTitle}</title>

	<meta itemprop="name" content={title} />
	<meta itemprop="image" content={image} />
	<meta name="description" itemprop="description" content={description} />

	<link rel="canonical" href={$page.url.origin + $page.url.pathname} />

	<meta property="og:url" content="{$page.url.origin}{$page.url.pathname}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content="{title} banner" />
	<meta property="og:description" content={description} />

	<meta name="twitter:card" content="summary" />
	{#if twitterSite}
		<meta name="twitter:site" content={twitterSite} />
	{/if}
	{#if twitterCreator}
		<meta name="twitter:creator" content={twitterCreator} />
	{/if}
	<meta name="twitter:url" content="{$page.url.origin}{$page.url.pathname}" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description?.slice(0, 200)} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content="{title} banner" />

	{#if author}
		<link rel="author" href={author} />
	{/if}
	{#if publisher}
		<link rel="publisher" href={publisher} />
	{/if}
	<meta itemprop="name" content={title} />
	<meta itemprop="description" content={description?.slice(0, 200)} />
	<meta itemprop="image" content={image} />

	<link rel="apple-touch-icon" href={logo} />
	<meta name="apple-mobile-web-app-title" content={title} />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />

	<meta name="theme-color" content={themeColor} />
	<meta name="mobile-web-app-capable" content="yes" />
</svelte:head>
