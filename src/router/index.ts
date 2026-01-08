import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/auth/LoginView.vue'),
        meta: { public: true }
    },
    // Rota para Usuários Comuns (Portal do Servidor)
    {
        path: '/home',
        component: () => import('../layouts/UserLayout.vue'), // O Layout é o pai
        meta: { requiresAuth: true, role: 'ROLE_USER' },
        children: [
            {
                path: '', // Caminho vazio significa que é a rota base (/home)
                name: 'Home',
                component: () => import('../views/user/HomeView.vue')
            },

        ]
    },
    {
        path: '/ferramentas',
        component: () => import('../layouts/UserLayout.vue'),
        meta: { requiresAuth: true, role: 'ROLE_USER' },
        children: [
            {
                path: '',
                name: 'UserFerramentas',
                component: () => import('../views/user/FerramentasView.vue')
            }
        ]
    },
    {
        path: '/enquetes',
        component: () => import('../layouts/UserLayout.vue'),
        meta: { requiresAuth: true, role: 'ROLE_USER' },
        children: [
            {
                path: '',
                name: 'UserEnquetes',
                component: () => import('../views/user/EnquetesView.vue')
            }
        ]
    },
    // Rota para Admin e Gestores
    {
        path: '/admin',
        redirect: '/admin/dashboard',
        component: () => import('../layouts/AdminLayout.vue'), // Layout com Menu Lateral
        meta: { requiresAuth: true, requiresGestao: true }, // Só Admin ou Gestor
        children: [
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                component: () => import('../views/admin/DashboardView.vue')
            },
            // --- NOVAS ROTAS AQUI ---
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
                path: 'usuarios/:id/editar', // :id é um parâmetro dinâmico
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
                component: () => import('../views/admin/ferramentas/FerramentaListView.vue')
            },
            {
                path: 'ferramentas/novo',
                component: () => import('../views/admin/ferramentas/FerramentaFormView.vue')
            },
            {
                path: 'ferramentas/:id/editar',
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
                component: () => import('../views/admin/enquetes/EnqueteListView.vue')
            },
            {
                path: 'enquetes/novo',
                component: () => import('../views/admin/enquetes/EnqueteFormView.vue')
            },
            // ------------------------
            // Outras rotas virão depois
        ]
    },
    {
        // Qualquer rota desconhecida vai para o login
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guarda de Navegação (Proteção das Rotas)
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const isGestao = authStore.isGestao;

    // 1. Se a rota é pública, deixa passar
    if (to.meta.public) {
        if (isAuthenticated) {
            // Se já está logado e tenta ir pro login, manda pro lugar certo
            return next(isGestao ? '/admin/dashboard' : '/home');
        }
        return next();
    }

    // 2. Se não está logado, manda pro login
    if (!isAuthenticated) {
        return next('/login');
    }

    // 3. Proteção de Rotas Administrativas
    if (to.meta.requiresGestao && !isGestao) {
        // Se um usuário comum tentar acessar /admin, manda ele de volta pra home
        return next('/home');
    }

    next();
});

export default router;