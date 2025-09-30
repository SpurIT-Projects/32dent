// =====================================
// 32Дент - Основной JavaScript
// =====================================

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initNavigation();
    initScrollToTop();
    initModals();
    initForms();
    initSmoothScroll();
    initAnimations();
    
    console.log('32Дент - сайт загружен успешно! 🦷');
});

// =====================================
// Навигация
// =====================================

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    // Мобильное меню
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Скролл хедера
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Скролл вниз - скрываем хедер
            header.style.transform = 'translateY(-100%)';
        } else {
            // Скролл вверх - показываем хедер
            header.style.transform = 'translateY(0)';
        }
        
        // Добавляем тень при скролле
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Активная ссылка в навигации
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// =====================================
// Кнопка "Наверх"
// =====================================

function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// =====================================
// Модальные окна
// =====================================

function initModals() {
    // Закрытие модального окна при клике на фон
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Закрытие модального окна по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Фокус на первом поле формы
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Сброс формы при закрытии
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Глобальные функции для использования в HTML
window.openModal = openModal;
window.closeModal = closeModal;

// =====================================
// Формы
// =====================================

function initForms() {
    const forms = document.querySelectorAll('.contact-form, .appointment-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Валидация полей в реальном времени
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
        
        // Форматирование телефона
        const phoneInputs = form.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', formatPhoneNumber);
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Валидация формы
    if (!validateForm(form)) {
        return;
    }
    
    // Показываем индикатор загрузки
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
    
    // Симуляция отправки (в реальном проекте здесь был бы AJAX запрос)
    setTimeout(() => {
        showNotification('Заявка отправлена успешно! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
        
        // Закрываем модальное окно если форма в модальном окне
        const modal = form.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
        
        // Восстанавливаем кнопку
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Логируем данные для демонстрации
        console.log('Данные формы:', data);
    }, 2000);
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Проверка обязательных полей
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Это поле обязательно для заполнения';
        isValid = false;
    }
    
    // Проверка телефона
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Введите корректный номер телефона';
            isValid = false;
        }
    }
    
    // Проверка email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Введите корректный email адрес';
            isValid = false;
        }
    }
    
    // Отображение ошибки
    showFieldError(field, errorMessage);
    
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    showFieldError(field, '');
}

function showFieldError(field, message) {
    // Удаляем предыдущую ошибку
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Добавляем новую ошибку
    if (message) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    } else {
        field.classList.remove('error');
    }
}

function formatPhoneNumber(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    // Автоматически добавляем +375 для белорусских номеров
    if (value.length > 0 && !value.startsWith('375')) {
        if (value.startsWith('80')) {
            value = '375' + value.substring(2);
        } else if (value.length === 9) {
            value = '375' + value;
        }
    }
    
    // Форматируем номер
    if (value.startsWith('375') && value.length >= 3) {
        let formatted = '+375';
        if (value.length > 3) {
            formatted += ' (' + value.substring(3, 5);
            if (value.length > 5) {
                formatted += ') ' + value.substring(5, 8);
                if (value.length > 8) {
                    formatted += '-' + value.substring(8, 10);
                    if (value.length > 10) {
                        formatted += '-' + value.substring(10, 12);
                    }
                }
            }
        }
        input.value = formatted;
    }
}

// =====================================
// Плавная прокрутка
// =====================================

function initSmoothScroll() {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================================
// Анимации
// =====================================

function initAnimations() {
    // Наблюдатель для анимаций при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Анимация счетчиков
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    const animateElements = document.querySelectorAll('.service-card, .doctor-card, .feature-item, .stat-item, .contact-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000; // 2 секунды
    const step = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// =====================================
// Уведомления
// =====================================

function showNotification(message, type = 'info') {
    // Создаем контейнер для уведомлений если его нет
    let container = document.querySelector('.notifications-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, 5000);
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Глобальная функция для уведомлений
window.showNotification = showNotification;
window.closeNotification = closeNotification;

// =====================================
// Утилитарные функции
// =====================================

// Дебаунс функция для оптимизации событий скролла и ресайза
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Проверка поддержки веб-технологий
function checkSupport() {
    const support = {
        localStorage: 'localStorage' in window,
        intersectionObserver: 'IntersectionObserver' in window,
        smoothScroll: 'scrollBehavior' in document.documentElement.style
    };
    
    if (!support.smoothScroll) {
        // Полифилл для плавной прокрутки
        console.warn('Smooth scroll не поддерживается, используется полифилл');
    }
    
    return support;
}

// Инициализация проверки поддержки
checkSupport();

// =====================================
// Дополнительные стили для анимаций
// =====================================

// Добавляем стили для анимаций через JavaScript
const animationStyles = `
    .service-card,
    .doctor-card,
    .feature-item,
    .stat-item,
    .contact-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .service-card.animate-in,
    .doctor-card.animate-in,
    .feature-item.animate-in,
    .stat-item.animate-in,
    .contact-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notifications-container {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 3000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .notification {
        background: var(--background-white);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        padding: 16px;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-success {
        border-left: 4px solid var(--secondary-color);
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-warning {
        border-left: 4px solid var(--accent-color);
    }
    
    .notification-info {
        border-left: 4px solid var(--primary-color);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 18px;
    }
    
    .notification-success .notification-content i {
        color: var(--secondary-color);
    }
    
    .notification-error .notification-content i {
        color: #ef4444;
    }
    
    .notification-warning .notification-content i {
        color: var(--accent-color);
    }
    
    .notification-info .notification-content i {
        color: var(--primary-color);
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: var(--transition);
    }
    
    .notification-close:hover {
        background: var(--background-gray);
    }
    
    .field-error {
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 4px;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
    }
    
    .header.scrolled {
        box-shadow: var(--shadow-lg);
    }
    
    body.menu-open {
        overflow: hidden;
    }
    
    @media (max-width: 768px) {
        .notifications-container {
            left: 20px;
            right: 20px;
            top: 80px;
        }
        
        .notification {
            max-width: none;
        }
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);