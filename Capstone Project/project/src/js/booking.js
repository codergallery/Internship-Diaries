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

const paymentRentalAmount = document.querySelector("#payment-rental-amount");
const bookingAdvance = document.querySelector("#booking-advance");
const payableAtReturn = document.querySelector("#payable-at-return");
const paymentAmount = document.querySelector("#payment-amount");
let advanceAmount;

function calculateDuration() {
  const pickupdate = new Date(pickupDateInput.value);
  const dropoffdate = new Date(dropoffDateInput.value);

  const differenceInMilliseconds = dropoffdate - pickupdate;

  duration = differenceInMilliseconds / (1000 * 60 * 60 * 24); // converts milliseconds to days

  document.querySelector("#rental-duration").textContent = `${duration} days`;

  // Calculating total price and other prices

  totalPrice = duration * selectedCar.price;

  advanceAmount = Math.min(totalPrice * 0.5, 2000);

  document.querySelector("#total-price").innerHTML = `₹${totalPrice}`;

  paymentRentalAmount.textContent = `₹${totalPrice}`;
  bookingAdvance.textContent = `₹${advanceAmount}`;
  payableAtReturn.textContent = `₹${totalPrice - advanceAmount}`;
  paymentAmount.innerHTML = `₹${advanceAmount}`;
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

// form switching
const step1Container = document.querySelector("#step-1");
const step2Container = document.querySelector("#step-2");
const continueToStep2Btn = document.querySelector("#continue-to-step-2");
const backToStep1Btn = document.querySelector("#back-to-step-1");
const step3Container = document.querySelector("#step-3");
const backToStep2Btn = document.querySelector("#back-to-step-2");

// step-1 <-> step-2
continueToStep2Btn.addEventListener("click", function () {
  step1Container.classList.add("hidden");
  step2Container.classList.remove("hidden");
});

backToStep1Btn.addEventListener("click", function () {
  step2Container.classList.add("hidden");
  step1Container.classList.remove("hidden");
});

// step-2 form validation
const continueToStep3Btn = document.querySelector("#continue-to-step-3");

const nameInput = document.querySelector("#customer-name");
const phoneInput = document.querySelector("#customer-phone");
const emailInput = document.querySelector("#customer-email");
const purposeInput = document.querySelector("#booking-purpose");
const experienceInput = document.querySelector("#driving-experience");

// don't understand part for step-2 validation
phoneInput.addEventListener("input", function () {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
});

// step-2 <-> step-3
continueToStep3Btn.addEventListener("click", function () {
  if (
    nameInput.value.length !== 0 &&
    phoneInput.value.length === 10 &&
    !isNaN(phoneInput.value) &&
    emailInput.value.includes("@") &&
    emailInput.value.includes(".") &&
    purposeInput.value !== "" &&
    experienceInput.value !== ""
  ) {
    step2Container.classList.add("hidden");
    step3Container.classList.remove("hidden");
  }
});

backToStep2Btn.addEventListener("click", function () {
  step3Container.classList.add("hidden");
  step2Container.classList.remove("hidden");
});

// payment details validation
const cardHolderInput = document.querySelector("#card-holder-name");
const cardNumberInput = document.querySelector("#card-number");
const cardExpiryInput = document.querySelector("#card-expiry");
const cardCvvInput = document.querySelector("#card-cvv");
const paymentTerms = document.querySelector("#payment-terms");
const confirmBookingBtn = document.querySelector("#confirm-booking");

// don't understand how part for step-3 validation
cardNumberInput.addEventListener("input", function () {
  let cardNumber = cardNumberInput.value.replace(/\D/g, "");

  cardNumber = cardNumber.slice(0, 16);

  cardNumberInput.value = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
});

cardExpiryInput.addEventListener("input", function () {
  let expiry = cardExpiryInput.value.replace(/\D/g, "");

  expiry = expiry.slice(0, 4);

  if (expiry.length >= 3) {
    expiry = expiry.slice(0, 2) + "/" + expiry.slice(2);
  }

  cardExpiryInput.value = expiry;
});

cardCvvInput.addEventListener("input", function () {
  cardCvvInput.value = cardCvvInput.value.replace(/\D/g, "").slice(0, 3);
});

// part I understand
confirmBookingBtn.addEventListener("click", function () {
  // console.log("Confirm button clicked");

  if (
    cardHolderInput.value !== "" &&
    cardNumberInput.value.replaceAll(" ", "").length === 16 &&
    !isNaN(cardNumberInput.value.replaceAll(" ", "")) &&
    cardCvvInput.value.length === 3 &&
    !isNaN(cardCvvInput.value.replaceAll(" ", "")) &&
    paymentTerms.checked
  ) {
    const bookingDetails = {
      bookingId: bookingId,

      // Vehicle
      carId: selectedCar.id,
      carType: selectedCar.type,
      carName: selectedCar.name,
      carImage: selectedCar.image,

      // Rental details
      pickupLocation: pickupLocationInput.value,
      pickupDate: pickupDateInput.value,
      pickupTime: pickupTimeInput.value,
      dropoffDate: dropoffDateInput.value,
      dropoffTime: dropoffTimeInput.value,

      // Customer details
      name: nameInput.value,
      phone: phoneInput.value,
      email: emailInput.value,
      purpose: purposeInput.value,
      experience: experienceInput.value,

      // Payment
      duration: duration,
      dailyPrice: selectedCar.price,
      totalPrice: totalPrice,
      advanceAmount: advanceAmount,
      payableAtReturn: totalPrice - advanceAmount,
    };
    localStorage.setItem("booking", JSON.stringify(bookingDetails))

    // console.log("Validation passed");
    
    window.location.href = "confirmation.html"
  }
});

// Payment confirmation
const bookingId = "DRV-" + Math.floor(100000 + Math.random() * 900000);
