<script>

import { dev } from '$app/environment';
import { onMount } from 'svelte';
import Highcharts from 'highcharts';

//María-----------------------------------------------------------------------------------------------------------

//api kakapo
let BASE_URL_KAKAPO = "https://api.inaturalist.org/v1/observations?taxon_name=Strigops+habroptilus&quality_grade=research&only_id=false&fields=id,uri,observed_on,place_guess,description,taxon";
let kakapo_data= $state([]);
let kakapo_card= $state();

async function get_kakapo(){
  let res= await fetch(BASE_URL_KAKAPO, {method: 'GET'});
  let data = await res.json();
  let kakapos = [];

  for (let obs of data.results) {
    kakapos.push({
      id: obs.id,
      url: obs.uri,
      observed_on: obs.observed_on,
      place: obs.place_guess,
      description: obs.description,
      species: obs.taxon?.preferred_common_name,
      scientific_name: obs.taxon?.name,
      conservation_status: obs.taxon?.conservation_status?.status_name,
      image: obs.photos?.[0]?.url?.replace("square", "medium") ?? obs.taxon?.default_photo?.medium_url,
    });
  }
  kakapo_data=kakapos;
  kakapo_random();
}
function kakapo_random() {
  let i = Math.floor(Math.random() * kakapo_data.length);
  kakapo_card = kakapo_data[i];
}









//api cholera-stats

let BASE_URL_CHOLERA_STATS= "/api/v1/cholera-stats"
let cholera_stats_data=$state();
let años_cholera_stats=$state();
let cholera_data_fatality = $state([]);

async function get_cholera_stats(){
  let res = await fetch(BASE_URL_CHOLERA_STATS, {method:'GET'});
  let data = await res.json();
  cholera_stats_data = data;
  console.log("cholera ejemplo:", data[0]);
}


console.log("donde el cholera");

//api spice-stats

let BASE_URL_SPICE_STATS="https://sos2526-20-stable.onrender.com/api/v2/spice-stats/";
let spice_stats_data = $state([]);
let filtroPais = $state("Afghanistan");

let paises_spice_stats = $state([]);
let chartElement_spice;  
let chart_spice_stats;        
let años_spice_stats = $state([]);

console.log("antes del picante");


async function get_spice_stats(){
  let res = await fetch(BASE_URL_SPICE_STATS + `?area=${filtroPais}&limit=10`, {method:'GET'});
  let json = await res.json();
  let data = json.data;

  // Acumular consumo por año
  let porAño = {};
  for (let d of data){
    if (porAño[d.year]){
      porAño[d.year] += d.consumption;
    } else {
      porAño[d.year] = d.consumption;
    }
  }

  let añosOrdenados = [];
  for (let año in porAño){
    añosOrdenados.push(año);
  }
  añosOrdenados.sort((a, b) => a - b);  

  //ordenar consumo por año
  let consumos = [];
  for (let año of añosOrdenados){
    consumos.push(porAño[año]);
  }

  años_spice_stats = añosOrdenados;
  spice_stats_data = consumos;
}

async function load_spice_stats(){
  console.log("el load");
  let res = await fetch(BASE_URL_SPICE_STATS+"loadInitialData", {method:'GET'})
  console.log("éxito");
}

async function get_paises_spice_stats(){
  console.log("coge paises");
  let res = await fetch(BASE_URL_SPICE_STATS+ `?limit=10`, {method:'GET'});
  let json = await res.json();
  let data = json.data.sort((a, b) => a.year - b.year);
  

  let aux=[];
  for (let d of data){
     if (!aux.includes(d.area)) {  
      aux.push(d.area);
    }
  }
  paises_spice_stats=aux;
  
}


//api space-launches

let BASE_URL_SPACE_LAUNCHES="https://space-launches-8cix.onrender.com/api/v2/space-launches";
let space_launches_data= $state();
let tabla_space_launches;

async function get_space_launches(){
   let res = await fetch(BASE_URL_SPACE_LAUNCHES + "?limit=100", {method:'GET'})
  let json = await res.json();
  space_launches_data =json;
  console.log("espacio:", space_launches_data);
}


async function load_space_launches(){
  console.log("el load");
  let res = await fetch("https://space-launches-8cix.onrender.com/api/v2/space-launches/loadInitialData", {method:'GET'})
  console.log("espacio array obj:", res);
}

