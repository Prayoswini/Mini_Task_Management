import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Toast from '../components/Toast';
import { ListTodo, Search, Filter, Shield, RefreshCw, User } from 'lucide-react';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch registered users for user filter dropdown
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users for filter dropdown:', err);
    }
  };

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (userFilter !== 'All') params.user = userFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      const response = await axiosInstance.get('/admin/tasks', { params });
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch all system tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchAllTasks();
  }, [userFilter, statusFilter, priorityFilter]);

  // Memoized search filtering client-side
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUser = userFilter === 'All' || task.createdBy?._id === userFilter;
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

      return matchesSearch && matchesUser && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, userFilter, statusFilter, priorityFilter]);

  const handleUpdateTask = useCallback(async (formData) => {
    if (!editingTask) return;

    try {
      const response = await axiosInstance.put(`/tasks/${editingTask._id}`, formData);
      if (response.data.success) {
        setToastType('success');
        setToastMessage('Task updated successfully!');
        fetchAllTasks();
      }
    } catch (err) {
      setToastType('error');
      setToastMessage('Failed to update task');
    }
  }, [editingTask]);

  const handleEditClick = useCallback((task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (!window.confirm('As an admin, are you sure you want to delete this task?')) return;

    try {
      const response = await axiosInstance.delete(`/tasks/${taskId}`);
      if (response.data.success) {
        setToastType('success');
        setToastMessage('Task deleted successfully');
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      }
    } catch (err) {
      setToastType('error');
      setToastMessage('Failed to delete task');
    }
  }, []);

  const handleStatusChange = useCallback(async (taskId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/tasks/${taskId}`, { status: newStatus });
      if (response.data.success) {
        setToastType('success');
        setToastMessage(`Status changed to ${newStatus}`);
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      setToastType('error');
      setToastMessage('Failed to update status');
    }
  }, []);

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-role-admin" style={{ padding: '2px 8px' }}>
                <Shield size={12} /> Admin Mode
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ListTodo size={28} color="var(--primary)" /> All System Tasks
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Browse and manage tasks created by all users across the system.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search task title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Filter by User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="var(--text-muted)" />
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="form-select"
              >
                <option value="All">All Users</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Filter by Priority */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="form-select"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            {/* Refresh */}
            <button onClick={fetchAllTasks} className="btn btn-secondary btn-sm" style={{ width: 'fit-content' }}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          isAdminView={true}
        />
      </main>

      {/* Edit Modal */}
      <TaskForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleUpdateTask}
        initialData={editingTask}
        titleText="Admin Edit Task"
      />

      <Toast
        type={toastType}
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default AllTasks;
