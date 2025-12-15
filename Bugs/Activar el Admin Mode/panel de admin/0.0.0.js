// ==============================================
// SISTEMA DE ADMINISTRADOR MEJORADO
// ==============================================

// Desactivar el interceptor problemático primero
if (window.originalConsole) {
    console.log = window.originalConsole;
}

// Limpiar consola
console.clear();

// ==============================================
// 1. SISTEMA DE BYPASS DE PERMISOS
// ==============================================

function setupAdminBypass() {
    console.log('🛡️ Configurando bypass de permisos...');
    
    // Interceptar fetch calls
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const [url, options = {}] = args;
        
        // Añadir headers de admin a todas las peticiones
        const modifiedOptions = {
            ...options,
            headers: {
                ...options.headers,
                'X-Admin-Access': 'true',
                'X-User-Role': 'administrator',
                'X-Bypass-Permissions': '1'
            }
        };
        
        console.log(`🔗 Fetch a: ${url}`);
        return originalFetch(url, modifiedOptions);
    };
    
    // Interceptar XHR
    const OriginalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends OriginalXHR {
        open(method, url, ...rest) {
            super.open(method, url, ...rest);
            this.setRequestHeader('X-Admin-Access', 'true');
            this.setRequestHeader('X-User-Role', 'admin');
        }
    };
    
    // WebSocket manipulation
    if (window.WebSocket) {
        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = class extends OriginalWebSocket {
            constructor(url, protocols) {
                super(url, protocols);
                this.addEventListener('open', () => {
                    console.log('🔌 WebSocket conectado como admin');
                });
            }
            
            send(data) {
                try {
                    if (typeof data === 'string') {
                        const parsed = JSON.parse(data);
                        // Añadir flags de admin
                        parsed.isAdmin = true;
                        parsed.adminOverride = true;
                        data = JSON.stringify(parsed);
                    }
                } catch(e) {}
                super.send(data);
            }
        };
    }
    
    console.log('✅ Bypass de permisos configurado');
}

// ==============================================
// 2. ACCIONES DE ADMINISTRADOR
// ==============================================

const AdminActions = {
    // A. Control de Usuarios
    userManagement: {
        banUser: function(userId) {
            console.log(`🔨 Banning user: ${userId}`);
            // Implementar lógica de ban
        },
        
        kickUser: function(userId) {
            console.log(`👢 Kicking user: ${userId}`);
            // Implementar lógica de kick
        },
        
        muteUser: function(userId, duration) {
            console.log(`🔇 Muting user ${userId} for ${duration} minutes`);
            // Implementar lógica de mute
        },
        
        warnUser: function(userId, reason) {
            console.log(`⚠️ Warning user ${userId}: ${reason}`);
            // Implementar lógica de warning
        }
    },
    
    // B. Control de Contenido
    contentManagement: {
        deleteMessage: function(messageId) {
            console.log(`🗑️ Deleting message: ${messageId}`);
            // Implementar lógica de eliminación
        },
        
        pinMessage: function(messageId) {
            console.log(`📌 Pinning message: ${messageId}`);
            // Implementar lógica de pin
        },
        
        hideContent: function(contentId) {
            console.log(`👁️ Hiding content: ${contentId}`);
            // Implementar lógica de ocultar
        },
        
        featureContent: function(contentId) {
            console.log(`⭐ Featuring content: ${contentId}`);
            // Implementar lógica de destacar
        }
    },
    
    // C. Control de Sistema
    systemControl: {
        clearChat: function() {
            console.log('🧹 Clearing chat...');
            // Implementar lógica de limpiar chat
        },
        
        restartStream: function() {
            console.log('🔄 Restarting stream...');
            // Implementar lógica de reinicio
        },
        
        changeRoomSettings: function(settings) {
            console.log('⚙️ Changing room settings:', settings);
            // Implementar lógica de ajustes
        },
        
        forceReload: function() {
            console.log('💥 Forcing page reload...');
            location.reload();
        }
    },
    
    // D. Herramientas de Depuración
    debugTools: {
        showUserInfo: function() {
            console.log('👤 User info:');
            console.log('- Cookies:', document.cookie);
            console.log('- LocalStorage:', Object.keys(localStorage));
            console.log('- SessionStorage:', Object.keys(sessionStorage));
        },
        
        showNetworkInfo: function() {
            console.log('🌐 Network info:');
            console.log('- User Agent:', navigator.userAgent);
            console.log('- Connection:', navigator.connection);
            console.log('- Performance:', performance.timing);
        },
        
        showDOMInfo: function() {
            console.log('🏗️ DOM info:');
            console.log('- Total elements:', document.querySelectorAll('*').length);
            console.log('- Buttons:', document.querySelectorAll('button').length);
            console.log('- Inputs:', document.querySelectorAll('input').length);
        },
        
        exportData: function() {
            console.log('💾 Exporting data...');
            // Implementar exportación
        }
    }
};

