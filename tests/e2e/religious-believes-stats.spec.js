import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'serial' });
let app = "http://localhost:3000/religious-believes-stats";


test('Borrar Todos los Recursos', async ({page})=>{
    await page.goto(app);


    page.on('dialog', dialog => dialog.accept());
    const annihilateData= page.waitForResponse(res=>res.url().includes("religious-believes-stats")
     && res.request().method() === "DELETE" && res.status() === 200);

    await page.getByRole("button",{name: "BORRAR TODO"}).click();
    await annihilateData;

    await expect(page.getByTestId('creencia-row')).toHaveCount(0);
    

})


test('Cargar recursos Iniciales', async ({page})=>{
    await page.goto(app);

    const initialData=page.waitForResponse(res=>res.url()
    .includes("religious-believes-stats/loadInitialData") && res.request().method()=="GET"
     && res.status()==201);

    await page.getByRole("button",{name:"Cargar datos Iniciales"}).click();
    await initialData;

})

test('Listar todos los recursos', async ({page})=>{
    await page.goto(app);

    //Espera a que carguen las columnas
    await expect(page.getByTestId('creencia-row').first()).toBeVisible();
    
    const rows2=await page.getByTestId('creencia-row').count();
    expect(rows2).toBeGreaterThan(0);

});

test("Post de datos WAWA/3000",async ({page})=>{
    await page.goto(app);

    const postData=page.waitForResponse(res=>res.url().includes("religious-believes-stats") 
    && res.request().method()=="POST" && res.status()==201);

    await page.getByRole("button",{name:"Publicar"}).click();
    await postData;
});

test("Editar el registro de WAWA",async ({page})=>{
    await page.goto(app+"/WAWA/3000");

    const editData=page.waitForResponse(res=> res.url()
    .includes("religious-believes-stats/WAWA/3000") && res.request().method()=="PUT" 
    && res.status()==200);

    await page.getByRole("button",{name:"Actualizar",exact:true}).click();
    await editData;

});

test("Buscar el registro WAWA",async ({page}) =>{
    await page.goto(app);

    const searchData=page.waitForResponse(res=>res.url()
    .includes("religious-believes-stats") && res.request().method()=="GET" && res.status()==200);

    await page.getByTestId("input-pais").fill("WAWA");
    await page.getByTestId("input-codigo").fill("CO");
    await page.getByTestId("input-ano").fill("3000");
    await page.getByTestId("input-cristiano").fill("0");
    await page.getByTestId("input-judio").fill("0");
    await page.getByTestId("input-musulman").fill("0");
    await page.getByTestId("input-indu").fill("0");
    await page.getByTestId("input-budista").fill("0");
    await page.getByTestId("input-otro").fill("0");
    await page.getByTestId("input-no-religion").fill("0");

    await page.getByRole("button",{name:"Buscar"}).click();
    await searchData;

    const rows=await page.getByTestId("creencia-row").count();
    expect(rows).toBeGreaterThan(0);

});

test("Borrar registro WAWA",async ({page})=>{
    await page.goto(app);

    //Primero buscamos el elemento (sólo es necesario introducir sus campos id)
    const searchData=page.waitForResponse(res=>res.url()
    .includes("religious-believes-stats") && res.request().method()=="GET" && res.status()==200);

    await page.getByTestId("input-pais").fill("WAWA");
    await page.getByTestId("input-ano").fill("3000");

    await page.getByRole("button",{name:"Buscar"}).click();
    await searchData;



    const deleteData=page.waitForResponse(res=>res.url()
    .includes("religious-believes-stats/WAWA/3000") && res.request().method()=="DELETE" 
    && res.status()==200); 
    await page.getByTestId("borrar-WAWA-3000").click();

    await deleteData;
    
    //const row=await page.getByTestId("borrar-WAWA-3000").count();
    //expect(row).toBe(0);

    
})