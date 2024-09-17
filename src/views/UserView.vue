<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/Navbar.vue'

import axios from 'axios'


const toast = useToast();
const router = useRouter();

const goHome = () => {
    router.push('/');
};

const goRoute = (dest) => {
    router.push(dest);
};


const userAuthToken = reactive(localStorage.userAuthToken);
let isUserLoggedIn = ref();

const data = reactive({
    entries: [],
    isLoading: true
});


const logOut = () => {
    localStorage.setItem('isUserLoggedIn', JSON.stringify(false));
    localStorage.setItem('userAuthToken', '');
    toast.success('Wylogowano', { timeout: 1500 });
    router.push('/');

};

let route = useRoute();

onMounted(() => {
    if (localStorage.getItem("userAuthToken") === null || localStorage.getItem("isUserLoggedIn") === null || isUserLoggedIn != true) {
        //logOut();
    }
});

onMounted(async () => {
    try {
        const response = await axios.get(`apiHost/money_scan/`, { headers: { "Authorization": `Token ${userAuthToken}` } });
        data.entries = response.data;

        let date;
        let time;
        let holder;

        data.entries.forEach((elem, index) => {
            date = elem.created_at.split("T")[0];
            time = elem.created_at.split("T")[1];

            time = time.split(':');
            holder = parseFloat(time[2].split('Z')[0]);
            holder = parseFloat(holder).toFixed(2)

            time[2] = holder.split('.')[0]
            //console.log(time[2]);

            if (time[2] < 10) {
                time[2] = 0 + time[2];
                //console.log(time[2]);
            }

            time = time.join(":")
            //console.log(time);
            //elem = `${date}T${time}`;
            //console.log(elem);

            const newCreatedAt = `${date}T${time}`;
            elem.created_at = newCreatedAt;

            //console.log(elem.created_at);

        });
        //console.log(data.entries);

    } catch (error) {
        console.log("Błąd pobierania obrazów", error);
    } finally {
        data.isLoading = false;
    }
});


//rowziwjanie wszystkie wpisów w panelu
const panel = ref([]);

const all = () => {
    panel.value = data.entries.map(entry => entry.scanId);
};

const none = () => {
    panel.value = [];
};


//NBP kursy
const ratesNBP = ref([]);

const fetchNBPRates = async () => {
    try {
        const response = await axios.get('https://api.nbp.pl/api/exchangerates/tables/A/?format=json');
        ratesNBP.value = response.data[0].rates;
        //console.log(`kursy: ` + JSON.stringify(ratesNBP.value));
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
    }
};



//waluty z naszego api
const currencies = ref([]);

const fetchCurrencies = async () => {
    try {
        const response = await axios.get('apiHost/currencies/');
        currencies.value = response.data;
        //console.log('json: ' + JSON.stringify(currencies.value));

    } catch (error) {
        console.error('Błąd pobierania danych:', error);
    }
};


//-====================



const getRate = (name) => {
    const item = ratesNBP.value.find((item) => item.code === name);
    return item ? item.mid : 1; //jeśli nie ma to znaczy, że złotówki
};

const getDescription = (name) => {
    const item = currencies.value.find((item) => item.currency === name);
    return item ? item.description : 1; //
};

const getSymbol = (name) => {
    const item = currencies.value.find((item) => item.currency === name);
    return item ? item.symbol : 1; //
};


const userStats = ref([]);
const nazwyWalut = ref(["USD", "EUR", "INR", "PLN", "AUD", "BRL", "JPY", "MXN", "PKR", "SGD", "TRY", "NZD", "NAD", "MYR", "IDR", "CAD", "PHP"
])

const getUserStats = async () => {
    try {
        const response = await axios.get(`apiHost/getUserStats/`, { headers: { "Authorization": `Token ${userAuthToken}` } });
        userStats.value = response.data;
        //console.log('json: ' + JSON.stringify(userStats.value));

    } catch (error) {
        console.error('Błąd pobierania danych:', error);
    }
};


// Filtruje waluty, dla których liczba skanów jest większa niż 0
const filteredCurrencies = computed(() => {
    return nazwyWalut.value.filter(currency => {
        return userStats.value[currency]?.scansCcount > 0;
    });
});


onMounted(() => {
    fetchNBPRates();
    fetchCurrencies();
    getUserStats();
});



</script>



