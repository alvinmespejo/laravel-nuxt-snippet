<script setup lang="ts">
import { debounce as _debounce } from 'lodash';
import AppSnippetDeleteBtn from '~/components/Snippets/AppSnippetDeleteBtn.vue';
import AppSnippetStepButton from '~/components/Snippets/AppSnippetStepButton.vue';
import AppSnippetAddBtn from '~/components/Snippets/AppSnippetAddBtn.vue';
import AppSnippetStepList from '~/components/Snippets/AppSnippetStepList.vue';
import AppSnippetStepEditor from '~/components/Snippets/AppSnippetStepEditor.vue';

import type { FetchOptions } from 'ofetch';
import { toast } from 'vue-sonner';

const api = useAPI();
const route = useRoute();
const errors = ref<APIResponseError>({});

type ApiResponse = {
  data: Snippet;
};

type ApiStepResponse = {
  data: Step;
};

type SnippetForm = {
  title?: string;
  is_public?: boolean;
};

type StepForm = {
  title?: string;
  body?: string;
};

const { token } = useAuth();

const snippetId = computed(() => route.params.id);

// TODO: use API2 composable
const { data, error, status } = await useAsyncData<ApiResponse>(
  `snippet-${snippetId.value}`,
  () => {
    return $fetch<ApiResponse>(`/snippets/${snippetId.value}`, {
      baseURL: 'http://localhost:8000/api',
      method: 'GET',
      onRequest({ options }) {
        if (token.value) {
          options.headers.set('Authorization', `Bearer ${token.value}`);
        }
      },
    });
  },
);

if (error.value && status.value === 'error') {
  toast.error('Error', {
    description: error.value.statusMessage
  })
}

const snippet = ref<Snippet | undefined>(data.value?.data);
const steps = ref<Step[]>(snippet.value?.steps || []);
const prevStep = ref<Step>();
const lastSaved = ref<string | null>(null);

const {
  currentStep,
  currentStepIndex,
  nextStep,
  previousStep,
  orderedStepAsc,
  firstStep,
  goToStep,
  registerKeyboardShortcuts,
} = useBrowseSnippet(steps);

const handleStepAdded = (step: Step | null) => {
  if (!step) {
    return;
  }

  steps.value.push(step);
  goToStep(step);
};

const handleStepDeleted = async (step: Step) => {
  if (!steps.value || steps.value.length <= 0) {
    return;
  }

  if (steps.value.length === 1) {
    const lastStep = steps.value?.[0];
    if (lastStep.uuid === step.uuid) {
      await navigateTo({ name: 'dashboard' });
    }

    return;
  }

  if (snippet.value?.steps) {
    steps.value = steps.value.filter(s => s.uuid !== step.uuid);
    goToStep(prevStep.value || firstStep.value);
  }
};

const handleCurrentStepBodyChange = (e: string) => {
  currentStep.value.body = e;
};

function touchLastSaved() {
  lastSaved.value = new Date().toISOString();
}

const lastSavedFormatted = computed(() => {
  if (lastSaved.value) {
    const date = new Date(lastSaved.value);

    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour12: true,
    });
  }

  return lastSaved.value;
});

watch(
  () => snippet.value?.title,
  _debounce(async (title) => {
    try {
      const opts: FetchOptions = {
        retry: 2,
        query: { snippet: snippet.value?.uuid },
      };

      const form: SnippetForm = { title: title };
      await api.patch<ApiResponse, SnippetForm>(
        `/snippets/${snippet.value?.uuid}`,
        form,
        opts,
      );

      touchLastSaved();
    }
    catch (e: Error | any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      errors.value
        = parseInt(e.status) === 422 ? e.data.errors : { general: e._data.error || e.message };

      if (parseInt(e.status) >= 500) {
        toast.error('Error', {
          description: errors.value.general,
        });
      }

      if (parseInt(e.status) === 422) {
        toast.warning('Invalid Input', {
          description: errors.value,
        });
      }
    }
  }, 500),
);

watch(
  () => snippet.value?.is_public,
  _debounce(async (isPublic) => {
    try {
      const form: SnippetForm = { is_public: isPublic };
      await api.patch(`/snippets/${snippet.value?.uuid}`, form);

      touchLastSaved();
    }
    catch (e: Error | any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      errors.value
        = parseInt(e.status) === 422 ? e.data.errors : { general: e._data.error || e.message };

      if (parseInt(e.status) >= 500) {
        toast.error('Error', {
          description: errors.value.general,
        });
      }

      if (parseInt(e.status) === 422) {
        toast.warning('Invalid Input', {
          description: errors.value,
        });
      }
    }
  }, 500),
);

