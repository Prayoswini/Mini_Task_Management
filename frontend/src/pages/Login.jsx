import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, Lock, Mail, Eye, EyeOff, ShieldCheck, Zap, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, role } = useContext(AuthContext);
  const navigate = useNavigate();

  // If user is already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const result = await login(email, password);
      
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Invalid email or password credentials');
      }
    } catch (err) {
      setError('Connection error. Please ensure backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 60%, #020617 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1020px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2.5rem',
        alignItems: 'center'
      }}>
        {/* Left Side: Product Branding Hero */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              background: 'var(--primary-gradient)',
              padding: '12px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
            }}>
              <CheckSquare size={32} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
              TaskFlow<span style={{ color: 'var(--primary)' }}>Pro</span>
            </span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-1px' }}>
            Manage Tasks with <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Speed & Precision</span>
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '440px' }}>
            Streamline project workflows, monitor real-time stats, enforce role-based access control, and collaborate effortlessly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '10px', color: '#10b981' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>Role-Based Access Control</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Separate Admin and User dashboards & APIs</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '8px', borderRadius: '10px', color: '#818cf8' }}>
                <Zap size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>Real-time Task Management</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Status tracking, priority tags & instant search</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Glassmorphism Login Form */}
        <div className="glass-card animate-pop-in" style={{ padding: '2.5rem', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ marginBottom: '1.8rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please enter your account details to sign in</p>
          </div>

          {error && (
            <div style={{
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              color: 'var(--danger)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <AlertCircle size={18} flexShrink={0} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={14} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '1.5rem' }}
            >
              {isSubmitting ? (
                'Signing in...'
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