//api mid-population-ages

let BASE_URL_MID_POPULATION_AGES= "https://sos2526-12.onrender.com/api/v2/mid-population-ages";
let mid_population_ages_data= $state([]);
let chart_donut;
let chartElement_mid_ages_population;  
let filtro_año_mid_population_ages=$state(1979);
let filtro_pais_mid_population_ages=$state("Afghanistan");
let paises_mid_population_ages=$state([]);
let años_mid_population_ages=$state([]);
let filtro_sexo_mid_population_ages = $state("Male");
let sin_datos_mid_population_ages = $state(false);

async function get_mid_population_ages(){
  let res = await fetch(BASE_URL_MID_POPULATION_AGES+`?country_name=${filtro_pais_mid_population_ages}`+`&year=${filtro_año_mid_population_ages}`+`&sex=${filtro_sexo_mid_population_ages}`, {method:'GET'});
  let data = await res.json();
  mid_population_ages_data=data; 
  console.log("datos de poblacion media", data);
}

async function get_paises_años_mid_population_ages(){
  let res = await fetch(BASE_URL_MID_POPULATION_AGES, {method:'GET'});
  let data = await res.json();
  let años=[];
  let paises=[];
  for(let d of data){
    if(!años.includes(d.year)) años.push(d.year);
    if(!paises.includes(d.country_name)) paises.push(d.country_name);
  }
  paises_mid_population_ages=paises;
  años_mid_population_ages=años;
}



async function render_mid_population_ages() {
  await get_mid_population_ages();
  if(!mid_population_ages_data || mid_population_ages_data.length === 0) {
    sin_datos_mid_population_ages = true;
    console.log("no hay datos para esa combinacion");
    return;
  }sin_datos_mid_population_ages = false;
  let d = mid_population_ages_data[0];
  chart_donut.load({
    columns: [
      ['0-25 años', d.population_age_0],
      ['25-50 años', d.population_age_25],
      ['50-75 años', d.population_age_50],
      ['75-100 años', d.population_age_75],
      ['100+ años', d.population_age_100],
    ]
  });
  chart_donut.internal.main.select('.c3-chart-arcs-title')
  .text(`${filtro_pais_mid_population_ages} ${filtro_año_mid_population_ages}`);
}

async function load_mid_population_ages(){
  console.log("el load");
  let res = await fetch(BASE_URL_MID_POPULATION_AGES+"/loadInitialData", {method:'GET'});
  console.log("los datos de edad media:", res);
}


//api renewable-energy-consumptions

let BASE_URL_RENEWABLE_ENERGY_COMSUMPTIONS="https://api-sos.pablogamero.com/api/v1/renewable-energy-consumptions?limit=1000";
let renewable_energy_consumptions_data= $state([]);
let cholera_renewable_paises= $state([]);
let renewable_data_hidro = $state([]);

async function load_cholera_renewable(){
  console.log("el load");
  let colera = await fetch(BASE_URL_CHOLERA_STATS+"/loadInitialData", {method:'GET'});
  let energia = await fetch(BASE_URL_RENEWABLE_ENERGY_COMSUMPTIONS+"/loadInitialData", {method:'GET'});

  console.log("colera:", colera);
  console.log("energia:", energia);


}

