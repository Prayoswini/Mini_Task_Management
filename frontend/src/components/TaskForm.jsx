import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Flag, AlertCircle } from 'lucide-react';

const TaskForm = ({ isOpen, onClose, onSubmit, initialData = null, titleText = 'Create New Task' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useRef  Auto-focus task title input on form open
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      // Format date for <input type="date" />
      const formattedDate = initialData.dueDate
        ? new Date(initialData.dueDate).toISOString().split('T')[0]
        : '';

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'Pending',
        priority: initialData.priority || 'Medium',
        dueDate: formattedDate
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0]
      });
    }

    setError('');

    // Focus title input field when modal opens
    if (isOpen) {
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Task description is required');
      return;
    }
    if (!formData.dueDate) {
      setError('Due date is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content animate-pop-in" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{titleText}</h2>
          <button onClick={onClose} className="btn-icon" style={{ borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            color: 'var(--danger)',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title Input with useRef auto-focus */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              ref={titleInputRef}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Implement JWT Authentication"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the task..."
              rows={3}
              className="form-textarea"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
