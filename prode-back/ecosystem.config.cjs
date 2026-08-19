// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "api",
      script: "./src/index.js",
      instances: 1, // opcional, puede ser solo 1 si no necesitas escalamiento HTTP
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "calculate-worker",
      script: "./src/workers/calculatePoints.worker.js",
      instances: 1, // 🔥 acá el escalamiento real del procesamiento
      exec_mode: "fork", // ⬅️ asegurate de usar "fork" si no estás usando cluster/thread
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
