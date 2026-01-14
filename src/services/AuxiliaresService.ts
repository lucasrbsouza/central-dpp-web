// src/services/AuxiliaresService.ts
import api from './api';
import type { 
    OptionDTO, 
    TipoEventoAuxiliar, 
    ItemAuxiliar, 
    PageResponse 
} from '../types/auxiliares'; 

class AuxiliaresService {
    
    // --- CARGOS ---
    async getCargosDropdown() {
        const { data } = await api.get<OptionDTO[]>('/cargos/dropdown');
        return data;
    }

    async listarCargos(page = 0, size = 10, termo = '') {
        const { data } = await api.get<PageResponse<ItemAuxiliar>>(`/cargos`, {
            params: { page, size, termo, sort: 'nome,ASC' }
        });
        return data;
    }

    async criarCargo(dados: Partial<ItemAuxiliar>) {
        return api.post('/cargos', dados);
    }

    async atualizarCargo(id: number, dados: Partial<ItemAuxiliar>) {
        return api.put(`/cargos/${id}`, dados);
    }

    async excluirCargo(id: number) {
        return api.delete(`/cargos/${id}`);
    }

    // --- ESCOLARIDADES ---
    async getEscolaridadesDropdown() {
        const { data } = await api.get<OptionDTO[]>('/escolaridades/dropdown');
        return data;
    }

    async listarEscolaridades(page = 0, size = 10, termo = '') {
        const { data } = await api.get<PageResponse<ItemAuxiliar>>(`/escolaridades`, {
            params: { page, size, termo, sort: 'nome,ASC' }
        });
        return data;
    }

    async criarEscolaridade(dados: Partial<ItemAuxiliar>) {
        return api.post('/escolaridades', dados);
    }

    async atualizarEscolaridade(id: number, dados: Partial<ItemAuxiliar>) {
        return api.put(`/escolaridades/${id}`, dados);
    }

    async excluirEscolaridade(id: number) {
        return api.delete(`/escolaridades/${id}`);
    }

    // --- FORMAÇÕES ---
    async getFormacoesDropdown() {
        const { data } = await api.get<OptionDTO[]>('/formacoes/dropdown');
        return data;
    }

    async listarFormacoes(page = 0, size = 10, termo = '') {
        const { data } = await api.get<PageResponse<ItemAuxiliar>>(`/formacoes`, {
            params: { page, size, termo, sort: 'nome,ASC' }
        });
        return data;
    }

    async criarFormacao(dados: Partial<ItemAuxiliar>) {
        return api.post('/formacoes', dados);
    }

    async atualizarFormacao(id: number, dados: Partial<ItemAuxiliar>) {
        return api.put(`/formacoes/${id}`, dados);
    }

    async excluirFormacao(id: number) {
        return api.delete(`/formacoes/${id}`);
    }

    // --- TIPOS DE EVENTOS ---
    // (Este já estava correto, pois usamos o 'todos' para popular o dropdown/mapa de cores)
    async getTiposEventosTodos() {
        const { data } = await api.get<TipoEventoAuxiliar[]>('/tipos-eventos/todos');
        return data;
    }

    async listarTiposEventos(page = 0, size = 10, termo = '') {
        const { data } = await api.get<PageResponse<TipoEventoAuxiliar>>(`/tipos-eventos`, {
            params: { page, size, termo, sort: 'nome,ASC' }
        });
        return data;
    }

    async criarTipoEvento(dados: Partial<TipoEventoAuxiliar>) {
        return api.post('/tipos-eventos', dados);
    }

    async atualizarTipoEvento(id: number, dados: Partial<TipoEventoAuxiliar>) {
        return api.put(`/tipos-eventos/${id}`, dados);
    }

    async excluirTipoEvento(id: number) {
        return api.delete(`/tipos-eventos/${id}`);
    }
}

export default new AuxiliaresService();