// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const preloader = document.getElementById('preloader');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navToggle = document.querySelector('.nav-toggle');
    const sections = document.querySelectorAll('section');
    const skillBars = document.querySelectorAll('.skill-progress');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    const detailsClose = document.querySelectorAll('.details-close');
    const contactForm = document.getElementById('contactForm');
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-up, .reveal-left, .reveal-right');
    
    // Efecto de paralaje para el hero section
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    // Simulación de carga de recursos
    let progress = 0;
    const loadingProgress = document.querySelector('.loading-progress');
    
    const interval = setInterval(() => {
        progress += 1;
        if (loadingProgress) {
            loadingProgress.style.width = `${progress}%`;
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            // Ocultar preloader cuando la carga esté completa
            setTimeout(() => {
                if (preloader) {
                    preloader.classList.add('hidden');
                    document.body.classList.remove('loading');
                    
                    // Iniciar animaciones después de que se oculte el preloader
                    setTimeout(() => {
                        document.body.classList.add('loaded');
                        revealElements.forEach(element => {
                            element.classList.add('active');
                        });
                    }, 500);
                }
            }, 500);
        }
    }, 30); // 50ms * 100 = ~5 segundos para completar
    
    // Cambiar estilo del navbar al hacer scroll
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Activar sección actual en el menú
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
        
        // Efecto de paralaje
        if (parallaxElements.length > 0) {
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(window.scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        // Revelar elementos cuando son visibles
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
        
        // Animar barras de progreso cuando son visibles
        skillBars.forEach(bar => {
            const barTop = bar.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (barTop < windowHeight - 100) {
                const progress = bar.dataset.progress;
                bar.style.width = progress + '%';
            }
        });
    });
    
    // Navegación móvil
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) navLinks.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });
    
    // Filtros de portafolio
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Abrir detalles del portafolio
    // Función para manejar la apertura del modal de detalles del portafolio
    function setupPortfolioDetails() {
        const portfolioLinks = document.querySelectorAll('.portfolio-link');
        const portfolioDetails = document.querySelectorAll('.portfolio-details');
        const closeButtons = document.querySelectorAll('.details-close');
        
        // Asegurarse de que el modal se abra correctamente
        portfolioLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Obtener el ID del modal a abrir
                const targetId = this.getAttribute('data-target');
                const targetModal = document.getElementById(targetId);
                
                if (targetModal) {
                    // Añadir la clase active al modal para mostrarlo
                    targetModal.classList.add('active');
                    
                    // Prevenir el scroll del body
                    document.body.style.overflow = 'hidden';
                    
                    // Asegurarse de que el modal se muestre como elemento independiente
                    document.body.appendChild(targetModal);
                }
            });
        });
        
        // Cerrar el modal cuando se hace clic en el botón de cierre
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Encontrar el modal padre
                const modal = this.closest('.portfolio-details');
                
                if (modal) {
                    // Quitar la clase active para ocultar el modal
                    modal.classList.remove('active');
                    
                    // Restaurar el scroll del body
                    document.body.style.overflow = '';
                    
                    // Devolver el modal a su posición original si es necesario
                    const originalParent = document.querySelector(`.portfolio-section`);
                    if (originalParent && !originalParent.contains(modal)) {
                        originalParent.appendChild(modal);
                    }
                }
            });
        });
        
        // Cerrar el modal cuando se hace clic fuera del contenido
        portfolioDetails.forEach(modal => {
            modal.addEventListener('click', function(e) {
                // Si el clic fue directamente en el fondo (no en el contenido)
                if (e.target === this) {
                    // Quitar la clase active para ocultar el modal
                    this.classList.remove('active');
                    
                    // Restaurar el scroll del body
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    // Asegurarse de que esta función se ejecute cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        // Cerrar detalles del portafolio
        detailsClose.forEach(close => {
            close.addEventListener('click', function() {
                const portfolioDetails = this.closest('.portfolio-details');
                portfolioDetails.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Formulario de contacto
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validación básica del formulario
                const name = document.getElementById('name');
                const email = document.getElementById('email');
                const message = document.getElementById('message');
                let isValid = true;
                
                if (!name.value.trim()) {
                    showError(name, 'Por favor, introduce tu nombre');
                    isValid = false;
                } else {
                    removeError(name);
                }
                
                if (!email.value.trim()) {
                    showError(email, 'Por favor, introduce tu email');
                    isValid = false;
                } else if (!isValidEmail(email.value)) {
                    showError(email, 'Por favor, introduce un email válido');
                    isValid = false;
                } else {
                    removeError(email);
                }
                
                if (!message.value.trim()) {
                    showError(message, 'Por favor, introduce tu mensaje');
                    isValid = false;
                } else {
                    removeError(message);
                }
                
                if (isValid) {
                    // Aquí iría la lógica para enviar el formulario
                    // Por ahora, simulamos un envío exitoso
                    
                    // Mostrar animación de carga
                    const submitBtn = contactForm.querySelector('.submit-btn');
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        const formSuccess = document.querySelector('.form-success');
                        contactForm.style.display = 'none';
                        if (formSuccess) {
                            formSuccess.classList.add('active');
                        }
                        
                        // Resetear el formulario después de un tiempo
                        setTimeout(() => {
                            contactForm.reset();
                            submitBtn.innerHTML = 'Enviar Mensaje';
                            submitBtn.disabled = false;
                            contactForm.style.display = 'block';
                            if (formSuccess) {
                                formSuccess.classList.remove('active');
                            }
                        }, 5000);
                    }, 2000);
                }
            });
        }
        
        // Funciones auxiliares para validación de formulario
        function showError(input, message) {
            const formGroup = input.closest('.form-group-modern');
            const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
            
            if (!formGroup.querySelector('.error-message')) {
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            input.classList.add('error');
        }
        
        function removeError(input) {
            const formGroup = input.closest('.form-group-modern');
            const errorElement = formGroup.querySelector('.error-message');
            
            if (errorElement) {
                errorElement.remove();
            }
            
            input.classList.remove('error');
        }
        
        function isValidEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        // Protección contra copia de código
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        document.addEventListener('keydown', function(e) {
            // Prevenir inspeccionar elemento (F12)
            if (e.keyCode == 123) {
                e.preventDefault();
                return false;
            }
            
            // Prevenir Ctrl+Shift+I (inspeccionar elemento)
            if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
                e.preventDefault();
                return false;
            }
            
            // Prevenir Ctrl+Shift+J (consola de JavaScript)
            if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
                e.preventDefault();
                return false;
            }
            
            // Prevenir Ctrl+U (ver código fuente)
            if (e.ctrlKey && e.keyCode == 85) {
                e.preventDefault();
                return false;
            }
        });
    });
});

