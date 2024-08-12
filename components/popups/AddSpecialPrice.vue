<template>
  <UModal v-model="isOpen" @close="handleClose">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{props.item?.id ? 'Edit Price' : 'Add Price'}}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="handleClose" />
        </div>
      </template>

      <UForm :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Date" name="date">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="i-heroicons-calendar-days-20-solid" :label="state?.date ? format(state.date, 'd MMM, yyy') : 'Select Date'" />

            <template #panel="{ close }">
              <VDatePicker v-model="state.date" mode="date" is-required @close="close" />
            </template>
          </UPopover>
        </UFormGroup>

        <UFormGroup label="Price" name="special_price">
          <UInput v-model="state.special_price" />
        </UFormGroup>

        <UFormGroup label="Select price type" name="price_type">
          <URadioGroup v-model="state.price_type" :options="['whole', 'partial']" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit">
            {{props.item?.id ? 'Update' : 'Create'}}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>

</template>

<script setup lang="ts">
// import type { FormError, FormSubmitEvent } from '#ui/types'
import { format } from 'date-fns'
import { DatePicker as VDatePicker } from 'v-calendar'
import type { DatePickerDate, DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker'
import 'v-calendar/dist/style.css'
import {useSpecialPriceStore} from "../../store/specialPrices";
const toast = useToast()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    default: {}
  },
  houseId: {},
  isEdit: {
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);
const store = useSpecialPriceStore()

const isOpen = ref(false)

let state = reactive({
  date: undefined,
  special_price: null,
  price_type: null,
  house_id: ''
})


const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.title) errors.push({ path: 'title', message: 'Required' })
  if (!state.special_price) errors.push({ path: 'special_price', message: 'Required' })
  if (!state.price_type) errors.push({ path: 'price_type', message: 'Required' })
  return errors
}

const handleClose = () => {
  isOpen.value = false
  emit('update:modelValue', false);
};

function formatDate(v:any) {
  const date = new Date(v)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

async function onSubmit (event: FormSubmitEvent<any>) {
  const data = {
    ...state,
    date: formatDate(state.date)
  }
  if(props.isEdit && props.item.id) {
    data['id'] = props.item.id
    store.updateSpecialPrice(data)
  } else {
    store.addSpecialPrice(data)
  }
  handleClose()
}

const initialValues = () => {
  state.id = props.item.id
  state.date = new Date(props.item.date)
  state.special_price = props.item.special_price
  state.price_type = props.item.price_type
  state.house_id = props.item.house_id
}

watch(
    () => props.modelValue,
    (newVal:any) => {
      isOpen.value = newVal ? newVal : false
      state.house_id = props.houseId
      if(newVal && props.item?.id) {
        initialValues()
      } else {
        state = {
          date: new Date(),
          special_price: null,
          price_type: null,
        }
        state.house_id = props.houseId
      }
    }
)

</script>
