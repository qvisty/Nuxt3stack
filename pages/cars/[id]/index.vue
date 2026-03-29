<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const carId = route.params.id as string

const { data: car, pending: carPending, refresh: refreshCar } = await useFetch(`/api/cars/${carId}`)
const { data: services, pending: servicesPending, refresh: refreshServices } = await useFetch(`/api/cars/${carId}/services`)

const router = useRouter()
const deleteConfirm = ref(false)
const deleting = ref(false)

type ServiceRecord = {
  id: string
  date: string
  mileage: number | null
  type: string
  description: string | null
  cost: number | null
  provider: string | null
}

const serviceTypeLabels: Record<string, string> = {
  service: 'Service',
  syn: 'Syn',
  olieskift: 'Olieskift',
  daek: 'Dæk',
  reparation: 'Reparation',
  andet: 'Andet',
}

const serviceTypeColors: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'neutral'> = {
  service: 'primary',
  syn: 'success',
  olieskift: 'warning',
  daek: 'neutral',
  reparation: 'error',
  andet: 'neutral',
}

function formatPrice(value: number | null | undefined) {
  if (!value) return '—'
  return new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 }).format(value)
}

function formatMileage(km: number | null | undefined) {
  if (km == null) return '—'
  return new Intl.NumberFormat('da-DK').format(km) + ' km'
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('da-DK', { dateStyle: 'long' }).format(new Date(date))
}

async function deleteCar() {
  deleting.value = true
  try {
    await $fetch(`/api/cars/${carId}`, { method: 'DELETE' })
    router.push('/dashboard')
  } catch {
    deleting.value = false
  }
}

async function deleteService(serviceId: string) {
  try {
    await $fetch(`/api/cars/${carId}/services/${serviceId}`, { method: 'DELETE' })
    await refreshServices()
    await refreshCar()
  } catch (e) {
    console.error(e)
  }
}

const totalServiceCost = computed(() => {
  if (!services.value) return 0
  return (services.value as ServiceRecord[]).reduce((sum, s) => sum + (s.cost ?? 0), 0)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UButton
            to="/dashboard"
            icon="i-heroicons-arrow-left"
            color="neutral"
            variant="ghost"
            size="sm"
          />
          <span class="font-semibold text-gray-900 dark:text-white truncate">
            {{ car?.name ?? 'Bil' }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            :to="`/cars/${carId}/edit`"
            icon="i-heroicons-pencil-square"
            color="neutral"
            variant="ghost"
            size="sm"
            label="Rediger"
          />
          <UButton
            icon="i-heroicons-trash"
            color="error"
            variant="ghost"
            size="sm"
            @click="deleteConfirm = true"
          />
        </div>
      </div>
    </header>

    <main v-if="car" class="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <!-- Bil info -->
      <UCard>
        <div class="p-1">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ car.name }}</h1>
              <p class="text-gray-500 dark:text-gray-400">
                {{ [(car as { make?: string | null }).make, (car as { model?: string | null }).model, (car as { year?: number | null }).year].filter(Boolean).join(' ') || 'Ingen yderligere detaljer' }}
              </p>
            </div>
            <UBadge
              color="neutral"
              variant="outline"
              :label="(car as { licensePlate: string }).licensePlate"
              class="font-mono text-base px-3 py-1"
            />
          </div>

          <!-- Info grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Km-stand</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ formatMileage((car as { mileage?: number | null }).mileage) }}</p>
            </div>
            <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Farve</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ (car as { color?: string | null }).color || '—' }}</p>
            </div>
            <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Købspris</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ formatPrice((car as { purchasePrice?: number | null }).purchasePrice) }}</p>
            </div>
            <div class="p-3 rounded-lg" :class="(car as { loanRemaining?: number | null }).loanRemaining ? 'bg-orange-50 dark:bg-orange-950' : 'bg-gray-50 dark:bg-gray-800'">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Restgæld</p>
              <p class="font-semibold" :class="(car as { loanRemaining?: number | null }).loanRemaining ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'">
                {{ (car as { loanRemaining?: number | null }).loanRemaining ? formatPrice((car as { loanRemaining?: number | null }).loanRemaining) : '—' }}
              </p>
            </div>
          </div>

          <div v-if="(car as { notes?: string | null }).notes" class="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Noter</p>
            <p class="text-sm text-gray-700 dark:text-gray-300">{{ (car as { notes?: string | null }).notes }}</p>
          </div>
        </div>
      </UCard>

      <!-- Service historik -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Servicehistorik</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ services?.length ?? 0 }} poster · Samlet: {{ formatPrice(totalServiceCost) }}
            </p>
          </div>
          <UButton
            :to="`/cars/${carId}/service/new`"
            icon="i-heroicons-plus"
            size="sm"
            label="Tilføj"
          />
        </div>

        <!-- Loading -->
        <div v-if="servicesPending" class="space-y-3">
          <USkeleton v-for="i in 3" :key="i" class="h-20 rounded-xl" />
        </div>

        <!-- Tom tilstand -->
        <UCard v-else-if="!services?.length">
          <div class="p-6 text-center">
            <UIcon name="i-heroicons-clipboard-document-list" class="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400">Ingen serviceposter endnu</p>
            <UButton
              :to="`/cars/${carId}/service/new`"
              variant="link"
              label="Tilføj den første post"
              class="mt-2"
            />
          </div>
        </UCard>

        <!-- Service liste -->
        <div v-else class="space-y-3">
          <UCard
            v-for="service in (services as ServiceRecord[])"
            :key="service.id"
          >
            <div class="p-1 flex items-start justify-between gap-4">
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <UBadge
                  :color="serviceTypeColors[service.type] ?? 'neutral'"
                  variant="soft"
                  :label="serviceTypeLabels[service.type] ?? service.type"
                  class="mt-0.5 shrink-0"
                />
                <div class="min-w-0">
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatDate(service.date) }}
                    </span>
                    <span v-if="service.mileage" class="text-xs text-gray-400">
                      {{ formatMileage(service.mileage) }}
                    </span>
                  </div>
                  <p v-if="service.description" class="text-sm text-gray-600 dark:text-gray-300 mt-0.5 truncate">
                    {{ service.description }}
                  </p>
                  <p v-if="service.provider" class="text-xs text-gray-400 mt-0.5">
                    {{ service.provider }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatPrice(service.cost) }}
                </span>
                <UButton
                  icon="i-heroicons-trash"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  @click="deleteService(service.id)"
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </main>

    <!-- Slet bekræftelse modal -->
    <UModal v-model:open="deleteConfirm">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Slet bil?</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">
            Er du sikker på at du vil slette <strong>{{ car?.name }}</strong>? Al servicehistorik vil også blive slettet. Denne handling kan ikke fortrydes.
          </p>
          <div class="flex gap-3">
            <UButton
              color="error"
              :loading="deleting"
              label="Ja, slet bil"
              @click="deleteCar"
            />
            <UButton
              color="neutral"
              variant="ghost"
              label="Annuller"
              :disabled="deleting"
              @click="deleteConfirm = false"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
