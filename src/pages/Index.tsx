
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Users, Package, TrendingUp, MessageCircle } from 'lucide-react';
import LoginDialog from '@/components/auth/LoginDialog';
import ChatInterface from '@/components/chat/ChatInterface';
import Dashboard from '@/components/dashboard/Dashboard';
import { UserRole } from '@/types/auth';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; name: string; id: string } | null>(null);
  const [activeTab, setActiveTab] = useState('chat');

  const features = [
    {
      icon: Package,
      title: "SKU Inventory Management",
      description: "Real-time inventory tracking across warehouses and zones",
      color: "bg-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Sales Analytics",
      description: "Comprehensive sales data and performance metrics",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Claim Processing",
      description: "Automated claim status tracking and management",
      color: "bg-purple-500"
    },
    {
      icon: MessageCircle,
      title: "AI-Powered Queries",
      description: "Natural language processing for complex business queries",
      color: "bg-orange-500"
    }
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Bot className="h-12 w-12 text-blue-600 mr-4" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Manufacturing AI Assistant
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Intelligent automation for dealer queries, inventory management, and sales analytics
            </p>
            <Badge variant="secondary" className="mt-4">
              Powered by OpenAI GPT-4 & ChromaDB
            </Badge>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg border-0 bg-white/60 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="text-center bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">300+</div>
                <div className="text-gray-600">SKU Inventory Records</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
                <div className="text-gray-600">Sales Transactions</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-gray-600">Claims Processed</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Login Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <LoginDialog onLogin={setCurrentUser} />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center">
            <Bot className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manufacturing AI Assistant</h1>
              <p className="text-sm text-gray-600">Welcome back, {currentUser.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{currentUser.role}</Badge>
            <Button 
              variant="outline" 
              onClick={() => setCurrentUser(null)}
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="chat" className="space-y-4">
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatInterface user={currentUser} />
              </motion.div>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-4">
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard user={currentUser} />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
