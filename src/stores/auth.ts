import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import type { UserProfile } from '../types/auth';

interface LoginResponse {
  token: string;
  roles: string[];
}

export const useAuthStore = defineStore('auth', () => {
  // Estado (State)
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<UserProfile | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const roles = ref<string[]>(JSON.parse(localStorage.getItem('roles') || '[]'));
  const router = useRouter();

  // Getters (Computed)
  const isAuthenticated = computed(() => !!token.value);
  
  // Verifica se é Gestão (Admin ou Gestor)
  const isGestao = computed(() => 
    roles.value.includes('ROLE_ADMIN') || roles.value.includes('ROLE_GESTOR')
  );
  
  // Verifica se é Admin (Acesso total)
  const isAdmin = computed(() => roles.value.includes('ROLE_ADMIN'));
  
  const nomeCompleto = computed(() => 
    user.value ? `${user.value.nome} ${user.value.sobrenome}` : 'Usuário'
  );

  // Ações (Actions)
  async function login(email: string, senha: string) {
    try {
      // 1. Faz a requisição de login
      const response = await api.post<LoginResponse>('/auth/login', { email, senha });
      
      // 2. Extrai os dados diretamente do JSON (Simples e Limpo!)
      const { token: newToken, roles: userRoles } = response.data;

      // 3. Salva no Estado e LocalStorage
      token.value = newToken;
      roles.value = userRoles;

      localStorage.setItem('token', newToken);
      localStorage.setItem('roles', JSON.stringify(userRoles));

      // 4. Busca os dados detalhados do perfil (Nome, Cargo, Foto)
      await fetchUserProfile();
      
      // 5. Redirecionamento Inteligente
      if (isAdmin.value || isGestao.value) {
        router.push('/admin/dashboard');
      } else {
        router.push('/home');
      }
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async function fetchUserProfile() {
    try {
      // Chama o endpoint que retorna os dados pessoais
      const { data } = await api.get('/colaboradores/meu-perfil');
      user.value = data;
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    roles.value = [];
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    
    router.push('/login');
  }

  return { 
    token, 
    user, 
    roles, 
    isAuthenticated, 
    isGestao, 
    isAdmin, 
    nomeCompleto,
    login, 
    logout, 
    fetchUserProfile 
  };
});