document.addEventListener('DOMContentLoaded', () => {
    const typewriter = document.getElementById('typewriter');
    const items = ["Scalable AI Systems", "Robust Backend Logic", "Collaborative Platforms"];
    let itemIdx = 0, charIdx = 0, isDeleting = false;

    function handleTyping() {
        const currentWord = items[itemIdx];
        if (!typewriter) return;

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
});