<script>
    import Highcharts from "highcharts";
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    let BASE_API = '/api/v1';
    let datosDDLRF = $state();
    let datosMTC = $state();
    let datosIAD = $state();
    let filtro = $state("Afghanistan");
    let chart;

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

    // ── Mapa de nombres por API ──────────────────────────────────────────
    const paisMap = {
        "American Samoa":                { aids: "American Samoa",   cholera: "American Samoa",                                              religion: "Samoa" },
        "Bolivia":                       { aids: "Bolivia",          cholera: "Bolivia (Plurinational State of)",                            religion: "Bolivia" },
        "Brunei":                        { aids: "Brunei",           cholera: "Brunei Darussalam",                                           religion: "Brunei" },
        "Iran":                          { aids: "Iran",             cholera: "Iran (Islamic Republic of)",                                  religion: "Iran" },
        "Micronesia":                    { aids: "Micronesia (country)", cholera: "Micronesia (Federated States of)",                        religion: "Micronesia (country)" },
        "Moldova":                       { aids: "Moldova",          cholera: "Republic of Moldova",                                         religion: "Moldova" },
        "Russia":                        { aids: "Russia",           cholera: "Russian Federation",                                          religion: "Russia" },
        "Syria":                         { aids: "Syria",            cholera: "Syrian Arab Republic",                                        religion: "Syria" },
        "Tanzania":                      { aids: "Tanzania",         cholera: "United Republic of Tanzania",                                 religion: "Tanzania" },
        "Timor":                         { aids: "Timor",            cholera: "Timor",                                                       religion: "East Timor" },
        "United Kingdom":                { aids: "United Kingdom",   cholera: "United Kingdom of Great Britain and Northern Ireland",        religion: "United Kingdom" },
        "United States":                 { aids: "United States",    cholera: "United States of America",                                    religion: "United States" },
        "Venezuela":                     { aids: "Venezuela",        cholera: "Venezuela (Bolivarian Republic of)",                          religion: "Venezuela" },
    };

    function getNombreAids(pais)     { return paisMap[pais]?.aids     ?? pais; }
    function getNombreCholera(pais)  { return paisMap[pais]?.cholera  ?? pais; }
    function getNombreReligion(pais) { return paisMap[pais]?.religion ?? pais; }
    // ────────────────────────────────────────────────────────────────────

    if (dev) {
        BASE_API = 'http://localhost:3000' + BASE_API;
    }

    async function aplicarFiltro() {
        await getDatosDDLRF();
        await getDatosMTC();
        await getDatosIAD();

        if (!chart) {
            console.error('El chart no está inicializado');
            return;
        }

        chart.series[0].setData(datosIAD);
        chart.series[1].setData(datosDDLRF);
        chart.series[2].setData(datosMTC);
    }

    async function getDatosDDLRF() {
        const nombre = getNombreAids(filtro);
        const res = await fetch(BASE_API + `/aids-deaths-stats?country=${nombre}&from=2000&to=2016&limit=17`, { method: 'GET' });
        const data = await res.json();

        data.sort((a, b) => a.year - b.year);

        // Mapa año → valor para rellenar huecos con 0
        const mapaAnios = {};
        for (let dato of data) {
            mapaAnios[dato.year] =
                Number(dato.death_count_hiv_aids_under_5  ?? 0) +
                Number(dato.death_count_hiv_aids_70_plus  ?? 0) +
                Number(dato.death_count_hiv_aids_5_14     ?? 0) +
                Number(dato.death_count_hiv_aids_15_49    ?? 0) +
                Number(dato.death_count_hiv_aids_50_69    ?? 0);
        }

        let aux = [];
        for (let year = 2000; year <= 2016; year++) {
            aux.push(mapaAnios[year] ?? 0);
        }

        datosDDLRF = aux;
    }

    async function getDatosMTC() {
        const nombre = getNombreCholera(filtro);
        const res = await fetch(BASE_API + `/cholera-stats?country=${nombre}&from=2000&to=2016&limit=17`, { method: 'GET' });
        const data = await res.json();

        const mapaAnios = {};
        for (let d of data) {
            mapaAnios[d.year] = (d.reportedCases != null && d.reportedCases !== '')
                ? Number(d.reportedCases)
                : 0;
        }

        let reported_cases = [];
        for (let year = 2000; year <= 2016; year++) {
            reported_cases.push(mapaAnios[year] ?? 0);
        }

        datosMTC = reported_cases;
    }

    async function getDatosIAD() {
        try {
            const nombre = getNombreReligion(filtro);
            const [res1, res2] = await Promise.all([
                fetch(BASE_API + `/religious-believes-stats?entity=${nombre}&year=2010`, { method: 'GET' }),
                fetch(BASE_API + `/religious-believes-stats?entity=${nombre}&year=2020`, { method: 'GET' })
            ]);

            const data1 = await res1.json();
            const data2 = await res2.json();

            const val2010 = (data1?.[0]?.muslim != null) ? parseFloat(data1[0].muslim) : 0;
            const val2020 = (data2?.[0]?.muslim != null) ? parseFloat(data2[0].muslim) : 0;

            let musulman = [];
            for (let i = 0; i < 11; i++) musulman.push(val2010); // 2000–2010
            for (let i = 0; i < 6; i++)  musulman.push(val2020); // 2011–2016

            datosIAD = musulman;

        } catch (e) {
            console.error('Error en getDatosIAD:', e);
            datosIAD = new Array(17).fill(0);
        }
    }

    onMount(async () => {
        await getDatosDDLRF();
        await getDatosMTC();
        await getDatosIAD();

        chart = Highcharts.chart('container', {
            chart: { type: 'column' },
            title: { text: 'Análisis entre: Casos de colera - Muertes por SIDA - Creencias religiosas' },
            xAxis: {
                categories: ['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016']
            },
            yAxis: [
                { min: 0, title: { text: '% Poblacion Creyente Musulmana' } },
                { title: { text: 'Nº Personas' }, opposite: true }
            ],
            legend: { shadow: false },
            tooltip: { shared: true },
            plotOptions: {
                column: { grouping: true, shadow: false, borderWidth: 0 }
            },
            series: [{
                name: 'Creyentes',
                color: 'rgba(126,86,134,1)',
                data: datosIAD,
                tooltip: { valueSuffix: '%' },
                pointPadding: 0.1,
                pointPlacement: -0.1
            }, {
                name: 'Muertes por SIDA',
                color: 'rgba(186,60,61,.9)',
                data: datosDDLRF,
                tooltip: { valueSuffix: ' Personas' },
                pointPadding: 0.3,
                pointPlacement: 0.2,
                yAxis: 1
            }, {
                name: 'Casos de cólera',
                color: 'rgba(0,255,0,.9)',
                data: datosMTC,
                tooltip: { valueSuffix: ' Personas' },
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