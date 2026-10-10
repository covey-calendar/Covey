import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendPort = env.PORT || '3000';

  return {
    plugins: [
      {
        name: 'covey-server-mode',
        transformIndexHtml(html) {
          return html.replace(
            '<!--SERVER-->',
            '<script>window.GAGGLE_SERVER = true</script>',
          );
        },
      },
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': `http://127.0.0.1:${backendPort}`,
      },
    },
  };
});
