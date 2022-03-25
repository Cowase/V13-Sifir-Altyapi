module.exports = {
    apps: [
      {
        name: "Menü Sistemi",
        namespace: "SEHIRA",
        script: 'main.sehira',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Bots/Menu"
      }
    ]
  };