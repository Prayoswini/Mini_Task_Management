import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Toast from '../components/Toast';
import { Search, Filter, Plus, ListTodo, RefreshCw } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      const response = await axiosInstance.get('/tasks', { params });
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  // Handle client-side search filtering memoization (React Hook Requirement: useMemo)
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  // Memoized handlers (React Hook Requirement: useCallback)
  const handleCreateOrUpdateTask = useCallback(async (formData) => {
    if (editingTask) {
      // Update Task
      const response = await axiosInstance.put(`/tasks/${editingTask._id}`, formData);
      if (response.data.success) {
        setToastType('success');
        setToastMessage('Task updated successfully!');
        fetchTasks();
      }
    } else {
      // Create Task
      const response = await axiosInstance.post('/tasks', formData);
      if (response.data.success) {
        setToastType('success');
        setToastMessage('Task created successfully!');
        fetchTasks();
      }
    }
  }, [editingTask]);

  const handleEditClick = useCallback((task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

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
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ListTodo size={28} color="var(--primary)" /> My Tasks
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Manage, search, filter, and track all your personal tasks.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={18} /> Create New Task
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Status Filter */}
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

            {/* Priority Filter */}
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

            {/* Refresh Button */}
            <button onClick={fetchTasks} className="btn btn-secondary btn-sm" style={{ width: 'fit-content' }}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div style={{ padding: '1rem', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Task List Component */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      </main>

      {/* Task Creation / Edit Modal */}
      <TaskForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
        titleText={editingTask ? 'Edit Task' : 'Create New Task'}
      />

      <Toast
        type={toastType}
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default Tasks;
