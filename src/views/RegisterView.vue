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


const toast = useToast();
const router = useRouter();


let containsUsername = ref(false);

const handleSubmit = async () => {
    if (form.password !== form.password2) {
        toast.error('Hasło musi być takie samo w obu polach!', { timeout: 1500 });
        return;
    }

    const registerUser = {
        username: form.username,
        password: form.password,
        password2: form.password2,
    };

    try {
        console.log('Wysyłanie zapytania rejestracji');
        console.log(registerUser);

        const response = await axios.post(`/apiHost/register`, registerUser,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        containsUsername = response.data.username.includes(registerUser.username);
        console.log("Zarejestrowano użytkownika: " + response.data.username)
        console.log("Pomyślna rejestracja: " + containsUsername)

        if(containsUsername) {
            toast.success('Zarejestrowano', { timeout: 1500 });
            router.push(`/login`);
        }

    } catch (error) {
        if (error.response) {
            console.log("Błąd rejestracji", error.response.data);
        } else {
            console.log("Błąd rejestracji", error.message);
        }
        toast.error('Błąd rejestracji', { timeout: 1500 });
    }
};

onMounted(() => {

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

                <div class="text-subtitle-1 text-medium-emphasis">Rejestracja</div>

                <v-text-field v-model="form.username" density="compact" placeholder="Login"
                    prepend-inner-icon="mdi-account-outline" variant="outlined" required></v-text-field>

                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                    Hasło
                </div>

                <v-text-field v-model="form.password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible ? 'text' : 'password'" density="compact" placeholder="Podaj hasło"
                    prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
                    required></v-text-field>

                <v-text-field v-model="form.password2" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible ? 'text' : 'password'" density="compact" placeholder="Potwierdź hasło"
                    prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
                    required></v-text-field>

                <v-btn type="submit" block class="mb-8" color="blue" size="large" variant="tonal">
                    Zarejestruj
                </v-btn>
                <v-card-text class="text-center">
                    <RouterLink class="text-blue text-decoration-none" to="/login">
                        Przejdź do logowania <v-icon icon="mdi-chevron-right"></v-icon>
                    </RouterLink>
                </v-card-text>
            </v-card>
        </form>

    </div>
</template>
