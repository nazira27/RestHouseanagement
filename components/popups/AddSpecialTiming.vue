<template>
  <UModal v-model="isOpen" @close="handleClose">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{props.item?.id ? 'Edit Time' : 'Add Time'}}
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


        <UFormGroup label="Start time" name="start_time">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton class="md:w-[50%]" icon="i-heroicons-calendar-days-20-solid" :label="state.start_time ? format(state.start_time, 'd MMM, yyy hh:mm') : 'Select time'" />
            <template #panel="{ close }">
              <VDatePicker v-model="state.start_time" mode="datetime" hide-time-header />
            </template>
          </UPopover>
        </UFormGroup>
        <UFormGroup label="End time" name="end_time">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton class="md:w-[50%]" icon="i-heroicons-calendar-days-20-solid" :label="state.end_time ? format(state.end_time, 'd MMM, yyy hh:mm') : 'Select time'" />

            <template #panel="{ close }">
              <VDatePicker v-model="state.end_time" mode="datetime" hide-time-header />
            </template>
          </UPopover>
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
import {useSpecialTimingStore} from "../../store/specialTimings";
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
});

const emit = defineEmits(['update:modelValue']);
const store = useSpecialTimingStore()

const isOpen = ref(false)

let state = reactive({
  date: undefined,
  start_time: new Date(),
  end_time: new Date(),
  house_id: ''
})


const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.title) errors.push({ path: 'title', message: 'Required' })
  if (!state.start_time) errors.push({ path: 'start_time', message: 'Required' })
  if (!state.end_time) errors.push({ path: 'end_time', message: 'Required' })
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
  if(!state.date || state.start_time || state.end_time) {
    toast.add({
      id: 'warning',
      title: 'Warning',
      description: 'Fill all input',
    })
    return
  }
  const data = {
    ...state,
    date: formatDate(state.date)
  }
  if(props.isEdit) {
    data['id'] = props.item.id
    store.updateSpecialPrice(data)
  } else {
    store.addSpecialPrice(data)
  }
  handleClose()
}

const initialValues = () => {
  state.id = props.item.id
  state.date = props.item.date
  state.start_time = props.item.start_time
  state.end_time = props.item.end_time
  state.house_id = props.item.house_id
}

watch(
    () => props.modelValue,
    (newVal:any) => {
      isOpen.value = newVal ? newVal : false
      state.house_id = props.houseId
      if(newVal && props.item?.id) {
        initialValues()
      }
    }
)

</script>
