<script>
import Highcharts from "highcharts";
import { dev } from '$app/environment';
import { onMount } from 'svelte';



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


<h2>Integraciones de María Torres Chacón</h2>

<h2>Integraciones de Daniel de la Rosa Fernández</h2>
