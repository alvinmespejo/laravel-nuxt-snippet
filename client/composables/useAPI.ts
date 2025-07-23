import { $fetch } from 'ofetch';
import { useAsyncData, navigateTo } from '#app';

interface ApiResponse<T> {
  data: T | null;
  error: any | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  execute: () => Promise<void>;
}

interface ApiOptions {
  headers?: Record<string, string>;
  query?: Record<string, any>;
  transform?: (data: any) => any;
}

interface ApiConfig {
  unauthorizedRedirect?: string; // Route to redirect to on 401
}

export function useAPI<TResponse, TBody = unknown>(config: ApiConfig = {}) {
  // Create a custom $fetch instance with a 401 interceptor
  const { token } = useAuth()
  const configEnv = useRuntimeConfig();

  const customFetch = $fetch.create({
    baseURL: `${configEnv.public.apiBaseURL}/api`,
    onRequest({ options }) {
        options.headers.set('Authorization', `Bearer ${token}`);
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await navigateTo('/auth/signin');
      }
    },
  });

  const get = async (
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<TResponse>> => {
    const { data, status, error, refresh } = await useAsyncData<TResponse>(
      `GET_${url}_${Date.now()}`,
      async () => {
        try {
          return await customFetch<TResponse>(url, {
            method: 'GET',
            headers: options.headers,
            query: options.query,
            ...(options.transform && { transform: options.transform }),
          });
        } catch (err) {
          throw err;
        }
      }
    );

    return {
      data: data.value as TResponse,
      error: error.value,
      status: status.value,
      execute: refresh,
    };
  };

  const post = async (
    url: string,
    body: TBody,
    options: ApiOptions = {}
  ): Promise<ApiResponse<TResponse>> => {
    const { data, status, error, refresh } = await useAsyncData<TResponse>(
      `POST_${url}_${Date.now()}`,
      async () => {
        try {
          return await customFetch<TResponse>(url, {
            method: 'POST',
            body: body as any,
            headers: options.headers,
            query: options.query,
            ...(options.transform && { transform: options.transform }),
          });
        } catch (err) {
          throw err;
        }
      }
    );

    return {
      data: data.value as TResponse,
      error: error.value,
      status: status.value,
      execute: refresh,
    };
  };

  const patch = async (
    url: string,
    body: TBody,
    options: ApiOptions = {}
  ): Promise<ApiResponse<TResponse>> => {
    const { data, status, error, refresh } = await useAsyncData<TResponse>(
      `PATCH_${url}_${Date.now()}`,
      async () => {
        try {
          return await customFetch<TResponse>(url, {
            method: 'PATCH',
            body: body as any,
            headers: options.headers,
            query: options.query,
            ...(options.transform && { transform: options.transform }),
          });
        } catch (err) {
          throw err;
        }
      }
    );

    return {
      data: data.value as TResponse,
      error: error.value,
      status: status.value,
      execute: refresh,
    };
  };

  const destroy = async (
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<TResponse>> => {
    const { data, status, error, refresh } = await useAsyncData<TResponse>(
      `DELETE_${url}_${Date.now()}`,
      async () => {
        try {
          return await customFetch<TResponse>(url, {
            method: 'DELETE',
            headers: options.headers,
            query: options.query,
            ...(options.transform && { transform: options.transform }),
          });
        } catch (err) {
          throw err;
        }
      }
    );

    return {
      data: data.value as TResponse,
      error: error.value,
      status: status.value,
      execute: refresh,
    };
  };

  const put = async (
    url: string,
    body: TBody,
    options: ApiOptions = {}
  ): Promise<ApiResponse<TResponse>> => {
    const { data, status, error, refresh } = await useAsyncData<TResponse>(
      `PUT_${url}_${Date.now()}`,
      async () => {
        try {
          return await customFetch<TResponse>(url, {
            method: 'PUT',
            body: body as any,
            headers: options.headers,
            query: options.query,
            ...(options.transform && { transform: options.transform }),
          });
        } catch (err) {
          throw err;
        }
      }
    );

    return {
      data: data.value as TResponse,
      error: error.value,
      status: status.value,
      execute: refresh,
    };
  };

  return { get, post, patch, destroy, put };
}
