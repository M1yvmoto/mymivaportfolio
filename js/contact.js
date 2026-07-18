document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    // Inputs
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    // Success Modal Elements
    const modalOverlay = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page refresh

            let isValid = true;

            // 1. Validate Name
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required.');
                isValid = false;
            } else {
                showSuccess(nameInput);
            }

            // 2. Validate Email
            const emailValue = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailValue === '') {
                showError(emailInput, 'Email address is required.');
                isValid = false;
            } else if (!emailRegex.test(emailValue)) {
                showError(emailInput, 'Please enter a valid email address.');
                isValid = false;
            } else {
                showSuccess(emailInput);
            }

            // 3. Validate Phone Number
            const phoneValue = phoneInput.value.trim();
            const phoneRegex = /^\d{7,15}$/; // Contains only digits, between 7 and 15 characters
            if (phoneValue === '') {
                showError(phoneInput, 'Phone number is required.');
                isValid = false;
            } else if (!phoneRegex.test(phoneValue)) {
                showError(phoneInput, 'Phone number must contain only digits and be between 7 and 15 characters long.');
                isValid = false;
            } else {
                showSuccess(phoneInput);
            }

            // 4. Validate Message
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required.');
                isValid = false;
            } else {
                showSuccess(messageInput);
            }

            // If form is valid, trigger success behavior
            if (isValid) {
                // Show modal overlay
                if (modalOverlay) {
                    modalOverlay.classList.add('active');
                }
                
                // Reset form fields and clean up validation styles
                contactForm.reset();
                [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
            }
        });

        // Close Modal handler
        if (modalCloseBtn && modalOverlay) {
            modalCloseBtn.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
            });
            
            // Close modal when clicking on background overlay
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.classList.remove('active');
                }
            });
        }

        // Live validation on input change for dynamic styling
        const inputsArray = [nameInput, emailInput, phoneInput, messageInput];
        inputsArray.forEach(input => {
            input.addEventListener('input', () => {
                // Remove invalid state as user types
                if (input.classList.contains('is-invalid')) {
                    input.classList.remove('is-invalid');
                    const feedback = input.nextElementSibling;
                    if (feedback && feedback.classList.contains('invalid-feedback')) {
                        feedback.style.display = 'none';
                    }
                }
            });
        });
    }

    // Helper: Show input error states
    function showError(inputElement, errorMessage) {
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid');
        
        const feedbackElement = inputElement.nextElementSibling;
        if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
            feedbackElement.textContent = errorMessage;
            feedbackElement.style.display = 'block';
        }
    }

    // Helper: Show input success states
    function showSuccess(inputElement) {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        
        const feedbackElement = inputElement.nextElementSibling;
        if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
            feedbackElement.style.display = 'none';
        }
    }
});
