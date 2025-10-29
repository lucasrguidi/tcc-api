module.exports = {
  apps: [
    {
      name: "tcc-api",
      script: "dist/app.mjs",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    }
  ]
};