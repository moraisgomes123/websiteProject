// Search and filter functionality
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
    }

    loadProducts() {
        // Get all product cards from the page
        const productCards = document.querySelectorAll('.product-card');
        this.allItems = Array.from(productCards).map(card => ({
            element: card,
            title: card.querySelector('h3')?.textContent.toLowerCase() || '',
            description: card.querySelector('p')?.textContent.toLowerCase() || '',
            price: this.extractPrice(card.querySelector('.price')?.textContent || ''),
            category: this.determineCategory(card)
        }));
        
        this.filteredItems = [...this.allItems];
    }

    extractPrice(priceText) {
        const priceMatch = priceText.match(/R?(\d+)/);
        return priceMatch ? parseInt(priceMatch[1]) : 0;
    }

    determineCategory(card) {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        if (title.includes('phone') || title.includes('iphone') || title.includes('samsung')) return 'smartphone';
        if (title.includes('case')) return 'case';
        if (title.includes('charger') || title.includes('cable')) return 'charger';
        if (title.includes('earbud') || title.includes('headphone')) return 'earbuds';
        if (title.includes('protector')) return 'protector';
        if (title.includes('band') || title.includes('watch')) return 'watch';
        return 'other';
    }

    bindEvents() {
        const searchInput = document.querySelector('.search-input');
        const priceSort = document.getElementById('price');
        const typeFilter = document.getElementById('type');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchContent(e.target.value);
            });
        }

        if (priceSort) {
            priceSort.addEventListener('change', () => {
                this.sortProducts(priceSort.value);
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.filterByType(typeFilter.value);
            });
        }
    }

    searchContent(searchTerm) {
        if (!searchTerm) {
            this.filteredItems = [...this.allItems];
        } else {
            this.filteredItems = this.allItems.filter(item =>
                item.title.includes(searchTerm.toLowerCase()) ||
                item.description.includes(searchTerm.toLowerCase())
            );
        }
        this.currentPage = 1;
        this.displayContent();
    }

    sortProducts(sortType) {
        switch(sortType) {
            case 'low-high':
                this.filteredItems.sort((a, b) => a.price - b.price);
                break;
            case 'high-low':
                this.filteredItems.sort((a, b) => b.price - a.price);
                break;
        }
        this.displayContent();
    }

    filterByType(type) {
        if (type === 'all') {
            this.filteredItems = [...this.allItems];
        } else {
            this.filteredItems = this.allItems.filter(item => 
                item.category === type
            );
        }
        this.currentPage = 1;
        this.displayContent();
    }

    displayContent() {
        const container = document.querySelector('.product-grid');
        if (!container) return;

        // Hide all items first
        this.allItems.forEach(item => {
            item.element.style.display = 'none';
        });

        // Show filtered items
        this.filteredItems.forEach(item => {
            item.element.style.display = 'block';
        });

        this.updatePagination();
    }

    updatePagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'block';
        let paginationHTML = '';
        
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="productSearch.previousPage()">Previous</button>`;
        }
        
        paginationHTML += `<span>Page ${this.currentPage} of ${totalPages}</span>`;
        
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="productSearch.nextPage()">Next</button>`;
        }
        
        pagination.innerHTML = paginationHTML;
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.displayContent();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayContent();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Initialize global search instance
const productSearch = new ProductSearch();
