<script setup lang="ts">
interface Props {
  snippet: Snippet;
}

defineProps<Props>();
</script>

<template>
  <div>
    <NuxtLink
      class="text-gray-600"
      :to="{
        name: 'snippets-id',
        params: { id: snippet.uuid },
      }"
    >
      <div class="flex flex-wrap lg:flex-nowrap items-center justify-between bg-white p-8 rounded-lg w-full mb-2">
        <div class="mr-8 mb-2 lg:mb-0">
          <h1 class="text-gray-600 text-xl leading-snug">

            {{ snippet.title || 'Untitled Snippet' }}

          </h1>
          <div class="text-gray-500 mr-6 font-medium">
            {{ snippet.step_counts }} steps
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
