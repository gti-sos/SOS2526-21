<script>
    import Highcharts from 'highcharts';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    let paises = [];
    let casosReportados = [];
    let muertesReportadas = [];
    let ratiosFatalidad = [];
    let regiones = [];
    let todosLosPaises = [];

    let chart;
    let metricaSeleccionada = $state('reportedCases');
    let añoSeleccionado = $state(2016);
    let ListaAños = $state([]);
    let minAño = $state(2000);
    let maxAño = $state(2022);

    let BASE_URL = '/api/v1/cholera-stats';
    if (dev) BASE_URL = 'http://localhost:3000/api/v1/cholera-stats';

    async function getAños() {
        const res = await fetch(BASE_URL + '?limit=100');
        const data = await res.json();
        const todos = [...new Set(data.map(d => d.year))].sort();
        ListaAños = todos;
        minAño = todos[0];
        maxAño = todos[todos.length - 1];
        añoSeleccionado = todos[0];
    }

    async function getTodosLosPaises() {
        const res = await fetch(BASE_URL + '?limit=1000');
        const data = await res.json();
        todosLosPaises = [...new Set(data.map(d => d.country))].sort();
    }

    async function getDatos(year) {
        const res = await fetch(BASE_URL + `?year=${year}&limit=1000`);
        const data = await res.json();
        paises = data.map(d => d.country);
        casosReportados = data.map(d => d.reportedCases);
        muertesReportadas = data.map(d => d.reportedDeaths);
        ratiosFatalidad = data.map(d => d.fatalityRate);
        regiones = data.map(d => d.whoRegion);
    }  
    //
function getDatosChart() {
    let valores;

    if (metricaSeleccionada === 'reportedCases') {
        valores = casosReportados;
    } else if (metricaSeleccionada === 'reportedDeaths') {
        valores = muertesReportadas;
    } else {
        valores = ratiosFatalidad;
    }

    const resultado = [];

    for (const pais of todosLosPaises) {
        const idx = paises.indexOf(pais);

        if (idx !== -1) {
            resultado.push({
                y: valores[idx] || 0,
                region: regiones[idx] || '',
                name: pais
            });
        } else {
            resultado.push({
                y: 0,
                region: '',
                name: pais
            });
        }
    }

    return resultado;
}

    async function update() { 
        await getDatos(añoSeleccionado);
        chart.setTitle({ text: `Cólera ${añoSeleccionado}` });
        chart.series[0].setData(getDatosChart(), true);
    }

    async function onRangeChange(e) { //salta al año mas cercano en caso de que el año no tenga datos
    const año = Number(e.target.value); //e es el evento y target.value es el valor en el que numerico que se selecciona
    let cercano = ListaAños[0];

    for (const actual of ListaAños) {
        const distanciaAct = Math.abs(actual - año);
        const distanciaCercano = Math.abs(cercano - año);

        if (distanciaAct < distanciaCercano) {
            cercano = actual;
        }
    }

    añoSeleccionado = cercano;
    await update();
}

    onMount(async () => {
        await getAños();
        await getTodosLosPaises();
        await getDatos(añoSeleccionado);

        chart = Highcharts.chart('container', {
            chart: { animation: { duration: 300 }, marginRight: 50 },
            title: { text: `Cólera ${añoSeleccionado}`, align: 'left' },
            legend: { enabled: false },
            xAxis: { categories: todosLosPaises },
            yAxis: { opposite: true, title: { text: null } },
            tooltip: {
                formatter: function() {
                    return `<b>${this.point.name}</b><br/>
                            Región: ${this.point.region}<br/>
                            Valor: ${Highcharts.numberFormat(this.y, 0)}`;
                }
            },
            plotOptions: {
                series: {
                        animation: false,
                        groupPadding: 0,
                        pointPadding: 0.1,
                        borderWidth: 0,
                        colorByPoint: true,
                        type: 'bar',
                        dataLabels: { enabled: true }
                    }
            },
            series: [{
                type: 'bar',
                name: String(añoSeleccionado),
                data: getDatosChart()
            }]
        });
    });
</script>

<div class="controls">
    <label>Año: <strong>{añoSeleccionado}</strong>
        <input
            type="range"
            value={añoSeleccionado}
            min={minAño}
            max={maxAño}
            onchange={onRangeChange}
        />
    </label>

    <label>Métrica:
        <select bind:value={metricaSeleccionada} onchange={update}>
            <option value="reportedCases">Casos reportados</option>
            <option value="reportedDeaths">Muertes reportadas</option>
            <option value="fatalityRate">Ratio de fatalidad</option>
        </select>
    </label>
</div>

<div id="container"></div>

<style>
    .controls {
        max-width: 1000px;
        margin: 1em auto;
        display: flex;
        gap: 2em;
        align-items: center;
    }

    input[type="range"] {
        width: 300px;
    }

    #container {
        height: 1800px;
        max-width: 1000px;
        margin: 0 auto;
    }
</style>