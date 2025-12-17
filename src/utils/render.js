/**
 * Helper functions for rendering pages with common patterns
 */

/**
 * Creates a simple page render handler
 * @param {string} view - View path (e.g., 'pages/login')
 * @param {string} title - Page title
 * @param {object} extraData - Additional data to pass to the view
 * @returns {Function} Express route handler
 */
export const renderPage = (view, title, extraData = {}) => {
    return (req, res) => {
        res.render(view, {
            title,
            user: req.user || null,
            ...extraData,
        });
    };
};

/**
 * Creates a page render handler that includes route params
 * @param {string} view - View path
 * @param {string} title - Page title
 * @param {Function} dataFn - Function that receives req and returns extra data
 * @returns {Function} Express route handler
 */
export const renderPageWithParams = (view, title, dataFn) => {
    return (req, res) => {
        const extraData = dataFn ? dataFn(req) : {};
        res.render(view, {
            title,
            user: req.user || null,
            ...extraData,
        });
    };
};
