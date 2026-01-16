<template>
    <footer class="bg-[#003B73] text-white font-sans text-sm relative">

        <div class="w-full h-1.5 flag-strip"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

                <div class="flex flex-col items-start space-y-2">
                    <img src="https://www.sead.pi.gov.br/wp-content/uploads/2023/10/logo-rodape.png"
                        alt="Governo do Piauí" class="h-10 w-auto object-contain brightness-0 invert" />
                    <div class="flex flex-col">
                        <h2 class="font-bold text-base leading-tight">Diretoria de Pagamento de Pessoal</h2>
                        <span class="text-xs font-light opacity-80">Secretaria de Administração do Piauí - SEAD</span>
                    </div>
                </div>

                <div>
                    <h3
                        class="font-bold text-sm mb-3 uppercase tracking-wider border-b border-blue-400/30 pb-1 inline-block">
                        Governo</h3>
                    <ul class="space-y-1 text-blue-100">
                        <li><a href="https://www.pi.gov.br/governador" target="_blank" class="footer-link">Governador</a></li>
                        <li><a href="https://www.pi.gov.br/vice-governador" target="_blank" class="footer-link">Vice-Governador</a></li>
                        <li><a href="https://www.pi.gov.br/agenda" target="_blank" class="footer-link">Agenda do governador</a></li>
                        <li><a href="https://www.pi.gov.br/orgaos" target="_blank" class="footer-link">Órgãos</a></li>
                        <li><a href="https://www.pi.gov.br/simbolos-do-governo" target="_blank" class="footer-link">Símbolos do
                                governo</a></li>
                    </ul>
                </div>

                <div>
                    <h3
                        class="font-bold text-sm mb-3 uppercase tracking-wider border-b border-blue-400/30 pb-1 inline-block">
                        Acesso à informação</h3>
                    <ul class="space-y-1 text-blue-100">
                        <li><a href="http://www.sead.pi.gov.br/transparencia" target="_blank" class="footer-link">Área da
                                transparência</a></li>
                        <li><a href="https://falabr.cgu.gov.br/login/PI" target="_blank" class="footer-link">Pedido de acesso à
                                informação</a></li>
                        <li><a href="https://portal.pi.gov.br/segov/ouvidoria/" target="_blank" class="footer-link">Fale Conosco</a>
                        </li>
                        <li><a href="https://portal.pi.gov.br/cge/lei-de-acesso-a-informacao-lai/" target="_blank"
                                class="footer-link">Lei de acesso à informação</a></li>
                    </ul>
                </div>

                <div>
                    <h3
                        class="font-bold text-sm mb-3 uppercase tracking-wider border-b border-blue-400/30 pb-1 inline-block">
                        Acesso rápido</h3>
                    <ul class="space-y-1 text-blue-100">
                        <li><a href="https://pidigital.pi.gov.br/" target="_blank" class="footer-link">Contracheque Online</a></li>
                        <li><a href="https://www.diario.pi.gov.br/doe/" target="_blank" class="footer-link">Diário Oficial</a></li>
                        <li><a href="https://www.sead.pi.gov.br/" target="_blank" class="footer-link">SEAD</a></li>
                        <li><a href="https://www.pi.gov.br/tabela-de-pagamento" target="_blank" class="footer-link">Calendário de
                                pagamento</a></li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-blue-400/20 my-4"></div>

            <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm">

                <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 opacity-90">
                    <div class="flex items-center gap-2">
                        <div class="bg-blue-800/40 p-1.5 rounded-full">
                            <PhPhone class="w-4 h-4 fill-white" />

                        </div>
                        <span>(86) 9 9520-1821</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <div class="bg-blue-800/40 p-1.5 rounded-full">
                            <PhEnvelope class="w-4 h-4 fill-white" />
                        </div>
                        <a href="mailto:Sead@sead.pi.gov.br" class="hover:underline">Sead@sead.pi.gov.br</a>
                    </div>
                </div>

                <div class="flex gap-4">
                    <a href="https://www.facebook.com/governodopiaui" target="_blank" class="social-icon">
                        <PhFacebookLogo class="w-5 h-5 fill-current" />
                    </a>
                    <a href="https://instagram.com/suparcpi" target="_blank" class="social-icon">
                        <PhInstagramLogo class="w-5 h-5 fill-current" />
                    </a>
                    <a href="#" target="_blank" class="social-icon">
                        <PhLinkedinLogo class="w-5 h-5 fill-current" />
                    </a>
                </div>
            </div>

            <div class=" border-blue-400/20 pt-4 text-center">
                <p class="text-[10px] text-blue-200/60 font-light">
                    &copy; {{ currentYear }} Direitos reservados a Diretoria de Pagamento de Pessoal - Sead/PI.
                </p>
            </div>

        </div>
    </footer>
</template>

<script setup>
import { PhEnvelope, PhFacebookLogo, PhInstagramLogo, PhLinkedinLogo, PhPhone } from '@phosphor-icons/vue';

const currentYear = new Date().getFullYear()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');

footer {
    font-family: 'Open Sans', sans-serif;
}

/* Bandeira Compacta:
  Mesma lógica de cores, mas com 'h-1.5' no HTML fica bem mais sutil.
*/
.flag-strip {
    background: linear-gradient(90deg,
            #003B73 0%, #003B73 20%,
            #FECB00 20%, #FECB00 50%,
            #EC1C24 50%, #EC1C24 75%,
            #009640 75%, #009640 100%);
}

.footer-link {
    /* Reduzi o padding vertical para (py-0) para compactar a lista */
    @apply text-blue-100 hover:text-white hover:underline transition-colors duration-200 block py-0 text-xs sm:text-sm;
}

.social-icon {
    @apply text-white hover:text-[#FECB00] hover:scale-110 transition-transform duration-200;
}
</style>