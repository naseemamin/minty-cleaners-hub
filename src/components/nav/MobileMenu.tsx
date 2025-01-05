import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthButtons } from "./AuthButtons";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#services" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-gray-600 hover:text-mint-500 block px-3 py-2 text-base font-medium"
            onClick={() => onClose()}
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
              onClose();
            }}
          >
            Professionals
          </Button>
          <AuthButtons />
          <Button 
            className="bg-mint-500 hover:bg-mint-600 text-white"
            onClick={() => {
              navigate("/signup/quote");
              onClose();
            }}
          >
            Get a Quote
          </Button>
        </div>
      </div>
    </div>
  );
};