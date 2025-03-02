// Обработка модальных окон
document.addEventListener('DOMContentLoaded', function() {
    const consultButtons = document.querySelectorAll('.consult-btn');
    const modals = document.querySelectorAll('.modal');
    
    consultButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('#consultation-modal').classList.add('active');
        });
    });

    // Закрытие модальных окон
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close') || 
            e.target.classList.contains('modal-overlay')) {
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
});

// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

// Остальной JavaScript код 

// Обработка формы консультации
document.getElementById('consultation-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/consultation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
            document.querySelector('#consultation-modal').classList.remove('active');
            e.target.reset();
        } else {
            throw new Error('Ошибка отправки формы');
        }
    } catch (error) {
        alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
});

// Маска для телефона
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '')
            .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
});

// Обработка формы контактов
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Спасибо за сообщение! Мы свяжемся с вами в ближайшее время.');
            e.target.reset();
        } else {
            throw new Error('Ошибка отправки формы');
        }
    } catch (error) {
        alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
});

// Анимация появления карточек решений
const solutionCards = document.querySelectorAll('.solution-card');
const observerSolutions = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

solutionCards.forEach(card => observerSolutions.observe(card));

// Функция анимации счетчика
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const end = parseInt(target);
    const startTimestamp = performance.now();
    
    const updateCounter = (currentTimestamp) => {
        const progress = Math.min((currentTimestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        
        if (currentValue >= 500000) {
            // Форматируем большие числа с пробелами
            element.textContent = currentValue.toLocaleString('ru-RU');
            if (currentValue >= 500000000) {
                element.textContent += ' ₽';
            }
        } else {
            // Добавляем "+" для определенных значений
            element.textContent = currentValue + (target === '50' || target === '47' ? '+' : '');
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    };
    
    requestAnimationFrame(updateCounter);
}

// Запуск анимации счетчиков при появлении элемента в viewport
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                animateCounter(counter, counter.getAttribute('data-value'));
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-grid').forEach(grid => {
    counterObserver.observe(grid);
});

// Добавляем функцию для анимации карточек этапов
function handleStageCardsScale() {
    const cards = document.querySelectorAll('.stage-card');
    const windowHeight = window.innerHeight;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const centerPosition = windowHeight / 2;
        const cardCenter = rect.top + (rect.height / 2);
        const distance = Math.abs(centerPosition - cardCenter);
        const maxDistance = windowHeight / 2;
        
        // Вычисляем масштаб на основе расстояния от центра
        let scale = 1;
        if (distance < maxDistance) {
            // Максимальный масштаб 1.05 в центре, уменьшается к краям
            scale = 1 + (0.05 * (1 - distance / maxDistance));
        }
        
        card.style.transform = `scale(${scale})`;
    });
}

// Добавляем обработчик скролла только для десктопов
if (window.innerWidth > 768) {
    window.addEventListener('scroll', handleStageCardsScale);
    // Вызываем один раз при загрузке
    handleStageCardsScale();
}

// Обновляем при изменении размера окна
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', handleStageCardsScale);
        handleStageCardsScale();
    } else {
        window.removeEventListener('scroll', handleStageCardsScale);
        // Сбрасываем масштаб на мобильных
        document.querySelectorAll('.stage-card').forEach(card => {
            card.style.transform = 'none';
        });
    }
});

// Мобильное меню
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav a');

// Открытие меню
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.classList.add('menu-open');
});

// Закрытие меню
menuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
});

// Закрытие меню при клике на ссылку
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Функция для анимации появления элементов при скролле
function initScrollAnimation() {
    const sections = document.querySelectorAll('section');
    const options = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс visible для секции
                entry.target.classList.add('visible');
                
                // Находим все элементы с анимацией внутри секции
                const animatedElements = entry.target.querySelectorAll('.fade-up');
                animatedElements.forEach(element => {
                    element.classList.add('visible');
                });
                
                // Отключаем наблюдение после появления
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Добавляем классы и наблюдение за секциями
    sections.forEach(section => {
        // Добавляем класс fade-up для секции
        section.classList.add('fade-up');
        
        // Добавляем классы для основных элементов внутри секции
        const header = section.querySelector('.section-header');
        const content = section.querySelector('h2');
        const description = section.querySelector('p');
        
        if (header) header.classList.add('fade-up', 'fade-up-delay-1');
        if (content) content.classList.add('fade-up', 'fade-up-delay-2');
        if (description) description.classList.add('fade-up', 'fade-up-delay-3');
        
        // Начинаем наблюдение
        observer.observe(section);
    });
}

// Запускаем анимацию после загрузки страницы
document.addEventListener('DOMContentLoaded', initScrollAnimation); 