// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const mobileOverlay = document.querySelector('.nav-mobile-overlay');

if (hamburger && mobileOverlay) {
    const menuLinks = mobileOverlay.querySelectorAll('a');

    const openMenu = () => {
        hamburger.classList.add('is-open');
        mobileOverlay.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        hamburger.classList.remove('is-open');
        mobileOverlay.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
        if (hamburger.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mobileOverlay.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-mobile-menu')) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && hamburger.classList.contains('is-open')) {
            closeMenu();
        }
    });

    menuLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
}

// Photo preview
const previewRoot = document.querySelector('.profile-preview');
const previewBackdrop = document.querySelector('.profile-preview-backdrop');
const previewImage = document.querySelector('.profile-preview-image');
const previewDialog = document.querySelector('.profile-preview-dialog');
const avatarButtons = document.querySelectorAll('.logo-avatar-button');
const galleryPreviewImages = document.querySelectorAll('.gallery-tab-image');
const categoryPreviewImages = document.querySelectorAll('.category-gallery-image');

if (previewRoot && previewBackdrop && previewImage && previewDialog && (avatarButtons.length > 0 || galleryPreviewImages.length > 0 || categoryPreviewImages.length > 0)) {
    const previewPrevButton = document.createElement('button');
    const previewNextButton = document.createElement('button');
    let currentPreviewItems = [];
    let currentPreviewIndex = -1;

    previewPrevButton.type = 'button';
    previewPrevButton.className = 'preview-nav-button preview-nav-prev';
    previewPrevButton.setAttribute('aria-label', 'Predchozi fotografie');
    previewPrevButton.innerHTML = '&#8249;';

    previewNextButton.type = 'button';
    previewNextButton.className = 'preview-nav-button preview-nav-next';
    previewNextButton.setAttribute('aria-label', 'Dalsi fotografie');
    previewNextButton.innerHTML = '&#8250;';

    previewDialog.append(previewPrevButton, previewNextButton);

    const updatePreviewShape = (shape) => {
        previewImage.classList.toggle('is-circle', shape === 'circle');
        previewImage.classList.toggle('is-portrait', shape === 'portrait');
        previewImage.classList.toggle('is-landscape', shape === 'landscape');
    };

    const updatePreviewNavigation = () => {
        const hasGalleryNavigation = currentPreviewItems.length > 1 && currentPreviewIndex >= 0;
        previewRoot.classList.toggle('has-preview-navigation', hasGalleryNavigation);
        previewPrevButton.disabled = !hasGalleryNavigation || currentPreviewIndex === 0;
        previewNextButton.disabled = !hasGalleryNavigation || currentPreviewIndex === currentPreviewItems.length - 1;
    };

    const renderPreviewItem = (index) => {
        const item = currentPreviewItems[index];

        if (!item) {
            return;
        }

        currentPreviewIndex = index;
        previewImage.src = item.getAttribute('src') || '';
        previewImage.alt = item.getAttribute('alt') || 'Zvesteny nahled fotografie';
        updatePreviewShape(item.dataset.previewShape || 'portrait');
        updatePreviewNavigation();
    };

    const closePreview = () => {
        previewRoot.classList.remove('is-open');
        previewRoot.setAttribute('aria-hidden', 'true');
        currentPreviewItems = [];
        currentPreviewIndex = -1;
        updatePreviewNavigation();
        document.body.style.overflow = '';
    };

    const openPreview = (src, alt, shape = 'circle') => {
        previewImage.src = src;
        previewImage.alt = alt;
        updatePreviewShape(shape);
        updatePreviewNavigation();
        previewRoot.classList.add('is-open');
        previewRoot.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const openSinglePreview = (src, alt, shape = 'circle') => {
        currentPreviewItems = [];
        currentPreviewIndex = -1;
        openPreview(src, alt, shape);
    };

    const openGalleryPreview = (items, activeItem) => {
        currentPreviewItems = Array.from(items);
        currentPreviewIndex = currentPreviewItems.indexOf(activeItem);
        openPreview(
            activeItem.getAttribute('src') || '',
            activeItem.getAttribute('alt') || 'Zvesteny nahled fotografie',
            activeItem.dataset.previewShape || 'portrait'
        );
        renderPreviewItem(currentPreviewIndex);
    };

    avatarButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const image = button.querySelector('img');

            if (!image) {
                return;
            }

            openSinglePreview(
                image.getAttribute('src') || '',
                image.getAttribute('alt') || 'Zvetsena profilova fotka',
                button.dataset.previewShape || 'circle'
            );
        });
    });

    categoryPreviewImages.forEach((image) => {
        image.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openGalleryPreview(categoryPreviewImages, image);
        });
    });

    previewPrevButton.addEventListener('click', (event) => {
        event.stopPropagation();

        if (currentPreviewIndex > 0) {
            renderPreviewItem(currentPreviewIndex - 1);
        }
    });

    previewNextButton.addEventListener('click', (event) => {
        event.stopPropagation();

        if (currentPreviewIndex < currentPreviewItems.length - 1) {
            renderPreviewItem(currentPreviewIndex + 1);
        }
    });

    previewBackdrop.addEventListener('click', closePreview);
    previewImage.addEventListener('click', closePreview);

    document.addEventListener('keydown', (event) => {
        if (!previewRoot.classList.contains('is-open')) {
            return;
        }

        if (event.key === 'Escape') {
            closePreview();
        }

        if (event.key === 'ArrowLeft' && currentPreviewIndex > 0) {
            renderPreviewItem(currentPreviewIndex - 1);
        }

        if (event.key === 'ArrowRight' && currentPreviewIndex < currentPreviewItems.length - 1) {
            renderPreviewItem(currentPreviewIndex + 1);
        }
    });
}
