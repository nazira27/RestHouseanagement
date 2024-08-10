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
    <div class="flex justify-between">
      <div>
        <UIcon v-if="new Date(item.end_time) >= new Date()" name="heroicons:ellipsis-horizontal-16-solid" class="w-5 h-5" />
      </div>
      <h4 class="font-semibold">{{item.date}}</h4>
    </div>
    <div class="flex justify-between mt-4">
      <UIcon name="heroicons:clock-16-solid" class="w-5 h-5 text-primary" />
      <div>
        <p>{{new Date(item.start_time).toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')}}</p>
        <p>{{new Date(item.end_time).toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')}}</p>
      </div>
    </div>
  </UCard>
  <AddSpecialTimings
    :modelValue="isOpen"
    :item="activeItem"
    v-model="isOpen"
    :houseId="props?.item?.id"
    @update:modelValue="isOpen=false"
  />
</template>
<script setup lang="ts">
import AddSpecialTimings from './AddSpecialTiming.vue'
import {useSpecialTimingStore} from "../../store/specialTimings";

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

const timings = computed(() => store.data.filter((item:any) => item.house_id === props.item.id))

const back = () => {
  emit('back', true)
}
</script>
