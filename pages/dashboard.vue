<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, clear } = useUserSession()

const { data: cars, pending, refresh } = await useFetch('/api/cars')

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  navigateTo('/')
}

type Car = {
  id: string
  name: string
  licensePlate: string
  make: string | null
  model: string | null
  year: number | null
  color: string | null
  mileage: number | null
  purchasePrice: number | null
  loanRemaining: number | null
  notes: string | null
}

function formatPrice(value: number | null | undefined) {
  if (!value) return null
  return new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 }).format(value)
}

function formatMileage(km: number | null | undefined) {
  if (km == null) return '0 km'
  return new Intl.NumberFormat('da-DK').format(km) + ' km'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-wrench-screwdriver" class="w-6 h-6 text-primary-500" />
          <span class="font-semibold text-gray-900 dark:text-white">Bilvedligeholdelse</span>
        </div>
        <div class="flex items-center gap-3">
          <UAvatar
            :src="user?.avatar ?? undefined"
            :alt="user?.name ?? 'Bruger'"
            size="sm"
          />
          <span class="hidden sm:block text-sm text-gray-600 dark:text-gray-300">{{ user?.name }}</span>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-heroicons-arrow-right-on-rectangle"
            @click="logout"
          />
        </div>
      </div>
    </header>

    <!-- Indhold -->
    <main class="max-w-5xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mine biler</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ cars?.length ?? 0 }} {{ cars?.length === 1 ? 'bil' : 'biler' }} registreret
          </p>
        </div>
        <UButton
          to="/cars/new"
          icon="i-heroicons-plus"
          label="Tilføj bil"
        />
      </div>

      <!-- Loading -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <USkeleton v-for="i in 2" :key="i" class="h-48 rounded-xl" />
      </div>

      <!-- Tom tilstand -->
      <div
        v-else-if="!cars?.length"
        class="text-center py-16"
      >
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
          <UIcon name="i-heroicons-truck" class="w-8 h-8 text-gray-400" />
        </div>
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Ingen biler endnu</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Tilføj din første bil for at komme i gang</p>
        <UButton to="/cars/new" icon="i-heroicons-plus" label="Tilføj bil" />
      </div>

      <!-- Bil-kort -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink
          v-for="car in (cars as Car[])"
          :key="car.id"
          :to="`/cars/${car.id}`"
          class="block group"
        >
          <UCard class="h-full transition-all duration-150 group-hover:shadow-md group-hover:border-primary-300 dark:group-hover:border-primary-700">
            <div class="p-1">
              <!-- Kort header -->
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {{ car.name }}
                  </h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ [car.make, car.model, car.year].filter(Boolean).join(' ') || 'Ingen detaljer' }}
                  </p>
                </div>
                <UBadge color="neutral" variant="soft" :label="car.licensePlate" class="font-mono" />
              </div>

              <!-- Km-stand -->
              <div class="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-gray-400" />
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatMileage(car.mileage) }}
                </span>
              </div>

              <!-- Økonomi -->
              <div v-if="car.loanRemaining" class="flex items-center gap-2 text-sm">
                <UIcon name="i-heroicons-banknotes" class="w-4 h-4 text-orange-400" />
                <span class="text-gray-600 dark:text-gray-300">
                  Restgæld: <span class="font-medium text-orange-600 dark:text-orange-400">{{ formatPrice(car.loanRemaining) }}</span>
                </span>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
