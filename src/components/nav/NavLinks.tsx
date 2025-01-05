import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NavLinks = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#services" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
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
    </>
  );
};