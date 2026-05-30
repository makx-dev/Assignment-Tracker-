const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  alert: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Alert', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['unread', 'read', 'submitted'], 
    default: 'unread',
    required: true
  },
  readAt: { 
    type: Date 
  },
  submittedAt: { 
    type: Date 
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt fields
});

module.exports = mongoose.model('Notification', notificationSchema);