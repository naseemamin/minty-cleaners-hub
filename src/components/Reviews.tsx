import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Thompson",
    review: "Excellent service! The cleaners are professional, thorough, and always on time.",
    rating: 5,
  },
  {
    name: "James Wilson",
    review: "Very reliable and consistent cleaning service. Highly recommended!",
    rating: 5,
  },
  {
    name: "Emma Davis",
    review: "Great attention to detail and fantastic customer service.",
    rating: 5,
  },
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <p className="text-xl text-gray-600">
            See what our customers have to say about our services
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{review.review}</p>
              <p className="font-semibold text-gray-900">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;