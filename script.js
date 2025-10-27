// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
});

// Form Submission Handler
document.addEventListener('DOMContentLoaded', function() {
    const presentationForm = document.getElementById('presentation-form');
    
    if (presentationForm) {
        presentationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(presentationForm);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Basic validation
            if (!data.title || !data.author || !data.category || !data.description || !data.content) {
                showNotification('Te rugăm să completezi toate câmpurile obligatorii!', 'error');
                return;
            }
            
            if (!data.terms) {
                showNotification('Te rugăm să accepți termenii și condițiile!', 'error');
                return;
            }
            
            // Salvează local în loc de a publica
            addLocalDraft(data);
            renderDraftPreview(data);
            showNotification('Prezentarea a fost salvată local ca draft. Nu a fost publicată.', 'success');
        });
    }
});

// Render locally published presentations early (before filters bind)
// Initialize published presentations and sync filter on prezentari.html
document.addEventListener('DOMContentLoaded', () => {
  const publishedContainer = document.getElementById('published-presentations');
  if (publishedContainer) {
    // render locally published items
    if (typeof renderPublishedOnPage === 'function') {
      renderPublishedOnPage(publishedContainer);
    }
    // sync filter to last published category if present
    const lastCat = localStorage.getItem('prezentariProLastPublishedCategory');
    const justPublished = localStorage.getItem('prezentariProJustPublished');
    if (lastCat) {
      const categoryFilterEl = document.getElementById('category-filter');
      if (categoryFilterEl) {
        categoryFilterEl.value = lastCat;
        try { categoryFilterEl.dispatchEvent(new Event('change')); } catch (e) {}
      }
      if (typeof showNotification === 'function' && justPublished) {
        showNotification('Prezentarea ta a fost publicată local. Filtrul a fost sincronizat.', 'success');
      }
      localStorage.removeItem('prezentariProLastPublishedCategory');
      localStorage.removeItem('prezentariProJustPublished');
    }
  }
});

// Search and Filter Functionality

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const presentationCards = document.querySelectorAll('.presentation-card');
    
    if (searchInput && categoryFilter && presentationCards.length > 0) {
        // Search functionality
        searchInput.addEventListener('input', function() {
            filterPresentations();
        });
        
        // Category filter functionality
        categoryFilter.addEventListener('change', function() {
            filterPresentations();
        });
        
        function filterPresentations() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedCategory = categoryFilter.value;
            
            presentationCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const category = card.getAttribute('data-category');
                
                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesCategory = selectedCategory === 'all' || !selectedCategory || category === selectedCategory;
                
                if (matchesSearch && matchesCategory) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease-in';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }
});

// Clear Filters Function
function clearFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const presentationCards = document.querySelectorAll('.presentation-card');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    
    presentationCards.forEach(card => {
        card.style.display = 'block';
    });
    
    showNotification('Filtrele au fost resetate!', 'info');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Style close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close functionality
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#4CAF50';
        case 'error': return '#f44336';
        case 'warning': return '#ff9800';
        case 'info': 
        default: return '#ff6b35';
    }
}

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Form Field Validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        const isValid = value !== '';
        
        if (isValid) {
            field.classList.remove('error');
            field.style.borderColor = '#4CAF50';
        } else {
            field.classList.add('error');
            field.style.borderColor = '#f44336';
        }
        
        return isValid;
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: #f44336 !important;
        box-shadow: 0 0 5px rgba(244, 67, 54, 0.3);
    }
    
    .presentation-card {
        transition: all 0.3s ease;
    }
    
    .notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        line-height: 1.4;
    }
