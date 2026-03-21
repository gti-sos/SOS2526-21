<script>
	import { page } from '$app/state';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	let codecountry = page.params.codecountry;
	let year = page.params.year;

	let newCountry = $state('paísEjemplo');
	let newCodeCountry = $state('codigoPaísEjemplo');
	let newYear = $state(1111);
	let newDeath_count_hiv_aids_under_5 = $state(0);
	let newDeath_count_hiv_aids_70_plus = $state(0);
	let newDeath_count_hiv_aids_5_14 = $state(0);
	let newDeath_count_hiv_aids_15_49 = $state(0);
	let newDeath_count_hiv_aids_50_69 = $state(0);

	let result = $state(0);

	let BASE_API = '/api/v1/aids-deaths-stats';
	if (dev) {
		BASE_API = 'http://localhost:3000' + BASE_API;
	}
	async function getDatos() {
		const res = await fetch(BASE_API + `/${codecountry}/${year}`, {
			method: 'GET'
		});
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
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newDato)
		});
		result = await res.status;
		if (res.status == 200) {
			getDatos();
		}
	}

	onMount(async () => {
		getDatos();
	});
</script>

<p>Detalles del elemento: {codecountry}, {year}</p>

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
		<tr>
			<td><input type="text" readonly bind:value={newCountry} /> </td>
			<td><input type="text" readonly bind:value={newCodeCountry} /></td>
			<td><input type="number" readonly bind:value={newYear} /></td>
			<td><input type="number" bind:value={newDeath_count_hiv_aids_under_5} min="0" /></td>
			<td><input type="number" bind:value={newDeath_count_hiv_aids_70_plus} min="0" /></td>
			<td><input type="number" bind:value={newDeath_count_hiv_aids_5_14} min="0" /></td>
			<td><input type="number" bind:value={newDeath_count_hiv_aids_15_49} min="0" /></td>
			<td><input type="number" bind:value={newDeath_count_hiv_aids_50_69} min="0" /></td>
			<td><button onclick={editarDato}>EDITAR</button></td>
		</tr>
	</tbody>
</table>

<td><button><a href="/aids-deaths-stats">VOLVER</a></button></td>

{#if result != 0}
	<h4>Resultado de la operación: {result}</h4>
{/if}
