import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#services" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="bg-white fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-mint-500 text-2xl font-bold">mint</span>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-mint-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600"
              onClick={() => navigate("/recruit/apply")}
            >
              Professionals
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600"
              onClick={() => navigate("/auth/login")}
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button className="bg-mint-500 hover:bg-mint-600 text-white">
              Get a Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mint-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-mint-500 block px-3 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col space-y-2 px-3 py-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 justify-start"
                onClick={() => {
                  navigate("/recruit/apply");
                  setIsOpen(false);
                }}
              >
                Professionals
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 justify-start"
                onClick={() => {
                  navigate("/auth/login");
                  setIsOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button className="bg-mint-500 hover:bg-mint-600 text-white">
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;