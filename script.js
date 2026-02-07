const alertButton = document.getElementById('alertButton');
alertButton.addEventListener('click', () => {
    alert('Hello! You clicked the button.');
});

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    alert(`Thanks, ${name}! Your message has been received.`);
    
    contactForm.reset();
});
