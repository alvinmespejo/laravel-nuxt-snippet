<script setup lang="ts">
import { EditorView, keymap, ViewUpdate } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';

const props = defineProps<{ step: Step }>();
const emit = defineEmits<{
  (e: 'input', value: string): void;
}>();

const editorElm = ref<HTMLElement>();
let view: EditorView | null = null;

watch(
  () => props.step.uuid,
  () => {
    if (view) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: props.step.body || '',
        },
      });
    }
  }
);

onMounted(() => {
  if (!editorElm.value) return;
  view = new EditorView({
    state: EditorState.create({
      doc: props.step.body || '',
      extensions: [
        keymap.of([indentWithTab, ...defaultKeymap]),
        // javascript(),
        EditorView.lineWrapping,
        EditorView.updateListener.of((v: ViewUpdate) => {
          if (v.docChanged) {
            emit('input', v.state.doc.toString());
          }
        }),
      ],
    }),
  });
});

onBeforeMount(() => {
  if (view) {
    view.destroy();
    view = null;
  }
});
</script>

<template>
  <div>
    <textarea 
        ref="editorElm" 
        class="font-sans text-base w-full max-w-full border-gray-400 border-dashed border-2 rounded-lg mb-6 p-6"></textarea>
    <div class="bg-white rounded-lg p-8 text-gray-600">
      <SnippetsAppSnippetStepMarkdown :value="props.step.body" />
    </div>
  </div>
</template>

<style scoped>

</style>