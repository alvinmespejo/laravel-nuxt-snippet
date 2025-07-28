// plugins/api-interceptor.ts
import { useAuth } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
  const { token, signOut } = useAuth();
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: `${config.public.apiBaseURL}/api`,
    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`);
      }

      if (options.body
        && !options.headers.has('Content-Type')
        && ['PUT', 'PATCH', 'POST'].includes(options.method?.toUpperCase() as string)) {
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
