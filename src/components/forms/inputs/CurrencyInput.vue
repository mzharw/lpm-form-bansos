<script setup lang="ts">
import {CurrencyInputOptions, useCurrencyInput} from 'vue-currency-input'


const props = defineProps({
  modelValue: Number,
  options: {}
})

const {inputRef} = useCurrencyInput(props.options as CurrencyInputOptions)

</script>

<template>
  <v-text-field
      ref="inputRef"
      type="text"
  />
</template>