<template>
    <Navbar />
    <v-app class="pt-20">
        <v-main>
            <v-container class="justify-center align-center h-100">
                <v-expansion-panels>
                    <v-expansion-panel icon="none">
                        <v-expansion-panel-title class="bg-gray-200 font-weight-bold"
                            collapse-icon="mdiBorderNoneVariant" expand-icon="mdiBorderNoneVariant" readonly>
                            Statystyki
                        </v-expansion-panel-title>
                    </v-expansion-panel>

                    <v-expansion-panel icon="none">
                        <v-expansion-panel-title class="bg-gray-200 text-center" collapse-icon="mdiBorderNoneVariant"
                            expand-icon="mdiBorderNoneVariant" readonly>
                            <v-row no-gutters class="bg-gray-200 text-center ma-2 pa-2">
                                <v-col>
                                    <v-sheet class="bg-gray-200 font-weight-bold">
                                        Oznaczenie
                                    </v-sheet>
                                </v-col>
                                <v-col>
                                    <v-sheet class="bg-gray-200 font-weight-bold">
                                        Ilość skanów
                                    </v-sheet>
                                </v-col>
                                <v-col>
                                    <v-sheet class="bg-gray-200 font-weight-bold">
                                        Kurs NBP
                                    </v-sheet>
                                </v-col>
                                <v-col>
                                    <v-sheet class="bg-gray-200 font-weight-bold">
                                        Łączna wartość
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-title>
                    </v-expansion-panel>
                </v-expansion-panels>
                
                <v-expansion-panels v-if="filteredCurrencies.length">
                    <v-expansion-panel v-for="currency in filteredCurrencies" :key="currency">
                        <v-expansion-panel-title class="bg-gray-200 text-center" collapse-icon="mdiBorderNoneVariant"
                            expand-icon="mdiBorderNoneVariant" readonly>
                            <v-container class="bg-gray-200 rounded">
                                <v-row no-gutters class="bg-gray-200 text-center">
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ currency }}
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ userStats[currency].scansCcount }}
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ `${userStats[currency].currencyRate} zł` }}
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ parseFloat(userStats[currency].totalValue).toFixed(2) }}
                                        </v-sheet>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-expansion-panel-title>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels v-else>
                    <v-expansion-panel>
                        <v-expansion-panel-title class="bg-gray-200 text-center" collapse-icon="mdiBorderNoneVariant"
                            expand-icon="mdiBorderNoneVariant" readonly>
                            Brak danych
                        </v-expansion-panel-title>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels class="mt-10">
                    <v-expansion-panel icon="none">
                        <v-expansion-panel-title class="bg-gray-200 text-center font-weight-bold"
                            collapse-icon="mdiBorderNoneVariant" expand-icon="mdiBorderNoneVariant" readonly>
                            Historia skanów
                        </v-expansion-panel-title>
                    </v-expansion-panel>
                    <v-expansion-panel icon="none">
                        <v-expansion-panel-title class="bg-gray-200" collapse-icon="mdiBorderNoneVariant"
                            expand-icon="mdiBorderNoneVariant" readonly>
                            <v-container class="bg-gray-200">
                                <v-row no-gutters class="bg-gray-200">
                                    <v-col>
                                        <v-sheet class="bg-gray-200 font-weight-bold">
                                            Data wysłania
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200 font-weight-bold">
                                            Czas wysłania
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200 font-weight-bold">
                                            Oznaczenie
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200 font-weight-bold">
                                            Nominał
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200 font-weight-bold">
                                            Symbol
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200 font-weight-bold">
                                            Pewność
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200 font-weight-bold">
                                            Wartość w PLN
                                        </v-sheet>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-expansion-panel-title>
                    </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels v-model="panel" multiple>
                    <v-expansion-panel v-for="entry in data.entries" :key="entry">
                        <v-expansion-panel-title class="bg-gray-200">
                            <v-container class="bg-gray-200">
                                <v-row no-gutters class="bg-gray-200">
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ entry.created_at.split("T")[0] }}
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ entry.created_at.split("T")[1] }}
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ entry.currency }}
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ parseFloat(entry.denomination).toFixed(2) }}
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ getSymbol(entry.currency) }}
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ parseFloat(entry.confidence).toFixed(2) }}%
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="bg-gray-200">
                                            {{ `${parseFloat(getRate(entry.currency) *
                                                entry.denomination).toFixed(2)} PLN` }}
                                        </v-sheet>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text :value="entry.scanId">
                            <v-container class="rounded-lg">
                                <v-img class=" rounded-lg mx-auto h-30 w-33" h-48 w-96 :src="entry.image"></v-img>
                            </v-container>
                            <v-container>{{ getDescription(entry.currency) }}</v-container>
                        </v-expansion-panel-text>

                    </v-expansion-panel>
                </v-expansion-panels>

            </v-container>
        </v-main>
    </v-app>
</template>
