import markdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';

export const ALIGN_CONTAINERS = [
    ['center', 'md-align-center'],
    ['right', 'md-align-right'],
    ['left', 'md-align-left'],
    ['narrow', 'md-narrow'],
    ['small', 'md-small'],
];

export function addAlignContainers(md) {
    for (const [name, className] of ALIGN_CONTAINERS) {
        md.use(markdownItContainer, name, {
            render(tokens, idx) {
                return tokens[idx].nesting === 1
                    ? `<div class="${className}">\n`
                    : '</div>\n';
            },
        });
    }

    return md;
}

// Same rule as partials/nav-item.liquid: URLs containing '://' open in a new tab
export function addExternalLinkTargets(md) {
    const defaultRender =
        md.renderer.rules.link_open ||
        ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        if ((token.attrGet('href') || '').includes('://')) {
            token.attrSet('target', '_blank');
            token.attrSet('rel', 'noopener noreferrer');
        }
        return defaultRender(tokens, idx, options, env, self);
    };

    return md;
}

export function createMarkdownRenderer() {
    return addExternalLinkTargets(addAlignContainers(markdownIt({ html: true })));
}
