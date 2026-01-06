import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        homepage: resolve(__dirname, 'homepage.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        admin: resolve(__dirname, 'admin.html'),
        content: resolve(__dirname, 'content.html'),
        suche: resolve(__dirname, 'suche.html'),
        teacher: resolve(__dirname, 'teacher.html'),
      },
    },
  },
  server: {
    open: '/homepage.html'
  }
});
