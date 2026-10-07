import markdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';

export const ALIGN_CONTAINERS = [
    ['center', 'md-align-center'],
    ['right', 'md-align-right'],
    ['left', 'md-align-left'],
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

export function createMarkdownRenderer() {
    return addAlignContainers(markdownIt({ html: true }));
}
