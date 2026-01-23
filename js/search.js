document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     GLOBAL SEARCH + AUTOCOMPLETE
  ========================================================== */
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const suggestionsBox = document.getElementById("search-suggestions");

  const allProducts = [
    { name: "iPhone 14", category: "shop-mobile-phone.html" },
    { name: "Samsung Galaxy S23", category: "shop-mobile-phone.html" },
    { name: "Google Pixel 8", category: "shop-mobile-phone.html" },

    { name: "iPhone 14 Case", category: "shop-phone-cases.html" },
    { name: "Samsung S23 Case", category: "shop-phone-cases.html" },
    { name: "Universal Case", category: "shop-phone-cases.html" },

    { name: "Fast Charger 25W", category: "shop-chargers-cables.html" },
    { name: "USB-C Cable 1m", category: "shop-chargers-cables.html" },
    { name: "Wireless Charging Pad", category: "shop-chargers-cables.html" },

    { name: "iPhone Screen Protector", category: "shop-screen-protectors.html" },
    { name: "Samsung Screen Protector", category: "shop-screen-protectors.html" },
    { name: "Universal Screen Protector", category: "shop-screen-protectors.html" },

    { name: "Leather Band", category: "shop-smartwatch-bands.html" },
    { name: "Silicone Band", category: "shop-smartwatch-bands.html" },
    { name: "Metal Link Band", category: "shop-smartwatch-bands.html" },

    { name: "Basic Wireless Earbuds", category: "shop-wireless-earbuds.html" },
    { name: "Noise Cancelling Earbuds", category: "shop-wireless-earbuds.html" },
    { name: "Sports Wireless Earbuds", category: "shop-wireless-earbuds.html" }
  ];

  function performGlobalSearch(term) {
    if (!term) return;

    const match = allProducts.find(p =>
      p.name.toLowerCase().includes(term)
    );

    if (match) {
      window.location.href =
        `${match.category}?search=${encodeURIComponent(term)}`;
    } else {
      alert(`No products found matching "${term}"`);
    }
  }

  function showSuggestions(term) {
    if (!suggestionsBox) return;

    suggestionsBox.innerHTML = "";

    if (!term) {
      suggestionsBox.style.display = "none";
      return;
    }

    const matches = allProducts.filter(p =>
      p.name.toLowerCase().includes(term)
    );

    if (matches.length === 0) {
      suggestionsBox.style.display = "none";
      return;
    }

    matches.slice(0, 6).forEach(product => {
      const li = document.createElement("li");
      li.textContent = product.name;
      li.addEventListener("click", () => {
        window.location.href =
          `${product.category}?search=${encodeURIComponent(product.name)}`;
      });
      suggestionsBox.appendChild(li);
    });

    suggestionsBox.style.display = "block";
  }

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase().trim();
      showSuggestions(term);
    });

    searchInput.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        performGlobalSearch(searchInput.value.toLowerCase().trim());
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      performGlobalSearch(searchInput.value.toLowerCase().trim());
    });
  }

  document.addEventListener("click", e => {
    if (!e.target.closest(".search-wrapper") && suggestionsBox) {
      suggestionsBox.style.display = "none";
    }
  });

  /* =========================================================
     PRODUCT SEARCH / FILTER / SORT / PAGINATION (Category)
  ========================================================== */
  class ProductSearch {
    constructor() {
      this.currentPage = 1;
      this.itemsPerPage = 6;
      this.allItems = [];
      this.filteredItems = [];
      this.init();
    }

    init() {
      this.loadProducts();
      this.bindEvents();
      this.applyURLSearch();
      this.displayContent();
    }

    loadProducts() {
      const cards = document.querySelectorAll(".product-card");
      this.allItems = Array.from(cards).map(card => ({
        element: card,
        title: card.querySelector("h3")?.textContent.toLowerCase() || "",
        description: card.querySelector("p")?.textContent.toLowerCase() || "",
        price: this.extractPrice(card.querySelector(".price")?.textContent || ""),
        category: this.determineCategory(card)
      }));
      this.filteredItems = [...this.allItems];
    }

    extractPrice(text) {
      const match = text.match(/R?(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }

    determineCategory(card) {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      if (title.includes("phone") || title.includes("iphone") || title.includes("samsung")) return "smartphone";
      if (title.includes("case")) return "case";
      if (title.includes("charger") || title.includes("cable")) return "charger";
      if (title.includes("earbud") || title.includes("headphone")) return "earbuds";
      if (title.includes("protector")) return "protector";
      if (title.includes("band") || title.includes("watch")) return "watch";
      return "other";
    }

    bindEvents() {
      const searchInput = document.querySelector(".search-input");
      const priceSort = document.getElementById("price");
      const typeFilter = document.getElementById("type");

      if (searchInput) {
        searchInput.addEventListener("input", e =>
          this.searchContent(e.target.value)
        );
      }

      if (priceSort) {
        priceSort.addEventListener("change", () =>
          this.sortProducts(priceSort.value)
        );
      }

      if (typeFilter) {
        typeFilter.addEventListener("change", () =>
          this.filterByType(typeFilter.value)
        );
      }
    }

    applyURLSearch() {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("search");
      if (query) this.searchContent(query);
    }

    searchContent(term) {
      const t = term.toLowerCase();
      this.filteredItems = this.allItems.filter(item =>
        item.title.includes(t) || item.description.includes(t)
      );
      this.currentPage = 1;
      this.displayContent();
    }

    sortProducts(type) {
      if (type === "low-high") {
        this.filteredItems.sort((a, b) => a.price - b.price);
      } else if (type === "high-low") {
        this.filteredItems.sort((a, b) => b.price - a.price);
      }
      this.displayContent();
    }

    filterByType(type) {
      this.filteredItems =
        type === "all"
          ? [...this.allItems]
          : this.allItems.filter(i => i.category === type);

      this.currentPage = 1;
      this.displayContent();
    }

    displayContent() {
      const grid = document.querySelector(".product-grid");
      if (!grid) return;

      this.allItems.forEach(i => (i.element.style.display = "none"));
      this.filteredItems.forEach(i => (i.element.style.display = "block"));

      this.updatePagination();
    }

    updatePagination() {
      const pagination = document.getElementById("pagination");
      if (!pagination) return;

      const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
      if (totalPages <= 1) {
        pagination.style.display = "none";
        return;
      }

      pagination.style.display = "block";
      pagination.innerHTML = `
        ${this.currentPage > 1 ? `<button onclick="productSearch.previousPage()">Previous</button>` : ""}
        <span>Page ${this.currentPage} of ${totalPages}</span>
        ${this.currentPage < totalPages ? `<button onclick="productSearch.nextPage()">Next</button>` : ""}
      `;
    }

    nextPage() {
      this.currentPage++;
      this.displayContent();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    previousPage() {
      this.currentPage--;
      this.displayContent();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (document.querySelector(".product-card")) {
    window.productSearch = new ProductSearch();
  }
});
;
