import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import './CreateTicketPage.css';

const CreateTicketPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    
    const [formData, setFormData] = useState({
        resourceId: '',
        location: '',
        category: '',
        description: '',
        priority: 'MEDIUM',
        preferredContact: ''
    });
    
    const userId = 'test@email.com';
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length > 3) {
            alert('Maximum 3 attachments allowed');
            setAttachments(files.slice(0, 3));
        } else {
            setAttachments(files);
        }
        
        const urls = files.slice(0, 3).map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };
    
    const removeAttachment = (index) => {
        const newAttachments = attachments.filter((_, i) => i !== index);
        const newPreviews = previewUrls.filter((_, i) => i !== index);
        setAttachments(newAttachments);
        setPreviewUrls(newPreviews);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        data.append('resourceId', formData.resourceId);
        data.append('location', formData.location);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('priority', formData.priority);
        data.append('preferredContact', formData.preferredContact);
        data.append('createdBy', userId);
        
        attachments.forEach(file => {
            data.append('attachments', file);
        });
        
        try {
            await ticketService.createTicket(data);
            navigate('/tickets');
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="create-ticket-container">
            <div className="page-header">
                <h1 className="page-title">Create New Ticket</h1>
                <p className="page-subtitle">Report an issue or request support</p>
            </div>
            
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    {/* Resource ID */}
                    <div className="form-group">
                        <label className="form-label form-label-required">Resource ID</label>
                        <input
                            type="text"
                            name="resourceId"
                            required
                            className="form-input"
                            value={formData.resourceId}
                            onChange={handleChange}
                            placeholder="e.g., LAB-101, HALL-A, PROJ-001"
                        />
                    </div>
                    
                    {/* Location */}
                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            name="location"
                            className="form-input"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Building name, floor, room number"
                        />
                    </div>
                    
                    {/* Category and Priority Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label form-label-required">Category</label>
                            <select
                                name="category"
                                required
                                className="form-select"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select category</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Software">Software</option>
                                <option value="Network">Network</option>
                                <option value="Facility">Facility</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label form-label-required">Priority</label>
                            <select
                                name="priority"
                                required
                                className="form-select"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label form-label-required">Description</label>
                        <textarea
                            name="description"
                            required
                            className="form-textarea"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue in detail..."
                        />
                    </div>
                    
                    {/* Preferred Contact */}
                    <div className="form-group">
                        <label className="form-label">Preferred Contact (Email)</label>
                        <input
                            type="email"
                            name="preferredContact"
                            className="form-input"
                            value={formData.preferredContact}
                            onChange={handleChange}
                            placeholder="your@email.com"
                        />
                    </div>
                    
                    {/* Attachments */}
                    <div className="form-group">
                        <label className="form-label">Attachments (Max 3 images)</label>
                        <div 
                            className="file-upload-area"
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <div className="file-upload-icon">📎</div>
                            <div className="file-upload-text">Click to upload images</div>
                            <div className="file-upload-subtext">PNG, JPG, GIF up to 10MB</div>
                            <input
                                id="file-input"
                                type="file"
                                multiple
                                accept="image/*"
                                className="file-upload-input"
                                onChange={handleFileChange}
                            />
                        </div>
                        
                        <div className="file-counter">
                            {attachments.length}/3 files selected
                        </div>
                        
                        {/* Image Previews */}
                        {previewUrls.length > 0 && (
                            <div className="previews-container">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="preview-item">
                                        <img src={url} alt={`Preview ${index + 1}`} className="preview-image" />
                                        <button 
                                            type="button"
                                            className="preview-remove"
                                            onClick={() => removeAttachment(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Creating Ticket...' : 'Create Ticket'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketPage;