import api from './api';
import type { OptionDTO } from '../types/auxiliares';
import type { ColaboradorAdminForm, ColaboradorRespostaDTO } from '../types/colaborador';

class ColaboradorService {
    
    // Listagem paginada (usada na ListView)
    async listar(page = 0, size = 10, termo = '', equipeId?: number) {
        const { data } = await api.get('/colaboradores', {
            params: { page, size, termo, equipeId, sort: 'nome,ASC' }
        });
        return data;
    }

    // Busca detalhada (usada no FormView)
    async buscarPorId(id: number) {
        const { data } = await api.get<ColaboradorRespostaDTO>(`/colaboradores/${id}`);
        return data;
    }

    // Criar (usada no FormView)
    async criar(dados: ColaboradorAdminForm) {
        return api.post('/colaboradores', dados);
    }

    // Atualizar (usada no FormView)
    async atualizar(id: number, dados: ColaboradorAdminForm) {
        return api.put(`/colaboradores/${id}`, dados);
    }

    // Dropdown (usado em Eventos e outros formulários)
    async getColaboradoresDropdown() {
        const { data } = await api.get<OptionDTO[]>('/colaboradores/dropdown');
        return data;
    }

    // Métodos de Perfil do Usuário Logado
    async buscarMeuPerfil() {
        return api.get('/colaboradores/meu-perfil');
    }

    async atualizarMeuPerfil(dados: any) {
        return api.put('/colaboradores/meu-perfil', dados);
    }
    
    // Foto
    async uploadFoto(id: number, file: File) {
        const formData = new FormData();
        formData.append('arquivo', file);
        return api.post(`/colaboradores/${id}/foto`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
}

export default new ColaboradorService();