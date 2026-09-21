const bookingData = localStorage.getItem("booking");

if (bookingData) {
  const booking = JSON.parse(bookingData);

  // Booking ID
  document.querySelector("#booking-id").textContent = booking.bookingId;

  // Vehicle
  document.querySelector("#confirmation-car-image").src = booking.carImage;

  document.querySelector("#confirmation-car-name").textContent =
    booking.carName;

  document.querySelector("#confirmation-car-type").textContent =
    booking.carType || booking.type || "Vehicle";

  // Daily price
  document.querySelector("#confirmation-daily-price").textContent =
    `₹${booking.dailyPrice}`;

  // Pickup
  document.querySelector("#confirmation-pickup-date").textContent =
    booking.pickupDate;

  document.querySelector("#confirmation-pickup-time").textContent =
    booking.pickupTime;

  document.querySelector("#confirmation-pickup-location").textContent =
    booking.pickupLocation;

  // Drop-off
  document.querySelector("#confirmation-dropoff-date").textContent =
    booking.dropoffDate;

  document.querySelector("#confirmation-dropoff-time").textContent =
    booking.dropoffTime;

  document.querySelector("#confirmation-dropoff-location").textContent =
    booking.pickupLocation;

  // Rental
  document.querySelector("#confirmation-duration").textContent =
    `${booking.duration} days`;

  document.querySelector("#confirmation-total-price").textContent =
    `₹${booking.totalPrice}`;

  document.querySelector("#confirmation-advance").textContent =
    `Advance Paid: ₹${booking.advanceAmount}`;

  // Email
  document.querySelector("#confirmation-email").textContent = booking.email;
}

// Copy booking ID

const copyBookingIdButton = document.querySelector("#copy-booking-id");

copyBookingIdButton.addEventListener("click", function () {
  const bookingId = document.querySelector("#booking-id").textContent;

  navigator.clipboard.writeText(bookingId);
});
