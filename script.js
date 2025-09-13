// Globale Variablen
let animationObserver;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCalculator();
    initializeNavigation();
    initializeCounters();
    initializeProgressBars();
    initializeCharts();
    initializeWidgets();
});

// Animation Observer initialisieren
function initializeAnimations() {
    animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Alle animierbaren Elemente beobachten
    document.querySelectorAll('.manufacturing-card, .efficiency-card, .tip-card, .feature-item, .material-item').forEach(el => {
        el.classList.add('fade-in');
        animationObserver.observe(el);
    });
}

// Calculator Funktionalität
function initializeCalculator() {
    const wattsInput = document.getElementById('gpu-watts');
    const hoursInput = document.getElementById('daily-hours');
    const wattsSlider = document.getElementById('watts-slider');
    const hoursSlider = document.getElementById('hours-slider');
    const co2Result = document.getElementById('co2-result');
    const carKm = document.getElementById('car-km');
    const trees = document.getElementById('trees');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Event Listeners für Inputs
    wattsInput.addEventListener('input', syncInputsAndCalculate);
    hoursInput.addEventListener('input', syncInputsAndCalculate);
    wattsSlider.addEventListener('input', syncInputsAndCalculate);
    hoursSlider.addEventListener('input', syncInputsAndCalculate);

    // Preset Buttons
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const watts = btn.getAttribute('data-watts');
            wattsInput.value = watts;
            wattsSlider.value = watts;
            calculateCO2();
            
            // Animation für Button
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });

    function syncInputsAndCalculate() {
        // Synchronisiere Input und Slider
        if (event.target === wattsInput) {
            wattsSlider.value = wattsInput.value;
        } else if (event.target === wattsSlider) {
            wattsInput.value = wattsSlider.value;
        } else if (event.target === hoursInput) {
            hoursSlider.value = hoursInput.value;
        } else if (event.target === hoursSlider) {
            hoursInput.value = hoursSlider.value;
        }
        
        calculateCO2();
    }

    function calculateCO2() {
        const watts = parseFloat(wattsInput.value) || 0;
        const hours = parseFloat(hoursInput.value) || 0;
        
        // Berechnung: Watt * Stunden/Tag * 365 Tage * 0.5kg CO2/kWh / 1000 (Watt zu kWh)
        const yearlyKWh = (watts * hours * 365) / 1000;
        const yearlyCO2 = yearlyKWh * 0.5; // 0.5kg CO2 pro kWh (Durchschnitt Deutschland)
        
        // Vergleichswerte
        const carKilometers = Math.round(yearlyCO2 * 5.3); // ~190g CO2 pro km
        const treesNeeded = Math.round(yearlyCO2 / 22); // Ein Baum absorbiert ca. 22kg CO2 pro Jahr
        
        // Animierte Aktualisierung der Werte
        animateValue(co2Result, parseFloat(co2Result.textContent), yearlyCO2, 1000);
        animateValue(carKm, parseInt(carKm.textContent), carKilometers, 1000);
        animateValue(trees, parseInt(trees.textContent), treesNeeded, 1000);
        
        updateTips(watts, hours);
    }
    
    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const isDecimal = end % 1 !== 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * easeOutQuart(progress);
            element.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    
    function updateTips(watts, hours) {
        const tipsList = document.getElementById('tips-list');
        const tips = [];
        
        if (watts > 300) {
            tips.push('Erwäge Undervolting - kann 15-20% Energie sparen');
            tips.push('Prüfe ob du wirklich Ultra-Einstellungen brauchst');
        }
        
        if (hours > 6) {
            tips.push('Plane Pausen - das spart Energie und schont die Hardware');
            tips.push('Nutze Sleep-Modi wenn du kurz weg bist');
        }
        
        if (watts < 200) {
            tips.push('Deine GPU ist sehr effizient! 👍');
        }
        
        // Standard-Tipps hinzufügen
        tips.push('Aktiviere V-Sync um unnötige FPS zu begrenzen');
        tips.push('Halte Treiber aktuell für beste Effizienz');
        tips.push('Reinige regelmäßig die Lüfter für optimale Kühlung');
        
        // Liste aktualisieren
        tipsList.innerHTML = '';
        tips.slice(0, 4).forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }

    // Initiale Berechnung
    calculateCO2();
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Smooth Scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Active Link Highlighting
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });
}

