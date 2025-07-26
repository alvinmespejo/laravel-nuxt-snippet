import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-auth', '@nuxt/eslint', 'shadcn-nuxt'],
  plugins: ['~/plugins/api-interceptors'],
  imports: {
    autoImport: true,
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: false,
    },
  },
  app: {
    head: {
      titleTemplate: '%s - Snippets',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          // hid: 'description',
          name: 'description',
          content: process.env.npm_package_description || '',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    baseURL: process.env.PUBLIC_API_BASE,
    public: {
      apiBaseURL: `${process.env.PUBLIC_API_BASE}`,
    },
  },
  compatibilityDate: '2025-05-15',
  vite: {
    plugins: [tailwindcss()],
  },

  auth: {
    originEnvKey: process.env.NUXT_PUBLIC_BASE,
    globalAppMiddleware: true,
    baseURL: process.env.PUBLIC_API_BASE,
    provider: {
      type: 'local',
      pages: '/auth/signin',
      endpoints: {
        signIn: { path: '/api/auth/signin', method: 'post' },
        signOut: { path: '/api/auth/signout', method: 'post' },
        signUp: { path: '/api/auth/signup', method: 'post' },
        getSession: { path: '/api/auth/me', method: 'get' },
      },
      token: {
        signInResponseTokenPointer: '/data/access_token',
        type: 'Bearer',
        cookieName: 'auth.token',
        headerName: 'Authorization',
        maxAgeInSeconds: 60 * 60 * 1, // 1hr need to update this to 15 mins in prod
      },
      // refresh: {
      //   isEnabled: true,
      //   refreshOnlyToken: true,
      //   endpoint: { path: '/api/auth/refresh', method: 'post' },
      //   token: {
      //     refreshResponseTokenPointer: '/data/access_token',
      //     signInResponseRefreshTokenPointer: '/data/access_token', // Add this line
      //   }, 
      // },
      session: {
        dataType: {
          id: 'string | number',
          name: 'string',
          email: 'string',
        },
        dataResponsePointer: '/data',
      },
    },
    sessionRefresh: {
      /**
       * JWT token is set to expire every 15 minues but for
       * security reason, send a refresh token every 10 minutes
       * to update the access token on the header.
       */
      enablePeriodically: 600000, // (10 mins)in milliseconds
      enableOnWindowFocus: true,
    },
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
        indent: 2,
        quotes: 'single',
      },
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',

    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
});
