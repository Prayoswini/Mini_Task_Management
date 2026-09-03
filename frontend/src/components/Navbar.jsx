import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, LayoutDashboard, ListTodo, Users, LogOut, Shield, User } from 'lucide-react';

const Navbar = () => {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <RouterLink to={role === 'admin' ? '/admin' : '/dashboard'} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none'
        }}>
          <div style={{
            background: 'var(--primary-gradient)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <CheckSquare size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
              TaskFlow<span style={{ color: 'var(--primary)' }}>Pro</span>
            </span>
          </div>
        </RouterLink>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {role === 'admin' ? (
            <>
              <RouterLink
                to="/admin"
                className={`btn btn-sm ${isActive('/admin') ? 'btn-primary' : 'btn-secondary'}`}
              >
                <LayoutDashboard size={16} /> Admin Dashboard
              </RouterLink>
              <RouterLink
                to="/admin/tasks"
                className={`btn btn-sm ${isActive('/admin/tasks') ? 'btn-primary' : 'btn-secondary'}`}
              >
                <ListTodo size={16} /> All Tasks
              </RouterLink>
              <RouterLink
                to="/admin/users"
                className={`btn btn-sm ${isActive('/admin/users') ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Users size={16} /> User Management
              </RouterLink>
            </>
          ) : (
            <>
              <RouterLink
                to="/dashboard"
                className={`btn btn-sm ${isActive('/dashboard') ? 'btn-primary' : 'btn-secondary'}`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </RouterLink>
              <RouterLink
                to="/tasks"
                className={`btn btn-sm ${isActive('/tasks') ? 'btn-primary' : 'btn-secondary'}`}
              >
                <ListTodo size={16} /> My Tasks
              </RouterLink>
            </>
          )}
        </nav>

        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: role === 'admin' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
              border: `1px solid ${role === 'admin' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: role === 'admin' ? '#a78bfa' : '#60a5fa'
            }}>
              {role === 'admin' ? <Shield size={18} /> : <User size={18} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {user?.name || 'User'}
              </span>
              <span className={`badge ${role === 'admin' ? 'badge-role-admin' : 'badge-role-user'}`} style={{ width: 'fit-content', padding: '1px 6px', fontSize: '0.7rem' }}>
                {role?.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            title="Logout"
            style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
