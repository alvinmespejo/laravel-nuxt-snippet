<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from './ui/form';
import FormItem from './ui/form/FormItem.vue';
import FormControl from './ui/form/FormControl.vue';
import FormMessage from './ui/form/FormMessage.vue';
import { Loader2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const { signIn } = useAuth();
const isSigningIn = ref<boolean>(false);
const errors = ref<APIResponseError>({});

const zodSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string(),
});

const form = useForm({
  validationSchema: toTypedSchema(zodSchema),
});

const onSubmit = form.handleSubmit(async (values) => {
  if (isSigningIn.value) {
    return;
  }

  try {
    isSigningIn.value = true;
    await signIn(values, { callbackUrl: '/dashboard' });
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  }
  catch (e: Error | any) {
    errors.value
      = e.statusCode === 422
        ? e.data.errors
        : { general: e.message };

    if (e.statusCode === 422) {
      errors.value = e.data.errors;
    }
    else if (e.statusCode === 401) {
      errors.value = { general: e.data.data };
      toast.error('Error', {
        description: errors.value.general,
      });
    }
    else {
      errors.value = { general: e.message };
      toast.error('Error', {
        description: errors.value,
      });
    }

    isSigningIn.value = false;
  }
});
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Sign in
      </CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <form
          class="space-y-4"
          @submit.prevent="onSubmit"
        >
          <div class="grid gap-2">
            <FormField
              v-slot="{ componentField }"
              name="email"
            >
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
                <div
                  v-if="errors.email"
                  class="text-destructive-foreground text-sm"
                >
                  {{ errors.email[0] }}
                </div>
              </FormItem>
            </FormField>
          </div>
          <div class="grid gap-2">
            <!-- <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="#" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" placeholder="*********" /> -->
            <FormField
              v-slot="{ componentField }"
              name="password"
            >
              <FormItem>
                <div class="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <a
                    href="#"
                    class="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
                <div
                  v-if="errors.password"
                  class="text-destructive-foreground text-sm"
                >
                  {{ errors.password[0] }}
                </div>
              </FormItem>
            </FormField>
          </div>
          <Button
            type="submit"
            class="w-full cursor-pointer"
            :class="{ 'cursor-not-allowed opacity-20': isSigningIn }"
            :disabled="isSigningIn"
          >
            <Loader2
              v-if="isSigningIn"
              class="size-4 animate-spin"
            />
            {{ isSigningIn ? 'Signing in....' : 'Sign in' }}
          </Button>
        </form>
      </div>
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <NuxtLink
          to="/auth/signup"
          class="underline"
        > Sign up </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>
