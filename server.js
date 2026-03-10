// Create your Express server that queries the database here
const express = require('express');
const { Track } = require('./database/setup.js');
const app = express();
const PORT = process.env.PORT || 3000;

async function verifyDatabaseConnection() {
    try {
        await Track.sequelize.authenticate();
        console.log('Connection to database established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
// Call the function to verify the database connection when the server starts
verifyDatabaseConnection();

//Get all tracks using .findAll() 
app.get('/api/tracks', async (req, res) => {
    try {
        const tracks = await Track.findAll();
        res.json(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/tracks/:id - Retrieve a single track based on the id provided
app.get('/api/tracks/:id', async (req, res) => {
    try {
        const track = await Track.findByPk(req.params.id);
        if (track) {
            res.json(track);
        } else {
            res.status(404).json({ error: 'Track not found' });
        }
    } catch (error) {
        console.error('Error fetching track:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/tracks - Create a new track using the .create() method. Include input 
// validation to ensure required fields are provided.
app.post('/api/tracks', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['songTitle', 'artistName', 'albumName', 'genre', 'duration'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }
        
        const track = await Track.create(req.body);
        res.status(201).json(track);
    } catch (error) {
        console.error('Error creating track:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/tracks/:id - Update an existing track based on the id provided
app.put('/api/tracks/:id', async (req, res) => {
    try {
        const track = await Track.findByPk(req.params.id);
        if (track) {
            await track.update(req.body);
            res.json(track);
        } else {
            res.status(404).json({ error: 'Track not found' });
        }
    } catch (error) {
        console.error('Error updating track:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/tracks/:id - Delete a track based on the id provided
app.delete('/api/tracks/:id', async (req, res) => {
    try {
        const track = await Track.findByPk(req.params.id);
        if (track) {
            await track.destroy();
            res.json({ message: 'Track deleted successfully' });
        } else {
            res.status(404).json({ error: 'Track not found' });
        }
    } catch (error) {
        console.error('Error deleting track:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});