// Efecto de desplazamiento suave para los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animación de texto con efecto de escritura
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }
    
    type() {
        // Índice actual de la palabra
        const current = this.wordIndex % this.words.length;
        // Texto completo de la palabra actual
        const fullTxt = this.words[current];
        
        // Verificar si está eliminando
        if(this.isDeleting) {
            // Eliminar un carácter
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Añadir un carácter
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        // Insertar txt en el elemento
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
        
        // Velocidad inicial de escritura
        let typeSpeed = 200;
        
        if(this.isDeleting) {
            typeSpeed /= 2;
        }
        
        // Si la palabra está completa
        if(!this.isDeleting && this.txt === fullTxt) {
            // Hacer una pausa al final
            typeSpeed = this.wait;
            // Establecer eliminar a verdadero
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Mover al siguiente índice de palabra
            this.wordIndex++;
            // Pausa antes de empezar a escribir
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Iniciar efecto de escritura cuando la página esté cargada
document.addEventListener('DOMContentLoaded', function() {
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        // Iniciar TypeWriter
        new TypeWriter(txtElement, words, wait);
    }
});

// Animación de contador para estadísticas
function animateCounter() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const speed = +counter.getAttribute('data-speed') || 200;
        
        const updateCount = () => {
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCount();
    });
}

// Observador de intersección para activar animaciones cuando los elementos son visibles
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Si es un contador, iniciar la animación
            if (entry.target.classList.contains('stats-section')) {
                animateCounter();
            }
            
            // Si es un elemento con animación, añadir clase active
            if (entry.target.classList.contains('animate-on-scroll')) {
                entry.target.classList.add('active');
            }
            
            // Dejar de observar después de activar
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Observar sección de estadísticas
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Observar elementos con animación al scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Inicializar lightbox para imágenes de galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        initLightbox(galleryItems);
    }
});

