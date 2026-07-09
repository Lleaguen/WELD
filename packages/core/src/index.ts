/**
 * @weld/core — Public API
 */

// Main client
export { Weld } from './client/Weld.js'

// Types
export type { AppRouter, RouteDefinition, HttpMethod }  from './types/router.js'
export type { InferResponse, InferBody, InferQuery }    from './types/router.js'
export type { GetRoutes, MutationRoutes }               from './types/router.js'
export type { WeldResponse, WeldSignalState, WeldStatus } from './types/response.js'
export type { WeldRequestOptions, WeldClientConfig, RetryOptions } from './types/request.js'

// Errors
export { WeldNetworkError }    from './pipeline/network.js'
export { WeldValidationError } from './pipeline/validation.js'

// Offline utilities (for advanced usage)
export { syncQueue, registerOnlineSync } from './offline/queue.js'
export { readCache, writeCache }         from './offline/cache.js'
