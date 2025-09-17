import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Shield, IdCard } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const [location] = useLocation();

  return (
    <div className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary rounded-md">
              <IdCard className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold" data-testid="text-app-title">
              IC Registration System
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              <Link href="/">
                <Button 
                  variant={location === '/' ? 'default' : 'ghost'} 
                  size="sm"
                  data-testid="link-registration"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </Link>
              
              <Link href="/admin">
                <Button 
                  variant={location === '/admin' ? 'default' : 'ghost'} 
                  size="sm"
                  data-testid="link-admin"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="sm:hidden border-t bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex py-2 gap-1">
            <Link href="/" className="flex-1">
              <Button 
                variant={location === '/' ? 'default' : 'ghost'} 
                size="sm" 
                className="w-full justify-start"
                data-testid="link-mobile-registration"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register
              </Button>
            </Link>
            
            <Link href="/admin" className="flex-1">
              <Button 
                variant={location === '/admin' ? 'default' : 'ghost'} 
                size="sm" 
                className="w-full justify-start"
                data-testid="link-mobile-admin"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}