import mongoose from 'mongoose';
const swapRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mySlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  theirSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('SwapRequest', swapRequestSchema);
