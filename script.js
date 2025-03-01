// Fetch GitHub Projects
async function fetchProjects() {
    try {
        const response = await fetch('/api/github/projects');
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        const projects = await response.json();
        displayProjects(projects);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('projects-grid').innerHTML = 
            '<p class="error">Failed to load projects. Please try again later.</p>';
    }
}

// Extract meaningful description from PR body
function extractDescription(text) {
    if (!text) return "No description provided";

    // Remove common PR templates and checklists
    let description = text.split(/###|Pull Request Readiness Checklist/)[0];

    // Clean up markdown
    description = description
        .replace(/#+\s/g, '')  // Remove headers
        .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
        .replace(/\n+/g, ' ')  // Replace multiple newlines with space
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .trim();

    // If description is too long, truncate it
    const maxLength = 100;
    if (description.length > maxLength) {
        description = description.substring(0, maxLength).trim() + '...';
    }

    return description || "No description provided";
}

// Display Projects
function displayProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = projects.map(project => `
        <div class="card project-card">
            <h3>
                <a href="${project.url}" target="_blank" rel="noopener noreferrer">
                    ${project.name}
                </a>
            </h3>
            <p>${extractDescription(project.description)}</p>
            <div class="project-meta">
                <span class="repository">
                    <i class="fas fa-code-branch"></i> ${project.repository}
                </span>
                <span class="date">
                    <i class="fas fa-calendar"></i> ${project.created_at}
                </span>
            </div>
        </div>
    `).join('');
}

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
});

// Handle Contact Form
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        message: e.target.message.value
    };

    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    e.target.reset();
});
