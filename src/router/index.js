import { createRouter, createWebHistory} from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import SelectImages from '@/views/SelectImages.vue';
import RecordVideo from '@/views/RecordVideo.vue';
import LoginView from '@/views/LoginView.vue';
import ResultsView from '@/views/ResultsView.vue';
import UserView from '@/views/UserView.vue';
import RegisterView from '@/views/RegisterView.vue';
import AdminView from '@/views/AdminView.vue';


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminView
        },
        {
            path: '/results',
            name: 'results',
            component: ResultsView
        },
        {
            path: '/images',
            name: 'images',
            component: SelectImages
        },
        {
            path: '/video',
            name: 'video',
            component: RecordVideo
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/user',
            name: 'user',
            component: UserView
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        },
    ]

});

export default router;