`;

document.head.appendChild(style);

// Loading Animation for Links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's an external link or disabled
            if (href.startsWith('http') || this.style.cursor === 'not-allowed') {
                return;
            }
            
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Se încarcă...';
            this.style.opacity = '0.7';
            
            // Restore after a short delay (simulating page load)
            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 500);
        });
    });
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    // Create back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
    });
});

// Local draft tools (save, preview, export)
document.addEventListener('DOMContentLoaded', function() {
    const presentationForm = document.getElementById('presentation-form');
    const saveBtn = document.getElementById('save-draft-btn');
    const previewBtn = document.getElementById('preview-btn');
    const exportBtn = document.getElementById('export-json-btn');
    const previewContainer = document.getElementById('draft-preview');

    if (!presentationForm || !previewContainer) return;

    const getFormData = () => {
        const formData = new FormData(presentationForm);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    };

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const data = getFormData();
            if (!data.title || !data.author || !data.category || !data.description || !data.content) {
                showNotification('Completează câmpurile obligatorii înainte de a salva draftul!', 'error');
                return;
            }
            if (!data.terms) {
                showNotification('Te rugăm să accepți termenii și condițiile pentru a salva draftul!', 'error');
                return;
            }
            // Save locally instead of posting anywhere
            addLocalDraft(data);
            renderDraftPreview(data);
            showNotification('Prezentarea a fost salvată local ca draft. Nu a fost publicată.', 'success');
            // Do not reset the form so the user can keep editing
        });
    }
});

// Local draft tools (save, preview, export)
document.addEventListener('DOMContentLoaded', function() {
    const presentationForm = document.getElementById('presentation-form');
    const saveBtn = document.getElementById('save-draft-btn');
    const previewBtn = document.getElementById('preview-btn');
    const exportBtn = document.getElementById('export-json-btn');
    const previewContainer = document.getElementById('draft-preview');

    if (!presentationForm || !previewContainer) return;

    // Global form data extractor accessible across modules
    function getFormData() {
      const form = document.getElementById('presentation-form');
      if (!form) return {};
      const formData = new FormData(form);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      return data;
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const data = getFormData();
            if (!data.title || !data.author || !data.category || !data.description || !data.content) {
                showNotification('Completează câmpurile obligatorii înainte de a salva draftul!', 'error');
                return;
            }
            if (!data.terms) {
                showNotification('Te rugăm să accepți termenii și condițiile pentru a salva draftul!', 'error');
                return;
            }
            addLocalDraft(data);
            renderDraftPreview(data);
            showNotification('Draftul a fost salvat local. Nu a fost publicat.', 'success');
        });
    }

    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const data = getFormData();
            renderDraftPreview(data);
            showNotification('Previzualizare generată din formular.', 'info');
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const data = getFormData();
            if (!data.title) {
                showNotification('Adaugă un titlu pentru a exporta JSON.', 'error');
                return;
            }
            exportJSON(data);
            showNotification('Fișierul JSON a fost generat și descărcat.', 'success');
        });
    }

    // Render latest draft if one exists
    const latest = getLatestDraft();
    if (latest) {
        renderDraftPreview(latest);
    }
});

function addLocalDraft(data) {
    const drafts = JSON.parse(localStorage.getItem('prezentariProDrafts') || '[]');
    const draft = { ...data, savedAt: new Date().toISOString() };
    drafts.push(draft);
    localStorage.setItem('prezentariProDrafts', JSON.stringify(drafts));
}

function getLatestDraft() {
    const drafts = JSON.parse(localStorage.getItem('prezentariProDrafts') || '[]');
    if (!Array.isArray(drafts) || drafts.length === 0) return null;
    return drafts[drafts.length - 1];
}

function renderDraftPreview(data) {
    const container = document.getElementById('draft-preview');
    if (!container) return;
    container.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'presentation-card';
    const slidesCount = data['slides-count'] || '-';
    const category = data['category'] || 'fără categorie';
    card.innerHTML = `
        <div class="card-header"><span class="badge">Draft local</span></div>
        <h3>${escapeHtml(data.title || 'Titlu nespecificat')}</h3>
        <p>${escapeHtml(data.description || 'Fără descriere')}</p>
        <div class="card-meta">
            <span class="slides-count">Slide-uri: ${escapeHtml(String(slidesCount))}</span>
            <span class="category">${escapeHtml(category)}</span>
        </div>
        <p><strong>Autor:</strong> ${escapeHtml(data.author || '-')}${data.role ? ' — ' + escapeHtml(data.role) : ''}</p>
        <p><strong>Public:</strong> ${escapeHtml(data['target-audience'] || '-')}${data.duration ? ', <strong>Durata:</strong> ' + escapeHtml(String(data.duration)) + ' min' : ''}</p>
        ${data.keywords ? `<p><strong>Cuvinte cheie:</strong> ${escapeHtml(data.keywords)}</p>` : ''}
        <details style="margin-top: 1rem;">
            <summary style="cursor:pointer; color:#ff6b35;">Conținut (click pentru a deschide)</summary>
            <pre style="white-space:pre-wrap; background:#fff3e0; padding:1rem; border-radius:8px;">${escapeHtml(data.content || '')}</pre>
        </details>
    `;
    container.appendChild(card);
}

function exportJSON(data) {
    const name = 'prezentare-' + slugify(data.title || 'draft') + '.json';
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function slugify(str) {
    return String(str)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Publish button handler
const publishBtn = document.getElementById('publish-btn');
if (publishBtn) {
  publishBtn.addEventListener('click', function() {
    const data = getFormData();
    if (!data.title || !data.author || !data.category || !data.terms) {
      showNotification('Completează câmpurile obligatorii și acceptă termenii.', 'error');
      return;
    }
    addPublished(data);
    // mark last published to sync filter on prezentari.html
    try {
      localStorage.setItem('prezentariProLastPublishedCategory', data.category);
      localStorage.setItem('prezentariProJustPublished', '1');
    } catch (e) {}
    renderDraftPreview();
    showNotification('Prezentarea a fost publicată local în Prezentări. Deschide pagina Prezentări pentru a o vedea.', 'success');
  });
}

function addPublished(data) {
  try {
    const list = JSON.parse(localStorage.getItem('prezentariProPublished') || '[]');
    const item = { ...data, id: 'pub_' + Date.now() };
    list.unshift(item);
    localStorage.setItem('prezentariProPublished', JSON.stringify(list));
  } catch (e) {
    console.error('Failed to publish locally', e);
    showNotification('Eroare la publicarea locală. Încearcă din nou.', 'error');
  }
}

function getPublishedList() {
  try {
    return JSON.parse(localStorage.getItem('prezentariProPublished') || '[]');
  } catch (e) {
    return [];
  }
}

function renderPublishedOnPage(container) {
  const list = getPublishedList();
  container.innerHTML = '';
  if (!list || !list.length) {
    const msg = document.createElement('p');
    msg.textContent = 'Nu există prezentări publicate local încă.';
    msg.style.opacity = '0.8';
    container.appendChild(msg);
    return;
  }
  list.forEach(item => {
    const card = document.createElement('article');
    card.className = 'presentation-card';
    card.setAttribute('data-category', (item.category || 'general').toLowerCase());
    card.innerHTML = `
      <div class="card-header">
        <span class="category">${item.category || 'General'}</span>
      </div>
      <h3>${item.title || 'Prezentare fără titlu'}</h3>
      <p>${item.description || ''}</p>
      <div class="card-footer">
        <span class="author">${item.author || ''}</span>
        <button class="btn btn-secondary" onclick="window.location.href='trae-ai-prezentare.html'">Vezi</button>
      </div>
    `;
    container.appendChild(card);
  });
}