watch(
  () => currentStep,
  _debounce(async (step) => {
    try {
      const form: StepForm = {
        title: step.value.title,
        body: step.value.body,
      };

      await api.patch<ApiStepResponse, StepForm>(
        `/snippets/${snippet.value?.uuid}/steps/${step.value.uuid}`,
        form,
      );

      touchLastSaved();
    }
    catch (e: Error | any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      errors.value
      = parseInt(e.status) === 422 ? e.data.errors : { general: e._data.error || e.message };

      if (parseInt(e.status) >= 500) {
        toast.error('Error', {
          description: errors.value.general,
        });
      }

      if (parseInt(e.status) === 422) {
        toast.warning('Invalid Input', {
          description: errors.value,
        });
      }
    }
  }, 500),
  { deep: true },
);

onMounted(() => {
  registerKeyboardShortcuts();
});

useHead({
  title: snippet.value?.title
    ? `Editing ${snippet.value?.title}`
    : 'Untitled Snippet',
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
      <div v-if="snippet && steps">
        <div class="bg-white mb-16 rounded-md">
          <div class="container">
            <div class="p-6">
              <input
                v-model="snippet.title"
                class="text-4xl text-gray-700 font-header leading-tight mb-4 w-full block p-2 border-gray-400 border-2 rounded border-dashed"
                placeholder="Untitled snippet"
              >
              <div class="text-gray-600">
                Created by
                <NuxtLink :to="{ name: 'dashboard' }">
                  {{ snippet.author.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="flex items-center mb-6">
            <div class="text-xl text-gray-600 font-header font-medium mr-3">
              {{ currentStepIndex + 1 }}/{{ steps?.length }}.
            </div>
            <input
              v-model="currentStep.title"
              class="w-full text-xl text-gray-600 font-medium font-header p-2 py-1 bg-transparent border-gray-400 border-2 rounded border-dashed"
              type="text"
              placeholder="Untitled step"
            >
          </div>
          <div class="flex flex-wrap lg:flex-nowrap">
            <div
              class="w-full lg:w-8/12 lg:mr-10 flex flex-wrap lg:flex-nowrap justify-between items-start mb-6"
            >
              <div class="order-first flex flex-row lg:flex-col mr-2">
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

                <AppSnippetAddBtn
                  position="before"
                  :snippet="snippet"
                  :current-step="currentStep"
                  @added="handleStepAdded"
                />
              </div>
              <div class="w-full lg:mr-2">
                <ClientOnly>
                  <AppSnippetStepEditor
                    v-model="currentStep.body"
                    :step="currentStep"
                    @input="handleCurrentStepBodyChange"
                  />
                  <template #fallback>
                    <div>Loading editor...</div>
                  </template>
                </ClientOnly>
              </div>

              <div
                class="order-first lg:order-last flex flex-row-reverse lg:flex-col"
              >
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
                <AppSnippetAddBtn
                  position="after"
                  :snippet="snippet"
                  :current-step="currentStep"
                  @added="handleStepAdded"
                />
                <AppSnippetDeleteBtn
                  v-if="steps?.length"
                  :snippet="snippet"
                  :current-step="currentStep"
                  @deleted="handleStepDeleted"
                />
              </div>
            </div>
            <div class="w-full lg:w-4/12">
              <div class="mb-5">
                <h1 class="text-xl text-gray-600 font-medium mb-4">
                  Steps
                </h1>
                <AppSnippetStepList
                  :steps="orderedStepAsc"
                  :current-step="currentStep"
                />
              </div>

              <div class="borde-t-2 border-gray-300 py-6">
                <h1 class="text-xl text-gray-600 font-medium mb-2">
                  Publishing
                </h1>
                <div class="text-gray-500 text-sm mb-4">
                  <template v-if="lastSaved">
                    Last saved at {{ lastSavedFormatted }}
                  </template>
                  <template v-else>
                    No changes saved in this session yet
                  </template>
                </div>

                <div class="flex items-baseline">
                  <input
                    id="public"
                    v-model="snippet.is_public"
                    type="checkbox"
                    name="public"
                    class="mr-2"
                  >
                  <div>
                    <label
                      for="public"
                      class="text-gray-600 font-medium"
                    >
                      Make this snippet public
                    </label>
                    <div class="text-gray-500 text-sm">
                      Dont worry, you can change this later
                    </div>
                  </div>
                </div>
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
      </div>
      <div v-if="status == 'idle' || status == 'pending'">
        Loading snippets
      </div>
      <div v-if="error">
        Error loading...
      </div>
    </ClientOnly>
  </div>
</template>
