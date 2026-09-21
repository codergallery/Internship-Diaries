const carsContainer = document.querySelector("#cars-container");

let selectedCar;

// generates html of cars cards
function renderCars(carList) {
  let carsHTML;
  if (carList.length === 0) {
    carsHTML = [
      `<div class="flex flex-col items-center justify-center rounded-xl border border-grayish-border bg-dark-secondary p-8 text-center">
  <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-dark-bg text-xl text-secondary">
    🔍
  </div>

  <h3 class="text-lg font-semibold text-secondary">
    No vehicles found
  </h3>

  <p class="mt-1 text-sm text-secondary">Try clearing some filters.</p>
</div>`,
    ];
  } else {
    carsHTML = carList.map(function (car) {
      return `
      <div
        class="flex flex-col gap-5 md:flex-row md:items-center rounded-xl border border-grayish-border bg-dark-secondary p-4 transition hover:border-accent/50"
      >
  
        <!-- Car Image -->
        <div class="h-44 w-full md:h-32 md:w-56 shrink-0 overflow-hidden rounded-lg bg-dark-bg">
          <img
            src="${car.image}"
            alt="${car.name}"
            class="h-full w-full object-cover"
          />
        </div>
  
        <!-- Vehicle Information -->
        <div class="flex-1">
          <h3 class="text-xl font-semibold">
            ${car.name}
          </h3>
  
          <p class="mt-1 text-sm text-secondary">
            ${car.type}
          </p>
  
          <div class="mt-5 flex items-center gap-5 text-sm text-secondary">
            <span>${car.seats} Seats</span>
            <span>${car.transmission}</span>
            <span>${car.fuel}</span>
          </div>
        </div>
  
        <!-- Price + Button -->
        <div
          class="flex w-full shrink-0 flex-col items-start border-t border-grayish-border pt-4 md:w-40 md:border-t-0 md:border-l md:pt-0 md:pl-5"
        >
          <p class="text-xs text-secondary">
            Daily rate
          </p>
  
          <p class="mt-1 text-2xl font-semibold">
            ₹${car.price.toLocaleString("en-IN")}
            <span class="text-sm font-normal text-secondary">
              / day
            </span>
          </p>
  
          <button
            data-car-id = "${car.id}"
            class="select-car mt-4 w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-dark-bg transition hover:brightness-110 cursor-pointer"
          >
            Select Car →
          </button>
        </div>
  
      </div>
    `;
    });
  }

  carsContainer.innerHTML = carsHTML.join("");

  // adding eventListeners for buttons
  // car-id eventlistener
  const selectButtons = document.querySelectorAll(".select-car");
  selectButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCarId = button.dataset.carId 
      localStorage.setItem("selectedCar",selectedCarId)
      window.location.href = "bookings.html"

      selectedCar = cars.find(function (car) {
        return Number(selectedCarId) === car.id
      })
    });
  });
}

// load all cars when the page loads
renderCars(cars);

// array of all checkboxes
const filterCheckboxes = Array.from(
  document.querySelectorAll('input[type="checkbox"]'),
);

// range slider
const priceRange = document.querySelector('input[type="range"]');
const priceValue = document.querySelector("#price-value");

// search box
const searchInput = document.querySelector("#search-input");

// clear all
const clearFilters = document.querySelector("#clear-filters");

// sorting
const sortCars = document.querySelector("#sort");

// available cars
const availableCars = document.querySelector("#available-cars");
const resultsCount = document.querySelector("#results-count");

// filter cars
function applyFilters() {
  // the current value of range slider
  const maxPrice = Number(priceRange.value);

  // searchbox content
  const searchTerm = searchInput.value.toLowerCase();

  // car-type filter
  const typeCheckboxes = filterCheckboxes.filter(function (checkbox) {
    return checkbox.dataset.filter === "type";
  });

  const checkedTypes = typeCheckboxes.filter(function (checkbox) {
    return checkbox.checked;
  });

  const selectedTypes = checkedTypes.map(function (checkbox) {
    return checkbox.value;
  });

  // transmission filter
  const transmissionCheckboxes = filterCheckboxes.filter(function (checkbox) {
    return checkbox.dataset.filter === "transmission";
  });

  const checkedTransmissions = transmissionCheckboxes.filter(
    function (checkbox) {
      return checkbox.checked;
    },
  );

  const selectedTransmissions = checkedTransmissions.map(function (checkbox) {
    return checkbox.value;
  });

  // Fuel filter
  const fuelCheckboxes = filterCheckboxes.filter(function (checkbox) {
    return checkbox.dataset.filter === "fuel";
  });

  const checkedFuels = fuelCheckboxes.filter(function (checkbox) {
    return checkbox.checked;
  });

  const selectedFuels = checkedFuels.map(function (checkbox) {
    return checkbox.value;
  });

  // Seats filter
  const seatsCheckboxes = filterCheckboxes.filter(function (checkbox) {
    return checkbox.dataset.filter === "seats";
  });

  const checkedSeats = seatsCheckboxes.filter(function (checkbox) {
    return checkbox.checked;
  });

  const selectedSeats = checkedSeats.map(function (checkbox) {
    return checkbox.value;
  });

  const filteredCars = cars.filter(function (car) {
    return (
      (selectedTypes.length === 0 || selectedTypes.includes(car.type)) &&
      (selectedTransmissions.length === 0 ||
        selectedTransmissions.includes(car.transmission)) &&
      (selectedFuels.length === 0 || selectedFuels.includes(car.fuel)) &&
      (selectedSeats.length === 0 ||
        selectedSeats.includes(String(car.seats))) &&
      car.price <= maxPrice &&
      (searchTerm === "" || car.name.toLowerCase().includes(searchTerm))
    );
  });

  const sortValue = sortCars.value;

  if (sortValue === "price-low") {
    filteredCars.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (sortValue === "price-high") {
    filteredCars.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (sortValue === "name") {
    filteredCars.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }
  renderCars(filteredCars);
  availableCars.textContent = filteredCars.length;
  resultsCount.textContent = `${filteredCars.length} vehicles available`;
}

// checkbox eventlistener
filterCheckboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    applyFilters();
  });
});

// price range event listener
priceRange.addEventListener("input", function () {
  priceValue.textContent = `₹${Number(priceRange.value).toLocaleString("en-IN")}`;
  applyFilters();
});

searchInput.addEventListener("input", function () {
  applyFilters();
});

// reset all filters
clearFilters.addEventListener("click", function () {
  filterCheckboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });
  priceRange.value = 9000;
  priceValue.textContent = `₹${Number(priceRange.value).toLocaleString("en-IN")}`;
  searchInput.value = "";
  applyFilters();
});

// sort cars eventlistener
sortCars.addEventListener("change", function () {
  applyFilters();
});
