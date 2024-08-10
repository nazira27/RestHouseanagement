<template>
  <UModal v-model="isOpen" @close="handleClose">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Prices
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="handleClose" />
        </div>
      </template>
      <UButton
          icon="heroicons:plus-circle-solid"
          size="sm"
          square
          variant="solid"
          class="flex my-3"
          label="Add new period"
          color="gray"
          @click="openEditModal"
      />
      <UCard v-for="(item, index) in periods" :key="index" class="my-4">
        <div class="flex justify-between ">
          <UPopover>
            <UIcon name="heroicons:ellipsis-horizontal-16-solid" class="w-5 h-5" />
            <template #panel>
              <div class="px-1">
                <UButton variant="text" @click="openEditModal(item)">Edit</UButton>
              </div>
              <div class="px-1">
                <UButton variant="text" @click="deleteItem(item)">Delete</UButton>
              </div>
            </template>
          </UPopover>

          <h4 class="font-semibold">{{item.title}}</h4>
        </div>
       <div class="flex justify-end mt-4">
         <ul>
           <li v-for="part in item.parts" class="flex items-center gap-3">
             <UIcon name="heroicons:clock-16-solid" class="w-5 h-5 text-primary" /> {{part.startTime}} - {{part.endTime}}
           </li>
         </ul>
       </div>
        <div class="mt-3">
          <p>
            Monday-Friday
            <UBadge :label="`$ ${prices?.[item.title]?.weekday}`" variant="solid" class="float-right bg-primary-600"/>
          </p>
          <p class="mt-3">
            Saturday-Sunday
            <UBadge :label="`$ ${prices?.[item.title]?.weekend}`" variant="solid"  class="float-right bg-primary-600"/>
          </p>
        </div>
      </UCard>
    </UCard>
    <AddPeriod
        :modelValue="isEditModalOpen"
        :item="activeItem"
        :isEdit="isEdit"
        @update:modelValue="closeEditModal"
    />
  </UModal>
</template>
<script setup lang="ts">
import AddPeriod from './AddPeriod.vue'

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
const isEditModalOpen = ref(false)
const isEdit = ref(false)
const periods = ref([])
const prices = ref([])
const activeItem = ref({})

const handleClose = () => {
  isOpen.value = false
  emit('update:modelValue', false);
};

const closeEditModal = () => {
  isEditModalOpen.value = false
  isEdit.value = false
  activeItem.value = {}
}

const openEditModal = (item:any) => {
  activeItem.value = {
    houseId: props.item?.id,
    title: item.title,
    timeSlots: [],
    weekday: prices.value?.[item.title]?.weekday,
    weekend: prices.value?.[item.title]?.weekend
  }
  item?.parts?.forEach((el:any) => {
    activeItem.value.timeSlots.push({
      startTime: el.startTime,
      endTime: el.endTime,
    })
  })
  isEdit.value = true
  isEditModalOpen.value = true
}

const deleteItem = (item:any) => {
  console.log(item)
}

watch(
    () => props.modelValue,
    (newVal:any) => {
      isOpen.value = newVal ? newVal : false
      console.log(props.item)
      if(props.item?.period) {
        periods.value = props.item.period
        prices.value = props.item.prices
      }
    }
)
</script>
