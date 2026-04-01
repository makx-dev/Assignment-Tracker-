const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNo: { type: Number, required: true },
  division: { type: String, enum: ['I1', 'I2', 'I3'], required: true },
  password: { 
    type: String, 
    default: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uAFiXCAvO' // bcrypt hash of "password123"
  }
});

// Optional: Add method to compare passwords (if you plan to log students in)
studentSchema.methods.matchPassword = async function(enteredPassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);