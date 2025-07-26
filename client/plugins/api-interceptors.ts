// plugins/api-interceptor.ts
import { useAuth } from '#imports';
// import type { NitroFetchOptions } from 'nitropack';

// export default defineNuxtPlugin(async (nuxtApp) => {
//   const { signOut, status, getSession, token } = useAuth();
//   const config = useRuntimeConfig();
//   const API_BASE_URL = <string | undefined>config.public.apiBase;

//   let isRefreshing = false;
//   let refreshPromise: Promise<void> | null = null;

//   nuxtApp.hook('app:mounted', () => {
//     $fetch.create({
//       baseURL: API_BASE_URL,
//       onRequest({request, options, error}) {
//         options.headers.set('Authorization', `Bearer ${token}`)
//       },
//       async onResponseError({ error, request, response, options }) {
//         // Ensure requestUrl is safely accessed. response.url is generally safer and always a string.
//         const requestUrl
//           = response.url
//             || (typeof request === 'string' ? request : (request as Request).url);
//         const isAuthEndpoint
//           = requestUrl.includes('/login')
//             || requestUrl.includes('/register')
//             || requestUrl.includes('/refresh');

//         if (response.status === 401 && !isAuthEndpoint) {
//           if (status.value === 'authenticated') {
//             console.warn(
//               'Access token expired or unauthorized. Attempting to refresh token...',
//             );

//             if (isRefreshing && refreshPromise) {
//               await refreshPromise;
//               // Construct a new options object explicitly typed for $fetch retry
//               // We'll be more explicit about which properties we're carrying over

//               const retryOptions: NitroFetchOptions<any> = { // eslint-disable-line  @typescript-eslint/no-explicit-any
//                 method: options.method as
//                 | 'get'
//                 | 'post'
//                 | 'put'
//                 | 'delete'
//                 | 'patch'
//                 | 'head'
//                 | 'options'
//                 | 'connect'
//                 | 'trace', // Explicitly cast if issues persist
//                 headers: options.headers,
//                 body: options.body,
//                 params: options.params,
//                 query: options.query,
//               };

//               return $fetch(request as string, retryOptions);
//             }

//             isRefreshing = true;
//             refreshPromise = new Promise<void>(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
//               try {
//                 const refreshResponse: any = await $fetch( // eslint-disable-line  @typescript-eslint/no-explicit-any
//                   `${API_BASE_URL}/auth/refresh`,
//                   {
//                     method: 'POST',
//                   },
//                 );

//                 if (refreshResponse?.access_token) {
//                   console.log(
//                     'Token refreshed successfully. New token received.',
//                   );
//                   await getSession({ force: true });
//                   resolve();
//                 }
//                 else {
//                   console.error(
//                     'Refresh token response did not contain access_token.',
//                   );
//                   await signOut({ callbackUrl: '/auth/signin' });
//                   reject(new Error('Token refresh failed.'));
//                 }
//               }
//               catch (refreshError: any) { // eslint-disable-line  @typescript-eslint/no-explicit-any
//                 console.error('Failed to refresh token:', refreshError);
//                 await signOut({ callbackUrl: '/auth/signin' });
//                 reject(new Error('Token refresh failed.'));
//               }
//               finally {
//                 isRefreshing = false;
//                 refreshPromise = null;
//               }
//             });

//             await refreshPromise;
//             // Retry the original request with the now-refreshed token
//             const retryOptions: NitroFetchOptions<any> = { // eslint-disable-line  @typescript-eslint/no-explicit-any

//               method: options.method as
//               | 'get'
//               | 'post'
//               | 'put'
//               | 'delete'
//               | 'patch'
//               | 'head'
//               | 'options'
//               | 'connect'
//               | 'trace',
//               headers: options.headers,
//               body: options.body,
//               params: options.params,
//               query: options.query,
//               // Add any other original options you need to preserve
//               // e.g., responseType: options.responseType as FetchOptions['responseType'],
//               // timeout: options.timeout,
//               // signal: options.signal,
//             };
//             return $fetch(request as string | Request, retryOptions);
//           }
//           else {
//             console.log(
//               'Unauthorized and not authenticated, redirecting to login.',
//             );
//             await signOut({ callbackUrl: '/auth/signin' });
//             return;
//           }
//         }
//         return Promise.reject(error);
//       },
//     });
//   });
// });

export default defineNuxtPlugin((nuxtApp) => {
  const { token, signOut } = useAuth();
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: `${config.public.apiBaseURL}/api`,
    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`);
        options.headers.set('Content-Type', 'application/json');
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await signOut();
        await nuxtApp.runWithContext(() => navigateTo({ path: 'auth-signin' }));
      }
      throw response;
    },
  });

  return {
    provide: { api },
  };
});
