<script setup lang="ts">
import type { UseFetchOptions } from '#app';
import AppSnippetCard from '~/components/Snippets/AppSnippetCard.vue';

interface Response {
  data: Snippet[];
}

const options: UseFetchOptions<Response, Snippet[]> = {
  method: 'GET',
  query: {
    limit: 15,
  },
  transform: (resp: Response): Snippet[] => resp.data,
};

const { data: snippets, error, pending } = await useFetchAPI<Response, Snippet[]>('/snippets', options);

useHead({
  title: 'Snippets by Codecourse',
});

definePageMeta({
  layout: 'dashboard',
  auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/auth/signin',
  },
});
</script>

<template>
  <div>
    <div class="flex justify-between">
      <h1 class="text-xl text-gray-600 font-medium mb-6">
        Snippets
      </h1>
      <!-- <a
        href="#"
        @click.prevent="createSnippet"
      >Create Snippets</a> -->
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
