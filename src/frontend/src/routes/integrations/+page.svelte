<script>

import Highcharts from "highcharts";
import ApexCharts from 'apexcharts';
import { dev } from '$app/environment';
import { onMount } from 'svelte';
	import { randomBytes } from "node:crypto";
	import { listen } from "node:quic";
	import { rmSync } from "node:fs";



//Iván

//--Mi API
let BASE_API_RELIGION="/api/v1/religious-believes-stats";
let religious_data=$state();

async function getDatosReligion(){
  
  let res=await fetch(BASE_API_RELIGION+"?year=2020",{method:'GET'});
  let data=await res.json();
  return data;
}




//--Lana 
let BASE_API_WOOL="https://sos2526-20-stable.onrender.com/api/v2/wool-stats"; //esperar al sitio en render
let wool_chart=$state();
let wool_data=$state(0);

//-----Filtros lana
let inputFlujo=$state("Export");
let inputAno=$state(2014);

//-----Funciones Lana

async function getDatosLana(){

    let res=await fetch(BASE_API_WOOL + `?flowdesc=${inputFlujo}&from=${inputAno}&to=${inputAno}`,{method:'GET'});
    const data=await res.json();
    let aux=[];
    for(let w of data.data){
        aux.push({name:`${w.reporterdesc}`,y:w.qty}) //qty son kilos
    }
    wool_data=aux;
    console.log(wool_data);
    wool_chart.series[0].setData(wool_data);


}

async function cargarDatosLana(){
  let res=await fetch(BASE_API_WOOL+"/loadInitialData");
  console.log("Datos de Lana cargados");
}

//--Indices de Felicidad

let BASE_API_HAPPINESS="https://sos2526-15.onrender.com/api/v2/happiness-indices";
let happines_chart=$state();
let happiness_data=$state();

//-----Filtros índices de felicidad

let inputAnoHappiness=$state(2020);

//-----Funciones índices de felicidad 

async function getDatosFelicidad(){
    let res=await fetch(BASE_API_HAPPINESS + `?year=${inputAnoHappiness}`,{method:'GET'});
    const data=await res.json();

    let aux=[];
    for (let h of data){
        aux.push([h.country,h.happiness_score,h.social_support]);

    }

    happiness_data=aux;

    happines_chart.series[0].setData(happiness_data);

    



}

async function loadDatosFelicidad(){
  let res=await fetch(BASE_API_HAPPINESS+"/loadInitialData",{method:'GET'});
  console.log("datos cargados");
  
}


<<<<<<< HEAD
=======

//--Estadísticas de Alcohol (INTEGRACION)
//Aclaracion: Usare mis datos de 2010 para la integracion, al ser mas razonables para datos de 2016 como los que ofrece la API


let BASE_API_ALCOHOL="https://sos2526-11.onrender.com/api/v2/alcohol-consumptions-per-capita";
let alcohol_data=$state();
let cristianoXalcohol_data=$state();
let sinReligionXalcohol_data=$state();

let paisesAlcohol=['Armenia','Belgium','Chile','Australia','Argentina', 'Brazil','Canada',
            'Angola','Austria','Albania'];
            
paisesAlcohol.sort();



async function getDatosAlcohol(){
  let aux=[]
  for(let p of paisesAlcohol){
    let res=await fetch(BASE_API_ALCOHOL+`/${p}/2016`,{method:'GET'});
    const data=await res.json();

    aux.push(data.alcohol_litre);

  }

  alcohol_data=aux;

  //Datos religion 
  let auxCristiano=[];
  let auxNoCreyente=[];
  for(let p of paisesAlcohol){
    let res2=await fetch(BASE_API_RELIGION + `/${p}/2010`);
    const data2=await res2.json();

    auxCristiano.push(data2.christian);
    auxNoCreyente.push(data2.no_religion);


  }
  cristianoXalcohol_data=auxCristiano;
  sinReligionXalcohol_data=auxNoCreyente;
}

