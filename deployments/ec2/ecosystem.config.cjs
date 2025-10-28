module.exports = {
  apps: [
    {
      name: "tcc-api",
      script: "dist/app.mjs",
      exec_mode: "cluster",
      instances: "max", 
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    }
  ]
};