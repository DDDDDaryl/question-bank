import mongoose from 'mongoose';

const mistakeSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Mistake = mongoose.models.Mistake || mongoose.model('Mistake', mistakeSchema);

export default Mistake; 