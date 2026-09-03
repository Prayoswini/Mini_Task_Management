import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { LayoutGrid, Table as TableIcon, Inbox, Calendar, Trash2, Edit3, User, Clock, CheckCircle, PlayCircle } from 'lucide-react';

const TaskList = ({ tasks = [], loading = false, onEdit, onDelete, onStatusChange, isAdminView = false }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card" style={{ height: '180px', padding: '1.25rem', opacity: 0.5, animation: 'pulseGlow 1.5s infinite ease-in-out' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', height: '20px', width: '60%', borderRadius: '4px', marginBottom: '12px' }} />
            <div style={{ background: 'rgba(255,255,255,0.05)', height: '14px', width: '90%', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ background: 'rgba(255,255,255,0.05)', height: '14px', width: '40%', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.25rem', borderRadius: '50%', color: 'var(--primary)' }}>
          <Inbox size={48} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>No Tasks Found</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.9rem' }}>
          {isAdminView
            ? 'There are currently no tasks matching your search or filters.'
            : 'You haven\'t created any tasks matching your criteria yet. Click "Create New Task" to get started!'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* View Switcher Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '0.5rem' }}>
        <button
          onClick={() => setViewMode('grid')}
          className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
          title="Grid View"
        >
          <LayoutGrid size={15} /> Grid
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
          title="Table View"
        >
          <TableIcon size={15} /> Table
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              isAdminView={isAdminView}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Title & Description</th>
                {isAdminView && <th style={{ padding: '1rem' }}>Owner</th>}
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Priority</th>
                <th style={{ padding: '1rem' }}>Due Date</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{task.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxLines: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                      {task.description}
                    </div>
                  </td>
                  {isAdminView && (
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                        <User size={14} color="var(--primary)" />
                        <span>{task.createdBy?.name || task.createdBy?.email || 'N/A'}</span>
                      </div>
                    </td>
                  )}
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value)}
                      style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.8rem',
                        color: 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-${task.priority?.toLowerCase() || 'medium'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      {onEdit && (
                        <button onClick={() => onEdit(task)} className="btn-icon" title="Edit">
                          <Edit3 size={16} color="var(--primary)" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(task._id)} className="btn-icon" title="Delete">
                          <Trash2 size={16} color="var(--danger)" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskList;
