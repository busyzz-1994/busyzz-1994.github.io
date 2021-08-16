<template>
  <ul>
    <li class="primary-color" :key="item" v-for="item in list">
      {{ item }}
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      list: ['java', 'javascript', 'php'],
    };
  },
};
</script>

<style scoped>
.red {
  color: #f00;
}
</style>
