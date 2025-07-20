// Get tableNumber globally if it's needed before DOMContentLoaded,
// otherwise, declare it inside the DOMContentLoaded for better encapsulation.
// For this application, it's fine inside DOMContentLoaded.
const urlParams = new URLSearchParams(window.location.search);
const tableNumber = urlParams.get("table") || "N/A"; // Make tableNumber accessible within this scope

document.addEventListener("DOMContentLoaded", () => {
  // --- PART 1: DYNAMIC TABLE NUMBER ---
  const tableNumberElement = document.getElementById("tableNumberDisplay");
  if (tableNumberElement) {
    tableNumberElement.textContent = tableNumber;
  }

  // --- PART 2: SHOPPING CART LOGIC ---
  const cart = {}; // A JavaScript object to store the items in our cart.
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");

  // This function redraws the cart display based on the current state of the 'cart' object.
  function updateCartDisplay() {
    cartItemsContainer.innerHTML = ""; // Clear the current display.
    let total = 0;

    if (Object.keys(cart).length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalElement.textContent = "$0.00";
      return;
    }

    for (const [name, details] of Object.entries(cart)) {
      const itemElement = document.createElement("p");
      itemElement.textContent = `${details.quantity}x ${name}`;
      cartItemsContainer.appendChild(itemElement);
      total += details.quantity * details.price;
    }
    cartTotalElement.textContent = `$${total.toFixed(2)}`; // Update total price display
  }

  // Loop through every "Add to Order" button
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const menuItem = button.closest(".menu-item");
      const name = menuItem.dataset.name;
      const price = parseFloat(menuItem.dataset.price);

      if (cart[name]) {
        cart[name].quantity++;
      } else {
        cart[name] = { quantity: 1, price: price };
      }
      console.log(`Added ${name} to cart. Cart is now:`, cart);
      updateCartDisplay();
    });
  });

  // Initialize the cart display when the page loads.
  updateCartDisplay();

  // --- PART 3: BILINGUAL REAL-TIME MENU SEARCH ---
  const searchInput = document.getElementById("menuSearchInput");
  const allMenuItems = document.querySelectorAll(".menu-item");

  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const searchQuery = searchInput.value.trim();

      if (searchQuery === "") {
        allMenuItems.forEach((item) => {
          item.style.display = "flex";
        });
        return;
      }

      allMenuItems.forEach((item) => {
        const englishName = item.dataset.name.toLowerCase();
        const tigrinyaName = item.dataset.nameTg; // Keep Tigrinya as is, assuming direct match

        if (
          englishName.includes(searchQuery.toLowerCase()) ||
          tigrinyaName.includes(searchQuery)
        ) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  // --- PART 4: ACCORDION FOR SERVICES ---
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      // Handle the special case for the "Call Waiter" button
      if (header.id === "callWaiterHeader") {
        if (confirm("Are you sure you want to call a waiter to your table?")) {
          alert(
            `A waiter has been notified and will be with you shortly at Table ${tableNumber}.`
          );
        }
        return; // Stop here, no accordion content to toggle
      }

      // For all other accordion items (like Wi-Fi)
      const content = header.nextElementSibling;

      header.classList.toggle("active"); // Toggle 'active' class for arrow rotation and padding

      if (content.style.maxHeight) {
        // If it has a maxHeight, it's open. Close it.
        content.style.maxHeight = null;
      } else {
        // If it's closed, open it.
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // --- PART 5: ORDER FORM SUBMISSION ---
  const orderForm = document.getElementById("orderForm");
  const tableCodeInput = document.getElementById("tableCode");

  if (orderForm) {
    orderForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission (page reload)

      const currentTableCode = tableCodeInput.value.trim();
      if (!currentTableCode) {
        alert("Please enter your table code.");
        return;
      }

      if (Object.keys(cart).length === 0) {
        alert("Your cart is empty. Please add items before placing an order.");
        return;
      }

      // Prepare order data to be sent to a backend server
      const orderData = {
        tableNumber: tableNumber, // Using the tableNumber from URL params
        tableCode: currentTableCode,
        items: cart, // The current state of the cart
        total: parseFloat(cartTotalElement.textContent.replace("$", "")), // Parse current total from display
      };

      console.log("Order to be placed:", orderData);

      // --- IMPORTANT: This is where you would send the data to a real server ---
      // For example, using the Fetch API:
      /*
      fetch('/api/place-order', { // Replace with your actual API endpoint
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Order placed successfully! A waiter will be with you shortly.');
              // Clear cart and update display after successful order
              for (const key in cart) { delete cart[key]; } // Clear cart object
              updateCartDisplay(); // Redraw cart display
              tableCodeInput.value = ''; // Clear table code input
          } else {
              alert('Failed to place order: ' + (data.message || 'Unknown error.'));
          }
      })
      .catch(error => {
          console.error('Error placing order:', error);
          alert('An error occurred while placing your order. Please try again.');
      });
      */

      // --- Simulation for now (without a backend) ---
      alert(
        `Order placed successfully for Table ${tableNumber} with code '${currentTableCode}'!\nA waiter will be with you shortly.`
      );
      // Clear cart locally for demonstration
      for (const key in cart) {
        delete cart[key];
      }
      updateCartDisplay();
      tableCodeInput.value = "";
    });
  }
});
