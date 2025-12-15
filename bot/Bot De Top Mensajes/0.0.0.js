(function() {
    console.clear();
    console.log('🚀 AuraNet Bot - Comandos /top, /vistas y /g');
    
    // FILTRO DE CONSOLA
    (function() {
        const originalLog = console.log;
        console.log = function(...args) {
            const texto = args.join(' ');
            if (!/^ℹ️\[🌳\]|^\[WS\]|^export zdoc/.test(texto)) {
                originalLog.apply(console, args);
            }
        };
    })();
    
    // CONFIGURACIÓN PERSONALIZABLE
    const CONFIG = {
        intervalo: 1000,
        maxMensajesProcesados: 1000,
        // Configuración de personalidad para /g
        personalidades: {
            default: [
                "el rey del chat 👑",
                "el alma de la fiesta 🎉",
                "el crack indiscutible 💪",
                "el maestro de las palabras 🎭",
                "el héroe de este lugar 🦸",
                "el motor del chat 🚀",
                "el tesoro de esta comunidad 💎",
                "el faro que nos guía 🏮",
                "el corazón del grupo ❤️",
                "la leyenda viviente 🏆"
            ],
            // Puedes agregar personalidades específicas para usuarios conocidos
            especificas: {
                // Ejemplo: "JuanPerez": ["el admin supremo 👑", "el jefe de jefes 🎩"]
            }
        },
        // Mensajes de bienvenida automática
        bienvenidas: [
            "¡Hola @{usuario}! 😊 Bienvenid@ al chat, ¡esperamos que te diviertas mucho aquí! 🎉",
            "¡Hey @{usuario}! 👋 ¡Qué bueno verte por aquí! Prepárate para una gran conversación. 💬",
            "¡Bienvenid@ @{usuario}! 🌟 ¡El chat está más brillante con tu presencia! ✨",
            "¡Hola @{usuario}! 🎊 ¡Un nuevo miembro se une a la fiesta! ¡Disfruta tu estadía! 🥳",
            "¡Saludos @{usuario}! 🙌 ¡Qué gusto tenerte con nosotros! ¡No dudes en participar! 💪"
        ],
        // Tiempo mínimo entre respuestas automáticas (en segundos)
        cooldownBienvenida: 60,
        // Patrones para detectar saludos de nuevos usuarios
        patronesSaludo: ['hola a todos', 'hola', 'hello', 'hi', 'buenas', 'saludos', 'qué tal', 'presentación']
    };
    
    // DATOS
    let datos = {
        usuarios: new Map(),
        mensajesProcesados: new Map(),
        comandosRespondidos: new Map(),
        usuariosSaludados: new Map(),
        totalMensajes: 0,
        ultimoTimestamp: Date.now(),
        vistas: 0,
        ultimaActualizacionVistas: 0,
        ultimaBienvenida: 0
    };
    
    // FUNCIONES
    
    function iniciar() {
        console.log('✅ Bot listo - Comandos /top, /vistas y /g');
        
        cargarDatos();
        // NO actualizar vistas automáticamente al iniciar
        
        const intervalo = setInterval(monitorear, CONFIG.intervalo);
        const observer = new MutationObserver(() => monitorear());
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Eliminado el intervalo de actualización automática de vistas
        // Las vistas solo se actualizarán cuando alguien use /vistas
        
        window.control = {
            stop: () => {
                clearInterval(intervalo);
                observer.disconnect();
                console.log('🛑 Detenido');
            },
            test: () => {
                console.log('🧪 Probando...');
                enviarMensajeFinal('🤖 Bot funcionando - Comandos /top, /vistas y /g');
            },
            vistas: () => {
                console.log('👀 Vistas actuales:', datos.vistas);
                return datos.vistas;
            },
            config: CONFIG,
            datos: datos
        };
    }
    
    function monitorear() {
        try {
            const mensajes = document.querySelectorAll('.sc-fTmHRu.DGFUU');
            const mensajesArray = Array.from(mensajes);
            
            // Procesar solo mensajes nuevos (de atrás hacia adelante para los más recientes primero)
            for (let i = mensajesArray.length - 1; i >= 0; i--) {
                const msg = mensajesArray[i];
                const usuario = extraerUsuario(msg);
                const texto = extraerTexto(msg);
                
                if (!usuario || !texto) continue;
                
                // Crear ID único con timestamp aproximado
                const msgId = `${usuario}_${texto}_${i}`;
                
                // Si ya procesamos este mensaje recientemente, saltar
                if (datos.mensajesProcesados.has(msgId)) {
                    continue;
                }
                
                // Marcar como procesado con timestamp
                datos.mensajesProcesados.set(msgId, Date.now());
                
                // Actualizar estadísticas
                actualizarStats(usuario);
                
                // Verificar si es un nuevo usuario saludando
                verificarBienvenida(usuario, texto);
                
                // Procesar comando
                procesarMensaje(usuario, texto);
                
                // Guardar datos
                guardarDatos();
                
                // Solo procesar el mensaje más reciente
                break;
            }
            
            // Limpiar mensajes antiguos procesados
            limpiarProcesadosAntiguos();
            
        } catch(e) {
            console.error('Error en monitoreo:', e);
        }
    }
    
    function verificarBienvenida(usuario, texto) {
        const ahora = Date.now();
        const textoLower = texto.toLowerCase();
        
        // Verificar cooldown global
        if (ahora - datos.ultimaBienvenida < CONFIG.cooldownBienvenida * 1000) {
            return;
        }
        
        // Verificar si este usuario ya fue saludado recientemente (última hora)
        if (datos.usuariosSaludados.has(usuario)) {
            const ultimoSaludo = datos.usuariosSaludados.get(usuario);
            if (ahora - ultimoSaludo < 3600000) { // 1 hora
                return;
            }
        }
        
        // Verificar si es un mensaje de saludo
        const esSaludo = CONFIG.patronesSaludo.some(patron => 
            textoLower.includes(patron) && textoLower.split(' ').length < 10
        );
        
        // Verificar si el usuario tiene pocos mensajes (probablemente nuevo)
        const statsUsuario = datos.usuarios.get(usuario);
        const esUsuarioNuevo = statsUsuario && statsUsuario.mensajes <= 3;
        
        if (esSaludo && esUsuarioNuevo) {
            // Verificar si el usuario no es el bot
            if (usuario.toLowerCase().includes('aura') || usuario.toLowerCase().includes('bot')) {
                return;
            }
            
            // Seleccionar mensaje de bienvenida aleatorio
            const bienvenidaAleatoria = CONFIG.bienvenidas[
                Math.floor(Math.random() * CONFIG.bienvenidas.length)
            ];
            
            const mensaje = bienvenidaAleatoria.replace('@{usuario}', usuario);
            
            // Marcar como saludado
            datos.usuariosSaludados.set(usuario, ahora);
            datos.ultimaBienvenida = ahora;
            
            // Enviar bienvenida después de un delay
            setTimeout(() => {
                enviarMensajeFinal(mensaje);
                console.log(`👋 Bienvenida automática para ${usuario}`);
            }, 2000);
        }
    }
    
    function limpiarProcesadosAntiguos() {
        const ahora = Date.now();
        const cincoMinutos = 5 * 60 * 1000;
        const unaHora = 60 * 60 * 1000;
        
        // Limpiar mensajes procesados antiguos
        for (const [key, timestamp] of datos.mensajesProcesados.entries()) {
            if (ahora - timestamp > cincoMinutos) {
                datos.mensajesProcesados.delete(key);
            }
        }
        
        // Limpiar comandos respondidos antiguos
        for (const [key, timestamp] of datos.comandosRespondidos.entries()) {
            if (ahora - timestamp > cincoMinutos) {
                datos.comandosRespondidos.delete(key);
            }
        }
        
        // Limpiar usuarios saludados antiguos (más de 24 horas)
        for (const [usuario, timestamp] of datos.usuariosSaludados.entries()) {
            if (ahora - timestamp > 24 * 3600000) {
                datos.usuariosSaludados.delete(usuario);
            }
        }
        
        // Limitar tamaño de mensajes procesados
        if (datos.mensajesProcesados.size > CONFIG.maxMensajesProcesados) {
            const entries = Array.from(datos.mensajesProcesados.entries());
            entries.sort((a, b) => a[1] - b[1]);
            const toDelete = entries.slice(0, entries.length - CONFIG.maxMensajesProcesados);
            toDelete.forEach(([key]) => datos.mensajesProcesados.delete(key));
        }
    }
    
    function extraerUsuario(elem) {
        const elemUser = elem.querySelector('.sc-bLmarx.kBFHhQ');
        if (elemUser) {
            const nombre = elemUser.textContent?.trim();
            if (nombre && !nombre.includes('AuraNet')) return nombre;
        }
        return null;
    }
    
    function extraerTexto(elem) {
        const elemText = elem.querySelector('.sc-csgUpl.icHUe');
        if (elemText) return elemText.textContent?.trim();
        return null;
    }
    
    function actualizarStats(usuario) {
        if (!datos.usuarios.has(usuario)) {
            datos.usuarios.set(usuario, {
                mensajes: 1,
                primerMensaje: Date.now(),
                ultimoMensaje: Date.now(),
                ultimaInteraccion: Date.now()
            });
        } else {
            const stats = datos.usuarios.get(usuario);
            stats.mensajes++;
            stats.ultimoMensaje = Date.now();
            stats.ultimaInteraccion = Date.now();
        }
        datos.totalMensajes++;
        datos.ultimoTimestamp = Date.now();
    }
    
    function procesarMensaje(usuario, texto) {
        const comando = texto.trim().toLowerCase();
        const comandoId = `${usuario}_${comando}`;
        
        // Verificar si ya respondimos este comando recientemente
        if (datos.comandosRespondidos.has(comandoId)) {
            const timestamp = datos.comandosRespondidos.get(comandoId);
            const ahora = Date.now();
            if (ahora - timestamp < 10000) { // 10 segundos de cooldown
                return;
            }
        }
        
        // Comando /g @usuario
        if (comando.startsWith('/g @')) {
            // Extraer el nombre de usuario mencionado
            const mencion = texto.match(/\/g @(\S+)/i);
            if (mencion && mencion[1]) {
                const usuarioMencionado = mencion[1].trim();
                
                // Marcar como respondido con timestamp
                datos.comandosRespondidos.set(comandoId, Date.now());
                
                // Responder después de un pequeño delay
                setTimeout(() => enviarMensajeFinal(gMsg(usuario, usuarioMencionado)), 800);
            }
        }
        else if (comando === '/top') {
            // Marcar como respondido con timestamp
            datos.comandosRespondidos.set(comandoId, Date.now());
            
            // Responder después de un pequeño delay
            setTimeout(() => enviarMensajeFinal(topMsg()), 800);
        }
        else if (comando === '/vistas') {
            // Marcar como respondido con timestamp
            datos.comandosRespondidos.set(comandoId, Date.now());
            
            // SOLO aquí actualizar vistas antes de responder
            actualizarVistas();
            
            // Responder después de un pequeño delay
            setTimeout(() => enviarMensajeFinal(vistasMsg()), 800);
        }
        else if (comando === '/ayuda' || comando === '/help') {
            // Marcar como respondido con timestamp
            datos.comandosRespondidos.set(comandoId, Date.now());
            
            // Responder con ayuda
            setTimeout(() => enviarMensajeFinal(ayudaMsg()), 800);
        }
    }
    
    function gMsg(usuarioOrigen, usuarioDestino) {
        // Verificar si hay personalidad específica para este usuario
        let personalidad;
        
        if (CONFIG.personalidades.especificas[usuarioDestino]) {
            const personalidadesEspecificas = CONFIG.personalidades.especificas[usuarioDestino];
            personalidad = personalidadesEspecificas[
                Math.floor(Math.random() * personalidadesEspecificas.length)
            ];
        } else {
            // Usar personalidad aleatoria del conjunto default
            personalidad = CONFIG.personalidades.default[
                Math.floor(Math.random() * CONFIG.personalidades.default.length)
            ];
        }
        
        // Verificar si el usuario existe en el chat
        const statsUsuario = datos.usuarios.get(usuarioDestino);
        let infoAdicional = '';
        
        if (statsUsuario) {
            const horasEnChat = Math.floor((Date.now() - statsUsuario.primerMensaje) / 3600000);
            const puesto = obtenerPuestoUsuario(usuarioDestino);
            
            infoAdicional = `\n📊 Stats: ${statsUsuario.mensajes} mensajes | Posición #${puesto}`;
            
            if (horasEnChat < 24) {
                infoAdicional += ` | Recién llegad@ 🆕`;
            } else if (horasEnChat < 168) { // 1 semana
                infoAdicional += ` | Miembro activo ⭐`;
            } else {
                infoAdicional += ` | Veteran@ del chat 🏅`;
            }
        } else {
            infoAdicional = `\nℹ️ Este usuario aún no ha participado mucho en el chat.`;
        }
        
        return `🎭 **MENCIÓN ESPECIAL** 🎭\n\n` +
               `¡Hey ${usuarioDestino}! 👋\n` +
               `¡${usuarioOrigen} te ha mencionado y quiere que todos sepan que eres...\n\n` +
               `🔥 **${personalidad.toUpperCase()}** 🔥\n\n` +
               `¡Sigue así! Tu energía hace que este chat sea increíble. 💫` +
               infoAdicional;
    }
    
    function obtenerPuestoUsuario(usuario) {
        const usuariosArray = Array.from(datos.usuarios.entries());
        usuariosArray.sort((a, b) => b[1].mensajes - a[1].mensajes);
        
        for (let i = 0; i < usuariosArray.length; i++) {
            if (usuariosArray[i][0] === usuario) {
                return i + 1;
            }
        }
        return usuariosArray.length + 1;
    }
    
    function actualizarVistas() {
        try {
            // Buscar el elemento que contiene las vistas
            const elementosVistas = document.querySelectorAll('.sc-gtLWhw.eERmrg');
            
            // Buscar el número de vistas en estos elementos
            for (const elemento of elementosVistas) {
                // Verificar si este es el contenedor de vistas
                if (elemento.innerHTML.includes('img') && 
                    elemento.textContent && 
                    elemento.textContent.match(/\d+/)) {
                    
                    // Extraer el número del texto
                    const texto = elemento.textContent.trim();
                    const numero = parseInt(texto.match(/\d+/)?.[0] || '0');
                    
                    if (numero > 0) {
                        datos.vistas = numero;
                        datos.ultimaActualizacionVistas = Date.now();
                        console.log(`👀 Vistas actualizadas al usar /vistas: ${numero}`);
                        guardarDatos();
                        return true;
                    }
                }
            }
            
            // Método alternativo
            const todosDivs = document.querySelectorAll('div');
            for (const div of todosDivs) {
                const texto = div.textContent.trim();
                if (/^\d+$/.test(texto) && parseInt(texto) > 0 && parseInt(texto) < 1000) {
                    const parent = div.parentElement;
                    if (parent && parent.querySelector('img')) {
                        datos.vistas = parseInt(texto);
                        datos.ultimaActualizacionVistas = Date.now();
                        console.log(`👀 Vistas encontradas (alternativo): ${datos.vistas}`);
                        guardarDatos();
                        return true;
                    }
                }
            }
            
            console.log('⚠️ No se encontraron vistas al usar /vistas');
            return false;
            
        } catch (e) {
            console.error('Error actualizando vistas:', e);
            return false;
        }
    }
    
    function topMsg() {
        if (datos.usuarios.size === 0) {
            return '📊 No hay estadísticas aún.';
        }
        
        const usuariosArray = Array.from(datos.usuarios.entries());
        usuariosArray.sort((a, b) => b[1].mensajes - a[1].mensajes);
        const top = usuariosArray.slice(0, 10);
        
        let msg = '🏆 TOP 10 USUARIOS 🏆\n\n';
        
        top.forEach(([usuario, stats], i) => {
            const puesto = i + 1;
            const horasActivo = Math.floor((Date.now() - stats.primerMensaje) / 3600000);
            
            if (puesto === 1) msg += `🥇 ${usuario}: ${stats.mensajes} mensajes`;
            else if (puesto === 2) msg += `🥈 ${usuario}: ${stats.mensajes} mensajes`;
            else if (puesto === 3) msg += `🥉 ${usuario}: ${stats.mensajes} mensajes`;
            else msg += `${puesto}. ${usuario}: ${stats.mensajes} mensajes`;
            
            // Agregar info extra para los top 3
            if (puesto <= 3) {
                if (horasActivo < 24) {
                    msg += ` 🆕`;
                } else if (horasActivo < 168) {
                    msg += ` ⭐`;
                } else {
                    msg += ` 🏅`;
                }
            }
            
            msg += `\n`;
        });
        
        const total = Array.from(datos.usuarios.values())
            .reduce((sum, u) => sum + u.mensajes, 0);
        
        msg += `\n📈 Total: ${datos.usuarios.size} usuarios | ${total} mensajes`;
        msg += `\n\n👋 ¡Usa /g @[usuario] para dar un reconocimiento especial!`;
        
        return msg;
    }
    
    function vistasMsg() {
        // Las vistas ahora solo se actualizan cuando se usa el comando /vistas
        
        const ahora = Date.now();
        const diferencia = ahora - datos.ultimaActualizacionVistas;
        const minutos = Math.floor(diferencia / 60000);
        
        let msg = `👁️ **VISTAS EN VIVO** 👁️\n\n`;
        msg += `📊 **Total de vistas:** ${datos.vistas}\n`;
        
        if (datos.ultimaActualizacionVistas === 0) {
            msg += `🕒 Actualizado: Nunca (usa /vistas para actualizar)`;
        } else if (minutos < 1) {
            msg += `🕒 Actualizado: Hace unos segundos`;
        } else if (minutos === 1) {
            msg += `🕒 Actualizado: Hace 1 minuto`;
        } else if (minutos < 60) {
            msg += `🕒 Actualizado: Hace ${minutos} minutos`;
        } else {
            const horas = Math.floor(minutos / 60);
            msg += `🕒 Actualizado: Hace ${horas} horas`;
        }
        
        msg += `\n\n🔢 Comando: /vistas`;
        msg += `\n⚠️ Nota: Las vistas se actualizan solo cuando usas este comando`;
        
        return msg;
    }
    
    function ayudaMsg() {
        return `🤖 **COMANDOS DISPONIBLES** 🤖\n\n` +
               `🎭 **/g @[usuario]** - Da un reconocimiento especial a un usuario\n` +
               `📊 **/top** - Muestra el top 10 de usuarios más activos\n` +
               `👁️ **/vistas** - Muestra el número total de vistas en vivo\n` +
               `❓ **/ayuda** - Muestra esta información\n\n` +
               `✨ El bot también da la bienvenida automática a nuevos usuarios.`;
    }
    
    // ENVÍO FINAL
    function enviarMensajeFinal(texto) {
        console.log('📤 Intentando enviar respuesta');
        
        try {
            // 1. ENCONTRAR INPUT
            const input = document.querySelector('.ql-editor.zdoc.ql-blank[contenteditable="true"]');
            if (!input) {
                console.log('❌ Input no encontrado');
                return false;
            }
            
            // 2. ESCRIBIR EN EL INPUT
            input.focus();
            input.innerHTML = `<p>${texto}</p>`;
            
            // 3. DISPARAR EVENTO INPUT
            input.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText'
            }));
            
            // 4. ENVIAR DESPUÉS DE PEQUEÑO RETRASO
            setTimeout(() => {
                enviarMensajeForzado();
            }, 300);
            
            return true;
            
        } catch (error) {
            console.log('❌ Error al enviar:', error);
            return false;
        }
    }
    
    function enviarMensajeForzado() {
        console.log('🔄 Forzando envío...');
        
        // Método 1: Usar el botón específico
        const botonEnviar = document.querySelector('button.sc-gTTXEY.hMDGcf');
        if (botonEnviar) {
            console.log('✅ Botón de envío encontrado');
            
            // FORZAR HABILITACIÓN DEL BOTÓN
            botonEnviar.removeAttribute('disabled');
            botonEnviar.removeAttribute('aria-disabled');
            
            // FORZAR ESTILOS
            botonEnviar.style.cssText = `
                pointer-events: auto !important;
                opacity: 1 !important;
                cursor: pointer !important;
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQwSURBVHgB7ZrLVdtAFIavTQ6HpelAVIBcAaYDvOGxAldAUoGhgkAFkBXPc0wqwKkA0oHTAWue+X/OKEdRxvKMZka2w3wb+TGyrV//3Dv3jkUikUgkEolEIpFIJBKJzBcN+QAMBoPk8fExxcO1RqPRenl5OdzZ2RmZnPtJ/jMgRgtidN7e3hKIQUE6eN7K3sfr0mw2N/Bw2eTz5logsvH8/JzCESkuehUXTzESvgdh3sdQEBfmRqBJYtgIgfH3pmMHVqBLy8v09fW1o8RIVQyxFkMHzv9hOnYmBGIQfXp6YtxYxdMOREjwuOVDDB0Qfmg6tnaB8mJAALoizQdREkKUPEtLS7MxxQrp9R8xQguhA79j2O12H0zHexPIJL3OApheP23GVxKojvQaCjrIZryxQMwqOOy7pNdZYHFxcWgz3lggCDHAIZH55t4m/pCm6UDWMDLn2CxQO6wFgoN6OIxkSqjYcYijlQPy4Bq+iyXGAm1tbd0gA6xLjSJRDHznIeLGMpLBKV7qcwEpFcFnWTuoUrvj/Pz8CD9+XwJBt6iWxJDPkSCYHI7EjRFu8opYYuygPNvb25/xg7+42L1I3i2bm5vrmThXV1d9D+OYp/c/54kDZ2dnCax/Kw7ZreiWPBQHoh2IB/A5PXzHqVji3FFUK2de4V3Tc+gWiHKMmuhoXNrFtDqBc/bEE/jONpxZTwzSATcdwE39sjFlbsmg4ChmB1yQj8eEH+MOohFvPakdVPOxC0Zyo08PxWPML0jbm5IBbxW82yEQ6R1iPSVC0v8sGPY+srkXIqrxEnEP0OpyEzsavgI9mVUjT/v58qUYREcuM6rHH9IpXWQL5DGOzgEcw6pUn/lmZpA19fXu1ib3LqUDibYNOh1TEUglg7IbKdQA2YNeh21xyCVyu+kpt4S4o/TNdbuIK6FVFfgmwSmav2VZ5pTjOsl3Nk9FqcSENsGvY7gAjFTsejUvQehDrhGkUA9JgRoo0VqGcEF4s4HK3IWn4w/xfe5gFNTzvliithsEI4juEBYIa/xyMqczZmr5uIYNeW6nqecdYNeR3CB+MeD3FOWFHdw055uLKecr7au6/onI6hAyi1J4WUWsSclcWmoRHKaHj4yGAkqENwytm3BuHRxcVE25douU65Kg15HUIEMml7cur6FSNpxnHI4dMV+yt2b/gdxEqEdtGowLFlYWBjbrq2y3eRaoOYJHaQndQZHvHik+l7ZIDXlVkynHJYWXgI0CSaQ6vOMrdTZbcQWT7usP11EZbnepO0mOHIuHKR1D7MLXcO9tSrrFG7dwCFlq+9R1e6hjmACQYS/BOJd52ZjflOwKpxydB9dWHwPrznXV3lCOkiUPVDbPW24xnmHNIPu0+3w+qi/8gTtB2Xp29UxBt/DTNjHTfillgaRSCQSiUQskUhEIpFIJBKJRCKRSCQSiUQskUhEIpFIJBKJRCKRSCQSibwf/wEmPkhwD2g9/QAAAABJRU5ErkJggg==") center center / cover no-repeat !important;
            `;
            
            // Intentar múltiples métodos de clic
            const metodos = [
                () => botonEnviar.click(),
                () => {
                    const event = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    botonEnviar.dispatchEvent(event);
                },
                () => {
                    const eventos = ['mousedown', 'mouseup'];
                    eventos.forEach(eventType => {
                        const event = new MouseEvent(eventType, {
                            bubbles: true,
                            cancelable: true
                        });
                        botonEnviar.dispatchEvent(event);
                    });
                }
            ];
            
            // Ejecutar todos los métodos
            metodos.forEach((metodo, i) => {
                setTimeout(() => {
                    try {
                        metodo();
                        console.log(`✅ Método ${i + 1} ejecutado`);
                    } catch(e) {
                        console.log(`⚠️ Error método ${i + 1}:`, e.message);
                    }
                }, i * 100);
            });
            
            // Método alternativo: Simular Enter
            setTimeout(() => {
                const input = document.querySelector('.ql-editor.zdoc[contenteditable="true"]');
                if (input) {
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                    });
                    input.dispatchEvent(enterEvent);
                    console.log('✅ Evento Enter enviado');
                }
            }, 400);
            
        } else {
            console.log('❌ Botón no encontrado, usando Enter');
            
            // Último recurso: Simular Enter
            const input = document.querySelector('.ql-editor.zdoc[contenteditable="true"]');
            if (input) {
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                });
                input.dispatchEvent(enterEvent);
            }
        }
        
        // Limpiar input después de enviar
        setTimeout(() => {
            const input = document.querySelector('.ql-editor.zdoc[contenteditable="true"]');
            if (input) {
                input.innerHTML = '<p><br></p>';
                input.dispatchEvent(new Event('input', { bubbles: true }));
                console.log('🧹 Input limpiado');
            }
        }, 1000);
    }
    
    // PERSISTENCIA
    
    function cargarDatos() {
        try {
            const d = localStorage.getItem('aura_boton_config');
            if (d) {
                const p = JSON.parse(d);
                datos.usuarios = new Map(p.usuarios || []);
                datos.totalMensajes = p.totalMensajes || 0;
                datos.ultimoTimestamp = p.ultimoTimestamp || Date.now();
                datos.vistas = p.vistas || 0;
                datos.ultimaActualizacionVistas = p.ultimaActualizacionVistas || 0;
                datos.usuariosSaludados = new Map(p.usuariosSaludados || []);
                datos.ultimaBienvenida = p.ultimaBienvenida || 0;
            }
        } catch(e) {
            console.log('⚠️ Error cargando datos:', e);
        }
    }
    
    function guardarDatos() {
        try {
            const d = {
                usuarios: Array.from(datos.usuarios.entries()),
                totalMensajes: datos.totalMensajes,
                ultimoTimestamp: datos.ultimoTimestamp,
                vistas: datos.vistas,
                ultimaActualizacionVistas: datos.ultimaActualizacionVistas,
                usuariosSaludados: Array.from(datos.usuariosSaludados.entries()),
                ultimaBienvenida: datos.ultimaBienvenida,
                timestamp: Date.now()
            };
            localStorage.setItem('aura_boton_config', JSON.stringify(d));
        } catch(e) {
            console.log('⚠️ Error guardando datos:', e);
        }
    }
    
    // INICIAR
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                console.log('🔍 Iniciando bot...');
                iniciar();
            }, 2000);
        });
    } else {
        setTimeout(() => {
            console.log('🔍 Iniciando bot...');
            iniciar();
        }, 2000);
    }
    
})();
