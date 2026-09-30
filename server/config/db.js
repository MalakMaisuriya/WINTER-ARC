const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/winterarc';
    console.log(`Connecting to MongoDB at: ${connUri}`);
    
    // Set connection timeout short to fallback quickly if local mongo isn't up
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ Could not connect to local MongoDB (${err.message}). Starting MongoMemoryServer...`);
    try {
      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'winterarc'
        }
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`✅ Connected to MongoDB Memory Server: ${mongoUri}`);
    } catch (fallbackErr) {
      console.error(`❌ MongoDB Connection Error: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
