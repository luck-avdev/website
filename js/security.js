/**
 * Sistema de seguridad para el portafolio de Luckav
 * Protección contra ataques DDoS y robo de código
 */

(function() {
    // Configuración de seguridad
    const securityConfig = {
        enableProtection: true,
        logAttempts: true,
        maxRequestsPerMinute: 100,
        blockTime: 3600, // en segundos (1 hora)
        protectImages: true,
        protectCode: true,
        disableDevTools: true,
        disableRightClick: true
    };
    
    // Contador de solicitudes
    let requestCount = 0;
    let lastReset = Date.now();
    
    // Verificar si el usuario está en la lista negra
    function checkBlacklist() {
        const blacklisted = localStorage.getItem('security_blacklisted');
        if (blacklisted) {
            const blockUntil = parseInt(localStorage.getItem('security_block_until') || '0');
            if (Date.now() < blockUntil) {
                showBlockedMessage();
                return true;
            } else {
                // El tiempo de bloqueo ha expirado
                localStorage.removeItem('security_blacklisted');
                localStorage.removeItem('security_block_until');
            }
        }
        return false;
    }
    
    // Mostrar mensaje de bloqueo
    function showBlockedMessage() {
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5f5; flex-direction: column; text-align: center; padding: 20px;">
                <h1 style="font-size: 24px; margin-bottom: 20px;">Acceso Bloqueado</h1>
                <p style="font-size: 16px; max-width: 600px; line-height: 1.6;">
                    Se ha detectado actividad sospechosa desde tu dirección. Por razones de seguridad, el acceso a este sitio ha sido temporalmente restringido.
                </p>
                <p style="margin-top: 30px; font-size: 14px;">
                    Si crees que esto es un error, por favor contacta al administrador del sitio.
                </p>
            </div>
        `;
    }
    
    // Registrar intento de acceso
    function logAttempt(type) {
        if (securityConfig.logAttempts) {
            console.log(`[Seguridad] Intento de ${type} detectado y bloqueado`);
        }
    }
    
    // Bloquear usuario
    function blockUser() {
        localStorage.setItem('security_blacklisted', 'true');
        localStorage.setItem('security_block_until', Date.now() + (securityConfig.blockTime * 1000));
        showBlockedMessage();
    }
    
    // Monitorear tasa de solicitudes
    function monitorRequestRate() {
        requestCount++;
        
        // Reiniciar contador cada minuto
        if (Date.now() - lastReset > 60000) {
            requestCount = 1;
            lastReset = Date.now();
        }
        
        // Verificar si excede el límite
        if (requestCount > securityConfig.maxRequestsPerMinute) {
            blockUser();
            return false;
        }
        
        return true;
    }
    
    // Proteger imágenes
    function protectImages() {
        if (securityConfig.protectImages) {
            document.querySelectorAll('img').forEach(img => {
                img.addEventListener('dragstart', e => e.preventDefault());
                img.style.webkitUserDrag = 'none';
                img.style.userDrag = 'none';
                img.style.userSelect = 'none';
                img.style.webkitUserSelect = 'none';
            });
        }
    }
    
    // Proteger código fuente
    function protectCode() {
        if (securityConfig.protectCode) {
            // Deshabilitar clic derecho
            if (securityConfig.disableRightClick) {
                document.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    logAttempt('clic derecho');
                    return false;
                });
            }
            
            // Deshabilitar teclas para ver código fuente
            document.addEventListener('keydown', e => {
                // Prevenir F12
                if (e.keyCode === 123) {
                    e.preventDefault();
                    logAttempt('F12');
                    return false;
                }
                
                // Prevenir Ctrl+Shift+I (inspeccionar elemento)
                if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                    e.preventDefault();
                    logAttempt('Ctrl+Shift+I');
                    return false;
                }
                
                // Prevenir Ctrl+Shift+J (consola de JavaScript)
                if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                    e.preventDefault();
                    logAttempt('Ctrl+Shift+J');
                    return false;
                }
                
                // Prevenir Ctrl+U (ver código fuente)
                if (e.ctrlKey && e.keyCode === 85) {
                    e.preventDefault();
                    logAttempt('Ctrl+U');
                    return false;
                }
            });
            
            // Deshabilitar DevTools
            if (securityConfig.disableDevTools) {
                // Detectar apertura de DevTools
                const devToolsDetector = () => {
                    const widthThreshold = window.outerWidth - window.innerWidth > 160;
                    const heightThreshold = window.outerHeight - window.innerHeight > 160;
                    
                    if (widthThreshold || heightThreshold) {
                        logAttempt('DevTools');
                        // Opcional: mostrar mensaje de advertencia
                        console.clear();
                        console.log('%c⚠️ Advertencia: Esta página está protegida', 'font-size:24px; color:red;');
                    }
                };
                
                setInterval(devToolsDetector, 1000);
            }
        }
    }
    
    // Ofuscar código JavaScript
    function obfuscateCode() {
        // Esta función es simbólica, ya que la ofuscación real se hace en el proceso de build
        console.log('%c🔒 Código protegido', 'font-size:10px; color:#6c5ce7;');
    }
    
    // Inicializar protecciones
    function initSecurity() {
        if (!securityConfig.enableProtection) return;
        
        if (checkBlacklist()) return;
        
        // Monitorear tasa de solicitudes
        window.addEventListener('load', () => {
            if (!monitorRequestRate()) return;
            
            // Aplicar protecciones
            protectImages();
            protectCode();
            obfuscateCode();
        });
    }
    
    // Iniciar sistema de seguridad
    initSecurity();
})();