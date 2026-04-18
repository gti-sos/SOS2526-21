<script>
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    let myData = $state([]);
    let selectedYear = $state('2016');
    let selectedMetric = $state('reportedCases');
    let availableYears = $state([]);

    let API = '/api/v1/cholera-stats';
    if (dev) API = 'http://localhost:3000/api/v1/cholera-stats';

    function buildSunburstData(data, year, metric) {
        const filtered = data.filter(d => d.year === parseInt(year) && d[metric] != null && d[metric] > 0);

        // agrupar por región
        const regions = {};
        filtered.forEach(d => {
            if (!regions[d.whoRegion]) regions[d.whoRegion] = {};
            regions[d.whoRegion][d.country] = (regions[d.whoRegion][d.country] || 0) + d[metric];
        });

        const sunData = [{ id: 'root', parent: '', name: 'World' }];

        Object.entries(regions).forEach(([region, countries]) => {
            const regionId = region.replace(/\s+/g, '_');
            sunData.push({ id: regionId, parent: 'root', name: region });

            Object.entries(countries).forEach(([country, value]) => {
                const countryId = regionId + '_' + country.replace(/\s+/g, '_');
                sunData.push({ id: countryId, parent: regionId, name: country, value });
            });
        });

        return sunData;
    }

    function renderChart(data, year, metric) {
        const sunData = buildSunburstData(data, year, metric);

        const metricLabels = {
            reportedCases: 'Casos reportados',
            reportedDeaths: 'Muertes reportadas',
            fatalityRate: 'Ratio de fatalidad'
        };

        Highcharts.chart('container', {
            chart: { height: 600 },
            colors: ['#ffffff01'].concat(Highcharts.getOptions().colors),
            title: { text: `Cólera ${year} — ${metricLabels[metric]}` },
            subtitle: { text: 'Fuente: WHO Cholera Dataset' },
            series: [{
                type: 'sunburst',
                data: sunData,
                name: 'Root',
                allowTraversingTree: true,
                borderRadius: 3,
                cursor: 'pointer',
                dataLabels: {
                    format: '{point.name}',
                    filter: { property: 'innerArcLength', operator: '>', value: 16 }
                },
                levels: [
                    { level: 1, levelIsConstant: false, dataLabels: { filter: { property: 'outerArcLength', operator: '>', value: 64 } } },
                    { level: 2, colorByPoint: true },
                    { level: 3, colorVariation: { key: 'brightness', to: -1 } },
                    { level: 4, colorVariation: { key: 'brightness', to: 1 } }
                ]
            }],
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b>: <b>{point.value}</b>'
            }
        });
    }

    onMount(async () => {
        const res = await fetch(API + '?limit=10000');
        myData = await res.json();

        // extraer años disponibles
        const years = [...new Set(myData.map(d => d.year))].sort((a, b) => b - a);
        availableYears = years.map(y => String(y));
        selectedYear = availableYears[0];

        renderChart(myData, selectedYear, selectedMetric);
    });

    function actualizar() {
        renderChart(myData, selectedYear, selectedMetric);
    }
</script>

<svelte:head>
    <title>Cholera Stats - Gráfica</title>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/sunburst.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<h1>Estadísticas del Cólera — Sunburst</h1>

<div>
    <label>Año:
        <select bind:value={selectedYear} onchange={actualizar}>
            {#each availableYears as year}
                <option value={year}>{year}</option>
            {/each}
        </select>
    </label>

    <label>Métrica:
        <select bind:value={selectedMetric} onchange={actualizar}>
            <option value="reportedCases">Casos reportados</option>
            <option value="reportedDeaths">Muertes reportadas</option>
            <option value="fatalityRate">Ratio de fatalidad</option>
        </select>
    </label>

    <button onclick={actualizar}>ACTUALIZAR</button>
</div>

<figure class="highcharts-figure">
    <div id="container"></div>
</figure>

<style>
#container {
    height: 600px;
    width: 100%;
}

.highcharts-figure {
    min-width: 320px;
    max-width: 100%;
    margin: 1em auto;
}
</style>