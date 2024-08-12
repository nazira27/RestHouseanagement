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
        @click="openEditModal"
    />
  </div>
  <UCard v-for="(item, index) in prices" :key="index" class="my-4">
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
       <div>${{item.special_price}}</div>
       <UBadge :label="item.price_type" variant="solid" class="float-right bg-primary-600"/>
     </div>
  </UCard>
  <AddSpecialPrice
      :modelValue="isEditModalOpen"
      :item="activeItem"
      :isEdit="isEdit"
      :houseId="props?.item?.id"
      @update:modelValue="closeEditModal"
  />
</template>
<script setup lang="ts">
import AddSpecialPrice from './AddSpecialPrice.vue'
import {useSpecialPriceStore} from "../../store/specialPrices";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    default: {}
  }
});

const emit = defineEmits(['update:isOpen', 'back']);
const store = useSpecialPriceStore()

const isEditModalOpen = ref(false)
const isEdit = ref(false)
const activeItem = ref({})

const prices = computed(() => store.data.filter((item:any) => item.house_id === props.item.id))

const closeEditModal = () => {
  isEditModalOpen.value = false
  isEdit.value = false
  activeItem.value = {}
}

const openEditModal = (item:any) => {
  activeItem.value = item
  isEdit.value = true
  isEditModalOpen.value = true
}

const back = () => {
  emit('back', true)
}

const deleteItem = (item:any) => {
  console.log(item)
}

</script>