async function get_renewable_energy_consumptions(){

  let res = await fetch(BASE_URL_RENEWABLE_ENERGY_COMSUMPTIONS, {method:'GET'});
  let data = await res.json();
  console.log("IMPRIME LOS DATOS QUE COGE DE ENERGIA PORFA", data);

  renewable_energy_consumptions_data=data;

  
}
//funcion para construir las columnas de forma que se haga la media de todos los años del pais
function procesar_cholera_renewable() {
  console.log("cholera_stats_data length:", cholera_stats_data.length);
  console.log("renewable_energy_consumptions_data length:", renewable_energy_consumptions_data.length);
  // media por pais del colera
  let fatality_suma = {};
  let fatality_count = {};
  for (let d of cholera_stats_data) {
    if (d.fatalityRate != null) {
      if (fatality_suma[d.country]=== undefined) {
        fatality_suma[d.country] = 0;
        fatality_count[d.country] = 0;
      }
      fatality_suma[d.country] += d.fatalityRate;
      fatality_count[d.country] += 1;
    }
  }

  let fatality_media = {};
  for (let pais in fatality_suma) {
    fatality_media[pais] = fatality_suma[pais] / fatality_count[pais];
  }

  // media por pais del renewable
  let hidro_suma = {};
  let hidro_count = {};
  for (let d of renewable_energy_consumptions_data) {
    if (d.hydro != null) {
      if (hidro_suma[d.country]===undefined) {
        hidro_suma[d.country] = 0;
        hidro_count[d.country] = 0;
      }
      hidro_suma[d.country] += d.hydro;
      hidro_count[d.country] += 1;
    }
  }

  let hidro_media = {};
  for (let pais in hidro_suma) {
    hidro_media[pais] = hidro_suma[pais] / hidro_count[pais];
  }

  // tomar los paises en comun
  let paises_comunes = [];
  for (let pais in fatality_media) {
    if (hidro_media[pais] !== undefined) {
      paises_comunes.push(pais);
    }
  }
  paises_comunes.sort();

  
  let col_paises = ["x"];
  let col_fatality = ["Fatalidad Cólera (%)"];
  let col_hidro = ["Consumo Hidroeléctrico (%)"];

  for (let pais of paises_comunes) {
    col_paises.push(pais);
    col_fatality.push(fatality_media[pais]);
    col_hidro.push(hidro_media[pais]);
  }

  cholera_renewable_paises = col_paises;
  cholera_data_fatality = col_fatality;
  renewable_data_hidro = col_hidro;

  console.log("los paises columnas:", cholera_renewable_paises);
  console.log("las medias colera:", cholera_data_fatality);
  console.log("las medias energia:", renewable_data_hidro);

}

//api literacy-rates

let BASE_URL_LITERACY_RATES="https://sos2526-11.onrender.com/api/v1/literacy-rates";
let literacy_rates_data= $state([]);
let colera_alfabetismo_chart;
let años_literacy_rates=$state([]);
let filtro_pais_cholera_alfabetismo=$state("Spain");
let paises_colera_alfabetismo = $state([]);

//load de colera y alfabetismo 

async function load_cholera_literacy(){
  console.log("el load");
  let colera = await fetch(BASE_URL_CHOLERA_STATS+"/loadInitialData", {method:'GET'})
  let alfabetismo = await fetch(BASE_URL_LITERACY_RATES+"/loadInitialData", {method:'GET'})
  console.log("espacio array obj:", colera);
  console.log("espacio array obj:", alfabetismo);
}

async function get_literacy_rates(){
  let res = await fetch(BASE_URL_LITERACY_RATES, {method:'GET'});
  let data = await res.json();
  literacy_rates_data = data;
  console.log("literacy ejemplo:", data[0]);
}

//para pillar los paises comunes de ambos para el desplegable 

function get_paises_comunes() {
  let paises_literacy = [];
  for (let d of literacy_rates_data) {
    if(!paises_literacy.includes(d.country)){
    paises_literacy.push(d.country);
    }
  }
  let aux = [];
  for (let d of cholera_stats_data) {
    if (paises_literacy.includes(d.country) && !aux.includes(d.country)) {
      aux.push(d.country);
    }
  }
  aux.sort();
  paises_colera_alfabetismo = aux;
}

function procesar_colera_alfabetismo() {
  let colera_por_año = {};
  for (let d of cholera_stats_data) {
    if (d.country === filtro_pais_cholera_alfabetismo && d.fatalityRate != null) {
      colera_por_año[d.year] = d.fatalityRate;
    }
  }

  let alfabetismo_por_año = {};
  for (let d of literacy_rates_data) {
    if (d.country === filtro_pais_cholera_alfabetismo && d.total != null) {
      alfabetismo_por_año[d.year] = d.total;
    }
  }

  let todos_años = [];
  for (let y of Object.keys(colera_por_año)) {
    if (!todos_años.includes(Number(y))) todos_años.push(Number(y));
  }
  for (let y of Object.keys(alfabetismo_por_año)) {
    if (!todos_años.includes(Number(y))) todos_años.push(Number(y));
  }
  todos_años.sort((a, b) => a - b);

  let puntos_colera = [];
  let puntos_alfabetismo = [];
  for (let y of todos_años) {
    if (colera_por_año[y] !== undefined) {
      puntos_colera.push([y, colera_por_año[y]]);
    } else {
      puntos_colera.push([y, null]);
    }

    if (alfabetismo_por_año[y] !== undefined) {
      puntos_alfabetismo.push([y, alfabetismo_por_año[y]]);
    } else {
      puntos_alfabetismo.push([y, null]);
    }
  
  }

  return { puntos_colera, puntos_alfabetismo };
}

