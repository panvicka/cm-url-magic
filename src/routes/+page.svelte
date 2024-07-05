<script lang="ts">
	import UserInputField from '$lib/components/UserInputField.svelte';
	import { type userInfoType, type Link } from '$lib/types';
	import {
		evaluateEnvironment,
		evaluateLanguage,
		evaluateTicketNumber,
		evaluatePath
	} from '$lib/helpers/inputEvaluationHelpers';
	import { copy } from 'svelte-copy';

	import { linkCreator } from '$lib/helpers/linkCreator';
	import { isLinkWorking } from '$lib/helpers/isLinkWorking';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { queryParam } from 'sveltekit-search-params';
	import { onMount } from 'svelte';

	const mainInputUrlParam = queryParam('mainInput');
	const optionalInputUrlParam = queryParam('secondaryInput');

	let links: Link[] = [];

	let userInfo: userInfoType = {};

	$: mainUserInput = $mainInputUrlParam;
	$: optionalUserInput = $optionalInputUrlParam;

	$: {
		mainUserInput = $mainInputUrlParam;
		evaluateInput();
	}
	$: {
		optionalUserInput = $optionalInputUrlParam;
		evaluateInput();
	}

	onMount(() => {
		if (mainInputUrlParam) {
			mainUserInput = $mainInputUrlParam || '';
		} else {
			mainUserInput = '';
		}
		if (optionalInputUrlParam) {
			optionalUserInput = $optionalInputUrlParam || '';
		} else {
			optionalUserInput = '';
		}
		if ($mainInputUrlParam || $optionalInputUrlParam) {
			evaluateInput();
		}
	});

	const evaluateOptionalTicketIdentification = (userInputValue: string) => {
		userInfo.optionalTicketNumber = evaluateTicketNumber(userInputValue);
	};

	function evaluateInput() {
		mainUserInput = mainUserInput?.trim() || '';
		optionalUserInput = optionalUserInput?.trim() || '';

		if (mainUserInput) {
			$mainInputUrlParam = mainUserInput;
		}
		if (optionalUserInput) {
			$optionalInputUrlParam = optionalUserInput;
		}

		userInfo = {
			environment: undefined,
			ticketNumber: '',
			subdomain: '',
			secondLevelDomain: '',
			language: '',
			path: ''
		};

		userInfo.environment = evaluateEnvironment(mainUserInput);
		userInfo.ticketNumber = evaluateTicketNumber(mainUserInput);
		userInfo.language = evaluateLanguage(mainUserInput);
		userInfo.path = evaluatePath(mainUserInput, userInfo.environment, userInfo.language);
		userInfo.optionalTicketNumber = evaluateTicketNumber(optionalUserInput);

		links = linkCreator(userInfo);
	}
</script>

<Header />
<main class="container">
	<form>
		<fieldset>
			<UserInputField
				bind:value={$mainInputUrlParam}
				on:change={({ detail }) => {
					mainUserInput = detail.value;
					evaluateInput();
				}}
				label="Paste your KSB related link or ticket number here..."
			/>
		</fieldset>
		<fieldset>
			<UserInputField
				bind:value={$optionalInputUrlParam}
				on:change={({ detail }) => {
					optionalUserInput = detail.value;
					evaluateOptionalTicketIdentification(optionalUserInput);
					evaluateInput();
				}}
				label="Optional ticket number if needed..."
			/>
		</fieldset>
	</form>

	{#each links as link}
		<div class="grid">
			<a href={link.href} target="_blank">{link.name}</a>
			<small><a href={link.href} target="_blank">{link.href}</a></small>
			{#await isLinkWorking(link.href)}
				<span aria-busy="true">Checking link</span>
			{:then isWorking}
				{#if isWorking}
					<button
						class="copy-to-clip-button"
						data-tooltip="Copy to clipboard"
						data-placement="right"
						use:copy={link.href}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
							/>
						</svg>
					</button>
				{:else}
					Link not active
				{/if}
			{/await}
		</div>
		<hr />
	{/each}
</main>

<Footer />

<style>
	button {
		padding: 0;
		width: 2rem;
		height: 2rem;
		background-color: transparent;
		border: none;
		margin-left: 2em;
	}

	svg:hover {
		cursor: pointer;
		color: rgb(1, 170, 255);
	}

	.container {
		padding: 2em 0;
	}

	.grid {
		align-items: center;
	}
</style>
