<template>
  <div class="bg-white  pb-6 pt-6">
    <div class="container flex items-center justify-between">
      <div class="flex flex-wrap items-center lg:flex-no-wrap space-x-3">
        <NuxtLink
          :to="{ name: 'index' }"
          class="mr-10 flex-shrink-0"
        >
          <img
            src="~/assets/icons/logo.svg"
            alt="Logo"
            class="h-8"
          >
        </NuxtLink>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/dashboard">Dashboard</NuxtLink>
      </div>

      <div class="flex items-center space-x-3">
        <template v-if="isAuthenticated">
          <div class="font-semibold">
            {{ name }}
          </div>
          <button
            class="cursor-pointer text-blue-500"
            @click.prevent="signout"
          >
            Sign Out
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: user, status, signOut } = useAuth();

// const isAuthenticated = computed(() => {
//   return status.value === 'authenticated'
// })

const isAuthenticated = computed(() => {
  return status.value === 'authenticated' || status.value === 'loading';
});

const name = computed(() => {
  return user.value?.name;
});

const signout = async () => {
  await signOut({ callbackUrl: 'auth/signin' });
  // await navigateTo('auth/signin')
};
</script>
