import { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/navigation/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, User, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EmergencyAdminLogin() {
  const [email, setEmail] = useState('admin@britanniaforge.co.uk');
  const [password, setPassword] = useState('BritanniaAdmin2025!');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleEmergencyLogin = () => {
    if (email === 'admin@britanniaforge.co.uk' && password === 'BritanniaAdmin2025!') {
      // Direct admin access - no API calls
      const adminUser = {
        id: 1,
        fullName: 'System Administrator',
        email: 'admin@britanniaforge.co.uk',
        userType: 'admin',
        emailVerified: true
      };
      
      const fakeToken = 'emergency-admin-token-' + Date.now();
      
      localStorage.setItem('adminToken', fakeToken);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      
      toast({
        title: 'Emergency Admin Access Granted',
        description: 'Welcome to the admin dashboard',
      });
      
      setLocation('/emergency-admin-dashboard');
    } else {
      toast({
        title: 'Access Denied',
        description: 'Invalid emergency admin credentials',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-900">
      <Header />
      <div className="flex items-center justify-center p-4 min-h-screen">
        <Card className="w-full max-w-md glass-card border-red-500/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
            <CardTitle className="text-2xl text-white">Emergency Admin Access</CardTitle>
            <CardDescription className="text-slate-300">
              Database bypass - Direct admin login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Admin Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@britanniaforge.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Admin Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                    required
                  />
                </div>
              </div>
              <Button
                onClick={handleEmergencyLogin}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                Emergency Admin Access
              </Button>
              <div className="text-center text-sm text-slate-400">
                Emergency bypass - No database connection required
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}