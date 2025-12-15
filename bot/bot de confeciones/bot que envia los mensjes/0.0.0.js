// ===========================================
// CONFIGURACIÓN
// ===========================================
const API_URL = 'https://693f70da12c964ee6b6fec61.mockapi.io/api/bsz/bot/guardadodedatos';
let mensajesEnviados = new Set();

// ===========================================
// FUNCIÓN PARA FORZAR ENVÍO DE UN MENSAJE
// ===========================================
function enviarMensajeForzado(mensajeTexto) {
    console.log('🔄 FORZANDO ENVÍO DEL MENSAJE...');
    
    // 1. LOCALIZAR ELEMENTOS
    const inputChat = document.querySelector('#editor-root .ql-editor.zdoc[contenteditable="true"]');
    const botonEnviar = document.querySelector('button.sc-gTTXEY.hMDGcf');
    
    if (!inputChat) {
        console.error('❌ No se encontró el input del chat');
        return false;
    }
    
    console.log('✅ Elementos encontrados');
    console.log('- Input:', inputChat ? '✓' : '✗');
    console.log('- Botón:', botonEnviar ? '✓' : '✗');
    
    // 2. ESCRIBIR EN EL INPUT (FORZADO)
    console.log('📝 Escribiendo mensaje en el input...');
    try {
        // Limpiar primero
        inputChat.innerHTML = '';
        
        // Crear párrafo con el mensaje
        const p = document.createElement('p');
        p.textContent = mensajeTexto;
        inputChat.appendChild(p);
        
        // Disparar TODOS los eventos posibles
        const eventos = ['input', 'change', 'keydown', 'keyup', 'keypress', 'click', 'focus', 'blur', 'compositionstart', 'compositionend', 'textInput'];
        
        eventos.forEach(evento => {
            try {
                inputChat.dispatchEvent(new Event(evento, { bubbles: true, cancelable: true }));
            } catch(e) {}
        });
        
        // Disparar en el padre también
        const editorRoot = document.getElementById('editor-root');
        if (editorRoot) {
            editorRoot.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        console.log('✅ Mensaje escrito y eventos disparados');
    } catch (error) {
        console.error('❌ Error al escribir:', error);
    }
    
    // 3. FORZAR HABILITACIÓN DEL BOTÓN
    if (botonEnviar) {
        console.log('🔧 Forzando habilitación del botón...');
        
        // Remover atributos de deshabilitación
        botonEnviar.removeAttribute('disabled');
        botonEnviar.removeAttribute('aria-disabled');
        
        // Modificar propiedades del DOM directamente
        botonEnviar.disabled = false;
        
        // Sobreescribir estilos CSS
        botonEnviar.style.cssText += `
            pointer-events: auto !important;
            opacity: 1 !important;
            cursor: pointer !important;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQwSURBVHgB7ZrLVdtAFIavTQ6HpelAVIBcAaYDvOGxAldAUoGhgkAFkBXPc0wqwKkA0oHTAWue+X/OKEdRxvKMZka2w3wb+TGyrV//3Dv3jkUikUgkEolEIpFIJBKJzBcN+QAMBoPk8fExxcO1RqPRenl5OdzZ2RmZnPtJ/jMgRgtidN7e3hKIQUE6eN7K3sfr0mw2N/Bw2eTz5logsvH8/JzCESkuehUXTzESvgdh3sdQEBfmRqBJYtgIgfH3pmMHVqBLy8v09fW1o8RIVQyxFkMHzv9hOnYmBGIQfXp6YtxYxdMOREjwuOVDDB0Qfmg6t4m7dHm8G31UJdWeoVQ2yFkMHzv9hOnYmBGIQfXp6YtxYxdMOREjwuOVDDB0Qfmg6tnaB8mJAALoizQdREkKUPEtLS7MxxQrp9R8xQguhA79j2O12H0zHexPIJL3OApheP23GVxKojvQaCjrIZryxQMwqOOy7pNdZYHFxcWgz3lggCDHAIZH55t4m/pCm6UDWMDLn2CxQO6wFgoN6OIxkSqjYcYijlQPy4Bq+iyXGAm1tbd0gA6xLjSJRDHznIeLGMpLBKV7qcwEpFcFnWTuoUrvj/Pz8CD9+XwJBt6iWxJDPkSCYHI7EjRFu8opYYuygPNvb25/xg7+42L1I3i2bm5vrmThXV1d9D+OYp/c/54kDZ2dnCax/Kw7ZreiWPBQHoh2IB/A5PXzHqVji3FFUK2de4V3Tc+gWiHKMmuhoXNrFtDqBc/bEE/jONpxZTwzSATcdwE39sjFlbsmg4ChmB1yQj8eEH+MOohFvPakdVPOxC0Zyo08PxWPML0jbm5IBbxW82yEQ6R1iPSVC0v8sGPY+srkXIqrxEnEP0OpyEzsavgI9mVUjT/v58qUYREcuM6rHH9IpXWQL5DGOzgEcw6pUn/lmZpA19fXu1ib3LqUDibYNOh1TEUglg7IbKdQA2YNeh21xyCVyu+kpt4S4o/TNdbuIK6FVFfgmwSmav2VZ5pTjOsl3Nk9FqcSENsGvY7gAjFTsejUvQehDrhGkUA9JgRoo0VqGcEF4s4HK3IWn4w/xfe5gFNTzvliithsEI4juEBYIa/xyMqczZmr5uIYNeW6nqecdYNeR3CB+MeD3FOWFHdw055uLKecr7au6/onI6hAyi1J4WUWsSclcWmoRHKaHj4yGAkqENwytm3BuHRxcVE25douU65Kg15HUIEMml7cur6FSNpxnHI4dMV+yt2b/gdxEqEdtGowLFlYWBjbrq2y3eRaoOYJHaQndQZHvHik+l7ZIDXlVkynHJYWXgI0CSaQ6vOMrdTZbcQWT7usP11EZbnepO0mOHIuHKR1D7MLXcO9tSrrFG7dwCFlq+9R1e6hjmACQYS/BOJd52ZjflOwKpxydB9dWHwPrznXV3lCOkiUPVDbPW24xnmHNIPu0+3w+qi/8gTtB2Xp29UxBt/DTNjHTfillgaRSCQSiUQskUhEIpFIJBKJRCKRSCQSiUQskUhEIpFIJBKJRCKRSCQSibwf/wEmPkhwD2g9/QAAAABJRU5ErkJggg==") center center / cover no-repeat !important;
        `;
        
        console.log('✅ Botón forzadamente habilitado');
    }
    
    // 4. EJECUTAR MÚLTIPLES MÉTODOS DE ENVÍO
    console.log('🚀 Ejecutando métodos de envío...');
    
    const metodosEnvio = [
        // Método 1: Click directo en botón
        () => {
            if (botonEnviar) {
                console.log('🖱️ Método 1: Click directo');
                botonEnviar.click();
            }
        },
        
        // Método 2: Eventos de mouse
        () => {
            if (botonEnviar) {
                console.log('🖱️ Método 2: Eventos Mouse');
                ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                    const event = new MouseEvent(eventType, {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                        buttons: 1
                    });
                    botonEnviar.dispatchEvent(event);
                });
            }
        },
        
        // Método 3: Enter en el input
        () => {
            console.log('⌨️ Método 3: Simular Enter');
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                metaKey: false
            });
            inputChat.dispatchEvent(enterEvent);
            
            // También keyup
            const enterUp = new KeyboardEvent('keyup', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            inputChat.dispatchEvent(enterUp);
        },
        
        // Método 4: Submit del formulario
        () => {
            console.log('📋 Método 4: Buscar y enviar formulario');
            const form = inputChat.closest('form');
            if (!form) {
                // Buscar cualquier formulario cerca
                const forms = document.querySelectorAll('form');
                forms.forEach(f => {
                    try {
                        f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                    } catch(e) {}
                });
            } else {
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        },
        
        // Método 5: Disparar evento personalizado
        () => {
            console.log('🎯 Método 5: Evento personalizado');
            const customEvent = new CustomEvent('send-message', {
                bubbles: true,
                detail: { message: mensajeTexto }
            });
            inputChat.dispatchEvent(customEvent);
        }
    ];
    
    // Ejecutar todos los métodos con delay
    metodosEnvio.forEach((metodo, index) => {
        setTimeout(() => {
            try {
                metodo();
                console.log(`✅ Método ${index + 1} ejecutado`);
            } catch (error) {
                console.log(`⚠️ Error en método ${index + 1}:`, error.message);
            }
        }, index * 200);
    });
    
    // 5. LIMPIAR DESPUÉS DE ENVIAR
    setTimeout(() => {
        console.log('🧹 Limpiando input...');
        try {
            inputChat.innerHTML = '<p><br></p>';
            inputChat.dispatchEvent(new Event('input', { bubbles: true }));
        } catch(e) {}
    }, 1500);
    
    console.log('✅ Todos los métodos programados');
    return true;
}

