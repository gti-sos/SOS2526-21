<script>
// @ts-nocheck

    import { dev } from '$app/environment';
	import { onMount } from 'svelte';

    let BASE_API="/api/v1/religious-believes-stats";
    if(dev){
        BASE_API="http://localhost:3000" + BASE_API;
    }




    // @ts-ignore
    let creencias=$state([]);
    let codigo_status=$state(0);
    //INPUT para el POST
    let newPais=$state("WAWA");
    let newCodigo=$state("WA");
    let newAno=$state("3000");
    let newCristiano=$state("100");
    let newJudio=$state("0");
    let newMusulman=$state("0");
    let newIndu=$state("0");
    let newBudista=$state("0");
    let newOtro=$state("0");
    let newNoreligion=$state("0");

    //INPUT FILTROS
    let filtroPais=$state("");
    let filtroCodigo=$state("");
    let filtroAno=$state("");
    let filtroCristiano=$state("");
    let filtroJudio=$state("");
    let filtroMusulman=$state("");
    let filtroIndu=$state("");
    let filtroBudista=$state("");
    let filtroOtro=$state("");
    let filtroNoreligion=$state("");
    let filtroLimite=$state("");
    //Explicación Códigos de Estado

    // @ts-ignore
    let estados_explicacion={
        "200": "La operación solicitada fue un éxito",
        "201": "Los datos fueron creados correctamente",
        "409": "Los datos introducidos, o la combinación de país y año, ya existen en la base de datos",
        "405": "No puedes realizar esa operación sobre el recrso solicitado",
        "500": "Hubo un error interno en el servidor",
        "404": "El recurso al que intentas ejercer esta operación no existe",
        "400": "Hay un problema con los datos enviados"
    }

    //Offset para paginación
    let offset=0;


//-------------FUNCIONES------------------------------------------------------------------------------------
    async function getCreencias(query=""){

        let res=await fetch(BASE_API+`?limit=10&&offset=${offset}`+query,{method:'GET'}); //Añado limit para que se muestren todos los datos cargados, creo es más intuitivo hasta que se implemente pegainacion en el frontend
    
        const data=await res.json();
        creencias=data;
        codigo_status=res.status;
        
        //console.log(creencias);
    }


    async function getCreenciasFiltro(){
        let url="";
        if (filtroPais) url+=`&entity=${filtroPais}`;
        if (filtroCodigo) url+=`&code=${filtroCodigo}`;
        if (filtroAno) url+=`&year=${filtroAno}`;
        if (filtroCristiano) url+=`&christian=${filtroCristiano}`;
        if (filtroJudio) url+=`&jew=${filtroJudio}`;
        if (filtroMusulman) url+=`&muslim=${filtroMusulman}`;
        if (filtroIndu) url+=`&hindu=${filtroIndu}`;
        if (filtroBudista) url+=`&budhist=${filtroBudista}`;
        if (filtroOtro) url+=`&other=${filtroOtro}`;
        if (filtroNoreligion) url+=`&no_religion=${filtroNoreligion}`;
        //if (filtroLimite) url+=`&limit=${filtroLimite}`;

        console.log(url);

        getCreencias(url);
    }


    async function getDatosIniciales(){
        let res=await fetch(BASE_API+"/loadInitialData",{method: 'GET'}); 
        codigo_status=res.status;
        if (codigo_status==201) getCreencias();
        
    }



    async function annhilateData(){
        if(confirm("Eliminarás todo los datos de la Base de Datos, ¿Es esa tu voluntad?")){
            console.log("Así sea");

            let res= await fetch(BASE_API,{method: 'DELETE'});
            codigo_status=res.status;
            if(codigo_status===200) getCreencias();


        }
        
    }

    // @ts-ignore
    async function deleteRow(entity,year){
        let res=await fetch(BASE_API+`/${entity}/${year}`,{method:'DELETE'});
        codigo_status=res.status;
        if(codigo_status===200) getCreencias();
    }

    async function insertaCreencia(){
        let newCreencia={entity:newPais,code:newCodigo,year:newAno,christian:newCristiano,
            jew:newJudio,muslim:newMusulman,hindu:newIndu,budhist:newBudista,other:newOtro,no_religion:newNoreligion};

        let res=await fetch(BASE_API,{method:'POST',
        body:JSON.stringify(newCreencia),
        headers:{"Content-Type":"application/json"}});

        codigo_status=res.status;
        if (codigo_status===201) getCreencias();
    }

    onMount(()=>{
        getCreencias();
    })

    async function incrementaOffset(){
        if (offset<=20) offset+=10;
        getCreenciasFiltro();
    }

    async function decrementaOffset(){
        if(offset>=10) offset-=10;
        getCreenciasFiltro();
    }


