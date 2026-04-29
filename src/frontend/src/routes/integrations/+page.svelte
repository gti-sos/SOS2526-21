<script>
import Highcharts from "highcharts";
import { dev } from '$app/environment';
import { onMount } from 'svelte';
	import { randomBytes } from "node:crypto";
	import { listen } from "node:quic";



//Iván

//--Lana 
let BASE_API_WOOL="/api/v2/wool-stats"; //esperar al sitio en render
let wool_chart=$state();
let wool_data=$state();

//-----Filtros lana
let inputFlujo=$state("export");
let inputAno=$state(2014);

//-----Funciones Lana

async function getDatosLana(){

    let res=await fetch(BASE_API_WOOL + `?flowdesc=${inputFlujo}&period=${inputAno}`,{method:'GET'});
    const data=await res.json();
    let aux=[];
    for(let w of data){
        aux.push({name:`${w.reporterdesc}`,y:`${w.qty}`}) //qty son kilos
    }
    wool_data=aux;
    wool_chart.series[0].setData(wool_data);

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


//--Gatitos

let BASE_API_FACTS_GATOS="https://catfact.ninja/fact";
let BASE_API_FOTOS_GATOS="/api/v1/catImage";

let fotoGato=$state("https://i.pinimg.com/736x/6d/28/48/6d2848a51c9e54685028e4f625cabeb9.jpg");
let catFact=$state("Los gatos son curiosos");

//--funcion gatitos 

async function getDatosGatos(){

    let res1=await fetch(BASE_API_FOTOS_GATOS,{method:'GET'});
    let foto=await res1.json();
    let res2=await fetch(BASE_API_FACTS_GATOS,{method:'GET'});
    let fact=await res2.json();


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

   console.log("stat1:",statpk1);
   console.log("stat2:",statpk2);

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

//María

//Daniel


//onMount

onMount(async ()=>{
    const VariwideModule = (await import('highcharts/modules/variwide')).default;

   /* wool_chart=Highcharts.chart('g20-wool-stats', {
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
});  */

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
            format: '€{point.y:.0f}'
        },
        tooltip: {
            pointFormat: 'Labor Costs: <b>€ {point.y}/h</b><br>' +
                'GDP: <b>€ {point.z} million</b><br>'
        },
        borderRadius: 3,
        colorByPoint: true
    }]

});



});

//----------------------------------






</script>

<h2>Integraciones de Iván Arriaza Domínguez</h2>

<h3>Datos de Importación/Exportación de Lanas</h3>
<div>
    <input bind:value={inputFlujo} placeholder="Import/Export">
    <input bind:value={inputAno} placeholder="2014/2015">
    <button onclick={getDatosLana}>Buscar</button>
</div>
<div id="g20-wool-stats"></div>

<h3>Datos de Felicidad</h3>
<div>
    <input bind:value={inputAnoHappiness} placeholder="2020">
    <button onclick={getDatosFelicidad}>Buscar</button>
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

<button onclick={getDatosPokemone}>Quiero Jugar ^^</button>

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




<h2>Integraciones de María Torres Chacón</h2>

<h2>Integraciones de Daniel de la Rosa Fernández</h2>
