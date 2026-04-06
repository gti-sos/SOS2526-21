//----------------------------------------------------------------------------------------------------------------------------
//----------------------------FRONT CHOLERA TESTS-----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'serial' });
let app = "http://localhost:3000";

test('Load initial data of cholera stats', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'Cholera'}).click();
    await expect(page).toHaveTitle('Cholera Stats');
    await page.getByRole('button', {name: 'CARGAR DATOS'}).click();
    //espera a que almenos cargue una fila por que tengo demasiadas filas y no espera a que carguen para contar
    await page.waitForSelector('[data-testid="choleraRow"]');
    const choleraCount= await page.getByTestId('choleraRow').count();
    expect(choleraCount).toBeGreaterThan(0);

    //borro todo para no tener que buscar la row que cree nueva en el siguiente test y solo halla una row
    await page.getByRole('button', {name: 'BORRAR TODO'}).click();
}); 


test('Create one cholera stat', async ({ page }) => {
    
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'Cholera'}).click();
   
    const choleraCount= await page.getByTestId('choleraRow').count();

    
    await page.getByTestId('countryInput').fill('PaisPrueba');
    await page.getByTestId('yearInput').fill('3000');
    await page.getByTestId('reportedCasesInput').fill('2');
    await page.getByTestId('reportedDeathsInput').fill('1');
    await page.getByTestId('fatalityRateInput').fill('0.5');
    await page.getByTestId('regionInput').fill('Region prueba');

    
    await page.getByRole('button', {name: 'INSERTAR'}).click() ;

    
    //espera las cholerarow suficientes para que sea choleraCount + 1, es decir, que comprueba que se agrego una row mas.

    await expect(page.getByTestId('choleraRow'))
    .toHaveCount(choleraCount + 1);


    await expect(page.getByText('PaisPrueba', { exact: true })).toBeVisible();
    await expect(page.getByText('3000', { exact: true })).toBeVisible();
    await expect(page.getByText('2', { exact: true })).toBeVisible();
    await expect(page.getByText('1', { exact: true })).toBeVisible();
    await expect(page.getByText('0.5', { exact: true })).toBeVisible();
    await expect(page.getByText('Region prueba', { exact: true })).toBeVisible();

}); 


test('filter cholera stats', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'Cholera'}).click();
    
    await page.getByPlaceholder('País').fill('PaisPrueba');
    await page.getByPlaceholder('Año').fill('3000');
    await page.getByPlaceholder('Casos reportados').fill('2');
    await page.getByPlaceholder('Muertes reportadas').fill('1');
    await page.getByPlaceholder('Ratio de fatalidad').fill('0.5');
    await page.getByPlaceholder('Región').fill('Region prueba');
    await page.getByPlaceholder('Desde').fill('2999');
    await page.getByPlaceholder('Hasta').fill('3001');

    await page.getByRole('button', {name: 'BUSCAR'}).click();

    const choleraCount= await page.getByTestId('choleraRow').count();

    expect(choleraCount).toBe(1);

    await expect(page.getByText('PaisPrueba', { exact: true })).toBeVisible();
    await expect(page.getByText('3000', { exact: true })).toBeVisible();
    
}); 


test('Edit one cholera stat', async ({ page }) => {
    
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'Cholera'}).click();
    
    await page.getByRole('link', {name: 'PaisPrueba'}).click(); 

    await page.getByTestId('reportedCasesInput').fill('2');
    await page.getByTestId('reportedDeathsInput').fill('1');
    await page.getByTestId('fatalityRateInput').fill('0.5');
    await page.getByTestId('regionInput').fill('Region prueba actualizada');


    await page.getByRole('button', {name: 'ACTUALIZAR'}).click() ;
    
    await page.goBack();

    
    await expect(page.getByText('Region prueba actualizada')).toBeVisible();


}); 




test('Delete one cholera stat', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'Cholera'}).click();    

    await page.getByTestId('PaisPrueba-3000').click();

    await expect(page.getByTestId('PaisPrueba-3000')).not.toBeVisible();

});


test('Delete all cholera stats', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'Cholera'}).click();
    await page.getByRole('button', {name: 'BORRAR TODO'}).click();
    const choleraCount= await page.getByTestId('choleraRow').count();
    expect(choleraCount).toBe(0);
}); 
