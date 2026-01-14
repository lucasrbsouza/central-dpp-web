import api from './api';
import type { OptionDTO } from '../types/auxiliares';
import type { EquipeDTO } from '../types/equipe';

class EquipeService {
    
    async listar(page = 0, size = 10, sort = 'nome,ASC') {
         const { data } = await api.get('/equipes', {
            params: { page, size, sort }
        });
        return data;
    }

    async getEquipesDropdown() {
        const { data } = await api.get<OptionDTO[]>('/equipes/dropdown');
        return data;
    }

    async buscarPorId(id: number) {
        const { data } = await api.get<EquipeDTO>(`/equipes/${id}`);
        return data;
    }

    async criar(dados: Partial<EquipeDTO>) {
        return api.post('/equipes', dados);
    }

    async atualizar(id: number, dados: Partial<EquipeDTO>) {
        return api.put(`/equipes/${id}`, dados);
    }
}

export default new EquipeService();