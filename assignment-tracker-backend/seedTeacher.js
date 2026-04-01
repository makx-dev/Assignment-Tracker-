const mongoose = require('mongoose');
const Teacher = require('./models/Teacher');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); 
    await Teacher.deleteMany({});

    const teacher = await Teacher.create({
      name: 'Prof. Shubhum Kewate',
      username: 'Class teacher',
      password: 'teach123',
    });

    console.log('Teacher created successfully:', teacher);
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed().catch(console.error);