<template>
  <div class="flex justify-between">
    <UButton label="Back" color="gray" @click="back">
      <template #trailing>
        <UIcon name="heroicons:arrow-long-left-16-solid" class="w-5 h-5" />
      </template>
    </UButton>
   <UButton
        icon="heroicons:plus-circle-solid"
        size="sm"
        square
        variant="solid"
        label="Add new period"
        color="gray"
        @click="openEditModal"
    />
  </div>
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
         <UIcon name="heroicons:clock-16-solid" class="w-5 h-5 text-primary" /> {{}}
         {{
           isDate(part.startTime)
         ? format(new Date(part.startTime), 'hh:mm a') + ' - '+ format(new Date(part.startTime), 'hh:mm a')
           : part.startTime + ' - ' + part.endTime
         }}
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
  <AddPeriod
      :modelValue="isEditModalOpen"
      :item="activeItem"
      :isEdit="isEdit"
      @update:modelValue="closeEditModal"
  />
</template>
<script setup lang="ts">
import AddPeriod from './AddPeriod.vue'
import {onMounted} from "@vue/runtime-core";
import {useRestHousesStore} from "../../store/restHouses";
import { parse, format } from 'date-fns';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    default: {}
  }
});

const emit = defineEmits(['update:modelValue', 'back']);

const isOpen = ref(false)
const isEditModalOpen = ref(false)
const isEdit = ref(false)
const periods = ref([])
const prices = ref([])
const activeItem = ref({})
const store = useRestHousesStore()

const back = () => {
  emit('back', true)
}

const handleClose = () => {
  isOpen.value = false
  emit('update:modelValue', false);
};

const closeEditModal = () => {
  isEditModalOpen.value = false
  isEdit.value = false
  activeItem.value = {}
}

const parseTime = (timeString:string, dateFormat = 'hh:mm a') => parse(timeString, dateFormat, new Date());
const isDate = (value:any) => value instanceof Date;

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
      startTime: parseTime(el.startTime),
      endTime: parseTime(el.endTime),
    })
  })
  isEdit.value = true
  isEditModalOpen.value = true
}

const deleteItem = (el:any) => {
  store.deletePeriod(props.item.id, el.title)
}

onMounted(() => {
  periods.value = props.item.period
  prices.value = props.item.prices
})
</script>
