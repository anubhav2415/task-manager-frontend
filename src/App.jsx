import React, { useState, useEffect, createContext, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const API_URL = 'https://task-manager-backend-zimx.onrender.com';

const api = {
  signup: (data) => fetch(`${API_URL}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  login: (data) => fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  getTasks: (token) => fetch(`${API_URL}/tasks`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
  createTask: (token, formData) => fetch(`${API_URL}/tasks`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData }).then(r => r.json()),
  updateTask: (token, id, data) => fetch(`${API_URL}/tasks/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteTask: (token, id) => fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
  getUsers: (token) => fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
  getAnalytics: (token) => fetch(`${API_URL}/analytics`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) setUser(JSON.parse(storedUser));
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const signup = async (name, email, password, role) => {
    const data = await api.signup({ name, email, password, role });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, signup, logout }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div className="absolute top-0 -left-4 w-56 h-56 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
    <div className="absolute top-0 -right-4 w-56 h-56 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-56 h-56 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
  </div>
);


const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-100 p-4">
     {/* <AnimatedBackground /> */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:rotate-12 transition-transform">
           <svg
  className="w-12 h-12 text-white flex-shrink-0"
  viewBox="0 0 24 24"
  width="48"
  height="48"
/><svg/>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Login to manage your tasks</p>
        </div>
        <div className="space-y-5">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all outline-none" placeholder="you@example.com" />
              <svg
  className="w-12 h-12 text-white flex-shrink-0"
  viewBox="0 0 24 24"
  width="48"
  height="48"
/><svg/>
            </div>
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all outline-none" placeholder="••••••••" />
             <svg
  className="w-12 h-12 text-white flex-shrink-0"
  viewBox="0 0 24 24"
  width="48"
  height="48"
/><svg/>
            </div>
          </div>
          {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake"><p className="text-red-700 text-sm font-medium">{error}</p></div>}
          <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <span className="flex items-center justify-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Logging in...</span> : 'Login'}
          </button>
        </div>
        <div className="mt-6 text-center"><p className="text-gray-600">Don't have an account? <button onClick={onSwitch} className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-all">Sign up</button></p></div>
      </div>
    </div>
  );
};

const Signup = ({ onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    const result = await signup(name, email, password, role);
    setIsLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <>
    <h1 style={{ position: "fixed", top: 0, left: 0, background: "red", color: "white", zIndex: 99999 }}>
      LOGIN COMPONENT LOADED
    </h1>
   <div className="min-h-screen grid place-items-center bg-gray-100 p-4">
      {/* <AnimatedBackground /> */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg transform hover:rotate-12 transition-transform">
            <svg
  className="w-12 h-12 text-white flex-shrink-0"
  viewBox="0 0 24 24"
  width="48"
  height="48"
/><svg/>

          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Create Account</h2>
          <p className="text-gray-600 mt-2">Join us and start managing tasks</p>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all outline-none" placeholder="John Doe" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all outline-none" placeholder="you@example.com" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all outline-none" placeholder="••••••••" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Role</label><select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all outline-none"><option value="member">Team Member</option><option value="admin">Administrator</option></select></div>
          {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake"><p className="text-red-700 text-sm font-medium">{error}</p></div>}
          <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50">{isLoading ? 'Creating Account...' : 'Sign Up'}</button>
        </div>
        <div className="mt-6 text-center"><p className="text-gray-600">Already have an account? <button onClick={onSwitch} className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-all">Login</button></p></div>
      </div>
    </div>
    </>
  );
};
const Dashboard = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState(null);

 useEffect(() => {
  if (!token) return;

  const fetchAnalytics = async () => {
    try {
      const data = await api.getAnalytics(token);
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchAnalytics();
}, [token]);


  if (!analytics) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div></div>;

  const statusData = [
    { name: 'To Do', value: analytics.todoTasks, color: '#ef4444' },
    { name: 'In Progress', value: analytics.inProgressTasks, color: '#f59e0b' },
    { name: 'Completed', value: analytics.completedTasks, color: '#10b981' }
  ];

  const priorityData = analytics.tasksByPriority.map(p => ({ name: p._id.charAt(0).toUpperCase() + p._id.slice(1), count: p.count }));

  const StatCard = ({ title, value, icon, gradient, delay }) => (
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-xl transform hover:scale-105 hover:-rotate-1 transition-all duration-300 cursor-pointer animate-fadeInUp`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between"><div><p className="text-white/80 text-sm font-medium mb-1">{title}</p><p className="text-4xl font-bold text-white">{value}</p></div><div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">{icon}</div></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between"><div><h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Dashboard</h2><p className="text-gray-600 mt-1">Track your productivity and progress</p></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={analytics.totalTasks} gradient="from-blue-500 to-blue-600" delay={0} icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
        <StatCard title="Completed" value={analytics.completedTasks} gradient="from-green-500 to-emerald-600" delay={100} icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="In Progress" value={analytics.inProgressTasks} gradient="from-orange-500 to-amber-600" delay={200} icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="To Do" value={analytics.todoTasks} gradient="from-red-500 to-pink-600" delay={300} icon={<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><span className="bg-gradient-to-r from-purple-500 to-pink-500 w-2 h-8 rounded-full mr-3"></span>Tasks by Status</h3>
          <div className="flex justify-center"><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} dataKey="value" animationBegin={0} animationDuration={800}>{statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><span className="bg-gradient-to-r from-blue-500 to-indigo-500 w-2 h-8 rounded-full mr-3"></span>Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={300}><BarChart data={priorityData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" stroke="#888" /><YAxis stroke="#888" /><Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} /><Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} animationBegin={0} animationDuration={800} /><defs><linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs></BarChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const TaskList = () => {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({ title: '', description: '', status: 'todo', priority: 'medium', assignedTo: '', dueDate: '' });

 useEffect(() => {
  if (!token) return;
  fetchTasks();
  fetchUsers();
}, [token]);

  const fetchTasks = async () => { const data = await api.getTasks(token); setTasks(data); };
  const fetchUsers = async () => { const data = await api.getUsers(token); setUsers(data); };

  const handleSubmit = async () => {
    const formDataObj = new FormData();
    Object.keys(formData).forEach(key => { if (formData[key]) formDataObj.append(key, formData[key]); });
    if (editingTask) { await api.updateTask(token, editingTask._id, formData); } else { await api.createTask(token, formDataObj); }
    fetchTasks();
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', status: 'todo', priority: 'medium', assignedTo: '', dueDate: '' });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description, status: task.status, priority: task.priority, assignedTo: task.assignedTo?._id || '', dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => { if (window.confirm('Are you sure you want to delete this task?')) { await api.deleteTask(token, id); fetchTasks(); } };

  const filteredTasks = tasks.filter(task => { if (filter === 'all') return true; return task.status === filter; });

  const statusStyles = { 'todo': 'bg-gradient-to-r from-red-500 to-pink-500', 'in-progress': 'bg-gradient-to-r from-orange-500 to-amber-500', 'completed': 'bg-gradient-to-r from-green-500 to-emerald-500' };
  const priorityStyles = { 'low': 'bg-gradient-to-r from-gray-400 to-gray-500', 'medium': 'bg-gradient-to-r from-blue-500 to-indigo-500', 'high': 'bg-gradient-to-r from-purple-500 to-pink-500' };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tasks</h2><p className="text-gray-600 mt-1">Manage and track your tasks</p></div>
        <button onClick={() => { setEditingTask(null); setFormData({ title: '', description: '', status: 'todo', priority: 'medium', assignedTo: '', dueDate: '' }); setShowModal(true); }} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Task</button>
      </div>
      <div className="flex gap-3 flex-wrap">{['all', 'todo', 'in-progress', 'completed'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-xl transition-all duration-300 font-medium ${filter === f ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' : 'bg-white text-gray-700 hover:bg-gray-50 shadow hover:shadow-md'}`}>{f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}</button>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task, index) => (
          <div key={task._id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 task-card transform hover:-translate-y-2 animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-800 text-lg flex-1">{task.title}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(task)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all transform hover:scale-110" title="Edit"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                {(user.role === 'admin' || task.createdBy._id === user.id) && <button onClick={() => handleDelete(task._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all transform hover:scale-110" title="Delete"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white ${statusStyles[task.status]} shadow-md`}>{task.status.replace('-', ' ')}</span>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white ${priorityStyles[task.priority]} shadow-md`}>{task.priority}</span>
              </div>
              {task.assignedTo && <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>{task.assignedTo.name}</div>}
              {task.dueDate && <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{new Date(task.dueDate).toLocaleDateString()}</div>}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl modal-enter transform">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="space-y-5">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all outline-none" placeholder="Enter task title" required /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all outline-none resize-none" rows="4" placeholder="Describe the task..." /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all outline-none"><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="completed">Completed</option></select></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label><select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all outline-none"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
              </div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label><select value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all outline-none"><option value="">Unassigned</option>{users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}</select></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label><input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all outline-none" /></div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">{editingTask ? 'Update Task' : 'Create Task'}</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, logout } = useAuth();

 if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      {showSignup
        ? <Signup onSwitch={() => setShowSignup(false)} />
        : <Login onSwitch={() => setShowSignup(true)} />}
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TaskManager</span>
                </div>
              </div>
              <div className="flex space-x-4 items-center">
                <button onClick={() => setCurrentPage('dashboard')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${currentPage === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}><span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" /></svg>Dashboard</span></button>
                <button onClick={() => setCurrentPage('tasks')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${currentPage === 'tasks' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}><span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>Tasks</span></button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">{user.name.charAt(0)}</span></div>
                <div className="text-left"><p className="text-sm font-semibold text-gray-800">{user.name}</p><p className="text-xs text-gray-500">{user.role}</p></div>
              </div>
              <button onClick={logout} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{currentPage === 'dashboard' ? <Dashboard /> : <TaskList />}</main>
    </div>
  );
};

export default () => (<AuthProvider><App /></AuthProvider>);