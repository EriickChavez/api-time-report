module.exports = {
  apps: [
    {
      name: "api-time-report",
      script: "./dist/index.js",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
