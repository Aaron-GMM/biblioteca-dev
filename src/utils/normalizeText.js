export function normalizeText(text) {
    if (!text) return '';
    return text
        .normalize('NFD') // Separa os acentos das letras
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
        .toLowerCase();
}