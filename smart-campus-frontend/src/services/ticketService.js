import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/tickets';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const fileApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const ticketService = {
    // Create ticket with attachments
    createTicket: (formData) => fileApi.post('', formData),
    
    // Get all tickets (FIXED: removed the slash)
    getTickets: (userId, role, filters = {}) => {
        const params = { userId, role, ...filters };
        return api.get('', { params });  // Changed from '/' to ''
    },
    
    // Get single ticket
    getTicketById: (ticketId) => api.get(`/${ticketId}`),
    
    // Update status
    updateStatus: (ticketId, status, resolutionNotes, rejectedReason, userId, role) => {
        const params = { status, resolutionNotes, rejectedReason, userId, role };
        return api.put(`/${ticketId}/status`, null, { params });
    },
    
    // Assign technician
    assignTechnician: (ticketId, technicianId, role) => {
        return api.patch(`/${ticketId}/assign`, null, { params: { technicianId, role } });
    },
    
    // Add comment
    addComment: (ticketId, content, userId, userRole) => {
        const params = { content, userId, userRole };
        return api.post(`/${ticketId}/comments`, null, { params });
    },
    
    // Get comments
    getComments: (ticketId) => api.get(`/${ticketId}/comments`),
    
    // Edit comment
    editComment: (commentId, content, userId) => {
        return api.put(`/comments/${commentId}`, null, { params: { content, userId } });
    },
    
    // Delete comment
    deleteComment: (commentId, userId) => {
        return api.delete(`/comments/${commentId}`, { params: { userId } });
    },
};

export default ticketService;