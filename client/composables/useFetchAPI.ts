import { useFetch, useNuxtApp } from 'nuxt/app';
import type { UseFetchOptions } from 'nuxt/app';

/**
 * R = response type
 * T = transform data type -Expected
 *
 * @param url
 * @param options
 * @returns
 */
export function useFetchAPI<R, T>(
  url: string | (() => string),
  options?: UseFetchOptions<R, T>,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch,
  });
}
