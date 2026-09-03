import React, { useState, useEffect, useContext, useMemo } from 'react';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { AuthContext } from '../context/AuthContext';
import { Users as UsersIcon, Search, Trash2, Shield, User, Calendar, Mail, RefreshCw } from 'lucide-react';

const Users = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchTerm) params.search = searchTerm;

      const response = await axiosInstance.get('/admin/users', { params });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch registered users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUser._id) {
      setToastType('error');
      setToastMessage('You cannot delete your own logged-in admin account');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This will also remove all their associated tasks.`)) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        setToastType('success');
        setToastMessage(`User ${userName} successfully deleted`);
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      setToastType('error');
      setToastMessage(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <UsersIcon size={28} color="var(--primary)" /> User Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              View all registered platform accounts, monitor roles, and manage access.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <button onClick={fetchUsers} className="btn btn-secondary btn-sm">
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Users Data Table */}
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem 1.25rem' }}>User Profile</th>
                <th style={{ padding: '1rem' }}>Email Address</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Registered Date</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading user accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users matching search criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: u.role === 'admin' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: u.role === 'admin' ? '#a78bfa' : '#60a5fa',
                          fontWeight: 700
                        }}>
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</div>
                          {u._id === currentUser._id && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>(You)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={14} /> {u.email}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-role-admin' : 'badge-role-user'}`}>
                        {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />} {u.role?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} /> {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {u._id !== currentUser._id ? (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          title="Delete User"
                        >
                          <Trash2 size={15} /> Delete Account
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', italic: true }}>Current Admin</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Toast
        type={toastType}
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default Users;
