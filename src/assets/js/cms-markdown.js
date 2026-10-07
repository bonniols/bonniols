(function () {
    // Keep container names/classes in sync with lib/markdown-setup.js
    var ALIGN_CONTAINERS = [
        ['center', 'md-align-center'],
        ['right', 'md-align-right'],
        ['left', 'md-align-left'],
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

    window.createCmsMarkdownRenderer = function () {
        return addAlignContainers(window.markdownit({ html: true }));
    };
})();
