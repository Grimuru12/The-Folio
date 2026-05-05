// Test MongoDB connection (no seeding, just connection test)
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    console.log('Testing MongoDB connection...');
    console.log('Connection URI:', process.env.MONGO_URI);
    
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ SUCCESS! Connected to MongoDB');
        console.log('Database:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('❌ CONNECTION FAILED');
        console.error('Error:', error.message);
        
        if (error.message.includes('authentication failed')) {
            console.error('\nFix: Check your MongoDB Atlas database user credentials');
            console.error('1. Go to https://cloud.mongodb.com');
            console.error('2. Click "Database Access"');
            console.error('3. Verify user "Grimuru12" exists');
            console.error('4. Password should be "Grimuru15"');
        }
        
        if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
            console.error('\nFix: Check your MongoDB Atlas IP whitelist');
            console.error('1. Go to https://cloud.mongodb.com');
            console.error('2. Click "Network Access"');
            console.error('3. Add IP address: 0.0.0.0/0 (allow anywhere)');
        }
        
        process.exit(1);
    }
};

testConnection();