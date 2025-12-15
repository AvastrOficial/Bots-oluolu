// Visualizador de mensajes - ENVIAR SOLO UNA VEZ POR MENSAJE
(function() {
    console.log('🚀 INICIANDO SISTEMA: 1 MENSAJE = 1 ENVÍO');
    
    // URL de tu API MockAPI
    const API_URL = 'https://693f70da12c964ee6b6fec61.mockapi.io/api/bsz/bot/guardadodedatos';
    
    // ALMACENAR MENSAJES QUE YA HEMOS VISTO
    const mensajesVistos = new Set();
    const mensajesEnviados = new Set();
    let procesando = false;
    
    // Seleccionar el contenedor principal
    const vscroll = document.querySelector('#vscroll.sc-dhCplO.jwkTSq.vscrollable');
    
    if (!vscroll) {
        console.error('❌ No se encontró el contenedor #vscroll');
        return;
    }
    
    // 1. PRIMERO: REGISTRAR MENSAJES EXISTENTES (sin enviar)
    console.log('📊 Registrando mensajes existentes...');
    
    const mensajesIniciales = document.querySelectorAll('.sc-gtLWhw .sc-kncOhb.dSsJuQ, .sc-gtLWhw .sc-dIaRMk.cNHXoo');
    
    mensajesIniciales.forEach((elemento, index) => {
        if (elemento.textContent && elemento.textContent.trim() !== '') {
            const texto = elemento.textContent.trim();
            const idMensaje = texto.toLowerCase().replace(/\s+/g, '_').substring(0, 100);
            
            // Solo registrar los últimos 10 mensajes
            if (index < 10) {
                mensajesVistos.add(idMensaje);
                console.log(`📝 Registrado: "${texto.substring(0, 50)}${texto.length > 50 ? '...' : ''}"`);
            }
        }
    });
    
    console.log(`✅ ${mensajesVistos.size} mensajes registrados (NO se enviarán)`);
    
    // 2. FUNCIÓN PARA CREAR ID ÚNICO DEL MENSAJE
    function crearIdMensaje(texto) {
        return texto.toLowerCase().trim().replace(/\s+/g, '_').substring(0, 100);
    }
    
    // 3. FUNCIÓN PARA DETECTAR CONTENIDO ESPECIAL
    function analizarMensaje(texto) {
        const analisis = {
            contenido_especial: false,
            detectores: [],
            advertencia: null
        };
        
        // Detectar teléfonos (10 dígitos)
        const telefonos = texto.match(/\b\d{10}\b/g);
        if (telefonos && telefonos.length > 0) {
            analisis.contenido_especial = true;
            analisis.detectores.push({
                tipo: 'telefono',
                cantidad: telefonos.length,
                valores: telefonos
            });
        }
        
        // Detectar menciones @
        const menciones = texto.match(/@(\w+)/g);
        if (menciones && menciones.length > 0) {
            analisis.contenido_especial = true;
            analisis.detectores.push({
                tipo: 'mencion',
                cantidad: menciones.length,
                valores: menciones
            });
        }
        
        // Detectar URLs
        const urls = texto.match(/https?:\/\/[^\s]+/gi);
        if (urls && urls.length > 0) {
            analisis.contenido_especial = true;
            analisis.detectores.push({
                tipo: 'url',
                cantidad: urls.length,
                valores: urls
            });
        }
        
        if (analisis.contenido_especial) {
            analisis.advertencia = '⚠️ ESTE MENSAJE ROMPE LAS NORMAS';
        }
        
        return analisis;
    }
    
    // 4. FUNCIÓN PARA ENVIAR A API (SOLO UNA VEZ)
    async function enviarMensajeUnaVez(texto) {
        if (procesando) {
            console.log('⏳ Ya se está procesando un mensaje, esperando...');
            return false;
        }
        
        procesando = true;
        const idMensaje = crearIdMensaje(texto);
        
        // DOBLE VERIFICACIÓN: ¿Ya enviamos este mensaje?
        if (mensajesEnviados.has(idMensaje)) {
            console.log(`🚫 Ya enviamos este mensaje antes: "${texto.substring(0, 50)}${texto.length > 50 ? '...' : ''}"`);
            procesando = false;
            return false;
        }
        
        // Analizar el mensaje
        const analisis = analizarMensaje(texto);
        
        console.log('🎯 ENVIANDO NUEVO MENSAJE (UNA SOLA VEZ):');
        console.log('📝 Texto:', texto);
        console.log('🔑 ID:', idMensaje);
        
        if (analisis.contenido_especial) {
            console.log('🚨 CONTENIDO ESPECIAL DETECTADO');
            analisis.detectores.forEach(d => {
                console.log(`   🔍 ${d.tipo}: ${d.valores.join(', ')}`);
            });
        }
        
        try {
            const mensajeData = {
                mensaje: texto,
                mensaje_id: idMensaje,
                timestamp: new Date().toISOString(),
                fecha: new Date().toLocaleString('es-ES'),
                contenido_especial: analisis.contenido_especial,
                detectores: analisis.detectores,
                advertencia: analisis.advertencia
            };
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mensajeData)
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // MARCA IMPORTANTE: Este mensaje YA FUE ENVIADO
                mensajesEnviados.add(idMensaje);
                console.log('✅ ENVIADO CON ÉXITO (UNA VEZ)');
                console.log(`   📌 ID en API: ${data.id}`);
                console.log(`   🔒 Marcado como enviado`);
                
                procesando = false;
                return true;
            } else {
                console.error('❌ Error al enviar:', response.status);
                procesando = false;
                return false;
            }
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            procesando = false;
            return false;
        }
    }
    
    // 5. FUNCIÓN PRINCIPAL: BUSCAR NUEVOS MENSAJES
    function buscarNuevosMensajes() {
        if (procesando) return;
        
        // Buscar TODOS los elementos de mensaje
        const elementosMensaje = document.querySelectorAll('.sc-gtLWhw .sc-kncOhb.dSsJuQ, .sc-gtLWhw .sc-dIaRMk.cNHXoo');
        
        // Recorrer de MÁS RECIENTE a MÁS ANTIGUO
        for (let i = elementosMensaje.length - 1; i >= 0; i--) {
            const elemento = elementosMensaje[i];
            
            if (elemento.textContent && elemento.textContent.trim() !== '') {
                const texto = elemento.textContent.trim();
                const idMensaje = crearIdMensaje(texto);
                
                // ¿Es un mensaje NUEVO que NO hemos visto antes?
                if (!mensajesVistos.has(idMensaje)) {
                    console.log('🎯 ENCONTRADO MENSAJE NUEVO:', texto.substring(0, 50) + (texto.length > 50 ? '...' : ''));
                    
                    // MARCA: Ya vimos este mensaje
                    mensajesVistos.add(idMensaje);
                    
                    // ENVIAR a API (solo una vez)
                    enviarMensajeUnaVez(texto);
                    
                    // Solo procesar UN mensaje por vez
                    return;
                }
            }
        }
        
        // Si llegamos aquí, no hay mensajes nuevos
        console.log('👀 No hay mensajes nuevos en este momento');
    }
    
    // 6. OBSERVADOR DE CAMBIOS (más simple)
    const observer = new MutationObserver(function(mutations) {
        let hayNuevosMensajes = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                hayNuevosMensajes = true;
            }
        });
        
        if (hayNuevosMensajes) {
            console.log('🔄 Cambios detectados, verificando en 1 segundo...');
            setTimeout(buscarNuevosMensajes, 1000);
        }
    });
    
    // 7. INICIAR OBSERVACIÓN
    observer.observe(vscroll, { childList: true, subtree: true });
    
    // 8. VERIFICACIÓN PERIÓDICA (cada 3 segundos)
    setInterval(buscarNuevosMensajes, 3000);
    
    console.log('✅ SISTEMA INICIADO CORRECTAMENTE');
    console.log('📡 API:', API_URL);
    console.log('🔒 REGLAS:');
    console.log('   1. Cada mensaje se envía EXACTAMENTE UNA VEZ');
    console.log('   2. Mensajes repetidos se IGNORAN');
    console.log('   3. Mensajes existentes NO se envían');
    console.log('   4. Escaneo cada 3 segundos');
    console.log('🎯 Listo para capturar mensajes NUEVOS...');
    
    // Primera verificación después de 2 segundos
    setTimeout(buscarNuevosMensajes, 2000);
})();
