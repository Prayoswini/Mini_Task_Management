const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // Set public DNS servers to prevent Windows local DNS SRV ECONNREFUSED issues on MongoDB Atlas
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (dnsErr) {
      // Ignore if DNS override is not supported by environment
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`--> TIP: Make sure your current IP address is whitelisted in MongoDB Atlas (Network Access -> Add 0.0.0.0/0)`);
  }
};

module.exports = connectDB;
