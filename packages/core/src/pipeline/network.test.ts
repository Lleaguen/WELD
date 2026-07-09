import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { executeFetch, isOnline, WeldNetworkError } from './network.js'

// Mock global fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('isOnline', () => {
  it('returns true when navigator.onLine is true', () => {
    vi.stubGlobal('navigator', { onLine: true })
    expect(isOnline()).toBe(true)
  })

  it('returns false when navigator.onLine is false', () => {
    vi.stubGlobal('navigator', { onLine: false })
    expect(isOnline()).toBe(false)
  })

  it('returns true when navigator is undefined (Node/Bun/Deno)', () => {
    vi.stubGlobal('navigator', undefined)
    expect(isOnline()).toBe(true)
  })
})

describe('executeFetch', () => {
  it('returns parsed JSON on success', async () => {
    mockFetch.mockResolvedValue({
      ok:   true,
      text: async () => JSON.stringify({ id: '1', name: 'Product' }),
    })

    const result = await executeFetch({
      method:  'GET',
      url:     'https://api.example.com/v1/products',
      headers: {},
    })

    expect(result).toEqual({ id: '1', name: 'Product' })
  })

  it('returns null for empty response (204 No Content)', async () => {
    mockFetch.mockResolvedValue({
      ok:   true,
      text: async () => '',
    })

    const result = await executeFetch({ method: 'DELETE', url: '/item/1', headers: {} })
    expect(result).toBeNull()
  })

  it('throws WeldNetworkError on non-2xx response', async () => {
    mockFetch.mockResolvedValue({
      ok:         false,
      status:     404,
      statusText: 'Not Found',
      text:       async () => '',
    })

    await expect(
      executeFetch({ method: 'GET', url: '/missing', headers: {} })
    ).rejects.toThrow(WeldNetworkError)
  })

  it('WeldNetworkError contains the HTTP status code', async () => {
    mockFetch.mockResolvedValue({
      ok:         false,
      status:     500,
      statusText: 'Internal Server Error',
      text:       async () => '',
    })

    try {
      await executeFetch({ method: 'GET', url: '/error', headers: {} })
    } catch (err) {
      expect(err).toBeInstanceOf(WeldNetworkError)
      expect((err as WeldNetworkError).status).toBe(500)
    }
  })

  it('sends body as JSON string for POST requests', async () => {
    mockFetch.mockResolvedValue({
      ok:   true,
      text: async () => JSON.stringify({ id: '99' }),
    })

    await executeFetch({
      method:  'POST',
      url:     '/products',
      headers: {},
      body:    { name: 'New Product', price: 99 },
    })

    const callArgs = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(callArgs[1].body).toBe('{"name":"New Product","price":99}')
  })
})
