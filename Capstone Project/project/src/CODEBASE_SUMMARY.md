# DRIVEON — Codebase Summary (for me to read before the demo)

This file explains **how the project works now**, with extra focus on the logic that was
added or changed while fixing bugs. It is not a README for strangers — it is my study guide.

> **Before opening the site:** the new responsive Tailwind classes only work after the CSS is
> rebuilt. Run your usual Tailwind build (the command that turns `input.css` into
> `output.css`), or use the rebuilt `output.css` that came with these files.

---

## 1. Project Structure

### The four pages

| Page | What it does | Scripts it loads |
|---|---|---|
| `index.html` | Homepage. Hero, **booking bar** (location, dates, times), "Why choose us", the **fleet carousel**, call-to-action, footer. | `js/data.js`, `js/homepage.js` |
| `cars.html` | Shows all cars as a list, with **filters**, search, sort and price slider. | `js/data.js`, `js/script.js` |
| `bookings.html` | 3-step booking form (Rental details → Personal details → Payment) with a car summary on the side. | `js/data.js`, `js/booking.js` |
| `confirmation.html` | "Booking Confirmed!" page showing the saved booking. | `js/confirmation.js` |

### The JavaScript files

| File | Job |
|---|---|
| `js/data.js` | Holds the **`cars` array** (10 car objects). This is the **only** place car data lives. |
| `js/homepage.js` | Saves the booking bar to localStorage when "View Vehicles" is clicked, sets minimum dates, and runs the fleet carousel (`renderCarousel`, `createCardHTML`, next/prev buttons). |
| `js/script.js` | Cars page: `renderCars()` draws the list, `applyFilters()` filters/sorts and updates the counts, "Select Car" saves the chosen car. |
| `js/booking.js` | Booking page: loads the chosen car, restores dates, validates, calculates price, switches steps, saves the final booking. |
| `js/confirmation.js` | Reads the saved booking and fills in the confirmation page. |

### Where the car data is

`js/data.js` — each car looks like this:

```js
{
  id: 2,
  name: "Volkswagen Virtus",
  type: "Sedan",
  price: 3500,
  seats: 5,
  transmission: "Automatic",
  fuel: "Petrol",
  image: "assets/images/cars/virtus.png",
}
```

Three pages load `data.js` **before** their own script, so the variable `cars` already
exists when their code runs. (That order in the `<script>` tags matters!)

### CSS

`input.css` (Tailwind + my colours like `accent`, `dark-bg`) → Tailwind build → `output.css`.
Every page links `output.css`. If I add a new Tailwind class, the build must run again.

---

## 2. Main Data Flow

```text
Homepage (index.html)
   │  user picks location/dates → clicks "View Vehicles"
   │  homepage.js saves 5 values in localStorage
   ▼
Cars (cars.html)
   │  user filters/searches → clicks "Select Car →"
   │  script.js saves the car's id in localStorage
   ▼
Booking (bookings.html)
   │  booking.js loads the car + saved dates, validates 3 steps
   │  on "Pay & Confirm" saves one "booking" object
   ▼
Confirmation (confirmation.html)
      confirmation.js reads the "booking" object and shows it
```

Pages are separate files, so they can't share variables. **localStorage is the "memory"
that survives when the browser moves from one page to the next.**

---

## 3. localStorage

localStorage stores **text (strings)** under a name (key). Two commands:
`localStorage.setItem("key", value)` and `localStorage.getItem("key")`.

| Key | What it stores | Saved in | Used in |
|---|---|---|---|
| `pickupLocation` | e.g. `"Patna"`, `"Other location"` | `homepage.js` (View Vehicles click) | `booking.js` (fills the dropdown) |
| `pickupDate` | e.g. `"2026-10-01"` | `homepage.js` | `booking.js` |
| `pickupTime` | e.g. `"10:00"` | `homepage.js` | `booking.js` |
| `dropoffDate` | e.g. `"2026-10-03"` | `homepage.js` | `booking.js` |
| `dropoffTime` | e.g. `"10:00"` | `homepage.js` | `booking.js` |
| `selectedCar` | the car's **id** as text, e.g. `"2"` | `script.js` (Select Car click) | `booking.js` (finds the car with `cars.find`) |
| `booking` | the whole final booking, as JSON text | `booking.js` (Pay & Confirm) | `confirmation.js` |

