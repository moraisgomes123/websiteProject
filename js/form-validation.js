// Form validation utility
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.validateForm()) {
            this.submitForm();
        }
    }

    validateForm() {
        this.errors = {};
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            this.validateField(field);
        });

        this.displayErrors();
        return Object.keys(this.errors).length === 0;
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;

        // Clear previous error
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.addError(name, `${field.labels[0]?.textContent || 'This field'} is required`);
            return;
        }

        // Email validation
        if (field.type === 'email' && value) {
            if (!this.isValidEmail(value)) {
                this.addError(name, 'Please enter a valid email address');
            }
        }

        // Phone validation
        if ((field.type === 'tel' || field.name.includes('phone')) && value) {
            if (!this.isValidPhone(value)) {
                this.addError(name, 'Please enter a valid phone number');
            }
        }

        // Text length validation
        if (field.type === 'textarea' && value) {
            if (value.length < 10) {
                this.addError(name, 'Message must be at least 10 characters long');
            }
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    addError(fieldName, message) {
        if (!this.errors[fieldName]) {
            this.errors[fieldName] = [];
        }
        this.errors[fieldName].push(message);
    }

    displayErrors() {
        // Clear all previous errors
        this.clearAllErrors();

        // Display new errors
        for (const [fieldName, messages] of Object.entries(this.errors)) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            const errorElement = document.getElementById(`${fieldName}Error`);
            
            if (field && errorElement) {
                field.classList.add('error');
                errorElement.textContent = messages[0];
            }
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.classList.remove('error');
        });
    }

    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="loading"></span> Processing...';
        submitButton.disabled = true;

        try {
            // Simulate API call - replace with actual endpoint
            const response = await this.sendFormData(data);
            
            if (response.success) {
                this.showSuccess();
                this.form.reset();
            } else {
                this.showError('There was an error submitting the form. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('There was an error submitting the form. Please try again.');
        } finally {
            // Restore button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    async sendFormData(data) {
        // Replace this with actual form submission logic
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data });
            }, 2000);
        });
    }

    showSuccess() {
        const successElement = document.getElementById('formSuccess');
        if (successElement) {
            successElement.style.display = 'block';
            setTimeout(() => {
                successElement.style.display = 'none';
            }, 5000);
        }
        
        // Scroll to success message
        successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showError(message) {
        // Create temporary error display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'background: #f8d7da; color: #721c24; padding: 15px; margin: 20px 0; border-radius: 4px; border: 1px solid #f5c6cb;';
        errorDiv.textContent = message;
        
        this.form.parentNode.insertBefore(errorDiv, this.form);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize validators when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        new FormValidator('contactForm');
    }

    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        new FormValidator('enquiryForm');
    }
});