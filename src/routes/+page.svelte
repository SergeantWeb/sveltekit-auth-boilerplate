<div class="wrapper">
	<h1 class="text-xl font-bold">Welcome to Sveltekit Auth Boilerplate</h1>
	<ul class="list-disc">
		<li>
			<a href="/auth/login">Login page</a>
		</li>
		<li>
			<a href="/auth/register">Register page</a>
		</li>
		<li>
			<a href="/auth/reset-password">Reset password</a>
		</li>
		<li>
			<a href="/auth/logout">Logout</a>
		</li>
	</ul>
</div>

<style lang="postcss">
	.wrapper {
		@apply flex flex-col items-center gap-4
			p-4 m-auto rounded-lg bg-base-300;
	}
	ul > li:hover > a {
		@apply link;
	}
</style>
