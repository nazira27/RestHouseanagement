<template>
  <UModal v-model="isOpen" @close="handleClose">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{props.item?.id ? 'Edit Period' : 'Add Period'}}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="handleClose" />
        </div>
      </template>

      <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Title (hours)" name="title">
          <URange size="md" v-model="state.title" :max="24"/>
          <label v-if="state.title" class="text-xs">{{state.title}} hours</label>
        </UFormGroup>

        <div class="flex justify-between">
          <label class="text-sm block font-medium text-gray-700 dark:text-gray-200">Start time - End time</label>
          <UButton @click="addTimeSlot">
            +
          </UButton>
        </div>
        <div v-for="(slot, index) in state.timeSlots" :key="index" class="flex w-full gap-1 mt-1">
          <div class="w-[46%]">
            <UFormGroup name="startTime">
              <UInput v-model="slot.startTime" />
            </UFormGroup>
          </div>

          <div class="w-[46%]">
            <UFormGroup name="endTime">
              <UInput v-model="slot.endTime" />
            </UFormGroup>
          </div>

          <div class="w-[6%]">
            <UButton :disabled="index<=0" color='yellow' @click="removeTimeSlot(index)">
              -
            </UButton>
          </div>

        </div>
        <UFormGroup label="Price for Weekday" name="weekday">
          <UInput v-model="state.weekday" />
        </UFormGroup>
        <UFormGroup label="Price for Weekend" name="weekend">
          <UInput v-model="state.weekend" />
        </UFormGroup>

        <div class="text-right">
          <UButton type="submit">
            Submit
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>

</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import {useRestHousesStore} from "../../store/restHouses";
import { format } from 'date-fns'
import { DatePicker as VDatePicker } from 'v-calendar'
import type { DatePickerDate, DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker'
import 'v-calendar/dist/style.css'
import {computed} from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    default: {}
  },
  isEdit: {
    default: false
  }
});

const emit = defineEmits(['update:isOpen']);
const store = useRestHousesStore()

const isOpen = ref(false)

let state = reactive({
  title: 0,
  timeSlots: [{ startTime: new Date(), endTime: new Date() }],
  weekend: null,
  weekday: null
})

const hours = computed(() => new Date().getHours().toString().padStart(2, '0'));
const minutes = computed(() => new Date().getMinutes().toString().padStart(2, '0'));
const timeString = computed(() => {
  const ampm = hours.value >= 12 ? 'PM' : 'AM';
  const hour12 = hours.value % 12 || 12;
  const minutesPadded = minutes.value.toString().padStart(2, '0');
  return `${hour12}:${minutesPadded}${ampm}`;
});

const validate = (state: any): FormError[] => {
  const errors = []
  if (state.timeSlots.some((slot:any) => !slot.startTime)) errors.push({ path: 'startTime', message: 'Required' })
  if (state.timeSlots.some((slot:any) => !slot.endTime)) errors.push({ path: 'endTime', message: 'Required' })
  if (!state.title) errors.push({ path: 'title', message: 'Required' })
  if (!state.weekend) errors.push({ path: 'weekend', message: 'Required' })
  if (!state.weekday) errors.push({ path: 'weekday', message: 'Required' })
  return errors
}

const handleClose = () => {
  isOpen.value = false
  emit('update:modelValue', false);
};

async function onSubmit (event: FormSubmitEvent<any>) {
  const data = {
    period: {
      "parts": state.timeSlots,
      "title": state.title + ' hours'
    },
    prices: {
      title: state.title + ' hours',
      weekday: state.weekday,
      weekend: state.weekend
    }
  }
  store.addPeriod(props.item.houseId, data)

  if(props.isEdit) {
    store.editPeriod(props.item.houseId, data)
  } else {
    store.addPeriod(props.item.houseId, data)
  }
  isOpen.value = false
  handleClose()
}

const initialValues = () => {
  state.weekday = props.item?.weekday
  state.weekend = props.item?.weekend
  state.timeSlots = props.item.timeSlots || [{ startTime: timeString.value, endTime: timeString.value }]
  state.title = props.item?.title?.split(' ')?.[0]
}

const addTimeSlot = () => {
  state.timeSlots.push({ startTime: timeString.value, endTime: timeString.value })
}

const removeTimeSlot = (index: number) => {
  state.timeSlots.splice(index, 1)
}

watch(
    () => props.modelValue,
    (newVal:any) => {
      isOpen.value = newVal ? newVal : false
      if(newVal && props.isEdit) {
        initialValues()
      }
      else {
        state = reactive({
          title: null,
          timeSlots: [{ startTime: timeString.value, endTime: timeString.value }],
          weekend: null,
          weekday: null
        })
      }
    }
)

</script>
