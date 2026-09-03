import React from 'react';
import { Calendar, Edit3, Trash2, User, Clock, CheckCircle, PlayCircle, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isAdminView = false }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-completed"><CheckCircle size={12} /> Completed</span>;
      case 'In Progress':
        return <span className="badge badge-in-progress"><PlayCircle size={12} /> In Progress</span>;
      default:
        return <span className="badge badge-pending"><Clock size={12} /> Pending</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="badge badge-high">High</span>;
      case 'Low':
        return <span className="badge badge-low">Low</span>;
      default:
        return <span className="badge badge-medium">Medium</span>;
    }
  };

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'No Date';

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
          {task.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          {getPriorityBadge(task.priority)}
          {getStatusBadge(task.status)}
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {task.description}
      </p>

      {isAdminView && task.createdBy && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.04)', padding: '4px 8px', borderRadius: '6px', width: 'fit-content' }}>
          <User size={13} color="var(--primary)" />
          <span>Owner: <strong>{task.createdBy.name || task.createdBy.email || 'Unknown'}</strong></span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Calendar size={14} />
          <span>{formattedDueDate}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick status change dropdown */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '0.775rem',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {onEdit && (
            <button onClick={() => onEdit(task)} className="btn-icon" title="Edit Task">
              <Edit3 size={15} color="var(--primary)" />
            </button>
          )}

          {onDelete && (
            <button onClick={() => onDelete(task._id)} className="btn-icon" title="Delete Task">
              <Trash2 size={15} color="var(--danger)" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
