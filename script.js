const API_URL = "https://67c414eec4649b9551b29714.mockapi.io/bookings"; 


document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (validateForm()) {
        const bookingData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Booking Successful:", data);
            alert("Booking confirmed!");
            window.location.href = "map.html"; 
        })
        .catch(error => console.error("Error:", error));
        
        window.location.href = "map.html";
    }
});

function fetchBookings() {
    console.log("Fetching bookings from API...");

    fetch(API_URL)
        .then(response => {
            console.log("Response received:", response);
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("All Bookings:", data);
            displayBookings(data);
        })
        .catch(error => {
            console.error("Error fetching bookings:", error);
        });
}

function displayBookings(bookings) {
    const bookingsContainer = document.getElementById("bookingsList");
    bookingsContainer.innerHTML = "";

    bookings.forEach(booking => {
        const bookingItem = document.createElement("div");
        bookingItem.classList.add("booking-item");
        bookingItem.innerHTML = `
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <hr>
        `;
        bookingsContainer.appendChild(bookingItem);
    });
}

document.addEventListener("DOMContentLoaded", fetchBookings);



function validateForm() {
    let valid = true;

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");
    
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const phone = phoneField.value.trim();

  
    document.querySelectorAll(".error").forEach(err => err.innerText = "");

    if (!name) {
        document.getElementById("nameError").innerText = "Name is required!";
        valid = false;
    } else {
        nameField.value = capitalizeFirstLetter(name);
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        document.getElementById("emailError").innerText = "Email is required!";
        valid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById("emailError").innerText = "Invalid email format!";
        valid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
        document.getElementById("phoneError").innerText = "Phone number is required!";
        valid = false;
    } else if (!phoneRegex.test(phone)) {
        document.getElementById("phoneError").innerText = "Invalid phone number! Enter a 10-digit number.";
        valid = false;
    }

    return valid;
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
