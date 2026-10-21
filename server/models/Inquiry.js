import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    interest: {
      type: String,
      required: true,
      enum: ['fingerlings', 'services', 'partnership', 'training', 'other'],
    },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
