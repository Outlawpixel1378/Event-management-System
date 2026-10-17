// Event Management System
class EventManager {
    constructor() {
        // Check authentication
        this.checkAuth();
        
        // Sample events data
        const sampleEvents = [
            {
                id: 1,
                title: "Summer Music Festival 2024",
                date: "2024-07-15",
                location: "Central Park, New York",
                description: "A day of amazing music performances featuring top artists from around the world. Join us for an unforgettable musical experience!",
                price: 3999,
                capacity: 1000,
                registered: 0,
                image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            {
                id: 2,
                title: "Tech Conference 2024",
                date: "2024-08-20",
                location: "Convention Center, San Francisco",
                description: "Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing. Network with industry leaders!",
                price: 15999,
                capacity: 500,
                registered: 0,
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            {
                id: 3,
                title: "Food & Wine Festival",
                date: "2024-09-10",
                location: "Riverside Gardens, Chicago",
                description: "Celebrate culinary excellence with top chefs and winemakers. Enjoy tastings, cooking demonstrations, and food pairings.",
                price: 6499,
                capacity: 800,
                registered: 0,
                image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            {
                id: 4,
                title: "Sports Championship 2024",
                date: "2024-10-05",
                location: "Stadium Arena, Los Angeles",
                description: "Major sports championship featuring top athletes competing in various disciplines. Don't miss this exciting event!",
                price: 7499,
                capacity: 2000,
                registered: 0,
                image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            {
                id: 5,
                title: "Art Exhibition & Auction",
                date: "2024-11-15",
                location: "Modern Art Gallery, Miami",
                description: "Contemporary art exhibition featuring works from renowned artists. Includes live auction and artist meet-and-greet sessions.",
                price: 3299,
                capacity: 300,
                registered: 0,
                image: "https://media.istockphoto.com/id/1195845261/photo/modern-art-at-business-conference.webp?a=1&b=1&s=612x612&w=0&k=20&c=nrRgbM7bkU1ClztglFwAG_Dbrin1Ks4qf6fEiEBlm80="
            },
            {
                id: 6,
                title: "New Year's Eve Gala",
                date: "2024-12-31",
                location: "Grand Hotel Ballroom, Las Vegas",
                description: "Luxurious New Year's Eve celebration with live entertainment, gourmet dining, and spectacular fireworks display.",
                price: 24999,
                capacity: 400,
                registered: 0,
                image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
            }
        ];

        // Initialize events from localStorage or use sample events if none exist
        this.events = JSON.parse(localStorage.getItem('events')) || sampleEvents;
        this.currentEvent = null;
        this.initializeEventListeners();
        this.displayEvents();
        this.displayAdminEvents();
    }

    checkAuth() {
        const userAuth = localStorage.getItem('userAuth');
        const adminAuth = localStorage.getItem('adminAuth');
        const urlParams = new URLSearchParams(window.location.search);
        const isAdminPage = urlParams.get('admin') === 'true';

        // Redirect to login if not authenticated
        if (!userAuth && !adminAuth) {
            window.location.href = 'login.html';
            return;
        }

        // Handle admin access
        if (isAdminPage && !adminAuth) {
            window.location.href = 'login.html';
            return;
        }

        // Redirect to home if admin tries to access user page
        if (adminAuth && !isAdminPage) {
            window.location.href = 'index.html?admin=true';
            return;
        }

        // Update UI based on authentication
        this.updateUIForAuth(adminAuth);
    }

    updateUIForAuth(isAdmin) {
        const navLinks = document.querySelector('.nav-links');
        const adminPanelLink = document.querySelector('[data-page="admin"]');
        
        if (isAdmin) {
            // Show admin panel link for admin users
            if (adminPanelLink) {
                adminPanelLink.style.display = 'inline-block';
            }
            // Navigate to admin panel by default
            this.navigateTo('admin');
        } else {
            // Hide admin panel link for regular users
            if (adminPanelLink) {
                adminPanelLink.style.display = 'none';
            }
            // Navigate to home by default
            this.navigateTo('home');
        }

        // Add logout button
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.textContent = 'Logout';
        logoutBtn.className = 'nav-link';
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            this.handleLogout();
        };
        navLinks.appendChild(logoutBtn);
    }

    handleLogout() {
        localStorage.removeItem('userAuth');
        localStorage.removeItem('adminAuth');
        window.location.href = 'login.html';
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(e.target.dataset.page);
            });
        });

        // Add Event Button
        document.getElementById('addEventBtn').addEventListener('click', () => {
            this.showEventModal();
        });

