import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Home.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
            meta: { guest: true },
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/Register.vue'),
            meta: { guest: true },
        },
        {
            path: '/patient',
            meta: { requiresAuth: true, role: 'PATIENT' },
            children: [
                {
                    path: 'dashboard',
                    name: 'patient-dashboard',
                    component: () => import('../views/patient/Dashboard.vue'),
                },
                {
                    path: 'daftar',
                    name: 'patient-register',
                    component: () => import('../views/patient/RegistrationForm.vue'),
                },
                {
                    path: 'hasil',
                    name: 'patient-results',
                    component: () => import('../views/patient/Results.vue'),
                },
            ],
        },
        {
            path: '/admin',
            meta: { requiresAuth: true, role: 'ADMIN' },
            children: [
                {
                    path: 'dashboard',
                    name: 'admin-dashboard',
                    component: () => import('../views/admin/Dashboard.vue'),
                },
                {
                    path: 'users',
                    name: 'admin-users',
                    component: () => import('../views/admin/UserManagement.vue'),
                },
                {
                    path: 'pendaftaran',
                    name: 'admin-registrations',
                    component: () => import('../views/admin/Registrations.vue'),
                },
                {
                    path: 'input-hasil/:registrationId',
                    name: 'admin-input-results',
                    component: () => import('../views/admin/InputResults.vue'),
                    props: true,
                },
            ],
        },
    ],
});

// Navigation guards
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const guestOnly = to.matched.some(record => record.meta.guest);
    const requiredRole = to.matched.find(record => record.meta.role)?.meta.role;

    if (requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (guestOnly && authStore.isAuthenticated) {
        // Redirect based on role
        if (authStore.isAdmin) {
            next('/admin/dashboard');
        } else {
            next('/patient/dashboard');
        }
    } else if (requiredRole && authStore.user?.role !== requiredRole) {
        // Wrong role, redirect to appropriate dashboard
        if (authStore.isAdmin) {
            next('/admin/dashboard');
        } else {
            next('/patient/dashboard');
        }
    } else {
        next();
    }
});

export default router;
