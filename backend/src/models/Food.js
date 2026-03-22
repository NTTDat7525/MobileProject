import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },

  description: {
    type: String,
    default: "",
    maxlength: 500
  },

  category: {
    type: String,
    enum: ['appetizer', 'soup', 'salad', 'main', 'dessert', 'beverage', 'wine', 'side'],
    required: true,
    index: true
  },

  cuisine: {
    type: String,
    enum: ['vietnamese', 'asian', 'european', 'fusion', 'vegetarian', 'vegan'],
    default: 'vietnamese'
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  discountPrice: {
    type: Number,
    default: null,
    min: 0
  },

  calories: {
    type: Number,
    default: null
  },

  protein: {
    type: Number,
    default: null
  },

  fat: {
    type: Number,
    default: null
  },

  carbs: {
    type: Number,
    default: null
  },

  allergens: {
    type: [String],
    enum: ['peanuts', 'tree nuts', 'milk', 'eggs', 'soy', 'wheat', 'fish', 'shellfish', 'sesame'],
    default: []
  },

  isVegetarian: {
    type: Boolean,
    default: false
  },

  isVegan: {
    type: Boolean,
    default: false
  },

  isGluten: {
    type: Boolean,
    default: false
  },

  image: {
    type: String,
    default: null
  },

  images: {
    type: [String],
    default: []
  },

  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },

  availableFrom: {
    type: String,
    default: null
  },

  availableUntil: {
    type: String,
    default: null
  },

  stockQuantity: {
    type: Number,
    default: null
  },

  lowStockThreshold: {
    type: Number,
    default: 10
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  ratingCount: {
    type: Number,
    default: 0
  },

  orderCount: {
    type: Number,
    default: 0
  },

  preparationTime: {
    type: Number,
    default: 15,
    min: 5
  },

  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },

  spiceLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  portions: {
    type: Number,
    default: 1
  },

  tags: {
    type: [String],
    default: []
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
    index: true
  }
}, {
  timestamps: true
});

foodSchema.index({ category: 1, isAvailable: 1 });
foodSchema.index({ cuisine: 1 });
foodSchema.index({ rating: -1 });
foodSchema.index({ price: 1 });
foodSchema.index({ name: 'text', description: 'text' });
foodSchema.index({ tags: 1 });
foodSchema.index({ createdAt: -1 });

const Food = mongoose.model("Food", foodSchema);

export default Food;