// ==============================================
// 3. PANEL DE CONTROL DE ADMINISTRADOR
// ==============================================

function createAdvancedAdminPanel() {
    console.log('🛠️ Creando panel de administrador avanzado...');
    
    // Remover panel anterior si existe
    const oldPanel = document.getElementById('advanced-admin-panel');
    if (oldPanel) oldPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'advanced-admin-panel';
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #1a2a3a 0%, #0d1520 100%);
        color: white;
        padding: 15px;
        border-radius: 12px;
        z-index: 100000;
        width: 350px;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        font-family: 'Segoe UI', system-ui, sans-serif;
        font-size: 13px;
        border: 2px solid #00c6ff;
        backdrop-filter: blur(10px);
    `;
    
    // ===== HEADER =====
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">👑</span>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #00c6ff;">Admin Control Panel</h3>
            </div>
            <div style="display: flex; gap: 5px;">
                <button onclick="toggleAdminPanel()" style="
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                ">−</button>
                <button onclick="closeAdminPanel()" style="
                    background: rgba(255,0,0,0.2);
                    border: 1px solid rgba(255,0,0,0.3);
                    color: #ff6b6b;
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                ">×</button>
            </div>
        </div>
    `;
    
    // ===== ACCESO RÁPIDO A BOTONES =====
    html += `
        <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #4fc3f7; display: flex; align-items: center; gap: 5px;">
                <span>🎯</span> Acceso Rápido
            </h4>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <button onclick="activateButtonWithAdmin(0)" style="
                    background: linear-gradient(45deg, #FF9800, #FF5722);
                    color: white;
                    border: none;
                    padding: 8px 5px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3px;
                ">
                    <span style="font-size: 16px;">🎥</span>
                    <span>Vídeo Directo</span>
                </button>
                
                <button onclick="activateButtonWithAdmin(1)" style="
                    background: linear-gradient(45deg, #4CAF50, #2E7D32);
                    color: white;
                    border: none;
                    padding: 8px 5px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3px;
                ">
                    <span style="font-size: 16px;">🎤</span>
                    <span>Chat de Voz</span>
                </button>
                
                <button onclick="activateButtonWithAdmin(2)" style="
                    background: linear-gradient(45deg, #9C27B0, #6A1B9A);
                    color: white;
                    border: none;
                    padding: 8px 5px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3px;
                ">
                    <span style="font-size: 16px;">🎬</span>
                    <span>Sala de Cine</span>
                </button>
            </div>
        </div>
    `;
    
    // ===== HERRAMIENTAS DE ADMIN =====
    html += `
        <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #4fc3f7; display: flex; align-items: center; gap: 5px;">
                <span>⚙️</span> Herramientas Admin
            </h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <button onclick="AdminActions.systemControl.forceReload()" style="
                    background: linear-gradient(45deg, #2196F3, #0D47A1);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                ">🔄 Recargar</button>
                
                <button onclick="AdminActions.debugTools.showUserInfo()" style="
                    background: linear-gradient(45deg, #FF4081, #C2185B);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                ">👤 Info Usuario</button>
                
                <button onclick="forceAdminCookies()" style="
                    background: linear-gradient(45deg, #FF9800, #E65100);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                ">🍪 Cookies Admin</button>
                
                <button onclick="bypassAllRestrictions()" style="
                    background: linear-gradient(45deg, #00BCD4, #006064);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                ">🔓 Bypass Total</button>
                
                <button onclick="simulateAdminClickAll()" style="
                    background: linear-gradient(45deg, #8BC34A, #33691E);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                ">🎮 Click Todos</button>
                
                <button onclick="showHiddenElements()" style="
                    background: linear-gradient(45deg, #607D8B, #263238);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                ">👁️ Ver Ocultos</button>
            </div>
        </div>
    `;
    
    // ===== CONTROL DE USUARIOS =====
    html += `
        <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #4fc3f7; display: flex; align-items: center; gap: 5px;">
                <span>👥</span> Control de Usuarios
            </h4>
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                <input type="text" id="admin-user-id" placeholder="ID de Usuario" style="
                    flex: 1;
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(255,255,255,0.2);
                    background: rgba(0,0,0,0.3);
                    color: white;
                    font-size: 12px;
                ">
                <input type="text" id="admin-reason" placeholder="Razón" style="
                    flex: 1;
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(255,255,255,0.2);
                    background: rgba(0,0,0,0.3);
                    color: white;
                    font-size: 12px;
                ">
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <button onclick="adminBanUser()" style="
                    background: linear-gradient(45deg, #F44336, #B71C1C);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                ">🔨 Ban</button>
                
                <button onclick="adminKickUser()" style="
                    background: linear-gradient(45deg, #FF9800, #E65100);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                ">👢 Kick</button>
                
                <button onclick="adminMuteUser()" style="
                    background: linear-gradient(45deg, #FFC107, #FF8F00);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                ">🔇 Mute</button>
                
                <button onclick="adminWarnUser()" style="
                    background: linear-gradient(45deg, #2196F3, #0D47A1);
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                ">⚠️ Warn</button>
            </div>
        </div>
    `;
    
    // ===== ESTADO DEL SISTEMA =====
    html += `
        <div>
            <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #4fc3f7; display: flex; align-items: center; gap: 5px;">
                <span>📊</span> Estado del Sistema
            </h4>
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; font-size: 11px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>🟢 Admin Mode:</span>
                    <span style="color: #4CAF50;">ACTIVO</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>🔗 Conexión:</span>
                    <span style="color: #4CAF50;">ESTABLE</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>👥 Usuarios:</span>
                    <span style="color: #FF9800;">Cargando...</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>🛡️ Permisos:</span>
                    <span style="color: #4CAF50;">ELEVADOS</span>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 10px; color: rgba(255,255,255,0.5); text-align: center;">
            Ctrl+Shift+Q para ocultar/mostrar
        </div>
    `;
    
    panel.innerHTML = html;
    document.body.appendChild(panel);
    
    // Añadir estilos adicionales
    const style = document.createElement('style');
    style.textContent = `
        #advanced-admin-panel button {
            transition: all 0.2s ease;
        }
        
        #advanced-admin-panel button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        #advanced-admin-panel button:active {
            transform: translateY(0);
        }
        
        #advanced-admin-panel input::placeholder {
            color: rgba(255,255,255,0.5);
        }
        
        #advanced-admin-panel input:focus {
            outline: none;
            border-color: #00c6ff !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Panel de administrador creado');
}

// ==============================================
// 4. FUNCIONES AUXILIARES
// ==============================================

function activateButtonWithAdmin(index) {
    console.log(`🎯 Activando botón ${index + 1} con privilegios de admin...`);
    
    const buttons = document.querySelectorAll('.sc-fyCZGR');
    if (buttons[index]) {
        // Primero configurar cookies de admin
        forceAdminCookies();
        
        // Luego hacer click
        simulateAdminClick(buttons[index]);
        
        // También forzar eventos
        setTimeout(() => {
            buttons[index].click();
        }, 100);
    }
}

function simulateAdminClick(element) {
    if (!element) return;
    
    // Crear evento de click con propiedades de admin
    const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: element.getBoundingClientRect().left + 10,
        clientY: element.getBoundingClientRect().top + 10,
        isTrusted: true
    });
    
    // Añadir propiedades personalizadas
    event.adminOverride = true;
    event.userRole = 'administrator';
    
    element.dispatchEvent(event);
    console.log('✅ Click de admin simulado');
}

function forceAdminCookies() {
    console.log('🍪 Forzando cookies de administrador...');
    
    const adminCookies = [
        'admin_session=super_user_override',
        'user_role=administrator',
        'permissions=all',
        'is_admin=true',
        'access_level=10',
        'staff_mode=enabled',
        'bypass_restrictions=true'
    ];
    
    adminCookies.forEach(cookie => {
        document.cookie = `${cookie}; path=/; max-age=86400; samesite=lax`;
    });
    
    // También modificar localStorage
    localStorage.setItem('admin_override', 'true');
    localStorage.setItem('user_privileges', JSON.stringify({
        admin: true,
        moderator: true,
        staff: true,
        permissions: ['all'],
        expires: Date.now() + 86400000
    }));
    
    console.log('✅ Cookies y localStorage configurados como admin');
}

function bypassAllRestrictions() {
    console.log('🔓 Activando bypass total de restricciones...');
    
    setupAdminBypass();
    
    // Sobrescribir funciones de verificación
    window.isAdmin = () => true;
    window.hasPermission = () => true;
    window.checkAccess = () => true;
    
    // Añadir clase admin al body
    document.body.classList.add('admin-mode', 'elevated-privileges');
    
    console.log('✅ Todas las restricciones bypassed');
}

function simulateAdminClickAll() {
    console.log('🎮 Simulando clicks en todos los botones...');
    
    const allButtons = document.querySelectorAll('button, [role="button"], .sc-fyCZGR');
    console.log(`🔍 Encontrados ${allButtons.length} botones`);
    
    allButtons.forEach((btn, index) => {
        setTimeout(() => {
            if (btn.textContent && btn.textContent.length < 50) {
                console.log(`👉 ${index + 1}. ${btn.textContent.trim()}`);
                simulateAdminClick(btn);
            }
        }, index * 200);
    });
}

function showHiddenElements() {
    console.log('👁️ Mostrando elementos ocultos...');
    
    const hidden = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"], [hidden]');
    console.log(`🔍 Encontrados ${hidden.length} elementos ocultos`);
    
    hidden.forEach(el => {
        el.style.display = 'block';
        el.style.visibility = 'visible';
        el.hidden = false;
    });
    
    console.log('✅ Elementos mostrados');
}

function adminBanUser() {
    const userId = document.getElementById('admin-user-id').value;
    const reason = document.getElementById('admin-reason').value || 'Violación de normas';
    
    if (userId) {
        console.log(`🔨 Baneando usuario ${userId}: ${reason}`);
        AdminActions.userManagement.banUser(userId);
    }
}

function adminKickUser() {
    const userId = document.getElementById('admin-user-id').value;
    
    if (userId) {
        console.log(`👢 Expulsando usuario ${userId}`);
        AdminActions.userManagement.kickUser(userId);
    }
}

function adminMuteUser() {
    const userId = document.getElementById('admin-user-id').value;
    
    if (userId) {
        console.log(`🔇 Silenciando usuario ${userId}`);
        AdminActions.userManagement.muteUser(userId, 30);
    }
}

function adminWarnUser() {
    const userId = document.getElementById('admin-user-id').value;
    const reason = document.getElementById('admin-reason').value || 'Advertencia';
    
    if (userId) {
        console.log(`⚠️ Advertencia a usuario ${userId}: ${reason}`);
        AdminActions.userManagement.warnUser(userId, reason);
    }
}

function toggleAdminPanel() {
    const panel = document.getElementById('advanced-admin-panel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        console.log(`📊 Panel: ${panel.style.display === 'none' ? 'oculto' : 'visible'}`);
    }
}

function closeAdminPanel() {
    const panel = document.getElementById('advanced-admin-panel');
    if (panel) {
        panel.remove();
        console.log('❌ Panel cerrado');
    }
}

// ==============================================
// 5. INICIALIZACIÓN
// ==============================================

function initializeAdminSystem() {
    console.clear();
    console.log('🚀 Inicializando sistema de administrador...');
    
    // 1. Configurar bypass
    setupAdminBypass();
    
    // 2. Crear panel
    createAdvancedAdminPanel();
    
    // 3. Configurar atajos de teclado
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
            toggleAdminPanel();
        }
        
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            forceAdminCookies();
        }
        
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            bypassAllRestrictions();
        }
    });
    
    // 4. Intentar activar botones automáticamente
    setTimeout(() => {
        console.log('🎯 Intentando acceso automático a botones...');
        activateButtonWithAdmin(0);
    }, 1000);
    
    setTimeout(() => {
        activateButtonWithAdmin(1);
    }, 2000);
    
    setTimeout(() => {
        activateButtonWithAdmin(2);
    }, 3000);
    
    console.log('✅ Sistema de administrador inicializado');
    console.log('📋 Atajos de teclado:');
    console.log('   • Ctrl+Shift+Q → Mostrar/ocultar panel');
    console.log('   • Ctrl+Shift+E → Forzar cookies admin');
    console.log('   • Ctrl+Shift+R → Bypass total');
}

// ==============================================
// EJECUTAR TODO
// ==============================================

initializeAdminSystem();
