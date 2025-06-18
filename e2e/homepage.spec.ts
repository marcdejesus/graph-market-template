import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display the FitMarket welcome message', async ({ page }) => {
    await page.goto('/')

    // Check if the page loads successfully
    await expect(page).toHaveTitle(/FitMarket/)

    // Check for the main heading
    await expect(page.locator('h1')).toContainText('Welcome to FitMarket')

    // Check for the description
    await expect(page.locator('p')).toContainText(
      'Discover premium gym clothes designed for performance and style'
    )

    // Check for the buttons
    await expect(page.locator('button:has-text("Shop Collection")')).toBeVisible()
    await expect(page.locator('button:has-text("Learn More")')).toBeVisible()

    // Check for the project status card
    await expect(page.locator('text=Project Initialized')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check if elements are still visible on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('button:has-text("Shop Collection")')).toBeVisible()
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/')

    // Check for proper heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    const h2 = page.locator('h2')
    await expect(h2).toBeVisible()

    // Check if buttons are properly labeled
    const shopButton = page.locator('button:has-text("Shop Collection")')
    await expect(shopButton).toBeVisible()
    await expect(shopButton).toBeEnabled()
  })
}) 