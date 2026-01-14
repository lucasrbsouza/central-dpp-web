// src/stores/auxiliares.ts
import { defineStore } from 'pinia';
import AuxiliaresService from '../services/AuxiliaresService';
import type { OptionDTO, TipoEventoAuxiliar } from '../types/auxiliares';

export const useAuxiliaresStore = defineStore('auxiliares', {
    state: () => ({
        cargosOptions: [] as OptionDTO[],
        escolaridadesOptions: [] as OptionDTO[],
        formacoesOptions: [] as OptionDTO[],
        tiposEventos: [] as TipoEventoAuxiliar[],
        carregado: false // Flag para evitar refetch desnecessário
    }),
    
    getters: {
        // Cria um mapa rápido { "Reunião": "#FF0000" } para O(1) de acesso na Agenda
        mapaCoresEventos: (state) => {
            const mapa: Record<string, string> = {};
            state.tiposEventos.forEach(t => {
                if(t.ativo) mapa[t.nome] = t.cor;
            });
            return mapa;
        }
    },

    actions: {
        async buscarDadosSeNecessario() {
            if (this.carregado) return; // Cache simples
            await this.forceRefresh();
        },

        async forceRefresh() {
            try {
                const [cargos, escolaridades, formacoes, tipos] = await Promise.all([
                    AuxiliaresService.getCargosDropdown(),
                    AuxiliaresService.getEscolaridadesDropdown(),
                    AuxiliaresService.getFormacoesDropdown(),
                    AuxiliaresService.getTiposEventosTodos()
                ]);

                this.cargosOptions = cargos;
                this.escolaridadesOptions = escolaridades;
                this.formacoesOptions = formacoes;
                this.tiposEventos = tipos;
                this.carregado = true;
            } catch (error) {
                console.error("Erro ao carregar auxiliares", error);
            }
        }
    }
});