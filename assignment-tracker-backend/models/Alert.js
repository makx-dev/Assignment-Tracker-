const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['assignment', 'exam', 'class', 'event', 'announcement'], 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  dueDate: { 
    type: Date 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher', 
    required: true 
  },
  targetStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student' 
  }],
  seenBy: [{
    studentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Student' 
    },
    seenAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  submittedBy: [{
    studentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Student' 
    },
    submittedAt: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, {
  timestamps: true // Automatically manages createdAt and updatedAt fields
});

module.exports = mongoose.model('Alert', alertSchema);