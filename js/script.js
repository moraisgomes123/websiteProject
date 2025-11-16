// Main JavaScript functionality for TechMobiles
document.addEventListener("DOMContentLoaded", () => {
    // 1. Product Sorting and Filtering on products.html
    const priceSort = document.getElementById("price");
    const typeFilter = document.getElementById("type");
    const productGrid = document.querySelector(".product-grid");

    if (priceSort && typeFilter && productGrid) {
        const originalProducts = Array.from(productGrid.children);

        priceSort.addEventListener("change", applyFilters);
        typeFilter.addEventListener("change", applyFilters);

        function applyFilters() {
            let products = [...originalProducts];

            // Filter by type
            const type = typeFilter.value;
            if (type !== "all") {
                products = products.filter(card =>
                    card.querySelector("h3").textContent.toLowerCase().includes(type.toLowerCase())
                );
            }

            // Sort by price
            const priceOrder = priceSort.value;
            products.sort((a, b) => {
                const aPrice = extractPrice(a.querySelector(".price")?.textContent || "0");
                const bPrice = extractPrice(b.querySelector(".price")?.textContent || "0");
                return priceOrder === "low-high" ? aPrice - bPrice : bPrice - aPrice;
            });

            // Clear and re-render
            productGrid.innerHTML = "";
            products.forEach(p => productGrid.appendChild(p));
        }

        function extractPrice(priceText) {
            const priceMatch = priceText.match(/R?(\d+(?:\.\d+)?)/);
            return priceMatch ? parseFloat(priceMatch[1]) : 0;
        }
    }

    // 2. Add enhanced alert on 'Buy Now' buttons with modal
    const buyButtons = document.querySelectorAll(".buy-btn");
    buyButtons.forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            const productPrice = this.closest('.product-card').querySelector('.price').textContent;
            
            // Create modal for cart confirmation
            const modalHTML = `
                <div id="cartModal" class="modal">
                    <div class="modal-content">
                        <span class="modal-close">&times;</span>
                        <h3>🛒 Added to Cart</h3>
                        <p><strong>${productName}</strong> has been added to your cart.</p>
                        <p>Price: ${productPrice}</p>
                        <div style="margin-top: 20px; display: flex; gap: 10px;">
                            <button onclick="continueShopping()" class="buy-btn">Continue Shopping</button>
                            <button onclick="viewCart()" class="shop-button">View Cart</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.getElementById('cartModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // 3. Highlight current nav link
    const navLinks = document.querySelectorAll("nav a");
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.style.fontWeight = 'bold';
            link.style.color = 'var(--color-accent-gold)';
        }
    });

    // 4. Add search functionality to products page
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !document.querySelector('.search-input')) {
        const searchHTML = `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Search products...">
            </div>
        `;
        const productArea = document.querySelector('.product-area');
        if (productArea) {
            productArea.insertAdjacentHTML('afterbegin', searchHTML);
        }
    }

    // 5. Add FAQ accordion to about page
    if (document.querySelector('.about-page')) {
        const faqHTML = `
            <section class="faq-section">
                <h2>Frequently Asked Questions</h2>
                <div class="accordion">
                    <div class="accordion-item">
                        <div class="accordion-header">What is your return policy?</div>
                        <div class="accordion-content">
                            <p>We offer a 30-day return policy for all unused products in original packaging. Returns are free for defective items.</p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <div class="accordion-header">Do you offer international shipping?</div>
                        <div class="accordion-content">
                            <p>Currently, we only ship within South Africa. We're working on expanding our shipping options in the future.</p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <div class="accordion-header">How long does delivery take?</div>
                        <div class="accordion-content">
                            <p>Standard delivery takes 3-5 business days within major cities, and 5-7 days for other areas.</p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <div class="accordion-header">Are your products covered by warranty?</div>
                        <div class="accordion-content">
                            <p>Yes, all our products come with a 1-year manufacturer's warranty. Accessories have a 6-month warranty.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
        document.querySelector('main').insertAdjacentHTML('beforeend', faqHTML);
    }

    // 6. Add image gallery to product pages
    if (document.querySelector('.shop-page')) {
        const productImages = document.querySelectorAll('.product-card img');
        productImages.forEach(img => {
            img.classList.add('gallery-image');
            img.style.cursor = 'pointer';
        });
    }

    // 7. Add pagination to product grids
    const productGrids = document.querySelectorAll('.product-grid');
    productGrids.forEach(grid => {
        if (grid.children.length > 6) {
            const paginationHTML = `
                <div id="pagination" class="pagination">
                    <button onclick="productSearch.previousPage()">Previous</button>
                    <span>Page 1 of 2</span>
                    <button onclick="productSearch.nextPage()">Next</button>
                </div>
            `;
            grid.insertAdjacentHTML('afterend', paginationHTML);
        }
    });
});

// Global functions for modal actions
function continueShopping() {
    document.getElementById('cartModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function viewCart() {
    alert('Cart functionality coming soon!');
    document.getElementById('cartModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}