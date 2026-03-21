<script>


// @ts-ignore
let cholera_stats=  $state([]);
import { dev } from '$app/environment';

let API = "/api/v1/cholera-stats";

if (dev)
    API = "http://localhost:3000"+API;

// @ts-ignore
async function getCholeraStats()  {
    const res = await fetch(API, {method : "GET"});
    const data = await res.json();
    // @ts-ignore
    cholera_stats = data;


}

</script>

<h1>cholera-stats</h1>

<ul>
    {#each cholera_stats as cholera_stat (cholera_stat.country && cholera_stat.country)}
    <li> {cholera_stat.country} - 
        {cholera_stat.year} - 
        {cholera_stat.reportedCases} - 
        {cholera_stat.reportedDeaths} -
        {cholera_stat.fatalityRate} - 
        {cholera_stat.whoRegion} 

    </li>
    {/each}

</ul>

<button onclick={getCholeraStats}>Refresh</button>
