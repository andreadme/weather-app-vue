<template>
    <div class="flex flex-col min-h-screen font-Overpass bg-weather-primary">
        <site-navigation />
        <router-view />
    </div>
</template>

<script setup>
import SiteNavigation from './components/SiteNavigation.vue'

</script>

<style>

</style>
