<script setup lang="ts">
useHead({
  title: 'Sign up',
});

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/dashboard',
  },
});
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <AppSignupForm />
  </div>
</template>
