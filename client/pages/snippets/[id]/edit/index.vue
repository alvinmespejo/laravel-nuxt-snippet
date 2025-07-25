<script setup lang="ts">
import { debounce as _debounce } from 'lodash';
import AppSnippetDeleteBtn from '~/components/Snippets/AppSnippetDeleteBtn.vue';
import AppSnippetStepButton from '~/components/Snippets/AppSnippetStepButton.vue';
import AppSnippetAddBtn from '~/components/Snippets/AppSnippetAddBtn.vue';
import AppSnippetStepList from '~/components/Snippets/AppSnippetStepList.vue';
import AppSnippetStepEditor from '~/components/Snippets/AppSnippetStepEditor.vue';

const api = useAPI2();
const route = useRoute();
const { $api } = useNuxtApp();

interface ApiResponse {
  data: Snippet;
}

interface ApiStepResponse {
  data: Step;
}

interface SnippetForm {
  title?: string;
  is_public?: boolean;
}

interface StepForm {
  title?: string;
  body?: string;
}

const { token } = useAuth();

const snippetId = computed(() => route.params.id)

const { data, error, status } = await useAsyncData<ApiResponse>(
  `snippet-${snippetId}`,
  () => {

      return $fetch<ApiResponse>(`/snippets/${snippetId.value}`, {
        baseURL: 'http://localhost:8000/api',
        method: 'GET',
        onRequest({options}) {
          if (token.value) {
            options.headers.set('Authorization', `Bearer ${token.value}`);
          }
        }
      });

  }
);

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

  // snippet.value?.steps?.push(step)
  steps.value.push(step)
  goToStep(step)
  console.log(step)
  console.log(currentStep)
};

const handleStepDeleted = async (step: Step) => {
  if (!steps.value || steps.value.length <= 0) {
    return;
  }

  if (steps.value.length === 1) {
    let lastStep = steps.value?.[0];
    if (lastStep.uuid === step.uuid) {
      await api.destroy(`/snippets/${snippet.value?.uuid}`);
      await navigateTo({ name: 'dashboard' });
    }

    return;
  }

  if (snippet.value?.steps) {
    steps.value = steps.value.filter((s) => s.uuid !== step.uuid);
    goToStep(prevStep.value || firstStep.value);
  }
};

function touchLastSaved() {
  lastSaved.value = new Date().toISOString();
}

const lastSavedFormatted = computed(() => {
  if (lastSaved.value) {
    let date = new Date(lastSaved.value);

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
      let form: SnippetForm = { title: title };
      await api.patch<ApiResponse, SnippetForm>(
        `/snippets/${snippet.value?.uuid}`,
        form
      );
    } catch (e: any) {
      console.error('ERROR updating snippet title', e);
    }

    touchLastSaved();
  }, 500)
);

watch(
  () => snippet.value?.is_public,
  _debounce(async (isPublic) => {
    let form: SnippetForm = { is_public: isPublic };
    await api.patch(`/snippets/${snippet.value?.uuid}`, {
      form,
    });

    touchLastSaved();
  }, 500)
);

watch(
  () => currentStep,
  _debounce(async (step) => {
    let form: StepForm = {
      title: step.value.title,
      body: step.value.body,
    };

    let s = await api.patch<ApiStepResponse, StepForm>(
      `/snippets/${snippet.value?.uuid}/steps/${step.value.uuid}`,
      form
    );
    console.log(s.data)

    touchLastSaved();
  }, 500),
  { deep: true }
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

const handleCurrentStepBodyChange = (e: string) => {
  currentStep.value.body = e;
};
</script>

<template>
  <div>
    <ClientOnly>
      <div v-if="snippet && steps">
        <div class="bg-white mb-16 rounded-md">
          <div class="container">
            <div class="p-6">
              <input
                class="text-4xl text-gray-700 font-header leading-tight mb-4 w-full block p-2 border-gray-400 border-2 rounded border-dashed"
                placeholder="Untitled snippet"
                v-model="snippet.title"
              />
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
              class="w-full text-xl text-gray-600 font-medium font-header p-2 py-1 bg-transparent border-gray-400 border-2 rounded border-dashed"
              type="text"
              placeholder="Untitled step"
              v-model="currentStep.title"
            />
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
                  :currentStep="currentStep"
                  @added="handleStepAdded"
                />
              </div>
              <div class="w-full lg:mr-2">
                <ClientOnly>
                  <AppSnippetStepEditor
                    @input="handleCurrentStepBodyChange"
                    :step="currentStep"
                    v-model="currentStep.body"
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
                  :currentStep="currentStep"
                  @added="handleStepAdded"
                />
                <AppSnippetDeleteBtn
                  v-if="steps?.length"
                  :snippet="snippet"
                  :currentStep="currentStep"
                  @deleted="handleStepDeleted"
                />
              </div>
            </div>
            <div class="w-full lg:w-4/12">
              <div class="mb-5">
                <h1 class="text-xl text-gray-600 font-medium mb-4">Steps</h1>
                <AppSnippetStepList
                  :steps="orderedStepAsc"
                  :currentStep="currentStep"
                />
              </div>
  
              <div class="borde-t-2 border-gray-300 py-6">
                <h1 class="text-xl text-gray-600 font-medium mb-2">Publishing</h1>
                <div class="text-gray-500 text-sm mb-4">
                  <template v-if="lastSaved"
                    >Last saved at {{ lastSavedFormatted }}</template
                  >
                  <template v-else>No changes saved in this session yet</template>
                </div>
  
                <div class="flex items-baseline">
                  <input
                    v-model="snippet.is_public"
                    type="checkbox"
                    name="public"
                    id="public"
                    class="mr-2"
                  />
                  <div>
                    <label for="public" class="text-gray-600 font-medium">
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
      <!-- <div v-if="status == 'idle' || status =='pending'">Loading snippets</div>
      <div v-if="error">Error loading...</div> -->
    </ClientOnly>
  </div>
</template>
