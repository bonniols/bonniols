(function () {
    // Keep container names/classes in sync with lib/markdown-setup.js
    var ALIGN_CONTAINERS = [
        ['center', 'md-align-center'],
        ['right', 'md-align-right'],
        ['left', 'md-align-left'],
        ['narrow', 'md-narrow'],
        ['small', 'md-small'],
    ];

    function addAlignContainers(md) {
        for (var i = 0; i < ALIGN_CONTAINERS.length; i++) {
            (function (name, className) {
                md.use(window.markdownitContainer, name, {
                    render: function (tokens, idx) {
                        return tokens[idx].nesting === 1
                            ? '<div class="' + className + '">\n'
                            : '</div>\n';
                    },
                });
            })(ALIGN_CONTAINERS[i][0], ALIGN_CONTAINERS[i][1]);
        }

        return md;
    }

    // Keep in sync with addExternalLinkTargets in lib/markdown-setup.js
    function addExternalLinkTargets(md) {
        var defaultRender =
            md.renderer.rules.link_open ||
            function (tokens, idx, options, env, self) {
                return self.renderToken(tokens, idx, options);
            };

        md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
            var token = tokens[idx];
            if ((token.attrGet('href') || '').indexOf('://') !== -1) {
                token.attrSet('target', '_blank');
                token.attrSet('rel', 'noopener noreferrer');
            }
            return defaultRender(tokens, idx, options, env, self);
        };

        return md;
    }

    window.createCmsMarkdownRenderer = function () {
        return addExternalLinkTargets(addAlignContainers(window.markdownit({ html: true })));
    };
})();
