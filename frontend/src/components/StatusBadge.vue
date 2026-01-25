<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['PENDING', 'ARRIVED', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].includes(value),
  },
});

const statusConfig = {
  PENDING: {
    class: 'badge-pending',
    label: 'Menunggu',
    icon: '⏳',
  },
  ARRIVED: {
    class: 'badge-arrived',
    label: 'Sudah Datang',
    icon: '✓',
  },
  SCHEDULED: {
    class: 'badge-scheduled',
    label: 'Terjadwal',
    icon: '📅',
  },
  COMPLETED: {
    class: 'badge-completed',
    label: 'Selesai',
    icon: '✅',
  },
  CANCELLED: {
    class: 'badge-cancelled',
    label: 'Dibatalkan',
    icon: '❌',
  },
};

const config = statusConfig[props.status] || statusConfig.PENDING;
</script>

<template>
  <span :class="config.class">
    <span class="mr-1">{{ config.icon }}</span>
    {{ config.label }}
  </span>
</template>

<style scoped>
.badge-arrived {
  @apply px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800;
}
</style>

