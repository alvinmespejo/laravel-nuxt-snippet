<!-- pages/index.vue -->
<script setup lang="ts">
import type { UseFetchOptions } from '#app';
import AppSnippetCard from '~/components/Snippets/AppSnippetCard.vue';

// Define interfaces

interface SnippetsResponse {
  data: Snippet[];
}

interface SnippetResponse {
  data: Snippet;
}

// const { data: user } = useAuth();

// Use useAsyncData with explicit typing
// const { data, error, pending } = await useAsyncData<SnippetsResponse>(
//   `snippets-${user.value?.id}`,
//   () => $fetch<SnippetsResponse>('http://localhost:8000/api/snippets', {
//     method: 'GET',
//     query: {
//       snippets: 'private',
//     },
//   }),
//   {
//     lazy: false,
//   },
// );

// const snippets = computed(() => data.value?.data);

const options: UseFetchOptions<SnippetsResponse, Snippet[]> = {
  method: 'GET',
  query: {
    limit: 10,
  },
  transform: (resp: SnippetsResponse): Snippet[] => resp.data,
};

const { data: snippets, error, pending } = await useFetchAPI<SnippetsResponse, Snippet[]>('/snippets/me', options);

useHead({
  title: 'Dashboard',
});

definePageMeta({
  layout: 'dashboard',
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/auth/signin',
  },
});

const createSnippet = async () => {
  const options: UseFetchOptions<SnippetResponse, Snippet> = {
    method: 'POST',
    transform: (resp: SnippetResponse): Snippet => resp.data,
  };

  const { data: snippet } = await useFetchAPI<SnippetResponse, Snippet>('/snippets', options);
  await navigateTo({ name: 'snippets-id-edit', params: { id: snippet.value?.uuid } });
};
</script>

<template>
  <div>
    <div class="flex justify-between">
      <h1 class="text-xl text-gray-600 font-medium mb-6">
        Your snippets
      </h1>
      <a
        href="#"
        @click.prevent="createSnippet"
      >Create Snippets</a>
    </div>

    <div
      v-if="pending"
      class="text-gray-500 font-medium"
    >
      Loading...
    </div>

    <div
      v-else-if="error"
      class="text-gray-500 font-medium"
    >
      Error: {{ error.message }}
    </div>

    <div
      v-else-if="!snippets || !snippets.length"
      class="text-gray-500 font-medium"
    >
      There are no snippets here. You know what to do.
    </div>

    <div v-else>
      <AppSnippetCard
        v-for="snippet in snippets"
        :key="snippet.uuid"
        :snippet="snippet"
      />
    </div>
  </div>
</template>
