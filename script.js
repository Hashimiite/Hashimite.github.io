import emailjs from '@emailjs/browser';

document.addEventListener('DOMContentLoaded', () => {
    
    emailjs.init({
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    });

    // Typewriter Logic
    const typewriter = document.getElementById('typewriter');
    const items = ["Scalable AI Systems", "Robust Backend Logic", "Collaborative Platforms"];
    let itemIdx = 0, charIdx = 0, isDeleting = false;

    function handleTyping() {
        const currentWord = items[itemIdx];
        if (!typewriter) return; // Safety check

        typewriter.textContent = isDeleting ? 
            currentWord.substring(0, charIdx--) : 
            currentWord.substring(0, charIdx++);

        let delta = isDeleting ? 40 : 100;
        if (!isDeleting && charIdx === currentWord.length + 1) {
            delta = 2000; isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            itemIdx = (itemIdx + 1) % items.length;
            delta = 500;
        }
        setTimeout(handleTyping, delta);
    }
    handleTyping();

    // Email Submission Logic
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector(".btn-primary");
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            const params = {
                from_name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value,
                sent_date: new Date().toLocaleString()
            };

            emailjs.send("service_eqe1af9", "template_snt4fii", params)
                .then(() => {
                    alert("Message sent successfully!");
                    contactForm.reset();
                    submitBtn.textContent = "Send Message";
                    submitBtn.disabled = false;
                })
                .catch((error) => {
                    console.error("Email failed:", error);
                    alert("Failed to send message.");
                    submitBtn.textContent = "Send Message";
                    submitBtn.disabled = false;
                });
        });
    }
});