// ===========================================
// FUNCIÓN PARA OBTENER MENSAJES DE LA API
// ===========================================
async function obtenerMensajesAPI() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error('❌ Error API:', error);
        return [];
    }
}

// ===========================================
// FUNCIÓN PARA ENVIAR UN MENSAJE DE LA API
// ===========================================
async function enviarMensajeDesdeAPI(mensajeData) {
    const { id, mensaje, fecha, contador } = mensajeData;
    
    if (mensajesEnviados.has(id)) {
        console.log(`⏭️ Mensaje ${id} ya enviado`);
        return false;
    }
    
    console.log(`\n📨 PROCESANDO MENSAJE ${id}:`);
    console.log(`📝 ${mensaje.substring(0, 50)}${mensaje.length > 50 ? '...' : ''}`);
    console.log(`📅 ${fecha}`);
    console.log(`🔢 ${contador}`);
    
    const textoFormateado = `Mensaje anonimo #${contador}\nmensaje: ${mensaje}\nfecha: ${fecha}`;
    
    const exito = enviarMensajeForzado(textoFormateado);
    
    if (exito) {
        mensajesEnviados.add(id);
        console.log(`✅ Mensaje ${id} marcado como enviado`);
        return true;
    }
    
    return false;
}

// ===========================================
// FUNCIÓN PRINCIPAL - ENVIAR TODOS
// ===========================================
async function enviarTodosLosMensajes() {
    console.log('🚀 INICIANDO ENVÍO MASIVO');
    
    const mensajes = await obtenerMensajesAPI();
    
    if (mensajes.length === 0) {
        console.log('📭 API vacía');
        return;
    }
    
    const mensajesNuevos = mensajes.filter(m => !mensajesEnviados.has(m.id));
    
    console.log(`📊 Estadísticas:`);
    console.log(`Total: ${mensajes.length}`);
    console.log(`Ya enviados: ${mensajesEnviados.size}`);
    console.log(`Por enviar: ${mensajesNuevos.length}`);
    
    if (mensajesNuevos.length === 0) {
        console.log('🎯 Nada nuevo que enviar');
        return;
    }
    
    // Enviar con intervalos
    for (let i = 0; i < mensajesNuevos.length; i++) {
        const mensaje = mensajesNuevos[i];
        
        console.log(`\n════════════════════════════════════════`);
        console.log(`📤 [${i + 1}/${mensajesNuevos.length}] ENVIANDO...`);
        console.log(`════════════════════════════════════════`);
        
        await enviarMensajeDesdeAPI(mensaje);
        
        // Esperar entre mensajes
        if (i < mensajesNuevos.length - 1) {
            const espera = 5000; // 5 segundos
            console.log(`⏳ Esperando ${espera/1000}s...`);
            await new Promise(r => setTimeout(r, espera));
        }
    }
    
    console.log('\n🎉🎉🎉 ENVÍO COMPLETADO 🎉🎉🎉');
    console.log(`Total enviados: ${mensajesEnviados.size}`);
}

