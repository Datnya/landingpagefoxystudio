// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Scroll Animations with Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Services Tab Logic
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceCards = document.querySelectorAll('.service-card');

    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            serviceItems.forEach(i => i.classList.remove('active'));
            serviceCards.forEach(c => c.classList.remove('active'));

            // Add active to clicked item
            item.classList.add('active');
            
            // Show corresponding card
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Simple Form Validation & Fake Submit -> Real FormSubmit AJAX
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formStatus');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            const data = {
                nombre: document.getElementById('name').value,
                email: document.getElementById('email').value,
                servicio: document.getElementById('service').value,
                mensaje: document.getElementById('message').value,
                _subject: "Solicitud de Servicio - Foxy Studio"
            };

            fetch("https://formsubmit.co/ajax/consultas@foxystudio.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                btn.textContent = originalText;
                btn.disabled = false;
                form.reset();
                
                statusDiv.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
                statusDiv.classList.add('success-msg');
                
                setTimeout(() => {
                    statusDiv.textContent = '';
                    statusDiv.classList.remove('success-msg');
                }, 4000);
            })
            .catch(error => {
                console.log(error);
                btn.textContent = originalText;
                btn.disabled = false;
                statusDiv.textContent = 'Ocurrió un error. Por favor intenta nuevamente.';
            });
        });
    }

    // Navbar Smooth Background Transition on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.style.background = 'rgba(11, 11, 11, 0.85)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        } else {
            navbar.style.background = 'rgba(17, 17, 17, 0.6)';
            navbar.style.boxShadow = 'none';
        }
    });

    // ==========================================
    // MOBILE MENU LOGIC
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if(mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const icon = mobileNav.classList.contains('open') ? 'x' : 'menu';
            mobileMenuBtn.innerHTML = `<i data-feather="${icon}"></i>`;
            feather.replace();
        });
    }

    // ==========================================
    // HERRAMIENTAS GRATUITAS LOGIC
    // ==========================================
    const toolsRegForm = document.getElementById('toolsRegistrationForm');
    const regModal = document.getElementById('registrationModal');
    const closeRegModal = document.getElementById('closeRegModal');
    const pendingActionInput = document.getElementById('pendingAction');

    // Funciones Helper para Modal
    function showRegModal(actionName) {
        if(regModal) {
            regModal.style.display = 'flex';
            if(pendingActionInput) pendingActionInput.value = actionName;
        }
    }
    
    if(closeRegModal) {
        closeRegModal.addEventListener('click', () => {
            regModal.style.display = 'none';
        });
    }

    if(toolsRegForm) {
        toolsRegForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = toolsRegForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i data-feather="loader" class="spin" style="width:18px;height:18px;vertical-align:middle;"></i> Desbloqueando...';
            feather.replace();

            const data = {
                nombre: document.getElementById('regName').value,
                empresa: document.getElementById('regCompany').value,
                email: document.getElementById('regEmail').value,
                novedades: document.getElementById('regNewsletter').checked ? 'Si' : 'No',
                _subject: "Nuevo usuario de herramienta gratuita"
            };

            fetch("https://formsubmit.co/ajax/consultas@foxystudio.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('foxyToolsRegistered', 'true');
                regModal.style.display = 'none';
                btn.innerHTML = originalText;
                
                // Continue with the pending action
                const pendingAction = pendingActionInput.value;
                if(pendingAction === 'startQuiz') {
                    document.getElementById('startDiagnostic').click();
                } else if(pendingAction === 'startAI') {
                    document.getElementById('aiAnalyzeBtn').click();
                }
            })
            .catch(error => {
                console.log(error);
                btn.innerHTML = originalText;
                alert("Ocurrió un error al enviar el formulario. Intenta nuevamente.");
            });
        });
    }

    // ==========================================
    // DIAGNOSTIC QUIZ LOGIC
    // ==========================================
    const diagnosticQuestions = [
        {
            title: "BLOQUE 1: WEB / CONVERSIÓN",
            text: "¿Cuántos leads calificados recibes de tu web cada mes?",
            options: [
                { text: "0-5 leads", points: 3 },
                { text: "5-15 leads", points: 2 },
                { text: "15-30 leads", points: 1 },
                { text: "+30 leads", points: 0 }
            ],
            advice: "Una web profesional y optimizada para conversión debería captar leads automáticamente, actuando como tu mejor vendedor."
        },
        {
            title: "BLOQUE 1: WEB / CONVERSIÓN",
            text: "¿Tu web tiene un formulario de contacto claro y seguimiento?",
            options: [
                { text: "No tenemos web o es muy antigua", points: 3 },
                { text: "Tenemos web pero no convierte bien", points: 2 },
                { text: "Tenemos formulario pero sin seguimiento automático", points: 1 },
                { text: "Tenemos sistema completo y automatizado", points: 0 }
            ],
            advice: "Es fundamental que el usuario sepa qué hacer al entrar. Call-to-actions claros y seguimiento automático evitan perder clientes interesados."
        },
        {
            title: "BLOQUE 2: PROCESOS OPERATIVOS",
            text: "¿Cómo administran la información de clientes?",
            options: [
                { text: "Principalmente en Excel o papeles", points: 3 },
                { text: "En diferentes herramientas que no se comunican", points: 2 },
                { text: "En un CRM básico sin automatización", points: 1 },
                { text: "En un sistema integrado y automatizado", points: 0 }
            ],
            advice: "Un CRM integrado centraliza tu información y automatiza seguimientos, evitando que los clientes se 'enfríen' por olvidos manuales."
        },
        {
            title: "BLOQUE 2: PROCESOS OPERATIVOS",
            text: "¿Cuántas horas/semana se pierden en tareas administrativas repetitivas?",
            options: [
                { text: "+20 horas", points: 3 },
                { text: "15-20 horas", points: 2 },
                { text: "5-15 horas", points: 1 },
                { text: "<5 horas", points: 0 }
            ],
            advice: "El trabajo repetitivo es el mayor asesino de la productividad. Automatizar procesos te permite escalar sin aumentar drásticamente los costos operativos."
        },
        {
            title: "BLOQUE 3: INFRAESTRUCTURA DIGITAL",
            text: "¿Qué tan dependiente eres de suscripciones SaaS externas?",
            options: [
                { text: "Muy dependiente (tengo 5+ herramientas pagas)", points: 3 },
                { text: "Bastante (2-4 herramientas + Excel)", points: 2 },
                { text: "Moderado (1-2 herramientas principales)", points: 1 },
                { text: "Tengo mi propio sistema / No pago suscripciones", points: 0 }
            ],
            advice: "Crear tu propio sistema a medida elimina costos mensuales de SaaS y centraliza todo en una plataforma que se adapta exactamente a tu negocio."
        },
        {
            title: "BLOQUE 3: INFRAESTRUCTURA DIGITAL",
            text: "Si pudieras cambiar algo de tu infraestructura digital, ¿qué sería?",
            options: [
                { text: "Todo. Necesitamos empezar de cero", points: 3 },
                { text: "Integrar las herramientas que usamos", points: 2 },
                { text: "Automatizar procesos manuales", points: 1 },
                { text: "Mejorar la seguridad/escalabilidad", points: 0 }
            ],
            advice: "Una auditoría tecnológica te ayuda a modernizar lo que funciona y desechar lo obsoleto sin detener tu operación actual."
        },
        {
            title: "BLOQUE 4: INTENCIÓN",
            text: "¿Tu equipo tiene presupuesto asignado para mejoras digitales en los próximos 3 meses?",
            options: [
                { text: "Sí, definitivamente", points: 0 },
                { text: "Posiblemente, depende del ROI", points: 1 },
                { text: "No este año", points: 2 },
                { text: "No sé", points: 3 }
            ],
            advice: "Invertir en digitalización tiene un ROI directo: reducción de costos operativos y aumento de ventas a través de nuevos canales."
        }
    ];

    let currentQuestion = 0;
    let userAnswers = [];

    const startDiagBtn = document.getElementById('startDiagnostic');
    const quizContainer = document.getElementById('quizContainer');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizProgressText = document.getElementById('quizProgressText');
    const quizProgressBar = document.getElementById('quizProgressBar');
    const quizPrev = document.getElementById('quizPrev');
    const quizNext = document.getElementById('quizNext');
    const quizResults = document.getElementById('quizResults');

    if(startDiagBtn) {
        startDiagBtn.addEventListener('click', () => {
            if(localStorage.getItem('foxyToolsRegistered') !== 'true') {
                showRegModal('startQuiz');
                return;
            }
            startDiagBtn.parentElement.style.display = 'none';
            quizContainer.style.display = 'block';
            loadQuestion(0);
        });

        quizNext.addEventListener('click', () => {
            if(userAnswers[currentQuestion] !== undefined) {
                if(currentQuestion < diagnosticQuestions.length - 1) {
                    currentQuestion++;
                    loadQuestion(currentQuestion);
                } else {
                    showResults();
                }
            } else {
                alert("Por favor selecciona una opción antes de continuar.");
            }
        });

        quizPrev.addEventListener('click', () => {
            if(currentQuestion > 0) {
                currentQuestion--;
                loadQuestion(currentQuestion);
            }
        });
    }

    function loadQuestion(index) {
        const q = diagnosticQuestions[index];
        quizProgressText.textContent = `Pregunta ${index + 1} de ${diagnosticQuestions.length}`;
        quizProgressBar.style.width = `${((index) / diagnosticQuestions.length) * 100}%`;
        
        quizQuestion.innerHTML = `<span class="text-accent" style="font-size:0.9rem; letter-spacing:1px;">${q.title}</span><br>${q.text}`;
        
        quizOptions.innerHTML = '';
        q.options.forEach((opt, i) => {
            const div = document.createElement('div');
            div.className = 'quiz-option';
            if(userAnswers[index] === i) div.classList.add('selected');
            div.textContent = opt.text;
            div.onclick = () => {
                document.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                userAnswers[index] = i;
                quizNext.style.display = 'inline-block';
            };
            quizOptions.appendChild(div);
        });

        quizPrev.style.display = index === 0 ? 'none' : 'inline-block';
        quizNext.style.display = userAnswers[index] !== undefined ? 'inline-block' : 'none';
        
        if(index === diagnosticQuestions.length - 1) {
            quizNext.innerHTML = 'Ver Resultados <i data-feather="check" style="width:16px;height:16px;vertical-align:middle;"></i>';
        } else {
            quizNext.innerHTML = 'Siguiente <i data-feather="arrow-right" style="width:16px;height:16px;vertical-align:middle;"></i>';
        }
        feather.replace();
    }

    function showResults() {
        quizContainer.style.display = 'none';
        quizResults.style.display = 'block';
        
        let totalScore = 0;
        let advicesHtml = '';
        
        userAnswers.forEach((answerIdx, qIdx) => {
            const q = diagnosticQuestions[qIdx];
            const pts = q.options[answerIdx].points;
            totalScore += pts;
            
            // Si tiene puntos altos (2 o 3), mostrar el consejo
            if(pts >= 2) {
                advicesHtml += `<li><i data-feather="alert-circle"></i> <span><strong>${q.text}</strong><br>${q.advice}</span></li>`;
            }
        });

        let title = "";
        let desc = "";

        if(totalScore <= 5) {
            title = "¡Excelente estado digital!";
            desc = "Tu infraestructura está en buen estado. Las oportunidades de mejora son pequeñas pero podrían darte ese último empujón competitivo.";
        } else if (totalScore <= 12) {
            title = "Oportunidades de eficiencia";
            desc = "Tienes oportunidades claras de mejora. Podrías ganar mucha eficiencia operativa automatizando algunas de tus tareas actuales.";
        } else if (totalScore <= 18) {
            title = "Cambios necesarios";
            desc = "Hay problemas serios en tus procesos o web actual. Necesitas cambios tecnológicos a corto plazo para poder escalar sin ahogar a tu equipo.";
        } else {
            title = "Situación crítica";
            desc = "Tu crecimiento está limitado por tu tecnología actual. Pierdes leads y horas de trabajo constantemente. Es urgente una modernización profunda.";
        }

        let html = `
            <div class="result-score">${totalScore} <span style="font-size:1.5rem; color:var(--color-text-muted);">/ 21 pts</span></div>
            <h3 class="result-title">${title}</h3>
            <p class="result-desc">${desc}</p>
        `;

        if(advicesHtml !== '') {
            html += `
                <div class="result-advice">
                    <h4>Puntos Críticos Detectados:</h4>
                    <ul>${advicesHtml}</ul>
                </div>
            `;
        }

        html += `
            <div style="margin-top:3rem;">
                <p style="margin-bottom:1.5rem;">Hablemos sobre cómo resolver esto.</p>
                <a href="contacto.html" class="btn-primary">Agendar Asesoría Gratuita</a>
            </div>
        `;

        quizResults.innerHTML = html;
        feather.replace();
    }

    // ==========================================
    // AI WEB ANALYSIS LOGIC
    // ==========================================
    const aiAnalyzeBtn = document.getElementById('aiAnalyzeBtn');
    const aiUrl = document.getElementById('aiUrl');
    const aiLoading = document.getElementById('aiLoading');
    const aiResults = document.getElementById('aiResults');

    if(aiAnalyzeBtn) {
        aiAnalyzeBtn.addEventListener('click', () => {
            if(localStorage.getItem('foxyToolsRegistered') !== 'true') {
                showRegModal('startAI');
                return;
            }

            const url = aiUrl.value.trim();
            if(!url) {
                alert("Por favor ingresa un link válido.");
                return;
            }

            aiAnalyzeBtn.disabled = true;
            aiLoading.style.display = 'block';
            aiResults.style.display = 'none';

            // Fake AI loading
            setTimeout(() => {
                aiLoading.style.display = 'none';
                aiAnalyzeBtn.disabled = false;
                
                aiResults.innerHTML = `
                    <h3><i data-feather="cpu"></i> Resultados del Análisis IA</h3>
                    <p style="margin-bottom:2rem; color:var(--color-text-muted);">Análisis completado para: <strong>${url}</strong></p>
                    
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
                        <div class="ai-point">
                            <h4>1. Velocidad de Carga Inicial</h4>
                            <p>Detectamos oportunidades para optimizar imágenes y scripts. Una carga rápida retiene al 40% más de visitantes.</p>
                        </div>
                        <div class="ai-point">
                            <h4>2. Claridad de la Propuesta de Valor</h4>
                            <p>El mensaje principal en los primeros 5 segundos puede ser más directo. Falta un título persuasivo claro.</p>
                        </div>
                        <div class="ai-point">
                            <h4>3. Call-to-Actions (CTAs)</h4>
                            <p>Los botones de contacto no destacan visualmente lo suficiente contra el fondo.</p>
                        </div>
                        <div class="ai-point">
                            <h4>4. Estructura de Conversión</h4>
                            <p>Falta un formulario rápido en la primera vista (above the fold) para captar leads impulsivos.</p>
                        </div>
                        <div class="ai-point">
                            <h4>5. Optimización Móvil</h4>
                            <p>Ciertos elementos de navegación pueden ser difíciles de tocar en pantallas de celular (Touch Targets).</p>
                        </div>
                        <div class="ai-point">
                            <h4>6. Prueba Social</h4>
                            <p>Los testimonios o logos de clientes no están posicionados estratégicamente cerca de los botones de compra.</p>
                        </div>
                        <div class="ai-point">
                            <h4>7. Jerarquía Tipográfica</h4>
                            <p>Mejorar el contraste y tamaño de las fuentes secundarias ayudaría a una lectura más fluida.</p>
                        </div>
                        <div class="ai-point">
                            <h4>8. Meta-Datos SEO</h4>
                            <p>Las descripciones para buscadores están incompletas, limitando tu alcance orgánico.</p>
                        </div>
                        <div class="ai-point">
                            <h4>9. Fricción en Contacto</h4>
                            <p>Se requieren demasiados pasos o campos de formulario para que un cliente haga una consulta inicial.</p>
                        </div>
                        <div class="ai-point">
                            <h4>10. Retención de Abandono</h4>
                            <p>Falta un mecanismo (como un lead magnet o un pop-up de salida) para retener a los visitantes a punto de irse.</p>
                        </div>
                    </div>

                    <div style="text-align:center; margin-top:4rem; background:var(--color-bg); padding:3rem; border-radius:20px; border:1px solid rgba(240,90,34,0.3);">
                        <h3 style="margin-bottom:1rem;">Podemos arreglar todo esto por ti</h3>
                        <p style="margin-bottom:2rem; color:var(--color-text-muted);">Un diseño optimizado multiplica tus ventas sin aumentar tu inversión en publicidad.</p>
                        <a href="contacto.html" class="btn-primary">Mejorar mi presencia digital</a>
                    </div>
                `;
                aiResults.style.display = 'block';
                feather.replace();
                
                // Scroll to results
                window.scrollTo({
                    top: aiResults.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 3500); // 3.5s fake delay
        });
    }

});
