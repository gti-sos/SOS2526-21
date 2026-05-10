<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	//import Highcharts from 'highcharts';
	import Chart from 'chart.js/auto';

	let chartInstance;

	let BASE_API_AIDS = '/api/v1/aids-deaths-stats';
	if (dev) {
		BASE_API_AIDS = 'http://localhost:3000' + BASE_API_AIDS;
	}
	let datosCereales = $state([]);
	let BASE_API_CEREALES =
		'https://sos2526-18-cereal-productions-stable.onrender.com/api/v2/cereal-productions';
	let paginaCereales = $state(0);

	async function getDatosCereales() {
		const offsetCereales = paginaCereales * 10;
		const resCereales = await fetch(`${BASE_API_CEREALES}?limit=10&offset=${offsetCereales}`, {
			method: 'GET'
		});
		const dataCereales = await resCereales.json();
		datosCereales = dataCereales;
	}
	async function irACereales(p) {
		paginaCereales = p;
		await getDatosCereales();
	}

	let BASE_API_STOCK =
		'https://mi-api-estable-sos.onrender.com/api/v1/daily-global-stock-market-indicators';
	let datosStock = $state([]);
	let paginaStock = $state(0);

	async function getDatosStock() {
		const offset = paginaStock * 10;
		const res = await fetch(`${BASE_API_STOCK}?limit=10&offset=${offset}`, {
			method: 'GET'
		});
		const data = await res.json();
		datosStock = data;
	}
	async function irAStock(p) {
		paginaStock = p;
		await getDatosStock();
	}

	let BASE_API_BIRTH = 'https://sos2526-12.onrender.com/api/v2/birth-death-growth-rates';
	let datosBirth = $state([]);

	async function getDatosBirth() {
		const res = await fetch(`${BASE_API_BIRTH}`, {
			method: 'GET'
		});
		const data = await res.json();
		datosBirth = data;
	}

	let BASE_API_ROAD = 'https://sos2526-11.onrender.com/api/v2/road-fatalities';
	let datosRoad = $state([]);
	let datosAids = $state([]);

	async function getDatosRoad() {
		const res = await fetch(`${BASE_API_AIDS}?limit=100000`, {
			method: 'GET'
		});
		const res2 = await fetch(`${BASE_API_ROAD}?limit=100000`, {
			method: 'GET'
		});
		const data1 = await res.json();
		const data2 = await res2.json();
		const porAño1 = {};
		const porAño2 = {};
		for (const dato of data1) {
			if (!porAño1[dato.year]) {
				porAño1[dato.year] = { year: dato.year, total: 0 };
			}
			porAño1[dato.year].total +=
				dato.death_count_hiv_aids_under_5 +
				dato.death_count_hiv_aids_70_plus +
				dato.death_count_hiv_aids_5_14 +
				dato.death_count_hiv_aids_15_49 +
				dato.death_count_hiv_aids_50_69;
		}
		for (const dato of data2) {
			if (!porAño2[dato.year]) {
				porAño2[dato.year] = { year: dato.year, total: 0 };
			}
			porAño2[dato.year].total += dato.total_death;
		}
		const roadRelleno = [];
		let ultimoValor = 0;

		for (let año = 1990; año <= 2019; año++) {
			if (porAño2[año]) {
				ultimoValor = porAño2[año].total;
			}
			roadRelleno.push({ year: año, total: ultimoValor });
		}

		datosRoad = roadRelleno;
		datosAids = Object.values(porAño1).sort((a, b) => a.year - b.year);
	}

	let BASE_API_COFFE = 'https://sos2526-20-stable.onrender.com/api/v2/coffee-stats';
	let datosCoffe = $state([]);
	let datosAids2 = $state([]);

	function normalizarPais(nombre) {
		const mapa = {
			"Côte d'Ivoire": "Cote d'Ivoire",
			'Viet Nam': 'Vietnam',
			'Bolivia (Plurinational State of)': 'Bolivia',
			'Trinidad & Tobago': 'Trinidad and Tobago',
			Congo: 'Congo'
		};
		return mapa[nombre] || nombre;
	}

	async function getDatosCoffe() {
		const res = await fetch(`${BASE_API_AIDS}?limit=100000&year=1990`, {
			method: 'GET'
		});
		const res2 = await fetch(`${BASE_API_COFFE}?limit=10000&year=1990`, {
			method: 'GET'
		});
		const data1 = await res.json();
		const data2 = await res2.json();
		const porPaises1 = {};
		for (const dato of data1) {
			const pais1 = normalizarPais(dato.country);
			if (!porPaises1[dato.country]) {
				porPaises1[dato.country] = { country: pais1, total: 0 };
			}
			porPaises1[dato.country].total +=
				dato.death_count_hiv_aids_under_5 +
				dato.death_count_hiv_aids_70_plus +
				dato.death_count_hiv_aids_5_14 +
				dato.death_count_hiv_aids_15_49 +
				dato.death_count_hiv_aids_50_69;
		}
		const porPaises2 = {};
		for (const dato of data2.data) {
			const pais = normalizarPais(dato.country);
			if (!porPaises2[pais]) {
				porPaises2[pais] = { country: pais, total: 0 };
			}
			porPaises2[pais].total += dato.export;
		}

		datosAids2 = Object.values(porPaises1)
			.filter((d) => porPaises2[d.country])
			.sort((a, b) => a.country.localeCompare(b.country));
		datosCoffe = Object.values(porPaises2).sort((a, b) => a.country.localeCompare(b.country));
	}

	let topology = $state();
	let poblacion = $state();

	onMount(async () => {
		const Highcharts = window.Highcharts;
		await getDatosRoad();
		await getDatosCereales();
		await getDatosStock();
		await getDatosBirth();
		await getDatosCoffe();
		Highcharts.chart('container', {
			chart: {
				type: 'areaspline'
			},
			title: {
				text: 'Integracion: nº muertes por SIDA y accidentes de trafico'
			},
			legend: {
				layout: 'vertical',
				align: 'left',
				verticalAlign: 'top',
				x: 120,
				y: 70,
				floating: true,
				borderWidth: 1,
				backgroundColor: 'var(--highcharts-background-color, #ffffff)'
			},
			xAxis: {
				// Highlight the last years where moose hunting quickly deminishes
				plotBands: [
					{
						from: 1990,
						to: 2019,
						color: 'rgba(68, 170, 213, .2)'
					}
				]
			},
			yAxis: {
				title: {
					text: 'Muertes'
				}
			},
			tooltip: {
				shared: true,
				headerFormat: '<b>Muertes: {point.x}</b><br>'
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				series: {
					pointStart: 1990
				},
				areaspline: {
					fillOpacity: 0.5
				}
			},
			series: [
				{
					name: 'SIDA',
					data: datosAids.map((d) => d.total)
				},
				{
					name: 'Accidentes de Trafico',
					data: datosRoad.map((d) => d.total)
				}
			]
		});

		const ctx = document.getElementById('miGrafica').getContext('2d');

		chartInstance = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: datosCoffe.map((d) => d.country), // países en el eje X
				datasets: [
					{
						label: 'Export Café',
						data: datosCoffe.map((d) => d.total),
						borderColor: 'rgba(75, 192, 192, 1)',
						backgroundColor: 'rgba(75, 192, 192, 0.5)',
						borderWidth: 2,
						borderRadius: Number.MAX_VALUE,
						borderSkipped: false,
						yAxisID: 'yCafe'
					},
					{
						label: 'Muertes SIDA',
						data: datosAids2.map((d) => d.total),
						borderColor: 'rgba(255, 99, 132, 1)',
						backgroundColor: 'rgba(255, 99, 132, 0.5)',
						borderWidth: 2,
						borderRadius: 5,
						borderSkipped: false,
						yAxisID: 'ySida'
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'top' },
					title: {
						display: true,
						text: 'Exportación de Café vs Muertes por SIDA (1990)'
					}
				},
				scales: {
					yCafe: {
						type: 'logarithmic',
						position: 'left',
						title: {
							display: true,
							text: 'Export Café'
						}
					},
					ySida: {
						type: 'logarithmic',
						position: 'right',
						title: {
							display: true,
							text: 'Muertes SIDA'
						},
						grid: {
							drawOnChartArea: false
						}
					}
				}
			}
		});

		const topology = await fetch('https://code.highcharts.com/mapdata/custom/world.topo.json').then(
			(r) => r.json()
		);
		const res = await fetch('https://restcountries.com/v3.1/all?fields=cca3,population,name').then(
			(r) => r.json()
		);
		const poblacion = res.map((p) => ({
			'iso-a3': p.cca3,
			value: p.population,
			name: p.name.common
		}));

		Highcharts.mapChart('containerMapa', {
			chart: { map: topology },
			title: { text: 'Población por país', align: 'left' },
			mapNavigation: { enabled: true, buttonOptions: { verticalAlign: 'bottom' } },
			colorAxis: { min: 0 },
			tooltip: { valueSuffix: ' habitantes' },
			series: [{ name: 'Población', joinBy: 'iso-a3', data: poblacion }]
		});
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/maps/highmaps.js"></script>
	<script src="https://code.highcharts.com/maps/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/maps/modules/data.js"></script>
	<script src="https://code.highcharts.com/maps/modules/accessibility.js"></script>
	<script src="https://code.highcharts.com/themes/adaptive.js"></script>
