<script>
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	// @ts-ignore
	let datos = $state([]);
	let BASE_API = '/api/v1/aids-deaths-stats';
	let result = $state(0);

	let newCountry = $state('paísEjemplo');
	let newCodeCountry = $state('codigoPaísEjemplo');
	let newYear = $state(1111);
	let newDeath_count_hiv_aids_under_5 = $state(0);
	let newDeath_count_hiv_aids_70_plus = $state(0);
	let newDeath_count_hiv_aids_5_14 = $state(0);
	let newDeath_count_hiv_aids_15_49 = $state(0);
	let newDeath_count_hiv_aids_50_69 = $state(0);

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


	let estados={
        "200": "La operación fue un éxito",
        "201": "Creado correctamente",
        "409": "Conflicto en la base de datos, ya existen",
        "405": "No puedes realizar esa operación",
        "500": "Error interno en el servidor",
        "404": "El recurso no existe",
        "400": "Incompatibilidad en los datos enviados"
    }

	let limit = $state(10);
	let offset = $state(0);

	let filtro = $state("");
	


	if (dev) {
		BASE_API = 'http://localhost:3000' + BASE_API;
	}
	
	function aplicarFiltro() {
    	filtro = `?limit=${limit}&offset=${offset}`
		if (filterCountry.trim())     filtro += `&country=${filterCountry.trim()}`;
		if (filterCodeCountry.trim()) filtro += `&codecountry=${filterCodeCountry.trim()}`;
		if (filterYear)               filtro += `&year=${filterYear}`;
		if (filterFrom)               filtro += `&from=${filterFrom}`;
		if (filterTo)                 filtro += `&to=${filterTo}`;
		if (filterUnder5 !== '')      filtro += `&death_count_hiv_aids_under_5=${filterUnder5}`;
		if (filter70Plus !== '')      filtro += `&death_count_hiv_aids_70_plus=${filter70Plus}`;
		if (filter5_14 !== '')        filtro += `&death_count_hiv_aids_5_14=${filter5_14}`;
		if (filter15_49 !== '')       filtro += `&death_count_hiv_aids_15_49=${filter15_49}`;
		if (filter50_69 !== '')       filtro += `&death_count_hiv_aids_50_69=${filter50_69}`;
    	getDatos();
	}
	
	function limpiarFiltros() {
		filterCountry = ''; filterCodeCountry = ''; filterYear = '';
		filterFrom = ''; filterTo = '';
		filterUnder5 = ''; filter70Plus = ''; filter5_14 = ''; filter15_49 = ''; filter50_69 = '';
		limit = 10; offset = 0; filtro = '';
		getDatos();
	}

	// @ts-ignore
	async function getDatos() {
		const res = await fetch(BASE_API+filtro, {
			method: 'GET'
		});
		const data = await res.json();
		datos = data;
	}
	// @ts-ignore
	async function deleteContact(codecountry, year) {
		if (confirm('¿Estás seguro de que quieres borrar este elemento?')) {
			console.log('DELETE: ' + codecountry + ', ' + year);
			const res = await fetch(BASE_API + `/${codecountry}/${year}`, {
				method: 'DELETE'
			});
			result = await res.status;
			if (res.status == 200) {
				getDatos();
			}
		}
	}
	async function deleteContacts() {
		if (confirm('¿Estás seguro de que quieres borrar toda la base de datos?')) {
			console.log('DELETE ALL');
			const res = await fetch(BASE_API, {
				method: 'DELETE'
			});
			result = await res.status;
			if (res.status == 200) {
				getDatos();
			}
		}
	}

	async function loadInitialData() {
		console.log('LOAD INITIAL DATA');
			const res = await fetch(BASE_API + "/loadInitialData", {
				method: 'GET'
			});
			result = await res.status;
			if (res.status == 201) {
				getDatos();
			}
	}

	async function añadirContact() {
		if (!newCountry.trim() || !newCodeCountry.trim()) {
			result = 400
			return;
		}

		const campos = [
			newYear,
			newDeath_count_hiv_aids_under_5,
			newDeath_count_hiv_aids_70_plus,
			newDeath_count_hiv_aids_5_14,
			newDeath_count_hiv_aids_15_49,
			newDeath_count_hiv_aids_50_69
		];

		if (campos.some(c => c === null)) {
			result = 400
			return;
		}

		console.log('INSERTE');
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
		const res = await fetch(BASE_API, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newDato)
		});
		result = await res.status;
		if (res.status == 201) {
			getDatos();
		}
	}

	onMount(async () => {
		getDatos();
	});
