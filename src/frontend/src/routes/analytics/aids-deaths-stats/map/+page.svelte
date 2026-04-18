<svelte:head>
    <script src="https://code.highcharts.com/maps/highmaps.js"></script>
    <script src="https://code.highcharts.com/maps/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/maps/modules/data.js"></script>
    <script src="https://code.highcharts.com/maps/modules/accessibility.js"></script>
    <script src="https://code.highcharts.com/themes/adaptive.js"></script>
</svelte:head>

<script>
   
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    let BASE_API = '/api/v1';
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
        const seriesData = await getDatos();
        actualizarGrafico(seriesData);
    }

    function actualizarGrafico(seriesData) {
        chart.series[0].setData(seriesData);
        chart.setTitle({ text: `Muertes por SIDA (${filtro})` });
    }

    async function getDatos() {
        const res = await fetch(BASE_API + `/aids-deaths-stats?year=${filtro}&limit=1000`);
        const data = await res.json();

        return data
            .filter(d => d.country !== 'World')
            .map(d => {
                const under5   = Number(d.death_count_hiv_aids_under_5);
                const age5_14  = Number(d.death_count_hiv_aids_5_14);
                const age15_49 = Number(d.death_count_hiv_aids_15_49);
                const age50_69 = Number(d.death_count_hiv_aids_50_69);
                const age70plus= Number(d.death_count_hiv_aids_70_plus);
                return {
                    'iso-a3': d.codecountry,
                    name: d.country,
                    value: under5 + age5_14 + age15_49 + age50_69 + age70plus,
                    under5,
                    age5_14,
                    age15_49,
                    age50_69,
                    age70plus
                };
            });
    }

    onMount(async () => {
        
        const Highcharts = window.Highcharts;

        const seriesData = await getDatos();

        const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/world.topo.json'
        ).then(r => r.json());

        chart = Highcharts.mapChart('container', {
            chart: { map: topology },

            title: { text: `Muertes por SIDA (${filtro})`, align: 'left' },

            mapNavigation: {
                enabled: true,
                buttonOptions: { verticalAlign: 'bottom' }
            },

            colorAxis: { min: 0 },

            tooltip: {
                useHTML: true,
                formatter: function () {
                    const p = this.point;
                    if (!p.value) return `<b>${p.name}</b><br/>Sin datos`;
                    return `
                        <b>${p.name}</b><br/>
                        <table>
                            <tr><td>Menos de 5 años:</td>    <td><b>${p.under5.toLocaleString()}</b></td></tr>
                            <tr><td>Entre 5 - 14 años:</td>  <td><b>${p.age5_14.toLocaleString()}</b></td></tr>
                            <tr><td>Entre 15 - 49 años:</td> <td><b>${p.age15_49.toLocaleString()}</b></td></tr>
                            <tr><td>Entre 50 - 69 años:</td> <td><b>${p.age50_69.toLocaleString()}</b></td></tr>
                            <tr><td>Mas de 70 años:</td>  <td><b>${p.age70plus.toLocaleString()}</b></td></tr>
                            <tr><td><b>Total:</b></td>  <td><b>${p.value.toLocaleString()}</b></td></tr>
                        </table>
                    `;
                }
            },

            series: [{
                name: 'Muertes por SIDA',
                joinBy: 'iso-a3',
                data: seriesData,
                dataLabels: {
                    enabled: true,
                    format: '{point.value:.0f}',
                    filter: {
                        operator: '>',
                        property: 'labelrank',
                        value: 150
                    },
                    style: { fontWeight: 'normal' }
                }
            }]
        });
    });
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
                    max="2019"
                    bind:value={filtro}
                    placeholder="1990 - 2019"
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
    
    <section class="card">
        <div class="filtros-actions" id="volver-boton">
            <button  class="btn btn-primary" onclick={() => window.location.href='/analytics/aids-deaths-stats'}>
                ⬅️ Volver
            </button>
            
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

    #volver-boton {
        display: flex;
        justify-content: center;
    }
</style>


