<script setup lang="ts">
const api = useAPI();

const handleDeleteStep = async (_: MouseEvent) => {
  try {
    await api.destroy(`/snippets/${props.snippet.uuid}/steps/${props.currentStep.uuid}`);
    emits('deleted', props.currentStep);
  }
  catch (e: Error | any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Error deleting step', e);
  }
};

const emits = defineEmits<{
  (e: 'deleted', payload: Step): void;
}>();

// Option 1
interface Props {
  currentStep: Step;
  snippet: Snippet;
}

const props = defineProps<Props>();

// Option 2
// const props = defineProps({
//     snippet: {
//         type: Object as PropType<Snippet>,
//         required: true,
//     },
//     currentStep: {
//         type: Object as PropType<Step>,
//         required: true,
//     },
// });
</script>

<template>
  <a
    href="#"
    class="block mb-2 p-3 bg-blue-500 rounded-lg mr-2 lg:mr-0"
    title="Delete Snippet"
    @click.prevent="handleDeleteStep"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="fill-current text-white h-6 w-6"
    >
      <path
        class="heroicon-ui"
        d="M8 6V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2h5a1 1 0 0 1 0 2h-1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8H3a1 1 0 1 1 0-2h5zM6 8v12h12V8H6zm8-2V4h-4v2h4zm-4 4a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1z"
      />
    </svg>
  </a>
</template>
