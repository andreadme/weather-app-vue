<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg z-50">
        <nav class="container flex flex-col sm:flex-row items-center gap-4 text-[#EC6E4C] py-6">
            <router-link :to="{ name: 'home' }">            
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-sun text-2xl"></i>
                    <p class="text-lg md:text-3xl">The App Weather</p>
                </div>
            </router-link>

            <div class="flex gap-3 flex-1 justify-end">
                <i @click="toggleModal" class="fa-solid fa-circle-info text-lg text-white md:text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>
            </div>

            <base-modal :modalActive="modalActive" @close-modal="toggleModal">
                <div class="text-black">
                    <h1 class="text-2xl mb-1">About:</h1>
                    <p class="mb-4">
                        The App Weather allows you to track the current and
                        future weather of cities of your choosing.
                    </p>
                    <h2 class="text-2xl">How it works:</h2>
                    <ol class="list-decimal list-inside mb-4">
                        <li>
                        Select a unit of measurement for the temperature. The default is metric.
                        </li>
                        <li>
                        Search for your city by entering the name into the
                        search bar. 
                        </li>
                        <li>
                        Select a city within the results, this will take
                        you to the current weather for your selection.
                        </li>
                    </ol>
                </div>
            </base-modal>

        </nav>
    </header>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import { ref } from 'vue'

const modalActive = ref(null);
const toggleModal = () => {
    modalActive.value = !modalActive.value;
};

</script>

<style lang="scss" scoped>

</style>