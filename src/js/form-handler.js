/**
 * Client-side form handler
 * Intercepts form submission and sends data to EspoCRM via Netlify Function
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormHandler);
  } else {
    initFormHandler();
  }

  function initFormHandler() {
    const forms = document.querySelectorAll('form[data-netlify="true"]');

    forms.forEach(form => {
      form.addEventListener('submit', handleFormSubmit);
    });
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';

    // Show loading state
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }

    try {
      // Extract form data
      const formData = new FormData(form);
      const data = {};

      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Get form name
      const formName = form.getAttribute('name') || 'unknown-form';

      // Prepare payload in the format expected by submission-created function
      const payload = {
        form_name: formName,
        data: data
      };

      console.log('Submitting form:', formName);
      console.log('Form data:', data);

      // Call the Netlify function directly
      const response = await fetch('/.netlify/functions/submission-created', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Function call failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Form submission result:', result);

      // Redirect to success page (as specified in form action)
      const successPage = form.getAttribute('action') || '/success/';
      window.location.href = successPage;

    } catch (error) {
      console.error('Form submission error:', error);

      // Reset button state
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }

      // Show error message to user
      alert('There was an error submitting the form. Please try again or contact support.');
    }
  }
})();
