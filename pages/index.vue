<template>
  <UContainer>
    <div class="mt-10 flex justify-between">
      <h1>Welcome to Rest Houses Management System</h1>
      <USelect v-model="themeColor" :options="['light', 'dark']" class="w-[106px] h-[32px]" />
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
</template>

<script setup lang="ts">
import AddProperties from '../components/popups/AddProperties.vue'

import {useRestHousesStore} from "../store/restHouses";

const store = useRestHousesStore()

const restHouses = computed(() => store.data)

const isPropertyModalOpen = ref(false);

const colorMode = useColorMode()
const themeColor = computed({
  get () {
    return colorMode.value
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const openModal = () => {
  isPropertyModalOpen.value = true
}

const updateModelValue = (val:any) => {
  isPropertyModalOpen.value = val
}

</script>
