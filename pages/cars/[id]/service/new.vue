<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const carId = route.params.id as string

const { data: car } = await useFetch(`/api/cars/${carId}`)

const loading = ref(false)
const error = ref<string | null>(null)

const serviceTypes = [
  { value: 'service', label: 'Service' },
  { value: 'syn', label: 'Syn' },
  { value: 'olieskift', label: 'Olieskift' },
  { value: 'daek', label: 'Dæk' },
  { value: 'reparation', label: 'Reparation' },
  { value: 'andet', label: 'Andet' },
]

const today = new Date().toISOString().split('T')[0]

const form = reactive({
  date: today,
  mileage: '',
  type: 'service',
  description: '',
  cost: '',
  provider: '',
})

async function submit() {
  if (!form.date) {
    error.value = 'Dato er påkrævet'
    return
  }
  if (!form.type) {
    error.value = 'Type er påkrævet'
    return
  }

  loading.value = true
  error.value = null

  try {
    await $fetch(`/api/cars/${carId}/services`, {
      method: 'POST',
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
        <div>
          <h1 class="font-semibold text-gray-900 dark:text-white">Tilføj servicepost</h1>
          <p class="text-xs text-gray-400">{{ (car as { name?: string } | null)?.name }}</p>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-4 py-8">
      <UCard>
        <form class="p-2 space-y-5" @submit.prevent="submit">
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :description="error"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Dato *" name="date">
              <UInput
                v-model="form.date"
                type="date"
                :disabled="loading"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Type *" name="type">
              <USelect
                v-model="form.type"
                :options="serviceTypes"
                option-attribute="label"
                value-attribute="value"
                :disabled="loading"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Km-stand ved service" name="mileage">
              <UInput
                v-model="form.mileage"
                type="number"
                placeholder="F.eks. 47500"
                :disabled="loading"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Pris (DKK)" name="cost">
              <UInput
                v-model="form.cost"
                type="number"
                placeholder="F.eks. 2500"
                :disabled="loading"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField label="Værksted / Leverandør" name="provider">
            <UInput
              v-model="form.provider"
              placeholder="F.eks. Toyota Service Vejle"
              :disabled="loading"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Beskrivelse" name="description">
            <UTextarea
              v-model="form.description"
              placeholder="F.eks. Udskiftning af bremsebelægninger og oliefilter..."
              :disabled="loading"
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <div class="flex items-center gap-3 pt-2">
            <UButton
              type="submit"
              :loading="loading"
              label="Gem servicepost"
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
