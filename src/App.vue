<script setup lang="ts">
import AppToastContainer from '@/components/common/AppToastContainer.vue'
import { useOnlineTracker } from '@/composables/useTracker'

useOnlineTracker()
</script>

<template>
  <RouterView />
  <AppToastContainer />
</template>
