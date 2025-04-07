import mongoose from 'mongoose';

const mistakeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Question'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Mistake = mongoose.models.Mistake || mongoose.model('Mistake', mistakeSchema);
export default Mistake; 