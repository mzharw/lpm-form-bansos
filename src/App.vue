<script lang="ts">
import FormBansos from "./components/forms/FormBansos.vue";
import NotificationProvider from './components/providers/NotificationProvider.vue'
import {NotificationOptions} from './components/providers/NotificationProvider';
import Preview from "./pages/Preview.vue";

export default {
  components: {
    Preview,
    NotificationProvider,
    FormBansos,
  },
  data: () => ({
    formData: null
  }),
  methods: {
    notify(options: NotificationOptions) {
      (this.$refs.notificationProvider as InstanceType<typeof NotificationProvider>).addNotification(options);
    }
  }
};
</script>


<template>
  <v-defaults-provider>
    <FormBansos v-if="!formData" @update:formData="val => formData = val"/>
    <Preview v-if="formData" :formData="formData" @update:formData="val => formData = val"/>
    <NotificationProvider ref="notificationProvider"/>
  </v-defaults-provider>
</template>
