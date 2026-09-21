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
pickupDateInput.min = today;

// dropoffdate validation
const dropoffDateInput = document.querySelector("#drop-off-date");

pickupDateInput.addEventListener("change", function () {
  const date = new Date(pickupDateInput.value);
  date.setDate(date.getDate() + 1);

  const minimumDropffDate = date.toISOString().slice(0, 10);
  dropoffDateInput.min = minimumDropffDate;
});

// ---------- Fleet carousel ----------
// `cars` comes from data.js (loaded before this file in index.html)

const carousel = document.querySelector("#carousel");
let currentIndex = 1; // Dzire (0) on the left, Virtus (1) in the centre, Slavia (2) on the right

// Builds the HTML for ONE card. isActive = true -> big centre card, false -> small faded side card
function createCardHTML(car, isActive) {
  let cardClasses = "border border-gray-700 rounded-2xl overflow-hidden ";
  let imageClasses = "";

  if (isActive) {
    // one big card on phones and tablets, 50% wide on lg screens and up
    cardClasses += "w-full max-w-xl lg:max-w-none lg:w-[50%]";
    imageClasses = "object-cover";
  } else {
    // side cards are hidden on phones and tablets, shown from lg screens and up
    cardClasses += "hidden lg:block w-[25%] h-[70%] opacity-70";
    imageClasses = "h-52 w-full object-cover";
  }

  return `
    <div class="${cardClasses}">
      <img src="${car.image}" alt="${car.name}" class="${imageClasses}" />
      <div class="flex bg-dark-secondary">
        <div class="bg-dark-secondary w-full py-2 px-4">
          <div>
            <p class="text-lg font-medium">${car.name}</p>
            <p class="text-secondary text-[13px] font-medium">${car.type}</p>
            <p class="text-lg font-medium">
              &#8377; ${car.price.toLocaleString("en-IN")}<span class="text-secondary text-[13px] font-medium"> /day</span>
            </p>
          </div>
        </div>
        <div class="bg-dark-secondary w-full flex items-center justify-end pr-8">
          <a href="cars.html" aria-label="View all cars">
            <img src="assets/images/circle-arrow-right-svgrepo-com.svg" alt="" class="h-10" />
          </a>
        </div>
      </div>
    </div>
  `;
}

// cars array -> currentIndex -> previous/current/next -> 3 cards -> #carousel
function renderCarousel() {
  let previousIndex = currentIndex - 1;
  if (previousIndex < 0) {
    previousIndex = cars.length - 1; // before the first car comes the last car
  }

  let nextIndex = currentIndex + 1;
  if (nextIndex > cars.length - 1) {
    nextIndex = 0; // after the last car comes the first car
  }

  carousel.innerHTML =
    createCardHTML(cars[previousIndex], false) +
    createCardHTML(cars[currentIndex], true) +
    createCardHTML(cars[nextIndex], false);
}

// Fade out, swap the cards, fade back in (the fade itself is Tailwind's transition-opacity on #carousel)
function updateCarousel() {
  carousel.classList.add("opacity-0");
  setTimeout(function () {
    renderCarousel();
    carousel.classList.remove("opacity-0");
  }, 150);
}

document.querySelector("#carousel-next").addEventListener("click", function () {
  currentIndex++;
  if (currentIndex > cars.length - 1) {
    currentIndex = 0;
  }
  updateCarousel();
});

document.querySelector("#carousel-prev").addEventListener("click", function () {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = cars.length - 1;
  }
  updateCarousel();
});

renderCarousel(); // first render
