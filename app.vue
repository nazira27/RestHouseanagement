<template>
  <UContainer>
    <div class="mt-10 flex justify-between">
      <h1>Welcome to Rest Houses Management System</h1>
      <ColorScheme>
        <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
      </ColorScheme>
    </div>
    <UButton
        icon="heroicons:plus-circle-solid"
        size="sm"
        square
        variant="solid"
        class="flex my-3"
        label="Add rest house"
        color="gray"
        @click="openModal"
    />
    <div v-for="(item, index) in restHouses" :key="'property_' + index">
      <RestHouse :item="item"/>
    </div>
    <AddProperties
        :modelValue="isPropertyModalOpen"
        :isEdit="false"
        @update:modelValue="updateModelValue"
    />
  </UContainer>
  <UNotifications />
</template>

<script setup lang="ts">
import AddProperties from './components/popups/AddProperties.vue'

import {useRestHousesStore} from "./store/restHouses";

const store = useRestHousesStore()

const restHouses = computed(() => store.data)

const isPropertyModalOpen = ref(false);

const openModal = () => {
  isPropertyModalOpen.value = true
}

const updateModelValue = (val:any) => {
  isPropertyModalOpen.value = val
}

</script>
