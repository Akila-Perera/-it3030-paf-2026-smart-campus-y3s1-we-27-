import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import './TicketDetailPage.css';

const TicketDetailPage = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [statusUpdate, setStatusUpdate] = useState({ 
        status: '', 
        resolutionNotes: '', 
        rejectedReason: '' 
    });
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // NEW: For image modal
    
    const userId = 'test@email.com';
    const userRole = 'ADMIN';
    
    useEffect(() => {
        loadTicketDetails();
        loadComments();
    }, [ticketId]);
    
    const loadTicketDetails = async () => {
        try {
            const response = await ticketService.getTicketById(ticketId);
            setTicket(response.data);
            setStatusUpdate({ 
                status: response.data.status, 
                resolutionNotes: '', 
                rejectedReason: '' 
            });
        } catch (error) {
            console.error('Error loading ticket:', error);
            navigate('/tickets');
        }
    };
    
    const loadComments = async () => {
        try {
            const response = await ticketService.getComments(ticketId);
            setComments(response.data);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        
        try {
            await ticketService.addComment(ticketId, newComment, userId, userRole);
            setNewComment('');
            loadComments();
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        }
    };
    
    const handleEditComment = async (commentId) => {
        try {
            await ticketService.editComment(commentId, editingContent, userId);
            setEditingCommentId(null);
            setEditingContent('');
            loadComments();
        } catch (error) {
            console.error('Error editing comment:', error);
            alert('Failed to edit comment');
        }
    };
    
    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await ticketService.deleteComment(commentId, userId);
                loadComments();
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('Failed to delete comment');
            }
        }
    };
    
    const handleUpdateStatus = async () => {
        try {
            await ticketService.updateStatus(
                ticketId,
                statusUpdate.status,
                statusUpdate.resolutionNotes,
                statusUpdate.rejectedReason,
                userId,
                userRole
            );
            setShowStatusModal(false);
            loadTicketDetails();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };
    
    const handleAssignTechnician = async () => {
        const technicianEmail = prompt('Enter technician email address:');
        if (!technicianEmail) return;
        
        try {
            await ticketService.assignTechnician(ticketId, technicianEmail, userRole);
            alert('Technician assigned successfully!');
            loadTicketDetails();
        } catch (error) {
            console.error('Error assigning technician:', error);
            alert('Failed to assign technician');
        }
    };
    
    const getPriorityClass = (priority) => {
        switch(priority) {
            case 'URGENT': return 'priority-urgent';
            case 'HIGH': return 'priority-high';
            case 'MEDIUM': return 'priority-medium';
            case 'LOW': return 'priority-low';
            default: return 'priority-medium';
        }
    };
    
    const getStatusClass = (status) => {
        switch(status) {
            case 'OPEN': return 'status-open';
            case 'IN_PROGRESS': return 'status-progress';
            case 'RESOLVED': return 'status-resolved';
            case 'CLOSED': return 'status-closed';
            case 'REJECTED': return 'status-rejected';
            default: return 'status-open';
        }
    };
    
    const getRoleClass = (role) => {
        switch(role) {
            case 'ADMIN': return 'comment-role-admin';
            case 'TECHNICIAN': return 'comment-role-technician';
            default: return 'comment-role-user';
        }
    };
    
    if (loading || !ticket) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }
    
    return (
        <div className="detail-container">
            {/* Back Button */}
            <Link to="/tickets" className="back-button">
                ← Back to Tickets
            </Link>
            
            {/* Ticket Card */}
            <div className="ticket-card">
                <div className="ticket-header">
                    <div>
                        <div className="ticket-id-section">
                            <span className="ticket-id-label">Ticket ID</span>
                            <span className="ticket-id-value">#{ticket.id?.slice(-8)}</span>
                            <span className="ticket-date">
                                Created: {new Date(ticket.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div className="ticket-badges">
                        <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                            {ticket.priority}
                        </span>
                        <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>
                
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Resource ID</span>
                        <span className="info-value">{ticket.resourceId}</span>
                    </div>
                    
                    {ticket.location && (
                        <div className="info-item">
                            <span className="info-label">Location</span>
                            <span className="info-value">{ticket.location}</span>
                        </div>
                    )}
                    
                    <div className="info-item">
                        <span className="info-label">Category</span>
                        <span className="info-value">{ticket.category}</span>
                    </div>
                    
                    <div className="info-item">
                        <span className="info-label">Created By</span>
                        <span className="info-value">{ticket.createdBy}</span>
                    </div>
                    
                    {ticket.assignedTo && (
                        <div className="info-item">
                            <span className="info-label">Assigned To</span>
                            <span className="assigned-badge">{ticket.assignedTo}</span>
                        </div>
                    )}
                    
                    <div className="info-item info-description">
                        <span className="info-label">Description</span>
                        <p className="description-text">{ticket.description}</p>
                    </div>
                </div>
                
                {/* Resolution Notes */}
                {ticket.resolutionNotes && (
                    <div className="resolution-box">
                        <span className="resolution-label">Resolution Notes</span>
                        <p className="resolution-text">{ticket.resolutionNotes}</p>
                    </div>
                )}
                
                {/* Rejection Reason */}
                {ticket.rejectedReason && (
                    <div className="rejection-box">
                        <span className="rejection-label">Rejection Reason</span>
                        <p className="rejection-text">{ticket.rejectedReason}</p>
                    </div>
                )}
                
                {/* Attachments Section - NEW */}
                {ticket.attachmentList && ticket.attachmentList.length > 0 && (
                    <div className="attachments-section">
                        <div className="attachments-title">
                            📎 Attachments ({ticket.attachmentList.length})
                        </div>
                        <div className="attachments-grid">
                            {ticket.attachmentList.map((attachment) => (
                                <div 
                                    key={attachment.id} 
                                    className="attachment-card"
                                    onClick={() => setSelectedImage(`http://localhost:8081/api/attachments/${attachment.id}?userId=${userId}&role=${userRole}`)}
                                >
                                    <img 
                                        src={`http://localhost:8081/api/attachments/${attachment.id}?userId=${userId}&role=${userRole}`}
                                        alt={attachment.fileName}
                                        className="attachment-image"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Action Buttons */}
                {(userRole === 'ADMIN' || userRole === 'TECHNICIAN') && (
                    <div className="button-group">
                        <button onClick={() => setShowStatusModal(true)} className="btn-primary">
                            Update Status
                        </button>
                        {userRole === 'ADMIN' && !ticket.assignedTo && (
                            <button onClick={handleAssignTechnician} className="btn-secondary">
                                Assign Technician
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            {/* Comments Section */}
            <div className="comments-section">
                <h3 className="comments-title">Comments</h3>
                
                {/* Add Comment */}
                <div className="add-comment-form">
                    <textarea
                        rows="3"
                        className="comment-textarea"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button onClick={handleAddComment} className="btn-post">
                        Post Comment
                    </button>
                </div>
                
                {/* Comments List */}
                <div className="comments-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <div className="comment-author">
                                    <span className="comment-email">{comment.userId}</span>
                                    <span className={`comment-role ${getRoleClass(comment.userRole)}`}>
                                        {comment.userRole}
                                    </span>
                                </div>
                                <div className="comment-date">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </div>
                                {comment.userId === userId && !editingCommentId && (
                                    <div className="comment-actions">
                                        <button 
                                            onClick={() => {
                                                setEditingCommentId(comment.id);
                                                setEditingContent(comment.content);
                                            }}
                                            className="comment-edit-btn"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="comment-delete-btn"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {editingCommentId === comment.id ? (
                                <div className="edit-form">
                                    <textarea
                                        className="edit-textarea"
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                    />
                                    <div className="edit-buttons">
                                        <button 
                                            onClick={() => handleEditComment(comment.id)}
                                            className="btn-save"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={() => setEditingCommentId(null)}
                                            className="btn-cancel"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="comment-content">{comment.content}</p>
                            )}
                        </div>
                    ))}
                    
                    {comments.length === 0 && (
                        <div className="no-comments">
                            No comments yet. Be the first to comment!
                        </div>
                    )}
                </div>
            </div>
            
            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Update Ticket Status</h3>
                        
                        <select
                            className="modal-select"
                            value={statusUpdate.status}
                            onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        
                        {statusUpdate.status === 'RESOLVED' && (
                            <textarea
                                className="modal-textarea"
                                placeholder="Resolution notes..."
                                value={statusUpdate.resolutionNotes}
                                onChange={(e) => setStatusUpdate({...statusUpdate, resolutionNotes: e.target.value})}
                            />
                        )}
                        
                        {statusUpdate.status === 'REJECTED' && (
                            <textarea
                                className="modal-textarea"
                                placeholder="Rejection reason..."
                                value={statusUpdate.rejectedReason}
                                onChange={(e) => setStatusUpdate({...statusUpdate, rejectedReason: e.target.value})}
                            />
                        )}
                        
                        <div className="modal-buttons">
                            <button onClick={() => setShowStatusModal(false)} className="modal-cancel">
                                Cancel
                            </button>
                            <button onClick={handleUpdateStatus} className="modal-update">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Image Modal - NEW */}
            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <span className="close-modal">&times;</span>
                    <img src={selectedImage} alt="Full size" className="modal-image" />
                </div>
            )}
        </div>
    );
};

export default TicketDetailPage;