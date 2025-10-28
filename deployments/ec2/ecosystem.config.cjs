module.exports = {
  apps: [
    {
      name: "tcc-api",
      script: "dist/app.mjs",
      instances: "1",
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    }
  ]
};