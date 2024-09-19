<script lang="ts">
import {ref, watch, computed} from 'vue';
import {getDataRegion} from "../../../services/fetch.ts";
import {VAutocomplete} from "vuetify/components";
import type {DivisionType} from "./SelectRegion";

interface RegionItem {
  title: string;
  value: string;
  id: string | number;
}

export default {
  name: "SelectRegion",
  extends: VAutocomplete,
  props: {
    division: {
      type: String as () => DivisionType,
      required: true,
    },
    refId: {
      type: [String, Number],
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'update:refId'],
  setup(props, {emit}) {
    const items = ref<RegionItem[]>([]);
    const loading = ref(false);
    const localValue = ref(props.modelValue);

    const showSelect = computed(() => {
      return props.division === 'province' || (props.refId !== '' && props.refId !== undefined && props.refId !== null);
    });

    const fetchData = async () => {
      if (!showSelect.value) return;

      loading.value = true;
      try {
        const result = await getDataRegion(props.division, props.refId);
        if (result && Array.isArray(result)) {
          items.value = result.map(item => ({
            title: item.name,
            value: item.name,
            id: item.id
          }));
        } else {
          console.error("Unexpected data format received from API");
          items.value = [];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        items.value = [];
      } finally {
        loading.value = false;
      }
    };

    watch(() => props.refId, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        localValue.value = '';
        emit('update:modelValue', '');
        emit('update:refId', '');
      }
      if (props.division !== 'province' && newVal !== '' && newVal !== undefined && newVal !== null) {
        fetchData();
      }
    }, {immediate: true});

    if (props.division === 'province') {
      fetchData();
    }

    const handleUpdate = (value: string) => {
      localValue.value = value;
      emit('update:modelValue', value);
      const selectedItem = items.value.find(item => item.value === value);
      if (selectedItem) {
        emit('update:refId', selectedItem.id);
      } else {
        emit('update:refId', '');
      }
    };

    return {
      items,
      handleUpdate,
      showSelect,
      loading,
      localValue,
    };
  },
}
</script>

<template>
  <v-autocomplete
      filterable
      v-if="showSelect"
      v-bind="$props"
      :items="items"
      v-model="localValue"
      @update:modelValue="handleUpdate"
      :loading="loading"
  >
    <template #label>
      <slot name="label"/>
    </template>
  </v-autocomplete>
</template>