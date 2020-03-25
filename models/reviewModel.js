const mongoose = require('mongoose');
const Tour = require('./tourModel');

const Schema = mongoose.Schema;
const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'You must write something to post a new review!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      ref: 'Tour',
      type: Schema.Types.ObjectId,
      required: [true, 'A review must refer to a specific tour.']
    },
    user: {
      ref: 'User',
      type: Schema.Types.ObjectId,
      required: [true, 'A review must belong to a specific user.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAvgRating = async function(tourId) {
  // static method. this points to the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0
    });
  }
};

reviewSchema.post('save', function() {
  // this points to current review. this.constructor is the model
  this.constructor.calcAvgRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAvgRating(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
