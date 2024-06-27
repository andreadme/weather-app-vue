<template>
    <Teleport to="body">
        <div v-show="modalActive" class="absolute w-full bg-black bg-opacity-30 h-screen top-0 left-0 flex justify-center px-8">
            <div v-if="modalActive" class="p-4 bg-weather-tertiary self-start mt-32 max-w-screen-md">
                <slot />
                <button @click="$emit('close-modal')" class="text-[#F8F8F8] mt-8 bg-weather-primary py-2 px-6 rounded-sm font-semibold">Close</button>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineEmits(["close-modal"]);
defineProps({
    modalActive: {
        type: Boolean,
        default: false,
    },
});
</script>

<style lang="scss" scoped>

</style>