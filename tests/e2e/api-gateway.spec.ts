import { test, expect } from '@playwright/test'

const API_BASE_URL = 'http://localhost:8080'

test.describe('API Gateway', () => {
  test('health endpoint should return OK status', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`)
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('status', 'ok')
    expect(data).toHaveProperty('service', 'gateway')
    expect(data).toHaveProperty('environment')
    expect(data).toHaveProperty('services')
  })

  test('health endpoint should include service URLs', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`)
    const data = await response.json()
    
    expect(data.services).toHaveProperty('user')
    expect(data.services).toHaveProperty('feed')
    expect(data.services).toHaveProperty('article')
    expect(data.services).toHaveProperty('crawler')
  })

  test('should return 404 for unknown endpoints', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/unknown-endpoint`)
    expect(response.status()).toBe(404)
  })

  test('should handle CORS requests', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`, {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    })
    
    expect(response.status()).toBe(200)
  })

  test('should respond within acceptable time', async ({ request }) => {
    const startTime = Date.now()
    const response = await request.get(`${API_BASE_URL}/health`)
    const endTime = Date.now()
    
    expect(response.status()).toBe(200)
    expect(endTime - startTime).toBeLessThan(1000) // Should respond within 1 second
  })
})