// Animierte Counter
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, 0, target, 2000);
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(start + (end - start) * easeOutQuart(progress));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
}

// Progress Bars Animation
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);
                progressObserver.unobserve(bar);
            }
        });
    });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Chart Animation
function initializeCharts() {
    const chartBars = document.querySelectorAll('.chart-bar');
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const height = bar.getAttribute('data-height') + '%';
                const pseudoElement = window.getComputedStyle(bar, '::before');
                
                setTimeout(() => {
                    bar.style.setProperty('--bar-height', height);
                    bar.querySelector('::before') && (bar.querySelector('::before').style.height = height);
                }, 300);
                
                chartObserver.unobserve(bar);
            }
        });
    });
    
    chartBars.forEach(bar => {
        chartObserver.observe(bar);
    });
}

// Widget Interaktivität
function initializeWidgets() {
    const modal = document.getElementById('info-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    
    // Modal schließen
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Modal schließen bei Klick außerhalb
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // ESC-Taste zum Schließen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Statistik-Widgets
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showStatModal(index);
        });
    });
    
    // Manufacturing Cards
    const manufacturingCards = document.querySelectorAll('.manufacturing-card');
    manufacturingCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showManufacturingModal(index);
        });
    });
    
    // Efficiency Cards
    const efficiencyCards = document.querySelectorAll('.efficiency-card');
    efficiencyCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showEfficiencyModal(index);
        });
    });
    
    // Tip Cards
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            showTipModal(index);
        });
    });
    
    function showModal(content) {
        modalBody.innerHTML = content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function showStatModal(index) {
        const statData = [
            {
                icon: '🎮',
                title: 'Gaming-Community Weltweit',
                content: `
                    <div class="modal-section">
                        <h3>Globale Gaming-Statistiken</h3>
                        <p>Die Gaming-Community ist eine der größten und einflussreichsten digitalen Gemeinschaften weltweit. Mit über 3 Milliarden Spielern haben wir eine enorme Verantwortung für unseren Planeten.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">3.2B</span>
                                <span class="modal-stat-label">Aktive Gamer</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">2.7B</span>
                                <span class="modal-stat-label">Mobile Gamer</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">1.3B</span>
                                <span class="modal-stat-label">PC Gamer</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Umweltauswirkungen</h3>
                        <p>Jeder Gamer kann durch bewusste Entscheidungen einen positiven Einfluss auf die Umwelt haben:</p>
                        <ul class="modal-list">
                            <li>Energieeffiziente Hardware wählen</li>
                            <li>Ökostrom für das Gaming-Setup nutzen</li>
                            <li>Hardware länger verwenden</li>
                            <li>Gebrauchte Komponenten kaufen</li>
                            <li>Alte Hardware ordnungsgemäß recyceln</li>
                        </ul>
                    </div>
                `
            },
            {
                icon: '⚡',
                title: 'Globaler Gaming-Stromverbrauch',
                content: `
                    <div class="modal-section">
                        <h3>Energieverbrauch der Gaming-Industrie</h3>
                        <p>Gaming verbraucht weltweit etwa 34 TWh pro Jahr - das entspricht dem Stromverbrauch von Argentinien. Dieser Verbrauch teilt sich auf verschiedene Bereiche auf:</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">60%</span>
                                <span class="modal-stat-label">Gaming-PCs</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">25%</span>
                                <span class="modal-stat-label">Konsolen</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">15%</span>
                                <span class="modal-stat-label">Mobile Gaming</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Einsparpotential</h3>
                        <ul class="modal-list">
                            <li>Moderne GPUs sind bis zu 50% effizienter als ältere Modelle</li>
                            <li>Optimierte Spieleinstellungen können 20-30% Energie sparen</li>
                            <li>Automatische Energiesparmodi reduzieren Standby-Verbrauch um 90%</li>
                            <li>Cloud Gaming kann lokalen Energieverbrauch um bis zu 80% senken</li>
                        </ul>
                    </div>
                `
            },
            {
                icon: '🌍',
                title: 'CO2-Emissionen des Gaming',
                content: `
                    <div class="modal-section">
                        <h3>Gaming's Carbon Footprint</h3>
                        <p>Die Gaming-Industrie produziert jährlich etwa 24 Millionen Tonnen CO2 - vergleichbar mit den Emissionen von 5 Millionen Autos. Diese Emissionen entstehen durch:</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">45%</span>
                                <span class="modal-stat-label">Hardware-Nutzung</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">35%</span>
                                <span class="modal-stat-label">Hardware-Herstellung</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">20%</span>
                                <span class="modal-stat-label">Datenübertragung</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Lösungsansätze</h3>
                        <ul class="modal-list">
                            <li>Umstellung auf erneuerbare Energien</li>
                            <li>Effizientere Hardware-Entwicklung</li>
                            <li>Längere Hardware-Lebenszyklen</li>
                            <li>Optimierte Spiele-Engines</li>
                            <li>Carbon-Offset-Programme für Gamer</li>
                        </ul>
                    </div>
                `
            }
        ];
        
        const data = statData[index];
        const content = `
            <div class="modal-header">
                <div class="modal-icon">${data.icon}</div>
                <h2 class="modal-title">${data.title}</h2>
            </div>
            ${data.content}
        `;
        showModal(content);
    }
    
    function showManufacturingModal(index) {
        const manufacturingData = [
            {
                icon: '⛏️',
                title: 'Seltene Erden & Rohstoffabbau',
                content: `
                    <div class="modal-section">
                        <h3>Kritische Materialien in GPUs</h3>
                        <p>Moderne Grafikkarten enthalten über 30 verschiedene seltene Mineralien, deren Abbau erhebliche Umwelt- und Sozialprobleme verursacht.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">17</span>
                                <span class="modal-stat-label">Seltene Erden</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">15kg</span>
                                <span class="modal-stat-label">Erz pro GPU</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">70%</span>
                                <span class="modal-stat-label">Aus China</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Umweltauswirkungen</h3>
                        <ul class="modal-list">
                            <li>Zerstörung von Ökosystemen durch Tagebau</li>
                            <li>Kontamination von Grundwasser durch Chemikalien</li>
                            <li>Hoher Energieverbrauch bei der Extraktion</li>
                            <li>Radioaktive Abfälle bei der Verarbeitung</li>
                            <li>Verlust der Biodiversität in Abbaugebieten</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Nachhaltige Alternativen</h3>
                        <ul class="modal-list">
                            <li>Recycling von Elektronikschrott</li>
                            <li>Entwicklung synthetischer Alternativen</li>
                            <li>Effizientere Nutzung vorhandener Materialien</li>
                            <li>Zertifizierte, ethische Lieferketten</li>
                        </ul>
                    </div>
                `
            },
            {
                icon: '🏭',
                title: 'Chip-Produktion & Fertigung',
                content: `
                    <div class="modal-section">
                        <h3>Der Herstellungsprozess</h3>
                        <p>Die Produktion moderner GPU-Chips ist einer der ressourcenintensivsten Industrieprozesse der Welt. Ein einziger 7nm-Chip benötigt über 2.000 Liter Wasser.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">2000L</span>
                                <span class="modal-stat-label">Wasser pro Chip</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">300</span>
                                <span class="modal-stat-label">Produktionsschritte</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">99.9%</span>
                                <span class="modal-stat-label">Reinheitsgrad</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Ressourcenverbrauch</h3>
                        <ul class="modal-list">
                            <li>Ultrapures Wasser für Reinigungsprozesse</li>
                            <li>Hochgiftige Chemikalien für Ätzprozesse</li>
                            <li>Enorme Mengen elektrischer Energie</li>
                            <li>Seltene Gase für Beschichtungen</li>
                            <li>Präzise Temperatur- und Druckkontrolle</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Verbesserungsmaßnahmen</h3>
                        <ul class="modal-list">
                            <li>Wasserrecycling in Produktionsanlagen</li>
                            <li>Erneuerbare Energien für Fabriken</li>
                            <li>Effizientere Fertigungsprozesse</li>
                            <li>Reduzierung von Ausschuss</li>
                        </ul>
                    </div>
                `
            },
            {
                icon: '🚚',
                title: 'Globaler Transport & Logistik',
                content: `
                    <div class="modal-section">
                        <h3>Die GPU-Lieferkette</h3>
                        <p>GPUs legen durchschnittlich 15.000 km zurück, bevor sie beim Endkunden ankommen. Von der Rohstoffgewinnung bis zum Verkauf durchlaufen sie mehrere Kontinente.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">15000km</span>
                                <span class="modal-stat-label">Transportweg</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">5</span>
                                <span class="modal-stat-label">Kontinente</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">25kg</span>
                                <span class="modal-stat-label">CO2 pro GPU</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Transportwege</h3>
                        <ul class="modal-list">
                            <li>Rohstoffe: Afrika/Südamerika → Asien</li>
                            <li>Chip-Produktion: Taiwan/Südkorea</li>
                            <li>Assembly: China/Malaysia</li>
                            <li>Distribution: Weltweit per Schiff/Flugzeug</li>
                            <li>Einzelhandel: Lokale Verteilung per LKW</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Optimierungsansätze</h3>
                        <ul class="modal-list">
                            <li>Regionale Produktionszentren</li>
                            <li>Effizientere Verpackung</li>
                            <li>Seefracht statt Luftfracht</li>
                            <li>Lokale Lieferanten bevorzugen</li>
                        </ul>
                    </div>
                `
            }
        ];
        
        const data = manufacturingData[index];
        const content = `
            <div class="modal-header">
                <div class="modal-icon">${data.icon}</div>
                <h2 class="modal-title">${data.title}</h2>
            </div>
            ${data.content}
        `;
        showModal(content);
    }
    
    function showEfficiencyModal(index) {
        const efficiencyData = [
            {
                icon: '🔧',
                title: 'GTX 1080 Ti - Ältere Generation',
                content: `
                    <div class="modal-section">
                        <h3>Technische Spezifikationen</h3>
                        <p>Die GTX 1080 Ti war 2017 eine High-End-Grafikkarte, die auf der Pascal-Architektur basierte. Sie dient als Referenz für ältere GPU-Generationen.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">16nm</span>
                                <span class="modal-stat-label">Fertigungsprozess</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">3584</span>
                                <span class="modal-stat-label">CUDA Kerne</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">11GB</span>
                                <span class="modal-stat-label">VRAM</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Energieeffizienz</h3>
                        <ul class="modal-list">
                            <li>Basis-Taktrate: 1480 MHz</li>
                            <li>Boost-Taktrate: 1582 MHz</li>
                            <li>Speicherbandbreite: 484 GB/s</li>
                            <li>Leistungsaufnahme: 250W TGP</li>
                            <li>Effizienz: 0.4 Performance/Watt</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Nachhaltigkeits-Tipps</h3>
                        <ul class="modal-list">
                            <li>Undervolting kann 15-20W sparen</li>
                            <li>Custom Fan Curves für bessere Kühlung</li>
                            <li>Regelmäßige Reinigung der Kühler</li>
                            <li>Optimierte Spieleinstellungen nutzen</li>
                        </ul>
                    </div>
                `
            },
            {
                icon: '⚡',
                title: 'RTX 4070 - Moderne Effizienz',
                content: `
                    <div class="modal-section">
                        <h3>Technische Innovation</h3>
                        <p>Die RTX 4070 repräsentiert moderne GPU-Effizienz mit der Ada Lovelace-Architektur. Sie bietet 20% mehr Leistung bei 20% weniger Energieverbrauch als die Vorgängergeneration.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">5nm</span>
                                <span class="modal-stat-label">TSMC Prozess</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">5888</span>
                                <span class="modal-stat-label">CUDA Kerne</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">12GB</span>
                                <span class="modal-stat-label">GDDR6X VRAM</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Effizienz-Features</h3>
                        <ul class="modal-list">
                            <li>DLSS 3 für bis zu 4x bessere Performance</li>
                            <li>AV1 Encoding für effizientes Streaming</li>
                            <li>Adaptive Power Management</li>
                            <li>Optimierte Raytracing-Kerne</li>
                            <li>Intelligente Lüftersteuerung</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Umweltvorteile</h3>
                        <ul class="modal-list">
                            <li>50% weniger Energie pro Frame</li>
                            <li>Längere Lebensdauer durch bessere Kühlung</li>
                            <li>Geringere Wärmeentwicklung</li>
                            <li>Effizientere Speichernutzung</li>
                        </ul>
                    </div>
                `
            },
            {
                icon: '🚀',
                title: 'RTX 4090 - Absolute Performance',
                content: `
                    <div class="modal-section">
                        <h3>Flagship-Performance</h3>
                        <p>Die RTX 4090 ist die leistungsstärkste Consumer-GPU, die jemals gebaut wurde. Sie richtet sich an Enthusiasten und Profis, die maximale Leistung benötigen.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">16384</span>
                                <span class="modal-stat-label">CUDA Kerne</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">24GB</span>
                                <span class="modal-stat-label">GDDR6X VRAM</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">2.5GHz</span>
                                <span class="modal-stat-label">Boost Clock</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Leistungsmerkmale</h3>
                        <ul class="modal-list">
                            <li>4K Gaming bei 120+ FPS</li>
                            <li>8K Gaming mit DLSS möglich</li>
                            <li>Professionelle Content Creation</li>
                            <li>KI-Workloads und Machine Learning</li>
                            <li>Raytracing in höchster Qualität</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Nachhaltigkeits-Überlegungen</h3>
                        <ul class="modal-list">
                            <li>Hoher Stromverbrauch - nur bei Bedarf nutzen</li>
                            <li>Lange Nutzungsdauer rechtfertigt Investition</li>
                            <li>Professionelle Anwendungen amortisieren Umweltkosten</li>
                            <li>Undervolting kann 50-100W sparen</li>
                        </ul>
                    </div>
                `
            }
        ];
        
        const data = efficiencyData[index];
        const content = `
            <div class="modal-header">
                <div class="modal-icon">${data.icon}</div>
                <h2 class="modal-title">${data.title}</h2>
            </div>
            ${data.content}
        `;
        showModal(content);
    }
    
    function showTipModal(index) {
        const tipData = [
            {
                icon: '🔄',
                title: 'Hardware länger nutzen',
                content: `
                    <div class="modal-section">
                        <h3>Warum länger nutzen?</h3>
                        <p>Die Herstellung einer GPU verursacht etwa 300kg CO2. Durch längere Nutzung amortisieren sich diese Emissionen besser und reduzieren den jährlichen Umwelt-Fußabdruck erheblich.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">28%</span>
                                <span class="modal-stat-label">CO2-Reduktion</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">7 Jahre</span>
                                <span class="modal-stat-label">Optimale Nutzungsdauer</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">300€</span>
                                <span class="modal-stat-label">Jährliche Ersparnis</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Praktische Tipps</h3>
                        <ul class="modal-list">
                            <li>Regelmäßige Reinigung der Lüfter und Kühlkörper</li>
                            <li>Wärmeleitpaste alle 2-3 Jahre erneuern</li>
                            <li>Moderate Übertaktung vermeiden</li>
                            <li>Gute Gehäuselüftung sicherstellen</li>
                            <li>Staubfilter verwenden und regelmäßig reinigen</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Upgrade-Strategien</h3>
                        <ul class="modal-list">
                            <li>Nur upgraden wenn wirklich nötig</li>
                            <li>2-3 Generationen überspringen</li>
                            <li>Gebrauchte GPU als Zweitkarte nutzen</li>
                            <li>Alte GPU verkaufen statt entsorgen</li>
                        </ul>
                    </div>
                `
            },
            {
                icon: '💰',
                title: 'Gebrauchte Hardware kaufen',
                content: `
                    <div class="modal-section">
                        <h3>Umweltvorteile</h3>
                        <p>Der Kauf gebrauchter GPUs ist eine der effektivsten Methoden, um die Umweltbelastung zu reduzieren. Sie sparen bis zu 80% der Herstellungsemissionen ein.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">80%</span>
                                <span class="modal-stat-label">CO2-Einsparung</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">40%</span>
                                <span class="modal-stat-label">Kostenersparnis</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">240kg</span>
                                <span class="modal-stat-label">CO2 gespart</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Worauf achten beim Kauf?</h3>
                        <ul class="modal-list">
                            <li>Originalverpackung und Rechnung vorhanden</li>
                            <li>Keine Übertaktung oder Mining-Nutzung</li>
                            <li>Funktionstest vor dem Kauf</li>
                            <li>Restgarantie prüfen</li>
                            <li>Seriöse Verkäufer bevorzugen</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Beste Plattformen</h3>
                        <ul class="modal-list">
                            <li>eBay Kleinanzeigen (lokale Abholung)</li>
                            <li>Hardware-Foren mit Bewertungssystem</li>
                            <li>Refurbished-Händler mit Garantie</li>
                            <li>Lokale Computer-Geschäfte</li>
                        </ul>
                    </div>
                `
            },
            {
                icon: '⚙️',
                title: 'Undervolting Guide',
                content: `
                    <div class="modal-section">
                        <h3>Was ist Undervolting?</h3>
                        <p>Undervolting reduziert die Spannung der GPU bei gleicher Leistung. Dies senkt den Stromverbrauch, die Temperaturen und verlängert die Lebensdauer der Hardware.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">15-20%</span>
                                <span class="modal-stat-label">Energieeinsparung</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">10-15°C</span>
                                <span class="modal-stat-label">Temperatur-Reduktion</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">0%</span>
                                <span class="modal-stat-label">Leistungsverlust</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Schritt-für-Schritt Anleitung</h3>
                        <ul class="modal-list">
                            <li>MSI Afterburner oder GPU-Z installieren</li>
                            <li>Aktuelle Werte dokumentieren</li>
                            <li>Spannung schrittweise um 25mV reduzieren</li>
                            <li>Stabilität mit Benchmarks testen</li>
                            <li>Optimalen Wert finden und speichern</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Sicherheitshinweise</h3>
                        <ul class="modal-list">
                            <li>Niemals übertreiben - Stabilität ist wichtig</li>
                            <li>Bei Problemen auf Standardwerte zurücksetzen</li>
                            <li>Regelmäßige Stresstests durchführen</li>
                            <li>Temperaturen im Auge behalten</li>
                        </ul>
                    </div>
                `
            },
            {
                icon: '🌱',
                title: 'Ökostrom für Gamer',
                content: `
                    <div class="modal-section">
                        <h3>Gaming mit grüner Energie</h3>
                        <p>Mit Ökostrom wird dein Gaming-Setup zu 100% klimaneutral. Moderne Ökostrom-Tarife sind oft günstiger als konventioneller Strom und unterstützen den Ausbau erneuerbarer Energien.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">100%</span>
                                <span class="modal-stat-label">CO2-neutral</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">-5€</span>
                                <span class="modal-stat-label">Monatliche Ersparnis</span>
                            </div>
                            <div class="modal-stat-item">
                                <span class="modal-stat-number">500kg</span>
                                <span class="modal-stat-label">CO2 gespart/Jahr</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Beste Ökostrom-Anbieter</h3>
                        <ul class="modal-list">
                            <li>Naturstrom - 100% erneuerbare Energien</li>
                            <li>Greenpeace Energy - Umweltschutz-fokussiert</li>
                            <li>EWS Schönau - Bürgerenergie</li>
                            <li>Lichtblick - Innovativer Ökostrompionier</li>
                            <li>Polarstern - Gemeinwohl-orientiert</li>
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Zusätzliche Maßnahmen</h3>
                        <ul class="modal-list">
                            <li>Solaranlage für das Gaming-Setup</li>
                            <li>Energieeffiziente Monitore wählen</li>
                            <li>Smart Home für automatische Abschaltung</li>
                            <li>CO2-Kompensation für unvermeidbare Emissionen</li>
                        </ul>
                    </div>
                `
            }
        ];
        
        const data = tipData[index];
        const content = `
            <div class="modal-header">
                <div class="modal-icon">${data.icon}</div>
                <h2 class="modal-title">${data.title}</h2>
            </div>
            ${data.content}
        `;
        showModal(content);
    }
}

// Weitere Funktionen
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

// Mobile Menu (falls erweitert werden soll)
function initializeMobileMenu() {
    // Platzhalter für mobile Navigation
}

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    document.body.style.filter = 'hue-rotate(120deg)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 3000);
    
    const msg = document.createElement('div');
    msg.innerHTML = '🎮 Umweltbewusster Gamer entdeckt! 🌱';
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(74, 222, 128, 0.9);
        color: #0a0a0a;
        padding: 2rem;
        border-radius: 15px;
        font-size: 2rem;
        font-weight: bold;
        z-index: 10000;
        animation: fadeInScale 0.5s ease;
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.remove();
    }, 3000);
}

// CSS für Easter Egg Animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);