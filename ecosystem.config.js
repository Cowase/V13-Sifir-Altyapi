module.exports = {
    apps: [
      {
        name: "Menü Sistemi",
        namespace: "COWASE",
        script: 'main.sehira',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Bots/Menu"
      }
    ]
  };