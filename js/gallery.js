// Lightbox gallery functionality
class Lightbox {
    constructor() {
        this.init();
    }

    init() {
        this.createLightboxHTML();
        this.bindEvents();
    }

    createLightboxHTML() {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <span class="lightbox-close">&times;</span>
                <div class="lightbox-content">
                    <img id="lightbox-img" src="" alt="" class="lightbox-img">
                    <div class="lightbox-caption"></div>
                </div>
                <a class="lightbox-prev">&#10094;</a>
                <a class="lightbox-next">&#10095;</a>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.lightboxCaption = document.querySelector('.lightbox-caption');
        this.images = [];
        this.currentIndex = 0;
    }

    bindEvents() {
        // Gallery image clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-image')) {
                this.openLightbox(e.target);
            }
        });

        // Lightbox controls
        document.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        document.querySelector('.lightbox-prev').addEventListener('click', () => this.navigate(-1));
        document.querySelector('.lightbox-next').addEventListener('click', () => this.navigate(1));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.style.display === 'block') {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.navigate(-1);
                if (e.key === 'ArrowRight') this.navigate(1);
            }
        });
    }

    openLightbox(imgElement) {
        this.images = Array.from(document.querySelectorAll('.gallery-image'));
        this.currentIndex = this.images.indexOf(imgElement);
        
        this.showImage();
        this.lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    navigate(direction) {
        this.currentIndex += direction;
        
        if (this.currentIndex >= this.images.length) {
            this.currentIndex = 0;
        } else if (this.currentIndex < 0) {
            this.currentIndex = this.images.length - 1;
        }
        
        this.showImage();
    }

    showImage() {
        const img = this.images[this.currentIndex];
        this.lightboxImg.src = img.src;
        this.lightboxCaption.textContent = img.alt || 'Product Image';
    }
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
});
