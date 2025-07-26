<script setup lang="ts">
import CodeMirror from 'codemirror';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/display/placeholder';



const props = defineProps<{ step: Step }>();
const emit = defineEmits<{
  (e: 'input', value: string): void;
}>();

const editorElm = ref<HTMLTextAreaElement | null>(null);
let cm: CodeMirror.Editor | null = null

watch(
  () => props.step?.uuid,
  () => {
    if (cm && props.step) {
      cm.setValue(props.step.body ?? '')
    }
  }
);

onMounted(() => {
  if (!editorElm.value) return;

  cm = CodeMirror.fromTextArea(editorElm.value, {
    value: props.step?.body,
    mode: 'markdown',
    indentUnit: 2,
    indentWithTabs: false,
    smartIndent: true,
    lineWrapping: true,
    lineNumbers: false,
    theme: 'default',
    tabSize: 2,
    extraKeys: {
      Tab: codemirror => codemirror.execCommand("indentMore"),
      "Shift-Tab": codemirror => codemirror.execCommand("indentLess")
    }
  });

  cm.setValue(props.step.body || '')
  cm.on('change', (instance) => {
    emit('input', instance.getValue());
  });
});

onBeforeUnmount(() => {
  if (cm) {
    cm = null;
  }
});

</script>

<template>
  <div>
    <textarea 
        ref="editorElm" 
        class="font-sans text-base w-full max-w-full border-gray-400 border-dashed border-2 rounded-lg mb-6 p-6">
    </textarea>
    <div class="bg-white rounded-lg p-8 mt-5 text-gray-600">
      <SnippetsAppSnippetStepMarkdown :value="props.step.body" />
    </div>
  </div>
</template>

<style module>
.CodeMirror {
  @apply font-sans text-base w-full max-w-full border-gray-400 border-dashed border-2 rounded-lg mb-6 p-8;
}
</style>