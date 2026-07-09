/**
 * WELD — Pipeline Layer 3: Network
 * Handles the actual fetch() call with timeout and AbortController support.
 */

export interface FetchOptions {
  method:   string
  url:      string
  headers:  Record<string, string>
  body?:    unknown
  timeout?: number
  signal?:  AbortSignal
}

/**
 * Executes a fetch request with an optional timeout.
 * Throws a WeldNetworkError on non-2xx responses.
 */
export async function executeFetch(options: FetchOptions): Promise<unknown> {
  const { method, url, headers, body, timeout = 10_000, signal } = options

  const controller = new AbortController()

  // Merge external abort signal with our timeout signal
  const timeoutId = setTimeout(() => controller.abort(new Error('Request timed out')), timeout)

  // If caller provides an external signal, forward its abort
  signal?.addEventListener('abort', () => controller.abort(signal.reason))

  try {
    const fetchInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    }

    if (body !== undefined) {
      fetchInit.body = JSON.stringify(body)
    }

    const response = await fetch(url, fetchInit)

    if (!response.ok) {
      throw new WeldNetworkError(
        `Request failed: ${response.status} ${response.statusText}`,
        response.status,
      )
    }

    // Handle empty responses (204 No Content)
    const text = await response.text()
    return text.length > 0 ? (JSON.parse(text) as unknown) : null
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Returns true when the runtime has network connectivity.
 * Falls back to true in non-browser environments (Node, Bun, Deno).
 */
export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true
  return navigator.onLine
}

export class WeldNetworkError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'WeldNetworkError'
  }
}
