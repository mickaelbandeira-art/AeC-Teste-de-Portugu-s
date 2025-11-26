import { Button } from "@/components/ui/button";
import { Menu, X, Shield, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoAeC from "@/assets/logo-aec.webp";
import { supabase } from "@/lib/supabase";
import { ModeToggle } from "@/components/mode-toggle";
import { isUserAdmin } from "@/config/permissions";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session?.user) {
        const isAllowed = isUserAdmin(session.user.email);
        setIsAdmin(isAllowed);

        // Sync admin role to database if allowed but not set
        if (isAllowed) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role !== 'admin') {
            await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', session.user.id);
          }
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (!session) setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  const menuItems = [
    { label: "Início", href: "/#inicio" },
    { label: "Sobre o Teste", href: "/#sobre" },
    { label: "Instruções", href: "/#instrucoes" },
    { label: "Contato", href: "/#contato" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logoAeC} alt="AeC" className="h-10 cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-cobalto dark:text-white hover:text-ceu transition-colors duration-200 font-myriad font-semibold"
              >
                {item.label}
              </a>
            ))}
            <ModeToggle />
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" className="gap-2 border-cobalto text-cobalto dark:text-white dark:border-white hover:bg-cobalto/10 dark:hover:bg-white/10">
                  <Shield className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Button
                variant="ghost"
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cobalto dark:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-gray-200 dark:border-gray-700 py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-cobalto dark:text-white hover:text-ceu transition-colors duration-200 px-4 py-2 font-myriad font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="px-4 py-2">
                <ModeToggle />
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-cobalto dark:text-white hover:text-ceu transition-colors duration-200 px-4 py-2 font-myriad font-semibold flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              {isLoggedIn && (
                <button
                  className="text-red-600 hover:text-red-700 transition-colors duration-200 px-4 py-2 font-myriad font-semibold flex items-center gap-2 w-full text-left"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
