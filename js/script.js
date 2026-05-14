document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initFormValidation();
    initSearchSystem();
    initcontatoForm();
    initFAQ();
    initSmoothScroll();
});

function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('nav-open');
            mobileMenuToggle.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('nav-open');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

function initFormValidation() {
    const chamadoForm = document.getElementById('chamado-form');
    if (chamadoForm) {
        chamadoForm.addEventListener('submit', handleChamadoSubmit);
        
        const inputs = chamadoForm.querySelectorAll('input, select, textarea');
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
    }
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const errorElement = document.getElementById(fieldName + '-error');
    
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um e-mail válido.';
        }
    }
    
    if (isValid) {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    } else {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    }
    
    return isValid;
}

function handleChamadoSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (isFormValid) {
        const carregarButton = form.querySelector('button[type="submit"]');
        const originalText = carregarButton.textContent;
        
        carregarButton.textContent = 'Enviando...';
        carregarButton.disabled = true;
        
        setTimeout(() => {
            const chamadoNumber = 'TK-' + new Date().getFullYear() + '-' + 
                               String(Math.floor(Math.random() * 1000) + 1).padStart(3, '0');
            
            showChamadoSuccess(chamadoNumber);
            
            carregarButton.textContent = originalText;
            carregarButton.disabled = false;
            
        }, 2000);
    } else {
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
}

function showChamadoSuccess(chamadoNumber) {
    const form = document.getElementById('chamado-form');
    const successMessage = document.getElementById('success-message');
    const chamadoNumberElement = document.getElementById('chamado-number');
    
    if (form && successMessage && chamadoNumberElement) {
        chamadoNumberElement.textContent = chamadoNumber;
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        localStorage.setItem('lastChamadoNumber', chamadoNumber);
    }
}

