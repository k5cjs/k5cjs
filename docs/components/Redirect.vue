<template>
  <div>
    <!-- Your component content here -->
  </div>
</template>

<script>
export default {
  created() {
    // const path = this.$route.path;
    const path = this.$route;

    console.log(path); // /examples/example

    // Check if the path matches the regex pattern
    if (/^\/examples\/[a-z]+$/i.test(path)) {
      // Redirect to a different path for product names (e.g., /products/example -> /products/123)
      this.$router.replace(`/test`);
    }
  },
};
</script>