Two things to remember:

* An id comes back as text, so `booking.js` converts it: `Number(selectedCarId)`.
* The `booking` object is turned into text with `JSON.stringify(...)` when saving and back
  into an object with `JSON.parse(...)` when reading.

**"Other location" fix:** the dropdown option on the homepage and on the booking page now both
have `value="Other location"`. Before, the booking page said `"Other"`, so the saved value
didn't match any option and the dropdown went blank.

---

## 4. Booking Page Logic (`booking.js`)

### 4.1 Loading the selected car

```js
const selectedCarId = localStorage.getItem("selectedCar");

const selectedCar = cars.find((car) => {
  return car.id === Number(selectedCarId);
});

if (!selectedCar) {
  window.location.href = "cars.html";   // no car saved → go and pick one
} else {
  // ...fill the car summary (image, name, seats, price...)
}
```

`find()` returns the first car that matches, or `undefined` if none does. That `undefined`
used to crash the page (`selectedCar.image` on nothing). Now it just redirects.

### 4.2 Restoring the rental details

The five saved values are read with `getItem` and, if they exist, put back into the inputs
(`pickupDateInput.value = pickupDate;` and so on).

### 4.3 Minimum dates

* Pickup date: `min` = today.
* Drop-off date: `min` = **pickup + 1 day**. (Set on load, and again whenever pickup changes.)

**New:** if the user moves the pickup date past the drop-off date, the drop-off date is
cleared so it can't stay invalid:

```js
pickupDateInput.addEventListener("change", function () {
  if (pickupDateInput.value !== "") {
    const date = new Date(pickupDateInput.value);
    date.setDate(date.getDate() + 1);              // pickup + 1 day
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
```

### 4.4 Duration, total and advance

`calculateDuration()` runs whenever a date changes (and once on load if dates were saved).

```js
duration = differenceInMilliseconds / (1000 * 60 * 60 * 24);   // ms → days

// A missing date gives NaN, and drop-off before pickup gives less than 1 day:
// in both cases show dashes instead of wrong numbers
if (isNaN(duration) || duration < 1) {
  // ...show "—" everywhere and return
}

totalPrice = duration * selectedCar.price;
advanceAmount = Math.min(totalPrice * 0.5, 2000);
```

* **Total** = days × the car's daily price.
* **Advance** = half of the total, but never more than ₹2,000 (`Math.min` picks the smaller).
* **Pay at return** = total − advance.
* The **Pay button** text is updated in the same function:
  `payButtonAmount.textContent = ₹...`, so it always matches the advance amount.

Rentals are counted in **whole days**, so the shortest rental is 1 day (that is why drop-off
must be on a later date than pickup).

### 4.5 The three steps

The three forms (`#step-1`, `#step-2`, `#step-3`) are all in the page. Only one is visible;
the others have the Tailwind class `hidden`. Moving on means:

```js
step1Container.classList.add("hidden");      // hide this step
step2Container.classList.remove("hidden");   // show the next step
updateStepIndicator(2);                      // highlight circle "2" at the top
```

**Step indicator (new):** `updateStepIndicator(currentStep)` loops over the three circles.
The current one gets the green look (`bg-accent`, bold); the others get the dim look
(`opacity-50`, border). It is called from all four buttons (Continue/Back on each step).

### 4.6 Final booking

When everything is valid, the code builds a `bookingDetails` object (car, dates, customer,
prices), saves it with `localStorage.setItem("booking", JSON.stringify(bookingDetails))` and
moves to `confirmation.html`.

---

## 5. Validation

All error messages now appear **inline** (a small red line above the buttons), not as browser
pop-ups. There are three empty message boxes in `bookings.html`:

