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
                pais: document.getElementById('country').value,
                ciudad: document.getElementById('city').value,
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
    let hasRegisteredForTools = false;

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
                pais: document.getElementById('regCountry').value,
                ciudad: document.getElementById('regCity').value,
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
                hasRegisteredForTools = true;
                // Guardar datos para enviarlos junto con el diagnóstico luego
                localStorage.setItem('foxyLeadData', JSON.stringify(data));
                
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
            if(!hasRegisteredForTools) {
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
        let detailedReport = [];
        
        userAnswers.forEach((answerIdx, qIdx) => {
            const q = diagnosticQuestions[qIdx];
            const opt = q.options[answerIdx];
            const pts = opt.points;
            totalScore += pts;
            
            // Si tiene puntos altos (2 o 3), mostrar el consejo
            if(pts >= 1) {
                advicesHtml += `<li><i data-feather="alert-circle"></i> <span><strong>${q.text}</strong><br>${q.advice}</span></li>`;
                detailedReport.push({
                    pregunta: q.text,
                    respuesta: opt.text,
                    consejo: q.advice
                });
            }
        });

        // Send diagnostic results to email via FormSubmit (silent background)
        const regData = JSON.parse(localStorage.getItem('foxyLeadData') || '{}');
        const diagnosticData = {
            ...regData,
            puntaje_total: `${totalScore} / 21`,
            reporte_detallado: JSON.stringify(detailedReport),
            _subject: `RESULTADO DIAGNÓSTICO: ${regData.nombre || 'Usuario'} - ${totalScore} pts`
        };

        if(regData.email) {
            fetch("https://formsubmit.co/ajax/consultas@foxystudio.com", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(diagnosticData)
            });
        }

        let title = "";
        let desc = "";
        let conclusion = "";

        if(totalScore <= 5) {
            title = "Estado: Óptimo con Retos de Escalamiento";
            desc = "Tu infraestructura actual es sólida, pero para pasar al siguiente nivel necesitas automatizaciones que liberen tu tiempo de gestión.";
            conclusion = "Aunque estás bien, la competencia no descansa. Una optimización de 'fine-tuning' en tu embudo de ventas podría duplicar tu tasa de conversión actual sin aumentar tu inversión en publicidad.";
        } else if (totalScore <= 12) {
            title = "Estado: Fugas de Eficiencia Detectadas";
            desc = "Estás operando con procesos que funcionan, pero a un costo de tiempo y energía demasiado alto. Tu web no está trabajando al 100% para ti.";
            conclusion = "Cada lead que no se responde en los primeros 5 minutos pierde un 80% de probabilidad de cierre. Tus procesos manuales están dejando dinero sobre la mesa. Necesitas centralizar y automatizar antes de que el desorden limite tu crecimiento.";
        } else if (totalScore <= 18) {
            title = "Estado: Riesgo Operativo y Tecnológico";
            desc = "Tu empresa depende excesivamente de tareas manuales y herramientas que no se comunican entre sí. Esto crea un 'cuello de botella' invisible.";
            conclusion = "Estás en el punto donde el crecimiento te va a doler. Sin una modernización tech, cada nuevo cliente será una carga operativa más pesada. Es momento de dejar de 'apagar incendios' y construir un sistema que trabaje por ti 24/7.";
        } else {
            title = "Estado: Situación de Urgencia Digital";
            desc = "Tu infraestructura actual es obsoleta para el mercado moderno. Pierdes leads constantemente y tu equipo está atrapado en tareas administrativas repetitivas.";
            conclusion = "No solo estás perdiendo eficiencia, estás perdiendo credibilidad y mercado. Un sistema automatizado no es un lujo para ti, es la única forma de recuperar el control de tu empresa y volver a ser rentable en el tiempo invertido.";
        }

        let html = `
            <div class="result-score">${totalScore} <span style="font-size:1.5rem; opacity:0.6;">/ 21 pts</span></div>
            <h3 class="result-title" style="color:var(--color-accent); font-size:2rem; margin-bottom:1.5rem;">${title}</h3>
            <p class="result-desc" style="font-size:1.1rem; line-height:1.6; margin-bottom:2.5rem;">${desc}</p>
            
            <div style="background:rgba(255,255,255,0.03); padding:2.5rem; border-radius:20px; border-left:4px solid var(--color-accent); margin-bottom:2.5rem; text-align:left;">
                <h4 style="margin-bottom:1rem; font-size:1.2rem;">Análisis de Valor:</h4>
                <p style="color:var(--color-text-muted); font-size:1rem;">${conclusion}</p>
            </div>
        `;

        if(advicesHtml !== '') {
            html += `
                <div class="result-advice">
                    <h4 style="margin-bottom:1.5rem;"><i data-feather="target"></i> Puntos Críticos a Resolver:</h4>
                    <ul>${advicesHtml}</ul>
                </div>
            `;
        }

        html += `
            <div style="margin-top:4rem; padding-top:3rem; border-top:1px solid rgba(255,255,255,0.05);">
                <p style="margin-bottom:2rem; font-size:1.1rem; font-weight:600;">¿Quieres llevar a tu empresa a su máximo potencial con optimizaciones reales? Escríbenos para agendar una asesoría gratuita.</p>
                <a href="contacto.html" class="btn-primary btn-large">Agendar Asesoría Gratuita</a>
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
            if(!hasRegisteredForTools) {
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

    // ==========================================
    // TIMELINE ANIMATION (NOSOTROS)
    // ==========================================
    const timeline = document.getElementById('methodologyTimeline');
    const timelineBall = document.getElementById('timelineBall');
    const timelineDots = document.querySelectorAll('.timeline-dot');
    
    if (timeline && timelineBall && timelineDots.length > 0) {
        window.addEventListener('scroll', () => {
            const timelineRect = timeline.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Queremos que la bolita baje según el scroll en la ventana.
            // Calculamos cuánto ha entrado la sección en la vista.
            const startScroll = timelineRect.top - viewportHeight * 0.5;
            const endScroll = timelineRect.bottom - viewportHeight * 0.5;
            const totalScroll = endScroll - startScroll;
            
            let progress = (window.scrollY - (window.scrollY + startScroll)) / totalScroll;
            progress = -startScroll / totalScroll; // distance scrolled past the start point
            
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            
            const timelineHeight = timeline.offsetHeight;
            // Limit the ball to the center of the last dot
            const lastDot = timelineDots[timelineDots.length - 1];
            const firstDot = timelineDots[0];
            
            const lastDotRect = lastDot.getBoundingClientRect();
            const firstDotRect = firstDot.getBoundingClientRect();
            
            // Calculamos el inicio y el fin basándonos en la posición dentro del contenedor
            const minTop = (firstDotRect.top - timelineRect.top) + (firstDotRect.height / 2);
            const maxTop = (lastDotRect.top - timelineRect.top) + (lastDotRect.height / 2);
            
            let ballTop = progress * timelineHeight;
            if (ballTop < minTop) ballTop = minTop;
            if (ballTop > maxTop) ballTop = maxTop;
            
            timelineBall.style.top = ballTop + 'px';
            
            // Iluminar SOLO el icono en el que la bolita está actualmente detrás
            timelineDots.forEach(dot => {
                // Como quitamos el flex-direction column del marker, dot.offsetTop en el relative item es 0
                // Necesitamos la posición real del dot respecto al contenedor .timeline
                // Una forma fácil es usar la posición absoluta de la página:
                const dotRect = dot.getBoundingClientRect();
                const ballRect = timelineBall.getBoundingClientRect();
                
                // Calculamos la distancia entre el centro de la bolita y el centro del icono
                const dotCenterY = dotRect.top + (dotRect.height / 2);
                const ballCenterY = ballRect.top + (ballRect.height / 2);
                
                if (Math.abs(dotCenterY - ballCenterY) < 40) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
        
        // Trigger once on load
        window.dispatchEvent(new Event('scroll'));
    }

    // ==========================================
    // LANGUAGE TOGGLE (GOOGLE TRANSLATE)
    // ==========================================
    const navActionsList = document.querySelectorAll('.nav-actions');
    const mobileNavList = document.querySelectorAll('.mobile-nav');
    
    // Inject Google Translate script
    const gtScript = document.createElement('script');
    gtScript.type = 'text/javascript';
    gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateInit';
    document.body.appendChild(gtScript);

    window.googleTranslateInit = function() {
        new google.translate.TranslateElement({pageLanguage: 'es', includedLanguages: 'en,es', autoDisplay: false}, 'google_translate_element');
    };

    const gtDiv = document.createElement('div');
    gtDiv.id = 'google_translate_element';
    gtDiv.style.display = 'none';
    document.body.appendChild(gtDiv);

    function toggleLanguage() {
        const isEnglish = document.cookie.includes('googtrans=/es/en') || document.cookie.includes('googtrans=%2Fes%2Fen');
        if (isEnglish) {
            document.cookie = "googtrans=/es/es; path=/;";
            document.cookie = "googtrans=/es/es; path=/; domain=" + location.hostname;
        } else {
            document.cookie = "googtrans=/es/en; path=/;";
            document.cookie = "googtrans=/es/en; path=/; domain=" + location.hostname;
        }
        window.location.reload();
    }

    const isEng = document.cookie.includes('googtrans=/es/en') || document.cookie.includes('googtrans=%2Fes%2Fen');
    
    // Add button to all desktop navs
    navActionsList.forEach(navActions => {
        const langBtn = document.createElement('button');
        langBtn.className = 'btn-secondary lang-btn';
        langBtn.style.padding = '0.5rem 1rem';
        langBtn.style.marginLeft = '1rem';
        langBtn.style.display = 'flex';
        langBtn.style.alignItems = 'center';
        langBtn.style.gap = '8px';
        langBtn.style.whiteSpace = 'nowrap';
        langBtn.innerHTML = isEng ? '<i data-feather="globe" style="width:16px;height:16px;"></i> ES' : '<i data-feather="globe" style="width:16px;height:16px;"></i> EN';
        langBtn.onclick = toggleLanguage;
        navActions.appendChild(langBtn);
    });

    // Add button to all mobile navs
    mobileNavList.forEach(mobileNav => {
        const langBtnMob = document.createElement('button');
        langBtnMob.className = 'btn-secondary lang-btn';
        langBtnMob.style.marginTop = '1rem';
        langBtnMob.innerHTML = isEng ? 'Cambiar a Español' : 'Change to English';
        langBtnMob.onclick = toggleLanguage;
        mobileNav.appendChild(langBtnMob);
    });

    setTimeout(() => {
        if (typeof feather !== 'undefined') feather.replace();
    }, 100);

    // ==========================================
    // WHATSAPP FLOATING BUTTON (GLOBAL)
    // ==========================================
    const waBtn = document.createElement('a');
    waBtn.href = 'https://wa.me/51912424331';
    waBtn.target = '_blank';
    waBtn.className = 'whatsapp-float';
    waBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        <span>¿Dudas? Escríbenos!</span>
    `;
    document.body.appendChild(waBtn);

    // ==========================================
    // HERO ZOOM EFFECT (INICIO)
    // ==========================================
    const mainHero = document.querySelector('.hero');
    if (mainHero) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            // Calculamos solo si el hero está visible en la pantalla
            if (scrollY < window.innerHeight) {
                // Aumenta un 30% el tamaño progresivamente (antes era 10%)
                const zoomLevel = 1 + (scrollY / window.innerHeight) * 0.3;
                mainHero.style.setProperty('--zoom', zoomLevel);
            }
        });
    }

});
