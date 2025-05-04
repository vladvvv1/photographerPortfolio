document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const result = document.getElementById('result');

  if (!form) {
    console.error("Form not found!");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Очистити стилі перед новою перевіркою
    result.textContent = '';
    [form.name, form.email, form.message].forEach(field => {
      field.classList.remove('invalid');
    });

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };

    let hasError = false;
    let errorMessages = [];

    // Валідація
    if (!formData.name) {
      form.name.classList.add('invalid');
      errorMessages.push('Name is required.');
      hasError = true;
    }

    if (!formData.email) {
      form.email.classList.add('invalid');
      errorMessages.push('Email is required.');
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      form.email.classList.add('invalid');
      errorMessages.push('Invalid email format.');
      hasError = true;
    }

    if (!formData.message) {
      form.message.classList.add('invalid');
      errorMessages.push('Message is required.');
      hasError = true;
    }

    if (hasError) {
      result.textContent = errorMessages.join(' ');
      result.style.color = 'red';

      // Фокус на перше помилкове поле
      const firstErrorField = document.querySelector('.invalid');
      if (firstErrorField) {
        firstErrorField.focus();
      }

      return;
    }

    result.textContent = 'Sending...';
    result.style.color = 'black';

    try {
      const res = await fetch('http://localhost:3000/contacts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        result.textContent = 'Message sent successfully!';
        result.style.color = 'black';
        form.reset();
      } else {
        console.log("Backend error:", data);
        result.textContent = data.message || 'Something went wrong!';
        result.style.color = 'red';
      }
    } catch (err) {
      console.error("Fetch error:", err);
      result.textContent = 'Error sending message.';
      result.style.color = 'red';
    }
  });
});
