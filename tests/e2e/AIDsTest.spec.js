import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'serial' });
let app = "http://localhost:3000";

test('aids frontend delete all, loadinitialdata and show list', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'AIDS Deaths', exact:true}).click();
    await expect(page).toHaveTitle(/AIDs/);
    page.on('dialog', dialog => dialog.accept());
    const waitEliminarTodo = page.waitForResponse(res => res.url().includes('aids-deaths-stats') && res.request().method() === 'DELETE' && res.status() === 200);
    await page.getByRole('button', {name: 'Eliminar todo'}).click();
    await waitEliminarTodo;
    const waitIniciales = page.waitForResponse(res => res.url().includes('aids-deaths-stats') && res.request().method() === 'GET' && res.status() === 201);
    await page.getByRole('button', {name: 'iniciales'}).click();
    await waitIniciales;
    await expect(page.getByTestId('dataRow').first()).toBeVisible(); 
    const dataRowsCount = await page.getByTestId('dataRow').count();
    expect(dataRowsCount).toBeGreaterThan(0);
    const waitEliminarTodo2 = page.waitForResponse(res =>res.url().includes('aids-deaths-stats') && res.request().method() === 'DELETE' && res.status() === 200);
    await page.getByRole('button', {name: 'Eliminar todo'}).click();
    await waitEliminarTodo2;
    await expect(page.getByTestId('dataRow')).toHaveCount(0); 
});

test('aids frontend insert ESPAÑA on the list', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'AIDS Deaths', exact:true}).click();
    await expect(page).toHaveTitle(/AIDs/);
    const dataRowsCount1 = await page.getByTestId('dataRow').count();
    await page.getByTestId('paisInput').fill('España');
    await page.getByTestId('codigoPaisInput').fill('ESP');
    await page.getByTestId('añoInput').fill('2020');
    await page.getByTestId('under5Input').fill('100');
    await page.getByTestId('plus70Input').fill('200');
    await page.getByTestId('5-14Input').fill('150');
    await page.getByTestId('15-49Input').fill('300');
    await page.getByTestId('50-69Input').fill('250');
    const waitAñadir = page.waitForResponse(res => res.url().includes('aids-deaths-stats') && res.request().method() === 'POST' && res.status() === 201);
    await page.getByRole('button', {name: 'Añadir'}).click();
    await waitAñadir;
    await expect(page.getByTestId('dataRow')).toHaveCount(dataRowsCount1 + 1); 
    const newRow = page.getByTestId('dataRow').filter({ hasText: 'España' });
    await expect(newRow).toContainText('ESP');
    await expect(newRow).toContainText('2020');
    await expect(newRow).toContainText('100');
});

test('aids frontend edit ESPAÑA from list', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'AIDS Deaths', exact:true}).click();
    await expect(page).toHaveTitle(/AIDs/);
    const newRow = page.getByTestId('dataRow').filter({ hasText: 'ESP' });
    await newRow.getByRole('link', { name: 'Editar' }).click();
    await expect(page.locator('h1')).toHaveText('Editar Registro');
    await page.getByTestId('under5Input').fill('50');
    await page.getByTestId('5-14Input').fill('75');
    await page.getByTestId('15-49Input').fill('120');
    await page.getByTestId('50-69Input').fill('90');
    await page.getByTestId('plus70Input').fill('30');
    const waitEditar = page.waitForResponse(res => res.status() === 200);
    await page.getByRole('button', {name: 'Guardar cambios'}).click();
    await waitEditar;
    await page.getByRole('link', {name: 'Volver'}).click();
    const editedRow = page.getByTestId('dataRow').filter({ hasText: 'ESP' });
    await expect(editedRow).toContainText('50');
    await expect(editedRow).toContainText('75');
    await expect(editedRow).toContainText('120');
    await expect(editedRow).toContainText('90');
    await expect(editedRow).toContainText('30');
});

test('aids frontend search ESPAÑA from list', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'AIDS Deaths', exact:true}).click();
    await expect(page).toHaveTitle(/AIDs/);
    const newRow = page.getByTestId('dataRow').filter({ hasText: 'ESP' });
    await page.getByTestId('filterCountry').fill('España');
    await page.getByTestId('filterCodeCountry').fill('ESP');
    await page.getByTestId('filterYear').fill('2020');
    await page.getByTestId('filterUnder5').fill('50');
    await page.getByTestId('filter70Plus').fill('30');
    await page.getByTestId('filter5-14').fill('75');
    await page.getByTestId('filter15-49').fill('120');
    await page.getByTestId('filter50-69').fill('90');
    const waitBuscar = page.waitForResponse(res =>res.url().includes('aids-deaths-stats') && res.request().method() === 'GET' && res.status() === 200);
    await page.getByRole('button', {name: 'Aplicar'}).click();
    await waitBuscar;
    const firstRow = page.getByTestId('dataRow').first();
    const newRowText = await newRow.textContent();
    const firstRowText = await firstRow.textContent();
    await expect(firstRowText).toBe(newRowText);
    
});

test('aids frontend delete ESPAÑA from list', async ({ page }) => {
    await page.goto(app);
    await page.hover('.dropdown');
    await page.getByRole('link', {name: 'AIDS Deaths', exact:true}).click();
    await expect(page).toHaveTitle(/AIDs/);
    const newRow = page.getByTestId('dataRow').filter({ hasText: 'ESP' });
    page.on('dialog', dialog => dialog.accept());
    const waitEliminar = page.waitForResponse(res =>res.url().includes('aids-deaths-stats') && res.request().method() === 'DELETE' && res.status() === 200);
    await newRow.getByRole('button', { name: 'Borrar' }).click();
    await waitEliminar;
    await expect(page.getByTestId('dataRow').filter({ hasText: 'ESP' })).toHaveCount(0);
});