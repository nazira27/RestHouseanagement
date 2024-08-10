<template>
  <UCard class="mt-6 relative">
    <div class="flex gap-8">
      <div>
        <UButton
            icon="heroicons:clock"
            size="sm"
            color="primary"
            square
            variant="solid"
            class="flex mb-3"
            @click="openModal('timing')"
        />
        <UButton
            icon="heroicons:currency-dollar"
            size="sm"
            color="primary"
            square
            variant="solid"
            @click="openModal('price')"
        />
      </div>
      <div>
        <h2 class="text-lg font-semibold">{{item.name}}</h2>
        <ul class="mt-3">
          <li class="flex items-center gap-2 text-gray-500 mt-2">
            <UIcon name="heroicons:phone-solid" class="w-5 h-5 text-red" />
            {{item.phone}}
          </li>
          <li class="flex items-center gap-2 text-gray-500 mt-2">
            <span>{{item.num_room}} {{ item.num_room > 1 ? 'Rooms' : 'Room' }}</span>
            <span>{{item.num_bath}} {{ item.num_bath > 1 ? 'Bathrooms' : 'Bathroom' }}</span>
          </li>
        </ul>
      </div>
    </div>
    <UAlert :title="item.terms" class="mt-4" variant="subtle" color="yellow"/>
    <div class="absolute right-3 top-5">
      <UPopover>
        <UButton
            :padded="false"
            variant="link"
            icon="heroicons:ellipsis-vertical-20-solid"
            color="gray"
        />

        <template #panel>
          <div class="p-2">
            <UButton variant="text" @click="openModal('property')">Edit Property</UButton>
          </div>
        </template>
      </UPopover>
    </div>
  </UCard>

  <AddProperties
      :modelValue="isPropertyModalOpen"
      :item="props.item"
      :isEdit="true"
      @update:modelValue="isPropertyModalOpen=false"
  />

  <SelectType
      :modelValue="isSelectModalOpen"
      :item="props.item"
      @update:modelValue="isSelectModalOpen=false"
  />

  <Prices
      :modelValue="isSpecialPriceModalOpen"
      :item="props.item"
      @update:modelValue="isSpecialPriceModalOpen=false"
  />
</template>
<script setup lang="ts">
import AddProperties from './popups/AddProperties.vue'
import SelectType from './popups/SelectType.vue'
import Prices from './popups/Prices.vue'

const props = defineProps({
  item: {
    type: Object
  }
})

const isPropertyModalOpen = ref(false);
const isSelectModalOpen = ref(false);
const isSpecialPriceModalOpen = ref(false);

const openModal = (val:any) => {
  switch (val) {
    case 'property': {
      isPropertyModalOpen.value = true
      break
    }
    case 'price': {
      isSpecialPriceModalOpen.value = true
      break
    }
    case 'timing': {
      isSelectModalOpen.value = true
      break
    }
    default: return
  }
}

</script>
