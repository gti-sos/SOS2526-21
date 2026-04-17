<script>
import Highcharts from "highcharts";  
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    let BASE_API = '/api/v1';
    let paises = $state([]);
    let menores5 = $state([]);
    let entre5_14 = $state([]);
    let entre15_49 = $state([]);
    let entre50_69 = $state([]);
    let mas70 = $state([]);
    let filtro = $state("1990");
    let filtroError = $state();
    let chart = $state();    

    if (dev) {
        BASE_API = 'http://localhost:3000' + BASE_API;
    }

    function validarFiltro() {
        if (!filtro || filtro === "") {
            filtroError = "El año no puede estar en blanco.";
            return false;
        }
        const año = Number(filtro);
        if (isNaN(año) || !Number.isInteger(año) || año < 1990 || año > 2019) {
            filtroError = "Introduce un año válido entre 1990 y 2019.";
            return false;
        }
        filtroError = "";
        return true;
    }

    async function aplicarFiltro() {
        if (!validarFiltro()) return;
        await getDatos();
        actualizarGrafico();
    }

    function actualizarGrafico() {
        const { browserData, versionsData } = calcularSeries();
        chart.series[0].setData(browserData);
        chart.series[1].setData(versionsData);
        chart.setTitle({ text: `Estadísticas muertes por SIDA (${filtro})` });
    }

    function calcularSeries() {
        const totalMenores5 = menores5.reduce((a, b) => a + b, 0);
        const totalEntre5_14 = entre5_14.reduce((a, b) => a + b, 0);
        const totalEntre15_49 = entre15_49.reduce((a, b) => a + b, 0);
        const totalEntre50_69 = entre50_69.reduce((a, b) => a + b, 0);
        const totalMas70 = mas70.reduce((a, b) => a + b, 0);
        const grandTotal = totalMenores5 + totalEntre5_14 + totalEntre15_49 + totalEntre50_69 + totalMas70;
        const pct = (val) => parseFloat(((val / grandTotal) * 100).toFixed(2));

        const colors = Highcharts.getOptions().colors;
        const data = [
            { y: pct(totalMenores5), color: colors[2], drilldown: { name: '< 5 años', categories: paises, data: menores5 } },
            { y: pct(totalEntre5_14), color: colors[3], drilldown: { name: '5 - 14 años', categories: paises, data: entre5_14 } },
            { y: pct(totalEntre15_49), color: colors[5], drilldown: { name: '15 - 49 años', categories: paises, data: entre15_49 } },
            { y: pct(totalEntre50_69), color: colors[1], drilldown: { name: '50 - 69 años', categories: paises, data: entre50_69 } },
            { y: pct(totalMas70), color: colors[6], drilldown: { name: '> 70', categories: paises, data: mas70 } }
        ];

        const categories = ['< 5 años', '5 - 14 años', '15 - 49 años', '50 - 69 años', '> 70'];
        const browserData = [];
        const versionsData = [];

        for (let i = 0; i < data.length; i++) {
            browserData.push({ name: categories[i], y: data[i].y, color: data[i].color });
            const drillDataLen = data[i].drilldown.data.length;
            for (let j = 0; j < drillDataLen; j++) {
                const name = data[i].drilldown.categories[j];
                const brightness = 0.2 - (j / drillDataLen) / 5;
                versionsData.push({
                    name,
                    y: data[i].drilldown.data[j],
                    color: Highcharts.color(data[i].color).brighten(brightness).get(),
                    custom: { version: name.split(' ')[1] || name.split(' ')[0] }
                });
            }
        }

        return { browserData, versionsData };
    }

    async function getDatos() {
        const res = await fetch(BASE_API + `/aids-deaths-stats?year=${filtro}&limit=1000`, { method: 'GET' });
        const data = await res.json();
        
        data.sort((a) => a.country);
        let auxPaises = [], auxMenores5 = [], auxEntre5_14 = [], auxEntre15_49 = [], auxEntre50_69 = [], auxMas70 = [];

        for (let dato of data) {
            if (dato.country === 'World') continue;
            auxPaises.push(dato.country);
            auxMenores5.push(Number(dato.death_count_hiv_aids_under_5));
            auxEntre5_14.push(Number(dato.death_count_hiv_aids_5_14));
            auxEntre15_49.push(Number(dato.death_count_hiv_aids_15_49));
            auxEntre50_69.push(Number(dato.death_count_hiv_aids_50_69));
            auxMas70.push(Number(dato.death_count_hiv_aids_70_plus));
        }

        paises = auxPaises;
        menores5 = auxMenores5;
        entre5_14 = auxEntre5_14;
        entre15_49 = auxEntre15_49;
        entre50_69 = auxEntre50_69;
        mas70 = auxMas70;
    }

    onMount(async () => {
        await getDatos(); 
        const { browserData, versionsData } = calcularSeries();

        chart = Highcharts.chart('container', {
            chart: { type: 'pie' },
            title: { text: `Estadísticas muertes por SIDA (${filtro})` },
            plotOptions: { pie: { shadow: false, center: ['50%', '50%'] } },
            tooltip: {
                formatter: function() {
                    const isCountry = this.series.options.id === 'versions';
                    const dot = `<span style="color:${this.point.color}">●</span> `;
                    if (isCountry) return `${dot}<b>${this.point.name}</b>: ${this.y} muertes`;
                    return `${dot}<b>${this.point.name}</b>: ${this.y}%`;
                }
            },
            series: [{
                name: 'muerte por edad',
                data: browserData,
                size: '95%',
                dataLabels: { color: '#ffffff', distance: '-50%' }
            }, {
                name: 'paises',
                data: versionsData,
                size: '100%',
                innerSize: '50%',
                dataLabels: {
                    format: '<b>{point.name}:</b> <span style="opacity: 0.5">{y}</span>',
                    filter: { property: 'y', operator: '>', value: 1 },
                    style: { fontWeight: 'normal' }
                },
                id: 'versions'
            }],
            responsive: {
                rules: [{
                    condition: { maxWidth: 500 },
                    chartOptions: {
                        series: [{}, {
                            id: 'versions',
                            dataLabels: {
                                distance: 10,
                                format: '{point.custom.version}',
                                filter: { property: 'percentage', operator: '>', value: 2 }
                            }
                        }]
                    }
                }]
            }
        });
    })
</script>

<div class="page">

    <section class="card">
        <h2 class="section-title">Filtros</h2>

        <div class="filtros-grid">
            <div class="field">
                <label for="anio">Año</label>
                <input
                    id="anio"
                    type="number"
                    min="1990"
                    max="2016"
                    bind:value={filtro}
                    placeholder="1990 - 2016"
                />
                {#if filtroError}
                    <span class="error">{filtroError}</span>
                {/if}
            </div>
        </div>

        <div class="filtros-actions">
            <button class="btn btn-primary" onclick={aplicarFiltro}>
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

    .field input {
        padding: 0.4rem 0.5rem;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font-size: 0.85rem;
        background: #f8fafc;
        transition: border-color 0.15s;
    }

    .field input:focus {
        outline: none;
        border-color: #3b82f6;
        background: #fff;
    }

    .field input:invalid {
        border-color: #ef4444;
    }

    .error {
        font-size: 0.72rem;
        color: #ef4444;
        font-weight: 500;
    }

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