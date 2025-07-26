<script setup lang="ts">
import type { UseFetchOptions } from '#app';
import AppSnippetStepButton from '~/components/Snippets/AppSnippetStepButton.vue';
import AppSnippetStepList from '~/components/Snippets/AppSnippetStepList.vue';
import AppSnippetStepMarkdown from '~/components/Snippets/AppSnippetStepMarkdown.vue';
import { useFetchAPI } from '~/composables/useFetchAPI';

const route = useRoute();
const { id } = route.params;

interface Response {
  data: Snippet;
}

const options: UseFetchOptions<Response, Snippet> = {
  method: 'GET',
  query: {
    limit: 15,
    public: true,
  },
  transform: (resp: Response): Snippet => resp.data,
};

const { data, error, status } = await useFetchAPI<Response, Snippet>(
  `/snippets/${id}`,
  options,
);

const snippet = computed(() => data.value);
const steps = computed<Step[]>(() => snippet.value?.steps || []);

const {
  currentStep,
  currentStepIndex,
  nextStep,
  previousStep,
  orderedStepAsc,
  registerKeyboardShortcuts,
} = useBrowseSnippet(steps);

useHead({
  title: snippet.value?.title || 'Untitled Snippet',
});

onMounted(() => {
  registerKeyboardShortcuts();
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
    <ClientOnly>
      <template v-if="snippet">
        <div class="bg-white mb-16 rounded-md">
          <div class="container">
            <div class="w-10/12 p-6">
              <h1 class="text-4xl text-gray-700 font-medium leading-tight mb-4">
                {{ snippet?.title || 'Untitled snippet' }}
              </h1>
              <div class="text-gray-600">
                Created by
                <NuxtLink :to="{ name: 'index' }">
                  {{ snippet?.author.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <h1 class="text-xl text-gray-600 font-medium mb-6">
            {{ currentStepIndex + 1 }}/{{ steps ? steps.length : 1 }}.
            {{ currentStep.title }}
          </h1>
          <div class="flex flex-wrap justify-between lg:flex-nowrap">
            <div
              class="w-full lg:w-8/12 flex lg:mr-16 flex-wrap lg:flex-nowrap justify-between items-start mb-8"
            >
              <div class="order-first mr-2">
                <AppSnippetStepButton :step="previousStep">
                  <svg
                    class="fill-current text-white h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5.41 11H21a1 1 0 0 1 0 2H5.41l5.3 5.3a1 1 0 0 1-1.42 1.4l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 0 1 1.42 1.4L5.4 11z"
                    />
                  </svg>
                </AppSnippetStepButton>
              </div>
              <div class="bg-white p-8 rounded-lg text-gray-600 w-full lg:mr-2">
                <AppSnippetStepMarkdown :value="currentStep.body" />
              </div>
              <div class="order-first lg:order-last flex flex-row lg:flex-col">
                <AppSnippetStepButton :step="nextStep">
                  <svg
                    class="fill-current text-white h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M18.59 13H3a1 1 0 0 1 0-2h15.59l-5.3-5.3a1 1 0 1 1 1.42-1.4l7 7a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.42-1.4l5.3-5.3z"
                    />
                  </svg>
                </AppSnippetStepButton>
                <template v-if="snippet?.owner">
                  <NuxtLink
                    :to="{
                      name: 'snippets-id-edit',
                      params: { id: snippet.uuid },
                      query: {
                        step: currentStep.uuid,
                      },
                    }"
                    class="block mb-2 p-3 bg-blue-500 rounded-lg order-first lg:order-last mr-2 lg:mr-0"
                    title="Edit step"
                  >
                    <svg
                      class="fill-current text-white h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6.3 12.3l10-10a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-.7.3H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 .3-.7zM8 16h2.59l9-9L17 4.41l-9 9V16zm10-2a1 1 0 0 1 2 0v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h6a1 1 0 0 1 0 2H4v14h14v-6z"
                      />
                    </svg>
                  </NuxtLink>
                </template>
              </div>
            </div>
            <div class="w-full lg:w-4/12">
              <div class="mb-8">
                <h1 class="text-xl text-gra-600 font-medium mb-2">
                  Steps
                </h1>
                <AppSnippetStepList
                  :steps="orderedStepAsc"
                  :current-step="currentStep"
                />
              </div>
              <div class="text-gray-500 text-sm">
                Use
                <div
                  class="inline-block px-2 rounded bg-gray-400 text-gray-600 text-sm leading-relaxed"
                >
                  ctrl
                </div>
                +
                <div
                  class="inline-block px-2 rounded bg-gray-400 text-gray-600 text-sm leading-relaxed"
                >
                  shift
                </div>
                +
                <div
                  class="inline-block px-2 rounded bg-gray-400 text-gray-600 text-sm leading-relaxed"
                >
                  left or right
                </div>
                on your keyboard to navigate between steps
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="status === 'idle' || status === 'pending'" />
      <template v-if="error" />
    </ClientOnly>
  </div>
</template>
