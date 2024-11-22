const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier JSON contenant les données des clients
const dataPath = path.join(__dirname, 'data', 'clients.json');

// Fonction utilitaire pour lire les données JSON
const readData = (callback) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture des données', err);
            callback(err, null);
        } else {
            callback(null, JSON.parse(data));
        }
    });
};

// Fonction utilitaire pour écrire les données JSON
const writeData = (data, callback) => {
    fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Erreur lors de l’écriture des données', err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

// Endpoint : Liste des clients
router.get('/clients', (req, res) => {
    readData((err, data) => {
        if (err) return res.status(500).send({ error: 'Erreur serveur' });
        res.send(data);
    });
});

// Endpoint : Détails d’un client
router.get('/clients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    readData((err, clients) => {
        if (err) return res.status(500).send({ error: 'Erreur serveur' });
        const client = clients.find(c => c.id === id);
        if (!client) return res.status(404).send({ error: 'Client introuvable' });
        res.send(client);
    });
});

// Endpoint : Modifier un client
router.put('/clients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    readData((err, clients) => {
        if (err) return res.status(500).send({ error: 'Erreur serveur' });

        const clientIndex = clients.findIndex(c => c.id === id);
        if (clientIndex === -1) {
            return res.status(404).send({ error: 'Client introuvable' });
        }

        // Mise à jour des données du client
        clients[clientIndex] = {
            ...clients[clientIndex],
            ...updatedData
        };

        writeData(clients, (err) => {
            if (err) return res.status(500).send({ error: 'Erreur lors de l’enregistrement des données' });
            res.send(clients[clientIndex]);
        });
    });
});

// Endpoint : Ajouter un nouveau client (si besoin)
router.post('/clients', (req, res) => {
    const newClient = req.body;

    readData((err, clients) => {
        if (err) return res.status(500).send({ error: 'Erreur serveur' });

        // Déterminer un nouvel ID unique
        const newId = clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1;
        newClient.id = newId;

        clients.push(newClient);

        writeData(clients, (err) => {
            if (err) return res.status(500).send({ error: 'Erreur lors de l’enregistrement des données' });
            res.status(201).send(newClient);
        });
    });
});

module.exports = router;
