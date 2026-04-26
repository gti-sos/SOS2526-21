<script>
    import Highcharts from "highcharts";  
    import { onMount } from 'svelte';
   
    
    let BASE_API="/api/v1/religious-believes-stats";



    let chart=$state();

    let cristiano=$state(50.0);
    let judio=$state(10.0);
    let musulman=$state(10.0);
    let indu=$state(10.0);
    let budista=$state(5.0);
    let otro=$state(5.0);
    let sinreligion=$state(10.0);
    let datosGrafico=$state();
   //Variables filtro
   let filtroPais=$state("");
   let filtroAno=$state("");




   async function getCreencia(query=""){

        let res=await fetch(BASE_API+`${query}`,{method:'GET'}); //Añado limit para que se muestren todos los datos cargados, creo es más intuitivo hasta que se implemente pegainacion en el frontend
    
        const data=await res.json();
        
        let cristiano=parseFloat(data.christian);
        let judio=parseFloat(data.jew);
        let musulman=parseFloat(data.muslim);
        let indu=parseFloat(data.hindu);
        let budista=parseFloat(data.budhist);
        let otro=parseFloat(data.other);
        let sinreligion=parseFloat(data.no_religion);

        datosGrafico=[cristiano,judio,musulman,indu,budista,otro,sinreligion];

        chart.series[0].setData(datosGrafico);
        
        
        
        
        //console.log(creencias);
    }


    async function getCreenciasFiltro(){
        
        if (!filtroAno || !filtroPais) return;
        let url=`/${filtroPais}/${filtroAno}`;


        console.log(url);

        getCreencia(url);
    }
    

   
  

    onMount(async ()=>{

chart= Highcharts.chart('container', {

    chart: {
        type: 'column',
        styledMode: true
    },

    title: {
        text: 'Creencias Religiosas por País y Año'
    },

    

    xAxis: {
        categories: ['Cristianos', 'Judíos', 'Musulmanes', 'Indues', 'Budistas', 'Otros', 'Sin Religión']
    },

    yAxis: [{ // Primary axis
        className: 'highcharts-color-0',
        title: {
            text: 'Porcentage'
        }
    }, { // Secondary axis
        className: 'highcharts-color-1',
        opposite: true,
        title: {
            text: 'BMI'
        }
    }],

    plotOptions: {
        column: {
            borderRadius: 5
        }
    },

    series: [{
        name: 'Creyentes',
        data: datosGrafico,
        tooltip: {
            valueSuffix: ' %'
        }
    }]

});



    })
    


</script>

<h1>Representación Visual de las Estadísticas Religiosas por País y Año</h1>

<div>
<input bind:value={filtroPais} placeholder="Afghanistan">
<input bind:value={filtroAno} placeholder="2010">
<button onclick={getCreenciasFiltro}>Aplicar Filtro</button>
</div>

<div id="container"></div>



<style>
@import url('https://code.highcharts.com/css/highcharts.css');
</style>