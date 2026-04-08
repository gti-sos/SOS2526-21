<script>
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	// @ts-ignore
	let datos = $state([]);
	let BASE_API = '/api/v1/aids-deaths-stats';
	let result = $state(0);

	let newCountry = $state('');
	let newCodeCountry = $state('');
	let newYear = $state(null);
	let newDeath_count_hiv_aids_under_5 = $state(null);
	let newDeath_count_hiv_aids_70_plus = $state(null);
	let newDeath_count_hiv_aids_5_14 = $state(null);
	let newDeath_count_hiv_aids_15_49 = $state(null);
	let newDeath_count_hiv_aids_50_69 = $state(null);

	let filterCountry = $state('');
	let filterCodeCountry = $state('');
	let filterYear = $state('');
	let filterFrom = $state('');
	let filterTo = $state('');
	let filterUnder5 = $state('');
	let filter70Plus = $state('');
	let filter5_14 = $state('');
	let filter15_49 = $state('');
	let filter50_69 = $state('');

	let estados = {
		'200': 'La operación fue un éxito',
		'201': 'Creado correctamente',
		'409': 'Conflicto en la base de datos, ya existen',
		'405': 'No puedes realizar esa operación',
		'500': 'Error interno en el servidor',
		'404': 'El recurso no existe',
		'400': 'Incompatibilidad en los datos enviados'
	};

	let limit = $state(10);
	let pagina = $state(0);
	let filtro = $state('');

	if (dev) {
		BASE_API = 'http://localhost:3000' + BASE_API;
	}

	async function aplicarFiltro() {
		let offset = limit * pagina
		filtro = `?limit=${limit}&offset=${offset}`;
		if (filterCountry.trim()) filtro += `&country=${filterCountry.trim()}`;
		if (filterCodeCountry.trim()) filtro += `&codecountry=${filterCodeCountry.trim()}`;
		if (filterYear) filtro += `&year=${filterYear}`;
		if (filterFrom) filtro += `&from=${filterFrom}`;
		if (filterTo) filtro += `&to=${filterTo}`;
		if (filterUnder5 !== '') filtro += `&death_count_hiv_aids_under_5=${filterUnder5}`;
		if (filter70Plus !== '') filtro += `&death_count_hiv_aids_70_plus=${filter70Plus}`;
		if (filter5_14 !== '') filtro += `&death_count_hiv_aids_5_14=${filter5_14}`;
		if (filter15_49 !== '') filtro += `&death_count_hiv_aids_15_49=${filter15_49}`;
		if (filter50_69 !== '') filtro += `&death_count_hiv_aids_50_69=${filter50_69}`;
		await getDatos();
	}

	async function limpiarFiltros() {
		filterCountry = '';
		filterCodeCountry = '';
		filterYear = '';
		filterFrom = '';
		filterTo = '';
		filterUnder5 = '';
		filter70Plus = '';
		filter5_14 = '';
		filter15_49 = '';
		filter50_69 = '';
		limit = 10;
		pagina = 0;
		filtro = '';
		await getDatos();
	}

	// @ts-ignore
	async function getDatos() {
		const res = await fetch(BASE_API + filtro, { method: 'GET' });
		const data = await res.json();
		datos = data;
	}

	// @ts-ignore
	async function deleteDato(codecountry, year) {
		if (confirm('¿Estás seguro de que quieres borrar este elemento?')) {
			console.log('DELETE: ' + codecountry + ', ' + year);
			const res = await fetch(BASE_API + `/${codecountry}/${year}`, { method: 'DELETE' });
			result = await res.status;
			if (res.status == 200) await getDatos();
		}
	}

	async function deleteDatos() {
		if (confirm('¿Estás seguro de que quieres borrar toda la base de datos?')) {
			console.log('DELETE ALL');
			const res = await fetch(BASE_API, { method: 'DELETE' });
			result = await res.status;
			if (res.status == 200) await getDatos();
		}
	}

	async function loadInitialData() {
		console.log('LOAD INITIAL DATA');
		const res = await fetch(BASE_API + '/loadInitialData', { method: 'GET' });
		result = await res.status;
		if (res.status == 201) await getDatos();
	}

	async function añadirDato() {
		if (!newCountry.trim() || !newCodeCountry.trim()) { 
			result = 400; return; 
		}
		const campos = [
			newYear, 
			newDeath_count_hiv_aids_under_5, 
			newDeath_count_hiv_aids_70_plus, 
			newDeath_count_hiv_aids_5_14, 
			newDeath_count_hiv_aids_15_49, 
			newDeath_count_hiv_aids_50_69
		];
		if (campos.some((c) => c === null)) {
			result = 400; return; 
		}
		console.log('INSERTE');
		let newDato = {
			country: newCountry, codecountry: newCodeCountry, year: newYear,
			death_count_hiv_aids_under_5: newDeath_count_hiv_aids_under_5,
			death_count_hiv_aids_70_plus: newDeath_count_hiv_aids_70_plus,
			death_count_hiv_aids_5_14: newDeath_count_hiv_aids_5_14,
			death_count_hiv_aids_15_49: newDeath_count_hiv_aids_15_49,
			death_count_hiv_aids_50_69: newDeath_count_hiv_aids_50_69
		};
		const res = await fetch(BASE_API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newDato)
		});
		result = await res.status;
		if (res.status == 201) {
			newCountry = '';
			newCodeCountry = '';
			newYear = null;
			newDeath_count_hiv_aids_under_5 = null;
			newDeath_count_hiv_aids_70_plus = null;
			newDeath_count_hiv_aids_5_14 = null;
			newDeath_count_hiv_aids_15_49 = null;
			newDeath_count_hiv_aids_50_69 = null;
			await getDatos()
		};
	}

	onMount(async () => {
		await getDatos(); 
	});
