### Intro
This website helps users build other drag and drop / less code websites .


### requirements
- docker
- nodejs
- unbuntu or similar os

### Usage
```
nodemon server.js 
```

### Database schema 
```
CREATE TABLE templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    container_name TEXT NOT NULL,
    port INTEGER NOT NULL,
    template_path TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```