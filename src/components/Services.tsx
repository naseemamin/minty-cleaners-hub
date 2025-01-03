import { Home, Building2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Home Cleaning",
    description: "Regular cleaning services for your home, tailored to your needs and schedule.",
    icon: Home,
  },
  {
    title: "One-Off Cleaning",
    description: "Deep cleaning services for those special occasions or when you need a fresh start.",
    icon: Sparkles,
  },
  {
    title: "Commercial Cleaning",
    description: "Professional cleaning services for offices, shops, and commercial spaces.",
    icon: Building2,
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">
            Professional cleaning services tailored to your needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-mint-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-mint-500" />
                </div>
                <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;