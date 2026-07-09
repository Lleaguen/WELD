import { describe, it, expect } from 'vitest'
import { buildCacheKey } from './hash.js'

describe('buildCacheKey', () => {
  it('generates a key from method and url', () => {
    const key = buildCacheKey({ method: 'GET', url: 'https://api.example.com/v1/products' })
    expect(key).toBe('GET::https://api.example.com/v1/products::::')
  })

  it('sorts query params for deterministic keys', () => {
    const key1 = buildCacheKey({ method: 'GET', url: '/products', query: { a: 1, b: 2 } })
    const key2 = buildCacheKey({ method: 'GET', url: '/products', query: { b: 2, a: 1 } })
    expect(key1).toBe(key2)
  })

  it('includes body in key for POST requests', () => {
    const key = buildCacheKey({ method: 'POST', url: '/products', body: { name: 'test' } })
    expect(key).toContain('{"name":"test"}')
  })

  it('different methods produce different keys', () => {
    const get  = buildCacheKey({ method: 'GET',  url: '/products' })
    const post = buildCacheKey({ method: 'POST', url: '/products' })
    expect(get).not.toBe(post)
  })

  it('different urls produce different keys', () => {
    const key1 = buildCacheKey({ method: 'GET', url: '/products' })
    const key2 = buildCacheKey({ method: 'GET', url: '/users' })
    expect(key1).not.toBe(key2)
  })
})
