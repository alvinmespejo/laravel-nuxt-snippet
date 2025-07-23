<template>
  <a
    href="#"
    class="block mb-2 p-3 bg-blue-500 rounded-lg mr-2 lg:mr-0"
    title="Delete Snippet"
    @click.prevent="handleAddStep"
  >
  <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="fill-current text-white h-6 w-6"
    >
      <path
        class="heroicon-ui"
        d="M17 11a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4z"
      />
    </svg>
  </a>
</template>

<script setup lang="ts">
const api = useAPI2()

interface Props {
  snippet: Snippet;
  currentStep: Step;
  position: 'before' | 'after'
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'added', payload: Step | null): void
}>();

interface Form {
  [key:string]: any
}

const handleAddStep = async(_: MouseEvent) => {
  let stepForm: Form = {
    'position': props.position,
    'uuid': props.currentStep.uuid 
  }

  let response = await api.post<Step, Form>(
    `/snippets/${props.snippet.uuid}/steps`, stepForm,
    { transform: (resp: { data: Step }): Step => resp.data }
  )

  emits('added', response.data)
};
// defineProps({
//   snippet: {
//     type: Object as PropType<Snippet>,
//     required: true,
//   },
//   currentStep: {
//     type: Object as PropType<Step>,
//     required: true,
//   },
//   position: {
//     required: true,
//     type: String as PropType<'before' | 'after'>,
//   },
// });
</script>
