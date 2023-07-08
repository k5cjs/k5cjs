<script setup>
import { useData } from 'vitepress';

const { isDark } = useData();
const { src } = defineProps(['src']);
</script>

<template>
  <iframe width="100%" height="315" frameBorder="0" :src="`/k5cjs/examples/?embed=${src}&dark=${isDark}`"></iframe>
</template>
