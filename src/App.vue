<template>
  <RouterView />
  <Toaster :closeButton="true" closeButtonPosition="top-left" position="top-right" richColors :expand="false" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';

</script>

