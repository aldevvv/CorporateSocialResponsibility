// app/dashboard/ai-settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Key,
  MessageSquare,
  Edit,
  Trash2,
  Brain,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ApiKeyForm from './components/ApiKeyForm';
import PromptForm from './components/PromptForm';

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  apiKeyPreview: string;
  isActive: boolean;
  availableModels?: string[];
  createdAt: string;
  createdBy?: {
    name?: string;
    email: string;
  };
}

interface Prompt {
  id: string;
  name: string;
  description?: string;
  category: string;
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  createdAt: string;
  apiKey?: {
    name: string;
  };
  createdBy?: {
    name?: string;
    email: string;
  };
}

export default function AISettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null);
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // Real KPI data from API
  const [kpiData, setKpiData] = useState({
    totalRequests: 0,
    successRate: 0,
    avgResponseTime: 0,
    activeModels: 0,
    monthlyLimit: 0,
    usedThisMonth: 0
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (!session.user || (session.user as { role: string }).role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      let apiKeysData: ApiKey[] = [];
      let promptsData: Prompt[] = [];
      
      // Fetch API Keys
      const apiKeysResponse = await fetch('/api/ai-settings/api-keys');
      if (apiKeysResponse.ok) {
        apiKeysData = await apiKeysResponse.json();
        setApiKeys(apiKeysData);
      }

      // Fetch Prompts
      const promptsResponse = await fetch('/api/ai-settings/prompts');
      if (promptsResponse.ok) {
        promptsData = await promptsResponse.json();
        setPrompts(promptsData);
      }

      // Fetch KPI Data (you'll need to create this API endpoint)
      try {
        const kpiResponse = await fetch('/api/ai-settings/kpi');
        if (kpiResponse.ok) {
          const kpiResponseData = await kpiResponse.json();
          setKpiData(kpiResponseData);
        }
      } catch (_kpiError) {
        console.log('KPI endpoint not available yet, using calculated values');
        // Calculate basic KPI from existing data
        const activeApiKeys = apiKeysData.filter((key: ApiKey) => key.isActive).length;
        const _activePrompts = promptsData.filter((prompt: Prompt) => prompt.isActive).length;
        
        setKpiData({
          totalRequests: 0, // This would come from usage logs
          successRate: 0, // This would come from usage logs
          avgResponseTime: 0, // This would come from usage logs
          activeModels: activeApiKeys,
          monthlyLimit: 10000, // This could be configurable
          usedThisMonth: 0 // This would come from usage logs
        });
      }
      
    } catch (error) {
      console.error('Error fetching AI settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchData(); // Refresh the data
    setEditingApiKey(null);
    setEditingPrompt(null);
  };

  const handleFormClose = () => {
    setShowApiKeyForm(false);
    setEditingApiKey(null);
  };

  const handlePromptFormClose = () => {
    setShowPromptForm(false);
    setEditingPrompt(null);
  };

  const handleDeleteApiKey = async (apiKeyId: string) => {
    if (!confirm('Yakin ingin menghapus API key ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/ai-settings/api-keys?id=${apiKeyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData(); // Refresh the data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      alert('Terjadi kesalahan saat menghapus API key');
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!confirm('Yakin ingin menghapus prompt ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/ai-settings/prompts?id=${promptId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData(); // Refresh the data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert('Terjadi kesalahan saat menghapus prompt');
    }
  };

  // Get default/active API key and prompt
  const defaultApiKey = apiKeys.find((key: ApiKey) => key.isActive);
  const defaultPrompt = prompts.find((prompt: Prompt) => prompt.isActive);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium text-gray-900">Memuat AI Settings...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.user || (session.user as { role: string }).role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">AI Settings</h1>
                <p className="text-purple-100 text-sm sm:text-base">
                  Kelola API Key, Prompt, dan konfigurasi AI untuk sistem
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Requests</p>
                  <p className="text-lg font-bold text-gray-900">{(kpiData.totalRequests || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Success Rate</p>
                  <p className="text-lg font-bold text-gray-900">{(kpiData.successRate || 0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Response</p>
                  <p className="text-lg font-bold text-gray-900">{(kpiData.avgResponseTime || 0)}s</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Active Models</p>
                  <p className="text-lg font-bold text-gray-900">{kpiData.activeModels || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Monthly Limit</p>
                  <p className="text-lg font-bold text-gray-900">{(kpiData.monthlyLimit || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Activity className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Used This Month</p>
                  <p className="text-lg font-bold text-gray-900">{(kpiData.usedThisMonth || 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Defaults */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Key className="h-5 w-5" />
                Default API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {defaultApiKey ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{defaultApiKey.name}</h3>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Provider:</span> <span className="font-medium">{defaultApiKey.provider}</span></p>
                    <p><span className="text-gray-600">API Key:</span> <span className="font-mono text-xs">{defaultApiKey.apiKeyPreview}</span></p>
                    {defaultApiKey.availableModels && (
                      <p><span className="text-gray-600">Models:</span> <span className="font-medium">{defaultApiKey.availableModels.length} available</span></p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Tidak ada API Key default</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <MessageSquare className="h-5 w-5" />
                Default AI Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {defaultPrompt ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{defaultPrompt.name}</h3>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Category:</span> <span className="font-medium">{defaultPrompt.category.replace('_', ' ')}</span></p>
                    <p><span className="text-gray-600">Model:</span> <span className="font-medium">{defaultPrompt.model}</span></p>
                    <p><span className="text-gray-600">Temperature:</span> <span className="font-medium">{defaultPrompt.temperature}</span></p>
                    <p><span className="text-gray-600">Max Tokens:</span> <span className="font-medium">{defaultPrompt.maxTokens}</span></p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Tidak ada Prompt default</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <Tabs defaultValue="api-keys" className="w-full">
            <div className="border-b border-gray-100">
              <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="api-keys" 
                  className="flex items-center gap-2 py-4 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  <Key className="h-4 w-4" />
                  <span className="hidden sm:inline">API Keys</span>
                  <span className="sm:hidden">Keys</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="prompts" 
                  className="flex items-center gap-2 py-4 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Prompts</span>
                  <span className="sm:hidden">Prompts</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* API Keys Tab */}
            <TabsContent value="api-keys" className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">API Keys Management</h2>
                  <p className="text-gray-600 text-sm">Kelola API keys untuk berbagai provider AI</p>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  onClick={() => setShowApiKeyForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah API Key
                </Button>
              </div>

              {apiKeys.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-200">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Key className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada API Key</h3>
                    <p className="text-gray-500 text-center mb-4 max-w-md">
                      Tambahkan API Key untuk menggunakan layanan AI dalam sistem. Pastikan API key memiliki akses yang sesuai.
                    </p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowApiKeyForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah API Key Pertama
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {apiKeys.map((apiKey: ApiKey) => (
                    <Card key={apiKey.id} className="border-0 shadow-lg">
                      <CardHeader className="border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                              <Key className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{apiKey.name}</h3>
                              <p className="text-sm text-gray-600">{apiKey.provider}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={apiKey.isActive ? 'default' : 'secondary'} className="flex items-center gap-1">
                              {apiKey.isActive ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                              {apiKey.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {apiKey.isActive && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Default
                              </Badge>
                            )}
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingApiKey(apiKey);
                                  setShowApiKeyForm(true);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteApiKey(apiKey.id)}
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">API Key</p>
                            <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{apiKey.apiKeyPreview}</p>
                          </div>
                          {apiKey.availableModels && apiKey.availableModels.length > 0 && (
                            <div>
                              <p className="text-gray-600 mb-1">Available Models</p>
                              <p className="font-medium">{apiKey.availableModels.length} models</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-600 mb-1">Created</p>
                            <p className="font-medium">{new Date(apiKey.createdAt).toLocaleDateString('id-ID')}</p>
                          </div>
                          {apiKey.createdBy && (
                            <div>
                              <p className="text-gray-600 mb-1">Created by</p>
                              <p className="font-medium">{apiKey.createdBy.name || apiKey.createdBy.email}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Prompts Tab */}
            <TabsContent value="prompts" className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">AI Prompts Management</h2>
                  <p className="text-gray-600 text-sm">Kelola prompt AI untuk berbagai keperluan analisis</p>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  onClick={() => setShowPromptForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Prompt
                </Button>
              </div>

              {prompts.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-200">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada Prompt</h3>
                    <p className="text-gray-500 text-center mb-4 max-w-md">
                      Buat prompt AI untuk berbagai keperluan analisis dan insight. Prompt yang baik akan menghasilkan response yang lebih akurat.
                    </p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowPromptForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Prompt Pertama
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {prompts.map((prompt: Prompt) => (
                    <Card key={prompt.id} className="border-0 shadow-lg">
                      <CardHeader className="border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{prompt.name}</h3>
                              {prompt.description && (
                                <p className="text-sm text-gray-600">{prompt.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={prompt.isActive ? 'default' : 'secondary'} className="flex items-center gap-1">
                              {prompt.isActive ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                              {prompt.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800">
                              {prompt.category.replace('_', ' ')}
                            </Badge>
                            {prompt.isActive && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Default
                              </Badge>
                            )}
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingPrompt(prompt);
                                  setShowPromptForm(true);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePrompt(prompt.id)}
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">API Key</p>
                            <p className="font-medium">{prompt.apiKey?.name || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Model</p>
                            <p className="font-medium">{prompt.model}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Temperature</p>
                            <p className="font-medium">{prompt.temperature}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Max Tokens</p>
                            <p className="font-medium">{prompt.maxTokens}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Created</p>
                            <p className="font-medium">{new Date(prompt.createdAt).toLocaleDateString('id-ID')}</p>
                          </div>
                          {prompt.createdBy && (
                            <div>
                              <p className="text-gray-600 mb-1">Created by</p>
                              <p className="font-medium">{prompt.createdBy.name || prompt.createdBy.email}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* API Key Form Modal */}
        <ApiKeyForm
          isOpen={showApiKeyForm}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editData={editingApiKey || undefined}
        />

        {/* Prompt Form Modal */}
        <PromptForm
          isOpen={showPromptForm}
          onClose={handlePromptFormClose}
          onSuccess={handleFormSuccess}
          editData={editingPrompt || undefined}
        />
      </div>
    </div>
  );
}