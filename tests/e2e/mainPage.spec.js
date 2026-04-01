import { test, expect } from '@playwright/test';
let app = "http://localhost:3000";

test('main page has right title', async ({page}) => {
    await page.goto(app);

    await expect(page).toHaveTitle(/Grupo 21 API/);
})

test('main has 3 members with project', async({page}) => {
    await page.goto(app);
    const membersNameCount = await page.locator('.member').count();
    await expect(membersNameCount).toBe(3);
    const resources =await page.locator('.resource');
    await expect(resources.filter({ hasText: 'cholera' })).toHaveCount(1);
    await expect(resources.filter({ hasText: 'aids' })).toHaveCount(1);
    await expect(resources.filter({ hasText: 'religious' })).toHaveCount(1);
})

test('main has 3 APIs and 3 documentation', async({page}) => {
    await page.goto(app);
    await page.getByRole('link', {name: 'APIs'}).click();
    const linksAPUICount = await page.locator('.api-card')
    await expect(linksAPUICount).toHaveCount(3);
    await page.getByRole('link', {name: 'Documentación'}).click();
    const linksDocsCount = await page.locator('.api-card')
    await expect(linksDocsCount).toHaveCount(3);
})









