
<p>Detalles de la estadistica de colera: {country}</p> 


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

<h1>cholera-stats</h1>  

{#if resultStatus == 200 || resultStatus == 201}
<h3>Status code: {resultStatus}</h3>
<h3>Operación realizada con éxito</h3>
{/if}
{#if resultStatus == 409}
<h3>Status code: {resultStatus}</h3>
<h3>La estadística ya existe</h3>
{/if}
{#if resultStatus == 400}
<h3>Status code: {resultStatus}</h3>
<h3>No se puede modificar el pais o el año</h3>
{/if}
{#if resultStatus == 404}
<h3>Status code: {resultStatus}</h3>
<h3>No existe la extadística del pais:{country} y año: {year}</h3>
{/if}


<table>
    <thead>
        <tr>
            <th>Pais</th>
            <th>año</th>
            <th>Casos reportados</th>
            <th>Muertes reportadas</th>
            <th>Ratio de fatalidad</th>
            <th>Región</th>
            <th>Acción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value= {updatedCountry} /></td>
            <td><input  bind:value= {updatedYear} /></td>
            <td><input  bind:value= {updatedReportedCases} /></td>
            <td><input  bind:value= {updatedReportedDeaths} /></td>
            <td><input  bind:value= {updatedFatalityRates} /></td>
            <td><input  bind:value= {updatedWhoRegion} /></td>
            <td><button onclick={UpdateCholeraStat}>Actualizar
            </button></td>
        </tr>
    </tbody>

</table>

