const express = require('express');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// SQLite Database Connection
const db = new sqlite3.Database('database.db');

// API to Start a New Container
app.post('/start-container', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    // Generate a random port for the container
    const port = 8080 + Math.floor(Math.random() * 1000);
    // const port = 8112; 
    const containerName = `vvvebjs_${username}`;
    const templatePath = `/websites/${username}`;

    // Run the shell script to create the container
    exec(`./start_container.sh ${username} ${port}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Failed to start container');
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send('Error occurred while starting container');
        }

        // Save template info to the database
        db.run(
            `INSERT INTO templates (username, container_name, port, template_path) VALUES (?, ?, ?, ?)`,
            [username, containerName, port, templatePath],
            function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Failed to save template data');
                }
                res.send(`Container started at http://localhost:${port}`);
            }
        );
    });
});

// API to List All Templates
app.get('/templates', (req, res) => {
    db.all(`SELECT * FROM templates ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to retrieve templates');
        }
        res.json(rows);
    });
});

// API to Delete a Container
app.delete('/delete-container/:id', (req, res) => {
    const { id } = req.params;

    // Get container info from the database
    db.get(`SELECT * FROM templates WHERE id = ?`, [id], (err, template) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to retrieve container info');
        }

        if (!template) {
            return res.status(404).send('Container not found');
        }

        const { container_name } = template;

        // Stop and remove the container using the shell script
        exec(`./stop_container.sh ${container_name}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).send('Failed to delete container');
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res.status(500).send('Error occurred while deleting container');
            }

            // Remove the record from the database
            db.run(`DELETE FROM templates WHERE id = ?`, [id], function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Failed to remove template data');
                }
                res.send('Container deleted successfully');
            });
        });
    });
});

// Server Setup
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
