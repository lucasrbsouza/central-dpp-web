<template>
    <aside :class="[
        'bg-piaui-blue text-white w-64 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out',
        'fixed inset-y-0 left-0 z-30',
        'md:relative md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
        <div class="h-16 flex items-center justify-center border-b border-blue-800 bg-blue-900 relative">
            <span class="font-bold text-lg tracking-wider">
                Central DPP
                <span class="text-xs bg-piaui-yellow text-piaui-blue px-1 rounded">Gestão</span>
            </span>

            <button @click="$emit('close')" class="absolute right-4 text-blue-300 hover:text-white md:hidden">
                ✕
            </button>
        </div>

        <nav class="flex-1 overflow-y-auto py-4">
            <ul class="space-y-1">

                <li>
                    <router-link to="/home" @click="$emit('close')"
                        class="flex items-center px-6 py-3 hover:bg-white/10 transition-colors"
                        active-class="bg-white/20 border-r-4 border-piaui-yellow">
                        <span class="mr-3">
                            <HomeIcon class="h-5 w-5" />
                        </span> Home
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/dashboard" @click="$emit('close')"
                        class="flex items-center px-6 py-3 hover:bg-white/10 transition-colors"
                        active-class="bg-white/20 border-r-4 border-piaui-yellow">
                        <span class="mr-3">
                            <ChartPieIcon class="h-5 w-5" />
                        </span> Dashboard
                    </router-link>
                </li>

                <li v-if="isAdmin" class="px-6 pt-4 pb-2 text-xs text-blue-300 uppercase font-semibold">
                    Administração
                </li>

                <li v-if="isAdmin">
                    <router-link to="/admin/usuarios" @click="$emit('close')"
                        class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors"
                        active-class="bg-white/20 border-r-4 border-piaui-yellow">
                        <span class="mr-3">
                            <UsersIcon class="h-5 w-5" />
                        </span> Usuários
                    </router-link>
                </li>

                <li v-if="authStore.isAdmin">
                    <router-link to="/admin/colaboradores" @click="$emit('close')"
                        class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors"
                        active-class="bg-white/20 border-r-4 border-piaui-yellow">
                        <span class="mr-3">
                            <IdentificationIcon class="h-5 w-5" />
                        </span> Colaboradores
                    </router-link>
                </li>

                <li v-if="isAdmin">
                    <router-link to="/admin/equipes" @click="$emit('close')"
                        class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors"
                        active-class="bg-white/20 border-r-4 border-piaui-yellow">
                        <span class="mr-3">
                            <BuildingOffice2Icon class="h-5 w-5" />
                        </span> Equipes / Setores
                    </router-link>
                </li>

                <li class="px-6 pt-4 pb-2 text-xs text-blue-300 uppercase font-semibold">
                    Conteúdo
                </li>

                <li>
                    <router-link to="/admin/avisos" @click="$emit('close')"
                        class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors"
                        active-class="bg-white/20 border-r-4 border-piaui-yellow">
                        <span class="mr-3"><BellIcon class="h-5 w-5" /></span> Avisos
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/eventos" @click="$emit('close')"
                        class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors"
                        active-class="bg-white/20 border-r-4 border-piaui-yellow">
                        <span class="mr-3"><CalendarDaysIcon class="h-5 w-5" /></span> Eventos
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/enquetes" @click="$emit('close')"
                        class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors"
                        active-class="bg-white/20 border-r-4 border-piaui-yellow">
                        <span class="mr-3"><ChartBarIcon class="h-5 w-5" /></span> Enquetes
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/ferramentas" @click="$emit('close')"
                        class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors"
                        active-class="bg-white/20 border-r-4 border-piaui-yellow">
                        <span class="mr-3"><WrenchIcon class="h-5 w-5" /></span> Ferramentas
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/documentos" @click="$emit('close')"
                        class="flex items-center px-6 py-2 hover:bg-white/10 transition-colors"
                        active-class="bg-white/20 border-r-4 border-piaui-yellow">
                        <span class="mr-3"><FolderIcon class="h-5 w-5" /></span> Documentos
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/configuracoes"
                        class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        active-class="bg-gray-800 text-white border-r-4 border-piaui-blue">
                        <span class="text-xl"><Cog6ToothIcon class="h-5 w-5" /></span> <span class="font-medium">Cadastros Auxiliares</span>
                    </router-link>
                </li>

            </ul>
        </nav>

        <AdminUserInfo />
    </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';
import AdminUserInfo from './AdminUserInfo.vue';
import { HomeIcon, ChartPieIcon, 
    UsersIcon, IdentificationIcon, 
    BuildingOffice2Icon, CalendarDaysIcon,
    ChartBarIcon, WrenchIcon,
    FolderIcon, Cog6ToothIcon, BellIcon
 } from '@heroicons/vue/24/outline';

defineProps<{
    isOpen: boolean;
}>();

defineEmits(['close']);

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;
</script>
