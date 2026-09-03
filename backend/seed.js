const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const User = require('./models/User');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
  try {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (dnsErr) {
      // Ignore if DNS override is not supported
    }

    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_MONGODB_ATLAS_URI_HERE')) {
      console.error('Error: Please update MONGODB_URI in .env with your actual MongoDB Atlas connection string before running seed!');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Task.deleteMany();
    console.log('Cleared existing User and Task collections...');

    // 1 Single Admin User
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: 'password123',
      role: 'admin'
    });

    // 5 Regular Users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'password123',
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Sophia Brown',
      email: 'sophia@gmail.com',
      password: 'password123',
      role: 'user'
    });

    const user3 = await User.create({
      name: 'Jane Smith',
      email: 'jane@gmail.com',
      password: 'password123',
      role: 'user'
    });

    const user4 = await User.create({
      name: 'Robert Johnson',
      email: 'robert@gmail.com',
      password: 'password123',
      role: 'user'
    });

    const user5 = await User.create({
      name: 'Emily Davis',
      email: 'emily@gmail.com',
      password: 'password123',
      role: 'user'
    });

    console.log('Created Default Admin & 5 User Accounts:');
    console.log('--------------------------------------------------');
    console.log('ADMIN  -> Email: admin@gmail.com  | Password: password123');
    console.log('USER 1 -> Email: john@gmail.com   | Password: password123');
    console.log('USER 2 -> Email: sophia@gmail.com  | Password: password123');
    console.log('USER 3 -> Email: jane@gmail.com   | Password: password123');
    console.log('USER 4 -> Email: robert@gmail.com | Password: password123');
    console.log('USER 5 -> Email: emily@gmail.com  | Password: password123');
    console.log('--------------------------------------------------');

    // Create multiple sample tasks for each user
    const tasks = [
      // Admin Tasks
      {
        title: 'Review System Requirements',
        description: 'Analyze PDF assignment guidelines and verify MVC architecture compliance.',
        status: 'Completed',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 2),
        createdBy: user4._id
      },
      {
        title: 'Perform System Security Audit',
        description: 'Audit JWT expiration handling and CORS origin policies across environment settings.',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 6),
        createdBy: user2._id
      },

      // John Doe (User 1) Tasks
      {
        title: 'Configure MongoDB Atlas Database',
        description: 'Set up database cluster, user access, and configure MONGODB_URI connection string.',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 1),
        createdBy: user1._id
      },
      {
        title: 'Setup API Rate Limiting',
        description: 'Configure express-rate-limit middleware to prevent request abuse.',
        status: 'Pending',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 4),
        createdBy: user1._id
      },
      {
        title: 'Refactor Controller Modules',
        description: 'Clean up redundant error catch blocks and standardise JSON response formatting.',
        status: 'Completed',
        priority: 'Low',
        dueDate: new Date(Date.now() + 86400000 * 3),
        createdBy: user1._id
      },

      // Agnik Patra (User 2) Tasks
      {
        title: 'Implement Task CRUD Operations',
        description: 'Develop endpoints for creating, updating, listing, and deleting tasks.',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 3),
        createdBy: user2._id
      },
      {
        title: 'Create Unit Tests for Auth Middleware',
        description: 'Write Jest / Supertest specs for valid, missing, and expired Bearer tokens.',
        status: 'Pending',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 5),
        createdBy: user2._id
      },
      {
        title: 'Optimize Mongoose Query Indexes',
        description: 'Add Compound indexes on createdBy and status fields for fast querying.',
        status: 'Completed',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 2),
        createdBy: user2._id
      },

      // Jane Smith (User 3) Tasks
      {
        title: 'Design Dashboard UI Layout',
        description: 'Create modern responsive layout with statistics cards and search filters.',
        status: 'Pending',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 4),
        createdBy: user3._id
      },
      {
        title: 'Build Filter Component for Tasks',
        description: 'Develop frontend dropdown selectors for filtering by Status and Priority.',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 5),
        createdBy: user3._id
      },

      // Robert Johnson (User 4) Tasks
      {
        title: 'Setup JWT Middleware Authentication',
        description: 'Implement token verification middleware for securing protected routes.',
        status: 'Completed',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 2),
        createdBy: user4._id
      },
      {
        title: 'Integrate Password Hashing with Bcrypt',
        description: 'Apply pre-save mongoose hook for password hashing before database write.',
        status: 'Completed',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 1),
        createdBy: user4._id
      },

      // Emily Davis (User 5) Tasks
      {
        title: 'Prepare Project Documentation',
        description: 'Draft comprehensive README.md with API reference and environment variable setup instructions.',
        status: 'Pending',
        priority: 'Low',
        dueDate: new Date(Date.now() + 86400000 * 5),
        createdBy: user5._id
      },
      {
        title: 'Create API Collection Export for Postman',
        description: 'Export structured Postman v2.1 collection with pre-configured headers and JWT auth.',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 3),
        createdBy: user5._id
      }
    ];

    await Task.insertMany(tasks);
    console.log(`Successfully seeded ${tasks.length} initial tasks!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
