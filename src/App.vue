<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.showApp()
  },
  methods: {
    showApp() {
      console.log('123,come on')
    }
  }
}
</script>