// ===========================================
// FUNCIONES DE CONTROL
// ===========================================
function verEstado() {
    console.log('📊 ESTADO ACTUAL:');
    console.log(`Mensajes en memoria: ${mensajesEnviados.size}`);
    console.log('IDs:', Array.from(mensajesEnviados));
}

function limpiarMemoria() {
    mensajesEnviados.clear();
    console.log('🧹 Memoria limpiada');
}

function probarEnvioRapido() {
    const texto = `Mensaje anonimo #999\nmensaje: Prueba rápida\nfecha: ${new Date().toISOString()}`;
    console.log('⚡ Probando envío rápido...');
    enviarMensajeForzado(texto);
}

// ===========================================
// INICIALIZACIÓN AUTOMÁTICA
// ===========================================
(async function() {
    console.log('🔧 INICIALIZANDO...');
    
    // Cargar mensajes existentes
    const mensajes = await obtenerMensajesAPI();
    mensajes.forEach(m => mensajesEnviados.add(m.id));
    
    console.log(`📋 ${mensajesEnviados.size} mensajes cargados de la API`);
    
    console.log(`
===========================================
🎮 COMANDOS DISPONIBLES:
===========================================
1. enviarTodosLosMensajes()  - Enviar todos los nuevos
2. probarEnvioRapido()       - Probar con mensaje de prueba
3. verEstado()               - Ver estado actual
4. limpiarMemoria()          - Limpiar memoria
5. enviarMensajeForzado("texto") - Forzar un mensaje
===========================================
    `);
    
    console.log('✅ Sistema listo. Ejecuta enviarTodosLosMensajes() para empezar');
})();

// ===========================================
// INICIAR AUTOMÁTICAMENTE (OPCIONAL)
// ===========================================
// Descomenta la siguiente línea para empezar automáticamente
// setTimeout(() => enviarTodosLosMensajes(), 3000);
