document.addEventListener('DOMContentLoaded', function() {
    // -----------------------------------------
    // Inicialização e configuração de componentes
    // -----------------------------------------
    initFloatingLabels();
    initPasswordToggle();
    initTypingEffect();
    initModals();
    initInputMasks();

    // -----------------------------------------
    // Funções de inicialização
    // -----------------------------------------
    
    // Inicializa efeito de labels flutuantes
    function initFloatingLabels() {
        const inputs = document.querySelectorAll('.input-group input');
        if (!inputs.length) return;

        inputs.forEach(input => {
            // Verifica ao carregar a página (para campos pré-preenchidos)
            toggleFilledClass(input);

            // Configura os listeners de eventos
            input.addEventListener('focus', () => toggleFilledClass(input));
            input.addEventListener('blur', () => toggleFilledClass(input));
            input.addEventListener('input', () => toggleFilledClass(input));
        });
    }

    // Controla a classe 'preenchido' para o efeito de label flutuante
    function toggleFilledClass(input) {
        if (!input) return;
        
        if (input.value.trim() !== '') {
            input.classList.add('preenchido');
        } else {
            input.classList.remove('preenchido');
        }
    }

    // Configura a funcionalidade de mostrar/ocultar senha
    function initPasswordToggle() {
        const togglePassword = document.querySelector('#togglePassword');
        const password = document.querySelector('#senha');
        
        if (!togglePassword || !password) return;
        
        togglePassword.addEventListener('click', function() {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            
            const icon = togglePassword.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // Inicializa o efeito de digitação do título
    function initTypingEffect() {
        const heading = document.querySelector('h1');
        if (!heading) return;
        
        const phrases = ["{ Bem Vindo }", "{ @FenxJB }"];
        let phraseIndex = 0;
        let charIndex = 0;
        const typingSpeed = 150;
        const pauseTime = 1500;

        function typeText() {
            if (!heading) return;
            
            if (charIndex < phrases[phraseIndex].length) {
                heading.textContent += phrases[phraseIndex].charAt(charIndex);
                charIndex++;
                setTimeout(typeText, typingSpeed);
            } else {
                setTimeout(eraseText, pauseTime);
            }
        }

        function eraseText() {
            if (!heading) return;
            
            if (heading.textContent.length > 0) {
                heading.textContent = heading.textContent.slice(0, -1);
                setTimeout(eraseText, typingSpeed / 2);
            } else {
                phraseIndex = (phraseIndex + 1) % phrases.length;
                charIndex = 0;
                setTimeout(typeText, typingSpeed);
            }
        }

        setTimeout(typeText, typingSpeed);
    }

    // Inicializa todas as modais da aplicação
    function initModals() {
        const modalConfigs = [
            ['terms-modal', 'terms-link', ['close-terms-button', 'close-terms-ok-button']],
            ['privacy-modal', 'privacy-link', ['close-privacy-button', 'close-privacy-ok-button']],
            ['create-account-modal', 'create-account-link', ['close-create-account-button']],
            ['recover-password-modal', 'recover-password-link', ['close-recover-password-button']],
            ['jd-code-modal', null, ['close-jd-code-button']]
        ];

        modalConfigs.forEach(config => {
            setupModal(config[0], config[1], config[2]);
        });

        const submitCreateAccountButton = document.querySelector('#submit-create-account');
        if (submitCreateAccountButton) {
            submitCreateAccountButton.addEventListener('click', function(event) {
                event.preventDefault();
                hideModal('create-account-modal');
                showModal('jd-code-modal');
            });
        }

        setupJdCodeVerification();

        window.addEventListener('click', function(event) {
            modalConfigs.forEach(config => {
                const modal = document.getElementById(config[0]);
                if (modal && event.target === modal) {
                    hideModal(config[0]);
                }
            });
        });
    }

    // Inicializa máscaras de input usando jQuery
    function initInputMasks() {
        if (typeof $ === 'function' && typeof $.fn.inputmask === 'function') {
            $('#new-phone').inputmask({
                mask: "(00) 9 9999-9999",
                placeholder: "(DD) 9 0000-0000",
                removeMaskOnSubmit: true,
                autoUnmask: true,
                onincomplete: function() {
                    console.log("Número de telefone incompleto");
                }
            });
        } else {
            console.warn("jQuery ou plugin inputmask não está disponível");
        }
    }

    // Configura uma modal específica
    function setupModal(modalId, openBtnId, closeBtnIds) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (openBtnId) {
            const openBtn = document.getElementById(openBtnId);
            if (openBtn) {
                openBtn.addEventListener('click', function(event) {
                    event.preventDefault();
                    showModal(modalId);
                });
            }
        }

        closeBtnIds.forEach(btnId => {
            const closeBtn = modal.querySelector(`#${btnId}`);
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    hideModal(modalId);
                });
            }
        });
    }

    // Configura a verificação do código JD
    function setupJdCodeVerification() {
        const verifyJdCodeButton = document.querySelector('#verify-jd-code');
        const jdVerificationInput = document.querySelector('#jd-verification-code');
        const jdVerificationMessage = document.querySelector('#jd-verification-message');
        
        if (!verifyJdCodeButton || !jdVerificationInput || !jdVerificationMessage) return;
        
        verifyJdCodeButton.addEventListener('click', function() {
            const enteredCode = jdVerificationInput.value.trim().toLowerCase();
            if (enteredCode === 'jd') {
                jdVerificationMessage.textContent = "Código JD verificado com sucesso!";
                jdVerificationMessage.style.color = "green";
                setTimeout(() => {
                    hideModal('jd-code-modal');
                    alert('Cadastro concluído com sucesso!');
                }, 1500);
            } else {
                jdVerificationMessage.textContent = "Código JD incorreto. Tente novamente.";
                jdVerificationMessage.style.color = "red";
            }
        });
    }

    // Exibe uma modal pelo ID
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
        }
    }

    // Oculta uma modal pelo ID
    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    }
});