document
  .querySelector("#view-vehicles-btn")
  .addEventListener("click", function () {
    const pickupLocation = document.querySelector("#pickup-location");
    localStorage.setItem("pickupLocation", pickupLocation.value);

    const pickupDate = document.querySelector("#pickup-date");
    localStorage.setItem("pickupDate", pickupDate.value);

    const pickupTime = document.querySelector("#pickup-time");
    localStorage.setItem("pickupTime", pickupTime.value);

    const dropoffDate = document.querySelector("#drop-off-date");
    localStorage.setItem("dropoffDate", dropoffDate.value);

    const dropoffTime = document.querySelector("#drop-off-time");
    localStorage.setItem("dropoffTime", dropoffTime.value);

    window.location.href = "cars.html";
  });

  // pickupDate validation
const pickupDateInput = document.querySelector("#pickup-date");
const today = new Date().toISOString().split("T")[0];
pickupDateInput.min = today

// dropoffdate validation
const dropoffDateInput = document.querySelector("#drop-off-date");

pickupDateInput.addEventListener("change", function () {
  const date = new Date(pickupDateInput.value);
  date.setDate(date.getDate() + 1);

  const minimumDropffDate = date.toISOString().slice(0, 10);
  dropoffDateInput.min = minimumDropffDate;
});