</script>

<h1>aids-deaths-stats</h1>

<button onclick={loadInitialData}>CARGAR DATOS INICIALES</button>
<table>
	<thead>
		<tr>
			<th>País</th>
			<th>Codigo del País</th>
			<th>Año</th>
			<th>Menores de 5 años</th>
			<th>Mayores de 70 años</th>
			<th>Entre 5 y 14 años</th>
			<th>Entre 15 y 49 años</th>
			<th>Entre 50 y 69 años</th>
			<th>Acción</th>
		</tr>
	</thead>
	<tbody>
		{#each datos as dato (dato.codecountry + dato.year)}
			<tr>
				<td> {dato.country} </td>
				<td> {dato.codecountry} </td>
				<td> {dato.year} </td>
				<td> {dato.death_count_hiv_aids_under_5} </td>
				<td> {dato.death_count_hiv_aids_70_plus} </td>
				<td> {dato.death_count_hiv_aids_5_14} </td>
				<td> {dato.death_count_hiv_aids_15_49} </td>
				<td> {dato.death_count_hiv_aids_50_69} </td>
				<td
					><button
						onclick={() => {
							deleteContact(dato.codecountry, dato.year);
						}}>ELIMINAR</button
					></td
				>
				<td
					><button><a href="/aids-deaths-stats/{dato.codecountry}/{dato.year}">EDITAR</a></button
					></td
				>
			</tr>
		{/each}
		<tr>
			<td><input type="text" bind:value={newCountry}  /> </td>
			<td><input type="text" bind:value={newCodeCountry} /></td>
			<td><input type="number" bind:value={newYear} /></td>
			<td><input type="number" bind:value={newDeath_count_hiv_aids_under_5} min="0" /></td>
			<td><input type="number" bind:value={newDeath_count_hiv_aids_70_plus} min="0" /></td>
			<td><input type="number" bind:value={newDeath_count_hiv_aids_5_14} min="0" /></td>
			<td><input type="number" bind:value={newDeath_count_hiv_aids_15_49} min="0" /></td>
			<td><input type="number" bind:value={newDeath_count_hiv_aids_50_69} min="0" /></td>
			<td><button onclick={añadirContact}>AÑADIR</button></td>
		</tr>
	</tbody>
</table>

{#if result != 0}
	<h4>Resultado de la operación: {estados[result]}</h4>
{/if}

<button onclick={deleteContacts}>ELIMINAR TODO</button>

<h3>Filtros:</h3>
<div class="filtros">
  <div>
    <label>País:</label>
    <input type="text" bind:value={filterCountry}/>
  </div>
  <div>
    <label>Código país:</label>
    <input type="text" bind:value={filterCodeCountry} />
  </div>
  <div>
    <label>Año exacto:</label>
    <input type="number" bind:value={filterYear} />
  </div>
  <div>
    <label>Año desde:</label>
    <input type="number" bind:value={filterFrom}  />
  </div>
  <div>
    <label>Año hasta:</label>
    <input type="number" bind:value={filterTo}/>
  </div>
  <div>
    <label>Muertes menores de 5:</label>
    <input type="number" bind:value={filterUnder5} min="0" />
  </div>
  <div>
    <label>Muertes mayores de 70:</label>
    <input type="number" bind:value={filter70Plus} min="0" />
  </div>
  <div>
    <label>Muertes entre 5 y 14:</label>
    <input type="number" bind:value={filter5_14} min="0" />
  </div>
  <div>
    <label>Muertes entre 15 y 49:</label>
    <input type="number" bind:value={filter15_49} min="0" />
  </div>
  <div>
    <label>Muertes entre 50 y 69:</label>
    <input type="number" bind:value={filter50_69} min="0" />
  </div>
  <div>
    <label>Límite:</label>
    <input type="number" bind:value={limit} min="1" />
  </div>
  <div>
    <label>Offset:</label>
    <input type="number" bind:value={offset} min="0" />
  </div>
</div>
<button onclick={aplicarFiltro}>Aplicar filtros</button>
<button onclick={limpiarFiltros}>Limpiar filtros</button>
<style>
	td,
	th {
		padding: 10px;
	}
</style>
