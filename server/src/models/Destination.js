import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    history: {
      type: String,
      trim: true,
      default: '',
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: 'Haryana',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Heritage & Forts',
        'Nature & Hills',
        'Lakes & Wetlands',
        'Spiritual & Pilgrimage',
        'Archaeological Sites',
        'Rural & Agro-Tourism',
        'Wildlife & Parks',
      ],
      index: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          default: '',
        },
        caption: {
          type: String,
          default: '',
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },
    entryFee: {
      isFree: {
        type: Boolean,
        default: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: 'INR',
      },
      details: {
        type: String,
        default: 'Free entry for all visitors',
      },
    },
    visitingHours: {
      openTime: {
        type: String,
        default: '09:00 AM',
      },
      closeTime: {
        type: String,
        default: '06:00 PM',
      },
      days: {
        type: String,
        default: 'Open all days',
      },
      bestTimeToVisit: {
        type: String,
        default: 'October to March',
      },
      notes: {
        type: String,
        default: '',
      },
    },
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    visitorTips: [
      {
        type: String,
        trim: true,
      },
    ],
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending', 'rejected'],
      default: 'verified',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isHiddenGem: {
      type: Boolean,
      default: false,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name if not provided
destinationSchema.pre('validate', function (next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Text index for search across name, description, district, and history
destinationSchema.index({
  name: 'text',
  description: 'text',
  district: 'text',
  history: 'text',
});

export const Destination = mongoose.model('Destination', destinationSchema);

