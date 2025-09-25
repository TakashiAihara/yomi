import { beforeAll, beforeEach, afterAll, afterEach } from 'vitest'

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
})

beforeEach(() => {
  // Reset environment for each test
  process.env.NODE_ENV = 'test'
})

afterEach(() => {
  // Clean up after each test
})

afterAll(() => {
  // Global cleanup
})