```html
<p id="step-1-error" class="mb-3 text-right text-sm text-red-400 empty:hidden"></p>
```

`empty:hidden` is a Tailwind class that hides the box while it has no text, so it takes no
space. The JavaScript only sets or clears the text:

```js
step1Error.textContent = "Please fill in all rental details.";   // show
step1Error.textContent = "";                                      // clear
```

### Rental details (step 1)

```js
if (
  pickupLocationInput.value === "" ||
  pickupDateInput.value === "" ||
  pickupTimeInput.value === "" ||
  dropoffDateInput.value === "" ||
  dropoffTimeInput.value === ""
) {
  step1Error.textContent = "Please fill in all rental details.";
  return;                       // stop here, don't go to step 2
}
```

### Date order

```js
if (new Date(dropoffDateInput.value) <= new Date(pickupDateInput.value)) {
  step1Error.textContent = "Drop-off date must be after the pickup date.";
  return;
}
```

Comparing the **dates** (not date + time) matches how the price is counted (whole days) and
stops a same-day rental from costing ₹0.

### Personal details (step 2)

One `if` with `&&` checks everything at once: name not empty, phone is 10 digits, email has
`@` and `.`, purpose and driving experience chosen. If it is true → go to step 3. Otherwise:
`"Please fill in all required fields correctly."`

### Payment details (step 3) and card expiry

The expiry input already formats itself as `MM/YY`. The new check makes sure it is complete
and the month is real:

```js
const expiryMonth = Number(cardExpiryInput.value.slice(0, 2));   // "12/29" → 12

if (
  cardHolderInput.value !== "" &&
  cardNumberInput.value.replaceAll(" ", "").length === 16 &&
  cardExpiryInput.value.length === 5 &&     // must be a full MM/YY
  expiryMonth >= 1 &&
  expiryMonth <= 12 &&                      // month between 01 and 12
  cardCvvInput.value.length === 3 &&
  paymentTerms.checked
) {
  // save booking and go to confirmation
} else {
  step3Error.textContent = "Please check your card details and agree to the terms.";
}
```

Valid: `01/27`, `12/29`. Invalid: empty, `00/27`, `13/27`, `99/99`, `12/2`.
(It does **not** check whether the card is in the past — this is only a college simulation.)

---

## 6. Car Filtering (`script.js`)

* **`cars`** — the array from `data.js`.
* **`renderCars(carList)`** — takes *any* list of cars and draws one card per car
  (`carList.map(...)` builds the HTML, `innerHTML` puts it on the page). If the list is
  empty it draws the "No vehicles found" box (🔍 icon + "Try clearing some filters.").
* **`applyFilters()`** — runs every time a checkbox, the search box, the slider or the sort
  dropdown changes.

How `applyFilters()` works, step by step:

1. Read the slider (`maxPrice`) and the search text.
2. For each filter group (type, transmission, fuel, seats) build an array of the ticked
   values, using `filter()` then `map()`:

```js
const typeCheckboxes = filterCheckboxes.filter(function (checkbox) {
  return checkbox.dataset.filter === "type";          // only the "type" checkboxes
});
const checkedTypes = typeCheckboxes.filter(function (checkbox) {
  return checkbox.checked;                            // only the ticked ones
});
const selectedTypes = checkedTypes.map(function (checkbox) {
  return checkbox.value;                              // e.g. ["Sedan", "SUV"]
});
```

3. Keep only the cars that match **every** group. An empty group means "no filter":

```js
const filteredCars = cars.filter(function (car) {
  return (
    (selectedTypes.length === 0 || selectedTypes.includes(car.type)) &&
    // ...same idea for transmission, fuel, seats...
    car.price <= maxPrice &&
    (searchTerm === "" || car.name.toLowerCase().includes(searchTerm))
  );
});
```

4. Sort `filteredCars` if the user picked a sort option.
5. Draw and update **both** counts:

