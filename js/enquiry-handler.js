// Enquiry form specific functionality
class EnquiryHandler {
    constructor() {
        this.init();
    }

    init() {
        const enquiryForm = document.getElementById('enquiryForm');
        if (enquiryForm) {
            // Add change listener for enquiry type
            const enquiryType = document.getElementById('enquiryType');
            if (enquiryType) {
                enquiryType.addEventListener('change', () => this.handleEnquiryTypeChange());
            }
        }
    }

    handleEnquiryTypeChange() {
        const enquiryType = document.getElementById('enquiryType').value;
        this.updateFormBasedOnType(enquiryType);
    }

    updateFormBasedOnType(type) {
        const budgetField = document.querySelector('input[name="budget"], select[name="budget"]');
        const timelineField = document.querySelector('select[name="timeline"]');
        
        if (budgetField && timelineField) {
            const budgetGroup = budgetField.closest('.form-group');
            const timelineGroup = timelineField.closest('.form-group');
            
            if (budgetGroup && timelineGroup) {
                switch(type) {
                    case 'volunteer':
                    case 'sponsor':
                        budgetGroup.style.display = 'none';
                        timelineGroup.style.display = 'none';
                        break;
                    default:
                        budgetGroup.style.display = 'block';
                        timelineGroup.style.display = 'block';
                }
            }
        }
    }

    async processEnquiry(data) {
        try {
            // Simulate processing
            const response = await this.submitEnquiry(data);
            
            if (response.success) {
                this.showEnquiryResponse(data);
                document.getElementById('enquiryForm').style.display = 'none';
            }
        } catch (error) {
            console.error('Enquiry processing error:', error);
            this.showError('There was an error processing your enquiry. Please try again.');
        }
    }

    async submitEnquiry(data) {
        // Simulate API call - replace with actual endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    success: true, 
                    data,
                    response: this.generateResponse(data)
                });
            }, 1500);
        });
    }

    generateResponse(data) {
        const responses = {
            service: `Thank you for your interest in our services! Our team will review your requirements and contact you within 24 hours with detailed information and pricing.`,
            product: `Thank you for your product enquiry! We'll send you detailed specifications, pricing, and availability information shortly.`,
            volunteer: `Thank you for your interest in volunteering! Our volunteer coordinator will contact you with available opportunities and next steps.`,
            sponsor: `Thank you for considering sponsorship! Our partnership team will reach out to discuss potential collaboration opportunities.`,
            partnership: `Thank you for your partnership enquiry! We're excited to explore opportunities with you and will contact you soon.`
        };

        return responses[data.enquiryType] || 'Thank you for your enquiry! We will get back to you soon.';
    }

    showEnquiryResponse(data) {
        const responseSection = document.getElementById('enquiryResponse');
        const responseDetails = document.getElementById('responseDetails');
        
        if (responseSection && responseDetails) {
            const response = this.generateResponse(data);
            responseDetails.innerHTML = `
                <p>${response}</p>
                <div class="response-summary">
                    <h4>Enquiry Summary:</h4>
                    <ul>
                        <li><strong>Type:</strong> ${this.getEnquiryTypeLabel(data.enquiryType)}</li>
                        <li><strong>Name:</strong> ${data.enquiryName}</li>
                        <li><strong>Email:</strong> ${data.enquiryEmail}</li>
                        ${data.company ? `<li><strong>Company:</strong> ${data.company}</li>` : ''}
                    </ul>
                </div>
            `;
            responseSection.style.display = 'block';
            responseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    getEnquiryTypeLabel(type) {
        const labels = {
            service: 'Service Information',
            product: 'Product Details',
            volunteer: 'Volunteer Opportunity',
            sponsor: 'Sponsorship',
            partnership: 'Partnership'
        };
        return labels[type] || type;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'background: #f8d7da; color: #721c24; padding: 15px; margin: 20px 0; border-radius: 4px; border: 1px solid #f5c6cb;';
        errorDiv.textContent = message;
        
        const form = document.getElementById('enquiryForm');
        form.parentNode.insertBefore(errorDiv, form);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize enquiry handler
document.addEventListener('DOMContentLoaded', () => {
    new EnquiryHandler();
});
