<script setup lang="ts">
import { RouterView } from 'vue-router'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
</script>

<template>
  <div class="bg-gray-50 min-h-screen flex font-sans text-gray-900">
    <AdminSidebar />
    <div class="ml-64 flex-1 flex flex-col min-h-screen">
      <div class="flex-1 p-6">
        <RouterView />
      </div>
    </div>
  </div>
</template>
