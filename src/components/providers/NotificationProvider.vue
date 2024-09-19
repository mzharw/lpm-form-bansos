<template>
  <v-container
      class="notification-container"
      :class="{ 'notification-container--hidden': !hasNotifications }"
  >
    <v-row>
      <v-col cols="12">
        <v-slide-y-reverse-transition group>
          <v-card
              v-for="(notification, index) in notifications"
              :key="notification.id"
              :style="{ marginBottom: '16px' }"
              background-color="primary"
              class="notification"
              elevation="4"
              :color="notification.context"
          >
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon :color="iconColor(notification.context ?? 'primary')" class="mr-2">
                  {{ iconName(notification.context ?? 'primary') }}
                </v-icon>
                <div>
                  <div class="text-subtitle-1 font-weight-medium">{{ notification.title }}</div>
                  <div class="text-body-2">{{ notification.desc }}</div>
                </div>
                <v-spacer></v-spacer>
                <v-btn icon @click="removeNotification(index)" :ripple="false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-card-text>
            <v-progress-linear
                v-model="notification.progress"
                height="4"
                :color="progressColor(notification.context ?? 'primary')"
            ></v-progress-linear>
          </v-card>
        </v-slide-y-reverse-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, onUnmounted, computed} from 'vue';
import {NotificationOptions} from "./NotificationProvider";

interface Notification extends NotificationOptions {
  id: number;
  progress: number;
  createdAt: number;
}

export default defineComponent({
  name: 'NotificationSystem',
  setup() {
    const notifications = ref<Notification[]>([]);
    let nextId = 0;
    let updateInterval: number | null = null;

    const hasNotifications = computed(() => notifications.value.length > 0);

    const addNotification = (options: NotificationOptions) => {
      const notification: Notification = {
        ...options,
        id: nextId++,
        context: options.context || 'primary',
        timeout: options.timeout || 5000,
        progress: 0,
        createdAt: Date.now(),
      };
      notifications.value.unshift(notification);
    };

    const removeNotification = (index: number) => {
      notifications.value.splice(index, 1);
    };

    const updateProgress = () => {
      notifications.value.forEach((notification, index) => {
        const elapsed = Date.now() - notification.createdAt;
        notification.progress = Math.min((elapsed / (notification.timeout ?? 0)) * 100, 100);
        if (notification.progress >= 100) {
          removeNotification(index);
        }
      });
    };

    const iconName = (context: string) => {
      switch (context) {
        case 'success':
          return 'mdi-check-circle';
        case 'warning':
          return 'mdi-alert';
        case 'error':
          return 'mdi-alert-circle';
        default:
          return 'mdi-information';
      }
    };

    const iconColor = (context: string) => {
      return context === 'warning' ? 'black' : 'white';
    };

    const progressColor = (context: string) => {
      return context === 'warning' ? 'black' : 'white';
    };

    onMounted(() => {
      updateInterval = setInterval(updateProgress, 100);
    });

    onUnmounted(() => {
      if (updateInterval !== null) {
        clearInterval(updateInterval);
      }
    });

    return {
      notifications,
      hasNotifications,
      addNotification,
      removeNotification,
      iconName,
      iconColor,
      progressColor,
    };
  },
});
</script>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 400px;
  max-width: 100%;
  z-index: 9999;
  transition: z-index 0.3s;
}

.notification-container--hidden {
  z-index: -1;
}
</style>