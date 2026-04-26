<script>
    import Highcharts from "highcharts";
    import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	// @ts-ignore
	let BASE_API = '/api/v1';
    let datosDDLRF = $state();
	let datosMTC = $state();
    let filtro = $state("Afghanistan");
    let chart = $state(); 
    let paises = [
            "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
            "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
            "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia",
            "Democratic Republic of Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
            "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
            "Fiji", "Finland", "France",
            "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
            "Haiti", "Honduras", "Hungary",
            "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
            "Jamaica", "Japan", "Jordan",
            "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
            "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg",
            "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
            "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
            "Oman",
            "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
            "Qatar",
            "Romania", "Russia", "Rwanda",
            "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
            "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
            "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
            "Vanuatu", "Venezuela", "Vietnam",
            "Yemen",
            "Zambia", "Zimbabwe"
            ];

    if (dev) {
		BASE_API = 'http://localhost:3000' + BASE_API;
	}

    async function aplicarFiltro() {
		await getDatosDDLRF();
		await getDatosMTC();
        chart.series[1].setData(datosDDLRF);
        chart.series[2].setData(datosMTC);
		
	}

	


    async function getDatosDDLRF() {
		const res = await fetch(BASE_API + `/aids-deaths-stats?country=${filtro}&from=2000&to=2016&limit=17`, { method: 'GET' });

		const data = await res.json();
        
        data.sort((a, b) => a.year - b.year);
        let aux = [];
        for (let dato of data){
            aux.push(Number(dato.death_count_hiv_aids_under_5) +
			Number(dato.death_count_hiv_aids_70_plus) +
			Number(dato.death_count_hiv_aids_5_14) +
			Number(dato.death_count_hiv_aids_15_49) +
			Number(dato.death_count_hiv_aids_50_69));
        }
        console.log(aux)
        datosDDLRF = aux;
	}


	async function getDatosMTC(){
		const res = await fetch(BASE_API + `/cholera-stats?country=${filtro}&from=2000&to=2016&limit=17`, { method: 'GET' });
		
		const data = await res.json();

		data.sort((a, b) => a.year - b.year);
		let reported_cases= [];
		for (let d of data){
			reported_cases.push(d.reportedCases);
		} 
		datosMTC= reported_cases;

	}


    onMount(async () => {
		await getDatosDDLRF();   
   		await getDatosMTC();
		console.log('SIDA:', datosDDLRF);
    	console.log('Colera:', datosMTC);
        chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Análisis entre: casos de colera - muertes por SIDA - creencias religiosas'
        },
        xAxis: {
            categories: [
                '2000',
                '2001',
                '2002',
                '2003',
                '2004',
                '2005',
                '2006',
                '2007',
                '2008',
                '2009',
                '2010',
                '2011',
                '2012',
                '2013',
                '2014',
                '2015',
                '2016',
            ]
        },
        yAxis: [{
            min: 0,
            title: {
                text: '% Poblacion Creyente'
            }
        }, {
            title: {
                text: 'Nº Personas'
            },
            opposite: true
        }],
        legend: {
            shadow: false
        },
        tooltip: {
            shared: true
        },
        plotOptions: {
            column: {
                grouping: true,
                shadow: false,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Creyentes',
            color: 'rgba(126,86,134,1)',
            data: [0, 80, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,0 ,100 ,0],
            tooltip: {
                valueSuffix: '%'
            },  
            pointPadding: 0.1,
            pointPlacement: -0.1
        },{
            name: 'Muertes por SIDA',
            color: 'rgba(186,60,61,.9)',
            data: datosDDLRF,
            tooltip: {
                valueSuffix: ' Personas'
            },
            pointPadding: 0.3,
            pointPlacement: 0.2,
            yAxis: 1
        },{
            name: 'Casos de colera',
            color: 'rgba(0,255,0,.9)',
            data: datosMTC,
            tooltip: {
                valueSuffix: ' Casos'
            },
            pointPadding: 0.3,
            pointPlacement: 0.2,
            yAxis: 1
        }]
    });
	});

    

</script>
<div class="page">

	<section class="card">
		<h2 class="section-title">Filtros</h2>

		<div class="filtros-grid">
			<div class="field">
				<label>País</label>
				<select bind:value={filtro}>
					{#each paises as pais}
						<option value={pais}>{pais}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="filtros-actions">
			<button class="btn btn-primary" on:click={aplicarFiltro}>
				🔍 Aplicar filtros
			</button>
		</div>
	</section>

	<section class="chart-container">
		<div id="container"></div>
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
		max-width: 1600px;
		margin: 0 auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* ── Card ── */
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
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

	select {
		padding: 0.4rem 0.5rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 0.85rem;
		background: #f8fafc;
		transition: border-color 0.15s;
	}

	select:focus {
		outline: none;
		border-color: #3b82f6;
		background: #fff;
	}

	/* ── Botones ── */
	.filtros-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.btn {
		padding: 0.4rem 0.9rem;
		border: none;
		border-radius: 6px;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: 0.15s;
	}

	.btn:active {
		transform: scale(0.97);
	}

	.btn-primary {
		background: #3b82f6;
		color: #fff;
	}

	.btn-primary:hover {
		background: #2563eb;
	}

	/* ── Gráfica ── */
	.chart-container {
		background: #fff;
		border-radius: 10px;
		border: 1px solid #e2e8f0;
		box-shadow: 0 1px 4px rgba(0,0,0,0.06);
		padding: 1rem;
	}

	#container {
		width: 100%;
		height: 80vh;
	}
</style>