```js
renderCars(filteredCars);
availableCars.textContent = filteredCars.length;                       // top counter
resultsCount.textContent = `${filteredCars.length} vehicles available`; // results header (new)
```

**Filter counts in the sidebar** (`Sedan 5`, `SUV 3`, `MPV 2`, ...) are typed by hand in
`cars.html`. I corrected Sedan (4 → 5) and MPV (3 → 2) to match `data.js`. If I add or
change a car, I must update these numbers by hand.

**Prices** are shown with `car.price.toLocaleString("en-IN")` → `₹9,000`, `₹1,750`.
The stored numbers are unchanged; only the text on screen is formatted.

---

## 7. Responsive Design

**Idea:** in Tailwind, a class **without** a prefix applies to *every* screen (phone first).
A class **with** a prefix applies from that width **and up**:

| Prefix | Starts at |
|---|---|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px (my "desktop" line) |

So `grid-cols-2 lg:grid-cols-6` means: 2 columns on phones/tablets, 6 columns on desktop.
**Every desktop value was kept behind `lg:`/`md:`/`sm:`, so the desktop page looks the same.**

### What changed, page by page

| Page / part | Phone & tablet (below `lg`) | Classes introduced |
|---|---|---|
| **Navbar** (all pages) | Smaller text and gaps, "Profile" icons hidden on phones | `gap-3 text-sm sm:gap-10 sm:text-base`, `px-4 sm:px-6`, `hidden sm:flex` |
| **Homepage hero** | Hero text sits normally in the page, booking bar goes **below** it | `relative lg:absolute`, `lg:h-100`, `pt-24 pb-8 pl-6 lg:pl-22` |
| **Homepage booking bar** | 2 columns; location and button use the full width | `grid-cols-2 lg:grid-cols-6`, `col-span-2 lg:col-span-1` |
| **Homepage "Why choose us"** | 1 column, then 2 on tablets | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| **Homepage carousel** | One big card; side cards only on desktop | `hidden lg:block`, `w-full max-w-xl lg:w-[50%]` |
| **Call-to-action** | Text above the button | `flex-col md:flex-row` |
| **Cars page layout** | Filters **above** the list | `col-span-12 lg:col-span-3` / `lg:col-span-9`, `gap-y-8 lg:gap-x-8` |
| **Car cards** | Image on top, text, then price + button | `flex-col md:flex-row`, `h-44 w-full md:h-32 md:w-56` |
| **Booking page** | Form first, summary **below** it | `col-span-12 lg:col-span-9` / `lg:col-span-3`, `lg:sticky` |
| **Booking form rows** | Date/time and phone/email stack | `grid-cols-1 sm:grid-cols-2` |
| **Step indicator** | Only the numbered circles (labels hidden) | `hidden md:block` on the labels |
| **Confirmation info** | 2 × 2 grid | `grid-cols-2 lg:grid-cols-4` (+ border tweaks) |
| **Footer** (all pages) | Everything stacked | `grid-cols-1 sm:grid-cols-3`, `flex-col lg:flex-row` |

Tested from 320px to 1440px: no sideways scrolling on any page.

---

## 8. Bugs Fixed

- [x] Booking could be completed without dates (`undefined days`, `₹undefined`)
- [x] Step 1 now checks location, dates and times, and drop-off after pickup (inline message)
- [x] `bookings.html` crashed when no car was saved → now redirects to `cars.html`
- [x] Negative duration / negative price / `NaN` in the rental summary
- [x] Pickup moved after drop-off → drop-off is cleared
- [x] Pay button showed a fixed "₹2,000" → now matches the calculated advance
- [x] "Other location" was lost between homepage and booking page
- [x] Wrong Sedan / MPV counts in the Cars filters
- [x] "10 vehicles available" header didn't change when filtering
- [x] "Explore our fleet" and the small arrows on the fleet cards did nothing (now normal links to `cars.html`)
- [x] Step indicator stayed on step 1
- [x] "No vehicles found" box had an empty circle (now icon + hint)
- [x] Prices formatted inconsistently (`₹8500`) → Indian format (`₹8,500`)
- [x] Step 2 and step 3 did nothing when something was wrong → inline messages
- [x] Card expiry was never checked → must be `MM/YY` with month 01–12
- [x] Mobile layout for all four pages
- [x] **Found while testing:** the homepage booking bar was partly covered by the hero text
      layer, so parts of it (including "View Vehicles") couldn't be clicked → the bar now sits
      above it (`z-20`)
