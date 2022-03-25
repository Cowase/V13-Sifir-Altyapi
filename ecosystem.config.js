module.exports = {
    apps: [
      {
        name: "Moderation Sistemi",
        namespace: "SEHIRA",
        script: 'main.sehira',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Bots/Moderation"
      }
    ]
  };
