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
	
	function aplicarFiltro() {
    	filtro = limit != 10 ? `?limit=${limit}` : '';
    	getDatos();
	}


	if (dev) {
		BASE_API = 'http://localhost:3000' + BASE_API;
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

<h3>Filtros: </h3>
<div class="card-limit">
  <h2>Número de datos: </h2>
  <input type="number" bind:value={limit} min="1"/>
</div>
<div class="card-offset">
  <h2>Desplazamiento (no terminado): </h2>
  <input type="number" bind:value={offset} min="0"/>
</div>
<button onclick={aplicarFiltro}>Aplicar</button>
<style>
	td,
	th {
		padding: 10px;
	}
</style>
