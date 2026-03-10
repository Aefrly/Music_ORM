//Creating database and models
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const db = new Sequelize({
  dialect: "sqlite",
  storage: `database/${process.env.DB_NAME}` || 'database/music_library.db',
  logging: console.log // Enable logging to see SQL queries
});

// Define the Track model
const Track = db.define('Track', {
    trackId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    songTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artistName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    albumName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        comment: 'Duration of the track in seconds'
    },
    releaseYear: {
        type: DataTypes.INTEGER
    }
});

// Function to set up the database and create the Track table
async function setupDatabase() { 
    try { 
        await db.authenticate(); 
        console.log('Connection to database established successfully.'); 

        await db.sync({ force: true })
        console.log('Database file created at:',`database/${process.env.DB_NAME}`); 

        await db.close(); 
    } catch (error) { 
         console.error('Unable to connect to the database:', error); 
    } 
}

module.exports = { Track, db };

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}