async function cargarGraficoAlcohol(){

  await getDatosAlcohol();
  const options = {
          series: [{
          name: 'Poblacion cristiana (%)',
          data: cristianoXalcohol_data
        }, {
          name: 'Población no creyente (%)',
          data: sinReligionXalcohol_data
        }, {
          name: 'consumo de alcohol (Litro per-capita)',
          data: alcohol_data
        }],
          chart: {
          type: 'bar',
          height: 350,
          id: 'g11-alcohol'
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: paisesAlcohol,
        },
        yaxis: {
          title: {
            text: ''
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val;
            }
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#g11-alcohol"), options);
        chart.render();
}


//Estadisticas de Fertilidad

let BASE_API_FERTILLITY="https://sos2526-12.onrender.com/api/v2/age-specific-fertility-rates";

let fertility_data_15_19=$state();
let fertility_data_20_24=$state();
let fertility_chart=$state();
let fertility_paises=$state();
let fertility_religious_data=$state();


async function getDatosFertilidad(){

  let res=await fetch(BASE_API_FERTILLITY+'?year=2020');
  const data=await res.json();

  let paises=[] 
  let auxFertility_15_19=[];
  let auxFertility_20_24=[];

  for (let f of data){
    paises.push(f.country_name);
    auxFertility_15_19.push(f.fert_15_19);
    auxFertility_20_24.push(f.fert_20_24);

  }

  fertility_data_15_19=auxFertility_15_19;
  fertility_data_20_24=auxFertility_20_24;

  fertility_paises=paises;

  let auxReligious=[];

  for(let p of fertility_paises){
    let res2=await fetch(BASE_API_RELIGION + `/${p}/2020`);
    const data2=await res2.json();

    auxReligious.push(parseFloat(data2.hindu));
  }

  fertility_religious_data=auxReligious;
  console.log(fertility_religious_data);

  fertility_chart.xAxis[0].setCategories(fertility_paises);
  fertility_chart.series[0].setData(fertility_data_15_19);
  fertility_chart.series[1].setData(fertility_data_20_24);
  fertility_chart.series[2].setData(fertility_religious_data);

}

async function cargarDatosFertilidad(){
  let res=await fetch(BASE_API_FERTILLITY+'/loadInitialData');
  console.log("datos cargados");
}


























>>>>>>> 857928d9108be8e7be678368d5691145654d316f
//--Gatitos

let BASE_API_FACTS_GATOS="https://catfact.ninja/fact";
let BASE_API_FOTOS_GATOS="/api/v1/catImage";

let fotoGato=$state("https://i.pinimg.com/736x/6d/28/48/6d2848a51c9e54685028e4f625cabeb9.jpg");
let catFact=$state("Los gatos son curiosos");

//-----funcion gatitos 

async function getDatosGatos(){

    let res2=await fetch(BASE_API_FACTS_GATOS,{method:'GET'});
    let fact=await res2.json();
    let res1=await fetch(BASE_API_FOTOS_GATOS,{method:'GET'});
    let foto=await res1.json();
    


    fotoGato=foto[0].url;
    catFact=fact.fact;

}

//--Pokemone
let BASE_API_POKEMONE="https://pokeapi.co/api/v2/";

let stats=["hp","attack","defense","special-attack","special-defense","speed"];
let statElegida=$state("");

let resultado=$state("");
let racha=$state(0);


let pokemon1=$state("");
let fotopk1=$state("");
let statpk1=$state(0);
let gritopk1=$state("");


let pokemon2=$state("");
let fotopk2=$state("");
let statpk2=$state(0);
let gritopk2=$state("");

let idMin=1;
let idMax=1000;

//-----Funcion Pokemone

async function getDatosPokemone(){

   let id1=randomInt(idMin,idMax); //Id de los pokemon para solicitar a la API
   let id2=randomInt(idMin,idMax);

   let res1=await fetch(BASE_API_POKEMONE+`/pokemon/${id1}`,{method:'GET'});
   let pk1=await res1.json();

   let res2=await fetch(BASE_API_POKEMONE+`/pokemon/${id2}`,{method:'GET'});
   let pk2=await res2.json();

   let stat=randomItem(stats);
   statElegida=stat;
   

   //Sacamos la stat de los Pokemon deseada y su foto, asi como el grito

   let foto1=pk1.sprites.front_default;
   let nombre1=pk1.name;
   let stats1=pk1.stats;
   let grito1=pk1.cries.latest;

   let stat1=0;

   for (let i of stats1){
    if(stat===i.stat.name) stat1=i.base_stat;
   }




   let foto2=pk2.sprites.front_default;
   let nombre2=pk2.name;
   let stats2=pk2.stats;
   let grito2=pk2.cries.latest;

   let stat2=0;
   for (let i of stats2){
    if(stat===i.stat.name) stat2=i.base_stat;
   }

   

   //Asignamos los atributos a las variables globales

   pokemon1=nombre1;
   fotopk1=foto1;
   statpk1=stat1;
   gritopk1=grito1;


   pokemon2=nombre2;
   fotopk2=foto2;
   statpk2=stat2;
   gritopk2=grito2;

   

}

async function decidePregunta(primero){
    if(primero){
        if(statpk1>=statpk2){ 

            resultado="CORRECTO";
            racha=racha+1;
            let audio=new Audio(gritopk1);
            audio.play();

        }
        else{resultado="Que Pena, Has Fallado"; racha=0;}
        
    }else{
        if(statpk1>=statpk2){ resultado="Que Pena, Has Fallado"; racha=0;}
        else{
            resultado="CORRECTO";
            racha=racha+1;
            let audio=new Audio(gritopk2);
            audio.play();
        }
        
    }
    getDatosPokemone();
}














//-----Funcs auxiliares

function randomInt(idmin, idmax) {
  return Math.floor(Math.random() * (idmax - idmin + 1)) + idmin;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}


//Daniel---------------------------------------------------------------------------------------------------------


console.log("felicidad ok");

//María-----------------------------------------------------------------------------------------------------------

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

let BASE_URL_MID_POPULATION_AGES= "";
let mid_population_ages_data= $state();


async function get_mid_population_ages(){

  let res = await fetch(BASE_URL_MID_POPULATION_AGES, {method:'GET'});
  let data = await res.json();

  return data;

  
}


//api renewable-energy-consumptions

let BASE_URL_RENEWABLE_ENERGY_COMSUMPTIONS="https://sos2526-17.onrender.com/api/v1/renewable-energy-consumptions";
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

//crear el chart cada vez que se actualice el pais
function render_colera_alfabetismo() {
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
    puntos_colera.push([y, colera_por_año[y] !== undefined ? colera_por_año[y] : null]);
    puntos_alfabetismo.push([y, alfabetismo_por_año[y] !== undefined ? alfabetismo_por_año[y] : null]);
  }

  Highcharts.chart('colera-alfabetismo-chart', {
    chart: { type: 'area' },
    title: { text: `Fatalidad cólera vs Alfabetismo — ${filtro_pais_cholera_alfabetismo}` },
    xAxis: { allowDecimals: false },
    yAxis: [
      { title: { text: 'Fatalidad cólera (%)' }, labels: { format: '{value}%' } },
      { title: { text: 'Alfabetismo (%)' }, labels: { format: '{value}%' }, opposite: true }
    ],
    tooltip: { shared: true, pointFormat: '{series.name}: <b>{point.y:.2f}%</b><br/>' },
    plotOptions: {
      area: {
        connectNulls: false,
        marker: { enabled: true }
      }
    },
    series: [
      { name: 'Fatalidad cólera', yAxis: 0, data: puntos_colera },
      { name: 'Alfabetismo', yAxis: 1, data: puntos_alfabetismo }
    ]
  });
}




//onMount
console.log("antes del mount");
onMount(async ()=>{

  console.log("el mount");
    const VariwideModule = (await import('highcharts/modules/variwide')).default;


//Gráfico de LANA
    wool_chart=Highcharts.chart('g20-wool-stats', {
    chart: {
        type: 'pie',
        zooming: {
            type: 'xy'
        },
        panning: {
            enabled: true,
            type: 'xy'
        },
        panKey: 'shift'
    },
    title: {
        text: 'Estadísticas de importación/exportación de lana en 2014/2015'
    },
    tooltip: {
        valueSuffix: ''
    },
    
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: [{
                enabled: true,
                distance: 20
            }, {
                enabled: true,
                distance: -40,
                format: '{point.percentage:.1f}',
                style: {
                    fontSize: '1.2em',
                    textOutline: 'none',
                    opacity: 0.7
                },
                filter: {
                    operator: '>',
                    property: 'percentage',
                    value: 10
                }
            }]
        }
    },
    series: [
        {
            name: 'Exportaciones/Importaciones de Lana',
            colorByPoint: true,
            data: wool_data
        }
    ]
});  

//Gráfico de Felicidad

happines_chart=Highcharts.chart('g15-happiness-indices', {

    chart: {
        type: 'variwide'
    },

    title: {
        text: 'Índices de felicidad por país y año'
    },

    caption: {
        text: 'Ancho de columna proporcional al soporte social dado por el país'
    },

    xAxis: {
        type: 'category'
    },

    

    legend: {
        enabled: false
    },

    series: [{
        name: 'Índices de felicidad',
        data: happiness_data,
        dataLabels: {
            enabled: true,
            format: '{point.y:.0f}'
        },
        tooltip: {
            pointFormat: 'Índice Felicidad: <b>{point.y}</b><br>' +
                'Apoyo Social: <b>{point.z}</b><br>'
        },
        borderRadius: 3,
        colorByPoint: true
    },
  
  ]

});

<<<<<<< HEAD
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

//maria-colera-alfabetismo
await get_cholera_stats();
await get_literacy_rates();
get_paises_comunes();
filtro_pais_cholera_alfabetismo = paises_colera_alfabetismo[paises_colera_alfabetismo.length -1];
render_colera_alfabetismo();

console.log("paises comunes:", paises_colera_alfabetismo);



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



=======
//Grafico alcohol

cargarGraficoAlcohol();

//Grafico Fertilidad
fertility_chart= Highcharts.chart('g12-fertility', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Ratio de fertilidad por edad y estadisticas religiosas en 2020'
    },
    
    xAxis: {
        categories: fertility_paises,
        title: {
            text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        },
        gridLineWidth: 0
    },
    tooltip: {
        valueSuffix: ''
    },
    plotOptions: {
        bar: {
            borderRadius: '50%',
            dataLabels: {
                enabled: true
            },
            groupPadding: 0.1
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: 'var(--highcharts-background-color, #ffffff)',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        name: '% Fertilidad Edad 15-19',
        data: fertility_data_15_19
    }, {
        name: '% Fertilidad Edad 20-24',
        data: fertility_data_20_24
    }, {
        name: '% Poblacion Indu',
        data: fertility_religious_data
    }]
});
>>>>>>> 857928d9108be8e7be678368d5691145654d316f


});

