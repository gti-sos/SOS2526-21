<script>
    import { page } from '$app/state';
    import { dev } from '$app/environment';
    // @ts-ignore
    import { onMount } from 'svelte';

    // @ts-ignore
    let entity=page.params.entity;
    // @ts-ignore
    let year=page.params.year;

     let BASE_API="/api/v1/religious-believes-stats";
    if(dev){
        BASE_API="http://localhost:3000" + BASE_API;
    }



    // @ts-ignore
    let creencias=$state({});
    let codigo_status=$state(0);
    // @ts-ignore
    let newPais=$state(entity);
    // @ts-ignore
    let newCodigo=$state("codigo");
    // @ts-ignore
    let newAno=$state(year);
    // @ts-ignore
    let newCristiano=$state("cristianos");
    // @ts-ignore
    let newJudio=$state("judios");
    // @ts-ignore
    let newMusulman=$state("musulmanes");
    // @ts-ignore
    let newIndu=$state("indues");
    // @ts-ignore
    let newBudista=$state("budistas");
    // @ts-ignore
    let newOtro=$state("otros");
    // @ts-ignore
    let newNoreligion=$state("sin religion");

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



    // @ts-ignore
    async function editDato(){
        let newCreencia={entity:newPais,code:newCodigo,year:newAno,christian:newCristiano,
            jew:newJudio,muslim:newMusulman,hindu:newIndu,budhist:newBudista,
            other:newOtro,no_religion:newNoreligion};


        let res=await fetch(BASE_API+`/${entity}/${year}`,
        {method: 'PUT',
        body:JSON.stringify(newCreencia),
        headers:{"Content-Type":"application/json"}

        });
        codigo_status=res.status;
        if(codigo_status===200) getDato();

    }


    async function getDato(){
        let res=await fetch(BASE_API+`/${entity}/${year}`,{method:'GET'});

        
        creencias=await res.json();

        //creencias=[res];
        codigo_status=res.status;
        


    }
    onMount(()=>{
        getDato();});

</script>



<h1>Creencias Religiosas</h1>

<div>
    <button onclick={getDato}>Actualizar Lista de Datos</button>
</div>

<div>
    <h2>Estadísticas de creencias disponibles</h2>
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
                        <th>Acción</th>
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
                        <td><button onclick={editDato}>Actualizar</button></td>
                    </tr>

                    
                    <tr>
                        <td>{creencias.entity}</td>
                        <td>{creencias.code}</td>
                        <td>{creencias.year}</td> 
                        <td>{creencias.christian}</td>
                        <td>{creencias.jew}</td>
                        <td>{creencias.muslim}</td> 
                        <td>{creencias.hindu}</td> 
                        <td>{creencias.budhist}</td>
                        <td>{creencias.other}</td>
                        <td>{creencias.no_religion}</td>
                        
                    </tr>
                    

                </tbody>
                
        </table>
    </div>
</div>



{#if codigo_status!=0}
    <div>
        <h2>Estado de la operación</h2>
        <p>El código de estado es {codigo_status}</p>
        <p>{estados_explicacion[codigo_status.toString()]}</p>
        
    </div>
    

{/if}