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
        label="Add"
        color="gray"
        @click="isOpen=true"
    />
  </div>
  <UCard v-for="(item, index) in timings" :key="index" class="my-4">
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
      <h4 class="font-semibold">{{item.date}}</h4>
    </div>
    <div class="flex justify-between mt-4">
      <UIcon name="heroicons:clock-16-solid" class="w-5 h-5 text-primary" />
      <div>
        <p>{{format(new Date(item.start_time), 'hh:mm a')}} - {{format(new Date(item.end_time), 'hh:mm a')}} </p>
      </div>
    </div>
  </UCard>
  <AddSpecialTimings
    :modelValue="isOpen"
    :item="activeItem"
    :isEdit="isEdit"
    :houseId="props?.item?.id"
    @update:modelValue="closeEditModal"
  />
</template>
<script setup lang="ts">
import AddSpecialTimings from './AddSpecialTiming.vue'
import {useSpecialTimingStore} from "../../store/specialTimings";
import { format } from 'date-fns'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    default: {}
  }
});

const emit = defineEmits(['back']);

const store = useSpecialTimingStore()

const isOpen = ref(false)
const activeItem = ref({})
const isEdit = ref(false)

const timings = computed(() => store.data.filter((item:any) => item.house_id === props.item.id))

const closeEditModal = () => {
  isOpen.value = false
  isEdit.value = false
  activeItem.value = {}
}

const openEditModal = (item:any) => {
  activeItem.value = item
  isEdit.value = true
  isOpen.value = true
}

const back = () => {
  emit('back', true)
}

const deleteItem = (item:any) => {
  store.deleteItem(item)
}
</script>