function render_colera_alfabetismo() {
  let { puntos_colera, puntos_alfabetismo } = procesar_colera_alfabetismo();
  colera_alfabetismo_chart.series[0].setData(puntos_colera);
  colera_alfabetismo_chart.series[1].setData(puntos_alfabetismo);
  colera_alfabetismo_chart.title.update({ text: `Fatalidad cólera vs Alfabetismo — ${filtro_pais_cholera_alfabetismo}` });
}


onMount(async ()=>{
get_kakapo();

//maria-colera-alfabetismo
await get_cholera_stats();
await get_literacy_rates();
get_paises_comunes();
filtro_pais_cholera_alfabetismo = paises_colera_alfabetismo[paises_colera_alfabetismo.length - 1];

let { puntos_colera, puntos_alfabetismo } = procesar_colera_alfabetismo();

colera_alfabetismo_chart = Highcharts.chart('colera-alfabetismo-chart', {
  chart: { type: 'area' },
  title: { text: `Fatalidad cólera vs Alfabetismo — ${filtro_pais_cholera_alfabetismo}` },
  xAxis: { allowDecimals: false },
  yAxis: [
    { title: { text: 'Fatalidad cólera (%)' }, labels: { format: '{value}%' } },
    { title: { text: 'Alfabetismo (%)' }, labels: { format: '{value}%' }, opposite: true }
  ],
  tooltip: { shared: true, pointFormat: '{series.name}: <b>{point.y:.2f}%</b><br/>' },
  plotOptions: {
    area: { connectNulls: false, marker: { enabled: true } }
  },
  series: [
    { name: 'Fatalidad cólera', yAxis: 0, data: puntos_colera },
    { name: 'Alfabetismo', yAxis: 1, data: puntos_alfabetismo }
  ]
});


//maria-picante--------------------------------------------------------------------
const c3 = (await import('c3')).default;
console.log("mi picante mount");
await get_paises_spice_stats();
await get_spice_stats();

console.log("paises:", paises_spice_stats);
console.log("datos:", spice_stats_data);
console.log("años:", años_spice_stats);
console.log("elemento:", chartElement_spice);

chart_spice_stats = c3.generate({
    bindto: chartElement_spice,
    data: {
        columns: [['Consumo', ...spice_stats_data]]     
        ,
        type: 'bar'
    },
    axis: {
        x: {
          type: 'category',
          categories: años_spice_stats, 
          label: { text: 'Año', position: 'outer-center' }
        },
        y: {
          label: { text: 'Consumo', position: 'outer-middle' }
        }
      },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
    }

});

//maria-espacio-------------------------------------------------------------------------------------
    const { TabulatorFull } = await import('tabulator-tables');
    await import('tabulator-tables/dist/css/tabulator.min.css');

    await get_space_launches();

    tabla_space_launches = new TabulatorFull("#table-space", {
    height:"311px",
    width: "100%",
    data: space_launches_data,
    columns:[
    {title:"mission_id", field:"mission_id"},
    {title:"company_name", field:"company_name"},
    {title:"location", field:"location"},
    {title:"year", field:"year"},
    {title:"rocket_name", field:"rocket_name"},
    {title:"mission_status", field:"mission_status"},
    {title:"country", field:"country"},
    ],
});


//maria-colera-energia

  await import('billboard.js/dist/billboard.css');
  const { default: bb, bar } = await import('billboard.js');


  await get_cholera_stats();
  await get_renewable_energy_consumptions();

  procesar_cholera_renewable();

  var chart = bb.generate({
  data: {
    x: "x",
    columns: [
      cholera_renewable_paises,
      cholera_data_fatality,
      renewable_data_hidro
    ],
    type: bar(), 
  },
 axis: {
    x: {
      type: "category",
      tick: { rotate: 45, multiline: false }
    },
    y: {
      label: { text: "Media (%)", position: "outer-middle" }
    }},
  bindto: "#chartElement_cholera_renewable"
});

//maria-edad-media
await get_paises_años_mid_population_ages();
await get_mid_population_ages(); 


let d = mid_population_ages_data[0]; //por que devuelve un array con los resultados q coinciden con el filtro pero solo debo tomar el objeto que tiene
chart_donut = c3.generate({
  bindto: chartElement_mid_ages_population,
  data: {
    columns: [
      ['0-25 años', d.population_age_0],
      ['25-50 años', d.population_age_25],
      ['50-75 años', d.population_age_50],
      ['75-100 años', d.population_age_75],
      ['100+ años', d.population_age_100],
    ],
    type: 'donut'
  },
  donut: {
    title: `${filtro_pais_mid_population_ages} ${filtro_año_mid_population_ages}`
  }
});

});