        // Event Form
        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEventSubmit();
        });

        // Registration Form
        document.getElementById('registrationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistrationSubmit();
        });

        // Close Modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    navigateTo(page) {
        // Update active page
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(page).classList.add('active');

        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    }

    showEventModal(event = null) {
        const modal = document.getElementById('eventModal');
        const form = document.getElementById('eventForm');
        const modalTitle = document.getElementById('modalTitle');

        this.currentEvent = event;
        modalTitle.textContent = event ? 'Edit Event' : 'Add New Event';

        if (event) {
            // Fill form with event data
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventLocation').value = event.location;
            document.getElementById('eventDescription').value = event.description;
            document.getElementById('eventPrice').value = event.price;
            document.getElementById('eventCapacity').value = event.capacity;
            document.getElementById('eventImage').value = event.image;
        } else {
            form.reset();
        }

        modal.style.display = 'block';
    }

    showRegistrationModal(event) {
        this.currentEvent = event;
        document.getElementById('registrationModal').style.display = 'block';
    }

    closeModals() {
        document.getElementById('eventModal').style.display = 'none';
        document.getElementById('registrationModal').style.display = 'none';
        this.currentEvent = null;
    }

    handleEventSubmit() {
        const formData = {
            id: this.currentEvent ? this.currentEvent.id : Date.now(),
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            price: parseFloat(document.getElementById('eventPrice').value),
            capacity: parseInt(document.getElementById('eventCapacity').value),
            image: document.getElementById('eventImage').value,
            registered: this.currentEvent ? this.currentEvent.registered : 0
        };

        if (this.currentEvent) {
            // Update existing event
            this.events = this.events.map(event => 
                event.id === this.currentEvent.id ? formData : event
            );
        } else {
            // Add new event
            this.events.push(formData);
        }

        this.saveEvents();
        this.displayEvents();
        this.displayAdminEvents();
        this.closeModals();
    }

    handleRegistrationSubmit() {
        const formData = {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('regPhone').value
        };

        if (this.currentEvent.registered >= this.currentEvent.capacity) {
            alert('Sorry, this event is full!');
            return;
        }

        this.currentEvent.registered++;
        this.events = this.events.map(event => 
            event.id === this.currentEvent.id ? this.currentEvent : event
        );

        this.saveEvents();
        this.displayEvents();
        this.displayAdminEvents();
        this.closeModals();
        alert('Registration successful!');
    }

    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(event => event.id !== eventId);
            this.saveEvents();
            this.displayEvents();
            this.displayAdminEvents();
        }
    }

    displayEvents() {
        const container = document.getElementById('eventsContainer');
        container.innerHTML = this.events.map(event => `
            <div class="event-card">
                <img src="${event.image}" 
                     alt="${event.title}" 
                     class="event-image"
                     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1577083552431-6e5c019cddab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';">
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-details">${event.description}</p>
                    <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
                    <p>Location: ${event.location}</p>
                    <p>Available Spots: ${event.capacity - event.registered}</p>
                    <p class="event-price">₹${event.price.toLocaleString('en-IN')}</p>
                    <button onclick="eventManager.handleRegisterClick(${event.id})" 
                            class="btn-primary"
                            ${event.registered >= event.capacity ? 'disabled' : ''}>
                        ${event.registered >= event.capacity ? 'Event Full' : 'Register'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    handleRegisterClick(eventId) {
        const userAuth = JSON.parse(localStorage.getItem('userAuth'));
        if (!userAuth) {
            alert('Please login to register for events');
            window.location.href = 'login.html';
            return;
        }

        // Redirect to registration page with event ID
        window.location.href = `register.html?eventId=${eventId}`;
    }

    displayAdminEvents() {
        const container = document.getElementById('adminEventsContainer');
        container.innerHTML = this.events.map(event => `
            <div class="admin-event-item">
                <div>
                    <h3>${event.title}</h3>
                    <p>Registered: ${event.registered}/${event.capacity}</p>
                    <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
                    <p>Price: ₹${event.price.toLocaleString('en-IN')}</p>
                </div>
                <div class="admin-event-actions">
                    <button onclick="eventManager.viewRegistrations(${event.id})" 
                            class="btn-primary">
                        View Registrations
                    </button>
                    <button onclick="eventManager.showEventModal(${JSON.stringify(event)})" 
                            class="btn-primary">
                        Edit
                    </button>
                    <button onclick="eventManager.deleteEvent(${event.id})" 
                            class="btn-primary btn-danger">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    viewRegistrations(eventId) {
        const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
        const eventRegistrations = registrations.filter(reg => reg.eventId === eventId);
        const event = this.events.find(e => e.id === eventId);

        if (!event) {
            alert('Event not found');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Registrations for ${event.title}</h2>
                <div class="registrations-list">
                    ${eventRegistrations.length === 0 ? 
                        '<p>No registrations yet</p>' :
                        eventRegistrations.map(reg => `
                            <div class="registration-item">
                                <h3>${reg.fullName}</h3>
                                <p><strong>Email:</strong> ${reg.email}</p>
                                <p><strong>Phone:</strong> ${reg.phone}</p>
                                <p><strong>Registration Date:</strong> ${new Date(reg.registrationDate).toLocaleString()}</p>
                                <p><strong>Status:</strong> ${reg.status}</p>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Close modal functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => {
            modal.remove();
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        };
    }

    saveEvents() {
        localStorage.setItem('events', JSON.stringify(this.events));
    }
}

// Initialize the event manager
const eventManager = new EventManager(); 