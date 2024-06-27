<template>
    <div class="flex flex-row">
        <input
            :bind="$attrs"
            :checked="props.modelValue === value"
            @change="updateInput"
            :value="props.value"
            type="radio"
            class="focus:ring-0 h-4 w-4"
        />
        <label class="ml-2 block text-sm text-gray-900">
            {{ props.label }}
        </label>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number],
        default: ''
    },
    value: {
        type: [String, Number],
        required: true,
    }
});

const updateInput = ($event) => {
    emit('update:modelValue', $event.target.value)
};

</script>

<style lang="scss" scoped>

</style>