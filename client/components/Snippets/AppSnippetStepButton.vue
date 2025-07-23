<script setup lang="ts">
interface Props {
  step: Step | undefined;
}
defineProps<Props>();
</script>

<template>
  <NuxtLink
    :to="step ? {
            query: { step: step.uuid },
        } : {}"
    class="block mb-2 p-3 bg-blue-500 rounded-lg mr-2 lg:mr-0"
    :class="{ 'opacity-0 pointer-events-none': !step }"
  >
    <slot />
  </NuxtLink>
</template>