//----------------------------------

</script>

<h2>Integraciones de María Torres Chacón</h2>

<h2>KAKAPO ALEATORIO</h2>
    <button onclick={kakapo_random}>Otro kākāpō</button>
{#if kakapo_card}
  <div class="card">
    <img src={kakapo_card.image} alt={kakapo_card.species} />
    <div class="info">
      <h3>Especie: {kakapo_card.species}</h3>
      <p>Nombre científico: {kakapo_card.scientific_name}</p>
      <p>Ubicación: {kakapo_card.place ?? "Ubicación desconocida"}</p>
      <p>fecha del avistamiento: {kakapo_card.observed_on}</p>
      <p>Estado de conservación: {kakapo_card.conservation_status}</p>
      {#if kakapo_card.description}
        <p>Descripcion: {kakapo_card.description}</p>
      {/if}
      <a href={kakapo_card.url} target="_blank">Ver en iNaturalist</a>
    </div>
   
  </div>
{:else}
  <p>Cargando...</p>
{/if}



<!-- maria-picante-chart -->
<h3>Estadísticas de consumo de picante en Afghanistan (tipo bar de libreria c3)</h3>
<button onclick={load_spice_stats}>cargar datos iniciales</button>

<div bind:this={chartElement_spice}></div>
  
<!-- maria-espacio-chart -->
<h3>Visualizacion de lanzamientos espaciales (table de libreria tabulator)</h3>
<button onclick={load_space_launches}>cargar datos iniciales</button>

<div id="table-space"></div>

<!-- maria-cholera-alfabetismo -->
<h3>INTEGRACIÓN: relacion entre porcentaje de fatalidad por cólera y alfabetismo (tipo area de hightcharts)</h3>
<button onclick={load_cholera_literacy}>cargar datos iniciales</button>

<select bind:value={filtro_pais_cholera_alfabetismo} onchange={render_colera_alfabetismo}>
  {#each paises_colera_alfabetismo as pais}
    <option value={pais}>{pais}</option>
  {/each}
</select>

<div id="colera-alfabetismo-chart"></div>

<!-- maria-colera-energia -->

<h3>INTEGRACIÓN: relacion entre porcentaje de fatalidad por cólera y consumo de energia renobables (tipo bar de libreria billboard)</h3>

<button onclick={load_cholera_renewable}>cargar datos iniciales</button>

<div id="chartElement_cholera_renewable"></div>

<!-- maria-edad-media -->
<h3>estadisticas de edad media (tipo donut de c3)</h3>

<button onclick={load_mid_population_ages}>cargar datos iniciales</button>

<select bind:value={filtro_pais_mid_population_ages} onchange={render_mid_population_ages}>
  {#each paises_mid_population_ages as pais}
    <option value={pais}>{pais}</option>
  {/each}
</select>

<select bind:value={filtro_año_mid_population_ages} onchange={render_mid_population_ages}>
  {#each años_mid_population_ages as año}
    <option value={año}>{año}</option>
  {/each}
</select>

<select bind:value={filtro_sexo_mid_population_ages} onchange={render_mid_population_ages}>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
</select>

  <p>(probar con spain 2022 por ejemplo para que la combinacion exista)</p>

{#if sin_datos_mid_population_ages}
  <br>
  <p>No hay datos para esa combinación de país, año y sexo</p>
  <br>
{/if}

<div bind:this={chartElement_mid_ages_population}></div>