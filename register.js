class RegistrationManager {
    constructor() {
        this.event = null;
        this.initialize();
    }

    initialize() {
        // Get event data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        
        if (!eventId) {
            alert('No event selected');
            window.location.href = 'index.html';
            return;
        }

        // Load event data from localStorage
        const events = JSON.parse(localStorage.getItem('events')) || [];
        this.event = events.find(e => e.id === parseInt(eventId));
        
        if (!this.event) {
            alert('Event not found');
            window.location.href = 'index.html';
            return;
        }

        this.displayEventDetails();
        this.setupFormValidation();
        this.calculatePrice();
    }

    displayEventDetails() {
        const eventDetails = document.getElementById('eventDetails');
        eventDetails.innerHTML = `
            <div class="event-summary">
                <h3>${this.event.title}</h3>
                <p><i class="fas fa-calendar"></i> ${new Date(this.event.date).toLocaleDateString()}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${this.event.location}</p>
                <p><i class="fas fa-users"></i> Available Spots: ${this.event.capacity - this.event.registered}</p>
            </div>
        `;
    }

    setupFormValidation() {
        const form = document.getElementById('registrationForm');
        const cardNumber = document.getElementById('cardNumber');
        const expiryDate = document.getElementById('expiryDate');
        const cvv = document.getElementById('cvv');

        // Card number formatting
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });

        // Expiry date formatting
        expiryDate.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });

        // CVV validation
        cvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });
    }

    calculatePrice() {
        const eventPrice = this.event.price;
        const taxAmount = eventPrice * 0.18;
        const totalAmount = eventPrice + taxAmount;

        document.getElementById('eventPrice').textContent = `₹${eventPrice.toLocaleString('en-IN')}`;
        document.getElementById('taxAmount').textContent = `₹${taxAmount.toLocaleString('en-IN')}`;
        document.getElementById('totalAmount').textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
    }

    async handleRegistration() {
        const formData = {
            eventId: this.event.id,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        };

        try {
            // Simulate payment processing
            await this.processPayment(formData);
            
            // Save registration
            this.saveRegistration(formData);
            
            // Show success message and redirect
            alert('Registration successful! You will receive a confirmation email shortly.');
            window.location.href = 'index.html';
        } catch (error) {
            alert('Payment failed: ' + error.message);
        }
    }

    async processPayment(formData) {
        // Simulate API call to payment gateway
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve();
                } else {
                    reject(new Error('Payment gateway error'));
                }
            }, 2000);
        });
    }

    saveRegistration(formData) {
        // Get existing registrations or initialize empty array
        const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
        
        // Add new registration
        registrations.push({
            ...formData,
            registrationDate: new Date().toISOString(),
            status: 'confirmed'
        });
        
        // Save to localStorage
        localStorage.setItem('registrations', JSON.stringify(registrations));
        
        // Update event registration count
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const eventIndex = events.findIndex(e => e.id === this.event.id);
        
        if (eventIndex !== -1) {
            events[eventIndex].registered++;
            localStorage.setItem('events', JSON.stringify(events));
        }
    }
}

// Initialize registration manager
const registrationManager = new RegistrationManager(); 