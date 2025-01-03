import { CheckCircle, Calendar, Star } from "lucide-react";

const steps = [
  {
    title: "Match with the right cleaner",
    description: "We'll match you with experienced, vetted cleaners in your area.",
    icon: CheckCircle,
  },
  {
    title: "Schedule your clean",
    description: "Book and manage your cleaning schedule online with ease.",
    icon: Calendar,
  },
  {
    title: "Enjoy a spotless space",
    description: "Sit back and relax while we take care of your cleaning needs.",
    icon: Star,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-mint-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Book your cleaning service in three simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-mint-500" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-mint-200" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;