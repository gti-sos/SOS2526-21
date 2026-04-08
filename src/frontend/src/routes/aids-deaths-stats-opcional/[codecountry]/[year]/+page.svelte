<script>
	import { page } from '$app/state';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	let codecountry = page.params.codecountry;
	let year = page.params.year;

	let newCountry = $state('');
	let newCodeCountry = $state('');
	let newYear = $state(0);
	let newDeath_count_hiv_aids_under_5 = $state(0);
	let newDeath_count_hiv_aids_70_plus = $state(0);
	let newDeath_count_hiv_aids_5_14 = $state(0);
	let newDeath_count_hiv_aids_15_49 = $state(0);
	let newDeath_count_hiv_aids_50_69 = $state(0);

	let result = $state(0);

	let token = '';

	let estados = {
		'200': 'La operación fue un éxito',
		'201': 'Creado correctamente',
		'409': 'Conflicto en la base de datos, ya existen',
		'405': 'No puedes realizar esa operación',
		'500': 'Error interno en el servidor',
		'404': 'El recurso no existe',
		'400': 'Incompatibilidad en los datos enviados',
		'401': 'No autorizado, inicia sesion'
	};

	let BASE_API = '/api/v2/aids-deaths-stats';
	if (dev) {
		BASE_API = 'http://localhost:3000' + BASE_API;
	}

	async function getDatos() {
		const res = await fetch(BASE_API + `/${codecountry}/${year}`, { method: 'GET' });
		const data = await res.json();
		newCountry = data.country;
		newCodeCountry = data.codecountry;
		newYear = data.year;
		newDeath_count_hiv_aids_under_5 = data.death_count_hiv_aids_under_5;
		newDeath_count_hiv_aids_70_plus = data.death_count_hiv_aids_70_plus;
		newDeath_count_hiv_aids_5_14 = data.death_count_hiv_aids_5_14;
		newDeath_count_hiv_aids_15_49 = data.death_count_hiv_aids_15_49;
		newDeath_count_hiv_aids_50_69 = data.death_count_hiv_aids_50_69;
	}

	async function editarDato() {
		const campos = [
			newDeath_count_hiv_aids_under_5,
			newDeath_count_hiv_aids_70_plus,
			newDeath_count_hiv_aids_5_14,
			newDeath_count_hiv_aids_15_49,
			newDeath_count_hiv_aids_50_69
		];
		if (campos.some((c) => c === null)) {
			result = 400;
			return;
		}
		console.log('EDITAR');
		let newDato = {
			country: newCountry,
			codecountry: newCodeCountry,
			year: newYear,
			death_count_hiv_aids_under_5: newDeath_count_hiv_aids_under_5,
			death_count_hiv_aids_70_plus: newDeath_count_hiv_aids_70_plus,
			death_count_hiv_aids_5_14: newDeath_count_hiv_aids_5_14,
			death_count_hiv_aids_15_49: newDeath_count_hiv_aids_15_49,
			death_count_hiv_aids_50_69: newDeath_count_hiv_aids_50_69
		};
		const res = await fetch(BASE_API + `/${codecountry}/${year}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
			body: JSON.stringify(newDato)
		});
		result = await res.status;
		if (res.status == 200) await getDatos();
	}

	onMount(async () => {
		token = localStorage.getItem('token') ?? '';
		await getDatos();
	});
</script>

<div class="page">
	<div class="header">
		<div class="header-left">
			<a href="/aids-deaths-stats-opcional" class="back-link">← Volver</a>
			<h1>Editar Registro</h1>
		</div>
		<div class="header-meta">
			<span class="badge">{codecountry}</span>
			<span class="year-tag">{year}</span>
		</div>
	</div>

	{#if result != 0}
		<div class="result-banner" class:success={result == 200 || result == 201} class:error={result >= 400}>
			{estados[result]}
		</div>
	{/if}

	<section class="card">
		<h2 class="section-title">Datos del registro</h2>

		<div class="form-grid">
			<div class="field">
				<label>País</label>
				<input type="text" readonly bind:value={newCountry} />
			</div>
			<div class="field">
				<label>Código País</label>
				<input type="text" readonly bind:value={newCodeCountry} />
			</div>
			<div class="field">
				<label>Año</label>
				<input type="number" readonly bind:value={newYear} />
			</div>
		</div>

		<h2 class="section-title" style="margin-top: 1.25rem;">Muertes por franja de edad</h2>

		<div class="form-grid">
			<div class="field">
				<label>Menores de 5 años</label>
				<input data-testid="under5Input" type="number" bind:value={newDeath_count_hiv_aids_under_5} min="0" />
			</div>
			<div class="field">
				<label>Entre 5 y 14 años</label>
				<input data-testid="5-14Input" type="number" bind:value={newDeath_count_hiv_aids_5_14} min="0" />
			</div>
			<div class="field">
				<label>Entre 15 y 49 años</label>
				<input data-testid="15-49Input" type="number" bind:value={newDeath_count_hiv_aids_15_49} min="0" />
			</div>
			<div class="field">
				<label>Entre 50 y 69 años</label>
				<input data-testid="50-69Input" type="number" bind:value={newDeath_count_hiv_aids_50_69} min="0" />
			</div>
			<div class="field">
				<label>Mayores de 70 años</label>
				<input data-testid="plus70Input" type="number" bind:value={newDeath_count_hiv_aids_70_plus} min="0" />
			</div>
		</div>

		<div class="form-actions">
			<button class="btn btn-primary" onclick={editarDato}>✏️ Guardar cambios</button>
			<a href="/aids-deaths-stats-opcional" class="btn btn-ghost">✕ Cancelar</a>
		</div>
	</section>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #f7f6f3;
		font-family: 'Segoe UI', system-ui, sans-serif;
		color: #1a1a2e;
	}

	.page {
		max-width: 800px;
		margin: 0 auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.back-link {
		font-size: 0.85rem;
		color: #3b82f6;
		text-decoration: none;
		font-weight: 600;
	}

	.back-link:hover { text-decoration: underline; }

	h1 {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		color: #1a1a2e;
	}

	.header-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.badge {
		background: #e0f2fe;
		color: #0369a1;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.year-tag {
		background: #f1f5f9;
		color: #475569;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 600;
		border: 1px solid #e2e8f0;
	}

	.card {
		background: #fff;
		border-radius: 10px;
		border: 1px solid #e2e8f0;
		padding: 1.25rem;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
	}

	.section-title {
		margin: 0 0 0.75rem;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #64748b;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 0.75rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.field label {
		font-size: 0.72rem;
		font-weight: 600;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.field input {
		padding: 0.4rem 0.55rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 0.85rem;
		background: #f8fafc;
		transition: border-color 0.15s;
		box-sizing: border-box;
		width: 100%;
	}

	.field input:focus {
		outline: none;
		border-color: #3b82f6;
		background: #fff;
	}

	.field input[readonly] {
		background: #f1f5f9;
		color: #94a3b8;
		cursor: not-allowed;
	}

	.form-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1.25rem;
	}

	.btn {
		padding: 0.45rem 1rem;
		border: none;
		border-radius: 6px;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s, transform 0.1s;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.btn:active { transform: scale(0.97); }

	.btn-primary { background: #3b82f6; color: #fff; }
	.btn-primary:hover { background: #2563eb; }

	.btn-ghost { background: transparent; color: #64748b; border: 1px solid #cbd5e1; }
	.btn-ghost:hover { background: #f1f5f9; }

	.result-banner {
		padding: 0.6rem 1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.result-banner.success { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
	.result-banner.error   { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
</style>