<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)

const form = reactive({
  name: '',
  licensePlate: '',
  make: '',
  model: '',
  year: '',
  color: '',
  mileage: '',
  purchasePrice: '',
  loanRemaining: '',
  notes: '',
})

async function submit() {
  if (!form.name.trim() || !form.licensePlate.trim()) {
    error.value = 'Bilnavn og nummerplade er påkrævet'
    return
  }

  loading.value = true
  error.value = null

  try {
    const car = await $fetch('/api/cars', {
      method: 'POST',
      body: form,
    })
    router.push(`/cars/${(car as { id: string }).id}`)
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Noget gik galt'
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
        <UButton
          to="/dashboard"
          icon="i-heroicons-arrow-left"
          color="neutral"
          variant="ghost"
          size="sm"
        />
        <h1 class="font-semibold text-gray-900 dark:text-white">Tilføj ny bil</h1>
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

          <!-- Obligatoriske felter -->
          <div>
            <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Grundoplysninger
            </h2>
            <div class="space-y-4">
              <UFormField label="Navn på bil *" name="name">
                <UInput
                  v-model="form.name"
                  placeholder="F.eks. Min Tesla"
                  :disabled="loading"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Nummerplade *" name="licensePlate">
                <UInput
                  v-model="form.licensePlate"
                  placeholder="F.eks. AB12345"
                  :disabled="loading"
                  class="w-full font-mono"
                />
              </UFormField>
            </div>
          </div>

          <!-- Biloplysninger -->
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

          <!-- Økonomi -->
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

          <!-- Noter -->
          <UFormField label="Noter" name="notes">
            <UTextarea
              v-model="form.notes"
              placeholder="Yderligere oplysninger om bilen..."
              :disabled="loading"
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <!-- Knapper -->
          <div class="flex items-center gap-3 pt-2">
            <UButton
              type="submit"
              :loading="loading"
              label="Tilføj bil"
              icon="i-heroicons-plus"
            />
            <UButton
              to="/dashboard"
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
