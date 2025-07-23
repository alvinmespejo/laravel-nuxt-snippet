<script setup lang="ts">

import Markdownit from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import typesscript from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('typescript', typesscript);

// Option 1
interface Body {
    value: string | null;
}
// const props = defineProps<{
//     body: Body
// }>()

const props = defineProps<Body>();

const md = new Markdownit({
    highlight: function(str: string, lang: string): string {
        const esc = md.utils.escapeHtml;
        if (lang && hljs.getLanguage(lang)) {
            return (
                '<pre class="hljs language-' +
                esc(lang.toLowerCase()) +
                '"><code>' +
                hljs.highlightAuto(esc(str)).value +
                '</code></pre>'
            )
        }

        return '<pre class="hljs"><code>' + esc(str) + '</code></pre>'; // use external default escaping
    }
})

const markdown = computed(() => md.render(props.value ?? ''));
</script>

<template>
    <div>
        <div v-html="markdown"></div>
    </div>
</template>