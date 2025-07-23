<script setup lang="ts">
import * as z from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from './ui/form';
import FormItem from './ui/form/FormItem.vue';
import FormLabel from './ui/form/FormLabel.vue';
import FormControl from './ui/form/FormControl.vue';
import FormMessage from './ui/form/FormMessage.vue';

const { signUp } = useAuth();
const errors = ref<ValidationErr>({});
const isCreatingAccount = ref<boolean>(false);

const zodSchema = z.object({
  name: z.string().min(2, { message: 'Name too short' }),
  email: z.string().email({ message: 'Must be a valid email' }),
  password: z.string({ message: 'Password must be at least 8 chars' }).min(8, { message: 'Password too short' }),
  password_confirmation: z.string(),
})
  .refine(({ password, password_confirmation }) => password === password_confirmation, {
    message: 'Password does not match',
    path: ['password_confirmation'],
  });

const form = useForm({
  validationSchema: toTypedSchema(zodSchema),
});

const onSubmit = form.handleSubmit(async (values) => {
  if (isCreatingAccount.value) {
    return;
  }

  try {
    errors.value = {};
    isCreatingAccount.value = true;
    await signUp(values, {
      preventLoginFlow: true,
      redirect: false,
      callbackUrl: undefined,
      callGetSession: false,
    });

    form.resetForm();
    setTimeout(() => {
      isCreatingAccount.value = false;
    }, 1500);
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  }
  catch (e: Error | any) {
    errors.value = e.statusCode === 422
      ? e.data.errors
      : { general: e.message };
    setTimeout(() => {
      isCreatingAccount.value = false;
    }, 1000);
  }
});
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle class="text-xl">
        Sign Up
      </CardTitle>
      <CardDescription>
        Enter your information to create an account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <form
          class="space-y-3"
          @submit.prevent="onSubmit"
        >
          <div class="grid gap-2">
            <FormField
              v-slot="{ componentField }"
              name="name"
            >
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
                <div
                  v-if="errors.name"
                  class="text-destructive-foreground text-sm"
                >
                  {{ errors.name[0] }}
                </div>
              </FormItem>
            </FormField>
          </div>
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
            <FormField
              v-slot="{ componentField }"
              name="password"
            >
              <FormItem>
                <FormLabel>Password</FormLabel>
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
          <div class="grid gap-2">
            <FormField
              v-slot="{ componentField }"
              name="password_confirmation"
            >
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder="********"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
                <div
                  v-if="errors.password_confirmation"
                  class="text-destructive-foreground text-sm"
                >
                  {{ errors.password_confirmation[0] }}
                </div>
              </FormItem>
            </FormField>
          </div>
          <Button
            type="submit"
            class="w-full cursor-pointer"
            :class="{ 'cursor-not-allowed opacity-20': isCreatingAccount }"
            :disabled="isCreatingAccount"
          >
            {{ isCreatingAccount ? 'Creating account...':'Create Account' }}
          </Button>
        </form>
      </div>
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <NuxtLink
          to="/auth/signin"
          class="underline"
        >
          Sign in
        </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>
