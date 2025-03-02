<script setup>
import { useData } from 'vitepress';

const { isDark } = useData();
const { src, height = 315 } = defineProps(['src', 'height']);
</script>

<template>
  <iframe width="100%" :height="height" frameBorder="0" :src="`/k5cjs/docs/?embed=${src}&dark=${isDark}`"></iframe>
</template>