- [x] **Found while testing:** the 12-column grids had a big fixed gap, which pushed the
      booking page sideways on phones → gap is now only added on desktop

---

## 9. Things I Should Understand Before My Demo

| Topic | Where my project uses it |
|---|---|
| **localStorage** (`setItem`, `getItem`) | Passing dates and the chosen car between pages; saving the final booking |
| **JSON** (`stringify` / `parse`) | Saving and reading the `booking` object |
| **DOM selection** (`querySelector`, `querySelectorAll`) | Every script finds its inputs/buttons this way |
| **`dataset`** | `data-filter` on checkboxes, `data-car-id` on Select Car buttons |
| **Event listeners** (`click`, `change`, `input`) | Buttons, date inputs, filters, expiry/phone formatting |
| **Conditionals** (`if`, `&&`, `||`, early `return`) | All the validation |
| **Array methods** `find`, `filter`, `map`, `includes` | Finding the selected car, filtering cars, building cards |
| **Template literals** (`` `...${value}...` ``) | Building card HTML and price text |
| **`innerHTML` vs `textContent`** | Cards use `innerHTML`; messages and numbers use `textContent` |
| **Date objects** | `new Date(...)`, `setDate`, subtracting dates to get days |
| **Calculations** | `duration * price`, `Math.min(total * 0.5, 2000)` |
| **`classList.add/remove`** | Showing/hiding steps, step indicator, carousel fade |
| **`toLocaleString("en-IN")`** | ₹9,000 style prices |
| **Tailwind responsive classes** | `sm:` `md:` `lg:` in every page |
| **Flexbox & Grid** | Navbar, cards, booking form, 12-column page layouts |

---

## 10. Code I Should Be Able to Explain

An instructor could reasonably ask me to walk through these:

1. **`homepage.js` — the "View Vehicles" click handler**: saves five values to localStorage,
   then goes to `cars.html`.
2. **`homepage.js` — `renderCarousel()`**: works out previous / current / next index
   (wrapping from the last car to the first), then draws three cards.
3. **`script.js` — `applyFilters()`**: builds the "selected" arrays with `filter()` + `map()`,
   filters `cars`, sorts, calls `renderCars()`, updates both counts.
4. **`script.js` — the "Select Car" click**: saves the car id, opens `bookings.html`.
5. **`booking.js` — loading the car with `cars.find`** and the redirect when it isn't found.
6. **`booking.js` — `calculateDuration()`**: days → total → advance, and why invalid dates
   show dashes.
7. **`booking.js` — the step 1 / step 2 / step 3 validation** and why each stops with `return`
   or `else`.
8. **`booking.js` — `updateStepIndicator()`**: the loop that highlights one step.
9. **`booking.js` — saving `bookingDetails`** with `JSON.stringify`, and
   **`confirmation.js` — reading it back** with `JSON.parse`.
10. **Tailwind responsive classes**: explain `grid-cols-2 lg:grid-cols-6` and why the
    booking page puts the summary below the form on phones.

---

## Quick demo checklist

1. Homepage → click **View Vehicles** with nothing filled → cars page.
2. Filter (e.g. SUV) → both counts show 3 → tick "Manual" → empty state.
3. **Select Car** → click **Personal Details →** with empty fields → red message.
4. Fill valid dates (drop-off after pickup) → check duration, total, advance.
5. Step 2 → leave a field empty → message; fill it → step 3 (indicator moves).
6. Step 3 → wrong expiry like `13/27` → message; valid card → confirmation page.
7. Resize the browser (or use phone view) → layout stacks, no sideways scrolling.
