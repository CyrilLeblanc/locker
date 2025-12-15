import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  locker: { type: mongoose.Schema.Types.ObjectId, ref: 'Locker', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' }
}, {
  timestamps: true
});

// Find all reservations for a user
reservationSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).populate('locker');
};

// Find active reservation for a locker
reservationSchema.statics.findActiveByLocker = function(lockerId) {
  return this.findOne({ locker: lockerId, status: 'active' });
};

// Find expired reservations that need to be processed
reservationSchema.statics.findExpired = function() {
  return this.find({ 
    status: 'active', 
    endDate: { $lt: new Date() } 
  }).populate('locker').populate('user');
};

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
