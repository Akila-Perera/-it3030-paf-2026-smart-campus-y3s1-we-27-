import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { useAuth } from '../context/AuthContext';
import './TicketAdminDashboard.css';

const TicketAdminDashboard = () => {
    const { user, isLoggedIn } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Map role from auth
    const mapRole = (role) => {
        switch(role) {
            case 'STUDENT': return 'USER';
            case 'LECTURER': return 'TECHNICIAN';
            case 'ADMIN': return 'ADMIN';
            default: return 'USER';
        }
    };
    
    const userId = user?.email;
    const userRole = mapRole(user?.role);
    
    useEffect(() => {
        if (isLoggedIn && userRole === 'ADMIN') {
            loadTickets();
        }
    }, [isLoggedIn]);
    
    const loadTickets = async () => {
        setLoading(true);
        try {
            const response = await ticketService.getTickets(userId, userRole, {});
            setTickets(response.data);
        } catch (error) {
            console.error('Error loading tickets:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'OPEN': return 'table-badge-open';
            case 'IN_PROGRESS': return 'table-badge-progress';
            case 'RESOLVED': return 'table-badge-resolved';
            case 'CLOSED': return 'table-badge-closed';
            case 'REJECTED': return 'table-badge-rejected';
            default: return 'table-badge-open';
        }
    };
    
    const getPriorityClass = (priority) => {
        switch(priority) {
            case 'URGENT': return 'table-priority-urgent';
            case 'HIGH': return 'table-priority-high';
            case 'MEDIUM': return 'table-priority-medium';
            case 'LOW': return 'table-priority-low';
            default: return 'table-priority-medium';
        }
    };
    
    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length,
        closed: tickets.filter(t => t.status === 'CLOSED').length,
        rejected: tickets.filter(t => t.status === 'REJECTED').length
    };
    
    const statusDistribution = {
        OPEN: tickets.filter(t => t.status === 'OPEN').length,
        IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        RESOLVED: tickets.filter(t => t.status === 'RESOLVED').length,
        CLOSED: tickets.filter(t => t.status === 'CLOSED').length,
        REJECTED: tickets.filter(t => t.status === 'REJECTED').length
    };
    
    const priorityDistribution = {
        URGENT: tickets.filter(t => t.priority === 'URGENT').length,
        HIGH: tickets.filter(t => t.priority === 'HIGH').length,
        MEDIUM: tickets.filter(t => t.priority === 'MEDIUM').length,
        LOW: tickets.filter(t => t.priority === 'LOW').length
    };
    
    const categoryDistribution = {};
    tickets.forEach(ticket => {
        categoryDistribution[ticket.category] = (categoryDistribution[ticket.category] || 0) + 1;
    });
    
    const recentTickets = [...tickets]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    const maxStatusCount = Math.max(...Object.values(statusDistribution), 1);
    const maxPriorityCount = Math.max(...Object.values(priorityDistribution), 1);
    const maxCategoryCount = Math.max(...Object.values(categoryDistribution), 1);
    
    if (loading || !isLoggedIn) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }
    
    if (userRole !== 'ADMIN') {
        return (
            <div className="dashboard-container">
                <div className="empty-state">
                    <div className="empty-icon">🔒</div>
                    <p className="empty-text">Access denied. Admin only.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Ticket Analytics Dashboard</h1>
                <p className="dashboard-subtitle">Complete overview of all tickets and system analytics</p>
            </div>
            
            <div className="stats-grid">
                <div className="stat-card total">
                    <div className="stat-header">
                        <p className="stat-label">Total Tickets</p>
                        <span className="stat-icon">📊</span>
                    </div>
                    <p className="stat-value stat-total">{stats.total}</p>
                </div>
                <div className="stat-card open">
                    <div className="stat-header">
                        <p className="stat-label">Open</p>
                        <span className="stat-icon">🟢</span>
                    </div>
                    <p className="stat-value stat-open">{stats.open}</p>
                </div>
                <div className="stat-card progress">
                    <div className="stat-header">
                        <p className="stat-label">In Progress</p>
                        <span className="stat-icon">🔄</span>
                    </div>
                    <p className="stat-value stat-progress">{stats.inProgress}</p>
                </div>
                <div className="stat-card resolved">
                    <div className="stat-header">
                        <p className="stat-label">Resolved</p>
                        <span className="stat-icon">✅</span>
                    </div>
                    <p className="stat-value stat-resolved">{stats.resolved}</p>
                </div>
                <div className="stat-card closed">
                    <div className="stat-header">
                        <p className="stat-label">Closed</p>
                        <span className="stat-icon">🔒</span>
                    </div>
                    <p className="stat-value stat-closed">{stats.closed}</p>
                </div>
                <div className="stat-card rejected">
                    <div className="stat-header">
                        <p className="stat-label">Rejected</p>
                        <span className="stat-icon">❌</span>
                    </div>
                    <p className="stat-value stat-rejected">{stats.rejected}</p>
                </div>
            </div>
            
            <div className="charts-row">
                <div className="chart-card">
                    <div className="chart-title">
                        <span>📈</span> Tickets by Status
                    </div>
                    <div className="status-list">
                        {Object.entries(statusDistribution).map(([status, count]) => (
                            <div key={status} className="status-item">
                                <div className={`status-dot status-dot-${status.toLowerCase()}`}></div>
                                <div className="status-info">
                                    <span className="status-name">{status}</span>
                                    <span className="status-count">{count}</span>
                                </div>
                                <div className="status-bar-bg">
                                    <div 
                                        className={`status-bar-fill status-bar-${status.toLowerCase()}`}
                                        style={{ width: `${(count / maxStatusCount) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="chart-card">
                    <div className="chart-title">
                        <span>⚠️</span> Tickets by Priority
                    </div>
                    <div className="priority-list">
                        {Object.entries(priorityDistribution).map(([priority, count]) => (
                            <div key={priority} className="priority-item">
                                <span className={`priority-badge priority-${priority.toLowerCase()}`}>
                                    {priority}
                                </span>
                                <span className="priority-count">{count}</span>
                                <div className="priority-bar-bg">
                                    <div 
                                        className="priority-bar-fill"
                                        style={{ 
                                            width: `${(count / maxPriorityCount) * 100}%`,
                                            backgroundColor: 
                                                priority === 'URGENT' ? '#dc2626' :
                                                priority === 'HIGH' ? '#f97316' :
                                                priority === 'MEDIUM' ? '#3b82f6' : '#6b7280'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="section-card">
                <div className="section-header">
                    <div className="section-title">
                        <span className="section-title-icon">📁</span>
                        Tickets by Category
                    </div>
                    <div className="section-badge">{Object.keys(categoryDistribution).length} categories</div>
                </div>
                <div className="category-list">
                    {Object.entries(categoryDistribution).map(([category, count]) => (
                        <div key={category} className="category-item">
                            <span className="category-name">{category}</span>
                            <span className="category-count">{count}</span>
                            <div className="category-bar-bg">
                                <div 
                                    className="category-bar-fill"
                                    style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="recent-section">
                <div className="recent-header">
                    <div className="recent-title">
                        <span>🕐</span> Recent Tickets
                    </div>
                    <Link to="/tickets" className="view-all-link">
                        View all tickets →
                    </Link>
                </div>
                <div className="table-container">
                    <table className="tickets-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Resource</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td style={{ fontFamily: 'monospace' }}>#{ticket.id?.slice(-8)}</td>
                                    <td><strong>{ticket.resourceId}</strong></td>
                                    <td>{ticket.category}</td>
                                    <td>
                                        <span className={`table-priority ${getPriorityClass(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`table-badge ${getStatusBadgeClass(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/tickets/${ticket.id}`} className="table-link">
                                            View Details →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TicketAdminDashboard;