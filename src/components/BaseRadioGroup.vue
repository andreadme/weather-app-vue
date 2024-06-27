<template>
    <div class="my-2">
        <base-radio
            v-for="(option, key) in props.options"
            :label="option.label"
            :value="option.value"
            :name="props.name"
            :key="key"
            v-model="modelValue"
            @update:modelValue="updateInput"
        />
    </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseRadio from './BaseRadio.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    options: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    modelValue: {
        type: [String, Number],
        required: true
    }
});

const modelValue = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
    modelValue.value = newVal;
});


const updateInput = (value) => {
    modelValue.value = value;
    console.log(value)
    emit('update:modelValue', value);
};

</script>

<style lang="scss" scoped>

</style>