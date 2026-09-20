const selectedCarId = localStorage.getItem("selectedCar");

const selectedCar = cars.find((car) => {
  return car.id === Number(selectedCarId);
});

document.querySelector("#booking-car-image").src = selectedCar.image;
document.querySelector("#booking-car-name").textContent = selectedCar.name;
document.querySelector("#booking-car-seats").textContent = selectedCar.seats;
document.querySelector("#booking-car-transmission").textContent =
  selectedCar.transmission;
document.querySelector("#booking-car-fuel").textContent = selectedCar.fuel;
document.querySelector("#booking-car-type").textContent = selectedCar.type;
document.querySelector("#booking-car-price").innerHTML = `₹${selectedCar.price}
                  <span class="text-sm font-normal text-secondary">
                    / day
                  </span>`;

// Get saved booking details

const pickupLocation = localStorage.getItem("pickupLocation");
const pickupDate = localStorage.getItem("pickupDate");
const pickupTime = localStorage.getItem("pickupTime");
const dropoffDate = localStorage.getItem("dropoffDate");
const dropoffTime = localStorage.getItem("dropoffTime");

// Select input elements

const pickupLocationInput = document.querySelector("#pickup-location");
const pickupDateInput = document.querySelector("#pickup-date");
const pickupTimeInput = document.querySelector("#pickup-time");
const dropoffDateInput = document.querySelector("#drop-off-date");
const dropoffTimeInput = document.querySelector("#drop-off-time");

// Restore saved booking details

if (pickupLocation) {
  pickupLocationInput.value = pickupLocation;
}

if (pickupDate) {
  pickupDateInput.value = pickupDate;
}

if (pickupTime) {
  pickupTimeInput.value = pickupTime;
}

if (dropoffDate) {
  dropoffDateInput.value = dropoffDate;
}

if (dropoffTime) {
  dropoffTimeInput.value = dropoffTime;
}

// Pickup date validation

const today = new Date().toISOString().split("T")[0];

pickupDateInput.min = today;

// Set minimum drop-off date

if (pickupDate) {
  const date = new Date(pickupDateInput.value);

  date.setDate(date.getDate() + 1);

  const minimumDropoffDate = date.toISOString().slice(0, 10);

  dropoffDateInput.min = minimumDropoffDate;
}

// Update minimum drop-off date whenever pickup date changes

pickupDateInput.addEventListener("change", function () {
  const date = new Date(pickupDateInput.value);

  date.setDate(date.getDate() + 1);

  const minimumDropoffDate = date.toISOString().slice(0, 10);

  dropoffDateInput.min = minimumDropoffDate;
});

// Calculating duration and total

let totalPrice;
let duration;

function calculateDuration() {
  const pickupdate = new Date(pickupDateInput.value);
  const dropoffdate = new Date(dropoffDateInput.value);

  const differenceInMilliseconds = dropoffdate - pickupdate;

  duration = differenceInMilliseconds / (1000 * 60 * 60 * 24); // converts milliseconds to days

  document.querySelector("#rental-duration").textContent = `${duration} days`;

  // Calculating total price

  totalPrice = duration * selectedCar.price;

  document.querySelector("#total-price").innerHTML = `₹${totalPrice}`;
}

// Calculate initial duration if dates already exist

if (pickupDate && dropoffDate) {
  calculateDuration();
}

// Recalculate whenever pickup or drop-off date changes

pickupDateInput.addEventListener("change", function () {
  if (dropoffDateInput.value) {
    calculateDuration();
  }
});

dropoffDateInput.addEventListener("change", function () {
  if (pickupDateInput.value) {
    calculateDuration();
  }
});