//----------------------------------



</script>

<h2>Integraciones de Iván Arriaza Domínguez</h2>

<h3>Datos de Importación/Exportación de Lanas</h3>
<div>
    <input bind:value={inputFlujo} placeholder="Import/Export">
    <input bind:value={inputAno} placeholder="2014/2015">
    <button onclick={getDatosLana}>Buscar</button>
    <button onclick={cargarDatosLana}>Cargar Datos de Lana</button>
</div>
<div id="g20-wool-stats"></div>

<h3>Datos de Felicidad</h3>
<div>
    <input bind:value={inputAnoHappiness} placeholder="2020">
    <button onclick={getDatosFelicidad}>Buscar</button>
    <button onclick={loadDatosFelicidad}>Cargar Datos de Felicidad</button>
</div>
<div id="g15-happiness-indices"></div>

<h3>Datos de Gatitos</h3>

<div id="almendra">
    <article class="card">
  <img src={fotoGato} alt={"Foto de gato"} />
  <div class="content">
    <p>{catFact}</p>
    <button onclick={getDatosGatos}>Quiero más datos</button>
  </div>
</article>

</div>


<h3>Preguntas de Pokemones</h3>

<div>
    <button onclick={getDatosPokemone}>Quiero Jugar ^^</button>
</div>
<div>¿Qué Pokémon tiene más {statElegida}?</div>

