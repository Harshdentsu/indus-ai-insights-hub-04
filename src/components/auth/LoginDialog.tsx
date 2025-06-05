
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { User, Shield, Briefcase, LogIn } from 'lucide-react';
import { UserRole } from '@/types/auth';

interface LoginDialogProps {
  onLogin: (user: { role: UserRole; name: string; id: string }) => void;
}

const LoginDialog = ({ onLogin }: LoginDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('dealer');

  const handleLogin = () => {
    if (name.trim()) {
      onLogin({
        role,
        name: name.trim(),
        id: `${role}_${Date.now()}`
      });
      setOpen(false);
    }
  };

  const roleConfig = {
    dealer: {
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Query SKU availability, sales data, and claim status'
    },
    sales_rep: {
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Access dealer performance and regional sales analytics'
    },
    admin: {
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Full system access with analytics and logs'
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
            <LogIn className="h-5 w-5 mr-2" />
            Get Started
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Access AI Assistant</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dealer">Dealer</SelectItem>
                <SelectItem value="sales_rep">Sales Representative</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role Description */}
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`${roleConfig[role].bgColor} border-0`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <roleConfig[role].icon className={`h-5 w-5 ${roleConfig[role].color} mt-0.5`} />
                  <div>
                    <div className={`font-medium ${roleConfig[role].color} mb-1`}>
                      {role.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {roleConfig[role].description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Button 
            onClick={handleLogin} 
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
