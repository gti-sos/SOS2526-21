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
        
        let cristiano=["Cristianos",parseFloat(data.christian),1];
        let judio=["Judíos",parseFloat(data.jew),1];
        let musulman=["Musulmanes",parseFloat(data.muslim),1];
        let indu=["Indues",parseFloat(data.hindu),1];
        let budista=["Budistas",parseFloat(data.budhist),1];
        let otro=["Otros",parseFloat(data.other),1];
        let sinreligion=["Sin Religión",parseFloat(data.no_religion),1];

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
        const VariwideModule = (await import('highcharts/modules/variwide')).default;
        

chart= Highcharts.chart('container', {

    chart: {
        type: 'variwide'
    },

    title: {
        text: 'Creencias Religiosas por País y Año'
    },

    

    xAxis: {
        type: 'religión'
    },

    

    legend: {
        enabled: false
    },

    series: [{
        name: 'Creyentes',
        data: datosGrafico,
        dataLabels: {
            enabled: true,
            format: '%{point.y:.0f}'
        },
        tooltip: {
            pointFormat: 'Creyentes: <b>% {point.y}</b><br>' 
        },
        borderRadius: 3,
        colorByPoint: true
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


