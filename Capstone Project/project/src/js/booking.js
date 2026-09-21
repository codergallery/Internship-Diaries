const selectedCarId = localStorage.getItem("selectedCar");

const selectedCar = cars.find((car) => {
  return car.id === Number(selectedCarId);
});

// No car saved (page opened directly): send the user to the cars page
if (!selectedCar) {
  window.location.href = "cars.html";
} else {
  document.querySelector("#booking-car-image").src = selectedCar.image;
  document.querySelector("#booking-car-name").textContent = selectedCar.name;
  document.querySelector("#booking-car-seats").textContent = selectedCar.seats;
  document.querySelector("#booking-car-transmission").textContent =
    selectedCar.transmission;
  document.querySelector("#booking-car-fuel").textContent = selectedCar.fuel;
  document.querySelector("#booking-car-type").textContent = selectedCar.type;
  document.querySelector("#booking-car-price").innerHTML = `₹${selectedCar.price.toLocaleString("en-IN")}
                    <span class="text-sm font-normal text-secondary">
                      / day
                    </span>`;
}

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
  if (pickupDateInput.value !== "") {
    const date = new Date(pickupDateInput.value);

    date.setDate(date.getDate() + 1);

    const minimumDropoffDate = date.toISOString().slice(0, 10);

    dropoffDateInput.min = minimumDropoffDate;

    // If the drop-off date is now too early, clear it
    if (
      dropoffDateInput.value !== "" &&
      new Date(dropoffDateInput.value) < date
    ) {
      dropoffDateInput.value = "";
    }
  }
});

// Calculating duration and total

let totalPrice;
let duration;

const paymentRentalAmount = document.querySelector("#payment-rental-amount");
const bookingAdvance = document.querySelector("#booking-advance");
const payableAtReturn = document.querySelector("#payable-at-return");
const paymentAmount = document.querySelector("#payment-amount");
const payButtonAmount = document.querySelector("#pay-button-amount");
let advanceAmount;

function calculateDuration() {
  const pickupdate = new Date(pickupDateInput.value);
  const dropoffdate = new Date(dropoffDateInput.value);

  const differenceInMilliseconds = dropoffdate - pickupdate;

  duration = differenceInMilliseconds / (1000 * 60 * 60 * 24); // converts milliseconds to days

  // A missing date gives NaN, and drop-off before pickup gives less than 1 day:
  // in both cases show dashes instead of wrong numbers
  if (isNaN(duration) || duration < 1) {
    document.querySelector("#rental-duration").textContent = "— days";
    document.querySelector("#total-price").textContent = "—";
    paymentRentalAmount.textContent = "—";
    bookingAdvance.textContent = "—";
    payableAtReturn.textContent = "—";
    paymentAmount.textContent = "—";
    payButtonAmount.textContent = "";
    return;
  }

  document.querySelector("#rental-duration").textContent = `${duration} days`;

  // Calculating total price and other prices

  totalPrice = duration * selectedCar.price;

  advanceAmount = Math.min(totalPrice * 0.5, 2000);

  document.querySelector("#total-price").innerHTML =
    `₹${totalPrice.toLocaleString("en-IN")}`;

  paymentRentalAmount.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;
  bookingAdvance.textContent = `₹${advanceAmount.toLocaleString("en-IN")}`;
  payableAtReturn.textContent = `₹${(totalPrice - advanceAmount).toLocaleString("en-IN")}`;
  paymentAmount.innerHTML = `₹${advanceAmount.toLocaleString("en-IN")}`;
  payButtonAmount.textContent = `₹${advanceAmount.toLocaleString("en-IN")}`;
}

// Calculate initial duration if dates already exist

if (pickupDate && dropoffDate && selectedCar) {
  calculateDuration();
}

// Recalculate whenever pickup or drop-off date changes
// (calculateDuration shows dashes if a date is empty or not valid)

pickupDateInput.addEventListener("change", function () {
  calculateDuration();
});

