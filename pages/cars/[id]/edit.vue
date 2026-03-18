<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const carId = route.params.id as string

const { data: car } = await useFetch(`/api/cars/${carId}`)

type Car = {
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

const form = reactive({
  name: (car.value as Car | null)?.name ?? '',
  licensePlate: (car.value as Car | null)?.licensePlate ?? '',
  make: (car.value as Car | null)?.make ?? '',
  model: (car.value as Car | null)?.model ?? '',
  year: String((car.value as Car | null)?.year ?? ''),
  color: (car.value as Car | null)?.color ?? '',
  mileage: String((car.value as Car | null)?.mileage ?? ''),
  purchasePrice: String((car.value as Car | null)?.purchasePrice ?? ''),
  loanRemaining: String((car.value as Car | null)?.loanRemaining ?? ''),
  notes: (car.value as Car | null)?.notes ?? '',
})

const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  if (!form.name.trim() || !form.licensePlate.trim()) {
    error.value = 'Bilnavn og nummerplade er påkrævet'
    return
  }

  loading.value = true
  error.value = null

  try {
    await $fetch(`/api/cars/${carId}`, {
      method: 'PUT',
      body: form,
    })
    router.push(`/cars/${carId}`)
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Noget gik galt'
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
        <UButton
          :to="`/cars/${carId}`"
          icon="i-heroicons-arrow-left"
          color="neutral"
          variant="ghost"
          size="sm"
        />
        <h1 class="font-semibold text-gray-900 dark:text-white">Rediger bil</h1>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-4 py-8">
      <UCard>
        <form class="p-2 space-y-6" @submit.prevent="submit">
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :description="error"
          />

          <div>
            <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Grundoplysninger
            </h2>
            <div class="space-y-4">
              <UFormField label="Navn på bil *" name="name">
                <UInput v-model="form.name" placeholder="F.eks. Min Tesla" :disabled="loading" class="w-full" />
              </UFormField>

              <UFormField label="Nummerplade *" name="licensePlate">
                <UInput v-model="form.licensePlate" placeholder="F.eks. AB12345" :disabled="loading" class="w-full font-mono" />
              </UFormField>
            </div>
          </div>

          <div>
            <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Biloplysninger
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Mærke" name="make">
                <UInput v-model="form.make" placeholder="F.eks. Toyota" :disabled="loading" class="w-full" />
              </UFormField>

              <UFormField label="Model" name="model">
                <UInput v-model="form.model" placeholder="F.eks. Yaris" :disabled="loading" class="w-full" />
              </UFormField>

              <UFormField label="Årgang" name="year">
                <UInput v-model="form.year" type="number" placeholder="F.eks. 2020" :disabled="loading" class="w-full" />
              </UFormField>

              <UFormField label="Farve" name="color">
                <UInput v-model="form.color" placeholder="F.eks. Sølv" :disabled="loading" class="w-full" />
              </UFormField>

              <UFormField label="Nuværende km-stand" name="mileage">
                <UInput v-model="form.mileage" type="number" placeholder="F.eks. 45000" :disabled="loading" class="w-full" />
              </UFormField>
            </div>
          </div>

          <div>
            <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Økonomi
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Købspris (DKK)" name="purchasePrice">
                <UInput v-model="form.purchasePrice" type="number" placeholder="F.eks. 150000" :disabled="loading" class="w-full" />
              </UFormField>

              <UFormField label="Restgæld (DKK)" name="loanRemaining">
                <UInput v-model="form.loanRemaining" type="number" placeholder="F.eks. 50000" :disabled="loading" class="w-full" />
              </UFormField>
            </div>
          </div>

          <UFormField label="Noter" name="notes">
            <UTextarea
              v-model="form.notes"
              placeholder="Yderligere oplysninger om bilen..."
              :disabled="loading"
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <div class="flex items-center gap-3 pt-2">
            <UButton
              type="submit"
              :loading="loading"
              label="Gem ændringer"
              icon="i-heroicons-check"
            />
            <UButton
              :to="`/cars/${carId}`"
              color="neutral"
              variant="ghost"
              label="Annuller"
              :disabled="loading"
            />
          </div>
        </form>
      </UCard>
    </main>
  </div>
</template>
