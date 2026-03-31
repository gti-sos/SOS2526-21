<script>

import {page} from '$app/state';
let country = page.params.country;
let year = page.params.year;

import { dev } from '$app/environment';
import {onMount} from 'svelte';
// @ts-ignore
let cholera_stat=  $state({});
let resultStatus = $state(0);
let updatedCountry = $state('sampleCountry');
let updatedYear = $state('1000');
let updatedReportedCases = $state('0');
let updatedReportedDeaths = $state('0');
let updatedFatalityRates = $state('0.0');
let updatedWhoRegion = $state('sampleWhoRegion');



let API = "/api/v1/cholera-stats";

if (dev)
    API = "http://localhost:3000"+API;

    // @ts-ignore
    async function getCholeraStat() {
        const res = await fetch(API+'/'+country+'/'+year, {method : "GET"});
        const cholera_stat = await res.json();
        updatedCountry = cholera_stat.country;
        updatedYear = cholera_stat.year;
        updatedReportedCases = cholera_stat.reportedCases;
        updatedReportedDeaths = cholera_stat.reportedDeaths;
        updatedFatalityRates = cholera_stat.fatalityRate;
        updatedWhoRegion = cholera_stat.whoRegion;


    }


    // @ts-ignore
    async function UpdateCholeraStat(){
        let UpdatedCholeraStat= {
            country: updatedCountry,
            year: updatedYear,
            reportedCases: updatedReportedCases,
            reportedDeaths: updatedReportedDeaths,
            fatalityRate: updatedFatalityRates,
            whoRegion: updatedWhoRegion
        }
        const res = await fetch(API+'/'+country+'/'+year, 
        {method : "PUT", 
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(UpdatedCholeraStat)
        });
        resultStatus = await     res.status
        if (resultStatus == 200)
            getCholeraStat();
        
    }



onMount(async () =>  {getCholeraStat(); }); //que se carga al iniciar la pagina

</script>


<h1>Detalles de la estadistica de colera del pais <u>{country}</u> en el año <u>{year}</u> </h1> 

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
{#if resultStatus == 404}
<div class="alert error">
  <strong>ERROR</strong> — No existe la estadística del país {country} y año {year}
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
</style>



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
            <td><input data-testId="countryInput" bind:value= {updatedCountry} disabled/></td>
            <td><input data-testId="yearInput" type="number" bind:value= {updatedYear} disabled/></td>
            <td><input data-testId="reportedCasesInput" type="number" bind:value= {updatedReportedCases}/></td>
            <td><input data-testId="reportedDeathsInput" type="number" bind:value= {updatedReportedDeaths}/></td>
            <td><input data-testId="fatalityRateInput" type="number" step="0.01" bind:value= {updatedFatalityRates}/></td>
            <td><input  data-testId="regionInput" bind:value= {updatedWhoRegion}/></td>
            <td><button onclick={UpdateCholeraStat}>ACTUALIZAR</button></td>
        </tr>
    </tbody>

</table>

