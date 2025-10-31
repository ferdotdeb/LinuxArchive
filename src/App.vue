<script setup>
import GithubBox from './components/githubBox.vue'
</script>

<template>
  <div>
    <h1>GitHub Box Demo</h1>

    <!-- Full URL -->
    <GithubBox url="https://github.com/ferdotdeb/LinuxWizards/blob/main/aliasWizard.sh" />

    <!-- Individual props -->
    <!-- <GithubBox owner="ferdotdeb" repo="LinuxWizards" path="softwareWizard.sh" branch="main"/> -->
  </div>
</template>

<style scoped></style>
