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