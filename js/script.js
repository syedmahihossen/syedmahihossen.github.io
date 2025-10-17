document.addEventListener('DOMContentLoaded', function() {
    // Typing effect for the hero section
    var typedOptions = {
        strings: [
            'problem solving.',
            'web development.',
            'building software.',
            'innovative solutions.'
        ],
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 1800,
        loop: true,
        showCursor: true,
        cursorChar: '|',
    };
    var typed = new Typed('#typed-text', typedOptions);

    // Smooth scroll for navigation links and active state
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');

    function activateNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) { // Adjust offset as needed
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateNavLink);
    activateNavLink(); // Activate on load

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });

            // Update active state immediately on click
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Contact Form Submission Logic (unchanged from previous version)
    const form = document.getElementById('contact-form');
    const result = document.getElementById('form-result');

    if (form) { // Ensure form exists before attaching listener
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            result.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Sending...";
            result.style.color = var('--color-text-dark');
            result.style.display = "block"; // Make sure it's visible

            fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    let jsonResponse = await response.json();
                    if (response.status == 200) {
                        result.style.color = var('--color-primary'); // Accent color
                        result.innerHTML = "<i class='fas fa-check-circle'></i> Message sent successfully!";
                    } else {
                        console.log(response);
                        result.style.color = "red";
                        result.innerHTML = "<i class='fas fa-exclamation-circle'></i> " + (jsonResponse.message || "Something went wrong!");
                    }
                })
                .catch(error => {
                    console.log(error);
                    result.style.color = "red";
                    result.innerHTML = "<i class='fas fa-exclamation-circle'></i> Network error! Please try again.";
                })
                .then(function() {
                    form.reset();
                    setTimeout(() => {
                        result.style.display = "none";
                    }, 5000); // Hide after 5 seconds
                });
        });
    }

    // Set CSS variables for RGB values (for rgba usage)
    const style = document.documentElement.style;
    style.setProperty('--color-primary-rgb', '138, 43, 226');
    style.setProperty('--color-secondary-rgb', '0, 188, 212');
    style.setProperty('--color-dark-rgb', '26, 26, 46');
});