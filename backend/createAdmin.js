// Create Admin User Script (works without DB connection)
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const adminData = {
    name: 'TheFolio Admin',
    email: 'admin@thefolio.com',
    password: 'Admin@1234',
    role: 'admin',
    status: 'active',
    bio: 'Blog administrator',
    profilePic: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Hash the password
  const saltRounds = 12;
  adminData.password = await bcrypt.hash(adminData.password, saltRounds);

  console.log('Admin user data (ready to insert into MongoDB):');
  console.log('=====================================');
  console.log(JSON.stringify(adminData, null, 2));
  console.log('=====================================');
  console.log('\nTo insert this into MongoDB:');
  console.log('1. Connect to your MongoDB database');
  console.log('2. Use the database you specified in MONGO_URI');
  console.log('3. Insert this document into the "users" collection');
  console.log('\nLogin credentials:');
  console.log('Email: admin@thefolio.com');
  console.log('Password: Admin@1234');
}

createAdminUser().catch(console.error);