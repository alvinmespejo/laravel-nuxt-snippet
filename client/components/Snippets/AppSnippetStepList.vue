<script setup lang="ts">
interface Props {
  currentStep: Step;
  steps: Step[];
}
defineProps<Props>();
</script>

<template>
  <div>
    <ul>
      <li
        v-for="(step, index) in steps"
        :key="index"
      >
        <NuxtLink
          :class="{ 'font-bold': step.uuid === currentStep.uuid }"
          :to="{ query: { step: step.uuid } }"
        >
          {{ index + 1 }} {{ step.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
