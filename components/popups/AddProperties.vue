<template>
  <UModal v-model="isOpen" @close="handleClose">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Edit Properties
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="handleClose" />
        </div>

      </template>

      <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>

        <UFormGroup label="Description" name="description">
          <UTextarea v-model="state.description" />
        </UFormGroup>


        <UFormGroup label="Location" name="location">
          <UTextarea v-model="state.location" />
        </UFormGroup>

        <UFormGroup label="Number of rooms" name="num_room">
          <UInput v-model="state.num_room" type="number"/>
        </UFormGroup>

        <UFormGroup label="Number of bathrooms" name="num_bath">
          <UInput v-model="state.num_bath" type="number"/>
        </UFormGroup>

        <UFormGroup label="Capacity" name="capacity">
          <UInput v-model="state.capacity" type="number"/>
        </UFormGroup>

        <UFormGroup label="Contact Information (Phone)" name="phone">
          <UInput v-model="state.phone" />
        </UFormGroup>


        <UFormGroup label="Terms and Conditions" name="terms">
          <UTextarea v-model="state.terms" />
        </UFormGroup>

        <div class="text-right">
          <UButton type="submit">
            {{props.isEdit ? 'Update' : 'Create'}}
          </UButton>
        </div>
      </UForm>

    </UCard>
  </UModal>

</template>

<script setup lang="ts">
import {useRestHousesStore} from "../../store/restHouses";

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
  name: undefined,
  num_room: undefined,
  num_bath: undefined,
  description: undefined,
  location: undefined,
  capacity: undefined,
  terms: undefined,
  phone: undefined,
})


const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Required' })
  if (!state.num_room) errors.push({ path: 'num_room', message: 'Required' })
  if (!state.num_bath) errors.push({ path: 'num_bath', message: 'Required' })
  if (!state.description) errors.push({ path: 'description', message: 'Required' })
  if (!state.capacity) errors.push({ path: 'capacity', message: 'Required' })
  if (!state.terms) errors.push({ path: 'terms', message: 'Required' })
  if (!state.phone) errors.push({ path: 'phone', message: 'Required' })
  if (!state.location) errors.push({ path: 'location', message: 'Required' })
  return errors
}

const handleClose = () => {
  isOpen.value = false
  emit('update:modelValue', false);
};

async function onSubmit (event: FormSubmitEvent<any>) {
  if(props.isEdit) {
    const data = {
      id: props.item.id,
      ...state
    }
    store.updateRestHouse(data)
  } else {
    store.addRestHouse(state)
  }

  isOpen.value = false
  handleClose()
}

const initialValues = () => {
  state.name = props.item.name
  state.num_room = props.item.num_room
  state.num_bath = props.item.num_bath
  state.description = props.item.description
  state.location = props.item.location
  state.capacity = props.item.capacity
  state.terms = props.item.terms
  state.phone = props.item.phone
}

watch(
    () => props.modelValue,
    (newVal:any) => {
      isOpen.value = newVal ? newVal : false
      if(newVal && props.isEdit) {
        initialValues()
      }
    }
)

</script>