function resetForm() {
    const form = document.getElementById('chamado-form');
    const successMessage = document.getElementById('success-message');
    
    if (form && successMessage) {
        form.style.display = 'flex';
        successMessage.style.display = 'none';
        form.reset();
        
        const errorInputs = form.querySelectorAll('.error');
        const errorMessages = form.querySelectorAll('.error-message.show');
        
        errorInputs.forEach(input => input.classList.remove('error'));
        errorMessages.forEach(msg => {
            msg.classList.remove('show');
            msg.textContent = '';
        });
        
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function initSearchSystem() {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
}

function handleSearch(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query === '') {
        alert('Por favor, digite um número de protocolo ou e-mail.');
        return;
    }
    
    showcarregar();
    
    setTimeout(() => {
        searchChamado(query);
    }, 1500);
}

function showcarregar() {
    document.getElementById('carregar').style.display = 'block';
    document.getElementById('sem-resultados').style.display = 'none';
    document.getElementById('chamado-resultado').style.display = 'none';
}

function searchChamado(query) {
    const amostraChamados = {
        'TK-2025-001': {
            id: 'TK-2025-001',
            status: 'in-progress',
            date: '15/01/2025',
            requester: 'João Silva',
            email: 'joao.silva@empresa.com',
            setor: 'Financeiro',
            type: 'Hardware',
            assignee: 'Ana Paula – Suporte Nível 1',
            priority: 'Normal',
            description: 'Computador não está ligando. Ao pressionar o botão power, nada acontece. Já verifiquei se está conectado na tomada.',
            timeline: [
                {
                    date: '15/01/2025 09:30',
                    title: 'Chamado Aberto',
                    description: 'Chamado registrado no sistema'
                },
                {
                    date: '15/01/2025 10:15',
                    title: 'Em Atendimento',
                    description: 'Chamado atribuído para Ana Paula'
                },
                {
                    date: '15/01/2025 14:20',
                    title: 'Diagnóstico Realizado',
                    description: 'Identificado problema na fonte de alimentação'
                }
            ]
        },
        'TK-2025-002': {
            id: 'TK-2025-002',
            status: 'resolved',
            date: '14/01/2025',
            requester: 'Maria Santos',
            email: 'maria.santos@empresa.com',
            setor: 'RH',
            type: 'Rede',
            assignee: 'Alessandro Matheus – Infraestrutura e Redes',
            priority: 'Alta',
            description: 'Sem acesso à internet. Cabo de rede parece estar com problemas.',
            timeline: [
                {
                    date: '14/01/2025 11:00',
                    title: 'Chamado Aberto',
                    description: 'Chamado registrado como urgente'
                },
                {
                    date: '14/01/2025 11:30',
                    title: 'Em Atendimento',
                    description: 'Técnico deslocado para o local'
                },
                {
                    date: '14/01/2025 13:45',
                    title: 'Problema Resolvido',
                    description: 'Cabo de rede substituído, conexão restabelecida'
                }
            ]
        }
    };
    
    const emailChamados = {
        'joao.silva@empresa.com': 'TK-2025-001',
        'maria.santos@empresa.com': 'TK-2025-002'
    };
    
    let chamado = null;
    
    if (amostraChamados[query.toUpperCase()]) {
        chamado = amostraChamados[query.toUpperCase()];
    }
    else if (emailChamados[query.toLowerCase()]) {
        const chamadoId = emailChamados[query.toLowerCase()];
        chamado = amostraChamados[chamadoId];
    }
    
    document.getElementById('carregar').style.display = 'none';
    
    if (chamado) {
        displayChamado(chamado);
    } else {
        document.getElementById('sem-resultados').style.display = 'block';
    }
}

function displayChamado(chamado) {
    document.getElementById('chamado-id').textContent = chamado.id;
    document.getElementById('chamado-date').textContent = chamado.date;
    document.getElementById('chamado-requester').textContent = chamado.requester;
    document.getElementById('chamado-email').textContent = chamado.email;
    document.getElementById('chamado-setor').textContent = chamado.setor;
    document.getElementById('chamado-type').textContent = chamado.type;
    document.getElementById('chamado-assignee').textContent = chamado.assignee;
    document.getElementById('chamado-priority').textContent = chamado.priority;
    document.getElementById('chamado-description').textContent = chamado.description;
    
    const statusBadge = document.getElementById('status-badge');
    statusBadge.className = `status-badge ${chamado.status}`;
    
    const statusText = {
        'open': 'Aberto',
        'in-progress': 'Em Atendimento',
        'resolved': 'Resolvido'
    };
    
    statusBadge.textContent = statusText[chamado.status] || 'Desconhecido';
    
    const timeline = document.getElementById('chamado-timeline');
    timeline.innerHTML = '';
    
    chamado.timeline.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-description">${item.description}</div>
        `;
        timeline.appendChild(timelineItem);
    });
    
    document.getElementById('chamado-resultado').style.display = 'block';
    
    document.getElementById('chamado-resultado').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function printChamado() {
    window.print();
}

function initcontatoForm() {
    const contatoForm = document.getElementById('contato-form');
    if (contatoForm) {
        contatoForm.addEventListener('submit', handlecontatoSubmit);
    }
}

function handlecontatoSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('contato-success');
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#dc2626';
        } else {
            field.style.borderColor = '#e5e7eb';
        }
    });
    
    if (isValid) {
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.style.display = 'none';
                submitButton.textContent = 'Enviar Mensagem';
                submitButton.disabled = false;
            }, 3000);
        }, 1500);
    }
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}


function formatDate(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(date) {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function generateChamadoNumber() {
    const year = new Date().getFullYear();
    const number = Math.floor(Math.random() * 1000) + 1;
    return `TK-${year}-${String(number).padStart(3, '0')}`;
}

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('Não foi possível salvar no localStorage:', error);
    }
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.warn('Não foi possível carregar do localStorage:', error);
        return null;
    }
}

function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        element.style.opacity = Math.min(progress / duration, 1);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = null;
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        element.style.opacity = initialOpacity - (initialOpacity * progress / duration);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

function initFormAutoSave() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const savedValue = loadFromStorage(`form_${form.id}_${input.name}`);
            if (savedValue && input.type !== 'password') {
                input.value = savedValue;
            }
            
            input.addEventListener('input', function() {
                if (this.type !== 'password') {
                    saveToStorage(`form_${form.id}_${this.name}`, this.value);
                }
            });
        });
        
        form.addEventListener('submit', function() {
            const inputs = this.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                localStorage.removeItem(`form_${this.id}_${input.name}`);
            });
        });
    });
}


window.resetForm = resetForm;
window.printChamado = printChamado;