import { test, expect } from '@playwright/test';
let app = "http://localhost:3000";

test('main page has right title', async ({page}) => {
    await page.goto(app);

    await expect(page).toHaveTitle(/Grupo 21 API/);
})
test('aids frontend show list', async ({ page }) => {
    await page.goto(app);

    await page.hover('.dropdown');

    await page.getByRole('link', {name: 'AIDS'}).click();

    await expect(page).toHaveTitle(/AIDs/);

    await page.getByRole('button', {name: 'iniciales'}).click();

    const dataRowsCount = await page.getByTestId('dataRow').count();

    expect(dataRowsCount).toBeGreaterThan(0);
  
});







//----------------------------------------------------------------------------------------------------------------------------
//----------------------------FRONT CHOLERA TESTS-----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------


test('cholera stats frontend shows cholera list', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'Cholera'}).click();
    await expect(page).toHaveTitle('Cholera Stats');
    await page.getByRole('button', {name: 'CARGAR DATOS'}).click();
    //espera a que almenos cargue una fila por que tengo demasiadas filas y no espera a que carguen para contar
    await page.waitForSelector('[data-testid="choleraRow"]');
    const choleraCount= await page.getByTestId('choleraRow').count();
    expect(choleraCount).toBeGreaterThan(0);
}); 


test('cholera stat creation', async ({ page }) => {
    
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'Cholera'}).click();
   
    const choleraCount1= await page.getByTestId('choleraRow').count();

    await page.getByTestId('countryInput').fill('Pais prueba');
    await page.getByTestId('yearInput').fill('3000');
    await page.getByTestId('reportedCasesInput').fill('2');
    await page.getByTestId('reportedDeathsInput').fill('1');
    await page.getByTestId('fatalityRateInput').fill('0.5');
    await page.getByTestId('regionInput').fill('Region prueba');


    await page.getByRole('button', {name: 'INSERTAR'}).click() ;

    const choleraCount2= await page.getByTestId('choleraRow').count();
    
    

    await expect(page.getByText('Pais prueba')).toBeVisible();
    await expect(page.getByText('3000')).toBeVisible();

    expect(choleraCount2-choleraCount1).toBe(1);
}); 


test('cholera stat filter', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'Cholera'}).click();
    
    await page.getByPlaceholder('País').fill('Pais prueba');
    await page.getByPlaceholder('Año').fill('3000');
    await page.getByPlaceholder('Casos reportados').fill('2');
    await page.getByPlaceholder('Casos reportados').fill('1');
    await page.getByPlaceholder('Muertes reportadas').fill('0.5');
    await page.getByPlaceholder('Región').fill('Region prueba');
    await page.getByPlaceholder('Desde').fill('2999');
    await page.getByPlaceholder('Hasta').fill('3001');

    await page.getByRole('button', {name: 'BUSCAR'}).click();
    
    const choleraCount= await page.getByTestId('choleraRow').count();
}); 