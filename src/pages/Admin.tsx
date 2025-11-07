import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Briefcase, 
  Code2, 
  Mail, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  LogOut,
  Home,
  Shield,
  Database,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Users,
  Phone,
  MapPin,
  Calendar,
  Zap,
  Star,
  Globe,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
// Static Background (no animations)
const AdminBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#0f172a_0%,#1e293b_50%,#0f172a_100%)]" />
    </div>
  );
};

// Glassmorphism Card (no animations)
const GlassCard = ({ children, className = '' }: any) => {
  return (
    <div className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl ${className}`}>
      {children}
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Hero Section Data
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    badge: '',
    projects: '',
    experience: '',
    clients: ''
  });

  // About Section Data
  const [aboutData, setAboutData] = useState<any[]>([]);

  // Skills Data
  const [skills, setSkills] = useState<any[]>([]);

  // Projects Data
  const [projects, setProjects] = useState<any[]>([]);

  // Contact Data
  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    location: '',
    availability: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Using Supabase directly - no backend needed

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    const savedToken = localStorage.getItem('adminToken');
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedToken && savedEmail) {
      setAuthToken(savedToken);
      setEmail(savedEmail);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      const token = authToken || localStorage.getItem('adminToken');
      
      fetch(`${API_URL}/portfolio`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      })
        .then(res => res.json())
        .then(data => {
          if (data.heroData) setHeroData(data.heroData);
          if (data.aboutData) setAboutData(data.aboutData);
          if (data.skills) setSkills(data.skills);
          if (data.projects) setProjects(data.projects);
          if (data.contactData) setContactData(data.contactData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading data:', err);
          setLoading(false);
          alert('حدث خطأ في تحميل البيانات من قاعدة البيانات');
        });
      
      // Load users
      loadUsers();
    }
  }, [isAuthenticated, authToken]);

  // Separate useEffect for loadUsers to avoid dependency issues
  useEffect(() => {
    if (isAuthenticated && activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    if (!isAuthenticated) return;
    
    try {
      setUserLoading(true);
      const token = authToken || localStorage.getItem('adminToken');
      
      if (!token || token === 'null' || token === 'undefined') {
        alert('يرجى تسجيل الدخول أولاً');
        return;
      }
      
      const url = `${API_URL}/users`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          alert(errorData.error || 'حدث خطأ أثناء تحميل المستخدمين');
        } else {
          alert('حدث خطأ أثناء تحميل المستخدمين');
        }
      }
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert('فشل الاتصال بالسيرفر. تأكد من أن السيرفر يعمل على http://localhost:3001');
      } else {
        alert('حدث خطأ في الاتصال: ' + (error.message || 'خطأ غير معروف'));
      }
    } finally {
      setUserLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!userForm.email || !userForm.password) {
      alert('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      setUserLoading(true);
      const token = authToken || localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userForm)
      });

      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (response.ok) {
          setUserForm({ email: '', password: '', role: 'admin' });
          await loadUsers();
          alert('تم إنشاء المستخدم بنجاح');
        } else {
          alert(data.error || 'حدث خطأ أثناء إنشاء المستخدم');
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        alert('حدث خطأ أثناء إنشاء المستخدم - استجابة غير صحيحة من السيرفر');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert('حدث خطأ في الاتصال: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setUserLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !userForm.email) {
      alert('يرجى إدخال البريد الإلكتروني');
      return;
    }

    try {
      setUserLoading(true);
      const token = authToken || localStorage.getItem('adminToken');
      const updateData: any = { email: userForm.email, role: userForm.role };
      if (userForm.password) {
        updateData.password = userForm.password;
      }

      const response = await fetch(`${API_URL}/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setEditingUser(null);
        setUserForm({ email: '', password: '', role: 'admin' });
        await loadUsers();
        alert('تم تحديث المستخدم بنجاح');
      } else {
        alert(data.error || 'حدث خطأ أثناء تحديث المستخدم');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('حدث خطأ أثناء تحديث المستخدم');
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    try {
      setUserLoading(true);
      const token = authToken || localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        await loadUsers();
        alert('تم حذف المستخدم بنجاح');
      } else {
        alert(data.error || 'حدث خطأ أثناء حذف المستخدم');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('حدث خطأ أثناء حذف المستخدم');
    } finally {
      setUserLoading(false);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setUserForm({ email: user.email, password: '', role: user.role });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!email || !password) {
      setLoginError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('login_user', {
        user_email: email,
        user_password: password
      });

      if (error) {
        setLoginError(error.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
        return;
      }

      if (data && data.success) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', data.user.email);
      } else {
        setLoginError(data?.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError('خطأ في الاتصال: ' + (error.message || 'خطأ غير معروف'));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const token = authToken || localStorage.getItem('adminToken');
      if (!token) {
        alert('يرجى تسجيل الدخول أولاً');
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch(`${API_URL}/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          heroData,
          aboutData,
          skills,
          projects,
          contactData
        })
      });

      const result = await response.json();
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('حدث خطأ أثناء الحفظ: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  // Users Data
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({ email: '', password: '', role: 'admin' });
  const [userLoading, setUserLoading] = useState(false);

  const menuItems = [
    { id: 'hero', label: 'القسم الرئيسي', icon: Sparkles },
    { id: 'about', label: 'عني', icon: User },
    { id: 'skills', label: 'المهارات', icon: Code2 },
    { id: 'projects', label: 'المشاريع', icon: Briefcase },
    { id: 'contact', label: 'اتصل بي', icon: Mail },
    { id: 'users', label: 'المستخدمين', icon: Users },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
        <AdminBackground />
        <div className="relative z-10">
          <GlassCard className="p-10 max-w-md w-full">
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-orange-500/50 border-2 border-white/20">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                لوحة التحكم
              </h1>
              <p className="text-white/70">
                أدخل البريد الإلكتروني وكلمة المرور للوصول
              </p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-white font-semibold text-lg mb-3 block">البريد الإلكتروني</Label>
                  <div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-white font-semibold text-lg mb-3 block">كلمة المرور</Label>
                  <div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                      required
                    />
                  </div>
                </div>
                {loginError && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-xl">
                    {loginError}
                  </div>
                )}
                <div>
                  <Button
                    type="submit"
                    className="w-full gap-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white shadow-2xl shadow-orange-500/50 h-14 text-lg font-bold rounded-xl flex-row-reverse"
                  >
                    <Shield className="w-5 h-5" />
                    تسجيل الدخول
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-8 text-center text-sm text-white/60">
              <p className="flex items-center justify-center gap-2">
                <Database className="w-4 h-4 text-orange-400" />
                متصل بقاعدة البيانات
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center relative overflow-hidden" dir="rtl">
        <AdminBackground />
        <div className="text-center relative z-10">
          <div className="w-20 h-20 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-6 relative" />
          <p className="text-orange-300 text-xl font-semibold flex items-center justify-center gap-3">
            <Database className="w-6 h-6" />
            جاري تحميل البيانات من قاعدة البيانات...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden flex" dir="rtl">
      <AdminBackground />

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar - Fixed */}
      {sidebarOpen && (
        <aside
          className="fixed right-0 top-0 w-72 lg:w-80 backdrop-blur-2xl bg-white/5 border-l border-white/10 flex flex-col h-screen z-40 shadow-2xl max-h-screen"
        >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4 flex-row-reverse">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-2xl shadow-orange-500/50 border-2 border-white/20">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-black bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                    لوحة التحكم
                  </h2>
                  <p className="text-xs text-white/60 mt-1 font-medium">إدارة المحفظة</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all text-sm flex-row-reverse relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white shadow-lg shadow-orange-500/50'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20" />
                    )}
                    <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
                    <span className="font-semibold relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-white/10 space-y-3">
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="w-full gap-3 border-white/20 text-white hover:bg-white/10 hover:border-white/30 text-sm h-11 flex-row-reverse backdrop-blur-xl bg-white/5"
                >
                  <Home className="w-4 h-4" />
                  عرض الموقع
                </Button>
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAuthenticated(false);
                    setAuthToken(null);
                    setEmail('');
                    setPassword('');
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminEmail');
                  }}
                  className="w-full gap-3 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-500/50 text-sm h-11 flex-row-reverse backdrop-blur-xl bg-red-500/5"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </aside>
        )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:mr-80' : 'lg:mr-0'}`}>
        {/* Top Header */}
        <header className="backdrop-blur-2xl bg-white/5 border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 lg:px-8 h-24">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors backdrop-blur-xl bg-white/5 border border-white/10"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="text-right">
                <h1
                  key={activeTab}
                  className="text-2xl lg:text-3xl font-black text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent"
                >
                  {menuItems.find(item => item.id === activeTab)?.label || 'لوحة التحكم'}
                </h1>
                <p className="text-sm text-white/60 mt-1 font-medium">إدارة محتوى محفظتك</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {saveSuccess && (
                <div
                  className="flex items-center gap-2 text-orange-400 flex-row-reverse px-4 py-2 rounded-xl backdrop-blur-xl bg-orange-500/10 border border-orange-500/30"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold">تم الحفظ!</span>
                </div>
              )}
              <div>
                <Button
                  size="lg"
                  onClick={handleSave}
                  disabled={saving}
                  className="gap-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white shadow-2xl shadow-orange-500/50 disabled:opacity-50 flex-row-reverse px-8 py-6 text-lg font-bold rounded-xl"
                >
                  {saving ? (
                    <>
                      <div
                        className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                      />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Cards */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { label: 'القسم الرئيسي', value: heroData.title ? '✓' : '—', icon: Sparkles, color: 'from-orange-500 to-orange-600' },
                { label: 'بطاقات عني', value: aboutData.length, icon: User, color: 'from-blue-500 to-blue-600' },
                { label: 'المهارات', value: skills.length, icon: Code2, color: 'from-green-500 to-green-600' },
                { label: 'المشاريع', value: projects.length, icon: Briefcase, color: 'from-purple-500 to-purple-600' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="perspective-1000"
                >
                  <GlassCard delay={0} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60 mb-3 font-medium">{stat.label}</p>
                        <p
                          className="text-4xl font-black text-white"
                        >
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                      >
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>

            {/* Tab Content */}
              <div
                key={activeTab}
              >
                {/* Hero Section */}
                {activeTab === 'hero' && (
                  <GlassCard delay={0} className="p-8 sm:p-10">
                    <div className="flex items-center gap-5 mb-10 flex-row-reverse">
                      <div
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-2xl shadow-orange-500/50 border-2 border-white/20"
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                        القسم الرئيسي
                      </h2>
                    </div>
                    <div className="space-y-7">
                      <div>
                        <Label className="text-white font-bold text-lg mb-3 block">العنوان الرئيسي</Label>
                        <Input
                          value={heroData.title}
                          onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                          placeholder="مثال: مطور ويب كامل"
                        />
                      </div>
                      <div>
                        <Label className="text-white font-bold text-lg mb-3 block">العنوان الفرعي</Label>
                        <Textarea
                          value={heroData.subtitle}
                          onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 backdrop-blur-xl rounded-xl"
                          rows={4}
                          placeholder="أدخل وصف العنوان الفرعي"
                        />
                      </div>
                      <div>
                        <Label className="text-white font-bold text-lg mb-3 block">نص الشارة</Label>
                        <Input
                          value={heroData.badge}
                          onChange={(e) => setHeroData({ ...heroData, badge: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                          placeholder="مثال: متاح للعمل"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <Label className="text-white font-semibold mb-3 block">عدد المشاريع</Label>
                          <Input
                            value={heroData.projects}
                            onChange={(e) => setHeroData({ ...heroData, projects: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                            placeholder="50+"
                          />
                        </div>
                        <div>
                          <Label className="text-white font-semibold mb-3 block">سنوات الخبرة</Label>
                          <Input
                            value={heroData.experience}
                            onChange={(e) => setHeroData({ ...heroData, experience: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                            placeholder="5+"
                          />
                        </div>
                        <div>
                          <Label className="text-white font-semibold mb-3 block">عدد العملاء</Label>
                          <Input
                            value={heroData.clients}
                            onChange={(e) => setHeroData({ ...heroData, clients: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                            placeholder="100+"
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* About Section */}
                {activeTab === 'about' && (
                  <GlassCard delay={0} className="p-8 sm:p-10">
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-5 flex-row-reverse">
                        <div
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-2xl shadow-orange-500/50 border-2 border-white/20"
                        >
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                          قسم عني
                        </h2>
                      </div>
                      <div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setAboutData([...aboutData, { title: '', description: '' }]);
                          }}
                          className="gap-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white h-12 px-6 flex-row-reverse rounded-xl font-bold shadow-lg shadow-orange-500/50"
                        >
                          <Plus className="w-5 h-5" />
                          إضافة بطاقة
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {aboutData.map((item, index) => (
                        <div
                          key={index}
                        >
                          <GlassCard delay={0} className="p-6 relative">
                            <div 
                              className="absolute top-5 right-5 z-10"
                            >
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setAboutData(aboutData.filter((_, i) => i !== index));
                                }}
                                className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg h-10 w-10 p-0 rounded-xl"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                            <div className="space-y-5 pr-16">
                              <div>
                                <Label className="text-white font-semibold mb-3 block">العنوان</Label>
                                <Input
                                  value={item.title}
                                  onChange={(e) => {
                                    const newData = [...aboutData];
                                    newData[index].title = e.target.value;
                                    setAboutData(newData);
                                  }}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                                  placeholder="عنوان البطاقة"
                                />
                              </div>
                              <div>
                                <Label className="text-white font-semibold mb-3 block">الوصف</Label>
                                <Textarea
                                  value={item.description}
                                  onChange={(e) => {
                                    const newData = [...aboutData];
                                    newData[index].description = e.target.value;
                                    setAboutData(newData);
                                  }}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 backdrop-blur-xl rounded-xl"
                                  rows={3}
                                  placeholder="وصف البطاقة"
                                />
                              </div>
                            </div>
                          </GlassCard>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Skills Section */}
                {activeTab === 'skills' && (
                  <GlassCard delay={0} className="p-8 sm:p-10">
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-5 flex-row-reverse">
                        <div
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-2xl shadow-orange-500/50 border-2 border-white/20"
                        >
                          <Code2 className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                          المهارات
                        </h2>
                      </div>
                      <div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSkills([...skills, { name: '', level: 50, color: '#f97316' }]);
                          }}
                          className="gap-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white h-12 px-6 flex-row-reverse rounded-xl font-bold shadow-lg shadow-orange-500/50"
                        >
                          <Plus className="w-5 h-5" />
                          إضافة مهارة
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                        >
                          <GlassCard delay={0} className="p-6 relative">
                            <div 
                              className="absolute top-5 right-5 z-10"
                            >
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSkills(skills.filter((_, i) => i !== index));
                                }}
                                className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg h-10 w-10 p-0 rounded-xl"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-6 pr-16">
                              <div>
                                <Label className="text-white font-semibold mb-3 block">اسم المهارة</Label>
                                <Input
                                  value={skill.name}
                                  onChange={(e) => {
                                    const newSkills = [...skills];
                                    newSkills[index].name = e.target.value;
                                    setSkills(newSkills);
                                  }}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                                  placeholder="مثال: React"
                                />
                              </div>
                              <div>
                                <Label className="text-white font-semibold mb-3 block">المستوى (%)</Label>
                                <Input
                                  type="number"
                                  value={skill.level}
                                  onChange={(e) => {
                                    const newSkills = [...skills];
                                    newSkills[index].level = parseInt(e.target.value) || 0;
                                    setSkills(newSkills);
                                  }}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                                  min="0"
                                  max="100"
                                />
                              </div>
                              <div>
                                <Label className="text-white font-semibold mb-3 block">اللون</Label>
                                <Input
                                  type="color"
                                  value={skill.color}
                                  onChange={(e) => {
                                    const newSkills = [...skills];
                                    newSkills[index].color = e.target.value;
                                    setSkills(newSkills);
                                  }}
                                  className="h-14 bg-white/10 border-white/20 focus:border-orange-400 rounded-xl cursor-pointer"
                                />
                              </div>
                            </div>
                          </GlassCard>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Projects Section */}
                {activeTab === 'projects' && (
                  <GlassCard delay={0} className="p-8 sm:p-10">
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-5 flex-row-reverse">
                        <div
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-2xl shadow-orange-500/50 border-2 border-white/20"
                        >
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                          المشاريع
                        </h2>
                      </div>
                      <div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setProjects([...projects, {
                              title: '',
                              description: '',
                              tech: [],
                              url: ''
                            }]);
                          }}
                          className="gap-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white h-12 px-6 flex-row-reverse rounded-xl font-bold shadow-lg shadow-orange-500/50"
                        >
                          <Plus className="w-5 h-5" />
                          إضافة مشروع
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {projects.map((project, index) => (
                        <div
                          key={index}
                        >
                          <GlassCard delay={0} className="p-6 relative">
                            <div 
                              className="absolute top-5 right-5 z-10"
                            >
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setProjects(projects.filter((_, i) => i !== index));
                                }}
                                className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg h-10 w-10 p-0 rounded-xl"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                            <div className="space-y-5 pr-16">
                              <div>
                                <Label className="text-white font-semibold mb-3 block">عنوان المشروع</Label>
                                <Input
                                  value={project.title}
                                  onChange={(e) => {
                                    const newProjects = [...projects];
                                    newProjects[index].title = e.target.value;
                                    setProjects(newProjects);
                                  }}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                                  placeholder="اسم المشروع"
                                />
                              </div>
                              <div>
                                <Label className="text-white font-semibold mb-3 block">الوصف</Label>
                                <Textarea
                                  value={project.description}
                                  onChange={(e) => {
                                    const newProjects = [...projects];
                                    newProjects[index].description = e.target.value;
                                    setProjects(newProjects);
                                  }}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 backdrop-blur-xl rounded-xl"
                                  rows={4}
                                  placeholder="وصف المشروع"
                                />
                              </div>
                              <div>
                                <Label className="text-white font-semibold mb-3 block">التقنيات (مفصولة بفواصل)</Label>
                                <Input
                                  value={project.tech.join(', ')}
                                  onChange={(e) => {
                                    const newProjects = [...projects];
                                    newProjects[index].tech = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                                    setProjects(newProjects);
                                  }}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                                  placeholder="React, Node.js, MongoDB"
                                />
                              </div>
                              <div>
                                <Label className="text-white font-semibold mb-3 block">رابط المشروع</Label>
                                <Input
                                  type="url"
                                  value={project.url || ''}
                                  onChange={(e) => {
                                    const newProjects = [...projects];
                                    newProjects[index].url = e.target.value;
                                    setProjects(newProjects);
                                  }}
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                                  placeholder="https://example.com/project"
                                />
                              </div>
                            </div>
                          </GlassCard>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Contact Section */}
                {activeTab === 'contact' && (
                  <GlassCard delay={0} className="p-8 sm:p-10">
                    <div className="flex items-center gap-5 mb-10 flex-row-reverse">
                      <div
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-2xl shadow-orange-500/50 border-2 border-white/20"
                      >
                        <Mail className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                        معلومات الاتصال
                      </h2>
                    </div>
                    <div className="space-y-7">
                      <div>
                        <Label className="text-white font-bold text-lg mb-3 block">البريد الإلكتروني</Label>
                        <Input
                          value={contactData.email}
                          onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                          placeholder="contact@example.com"
                        />
                      </div>
                      <div>
                        <Label className="text-white font-bold text-lg mb-3 block">الهاتف</Label>
                        <Input
                          value={contactData.phone}
                          onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label className="text-white font-bold text-lg mb-3 block">الموقع</Label>
                        <Input
                          value={contactData.location}
                          onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                          placeholder="عن بُعد / متاح عالمياً"
                        />
                      </div>
                      <div>
                        <Label className="text-white font-bold text-lg mb-3 block">التوفر</Label>
                        <Input
                          value={contactData.availability}
                          onChange={(e) => setContactData({ ...contactData, availability: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                          placeholder="متاح للمشاريع الجديدة"
                        />
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* Users Section */}
                {activeTab === 'users' && (
                  <GlassCard delay={0} className="p-8 sm:p-10">
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-5 flex-row-reverse">
                        <div
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-2xl shadow-orange-500/50 border-2 border-white/20"
                        >
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                          إدارة المستخدمين
                        </h2>
                      </div>
                    </div>

                    {/* Create/Edit User Form */}
                    <GlassCard delay={0} className="p-6 mb-8">
                      <h3 className="text-xl font-bold text-white mb-6 flex-row-reverse flex items-center gap-3">
                        {editingUser ? (
                          <>
                            <Edit className="w-6 h-6" />
                            تعديل مستخدم
                          </>
                        ) : (
                          <>
                            <Plus className="w-6 h-6" />
                            إضافة مستخدم جديد
                          </>
                        )}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-white font-semibold mb-3 block">البريد الإلكتروني</Label>
                          <Input
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                            placeholder="user@example.com"
                            type="email"
                          />
                        </div>
                        <div>
                          <Label className="text-white font-semibold mb-3 block">
                            كلمة المرور {editingUser && '(اتركه فارغاً إذا لم تريد التغيير)'}
                          </Label>
                          <Input
                            value={userForm.password}
                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-orange-400 h-14 backdrop-blur-xl rounded-xl"
                            placeholder="••••••••"
                            type="password"
                          />
                        </div>
                        <div>
                          <Label className="text-white font-semibold mb-3 block">الدور</Label>
                          <select
                            value={userForm.role}
                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 text-white h-14 backdrop-blur-xl rounded-xl px-4 focus:border-orange-400 focus:outline-none"
                          >
                            <option value="admin" className="bg-gray-800">مدير</option>
                            <option value="user" className="bg-gray-800">مستخدم</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6 flex-row-reverse">
                        {editingUser && (
                          <Button
                            onClick={() => {
                              setEditingUser(null);
                              setUserForm({ email: '', password: '', role: 'admin' });
                            }}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 h-12 px-6 rounded-xl"
                          >
                            إلغاء
                          </Button>
                        )}
                        <Button
                          onClick={editingUser ? handleUpdateUser : handleCreateUser}
                          disabled={userLoading}
                          className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-orange-500/50 flex-row-reverse gap-3"
                        >
                          {userLoading ? (
                            <>
                              <div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              />
                              جاري المعالجة...
                            </>
                          ) : editingUser ? (
                            <>
                              <Save className="w-5 h-5" />
                              حفظ التغييرات
                            </>
                          ) : (
                            <>
                              <Plus className="w-5 h-5" />
                              إضافة مستخدم
                            </>
                          )}
                        </Button>
                      </div>
                    </GlassCard>

                    {/* Users List */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white mb-6">قائمة المستخدمين ({users.length})</h3>
                      {userLoading && users.length === 0 ? (
                        <div className="text-center py-12">
                          <div
                            className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"
                          />
                          <p className="text-white/60">جاري تحميل المستخدمين...</p>
                        </div>
                      ) : users.length === 0 ? (
                        <GlassCard delay={0} className="p-12 text-center">
                          <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                          <p className="text-white/60 text-lg">لا يوجد مستخدمين</p>
                        </GlassCard>
                      ) : (
                        users.map((user, index) => (
                          <div
                            key={user.id}
                          >
                            <GlassCard delay={0} className="p-6">
                              <div className="flex items-center justify-between flex-row-reverse">
                                <div className="flex items-center gap-4 flex-row-reverse">
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-bold text-white">{user.email}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                      <Badge className={`${user.role === 'admin' ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 'bg-blue-500/20 text-blue-300 border-blue-500/50'}`}>
                                        {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                                      </Badge>
                                      <span className="text-xs text-white/50">
                                        {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div>
                                    <Button
                                      onClick={() => handleEditUser(user)}
                                      variant="outline"
                                      size="sm"
                                      className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/50 h-10 px-4 rounded-xl flex-row-reverse gap-2"
                                    >
                                      <Edit className="w-4 h-4" />
                                      تعديل
                                    </Button>
                                  </div>
                                  <div>
                                    <Button
                                      onClick={() => handleDeleteUser(user.id)}
                                      variant="destructive"
                                      size="sm"
                                      className="bg-red-600 hover:bg-red-700 text-white h-10 px-4 rounded-xl flex-row-reverse gap-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      حذف
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </GlassCard>
                          </div>
                        ))
                      )}
                    </div>
                  </GlassCard>
                )}
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
