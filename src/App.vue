<script setup>
import GithubBox from './components/githubBox.vue'
</script>

<template>
  <div>
    <h1>GitHub Box Demo</h1>

    <!-- Ejemplo usando URL completa -->
    <GithubBox url="https://github.com/ferdotdeb/LinuxWizards/blob/main/softwareWizard.sh" />

    <!-- Ejemplo usando props individuales -->
    <!-- <GithubBox
      owner="ferdotdeb"
      repo="LinuxWizards"
      path="softwareWizard.sh"
      branch="main"
    /> -->
  </div>
</template>

<style scoped>
h1 {
  color: #fff;
  text-align: center;
  padding: 2rem;
  font-family: 'Ubuntu', sans-serif;
}

div {
  background: #0b0b0b;
  min-height: 100vh;
}
</style>
