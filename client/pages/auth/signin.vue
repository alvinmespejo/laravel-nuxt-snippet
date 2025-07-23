<script setup lang="ts">
useHead({
  title: 'Sign In',
});

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/dashboard',
  },
});
</script>

<template>
  <div class="flex h-screen items-center justify-center px-4">
    <AppSigninForm />
  </div>
</template>