</svelte:head>

<div id="containerMapa"></div>

<a href="https://sos2526-11.onrender.com/api/v2/road-fatalities/loadinitialdata"
	>LoadInitialData Road</a
>
<div id="container"></div>

<section class="card table-card">
	<h3>Exportación de Café vs Muertes por SIDA (1990)</h3>
	<a href="https://sos2526-20-stable.onrender.com/api/v2/coffee-stats/loadinitialdata"
		>LoadInitialData Cafe</a
	>
	<div class="table-wrapper">
		<canvas id="miGrafica"></canvas>
	</div>
</section>
<section class="card table-card">
	<a href="https://sos2526-18-cereal-productions-stable.onrender.com/cereal-productions">
		Frontend Cereales</a
	>
	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>País</th>
					<th>Código</th>
					<th>Año</th>
					<th>Tierra usada (ha)</th>
					<th>Producción cereal (t)</th>
					<th>Rendimiento cereal</th>
					<th>Población</th>
				</tr>
			</thead>
			<tbody>
				{#each datosCereales as dato (dato.country + dato.year)}
					<tr data-testid="dataRow">
						<td>{dato.country}</td>
						<td>{dato.country_code}</td>
						<td>{dato.year}</td>
						<td>{dato.land_used.toLocaleString()}</td>
						<td>{dato.cereal_production.toLocaleString()}</td>
						<td>{dato.cereal_yield.toLocaleString()}</td>
						<td>{dato.population.toLocaleString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="filtros-actions" style="padding: 0.75rem 1rem;">
		<button
			class="btn btn-ghost"
			disabled={paginaCereales === 0}
			onclick={() => irACereales(paginaCereales - 1)}
		>
			‹ Anterior
		</button>
		<span style="font-size: 0.85rem; color: #64748b; align-self: center;">
			Página {paginaCereales + 1}
		</span>
		<button class="btn btn-ghost" onclick={() => irACereales(paginaCereales + 1)}>
			Siguiente ›
		</button>
	</div>
</section>

<section class="card table-card">
	<a href="https://mi-api-estable-sos.onrender.com/daily-global-stock-market-indicators">
		Frontend Stock</a
	>
	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>Indice</th>
					<th>Region</th>
					<th>Fecha</th>
					<th>Apertura</th>
					<th>Max</th>
					<th>Min</th>
					<th>Cierre</th>
					<th>Volumen</th>
					<th>Cambio</th>
				</tr>
			</thead>
			<tbody>
				{#each datosStock as dato (dato.date + dato.region + dato.index_name)}
					<tr data-testid="dataRow">
						<td>{dato.index_name}</td>
						<td><span class="badge">{dato.region}</span></td>
						<td>{dato.date}</td>
						<td>{dato.open.toLocaleString()}</td>
						<td>{dato.high.toLocaleString()}</td>
						<td>{dato.low.toLocaleString()}</td>
						<td>{dato.close.toLocaleString()}</td>
						<td>{dato.volume.toLocaleString()}</td>
						<td>{dato.daily_change_percent}%</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="filtros-actions" style="padding: 0.75rem 1rem;">
		<button
			class="btn btn-ghost"
			disabled={paginaStock === 0}
			onclick={() => irAStock(paginaStock - 1)}
		>
			‹ Anterior
		</button>
		<span style="font-size: 0.85rem; color: #64748b; align-self: center;">
			Página {paginaStock + 1}
		</span>
		<button class="btn btn-ghost" onclick={() => irAStock(paginaStock + 1)}> Siguiente › </button>
	</div>
</section>

<section class="card table-card">
	<a href="https://sos2526-12.onrender.com/api/v2/birth-death-growth-rates/loadinitialdata">
		Frontend Birth</a
	>
	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>País</th>
					<th>Código</th>
					<th>Año</th>
					<th>Tasa natalidad</th>
					<th>Tasa mortalidad</th>
					<th>Migración neta</th>
					<th>Tasa crecimiento natural</th>
					<th>Tasa de crecimiento</th>
				</tr>
			</thead>
			<tbody>
				{#each datosBirth as dato (dato.country_code + dato.year)}
					<tr data-testid="dataRow">
						<td>{dato.country_name}</td>
						<td>{dato.country_code}</td>
						<td>{dato.year}</td>
						<td>{dato.crude_birth_rate}</td>
						<td>{dato.crude_death_rate}</td>
						<td>{dato.net_migration}</td>
						<td>{dato.rate_natural_increase}</td>
						<td>{dato.growth_rate}%</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
