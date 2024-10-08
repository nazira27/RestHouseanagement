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
              <VDatePicker v-model="state.date" mode="date" @close="close" />
            </template>
          </UPopover>
        </UFormGroup>

        <UFormGroup label="Start time" name="start_time">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton class="md:w-[50%]" icon="i-heroicons-calendar-days-20-solid" :label="state.start_time ? format(state.start_time, 'hh:mm a') : 'Select time'" />
            <template #panel="{ close }">
              <VDatePicker v-model="state.start_time" mode="time" hide-time-header @change="close"/>
            </template>
          </UPopover>
        </UFormGroup>
        <UFormGroup label="End time" name="end_time">
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton class="md:w-[50%]" icon="i-heroicons-calendar-days-20-solid" :label="state.end_time ? format(state.end_time, 'hh:mm a') : 'Select time'" />

            <template #panel="{ close }">
              <VDatePicker v-model="state.end_time" mode="time" hide-time-header @change="close"/>
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
import { format } from 'date-fns'
import { DatePicker as VDatePicker } from 'v-calendar'
import type { DatePickerDate, DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker'
import 'v-calendar/dist/style.css'
import {useSpecialTimingStore} from "../../store/specialTimings";
import {computed} from "vue";
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
const store = useSpecialTimingStore()

const isOpen = ref(false)
const hours = computed(() => new Date().getHours().toString().padStart(2, '0'));
const minutes = computed(() => new Date().getMinutes().toString().padStart(2, '0'));
const timeString = computed(() => {
  const ampm = hours.value >= 12 ? 'PM' : 'AM';
  const hour12 = hours.value % 12 || 12;
  const minutesPadded = minutes.value.toString().padStart(2, '0');
  return `${hour12}:${minutesPadded}${ampm}`;
});
const now = computed(() => new Date())
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
  if(!state.date || !state.start_time || !state.end_time) {
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
  console.log(data)
  if(props.item.id) {
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
  state.start_time = new Date( props.item.start_time)
  state.end_time = new Date(props.item.end_time)
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
          start_time: new Date(),
          end_time: new Date(),
        }
        state.house_id = props.houseId
      }
    }
)

</script>
