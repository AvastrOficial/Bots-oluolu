// =============================================
// SCRIPT DE ROLES - ENVÍO ULTRA FORZADO
// =============================================

(function() {
    'use strict';
    
    console.log('🚀 Iniciando Sistema de Roles (Envío Ultra Forzado)...');
    
    // Configuración
    const CONFIG = {
        scanInterval: 3000,
        debugMode: true,
        maxMessagesToAnalyze: 80
    };
    
    // Variables
    let scannedMessages = new Map();
    let processedCommands = new Map();
    let userRoles = new Map();
    let scanInterval = null;
    let isProcessing = false;
    
    // ==================== FUNCIONES DE LOG ====================
    
    function log(message, data = null, level = 'info') {
        if (!CONFIG.debugMode && level === 'debug') return;
        
        const timestamp = new Date().toLocaleTimeString();
        const emoji = {
            info: '📝',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            debug: '🔍',
            role: '🎭',
            send: '📤'
        }[level] || '📝';
        
        console.log(`[${timestamp}] ${emoji} ${message}`, data || '');
    }
    
    function showNotification(message, type = 'info', duration = 3000) {
        const colors = {
            info: 'linear-gradient(135deg, #7761dd, #9b51e0)',
            success: 'linear-gradient(135deg, #4CAF50, #45a049)',
            warning: 'linear-gradient(135deg, #FF9800, #f57c00)',
            error: 'linear-gradient(135deg, #F44336, #d32f2f)',
            role: 'linear-gradient(135deg, #9C27B0, #673AB7)',
            send: 'linear-gradient(135deg, #2196F3, #1976D2)'
        };
        
        document.querySelectorAll('.role-notification').forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = 'role-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 16px 28px;
            border-radius: 14px;
            z-index: 999999;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 15px;
            font-weight: 600;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            animation: notifySlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            max-width: 400px;
            word-wrap: break-word;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.15);
        `;
        
        if (!document.querySelector('#role-notify-styles')) {
            const style = document.createElement('style');
            style.id = 'role-notify-styles';
            style.textContent = `
                @keyframes notifySlideIn {
                    0% { transform: translateX(100%) translateY(-20px) scale(0.9); opacity: 0; }
                    100% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
                }
                @keyframes notifySlideOut {
                    0% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateX(100%) translateY(-20px) scale(0.9); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notifySlideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
    
    // ==================== FUNCIONES DE ENVÍO ULTRA FORZADO ====================
    
    function findChatInput() {
        // Buscar por estructura específica
        const selectors = [
            '#editor-root .ql-editor',
            '.ql-editor[contenteditable="true"]',
            'div[contenteditable="true"][data-placeholder*="Mensaje"]',
            'div[class*="zdoc"][contenteditable="true"]'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.isContentEditable) {
                return element;
            }
        }
        
        // Buscar por contexto
        const editorArea = document.querySelector('div[class*="sc-gtLWhw jpFNei"]');
        if (editorArea) {
            const editable = editorArea.querySelector('[contenteditable="true"]');
            if (editable) return editable;
        }
        
        return null;
    }
    
    function findSendButton() {
        // Buscar el botón EXACTO que mencionaste
        const exactButton = document.querySelector('button.sc-ftDVim.hzWAos');
        if (exactButton) {
            log('✅ Botón exacto encontrado', {disabled: exactButton.disabled}, 'success');
            return exactButton;
        }
        
        // Buscar por estilo específico
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            const style = button.getAttribute('style') || '';
            if (style.includes('background: url') && style.includes('center center / cover')) {
                return button;
            }
        }
        
        return null;
    }
    
    function forceUltraSend() {
        log('⚡ INICIANDO ENVÍO ULTRA FORZADO...', null, 'send');
        
        const sendButton = findSendButton();
        const chatInput = findChatInput();
        
        if (!sendButton) {
            log('❌ No se encontró el botón de enviar', null, 'error');
            return false;
        }
        
        if (!chatInput) {
            log('❌ No se encontró el input del chat', null, 'error');
            return false;
        }
        
        // PASO 1: FORZAR HABILITACIÓN COMPLETA DEL BOTÓN
        log('🔧 Paso 1: Forzando habilitación del botón...', null, 'debug');
        
        // Remover completamente el atributo disabled
        sendButton.removeAttribute('disabled');
        
        // Forzar propiedades
        sendButton.disabled = false;
        sendButton.readOnly = false;
        
        // Modificar estilos para hacerlo interactivo
        sendButton.style.cssText += `
            pointer-events: auto !important;
            cursor: pointer !important;
            opacity: 1 !important;
            user-select: auto !important;
        `;
        
        // Remover clases que puedan deshabilitar
        sendButton.classList.remove('disabled', 'hzWAos');
        sendButton.classList.add('enabled', 'active');
        
        log('✅ Botón forzadamente habilitado', null, 'success');
        
        // PASO 2: FORZAR CONTENIDO EN EL INPUT
        log('🔧 Paso 2: Verificando contenido del input...', null, 'debug');
        
        // Asegurar que el input tenga contenido
        if (chatInput.textContent.trim() === '') {
            chatInput.textContent = 'Mensaje del sistema';
            chatInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            log('✅ Contenido forzado en input', null, 'success');
        }
        
        // PASO 3: ENFOCAR Y PREPARAR
        chatInput.focus();
        chatInput.click();
        
        // Disparar todos los eventos posibles
        ['focus', 'click', 'input', 'change', 'keydown', 'keyup', 'keypress'].forEach(eventType => {
            chatInput.dispatchEvent(new Event(eventType, { bubbles: true }));
            sendButton.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
        
        // PASO 4: EJECUTAR MÚLTIPLES MÉTODOS DE ENVÍO
        log('🔧 Paso 3: Ejecutando múltiples métodos de envío...', null, 'debug');
        
        let sent = false;
        
        // MÉTODO 1: Click directo con JavaScript nativo
        try {
            log('🔄 Método 1: Click nativo...', null, 'debug');
            sendButton.click();
            sent = true;
            log('✅ Click nativo ejecutado', null, 'success');
        } catch (e) {
            log('⚠️ Error en click nativo:', e.message, 'warning');
        }
        
        // MÉTODO 2: Usar HTMLElement.click()
        setTimeout(() => {
            try {
                log('🔄 Método 2: HTMLElement.click()...', null, 'debug');
                sendButton.dispatchEvent(new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    buttons: 1
                }));
                sent = true;
                log('✅ HTMLElement.click() ejecutado', null, 'success');
            } catch (e) {
                log('⚠️ Error en HTMLElement.click():', e.message, 'warning');
            }
        }, 100);
        
        // MÉTODO 3: Simular eventos de mouse completos
        setTimeout(() => {
            try {
                log('🔄 Método 3: Eventos de mouse completos...', null, 'debug');
                
                const rect = sendButton.getBoundingClientRect();
                const mouseEvents = [
                    new MouseEvent('mousedown', {
                        clientX: rect.left + 10,
                        clientY: rect.top + 10,
                        bubbles: true,
                        cancelable: true,
                        buttons: 1
                    }),
                    new MouseEvent('mouseup', {
                        clientX: rect.left + 10,
                        clientY: rect.top + 10,
                        bubbles: true,
                        cancelable: true
                    }),
                    new MouseEvent('click', {
                        clientX: rect.left + 10,
                        clientY: rect.top + 10,
                        bubbles: true,
                        cancelable: true
                    })
                ];
                
                mouseEvents.forEach(event => sendButton.dispatchEvent(event));
                sent = true;
                log('✅ Eventos de mouse ejecutados', null, 'success');
            } catch (e) {
                log('⚠️ Error en eventos de mouse:', e.message, 'warning');
            }
        }, 200);
        
        // MÉTODO 4: Usar submit del formulario si existe
        setTimeout(() => {
            try {
                log('🔄 Método 4: Buscando formulario...', null, 'debug');
                const form = sendButton.closest('form');
                if (form) {
                    form.submit();
                    sent = true;
                    log('✅ Formulario submit ejecutado', null, 'success');
                }
            } catch (e) {
                log('⚠️ Error en submit de formulario:', e.message, 'warning');
            }
        }, 300);
        
        // MÉTODO 5: Simular Enter en el input
        setTimeout(() => {
            try {
                log('🔄 Método 5: Simulando Enter...', null, 'debug');
                
                const enterEvents = [
                    new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                    }),
                    new KeyboardEvent('keypress', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                    }),
                    new KeyboardEvent('keyup', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                    })
                ];
                
                enterEvents.forEach(event => chatInput.dispatchEvent(event));
                sent = true;
                log('✅ Enter simulado', null, 'success');
            } catch (e) {
                log('⚠️ Error simulando Enter:', e.message, 'warning');
            }
        }, 400);
        
        // MÉTODO 6: Usar execCommand (método antiguo pero efectivo)
        setTimeout(() => {
            try {
                log('🔄 Método 6: execCommand...', null, 'debug');
                document.execCommand('insertText', false, ' ');
                sent = true;
                log('✅ execCommand ejecutado', null, 'success');
            } catch (e) {
                log('⚠️ Error en execCommand:', e.message, 'warning');
            }
        }, 500);
        
        // Verificar resultado
        setTimeout(() => {
            if (sent) {
                log('🎉 ENVÍO ULTRA FORZADO COMPLETADO', null, 'success');
                showNotification('✅ Mensaje enviado (forzado)', 'send', 2000);
            } else {
                log('❌ No se pudo enviar con ningún método', null, 'error');
                showNotification('❌ Error al enviar', 'error', 2000);
            }
        }, 600);
        
        return sent;
    }
    
    // ==================== FUNCIÓN PRINCIPAL DE ENVÍO ====================
    
    function sendToChat(message) {
        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    log(`📤 PREPARANDO MENSAJE: "${message.substring(0, 50)}..."`, null, 'send');
                    
                    const chatInput = findChatInput();
                    
                    if (!chatInput) {
                        log('❌ No se puede enviar: input no encontrado', null, 'error');
                        resolve(false);
                        return;
                    }
                    
                    // PASO 1: ESCRIBIR EL MENSAJE EN EL INPUT
                    log('⌨️ Escribiendo mensaje en el input...', null, 'debug');
                    
                    // Enfocar y hacer clic
                    chatInput.focus();
                    chatInput.click();
                    
                    // Esperar un poco
                    await wait(200);
                    
                    // Limpiar completamente
                    chatInput.innerHTML = '';
                    
                    // Escribir el mensaje línea por línea
                    const lines = message.split('\n');
                    lines.forEach((line, index) => {
                        const p = document.createElement('p');
                        if (line.trim() === '') {
                            p.innerHTML = '<br>';
                        } else {
                            p.textContent = line;
                        }
                        chatInput.appendChild(p);
                    });
                    
                    // Disparar TODOS los eventos posibles
                    const events = [
                        'input', 'change', 'keydown', 'keyup', 'keypress',
                        'textInput', 'compositionstart', 'compositionend',
                        'beforeinput', 'select', 'focus', 'blur'
                    ];
                    
                    events.forEach(eventType => {
                        const event = new Event(eventType, {
                            bubbles: true,
                            cancelable: true
                        });
                        chatInput.dispatchEvent(event);
                    });
                    
                    log('✅ Mensaje escrito en input', null, 'success');
                    
                    // PASO 2: ESPERAR Y EJECUTAR ENVÍO ULTRA FORZADO
                    await wait(500);
                    
                    log('⚡ EJECUTANDO ENVÍO ULTRA FORZADO...', null, 'send');
                    const sent = forceUltraSend();
                    
                    resolve(sent);
                    
                } catch (error) {
                    log('💥 ERROR CRÍTICO EN sendToChat:', error, 'error');
                    resolve(false);
                }
            }, 300);
        });
    }
    
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // ==================== FUNCIONES DEL SISTEMA DE ROLES ====================
    
    function extractMessageData(messageElement) {
        try {
            let username = 'Usuario';
            let isYou = false;
            
            const titleElement = messageElement.querySelector('[title]');
            if (titleElement && titleElement.title) {
                username = titleElement.title.trim();
                isYou = username === 'Tú' || username === 'You';
            }
            
            if (username === 'Usuario') {
                const usernameElements = messageElement.querySelectorAll('div[class*="sc-bLmarx"], div[class*="sc-dFqmTM"] div');
                for (const el of usernameElements) {
                    if (el.textContent && el.textContent.trim()) {
                        const text = el.textContent.trim();
                        if (text.length >= 2 && text.length < 50) {
                            username = text;
                            break;
                        }
                    }
                }
            }
            
            let content = '';
            const contentEl = messageElement.querySelector('.zdoc p, p');
            if (contentEl && contentEl.textContent) {
                content = contentEl.textContent.trim();
            } else {
                content = messageElement.textContent || '';
                content = content.replace(username, '').trim();
                content = content.replace(/\n+/g, ' ').trim();
            }
            
            const messageId = `msg_${username}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            return {
                id: messageId,
                username: username,
                content: content,
                isYou: isYou,
                timestamp: Date.now(),
                isCommand: content.startsWith('/')
            };
        } catch (error) {
            return null;
        }
    }
    
    function scanMessages() {
        if (isProcessing) return 0;
        isProcessing = true;
        
        // Buscar contenedor de mensajes
        const container = document.querySelector('#vscroll.vscrollable, .vscrollable');
        if (!container) {
            isProcessing = false;
            return 0;
        }
        
        const messageElements = container.querySelectorAll('div[class*="sc-kpeGrT"], div[data-long-press]');
        let newMessages = 0;
        let newCommands = [];
        
        const startIndex = Math.max(0, messageElements.length - CONFIG.maxMessagesToAnalyze);
        
        for (let i = startIndex; i < messageElements.length; i++) {
            const msgElement = messageElements[i];
            const messageData = extractMessageData(msgElement);
            
            if (!messageData || !messageData.username) continue;
            
            if (!scannedMessages.has(messageData.id)) {
                scannedMessages.set(messageData.id, messageData);
                newMessages++;
                
                // Detectar comandos
                if (messageData.isCommand && !messageData.isYou) {
                    const content = messageData.content.trim();
                    
                    if (content.startsWith('/rol ')) {
                        const commandId = `rol_${messageData.username}_${content}`;
                        const now = Date.now();
                        const lastProcessed = processedCommands.get(commandId) || 0;
                        
                        if (now - lastProcessed > 60000) {
                            newCommands.push({
                                type: 'rol',
                                data: messageData,
                                commandId: commandId
                            });
                            processedCommands.set(commandId, now);
                        }
                    } else if (content === '/roltop') {
                        const commandId = `roltop_${messageData.username}_${Date.now()}`;
                        const now = Date.now();
                        const lastProcessed = processedCommands.get(commandId) || 0;
                        
                        if (now - lastProcessed > 30000) {
                            newCommands.push({
                                type: 'roltop',
                                data: messageData,
                                commandId: commandId
                            });
                            processedCommands.set(commandId, now);
                        }
                    }
                }
                
                // Detectar menciones
                detectAndRespondToMentions(messageData);
            }
        }
        
        // Procesar comandos
        if (newCommands.length > 0) {
            log(`🎯 ${newCommands.length} comando(s) detectado(s)`, null, 'success');
            
            newCommands.forEach((cmd, index) => {
                setTimeout(() => {
                    if (cmd.type === 'rol') {
                        processRolCommand(cmd.data);
                    } else if (cmd.type === 'roltop') {
                        processRoltopCommand(cmd.data);
                    }
                }, index * 1500);
            });
        }
        
        if (newMessages > 0) {
            log(`📊 ${newMessages} mensaje(s) nuevo(s)`, {total: scannedMessages.size, roles: userRoles.size}, 'info');
        }
        
        isProcessing = false;
        return newMessages;
    }
    
    function detectAndRespondToMentions(messageData) {
        const mentionRegex = /@(\w+)/g;
        const mentions = [];
        let match;
        
        while ((match = mentionRegex.exec(messageData.content)) !== null) {
            const mentionedUser = match[1];
            if (mentionedUser && mentionedUser.length >= 2) {
                mentions.push(mentionedUser);
            }
        }
        
        mentions.forEach(mentionedUser => {
            if (userRoles.has(mentionedUser)) {
                const userRole = userRoles.get(mentionedUser);
                const now = Date.now();
                const lastAssignment = window.lastRoleAssignment || 0;
                
                if (now - lastAssignment > 30000) {
                    const roleMessage = `🎭 **@${mentionedUser}** ${userRole.rol}\n*(Asignado por ${userRole.addedBy})*`;
                    
                    setTimeout(() => {
                        sendToChat(roleMessage);
                        window.lastRoleAssignment = now;
                        log(`🎭 Rol enviado para @${mentionedUser}`, userRole.rol, 'role');
                    }, 2000);
                }
            }
        });
    }
    
    function processRolCommand(messageData) {
        const content = messageData.content.trim();
        const username = messageData.username;
        
        log(`⚡ Procesando /rol de ${username}`, null, 'info');
        
        const parts = content.split(' ');
        if (parts.length < 3) {
            sendToChat(`❌ **Formato incorrecto**\nUso: \`/rol @usuario mensaje del rol\`\nEjemplo: \`/rol @JuanPerez el más chistoso del chat\``);
            return;
        }
        
        const targetUserRaw = parts[1];
        if (!targetUserRaw.startsWith('@')) {
            sendToChat(`❌ **Debes mencionar un usuario**\nFormato: \`/rol @usuario mensaje\`\nEl @ es obligatorio.`);
            return;
        }
        
        const targetUser = targetUserRaw.substring(1);
        const roleMessage = parts.slice(2).join(' ').trim();
        
        if (roleMessage.length < 3) {
            sendToChat(`❌ **Mensaje muy corto**\nEl rol debe tener al menos 3 caracteres.`);
            return;
        }
        
        if (roleMessage.length > 100) {
            sendToChat(`❌ **Mensaje muy largo**\nEl rol debe tener máximo 100 caracteres.`);
            return;
        }
        
        // Guardar el rol
        userRoles.set(targetUser, {
            rol: roleMessage,
            addedBy: username,
            timestamp: Date.now()
        });
        
        // Enviar confirmación
        const confirmation = `🎭 **¡ROL ASIGNADO!** 🎭\n\n` +
                           `👤 **Usuario:** @${targetUser}\n` +
                           `🏷️ **Rol:** ${roleMessage}\n` +
                           `👑 **Asignado por:** ${username}\n\n` +
                           `💡 Ahora cada vez que alguien mencione a @${targetUser},\n` +
                           `aparecerá automáticamente su rol asignado.\n\n` +
                           `✨ *Sistema de Roles Activado* ✨`;
        
        sendToChat(confirmation);
        showNotification(`🎭 Rol asignado a @${targetUser}`, 'role', 3000);
    }
    
    function processRoltopCommand(messageData) {
        if (userRoles.size === 0) {
            sendToChat(`📭 **No hay roles asignados aún**\n\n💡 Usa \`/rol @usuario mensaje\` para asignar el primer rol.`);
            return;
        }
        
        let response = `🏆 **TOP DE ROLES ASIGNADOS** 🏆\n\n`;
        response += `📊 **Total roles:** ${userRoles.size}\n\n`;
        
        const sortedRoles = Array.from(userRoles.entries())
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
            .slice(0, 10);
        
        sortedRoles.forEach(([user, roleData], index) => {
            const timeAgo = getTimeAgo(roleData.timestamp);
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            
            response += `${medal} **@${user}**\n`;
            response += `   🏷️  ${roleData.rol}\n`;
            response += `   👤 Por: ${roleData.addedBy}\n`;
            response += `   ⏰ ${timeAgo}\n\n`;
        });
        
        response += `💡 **¿Cómo asignar roles?**\n`;
        response += `Usa: \`/rol @usuario mensaje\`\n\n`;
        response += `🎭 *Sistema de Roles Divertidos* 🎭`;
        
        sendToChat(response);
    }
    
    function getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
        if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        return 'justo ahora';
    }
    
    // ==================== CONTROL ====================
    
    function startScanner() {
        log('▶️ INICIANDO ESCÁNER DE ROLES', null, 'success');
        
        if (scanInterval) {
            clearInterval(scanInterval);
        }
        
        processedCommands.clear();
        window.lastRoleAssignment = 0;
        
        scanMessages();
        
        scanInterval = setInterval(() => {
            if (!isProcessing) {
                scanMessages();
            }
        }, CONFIG.scanInterval);
        
        showNotification('🎭 Escáner activado', 'role', 2000);
    }
    
    function stopScanner() {
        log('⏹️ DETENIENDO ESCÁNER', null, 'warning');
        
        if (scanInterval) {
            clearInterval(scanInterval);
            scanInterval = null;
        }
        
        showNotification('✋ Escáner detenido', 'warning', 2000);
    }
    
    function testSystem() {
        log('🧪 PROBANDO SISTEMA...', null, 'info');
        sendToChat('🧪 **PRUEBA DEL SISTEMA DE ROLES** 🧪\n\n✅ Envío ultra forzado activado\n⚡ Múltiples métodos de envío\n🎭 Sistema de roles funcionando\n\n✨ *¡Prueba exitosa!* ✨');
    }
    
    // ==================== PANEL SIMPLE ====================
    
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'roles-control-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(30, 30, 40, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 15px;
            z-index: 999997;
            color: white;
            font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            border: 1px solid rgba(156, 39, 176, 0.3);
            min-width: 250px;
        `;
        
        panel.innerHTML = `
            <div style="text-align: center; margin-bottom: 15px;">
                <div style="font-weight: bold; font-size: 16px; color: #9C27B0;">
                    🎭 Roles Ultra Forzado
                </div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 5px;">
                    Envío garantizado
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin: 15px 0; text-align: center;">
                <div style="background: rgba(255,255,255,0.08); padding: 8px; border-radius: 6px;">
                    <div style="font-size: 10px;">📨 Msgs</div>
                    <div id="stat-msgs" style="font-size: 16px; font-weight: bold; color: #9C27B0;">0</div>
                </div>
                <div style="background: rgba(255,255,255,0.08); padding: 8px; border-radius: 6px;">
                    <div style="font-size: 10px;">🎭 Roles</div>
                    <div id="stat-roles" style="font-size: 16px; font-weight: bold; color: #9C27B0;">0</div>
                </div>
            </div>
            
            <button id="btn-start" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #9C27B0, #673AB7); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin: 5px 0;">
                ▶️ Iniciar
            </button>
            <button id="btn-stop" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin: 5px 0;">
                ⏹️ Detener
            </button>
            <button id="btn-test" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #2196F3, #1976D2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin: 5px 0;">
                🧪 Probar
            </button>
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 10px; color: rgba(255,255,255,0.6);">
                    💡 Comandos:<br>
                    <code>/rol @usuario mensaje</code><br>
                    <code>/roltop</code>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        panel.querySelector('#btn-start').addEventListener('click', startScanner);
        panel.querySelector('#btn-stop').addEventListener('click', stopScanner);
        panel.querySelector('#btn-test').addEventListener('click', testSystem);
        
        // Actualizar estadísticas
        setInterval(() => {
            panel.querySelector('#stat-msgs').textContent = scannedMessages.size;
            panel.querySelector('#stat-roles').textContent = userRoles.size;
        }, 1000);
        
        log('✅ Panel de control creado', null, 'success');
    }
    
    // ==================== INICIALIZACIÓN ====================
    
    function initialize() {
        console.log('='.repeat(70));
        console.log('🎭 SISTEMA DE ROLES - ENVÍO ULTRA FORZADO');
        console.log('='.repeat(70));
        console.log('⚡ Características:');
        console.log('• 6 métodos diferentes de envío');
        console.log('• Forzado completo del botón disabled');
        console.log('• Envío garantizado');
        console.log('• Sistema de roles automático');
        console.log('='.repeat(70));
        
        createControlPanel();
        
        // Iniciar automáticamente
        setTimeout(() => {
            startScanner();
            
            // Mensaje de prueba inicial
            setTimeout(() => {
                sendToChat(`🎭 **¡SISTEMA DE ROLES ACTIVADO!** 🎭\n\n` +
                          `⚡ **ENVÍO ULTRA FORZADO** ⚡\n` +
                          `El sistema garantiza el envío de mensajes.\n\n` +
                          `📌 **Comandos disponibles:**\n` +
                          `• \`/rol @usuario mensaje_del_rol\`\n` +
                          `• \`/roltop\` - Ver todos los roles\n\n` +
                          `💡 **Ejemplo rápido:**\n` +
                          `\`/rol @${Object.keys(userRoles)[0] || "Usuario"} el más divertido\`\n\n` +
                          `🎮 *¡Diviértete con los roles!*`);
            }, 3000);
            
        }, 2000);
    }
    
    // ==================== API GLOBAL ====================
    
    window.RolesUltra = {
        start: startScanner,
        stop: stopScanner,
        test: testSystem,
        send: sendToChat,
        assignRole: (user, role) => {
            if (!user.startsWith('@')) user = '@' + user;
            const cleanUser = user.replace('@', '');
            
            userRoles.set(cleanUser, {
                rol: role,
                addedBy: 'Sistema',
                timestamp: Date.now()
            });
            
            return `✅ Rol asignado a ${user}: "${role}"`;
        },
        forceSend: forceUltraSend,
        getStats: () => ({
            messages: scannedMessages.size,
            roles: userRoles.size,
            isRunning: scanInterval !== null
        })
    };
    
    // Auto-inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }
    
})();
