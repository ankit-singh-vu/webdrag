CREATE TABLE templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    container_name TEXT NOT NULL,
    port INTEGER NOT NULL,
    template_path TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


nodemon server.js 
