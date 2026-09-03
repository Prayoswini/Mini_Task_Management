import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';
import { Users, ListTodo, Clock, PlayCircle, CheckCircle2, Shield, ArrowRight, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch admin statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  // Memoized completion rate calculation (React Hook Requirement: useMemo)
  const completionPercentage = useMemo(() => {
    if (!stats.totalTasks) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  }, [stats]);

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-role-admin" style={{ padding: '2px 8px' }}>
                <Shield size={12} /> Admin Portal
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              System Overview & Analytics
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Monitor system-wide user engagement, tasks distribution, and statistics.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <RouterLink to="/admin/users" className="btn btn-secondary">
              <Users size={18} /> Manage Users
            </RouterLink>
            <RouterLink to="/admin/tasks" className="btn btn-primary">
              <ListTodo size={18} /> View All Tasks <ArrowRight size={18} />
            </RouterLink>
          </div>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Statistics Grid */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="glass-card stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Users</span>
              <span className="stat-value" style={{ color: '#a78bfa' }}>{loading ? '...' : stats.totalUsers}</span>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
              <Users size={24} />
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{loading ? '...' : stats.totalTasks}</span>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
              <ListTodo size={24} />
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-info">
              <span className="stat-label">Pending Tasks</span>
              <span className="stat-value" style={{ color: 'var(--status-pending)' }}>{loading ? '...' : stats.pendingTasks}</span>
            </div>
            <div className="stat-icon" style={{ background: 'var(--status-pending-bg)', color: 'var(--status-pending)' }}>
              <Clock size={24} />
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-info">
              <span className="stat-label">In Progress</span>
              <span className="stat-value" style={{ color: 'var(--status-progress)' }}>{loading ? '...' : stats.inProgressTasks}</span>
            </div>
            <div className="stat-icon" style={{ background: 'var(--status-progress-bg)', color: 'var(--status-progress)' }}>
              <PlayCircle size={24} />
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-info">
              <span className="stat-label">Completed Tasks</span>
              <span className="stat-value" style={{ color: 'var(--status-completed)' }}>{loading ? '...' : stats.completedTasks}</span>
            </div>
            <div className="stat-icon" style={{ background: 'var(--status-completed-bg)', color: 'var(--status-completed)' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* System Activity & Navigation Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          {/* Completion Rate Chart Card */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="var(--primary)" /> System Completion Rate
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `conic-gradient(var(--primary) ${completionPercentage * 3.6}deg, rgba(255, 255, 255, 0.08) 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-card-solid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                  {completionPercentage}%
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {stats.completedTasks} out of {stats.totalTasks} total created tasks have reached completed status.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Management Link Cards */}
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Quick Admin Actions</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Access user management controls or inspect global task queues.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <RouterLink to="/admin/users" className="btn btn-secondary" style={{ flex: 1 }}>
                <Users size={16} /> User Management
              </RouterLink>
              <RouterLink to="/admin/tasks" className="btn btn-primary" style={{ flex: 1 }}>
                <ListTodo size={16} /> All System Tasks
              </RouterLink>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
