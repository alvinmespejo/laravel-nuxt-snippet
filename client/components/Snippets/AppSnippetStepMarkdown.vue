<script setup lang="ts">
import Markdownit from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import typesscript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('typescript', typesscript);

// import 'codemirror/lib/codemirror.css';
// import 'highlight.js/styles/github.css';

// Option 1
interface Body {
  value: string | null;
}
// const props = defineProps<{
//     body: Body
// }>()

const props = defineProps<Body>();

const md = new Markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    const esc = md.utils.escapeHtml;
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">'
          + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          + '</code></pre>';
      }
      catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // TODO - show error
      }
    }

    return '<pre><code class="hljs">' + esc(str) + '</code></pre>';
  },
});

const markdown = computed(() => md.render(props.value ?? ''));
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div v-html="markdown" />
  <!-- eslint-enable -->
</template>
