import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

/* =========================
   Public Routes
========================= */
const publicRoutes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/auth/LoginView.vue'),
        meta: { public: true }
    }
];

/* =========================
   User Routes
========================= */
const userRoutes = {
    path: '/',
    component: () => import('../layouts/UserLayout.vue'),
    meta: { requiresAuth: true, role: 'ROLE_USER' },
    children: [
        {
            path: 'home',
            name: 'Home',
            component: () => import('../views/user/HomeView.vue')
        },
        {
            path: 'ferramentas',
            name: 'UserFerramentas',
            component: () => import('../views/user/FerramentasView.vue')
        },
        {
            path: 'enquetes',
            name: 'UserEnquetes',
            component: () => import('../views/user/EnquetesView.vue')
        },
        {
            path: 'documentos',
            name: 'UserDocumentos',
            component: () => import('../views/user/DocumentosView.vue')
        },
        {
            path: 'equipes',
            name: 'UserEquipes',
            component: () => import('../views/user/EquipesView.vue')
        },
        {
            path: 'agenda',
            name: 'UserAgenda',
            component: () => import('../views/user/AgendaCalendarioView.vue')
        },
        {
            path: 'perfil',
            name: 'UserProfile',
            component: () => import('../views/user/UserProfileView.vue')
        },
        {
            path: 'colaboradores',
            name: 'UserColaboradores',
            component: () => import('../views/user/ColaboradoresListView.vue')
        }
    ]
};

/* =========================
   Admin Routes
========================= */
const adminRoutes = {
    path: '/admin',
    redirect: '/admin/dashboard',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresGestao: true },
    children: [
        {
            path: 'dashboard',
            name: 'AdminDashboard',
            component: () => import('../views/admin/DashboardView.vue')
        },

        {
            path: 'usuarios',
            name: 'AdminUsuarios',
            component: () => import('../views/admin/users/UserListView.vue')
        },
        {
            path: 'usuarios/novo',
            name: 'AdminUsuarioNovo',
            component: () => import('../views/user/UserFormView.vue')
        },
        {
            path: 'usuarios/:id/editar',
            name: 'AdminUsuarioEditar',
            component: () => import('../views/user/UserFormView.vue')
        },

        {
            path: 'avisos',
            name: 'AdminAvisos',
            component: () => import('../views/admin/avisos/AvisoListView.vue')
        },
        {
            path: 'avisos/novo',
            name: 'AdminAvisoNovo',
            component: () => import('../views/admin/avisos/AvisoFormView.vue')
        },

        {
            path: 'eventos',
            name: 'AdminEventos',
            component: () => import('../views/admin/eventos/EventoListView.vue')
        },
        {
            path: 'eventos/novo',
            name: 'AdminEventoNovo',
            component: () => import('../views/admin/eventos/EventoFormView.vue')
        },
        {
            path: 'eventos/:id/editar',
            name: 'AdminEventoEditar',
            component: () => import('../views/admin/eventos/EventoFormView.vue')
        },

        {
            path: 'ferramentas',
            name: 'AdminFerramentas',
            component: () => import('../views/admin/ferramentas/FerramentaListView.vue')
        },
        {
            path: 'ferramentas/novo',
            name: 'AdminFerramentaNova',
            component: () => import('../views/admin/ferramentas/FerramentaFormView.vue')
        },
        {
            path: 'ferramentas/:id/editar',
            name: 'AdminFerramentaEditar',
            component: () => import('../views/admin/ferramentas/FerramentaFormView.vue')
        },

        {
            path: 'equipes',
            name: 'AdminEquipes',
            component: () => import('../views/admin/equipes/EquipeListView.vue')
        },
        {
            path: 'equipes/novo',
            name: 'AdminEquipeNova',
            component: () => import('../views/admin/equipes/EquipeFormView.vue')
        },
        {
            path: 'equipes/:id/editar',
            name: 'AdminEquipeEditar',
            component: () => import('../views/admin/equipes/EquipeFormView.vue')
        },

        {
            path: 'documentos',
            name: 'AdminDocumentos',
            component: () => import('../views/admin/documentos/DocumentoListView.vue')
        },
        {
            path: 'documentos/novo',
            name: 'AdminDocumentoNovo',
            component: () => import('../views/admin/documentos/DocumentoFormView.vue')
        },

        {
            path: 'enquetes',
            name: 'AdminEnquetes',
            component: () => import('../views/admin/enquetes/EnqueteListView.vue')
        },
        {
            path: 'enquetes/novo',
            name: 'AdminEnqueteNova',
            component: () => import('../views/admin/enquetes/EnqueteFormView.vue')
        },
        {
            path: 'colaboradores',
            name: 'AdminColaboradores',
            component: () => import('../views/admin/colaboradores/ColaboradorListView.vue')
        },
        {
            path: 'colaboradores/:id/editar',
            name: 'AdminColaboradorEditar',
            component: () => import('../views/admin/colaboradores/ColaboradorFormView.vue')
        },
    ]
};

/* =========================
   Router
========================= */
const routes = [
    ...publicRoutes,
    userRoutes,
    adminRoutes,
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

/* =========================
   Navigation Guard
========================= */
router.beforeEach((to) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const isGestao = authStore.isGestao;

    // Rotas públicas
    if (to.meta.public) {
        if (isAuthenticated) {
            return isGestao ? '/admin/dashboard' : '/home';
        }
        return true;
    }

    // Não autenticado
    if (!isAuthenticated) {
        return '/login';
    }

    // Proteção área administrativa
    if (to.meta.requiresGestao && !isGestao) {
        return '/home';
    }

    return true;
});

export default router;
