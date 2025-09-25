import { test, expect } from '@playwright/test'

test.describe('Integration Tests', () => {
  test('should load frontend and connect to backend', async ({ page, request }) => {
    // First verify backend is running
    const healthResponse = await request.get('http://localhost:8080/health')
    expect(healthResponse.status()).toBe(200)
    
    // Then load frontend
    await page.goto('http://localhost:3000')
    
    // Verify frontend loads correctly
    await expect(page.getByRole('heading', { name: 'Yomi RSS Reader' })).toBeVisible()
    
    // Verify page has no console errors
    const logs: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text())
      }
    })
    
    await page.reload()
    expect(logs).toHaveLength(0)
  })

  test('should handle API errors gracefully', async ({ page, request }) => {
    await page.goto('http://localhost:3000')
    
    // Simulate API request to non-existent endpoint
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('http://localhost:8080/api/non-existent')
        return { status: res.status, ok: res.ok }
      } catch (error) {
        return { error: true, message: (error as Error).message }
      }
    })
    
    // Should handle 404 gracefully
    expect(response.status).toBe(404)
    expect(response.ok).toBe(false)
  })

  test('should support different screen sizes', async ({ page }) => {
    const sizes = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' },
    ]

    for (const size of sizes) {
      await page.setViewportSize({ width: size.width, height: size.height })
      await page.goto('http://localhost:3000')
      
      // Should display main content on all screen sizes
      await expect(page.getByRole('heading', { name: 'Yomi RSS Reader' })).toBeVisible()
      
      // Should not have horizontal scroll
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
      const clientWidth = await page.evaluate(() => document.body.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // Allow 1px tolerance
    }
  })

  test('should load without accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Basic accessibility checks
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
    
    // Should have main landmark
    await expect(page.locator('main')).toBeVisible()
    
    // Should have proper heading structure
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1) // Should have exactly one h1
  })
})