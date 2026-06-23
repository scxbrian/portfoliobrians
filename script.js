document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation Logic
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            // 1. Update Navigation Active State
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            // 2. Hide all sections
            sections.forEach(section => {
                section.classList.remove('active-section');
            });

            // 3. Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
                
                // Optional: scroll to top of main content on mobile if needed
                if (window.innerWidth <= 992) {
                    const mainContent = document.querySelector('.main-content');
                    if (mainContent) {
                        mainContent.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });

    // Portfolio Filtering Logic
    const filterItems = document.querySelectorAll('.filter-item');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active state on filters
            filterItems.forEach(f => f.classList.remove('active'));
            item.classList.add('active');

            const filterValue = item.getAttribute('data-filter');

            // Show/Hide cards
            portfolioCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // Read More Toggle Logic
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btn-read-more')) {
            const btn = e.target;
            const moreContent = btn.previousElementSibling;
            
            if (moreContent && moreContent.classList.contains('desc-more')) {
                if (moreContent.style.display === 'none') {
                    moreContent.style.display = 'block';
                    btn.textContent = 'Read Less';
                } else {
                    moreContent.style.display = 'none';
                    btn.textContent = 'Read More';
                }
            }
        }
    });
});
