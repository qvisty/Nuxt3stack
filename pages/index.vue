<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const oauthError = computed(() => route.query.error === 'oauth')
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo / ikon -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-500 mb-4 shadow-lg">
          <UIcon name="i-heroicons-wrench-screwdriver" class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-white">Bilvedligeholdelse</h1>
        <p class="text-gray-400 mt-2">Hold styr på dine biler, service og økonomi</p>
      </div>

      <!-- Login kort -->
      <UCard class="shadow-2xl">
        <div class="p-2">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Log ind</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Kun du har adgang til dine data
          </p>

          <UAlert
            v-if="oauthError"
            color="error"
            variant="soft"
            title="Login mislykkedes"
            description="Der opstod en fejl med Google login. Prøv igen."
            class="mb-4"
          />

          <a href="/auth/google" class="block w-full">
            <UButton
              block
              size="lg"
              color="neutral"
              variant="outline"
              class="gap-3"
            >
              <template #leading>
                <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </template>
              Fortsæt med Google
            </UButton>
          </a>

          <p class="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
            Dine data er private og kun tilgængelige for dig
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
