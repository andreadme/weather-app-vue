<template>
    <main class="container text-[#EC6E4C] text-sm md:text-2xl">
        <div v-if="isLoading" class="text-[#393835] flex flex-row items-center mx-5 my-10">
            Processing...
        </div>
        <div v-else class="pt-2 mb-4 sm:pt-4 sm:mb-8 relative">
            <auto-complete v-model="searchQuery" :optionLabel="option => option.name + ', ' + option.formatted_address" :suggestions="options" placeholder="Search for a city or state" @complete="placeSearch" 
                class="py-2 px-1 w-full bg-transparent border-b text-sm md:text-2lg">
                <template #option="slotProps">
                    <div class="flex items-center" @click="getSearchResults(slotProps.option.city_name, slotProps.option.country_code)">
                        <div>{{ slotProps.option.name + ', ' + slotProps.option.formatted_address }}</div>
                    </div>
                </template>
            </auto-complete>
            <base-radio-group
                :options="metrics"
                name="option"
                v-model="selectedMetric"
            />
            <div v-if="searchError">
                <div class="text-red text-[20px] my-7">
                    Sorry, no results found. Please try different city.
                </div>
            </div>
            <div v-else class="weather-container w-full rounded-lg overflow-hidden bg-[#F2F3F5] bg-opacity-40 shadow-lg mt-4 text-[#393835] px-3 py-5 md:px-6 md:py-8">
                <div>
                    <div class="text-left">{{ selectedCity }}, {{ selectedCountry }}</div>
                </div>
                <div class="current-weather mb-2">
                    <div class="current-date items-left">
                        <div class="text-lg">{{ selectedWeather.display_date }}</div>
                    </div>
                    <div class="current-details">
                        <div class="flex flex-row justify-between">
                            <div class="">
                                <img
                                    class="w-[50px] md:w-[100px] h-auto"
                                    :src="
                                    `http://openweathermap.org/img/wn/${selectedWeather.icon}@2x.png`
                                    "
                                    alt=""
                                />
                                <div>
                                    <div class="font-semibold">{{ selectedWeather.main_temp }}</div>
                                    <div class="text-xs md:text-sm">Feels like {{ selectedWeather.feels_like }}</div>
                                    <div class="font-semibold">{{ selectedWeather.description }}</div>
                                    <div class="font-semibold flex text-left text-sm">
                                        <div class="mr-4"><i class="fas fa-compass text-md mr-1"></i>{{ selectedWeather.wind }}</div>
                                        <div class="mr-4"><i class="fas fa-droplet text-md mr-1"></i>{{ selectedWeather.humidity }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col justify-center items-center text-right">
                                <div><i class="fa-solid fa-arrow-up text-md mr-2 text-orange-500"></i>H: {{ selectedWeather.max_temp }}</div>
                                <div><i class="fa-solid fa-arrow-down text-md mr-2 text-blue-700"></i>L: {{ selectedWeather.min_temp }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="today-weather text-[12px] md:text-[20px] overflow-auto mt-3">
                    <div class="flex flex-row justify-center items-center">
                        <div v-for="(today, tKey) in todayWeathers" :key="tKey" 
                            :class="['flex flex-col w-1/8 px-3 py-1 md:px-5 md:py-3 mx-3 bg-opacity-75']">
                            <div class="text-center">{{ today.time }}</div>
                            <div class="px-4 flex items-center">
                                <img
                                    class="w-[50px] md:w-[75px] h-auto"
                                    :src="
                                    `http://openweathermap.org/img/wn/${today.icon}@2x.png`
                                    "
                                    alt=""
                                />
                            </div>
                            <div class="text-center">
                                <div>{{ today.max_temp }}</div>
                                <div>{{ today.min_temp }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="future-weather text-md overflow-hidden mt-3">
                    <div class="flex flex-col items-center">
                        <div v-if="searchError" class="text-red font-bold">
                            Sorry, something went wrong. Please try again.
                        </div>
                        <div v-for="(searchResult, key) in searchResults" :key="key" @click="getWeather(searchResult)" 
                            :class="['flex flex-row px-4 py-2 md:px-8 md:py-5 w-full hover:bg-weather-primary hover:cursor-pointer']">
                            <div class="flex items-center pr-5 w-1/6">
                                {{ formatDateTime(searchResult.date, searchResult.time, 'ddd, h:mm a') }}
                            </div>
                            <div class="flex items-center pl-3 w-1/6">
                                <img
                                    class="w-[30px] sm:w-[50px] h-auto"
                                    :src="
                                    `http://openweathermap.org/img/wn/${searchResult.icon}@2x.png`
                                    "
                                    alt=""
                                />
                            </div>
                            <div class="flex items-center pl-3 w-2/6">
                                <div>{{ searchResult.description }}</div>
                            </div>
                            <div class="flex items-center justify-end pl-3 w-2/6">
                                <div>{{ searchResult.max_temp }} / {{ searchResult.min_temp }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "@/services/axios";
import momentMini from "moment-mini";
import AutoComplete from 'primevue/autocomplete';
import BaseRadioGroup from "@/components/BaseRadioGroup.vue";

const metrics = [
    { label: "Standard", value: "standard"},
    { label: "Metric", value: "metric" },
    { label: "Imperial", value: "imperial" }
];

const isLoading = ref(true);
const searchQuery = ref("Tokyo");
const queryTimeout = ref(null);
const selectedCity = ref(null);
const selectedCountry = ref(null);
const options = ref(null);
const searchResults = ref(null);
const searchError = ref(null);
const todayWeathers = ref(null);
const selectedWeather = ref({
    display_date: null,
    main_temp: null,
    feels_like: null,
    description: null,
    min_temp: null,
    max_temp: null
});
const selectedMetric = ref("metric");

onMounted(() => {
    getSearchResults(searchQuery.value, "JP");
});

const placeSearch = async () => {
    clearTimeout(queryTimeout.value);
    queryTimeout.value = setTimeout(async () => {
        if (searchQuery.value !== "") {
            try {
                const response = await axios.get('/place/search', {
                    params: {
                        near: searchQuery.value,
                    }
                });

                options.value = response.data.result.data.search_results;
            } catch (err) {
                console.log(err)
            }
        }
    }, 1000);
}

const getSearchResults = async (city, country) => {
    try {
        const response = await axios.get('/weather-forecast/show', {
            params: {
                city_name: city,
                country_code: country,
                units: selectedMetric.value,
            }
        });

        let currentData = response.data.result.data.current_weather;
        let weatherData = response.data.result.data.combined;

        // Get the first date key
        let firstDateKey = Object.keys(currentData)[0];
        // Access the data for the first time slot
        let firstData = currentData[firstDateKey];

        selectedWeather.value = firstData;
        searchResults.value = weatherData;
        selectedCity.value = response.data.result.data.city;
        selectedCountry.value = response.data.result.data.country;

        todayWeathers.value = currentData;
        isLoading.value = false;
    } catch {
        searchError.value = true;
        isLoading.value = false;
    }

    return;
};

const getWeather = async (searchResult) => {
    selectedWeather.value = searchResult;
};

const formatDateTime = computed(() => (date, time, format) => {
    const dateTime = date + " " + time;
    return momentMini(dateTime).format(format);
});

</script>

<style>
.p-inputtext {
    width: 100%;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    background: transparent !important;
    outline: none !important;
    border-radius: none !important;
    border: none !important;
    color: #393835 !important;
    font-size: 14px !important;
}

.p-inputtext:focus {
    border-color: #004E71;
    box-shadow: 0px 1px 0 0 #004E71;
}

@media (min-width: 768px) {
    .p-inputtext {
        font-size: 20px!important;
    }
}
</style>