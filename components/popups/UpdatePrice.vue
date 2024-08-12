<template>
  <UModal v-model="isOpen" @close="handleClose">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Edit Price
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="handleClose" />
        </div>
      </template>
      <div class="mt-4" v-if="!type">
        <UButton label="Change Standard" color="gray" class="h-10 block w-full flex items-center justify-between" @click="type = 'standard'">
          <template #trailing>
            <UIcon name="heroicons:arrow-long-right-16-solid" class="w-5 h-5" />
          </template>
        </UButton>
        <UButton label="Change Special" color="gray" class="h-10 mt-4 block w-full flex items-center justify-between" @click="type = 'special'">
          <template #trailing>
            <UIcon name="heroicons:arrow-long-right-16-solid" class="w-5 h-5" />
          </template>
        </UButton>
      </div>
      <SpecialPrices v-if="type === 'special'" :item="props.item" @back="type = ''"/>
      <StandardPrices v-if="type === 'standard'" :item="props.item" @back="type = ''"/>

    </UCard>
  </UModal>
</template>
<script setup lang="ts">
import SpecialPrices from './SpecialPrices.vue'
import StandardPrices from './StandardPrices.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    default: {}
  }
});

const emit = defineEmits(['update:isOpen']);

const isOpen = ref(false)
const type = ref('')


const handleClose = () => {
  isOpen.value = false
  emit('update:modelValue', false);
};

watch(
    () => props.modelValue,
    (newVal:any) => {
      isOpen.value = newVal ? newVal : false
      type.value = ''
    }
)
</script>