<div>
    Tu racha es de {racha} puntos;
</div>
<div>
    {resultado}
</div>
<div class="card">
    <div>
        {pokemon1}
        <img src={fotopk1} alt="pkmn1 aquí">

        <button onclick={()=>decidePregunta(true)}>Elijo el Primero</button>
    </div>
    <div>
        {pokemon2}
        <img src={fotopk2} alt="pkmn2 aquí">
        <button onclick={()=>decidePregunta(false)}>Elijo el segundo </button>
    </div>
    
</div>

<<<<<<< HEAD
=======
<h3>Estadísticas de Alcohol (Integración)</h3>
>>>>>>> 857928d9108be8e7be678368d5691145654d316f


<h3>Estadísticas de Fertilidad (Integración)</h3>

<button onclick={cargarDatosFertilidad}>Cargar Datos Fertilidad</button>
<button onclick={getDatosFertilidad}>Mostrar Gráfico</button>
<div id="g12-fertility"></div>

<h2>Integraciones de Daniel de la Rosa Fernández</h2>



<h2>Integraciones de María Torres Chacón</h2>

<!-- maria-picante-chart -->
<h3>Estadísticas de consumo de picante en Afghanistan (tipo bar de libreria c3)</h3>
<button onclick={load_spice_stats}>cargar datos iniciales</button>
<button onclick={get_spice_stats}>recargar grafico</button>