// Lightbox para galería de imágenes
function initLightbox(items) {
    // Crear elementos del lightbox
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightbox-img';
    
    const lightboxClose = document.createElement('span');
    lightboxClose.className = 'lightbox-close';
    lightboxClose.innerHTML = '&times;';
    
    const lightboxCaption = document.createElement('div');
    lightboxCaption.className = 'lightbox-caption';
    
    const lightboxPrev = document.createElement('a');
    lightboxPrev.className = 'lightbox-prev';
    lightboxPrev.innerHTML = '&#10094;';
    
    const lightboxNext = document.createElement('a');
    lightboxNext.className = 'lightbox-next';
    lightboxNext.innerHTML = '&#10095;';
    
    // Añadir elementos al DOM
    lightboxContent.appendChild(lightboxImg);
    lightboxContent.appendChild(lightboxCaption);
    lightboxContent.appendChild(lightboxClose);
    lightboxContent.appendChild(lightboxPrev);
    lightboxContent.appendChild(lightboxNext);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    
    let currentIndex = 0;
    
    // Función para abrir el lightbox
    function openLightbox(index) {
        currentIndex = index;
        const item = items[currentIndex];
        const imgSrc = item.querySelector('img').getAttribute('src');
        const caption = item.getAttribute('data-caption') || '';
        
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightbox.style.display = 'flex';
        
        // Añadir clase para animación de entrada
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);
        
        // Deshabilitar scroll del body
        document.body.style.overflow = 'hidden';
    }
    
    // Función para cerrar el lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            // Habilitar scroll del body
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    // Función para navegar a la imagen anterior
    function prevImage() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        const item = items[currentIndex];
        const imgSrc = item.querySelector('img').getAttribute('src');
        const caption = item.getAttribute('data-caption') || '';
        
        // Añadir clase para animación de transición
        lightboxImg.classList.add('slide-out');
        
        setTimeout(() => {
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = caption;
            lightboxImg.classList.remove('slide-out');
        }, 200);
    }
    
    // Función para navegar a la imagen siguiente
    function nextImage() {
        currentIndex = (currentIndex + 1) % items.length;
        const item = items[currentIndex];
        const imgSrc = item.querySelector('img').getAttribute('src');
        const caption = item.getAttribute('data-caption') || '';
        
        // Añadir clase para animación de transición
        lightboxImg.classList.add('slide-in');
        
        setTimeout(() => {
            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = caption;
            lightboxImg.classList.remove('slide-in');
        }, 200);
    }
    
    // Añadir eventos
    items.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);
    
    // Cerrar lightbox al hacer clic fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });
}

// Detección de modo oscuro del sistema y cambio automático
function detectColorScheme() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            darkModeToggle.checked = true;
        }
    } else {
        // Verificar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeToggle.checked = true;
        }
    }
    
    // Evento para cambiar tema
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Inicializar detección de tema
document.addEventListener('DOMContentLoaded', detectColorScheme);

// Sistema anti-DDoS básico
(function() {
    let requestCount = 0;
    let lastRequestTime = Date.now();
    const maxRequestsPerMinute = 100;
    
    // Incrementar contador en cada interacción
    function trackRequest() {
        const now = Date.now();
        // Reiniciar contador después de un minuto
        if (now - lastRequestTime > 60000) {
            requestCount = 0;
            lastRequestTime = now;
        }
        
        requestCount++;
        
        // Si se excede el límite, mostrar advertencia
        if (requestCount > maxRequestsPerMinute) {
            console.warn('Demasiadas solicitudes detectadas. Por favor, reduce la frecuencia de interacciones.');
            // Aquí podrías implementar un bloqueo temporal
        }
    }
    
    // Monitorear eventos de interacción
    ['click', 'scroll', 'keydown', 'mousemove'].forEach(eventType => {
        document.addEventListener(eventType, trackRequest, { passive: true });
    });
})();

// 2. Ahora, vamos a añadir el JavaScript necesario para manejar los modales:
function setupPortfolioModals() {
    // Seleccionar todos los enlaces "Ver detalles"
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    
    // Seleccionar todos los botones de cierre
    const closeButtons = document.querySelectorAll('.details-close');
    
    // Añadir evento de clic a cada enlace
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el ID del modal a mostrar
            const targetId = this.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            
            if (modal) {
                // Mostrar el modal
                modal.classList.add('active');
                
                // Prevenir scroll en el body
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Añadir evento de clic a los botones de cierre
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Encontrar el modal padre
            const modal = this.closest('.portfolio-details');
            
            // Ocultar el modal
            modal.classList.remove('active');
            
            // Restaurar scroll en el body
            document.body.style.overflow = '';
        });
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    document.querySelectorAll('.portfolio-details').forEach(modal => {
        modal.addEventListener('click', function(e) {
            // Si el clic fue directamente en el fondo (no en el contenido)
            if (e.target === this) {
                // Ocultar el modal
                this.classList.remove('active');
                
                // Restaurar scroll en el body
                document.body.style.overflow = '';
            }
        });
    });
}

// Función para filtrar los elementos del portafolio
function setupPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener categoría a filtrar
            const filterValue = this.getAttribute('data-filter');
            
            // Mostrar/ocultar elementos según la categoría
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar modales de portafolio
    setupPortfolioModals();
    
    // Inicializar filtros de portafolio
    setupPortfolioFilters();
    
    // Otras inicializaciones...
});