import { test, expect } from '@playwright/test'

test('loads and shows thesis input', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('keio-sop-coach')).toBeVisible()
  await expect(page.getByLabel('テーゼ（主張）1文（必須）')).toBeVisible()
})

