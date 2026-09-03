import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Toast from '../components/Toast';
import { ListTodo, Clock, PlayCircle, CheckCircle2, Plus, ArrowRight, Activity, TrendingUp } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/tasks');
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // React Hook Requirement: useMemo for memoized derived statistics calculations
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, pending, inProgress, completed, completionRate };
  }, [tasks]);

  const handleCreateTask = async (taskData) => {
    const response = await axiosInstance.post('/tasks', taskData);
    if (response.data.success) {
      setToastType('success');
      setToastMessage('Task created successfully!');
      fetchTasks();
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/tasks/${taskId}`, { status: newStatus });
      if (response.data.success) {
        setToastType('success');
        setToastMessage(`Task status updated to ${newStatus}`);
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (error) {
      setToastType('error');
      setToastMessage('Failed to update task status');
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content animate-fade-in">
        {/* Welcome Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name || 'User'}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Here's an overview of your task progress and statistics.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={18} /> Create New Task
            </button>
            <RouterLink to="/tasks" className="btn btn-secondary">
              View All Tasks <ArrowRight size={18} />
            </RouterLink>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
              <ListTodo size={24} />
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-info">
              <span className="stat-label">Pending</span>
              <span className="stat-value" style={{ color: 'var(--status-pending)' }}>{stats.pending}</span>
            </div>
            <div className="stat-icon" style={{ background: 'var(--status-pending-bg)', color: 'var(--status-pending)' }}>
              <Clock size={24} />
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-info">
              <span className="stat-label">In Progress</span>
              <span className="stat-value" style={{ color: 'var(--status-progress)' }}>{stats.inProgress}</span>
            </div>
            <div className="stat-icon" style={{ background: 'var(--status-progress-bg)', color: 'var(--status-progress)' }}>
              <PlayCircle size={24} />
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-info">
              <span className="stat-label">Completed</span>
              <span className="stat-value" style={{ color: 'var(--status-completed)' }}>{stats.completed}</span>
            </div>
            <div className="stat-icon" style={{ background: 'var(--status-completed-bg)', color: 'var(--status-completed)' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* Progress Bar Widget */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Task Completion Productivity</h3>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.completionRate}%</span>
          </div>

          <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '5px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${stats.completionRate}%`,
                height: '100%',
                background: 'var(--primary-gradient)',
                borderRadius: '5px',
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </div>
        </div>

        {/* Recent Tasks Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Recent Activity</h2>
          </div>
          <RouterLink to="/tasks" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
            My Tasks Page →
          </RouterLink>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading recent tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No tasks found. Create your first task to get started!</p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={18} /> Create First Task
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {tasks.slice(0, 3).map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Creation Modal */}
      <TaskForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        titleText="Create New Task"
      />

      <Toast
        type={toastType}
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default UserDashboard;