<div bind:this={chartElement_spice}></div>
  
<!-- maria-espacio-chart -->
<h3>Visualizacion de lanzamientos espaciales (table de libreria tabulator)</h3>
<button onclick={load_space_launches}>cargar datos iniciales</button>
<button onclick={get_space_launches}>recargar grafico</button>

<div id="table-space"></div>

<!-- maria-cholera-alfabetismo -->
<h3>INTEGRACIÓN: relacion entre porcentaje de fatalidad por cólera y alfabetismo (tipo area de hightcharts)</h3>
<select bind:value={filtro_pais_cholera_alfabetismo} onchange={render_colera_alfabetismo}>
  {#each paises_colera_alfabetismo as pais}
    <option value={pais}>{pais}</option>
  {/each}
</select>


<div id="colera-alfabetismo-chart"></div>

<!-- maria-colera-energia -->

<h3>INTEGRACIÓN: relacion entre porcentaje de fatalidad por cólera y consumo de energia renobables (tipo bar de libreria billboard)</h3>

<button onclick={load_cholera_renewable}>cargar datos iniciales</button>
<button onclick={() => { get_cholera_stats(); get_renewable_energy_consumptions(); }}>recargar grafico</button>

<div id="chartElement_cholera_renewable"></div>



<!-- maria-edad-media -->

<h3>estadisticas de edad media (tipo donut de c3)</h3>














<style>
  /* ── Base ── */
  :global(body) {
    font-family: system-ui, sans-serif;
    background: #fafaf8;
    color: #1a1a1a;
  }

  /* ── Títulos de autor ── */
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    padding: 0.6rem 1rem;
    border-radius: 10px;
    margin-bottom: 0.25rem;
  }

  h3 {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  /* ── Inputs ── */
  input {
    height: 36px;
    padding: 0 12px;
    font-size: 14px;
    border-radius: 8px;
    border: 1.5px solid #ddd;
    outline: none;
    background: #fff;
    transition: box-shadow 0.15s;
  }

  input:focus {
    box-shadow: 0 0 0 2px #c8b8a2;
  }

  /* ── Botones base ── */
  button {
    height: 36px;
    padding: 0 16px;
    font-size: 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: filter 0.15s, transform 0.1s;
  }

  button:hover { filter: brightness(0.93); }
  button:active { transform: scale(0.97); }

  /* ══════════════════════════════════
     SECCIÓN LANA — tierra y cañamo
  ══════════════════════════════════ */
  h2:first-of-type {
    background: #f0e6d3;
    color: #6b4c2a;
    border-left: 4px solid #c8935a;
  }

  /* h3 de lana y felicidad (primeros dos) */
  h3:nth-of-type(1),
  h3:nth-of-type(2) {
    color: #7a5230;
  }

  div:has(> input):nth-of-type(1) button,
  div:has(> input):nth-of-type(2) button {
    background: #c8935a;
    color: #fff;
  }

  #g20-wool-stats,
  #g15-happiness-indices {
    border: 1.5px solid #e0c9a6;
    border-radius: 12px;
    overflow: hidden;
    min-height: 300px;
    background: #fffcf7;
  }

  /* ══════════════════════════════════
     SECCIÓN GATITOS — rosa + crema
  ══════════════════════════════════ */
  h3:nth-of-type(3) {
    color: #b05070;
  }

  #almendra {
    background: #fff0f4;
    border-radius: 14px;
    padding: 1rem;
    border: 1.5px solid #f5c6d5;
    max-width: 500px;
  }

  #almendra .card {
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    border: none;
    background: #fff;
    box-shadow: 0 1px 6px rgba(180, 80, 100, 0.1);
  }

  #almendra .card img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    flex-shrink: 0;
  }

  #almendra .card .content {
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    justify-content: center;
  }

  #almendra .card .content p {
    font-size: 14px;
    color: #7a4a5a;
    line-height: 1.6;
  }

  #almendra .card .content button {
    background: #e87a9a;
    color: #fff;
    align-self: flex-start;
  }

  /* ══════════════════════════════════
     SECCIÓN POKÉMON — rojo + amarillo
  ══════════════════════════════════ */
  h3:nth-of-type(4) {
    color: #cc2200;
  }

  /* Botón "Quiero Jugar" */
  h3:nth-of-type(4) + button {
    background: #cc2200;
    color: #fff;
    border-radius: 20px;
    padding: 0 20px;
    height: 38px;
  }

  /* Pregunta y racha */
  h3:nth-of-type(4) ~ div:not(.card) {
    font-size: 14px;
    font-weight: 500;
    color: #555;
    margin: 0.15rem 0;
  }

  /* Tarjeta Pokémon */
  .card:has(> div > img[alt="pkmn1 aquí"]) {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    background: transparent;
  }

  .card > div {
    flex: 1;
    min-width: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.25rem 1rem;
    border-radius: 14px;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    text-transform: capitalize;
    background: #fff8e1;
    border: 2px solid #f5c400;
    color: #7a5800;
  }

  .card > div img {
    width: 96px;
    height: 96px;
    image-rendering: pixelated;
  }

  .card > div button {
    background: #f5c400;
    color: #5a3e00;
    border-radius: 20px;
    margin-top: 0.25rem;
  }

  /* ── Headings de María y Daniel ── */
  h2:nth-of-type(2),
  h2:nth-of-type(3) {
    background: #f0f0f0;
    color: #888;
    border-left: 4px solid #ccc;
    font-style: italic;
  }
</style>