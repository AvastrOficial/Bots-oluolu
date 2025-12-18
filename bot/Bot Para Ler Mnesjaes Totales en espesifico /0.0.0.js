// =============================================
// SCRIPT DEFINITIVO - CON COMANDO /admin
// =============================================

(function() {
    'use strict';
    
    console.log('🚀 Iniciando AvaStr Chat Scanner con comando /admin...');
    
    // Configuración
    const CONFIG = {
        scanInterval: 3000,
        autoResponse: true,
        debugMode: true,
        maxMessagesToAnalyze: 150,
        minUsernameLength: 2
    };
    
    // Variables
    let scannedMessages = new Map();
    let processedCommands = new Map();
    let userStats = new Map();
    let scanInterval = null;
    let isProcessing = false;
    let chatInputCache = null;
    let sendButtonCache = null;
    let messageContainerCache = null;
    let lastCommandTime = 0;
    const COMMAND_COOLDOWN = 5000;
    let lastCommandUser = '';
    
    // ==================== FUNCIONES DE LOG ====================
    
    function log(message, data = null, level = 'info') {
        if (!CONFIG.debugMode && level === 'debug') return;
        
        const timestamp = new Date().toLocaleTimeString();
        const emoji = {
            info: '📝',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            debug: '🔍'
        }[level] || '📝';
        
        console.log(`[${timestamp}] ${emoji} ${message}`, data || '');
    }
    
    function showNotification(message, type = 'info', duration = 3000) {
        const colors = {
            info: 'linear-gradient(135deg, #7761dd, #9b51e0)',
            success: 'linear-gradient(135deg, #4CAF50, #45a049)',
            warning: 'linear-gradient(135deg, #FF9800, #f57c00)',
            error: 'linear-gradient(135deg, #F44336, #d32f2f)'
        };
        
        document.querySelectorAll('.avastr-notification').forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = 'avastr-notification';
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
            animation: avastrNotifyIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            max-width: 380px;
            word-wrap: break-word;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.15);
        `;
        
        if (!document.querySelector('#avastr-notify-styles')) {
            const style = document.createElement('style');
            style.id = 'avastr-notify-styles';
            style.textContent = `
                @keyframes avastrNotifyIn {
                    0% { transform: translateX(100%) translateY(-20px) scale(0.9); opacity: 0; }
                    100% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
                }
                @keyframes avastrNotifyOut {
                    0% { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateX(100%) translateY(-20px) scale(0.9); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'avastrNotifyOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
    
    // ==================== DETECCIÓN ====================
    
    function findMessageContainer() {
        if (messageContainerCache) return messageContainerCache;
        
        const selectors = [
            '#vscroll.vscrollable',
            '.vscrollable',
            'div[style*="flex-direction: column-reverse"]',
            'div[class*="vscroll"]'
        ];
        
        for (const selector of selectors) {
            const container = document.querySelector(selector);
            if (container && container.querySelector('div[class*="sc-kpeGrT"]')) {
                messageContainerCache = container;
                return container;
            }
        }
        
        return null;
    }
    
    function findChatInput() {
        if (chatInputCache) return chatInputCache;
        
        const selectors = [
            '#editor-root .ql-editor',
            '[contenteditable="true"][data-placeholder*="Mensaje"]',
            '.ql-editor[contenteditable="true"]'
        ];
        
        for (const selector of selectors) {
            const input = document.querySelector(selector);
            if (input && input.isContentEditable) {
                chatInputCache = input;
                return input;
            }
        }
        
        return null;
    }
    
    function findSendButton() {
        if (sendButtonCache) return sendButtonCache;
        
        const classSelectors = [
            'button[class*="hzWAos"]',
            'button[class*="sc-ftDVim"]',
            'button[style*="background: url"]'
        ];
        
        for (const selector of classSelectors) {
            const button = document.querySelector(selector);
            if (button) {
                sendButtonCache = button;
                return button;
            }
        }
        
        return null;
    }
    
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
            
            const messageId = `msg_${username}_${hashString(content)}_${messageElement.innerHTML.length}`;
            
            return {
                id: messageId,
                username: username,
                content: content,
                isYou: isYou,
                element: messageElement,
                timestamp: Date.now(),
                isCommand: content.startsWith('/')
            };
        } catch (error) {
            return null;
        }
    }
    
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }
    
    // ==================== ESCANEO ====================
    
    function scanMessages() {
        if (isProcessing) return 0;
        isProcessing = true;
        
        const container = findMessageContainer();
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
                
                if (!userStats.has(messageData.username)) {
                    userStats.set(messageData.username, {
                        messageCount: 0,
                        lastMessage: '',
                        mentions: [],
                        isYou: messageData.isYou,
                        lastSeen: Date.now()
                    });
                }
                
                const userData = userStats.get(messageData.username);
                userData.messageCount++;
                userData.lastMessage = messageData.content;
                userData.lastSeen = Date.now();
                
                const mentions = messageData.content.match(/@(\w+)/g) || [];
                userData.mentions.push(...mentions.map(m => m.replace('@', '')));
                
                // DETECTAR COMANDOS /info Y /admin
                if (messageData.isCommand && !messageData.isYou) {
                    if (messageData.content.startsWith('/info') || messageData.content.startsWith('/admin')) {
                        const commandId = `${messageData.username}_${messageData.content}_${Math.floor(messageData.timestamp / 10000)}`;
                        const now = Date.now();
                        const lastProcessed = processedCommands.get(commandId) || 0;
                        
                        if (now - lastProcessed > 30000) {
                            newCommands.push(messageData);
                            processedCommands.set(commandId, now);
                            
                            for (const [cmdId, cmdTime] of processedCommands.entries()) {
                                if (now - cmdTime > 300000) processedCommands.delete(cmdId);
                            }
                        }
                    }
                }
                
                if (CONFIG.debugMode && messageData.content) {
                    console.log(`💬 ${messageData.username}: ${messageData.content.substring(0, 60)}...`);
                }
            }
        }
        
        updateMentionsReceived();
        
        if (newCommands.length > 0) {
            log(`🎯 ${newCommands.length} nuevo(s) comando(s) detectado(s)`, null, 'success');
            
            newCommands.forEach((cmd, index) => {
                setTimeout(() => {
                    processCommand(cmd);
                }, index * 1000);
            });
        }
        
        if (newMessages > 0) {
            log(`📊 ${newMessages} mensaje(s) nuevo(s)`, {total: scannedMessages.size, users: userStats.size}, 'info');
        }
        
        isProcessing = false;
        return newMessages;
    }
    
    function updateMentionsReceived() {
        userStats.forEach(userData => {
            userData.mentionsReceived = 0;
        });
        
        userStats.forEach((userData, username) => {
            userData.mentions.forEach(mentionedUser => {
                if (userStats.has(mentionedUser) && mentionedUser !== username) {
                    const mentionedUserData = userStats.get(mentionedUser);
                    mentionedUserData.mentionsReceived = (mentionedUserData.mentionsReceived || 0) + 1;
                }
            });
        });
    }
    
    // ==================== PROCESAMIENTO DE COMANDOS ====================
    
    function processCommand(messageData) {
        const content = messageData.content.trim();
        const username = messageData.username;
        
        log(`⚡ Procesando comando de ${username}: ${content}`, null, 'info');
        
        const now = Date.now();
        if (now - lastCommandTime < COMMAND_COOLDOWN && username === lastCommandUser) {
            log(`⏳ Cooldown activo para ${username}, omitiendo...`, null, 'warning');
            return;
        }
        
        // DETECTAR SI ES /admin O /info
        if (content.startsWith('/admin')) {
            processAdminCommand(username);
        } else if (content.startsWith('/info')) {
            processInfoCommand(content, username);
        }
        
        lastCommandTime = now;
        lastCommandUser = username;
    }
    
    function processAdminCommand(username) {
        log(`👑 Comando /admin detectado de ${username}`, null, 'success');
        
        const adminMessage = generateAdminMessage(username);
        sendToChat(adminMessage);
    }
    
    function processInfoCommand(content, username) {
        const parts = content.split(' ').filter(p => p.trim());
        if (parts.length < 2 || !parts[1].startsWith('@')) {
            log(`❌ Formato inválido: ${content}`, null, 'error');
            return;
        }
        
        const targetUserRaw = parts[1].substring(1);
        const targetUser = findBestUserMatch(targetUserRaw);
        
        if (!targetUser) {
            log(`❌ Usuario no encontrado: @${targetUserRaw}`, null, 'error');
            
            const availableUsers = Array.from(userStats.keys()).slice(0, 5);
            const response = `❌ Usuario **@${targetUserRaw}** no encontrado en el chat.\n\n📋 **Usuarios disponibles:**\n${availableUsers.map(u => `• ${u}`).join('\n')}\n\n💡 **Sugerencias:**\n• Verifica que el nombre sea correcto\n• El usuario debe haber enviado al menos un mensaje\n• Prueba con otro nombre de usuario\n\n🔍 *Escaneado por AvaStr Scanner*`;
            
            sendToChat(response);
            return;
        }
        
        const userData = userStats.get(targetUser);
        if (!userData) {
            log(`❌ Error: usuario encontrado pero sin datos: ${targetUser}`, null, 'error');
            return;
        }
        
        log(`✅ Analizando usuario: @${targetUser} (${userData.messageCount} mensajes)`, null, 'success');
        
        const response = generateUserInfoResponse(targetUser, userData);
        sendToChat(response);
    }
    
    function findBestUserMatch(searchUsername) {
        const searchLower = searchUsername.toLowerCase();
        const allUsers = Array.from(userStats.keys());
        
        for (const user of allUsers) {
            if (user.toLowerCase() === searchLower) {
                return user;
            }
        }
        
        for (const user of allUsers) {
            if (user.toLowerCase().includes(searchLower)) {
                return user;
            }
        }
        
        for (const user of allUsers) {
            if (user.toLowerCase().startsWith(searchLower)) {
                return user;
            }
        }
        
        const cleanSearch = searchLower.replace(/[^\w\s]/g, '');
        for (const user of allUsers) {
            const cleanUser = user.toLowerCase().replace(/[^\w\s]/g, '');
            if (cleanUser.includes(cleanSearch) || cleanSearch.includes(cleanUser)) {
                return user;
            }
        }
        
        return null;
    }
    
    // ==================== GENERACIÓN DE MENSAJES ====================
    
    function generateAdminMessage(requester) {
        const now = new Date();
        const time = now.toLocaleTimeString();
        const date = now.toLocaleDateString();
        
        const messages = [
            `👑 **¡ATENCIÓN A TODOS LOS MORTALES!** 👑\n\n` +
            `Acaba de ser invocado el comando sagrado **/admin** por **${requester}**\n\n` +
            `🌙 **LA DIOSA HA SIDO INVOCADA** 🌙\n\n` +
            `**Harley Queen, La Reina Eris** ha abierto sus ojos celestiales.\n` +
            `Su mirada atraviesa las pantallas y su risa resuena en el vacío digital.\n\n` +
            `⚠️ **ADVERTENCIA DIVINA:** ⚠️\n` +
            `• Ella pisa a cualquier cabrón que se le pase por encima\n` +
            `• Su atención no se mendiga, se gana\n` +
            `• No gasten energía en nombrarla en vano\n` +
            `• Su silencio es más elocuente que mil palabras\n\n` +
            `📜 **DECRETO DE LA REINA:** 📜\n` +
            `"Observo desde las sombras, juzgo en silencio.\n` +
            `Mi pisada es ley, mi risa es tormenta.\n` +
            `No me busquen, encontrarán lo que no esperan."\n\n` +
            `⏰ **Hora del llamado:** ${time}\n` +
            `📅 **Fecha del evento:** ${date}\n\n` +
            `⚡ *Este mensaje ha sido transmitido por la voluntad de Eris* ⚡\n` +
            `🎭 **Por: AvaStr Oracle** 🎭`,
            
            `🔥 **¡SE HA ACTIVADO EL PROTOCOLO ERIS!** 🔥\n\n` +
            `**${requester}** ha pronunciado la palabra prohibida... **/admin**\n\n` +
            `👠 **LA REINA DEL CAOS ESTÁ OBSERVANDO** 👠\n\n` +
            `En las profundidades del ciberespacio, una sonrisa se dibuja.\n` +
            `Harley Queen, diosa del caos digital, ha percibido tu llamado.\n\n` +
            `⚖️ **LEY DE ERIS:** ⚖️\n` +
            `"Mi pisada aplasta egos, mi risa desarma ejércitos.\n` +
            `No soy admin, SOY LA LEY que rige este espacio.\n` +
            `No me nombréis en vano, no desperdiciéis mi atención."\n\n` +
            `🎪 **MANIFIESTO DEL CAOS:** 🎪\n` +
            `• Su presencia es un privilegio, no un derecho\n` +
            `• Su silencio es enseñanza, su palabra es destino\n` +
            `• Pisará a quien ose subestimar su reinado\n` +
            `• Su atención es un fuego que pocos pueden soportar\n\n` +
            `🌌 **MENSAJE PARA ${requester.toUpperCase()}:** 🌌\n` +
            `"Has llamado a la tormenta. Ahora aguanta la lluvia.\n` +
            `Mi mirada está sobre ti. Demuestra que vales la pena."\n\n` +
            `⏳ **Registrado:** ${time} | ${date}\n\n` +
            `💀 *Transmitido desde el trono digital de Eris* 💀\n` +
            `🎪 **AvaStr Herald** 🎪`,
            
            `⚡ **¡LLAMADO A LA DIOSA DEL CAOS!** ⚡\n\n` +
            `El usuario **${requester}** ha invocado **/admin**\n` +
            `Las alarmas cósmicas han sonado en el palacio digital de Eris\n\n` +
            `👑 **HARLEY QUEEN, LA REINA ERIS** 👑\n` +
            `Se alza desde las profundidades del código\n` +
            `Su sombra se extiende sobre el chat\n` +
            `Su risa es un eco en el vacío\n\n` +
            `🚨 **EDICTO IMPERIAL:** 🚨\n` +
            `"Soy la tormenta que limpia, el caos que ordena.\n` +
            `Mi pisada deja marca, mi nombre inspira temor.\n` +
            `No soy una admin cualquiera, soy EL EQUILIBRIO."\n\n` +
            `📛 **PROCLAMACIÓN:** 📛\n` +
            `• Quien la subestima, cae\n` +
            `• Quien la respeta, sobrevive\n` +
            `• Quien la comprende, trasciende\n` +
            `• Quien la nombra sin causa, desaparece\n\n` +
            `🎯 **PARA EL ATREVIDO ${requester}:** 🎯\n` +
            `"Has tocado la puerta del templo.\n` +
            `La diosa ha escuchado tu llamado.\n` +
            `Ahora demuestra que no eres solo ruido."\n\n` +
            `⌛ **Momento del llamado:** ${time}\n` +
            `📆 **Era digital:** ${date}\n\n` +
            `🌪️ *Comunicado desde el ojo del huracán digital* 🌪️\n` +
            `🔮 **AvaStr Prophet** 🔮`
        ];
        
        // Seleccionar mensaje aleatorio
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }
    
    function generateUserInfoResponse(username, userData) {
        const isYou = userData.isYou;
        const messageCount = userData.messageCount;
        const mentionsReceived = userData.mentionsReceived || 0;
        const lastSeen = new Date(userData.lastSeen).toLocaleTimeString();
        
        const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
        const recentActivity = userData.lastSeen > thirtyMinutesAgo ? '✅ Activo recientemente' : '💤 Inactivo hace más de 30 min';
        
        let response = `👤 **@${username}** ${isYou ? '(Tú) ' : ''}\n`;
        response += '══════════════════════════\n\n';
        response += `📊 **ESTADÍSTICAS**\n`;
        response += `📨 Mensajes totales: **${messageCount}**\n`;
        response += `🕒 Última vez: **${lastSeen}**\n`;
        response += `📈 Estado: **${recentActivity}**\n\n`;
        
        response += `🤝 **INTERACCIÓN**\n`;
        response += `👉 Menciones recibidas: **${mentionsReceived}**\n`;
        response += `👈 Menciones dadas: **${userData.mentions.length}**\n\n`;
        
        response += `💬 **ANÁLISIS**\n`;
        
        if (isYou) {
            response += generateAnalysisForYou(messageCount, mentionsReceived);
        } else {
            response += generateAnalysisForOthers(messageCount, mentionsReceived);
        }
        
        response += '\n══════════════════════════\n';
        response += `🔍 **Escaneado por AvaStr Scanner**\n`;
        response += `📡 Chat total: ${scannedMessages.size} mensajes | ${userStats.size} usuarios`;
        
        return response;
    }
    
    function generateAnalysisForYou(messageCount, mentionsReceived) {
        let analysis = '';
        
        if (messageCount === 0) {
            analysis = '🤫 ¡Aún no has dicho nada! ¡Anímate a participar!';
        } else if (messageCount < 5) {
            analysis = '👋 ¡Bienvenido al chat! Veo que estás empezando.';
        } else if (messageCount < 20) {
            analysis = '😊 Buena participación. ¡Sigue contribuyendo!';
        } else if (messageCount < 50) {
            analysis = '💬 ¡Eres activo en el chat! Contribuyes bastante.';
        } else if (messageCount < 100) {
            analysis = '🔥 ¡TOP CONTRIBUIDOR! El chat no sería lo mismo sin ti.';
        } else {
            analysis = '👑 ¡LEYENDA DEL CHAT! ¿Tienes vida fuera de aquí? 😅';
        }
        
        if (mentionsReceived === 0 && messageCount > 10) {
            analysis += '\n💡 Pista: ¡Menciona a otros para generar conversación!';
        } else if (mentionsReceived > 10) {
            analysis += `\n⭐ ¡Eres popular! Te han mencionado ${mentionsReceived} veces.`;
        }
        
        return analysis;
    }
    
    function generateAnalysisForOthers(messageCount, mentionsReceived) {
        let analysis = '';
        
        if (messageCount === 0) {
            analysis = '👻 ¿Usuario fantasma? No ha enviado mensajes...';
        } else if (messageCount === 1) {
            analysis = '🗣️ Al menos dijo algo... ¡es un comienzo!';
        } else if (messageCount < 5) {
            analysis = '😶 Usuario tímido. Participa poco pero presente.';
        } else if (messageCount < 15) {
            analysis = '😊 Participación moderada. Buena contribución.';
        } else if (messageCount < 30) {
            analysis = '💬 ¡Usuario activo! Importante para el chat.';
        } else if (messageCount < 50) {
            analysis = '🔥 ¡PILAR DEL CHAT! Su presencia es clave.';
        } else {
            analysis = '👑 ¡LEYENDA VIVA! Este chat depende de ell@.';
        }
        
        if (mentionsReceived === 0 && messageCount > 10) {
            analysis += '\n🤔 Interesante... nadie le menciona pero participa mucho.';
        } else if (mentionsReceived > 15) {
            analysis += `\n🌟 ¡SUPER POPULAR! Todos le mencionan (${mentionsReceived}x).`;
        }
        
        return analysis;
    }
    
    // ==================== ENVÍO AL CHAT ====================
    
    function sendToChat(message) {
        return new Promise((resolve) => {
            setTimeout(async () => {
                try {
                    let chatInput = findChatInput();
                    let sendButton = findSendButton();
                    
                    if (!chatInput) {
                        log('❌ No se pudo encontrar el input del chat', null, 'error');
                        resolve(false);
                        return;
                    }
                    
                    chatInput.focus();
                    chatInput.click();
                    await wait(300);
                    
                    chatInput.innerHTML = '';
                    
                    const lines = message.split('\n');
                    lines.forEach((line, index) => {
                        const p = document.createElement('p');
                        p.textContent = line;
                        chatInput.appendChild(p);
                    });
                    
                    ['input', 'change'].forEach(eventType => {
                        chatInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                    });
                    
                    await wait(500);
                    
                    let sent = false;
                    
                    if (sendButton && !sendButton.disabled) {
                        sendButton.click();
                        sent = true;
                        log('✅ Mensaje enviado vía botón', null, 'success');
                    } else {
                        simulateEnterKey();
                        sent = true;
                        log('✅ Mensaje enviado vía Enter', null, 'success');
                    }
                    
                    if (sent) {
                        showNotification('✅ Mensaje enviado al chat', 'success', 2000);
                    }
                    
                    resolve(sent);
                    
                } catch (error) {
                    log('❌ Error al enviar mensaje:', error, 'error');
                    resolve(false);
                }
            }, 500);
        });
    }
    
    function simulateEnterKey() {
        const chatInput = findChatInput();
        if (!chatInput) return;
        
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        
        chatInput.dispatchEvent(enterEvent);
    }
    
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // ==================== CONTROL ====================
    
    function startScanner() {
        log('▶️ INICIANDO ESCÁNER...', null, 'success');
        
        if (scanInterval) {
            clearInterval(scanInterval);
        }
        
        processedCommands.clear();
        
        scanMessages();
        
        scanInterval = setInterval(() => {
            if (!isProcessing) {
                scanMessages();
            }
        }, CONFIG.scanInterval);
        
        showNotification('🔍 Escáner activado', 'success', 2000);
    }
    
    function stopScanner() {
        log('⏹️ DETENIENDO ESCÁNER...', null, 'warning');
        
        if (scanInterval) {
            clearInterval(scanInterval);
            scanInterval = null;
        }
        
        showNotification('✋ Escáner detenido', 'warning', 2000);
    }
    
    function showStats() {
        const totalMessages = scannedMessages.size;
        const totalUsers = userStats.size;
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 ESTADÍSTICAS DEL CHAT');
        console.log('='.repeat(60));
        console.log(`📨 Mensajes escaneados: ${totalMessages}`);
        console.log(`👥 Usuarios detectados: ${totalUsers}`);
        console.log(`🎯 Comandos procesados: ${processedCommands.size}`);
        console.log(`👑 Comando /admin disponible`);
        console.log('='.repeat(60));
        
        if (totalUsers > 0) {
            console.log('\n🏆 TOP 5 USUARIOS:');
            console.log('='.repeat(60));
            
            const sortedUsers = Array.from(userStats.entries())
                .sort((a, b) => b[1].messageCount - a[1].messageCount)
                .slice(0, 5);
            
            sortedUsers.forEach(([user, data], index) => {
                const youTag = data.isYou ? ' (Tú)' : '';
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
                console.log(`${medal} ${user}${youTag}: ${data.messageCount} mensajes`);
            });
        }
        
        console.log('='.repeat(60));
    }
    
    // ==================== PANEL DE CONTROL ====================
    
    function createControlPanel() {
        const existingPanel = document.getElementById('avastr-panel');
        if (existingPanel) existingPanel.remove();
        
        const panel = document.createElement('div');
        panel.id = 'avastr-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: rgba(20, 20, 30, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 18px;
            padding: 20px;
            z-index: 999997;
            color: white;
            font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 12px 48px rgba(0,0,0,0.4);
            border: 1px solid rgba(119, 97, 221, 0.3);
            min-width: 280px;
            animation: panelSlideUp 0.5s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes panelSlideUp {
                from { transform: translateY(100px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .avastr-btn {
                padding: 12px;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
                font-size: 14px;
                text-align: center;
                margin: 8px 0;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .avastr-btn:hover {
                transform: translateY(-2px);
            }
            
            .avastr-btn-primary {
                background: linear-gradient(135deg, #7761dd, #9b51e0);
                color: white;
            }
            
            .avastr-btn-secondary {
                background: rgba(255,255,255,0.1);
                color: white;
            }
            
            .avastr-btn-admin {
                background: linear-gradient(135deg, #FF416C, #FF4B2B);
                color: white;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
        
        panel.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-weight: bold; font-size: 18px; color: #7761dd; margin-bottom: 5px;">
                    🔍 AvaStr Scanner
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.7);">
                    CON COMANDO /admin
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; text-align: center;">
                <div style="background: rgba(255,255,255,0.08); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 11px;">📨 Msgs</div>
                    <div id="avastr-msg-count" style="font-size: 18px; font-weight: bold; color: #7761dd;">0</div>
                </div>
                <div style="background: rgba(255,255,255,0.08); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 11px;">👥 Users</div>
                    <div id="avastr-user-count" style="font-size: 18px; font-weight: bold; color: #7761dd;">0</div>
                </div>
                <div style="background: rgba(255,255,255,0.08); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 11px;">⚡ Status</div>
                    <div id="avastr-status" style="font-size: 18px; font-weight: bold; color: #4CAF50;">⏸️</div>
                </div>
            </div>
            
            <button class="avastr-btn avastr-btn-primary" id="avastr-start">
                ▶️ Iniciar Escáner
            </button>
            <button class="avastr-btn avastr-btn-secondary" id="avastr-stop">
                ⏹️ Detener Escáner
            </button>
            <button class="avastr-btn avastr-btn-secondary" id="avastr-stats">
                📊 Ver Stats
            </button>
            
            <button class="avastr-btn avastr-btn-admin" id="avastr-test-admin">
                👑 Probar /admin
            </button>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 11px; color: rgba(255,255,255,0.6);">
                    💡 <strong>Comandos disponibles:</strong><br>
                    • <code>/info @usuario</code> - Estadísticas<br>
                    • <code>/admin</code> - Invocar a la diosa<br>
                    <br>
                    ⚠️ <strong>Advertencia:</strong><br>
                    ¡La Reina Eris no se nombra en vano!
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        panel.querySelector('#avastr-start').addEventListener('click', startScanner);
        panel.querySelector('#avastr-stop').addEventListener('click', stopScanner);
        panel.querySelector('#avastr-stats').addEventListener('click', showStats);
        panel.querySelector('#avastr-test-admin').addEventListener('click', () => {
            const adminMessage = generateAdminMessage("TEST");
            sendToChat(adminMessage);
            showNotification('👑 Mensaje de la diosa enviado', 'info', 2000);
        });
        
        setInterval(() => {
            if (panel.parentNode) {
                panel.querySelector('#avastr-msg-count').textContent = scannedMessages.size;
                panel.querySelector('#avastr-user-count').textContent = userStats.size;
                panel.querySelector('#avastr-status').textContent = scanInterval ? '🟢' : '⏸️';
            }
        }, 1000);
    }
    
    // ==================== INICIALIZACIÓN ====================
    
    function initialize() {
        console.log('='.repeat(60));
        console.log('🚀 AVASTR SCANNER - CON COMANDO /admin');
        console.log('='.repeat(60));
        console.log('✅ Comandos disponibles:');
        console.log('• /info @usuario - Ver estadísticas');
        console.log('• /admin - Invocar a la diosa Harley Queen');
        console.log('='.repeat(60));
        
        createControlPanel();
        
        setTimeout(() => {
            startScanner();
            
            setTimeout(() => {
                console.log('\n👑 **COMANDO /admin DISPONIBLE** 👑');
                console.log('Cuando alguien escriba /admin en el chat:');
                console.log('1. El bot detectará automáticamente el comando');
                console.log('2. Enviará un mensaje épico sobre Harley Queen');
                console.log('3. La Reina Eris será invocada en el chat');
                console.log('\n⚡ **¡CUIDADO CON INVOCAR A LA DIOSA!** ⚡');
                console.log('='.repeat(60));
                
                // Enviar mensaje de bienvenida
                sendToChat(`🔮 **AvaStr Scanner activado**\n\n📊 **Comandos disponibles:**\n• \`/info @usuario\` - Ver estadísticas\n• \`/admin\` - Invocar a la diosa\n\n👑 **¡LA REINA ERIS VIGILA!** 👑\n══════════════════════════\nBy AvaStr Oracle`);
                
            }, 2000);
            
        }, 2000);
    }
    
    // ==================== API GLOBAL ====================
    
    window.AvaStr = {
        start: startScanner,
        stop: stopScanner,
        stats: showStats,
        testAdmin: () => {
            const adminMessage = generateAdminMessage("Usuario de Prueba");
            sendToChat(adminMessage);
        },
        forceInfo: (username) => {
            const targetUser = findBestUserMatch(username);
            if (targetUser && userStats.has(targetUser)) {
                const response = generateUserInfoResponse(targetUser, userStats.get(targetUser));
                sendToChat(response);
                return `✅ Análisis forzado para @${targetUser}`;
            } else {
                const availableUsers = Array.from(userStats.keys()).slice(0, 5);
                const response = `❌ Usuario **@${username}** no encontrado.\n\n📋 **Usuarios disponibles:**\n${availableUsers.map(u => `• ${u}`).join('\n')}`;
                sendToChat(response);
                return `❌ Usuario no encontrado`;
            }
        },
        getData: () => ({
            messages: scannedMessages.size,
            users: userStats.size,
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