</script>





<h1>Creencias Religiosas</h1>

<div>
    <button onclick={getCreencias}>Actualizar Lista de Datos</button>
</div>
<div>
    <button  onclick={getDatosIniciales}>Cargar datos Iniciales</button>
</div>

<div>
    <h2>Estadísticas de creencias disponibles</h2>
    <div>
        <h3>Filtros de Búsqueda</h3>
        <div>
            <input data-testid="input-pais" placeholder="país" bind:value={filtroPais}>
            <input data-testid="input-codigo" placeholder="código" bind:value={filtroCodigo}>
            <input data-testid="input-ano" placeholder="año" bind:value={filtroAno}>
            <input data-testid="input-cristiano" placeholder="%Cristianos" bind:value={filtroCristiano}>
            <input data-testid="input-judio" placeholder="%Judíos" bind:value={filtroJudio}>
            <input data-testid="input-musulman" placeholder="%Musulmanes" bind:value={filtroMusulman}>
            <input data-testid="input-indu" placeholder="%Indúes" bind:value={filtroIndu}>
            <input data-testid="input-budista" placeholder="%Budistas" bind:value={filtroBudista}>
            <input data-testid="input-otro" placeholder="%Otra Religión" bind:value={filtroOtro}>
            <input data-testid="input-no-religion" placeholder="%Sin religión" bind:value={filtroNoreligion}>
            <button onclick={getCreenciasFiltro}>Buscar</button>
        </div>
    </div>
    <div>
        <button onclick={decrementaOffset}>Anterior</button>
        <button onclick={incrementaOffset}>Siguiente</button>
    </div>
    <div>
        <table>
           
                <thead>
                    <tr>
                        <th> País</th>
                        <th> Código</th>
                        <th> Año</th>
                        <th> Cristianos(%)</th>
                        <th> Judíos(%)</th>
                        <th> Musulmanes(%)</th>
                        <th> Indúes(%)</th>
                        <th> Budistas(%)</th>
                        <th> Otros(%)</th>
                        <th> Sin Religión(%)</th>

                    </tr>

                     
                </thead>
                <tbody>

                    <tr>
                        <td><input bind:value={newPais}></td>
                        <td><input bind:value={newCodigo}></td>
                        <td><input bind:value={newAno}></td>
                        <td><input bind:value={newCristiano}></td>
                        <td><input bind:value={newJudio}></td>
                        <td><input bind:value={newMusulman}></td>
                        <td><input bind:value={newIndu}></td>
                        <td><input bind:value={newBudista}></td>
                        <td><input bind:value={newOtro}></td>
                        <td><input bind:value={newNoreligion}></td>
                        <td><button onclick={insertaCreencia}>Publicar</button></td>
                    </tr>

                     {#each creencias as dato}
                    <tr data-testid="creencia-row">
                        <td>{dato.entity}</td>
                        <td>{dato.code}</td>
                        <td>{dato.year}</td> 
                        <td>{dato.christian}</td>
                        <td>{dato.jew}</td>
                        <td>{dato.muslim}</td> 
                        <td>{dato.hindu}</td> 
                        <td>{dato.budhist}</td>
                        <td>{dato.other}</td>
                        <td>{dato.no_religion}</td>
                        <td><button data-testid="borrar-{dato.entity}-{dato.year}" onclick={() => deleteRow(dato.entity, dato.year)}>Eliminar</button></td>
                        <td><a href="./religious-believes-stats/{dato.entity}/{dato.year}"><button>Actualizar</button></a></td>
                    </tr>
                    {/each}
                </tbody>
                
        </table>
    </div>
</div>

<div>
    <h2> Zona de Peligro : Eliminar Todos los Datos</h2>
    <div>
        <button onclick={annhilateData}>BORRAR TODO</button>
    </div>

</div>

{#if codigo_status!=0}
    <div>
        <h2>Estado de la operación</h2>
        <p>{estados_explicacion[codigo_status.toString()]}</p>
        
    </div>
    

{/if}
