import { $fetch, type FetchOptions } from 'ofetch';
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

interface GenericFormData {
  [key: string]: any;
}


export function useAPI2(config: ApiConfig = {}) {
  // Create a custom $fetch instance with a 401 interceptor
  // and authorization header.
  const { token } = useAuth();
  const configEnv = useRuntimeConfig();
  
  const customFetch = $fetch.create({
    baseURL: `${configEnv.public.apiBaseURL}/api`,
    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`);
      }

      if (!options.headers.has('Content-Type') && options.body) {
        options.headers.set('Content-Type', 'application/json');
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await navigateTo('/auth/signin');
      }

      throw response;
    },
  });

  const get = async<TResponse = unknown, TBody = unknown>(
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<TResponse>> => {
    const { data, status, error, refresh } = await useAsyncData<TResponse>(
      `GET_${url}_${Date.now()}`,
      async () => {
        return await customFetch<TResponse>(url, {
          method: 'GET',
          headers: options.headers,
          query: options.query,
          ...(options.transform && { transform: options.transform }),
        });
      }
    );

    return {
      data: data.value as any,
      error: error.value,
      status: status.value,
      execute: refresh,
    };
  };

  const post = async <
    TResponse = unknown,
    TBody extends GenericFormData = GenericFormData,
  >(
    url: string,
    body: TBody,
    options: FetchOptions = {}
  ): Promise<TResponse> => {
    return await customFetch<TResponse>(url, {
      method: 'POST',
      body: body,
      headers: options.headers,
      query: options.query,
    });
  };
  

  const patch = async<
    TResponse = unknown,
    TBody extends GenericFormData = GenericFormData,
  >(
    url: string,
    body: TBody,
    options: FetchOptions = {}
  ): Promise<TResponse> => {
    return await customFetch<TResponse>(url, { 
      method: 'PATCH', 
      body: body,
      headers: options.headers,
      query: options.query
    })
  };

  const destroy = async <
    TResponse
  >(
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<TResponse>> => {
    const { data, status, error, refresh } = await useAsyncData<TResponse>(
      `DELETE_${url}_${Date.now()}`,
      async () => {
        return await customFetch<TResponse>(url, {
          method: 'DELETE',
          headers: options.headers,
          query: options.query,
          ...(options.transform && { transform: options.transform }),
        });
      }
    );

    return {
      data: data.value as TResponse,
      error: error.value,
      status: status.value,
      execute: refresh,
    };
  };

  const put = async<
    TResponse = unknown,
    TBody extends GenericFormData = GenericFormData,
  >(
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

  return { 
    get, 
    post, 
    patch, 
    destroy, 
    put 
  };
}
