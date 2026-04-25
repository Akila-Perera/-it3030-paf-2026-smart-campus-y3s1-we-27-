import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import './TicketsPage.css';

const TicketsPage = () => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        priority: ''
    });
    
    const userId = 'test@email.com';
    const userRole = 'ADMIN';
    
    useEffect(() => {
        loadTickets();
    }, []);
    
    // Apply filters whenever tickets or filters change
    useEffect(() => {
        applyFilters();
    }, [tickets, filters]);
    
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
    
    const applyFilters = () => {
        let filtered = [...tickets];
        
        // Filter by status
        if (filters.status && filters.status !== '') {
            filtered = filtered.filter(ticket => ticket.status === filters.status);
        }
        
        // Filter by category
        if (filters.category && filters.category !== '') {
            filtered = filtered.filter(ticket => ticket.category === filters.category);
        }
        
        // Filter by priority
        if (filters.priority && filters.priority !== '') {
            filtered = filtered.filter(ticket => ticket.priority === filters.priority);
        }
        
        setFilteredTickets(filtered);
    };
    
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };
    
    const clearAllFilters = () => {
        setFilters({
            status: '',
            category: '',
            priority: ''
        });
    };
    
    const hasActiveFilters = filters.status !== '' || filters.category !== '' || filters.priority !== '';
    
    const getStatusColor = (status) => {
        switch(status) {
            case 'OPEN': return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
            case 'RESOLVED': return 'bg-purple-100 text-purple-800';
            case 'CLOSED': return 'bg-gray-100 text-gray-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'URGENT': return 'bg-red-600 text-white';
            case 'HIGH': return 'bg-orange-500 text-white';
            case 'MEDIUM': return 'bg-blue-500 text-white';
            case 'LOW': return 'bg-gray-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };
    
    // UPDATED STATS - Separate RESOLVED and CLOSED
    const stats = {
        total: filteredTickets.length,
        open: filteredTickets.filter(t => t.status === 'OPEN').length,
        inProgress: filteredTickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: filteredTickets.filter(t => t.status === 'RESOLVED').length,
        closed: filteredTickets.filter(t => t.status === 'CLOSED').length,
        rejected: filteredTickets.filter(t => t.status === 'REJECTED').length
    };
    
    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }
    
    return (
        <div className="tickets-container">
            {/* Header */}
            <div className="tickets-header">
                <div>
                    <h1 className="tickets-title">Tickets</h1>
                    <p className="tickets-subtitle">Manage and track support requests</p>
                </div>
                <Link to="/tickets/create">
                    <button className="btn-primary">+ New Ticket</button>
                </Link>
            </div>
            
            {/* Stats - 6 Cards for Full Workflow */}
            <div className="stats-grid">
                <div className="stat-card">
                    <p className="stat-label">Total</p>
                    <p className="stat-value stat-total">{stats.total}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Open</p>
                    <p className="stat-value stat-open">{stats.open}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">In Progress</p>
                    <p className="stat-value stat-progress">{stats.inProgress}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Resolved</p>
                    <p className="stat-value" style={{ color: '#8b5cf6' }}>{stats.resolved}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Closed</p>
                    <p className="stat-value" style={{ color: '#6b7280' }}>{stats.closed}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Rejected</p>
                    <p className="stat-value" style={{ color: '#ef4444' }}>{stats.rejected}</p>
                </div>
            </div>
            
            {/* Filters */}
            <div className="filters-bar">
                <div className="filters-group">
                    <select
                        className="filter-select"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    
                    <select
                        className="filter-select"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Software">Software</option>
                        <option value="Network">Network</option>
                        <option value="Facility">Facility</option>
                        <option value="Other">Other</option>
                    </select>
                    
                    <select
                        className="filter-select"
                        value={filters.priority}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>
                    
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="clear-filters"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            </div>
            
            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="active-filters">
                    <span className="active-filters-label">Active filters:</span>
                    {filters.status && (
                        <span className="filter-tag">
                            Status: {filters.status}
                            <button onClick={() => handleFilterChange('status', '')} className="filter-tag-remove">×</button>
                        </span>
                    )}
                    {filters.category && (
                        <span className="filter-tag">
                            Category: {filters.category}
                            <button onClick={() => handleFilterChange('category', '')} className="filter-tag-remove">×</button>
                        </span>
                    )}
                    {filters.priority && (
                        <span className="filter-tag">
                            Priority: {filters.priority}
                            <button onClick={() => handleFilterChange('priority', '')} className="filter-tag-remove">×</button>
                        </span>
                    )}
                </div>
            )}
            
            {/* Tickets List */}
            {filteredTickets.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <p className="empty-text">No tickets match your filters</p>
                    <button onClick={clearAllFilters} className="btn-primary">Clear Filters</button>
                </div>
            )}
            
            <div className="tickets-list">
                {filteredTickets.map((ticket) => (
                    <Link to={`/tickets/${ticket.id}`} key={ticket.id} className="ticket-card">
                        <div className="ticket-content">
                            <div className="ticket-info">
                                <div className="badges-group">
                                    <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                    <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    <span className="category-badge">
                                        {ticket.category}
                                    </span>
                                </div>
                                
                                <div className="ticket-meta">
                                    <span className="ticket-id">#{ticket.id?.slice(-8)}</span>
                                    <span className="ticket-resource">{ticket.resourceId}</span>
                                    {ticket.location && (
                                        <span className="ticket-location">📍 {ticket.location}</span>
                                    )}
                                </div>
                                
                                <p className="ticket-description">
                                    {ticket.description}
                                </p>
                                
                                <div className="ticket-footer">
                                    <span>📅 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    {ticket.assignedTo && (
                                        <span>👤 {ticket.assignedTo.split('@')[0]}</span>
                                    )}
                                </div>
                            </div>
                            <div className="ticket-arrow">→</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TicketsPage;