import { APP_CONFIG } from '../app/config.js';

/**
 * Extrai informações normalizadas (owner original, repositório e caminho limpo)
 * a partir do campo `path` do livro no catálogo.
 */
export function parseGithubBookPath(bookPath, repo = 'BibliotecaDev') {
    let originalOwner = null;
    let finalRepo = repo === 'LivrosDev' ? 'BibliotecaDev' : repo;
    let finalPath = bookPath || '';

    if (finalPath.includes('github.com')) {
        const urlMatch = finalPath.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (urlMatch) {
            originalOwner = urlMatch[1];
            finalRepo = urlMatch[2];
        }

        const parts = finalPath.split(/\/blob\/(?:main|master)\/|\/raw\/(?:main|master)\/|main\/|master\//);
        if (parts.length > 1) {
            finalPath = parts[parts.length - 1];
        }
    }

    // Evita dupla codificação (%2520)
    try {
        finalPath = decodeURIComponent(finalPath);
    } catch (e) {
        // Mantém caso já esteja decodificado
    }

    finalPath = finalPath.replace(/^\//, '');
    const encodedPath = encodeURI(finalPath);

    return {
        originalOwner,
        repo: finalRepo,
        cleanPath: finalPath,
        encodedPath
    };
}

/**
 * Constrói a URL principal do PDF no GitHub Raw (priorizando o fork oficial do projeto)
 */
export function buildRawGithubUrl(bookPath, repo = 'BibliotecaDev', ownerOverride = null) {
    const parsed = parseGithubBookPath(bookPath, repo);
    const owner = ownerOverride || APP_CONFIG.defaultOwner;
    return `https://raw.githubusercontent.com/${owner}/${parsed.repo}/${APP_CONFIG.defaultBranch}/${parsed.encodedPath}`;
}

/**
 * Retorna uma lista ordenada de URLs candidatas para carregar o PDF com resiliência
 * (tenta primeiro o repositório do projeto e, se houver 404, tenta o repositório de origem)
 */
export function buildCandidatePdfUrls(bookPath, source, repo = 'BibliotecaDev') {
    if (source === 'external_url' && !bookPath.includes('github.com')) {
        return [bookPath];
    }

    const parsed = parseGithubBookPath(bookPath, repo);
    const owners = new Set([APP_CONFIG.defaultOwner]);

    if (parsed.originalOwner) {
        owners.add(parsed.originalOwner);
    }

    APP_CONFIG.fallbackOwners.forEach(o => owners.add(o));

    return Array.from(owners).map(
        owner => `https://raw.githubusercontent.com/${owner}/${parsed.repo}/${APP_CONFIG.defaultBranch}/${parsed.encodedPath}`
    );
}
