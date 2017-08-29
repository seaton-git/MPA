
const cssAndJsContext = require.context('../src', true, /\.(js|css|scss)$/i);

cssAndJsContext.keys().forEach((key) => {
    cssAndJsContext(key);
});

if (NODE_ENV === 'dev') {
    const htmlContext = require.context('../src', true, /\.html$/i);
    htmlContext.keys().forEach((key) => {
        htmlContext(key);
    });
}
