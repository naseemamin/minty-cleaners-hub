import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative bg-mint-50 pt-24 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Professional Cleaning Services in London
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Brilliant local cleans, all managed online. Book trusted cleaners for your home or business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-mint-500 hover:bg-mint-600 text-white text-lg px-8 py-6">
                Get a Quote
              </Button>
              <Button variant="outline" className="text-mint-500 border-mint-500 hover:bg-mint-50 text-lg px-8 py-6">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 w-1/2 bg-mint-100 opacity-20 transform skew-x-12" />
    </div>
  );
};

export default Hero;