</script>

<svelte:head>
  <title>AIDs Deaths Stats</title>
</svelte:head>


<div class="page">
	<div class="header">
		<h1>Estadísticas: Muertes por SIDA</h1>
		<button class="btn btn-secondary" onclick={loadInitialData}>⬇ Cargar datos iniciales</button>
	</div>

	<!-- FILTROS -->
	<section class="card">
		<h2 class="section-title">Filtros</h2>
		<div class="filtros-grid">
			<div class="field">
				<label>País</label>
				<input data-testid="filterCountry" type="text" bind:value={filterCountry} placeholder="Ej: Spain" />
			</div>
			<div class="field">
				<label>Código país</label>
				<input data-testid="filterCodeCountry" type="text" bind:value={filterCodeCountry} placeholder="Ej: ESP" />
			</div>
			<div class="field">
				<label>Año exacto</label>
				<input data-testid="filterYear" type="number" bind:value={filterYear} placeholder="Ej: 2000" />
			</div>
			<div class="field">
				<label>Año desde</label>
				<input data-testid="filterFrom" type="number" bind:value={filterFrom} placeholder="Ej: 1990" />
			</div>
			<div class="field">
				<label>Año hasta</label>
				<input data-testid="filterTo" type="number" bind:value={filterTo} placeholder="Ej: 2010" />
			</div>
			<div class="field">
				<label>Muertes &lt;5 años</label>
				<input data-testid="filterUnder5" type="number" bind:value={filterUnder5} min="0" placeholder="Ej: 0"/>
			</div>
			<div class="field">
				<label>Muertes &gt;70 años</label>
				<input data-testid="filter70Plus" type="number" bind:value={filter70Plus} min="0" placeholder="Ej: 0"/>
			</div>
			<div class="field">
				<label>Muertes 5–14 años</label>
				<input data-testid="filter5-14" type="number" bind:value={filter5_14} min="0" placeholder="Ej: 0"/>
			</div>
			<div class="field">
				<label>Muertes 15–49 años</label>
				<input data-testid="filter15-49" type="number" bind:value={filter15_49} min="0" placeholder="Ej: 0"/>
			</div>
			<div class="field">
				<label>Muertes 50–69 años</label>
				<input data-testid="filter50-69" type="number" bind:value={filter50_69} min="0" placeholder="Ej: 0"/>
			</div>
			<div class="field">
				<label>Límite</label>
				<input data-testid="filterLimit" type="number" bind:value={limit} min="1" placeholder="Ej: 10"/>
			</div>
			<div class="field">
				<label>Pagina</label>
				<input data-testid="filterOffset" type="number" bind:value={pagina} min="0" placeholder="Ej: 0"/>
			</div>
		</div>
		<div class="filtros-actions">
			<button class="btn btn-primary" onclick={aplicarFiltro}>🔍 Aplicar filtros</button>
			<button class="btn btn-ghost" onclick={limpiarFiltros}>✕ Limpiar</button>
		</div>
	</section>

	<!-- RESULTADO -->
	{#if result != 0}
		<div class="result-banner" class:success={result == 200 || result == 201} class:error={result >= 400}>
			{estados[result]}
		</div>
	{/if}

	<!-- TABLA -->
	<section class="card table-card">
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th>País</th>
						<th>Código</th>
						<th>Año</th>
						<th>&lt;5 años</th>
						<th>&gt;70 años</th>
						<th>5–14 años</th>
						<th>15–49 años</th>
						<th>50–69 años</th>
						<th colspan="2">Acción</th>
					</tr>
				</thead>
				<tbody>
					{#each datos as dato (dato.codecountry + dato.year)}
						<tr data-testid="dataRow">
							<td>{dato.country}</td>
							<td><span class="badge">{dato.codecountry}</span></td>
							<td>{dato.year}</td>
							<td>{dato.death_count_hiv_aids_under_5}</td>
							<td>{dato.death_count_hiv_aids_70_plus}</td>
							<td>{dato.death_count_hiv_aids_5_14}</td>
							<td>{dato.death_count_hiv_aids_15_49}</td>
							<td>{dato.death_count_hiv_aids_50_69}</td>
							<td>
								<button class="btn-icon danger" 
									onclick={() => 
										deleteDato(dato.codecountry, dato.year)
									}
								>Borrar 🗑</button>
							</td>
							<td>
								<a class="btn-icon" href="/aids-deaths-stats/{dato.codecountry}/{dato.year}"> Editar ✏️</a>
							</td>
						</tr>
					{/each}
					<!-- FILA AÑADIR -->
					<tr class="add-row">
						<td><input data-testid="paisInput" type="text" bind:value={newCountry} placeholder="País" /></td>
						<td><input data-testid="codigoPaisInput" type="text" bind:value={newCodeCountry} placeholder="Código" /></td>
						<td><input data-testid="añoInput" type="number" bind:value={newYear} placeholder="Año" min="1900" /></td>
						<td><input data-testid="under5Input" type="number" bind:value={newDeath_count_hiv_aids_under_5} placeholder="0" min="0" /></td>
						<td><input data-testid="plus70Input" type="number" bind:value={newDeath_count_hiv_aids_70_plus} placeholder="0" min="0" /></td>
						<td><input data-testid="5-14Input" type="number" bind:value={newDeath_count_hiv_aids_5_14} placeholder="0" min="0" /></td>
						<td><input data-testid="15-49Input" type="number" bind:value={newDeath_count_hiv_aids_15_49} placeholder="0" min="0" /></td>
						<td><input data-testid="50-69Input" type="number" bind:value={newDeath_count_hiv_aids_50_69} placeholder="0" min="0" /></td>
						<td colspan="2"><button class="btn btn-primary" onclick={añadirDato}>+ Añadir</button></td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<div class="bottom-actions">
		<button class="btn btn-danger" onclick={deleteDatos}>🗑 Eliminar todo</button>
	</div>
</div>

<style>
	/* ── Variables ── */
	:global(body) {
		margin: 0;
		background: #f7f6f3;
		font-family: 'Segoe UI', system-ui, sans-serif;
		color: #1a1a2e;
	}

	.page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* ── Header ── */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	h1 {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		color: #1a1a2e;
	}

	/* ── Cards ── */
	.card {
		background: #fff;
		border-radius: 10px;
		border: 1px solid #e2e8f0;
		padding: 1rem 1.25rem;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
	}

	.section-title {
		margin: 0 0 0.75rem;
		font-size: 0.95rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #64748b;
	}

	/* ── Filtros ── */
	.filtros-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.6rem;
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
		padding: 0.35rem 0.5rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 0.82rem;
		background: #f8fafc;
		transition: border-color 0.15s;
		width: 100%;
		box-sizing: border-box;
	}

	.field input:focus {
		outline: none;
		border-color: #3b82f6;
		background: #fff;
	}

	.filtros-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	/* ── Tabla ── */
	.table-card {
		padding: 0;
		overflow: hidden;
	}

	.table-wrapper {
		overflow-x: auto;
		width: 100%;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
		white-space: nowrap;
	}

	thead tr {
		background: #f1f5f9;
		border-bottom: 2px solid #e2e8f0;
	}

	th {
		padding: 0.6rem 0.75rem;
		text-align: left;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #64748b;
	}

	tbody tr {
		border-bottom: 1px solid #f1f5f9;
		transition: background 0.1s;
	}

	tbody tr:hover {
		background: #f8fafc;
	}

	td {
		padding: 0.45rem 0.75rem;
		color: #334155;
	}

	.add-row td {
		background: #fafafa;
		padding: 0.4rem 0.5rem;
	}

	.add-row input {
		width: 100%;
		padding: 0.3rem 0.4rem;
		border: 1px solid #cbd5e1;
		border-radius: 5px;
		font-size: 0.8rem;
		box-sizing: border-box;
		background: #fff;
	}

	/* ── Badge ── */
	.badge {
		background: #e0f2fe;
		color: #0369a1;
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	/* ── Botones ── */
	.btn {
		padding: 0.4rem 0.9rem;
		border: none;
		border-radius: 6px;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s, transform 0.1s;
	}

	.btn:active { transform: scale(0.97); }

	.btn-primary  { background: #3b82f6; color: #fff; }
	.btn-primary:hover { background: #2563eb; }

	.btn-secondary { background: #e2e8f0; color: #334155; }
	.btn-secondary:hover { background: #cbd5e1; }

	.btn-ghost { background: transparent; color: #64748b; border: 1px solid #cbd5e1; }
	.btn-ghost:hover { background: #f1f5f9; }

	.btn-danger { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
	.btn-danger:hover { background: #fca5a5; }

	.btn-icon {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		padding: 0.2rem 0.3rem;
		border-radius: 4px;
		transition: background 0.1s;
		text-decoration: none;
	}

	.btn-icon:hover { background: #f1f5f9; }
	.btn-icon.danger:hover { background: #fee2e2; }

	/* ── Result banner ── */
	.result-banner {
		padding: 0.6rem 1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.result-banner.success { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
	.result-banner.error   { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }

	/* ── Bottom ── */
	.bottom-actions {
		display: flex;
		justify-content: flex-end;
	}
</style>