<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { RouterLink, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/Navbar.vue';

const form = reactive({
    login: '',
    password: ''
});


let isUserLoggedIn = ref();
let authToken = '';
let isStaff = false;

const toast = useToast();
const router = useRouter();

const handleSubmit = async () => {
    const loginUser = {
        username: form.username,
        password: form.password,
    };

    try {
        console.log('Wysłano zapytanie o auth-token')
        const response = await axios.post(`apiHost/api-token-auth/`, loginUser);
        console.log(response);
        authToken = response.data.token;

        localStorage.setItem('userAuthToken', authToken);
        isUserLoggedIn = true;
        localStorage.setItem('isUserLoggedIn', JSON.stringify(isUserLoggedIn));

        try {
            console.log('Wysłano zapytanie o status użytkownika')
            const response2 = await axios.get(`apiHost/users/`, { headers: { "Authorization": `Token ${authToken}` } });

            //console.log(JSON.stringify(response2.data));

            const getDescription = (login) => {
                const item = response2.data.find((item) => item.username === login);
                return item ? item.is_staff : 1; //
            };

            isStaff = getDescription(form.username);
            //console.log('isStaff:' + isStaff)

            localStorage.setItem('isStaff', isStaff);

            toast.success('Zalogowano', { timeout: 1500 });
            router.push(`/user`);

        } catch (error) {
            console.log("Error zdobywania statusu użytkownika", error);
            console.log("Błąd statusu: ", error.response.data);
            toast.error('Błąd statusu', { timeout: 1500 })
        }
        //console.log(localStorage);

    } catch (error) {
        console.log("Error zdobywania auth-token", error);
        toast.error('Błędny login lub hasło', { timeout: 1500 })
    }


};


const checkUserStaffStatus = async () => {




};

onMounted(() => {
    isUserLoggedIn = JSON.parse(localStorage.getItem('isUserLoggedIn'));
    if (isUserLoggedIn) {
        //toast.success('Zalogowano', { timeout: 1500 });
        router.push(`/user`);
    }
});

</script>

<template>
    <Navbar />
    <div class="flex bg-gray-800 items-center justify-center h-screen">
        <form @submit.prevent="handleSubmit">
            <v-card class="mx-auto pa-12 pb-8" elevation="8" min-width="448" rounded="lg">

                <RouterLink to="/" class="text-blue-400 hover:text-green-600 flex items-center">
                    <v-icon color="blue-grey">mdi-home</v-icon>Powrót do strony głównej
                </RouterLink>

                <div class="text-subtitle-1 text-medium-emphasis">Logowanie</div>

                <v-text-field v-model="form.username" density="compact" placeholder="Login"
                    prepend-inner-icon="mdi-account-outline" variant="outlined" required></v-text-field>

                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                    Hasło

                    <!--<a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer"
                    target="_blank">
                    Nie pamiętasz hasła?</a>-->
                </div>

                <v-text-field v-model="form.password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible ? 'text' : 'password'" density="compact" placeholder="Podaj hasło"
                    prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
                    required></v-text-field>

                <v-btn type="submit" block class="mb-8" color="blue" size="large" variant="tonal">
                    Zaloguj
                </v-btn>

                <v-card-text class="text-center">
                    <RouterLink class="text-blue text-decoration-none" to="/register">
                        Załóż konto <v-icon icon="mdi-chevron-right"></v-icon>
                    </RouterLink>
                </v-card-text>
            </v-card>
        </form>

    </div>
</template>
