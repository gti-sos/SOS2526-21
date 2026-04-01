<script>

import { dev } from '$app/environment';
import {onMount} from 'svelte';
// @ts-ignore
let cholera_stats=  $state([]);
let resultStatus = $state(0);
let newCountry = $state('PaisEjemplo');
let newYear = $state('1000');
let newReportedCases = $state('0');
let newReportedDeaths = $state('0');
let newFatalityRates = $state('0.0');
let newWhoRegion = $state('RegionEjemplo');
let filterCountry = $state('');
let filterYear = $state('');
let filterRegion = $state('');
let filterReportedCases = $state('');
let filterReportedDeaths = $state('');
let filterFatalityRate = $state('');
let filterFrom = $state('');
let filterTo = $state('');



let API = "/api/v1/cholera-stats";

if (dev)
    API = "http://localhost:3000"+API;

    // @ts-ignore
    async function getCholeraStats()  {
        let url = API + '?';
        if(filterCountry) url += `country=${filterCountry}&`;
        if(filterYear)    url += `year=${filterYear}&`;
        if(filterRegion)  url += `region=${filterRegion}&`;
        if(filterReportedCases)  url += `reportedCases=${filterReportedCases}&`;
        if(filterReportedDeaths)  url += `reportedDeaths=${filterReportedDeaths}&`;
        if(filterFatalityRate)  url += `fatalityRate=${filterFatalityRate}&`;
        if(filterFrom)    url += `from=${filterFrom}&`;
        if(filterTo)      url += `to=${filterTo}&`;
        const res = await fetch(url, {method: "GET"});
        const data = await res.json();
        cholera_stats=data;
    }

     async function getInitdata()  {    
        const res = await fetch(API + '/loadInitialData', {method: "GET"});
        resultStatus = await res.status;
        if(resultStatus == 201 || resultStatus == 409)
            getCholeraStats();
    }


    // @ts-ignore
    async function deleteCholeraStat(country, year){
        const res = await fetch(API+'/'+country+'/'+year, {method : "DELETE"});
        resultStatus = await res.status
        if (resultStatus == 200)
            getCholeraStats();
    }



    // @ts-ignore
    async function deleteCholeraStats(){
        const res = await fetch(API, {method : "DELETE"});
        resultStatus = await res.status
        if (resultStatus == 200)
            getCholeraStats();
    }


    // @ts-ignore
    async function InsertCholeraStat(){
        let newCholeraStat= {
            country: newCountry,
            year: newYear,
            reportedCases: newReportedCases,
            reportedDeaths: newReportedDeaths,
            fatalityRate: newFatalityRates,
            whoRegion: newWhoRegion
        }
        const res = await fetch(API, 
        {method : "POST", 
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(newCholeraStat)
        });
        resultStatus = await     res.status
        if (resultStatus == 201)
            getCholeraStats();
        
    }


    // @ts-ignore
    async function UpdateCholeraStat(country, year){
        let newCholeraStat= {
            country: newCountry,
            year: newYear,
            reportedCases: newReportedCases,
            reportedDeaths: newReportedDeaths,
            fatalityRate: newFatalityRates,
            whoRegion: newWhoRegion
        }
        const res = await fetch(API+'/'+country+'/'+year, 
        {method : "UPDATE", 
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(newCholeraStat)
        });
        resultStatus = await res.status
        if (resultStatus == 201)
            getCholeraStats();
        
    }



onMount(async () =>  {getCholeraStats(); }); //que se carga al iniciar la pagina

</script>

<svelte:head>
  <title>Cholera Stats</title>
</svelte:head>

<h1>Estadísticas del cólera</h1>  



{#if resultStatus == 200 || resultStatus == 201}
<div class="alert success">
  <strong>EXITO</strong> — Operación realizada con éxito
</div>
{/if}
{#if resultStatus == 400}
<div class="alert error">
  <strong>ERROR</strong> — Campos sin rellenar
</div>
{/if}
{#if resultStatus == 409}
<div class="alert error">
  <strong>ERROR</strong> — La estadística ya existe
</div>
{/if}


<style>
  .alert {
    padding: 10px 16px;
    border-radius: 6px;
    margin: 10px 0;
  }
  .success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  .error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  .empty {
    background-color: #d7dbf8;
    color: #143b88;
    border: 1px solid #d7dbf8;
  }
</style>

<h5>Haga click en el país para actualizar datos de la estadística</h5>

<br>

<button onclick={getInitdata}> CARGAR DATOS </button>
<button onclick={deleteCholeraStats}>BORRAR TODO</button>

<br>
<br>
<br>
<h3>FILTROS DE BÚSQUEDA</h3>
<input placeholder="País" bind:value={filterCountry} />
<input placeholder="Año" type="number" bind:value={filterYear} />
<input placeholder="Casos reportados" type="number" bind:value={filterReportedCases} />
<input placeholder="Muertes reportadas" type="number" bind:value={filterReportedDeaths} />
<input placeholder="Ratio de fatalidad" type="number" step="0.01" bind:value={filterFatalityRate} />
<input placeholder="Región" bind:value={filterRegion} />
<input placeholder="Desde" type="number" bind:value={filterFrom} />
<input placeholder="Hasta" type="number" bind:value={filterTo} />
<button onclick={getCholeraStats}>BUSCAR</button>
<button onclick={() => {
    filterCountry=''; filterYear=''; filterRegion=''; filterFrom=''; filterTo='';
    getCholeraStats();
}}>LIMPIAR FILTROS</button>

<br>
<br>
<h3>CREACIÓN DE ESTADISTICA</h3>
<table>
    <thead>
        <tr>
            <th>Pais</th>
            <th>Año</th>
            <th>Casos reportados</th>
            <th>Muertes reportadas</th>
            <th>Ratio de fatalidad</th>
            <th>Región</th>
            <th>Acción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input data-testid="countryInput" bind:value= {newCountry} /></td>
            <td><input data-testid="yearInput" type="number" bind:value= {newYear} /></td>
            <td><input data-testid="reportedCasesInput" type="number" bind:value= {newReportedCases} /></td>
            <td><input data-testid="reportedDeathsInput" type="number" bind:value= {newReportedDeaths} /></td>
            <td><input data-testid="fatalityRateInput" type="number" step="0.01" bind:value= {newFatalityRates} /></td>
            <td><input data-testid="regionInput" bind:value= {newWhoRegion} /></td>
            <td><button onclick={InsertCholeraStat}>INSERTAR</button></td>
        </tr>
        {#each cholera_stats as cholera_stat (`${cholera_stat.country}-${cholera_stat.year}`)}
            <tr data-testid="choleraRow">
                <td><a href="cholera-stats/{cholera_stat.country}/{cholera_stat.year}">{cholera_stat.country}</a></td>
                <td>{cholera_stat.year}</td>
                <td>{cholera_stat.reportedCases} </td>
                <td> {cholera_stat.reportedDeaths} </td>
                <td>{cholera_stat.fatalityRate} </td>
                <td>{cholera_stat.whoRegion}</td>
                <td><button data-testid={`${cholera_stat.country}-${cholera_stat.year}`} onclick={() => deleteCholeraStat(cholera_stat.country, cholera_stat.year)}>BORRAR</button></td>
             </tr>

        {/each}
    </tbody>
</table>

{#if cholera_stats.length==0}
    <p ></p>
    <div class="alert empty">
    <strong>¡VAYA!</strong> — No se encontraron estadisticas con esos campos.
    </div>
{/if}