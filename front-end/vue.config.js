module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3333", // URL do seu backend NestJS
        changeOrigin: true,
      },
    },
  },
};