dropoffDateInput.addEventListener("change", function () {
  calculateDuration();
});

// form switching
const step1Container = document.querySelector("#step-1");
const step2Container = document.querySelector("#step-2");
const continueToStep2Btn = document.querySelector("#continue-to-step-2");
const backToStep1Btn = document.querySelector("#back-to-step-1");
const step3Container = document.querySelector("#step-3");
const backToStep2Btn = document.querySelector("#back-to-step-2");

// message boxes (empty = hidden)
const step1Error = document.querySelector("#step-1-error");
const step2Error = document.querySelector("#step-2-error");
const step3Error = document.querySelector("#step-3-error");

// step indicator at the top: highlight only the current step
const stepIndicators = document.querySelectorAll(".step-indicator");
const stepCircles = document.querySelectorAll(".step-circle");

function updateStepIndicator(currentStep) {
  for (let i = 0; i < stepIndicators.length; i++) {
    if (i === currentStep - 1) {
      // active step
      stepIndicators[i].classList.remove("opacity-50");
      stepCircles[i].classList.add("bg-accent", "text-dark-bg", "font-bold");
      stepCircles[i].classList.remove(
        "border",
        "border-grayish-border",
        "font-semibold",
      );
    } else {
      // inactive step
      stepIndicators[i].classList.add("opacity-50");
      stepCircles[i].classList.remove("bg-accent", "text-dark-bg", "font-bold");
      stepCircles[i].classList.add(
        "border",
        "border-grayish-border",
        "font-semibold",
      );
    }
  }
}

// step-1 <-> step-2
continueToStep2Btn.addEventListener("click", function () {
  if (
    pickupLocationInput.value === "" ||
    pickupDateInput.value === "" ||
    pickupTimeInput.value === "" ||
    dropoffDateInput.value === "" ||
    dropoffTimeInput.value === ""
  ) {
    step1Error.textContent = "Please fill in all rental details.";
    return;
  }

  // Price is counted in whole days, so drop-off must be at least 1 day after pickup
  if (new Date(dropoffDateInput.value) <= new Date(pickupDateInput.value)) {
    step1Error.textContent = "Drop-off date must be after the pickup date.";
    return;
  }

  step1Error.textContent = "";
  step1Container.classList.add("hidden");
  step2Container.classList.remove("hidden");
  updateStepIndicator(2);
});

backToStep1Btn.addEventListener("click", function () {
  step2Container.classList.add("hidden");
  step1Container.classList.remove("hidden");
  updateStepIndicator(1);
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
    step2Error.textContent = "";
    step2Container.classList.add("hidden");
    step3Container.classList.remove("hidden");
    updateStepIndicator(3);
  } else {
    step2Error.textContent = "Please fill in all required fields correctly.";
  }
});

backToStep2Btn.addEventListener("click", function () {
  step3Container.classList.add("hidden");
  step2Container.classList.remove("hidden");
  updateStepIndicator(2);
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

  // expiry is typed as MM/YY (the input adds the "/" automatically)
  const expiryMonth = Number(cardExpiryInput.value.slice(0, 2));

  if (
    cardHolderInput.value !== "" &&
    cardNumberInput.value.replaceAll(" ", "").length === 16 &&
    !isNaN(cardNumberInput.value.replaceAll(" ", "")) &&
    cardExpiryInput.value.length === 5 &&
    expiryMonth >= 1 &&
    expiryMonth <= 12 &&
    cardCvvInput.value.length === 3 &&
    !isNaN(cardCvvInput.value.replaceAll(" ", "")) &&
    paymentTerms.checked
  ) {
    step3Error.textContent = "";

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
    localStorage.setItem("booking", JSON.stringify(bookingDetails));

    // console.log("Validation passed");

    window.location.href = "confirmation.html";
  } else {
    step3Error.textContent =
      "Please check your card details and agree to the terms.";
  }
});

// Payment confirmation
const bookingId = "DRV-" + Math.floor(100000 + Math.random() * 900000);