// Visualizador y guardador de mensajes con detección de contenido especial
(function() {
    console.log('🔍 Visualizador de chat activado...');
    console.log('🚨 Detector de contenido especial activado...');
    
    // URL de tu API MockAPI
    const API_URL = 'https://693f70da12c964ee6b6fec61.mockapi.io/api/bsz/bot/guardadodedatos';
    
    // Variables para control de mensajes
    let ultimosTextosProcesados = [];
    const MAX_HISTORIAL = 10;
    let contadorMensajes = 0;
    let primeraEjecucion = true;
    
    // Configuración de observación
    const config = { 
        childList: true, 
        subtree: true,
        characterData: true
    };
    
    // Seleccionar el contenedor principal
    const vscroll = document.querySelector('#vscroll.sc-dhCplO.jwkTSq.vscrollable');
    
    if (!vscroll) {
        console.error('❌ No se encontró el contenedor #vscroll');
        return;
    }
    
    // Funciones de detección de contenido especial
    const detectores = {
        // Detectar números de teléfono (10 dígitos consecutivos)
        telefono: function(texto) {
            const regex = /\b\d{10}\b/g;
            const matches = texto.match(regex);
            if (matches && matches.length > 0) {
                return {
                    tipo: 'telefono',
                    encontrado: true,
                    cantidad: matches.length,
                    valores: matches,
                    mensaje: `Contiene ${matches.length} número(s) de teléfono`
                };
            }
            return { tipo: 'telefono', encontrado: false };
        },
        
        // Detectar menciones con @
        mencion: function(texto) {
            const regex = /@(\w+)/g;
            const matches = texto.match(regex);
            if (matches && matches.length > 0) {
                return {
                    tipo: 'mencion',
                    encontrado: true,
                    cantidad: matches.length,
                    valores: matches,
                    mensaje: `Contiene ${matches.length} mención(es)`
                };
            }
            return { tipo: 'mencion', encontrado: false };
        },
        
        // Detectar URLs
        url: function(texto) {
            const regex = /https?:\/\/[^\s]+/gi;
            const matches = texto.match(regex);
            if (matches && matches.length > 0) {
                return {
                    tipo: 'url',
                    encontrado: true,
                    cantidad: matches.length,
                    valores: matches,
                    mensaje: `Contiene ${matches.length} URL(s)`
                };
            }
            return { tipo: 'url', encontrado: false };
        }
    };
    
    // Función para analizar contenido del mensaje
    function analizarContenido(texto) {
        const analisis = {
            contenido_especial: false,
            detectores: []
        };
        
        // Ejecutar todos los detectores
        for (const [nombre, detector] of Object.entries(detectores)) {
            const resultado = detector(texto);
            if (resultado.encontrado) {
                analisis.contenido_especial = true;
                analisis.detectores.push(resultado);
            }
        }
        
        return analisis;
    }
    
    // Función para normalizar texto
    function normalizarTexto(texto) {
        return texto.trim().replace(/\s+/g, ' ').toLowerCase();
    }
    
    // Función para verificar si un texto ya fue procesado
    function textoYaProcesado(textoNormalizado) {
        return ultimosTextosProcesados.includes(textoNormalizado);
    }
    
    // Función para agregar texto al historial
    function agregarAlHistorial(textoNormalizado) {
        ultimosTextosProcesados.unshift(textoNormalizado);
        if (ultimosTextosProcesados.length > MAX_HISTORIAL) {
            ultimosTextosProcesados.pop();
        }
    }
    
    // Función para guardar mensaje en la API
    async function guardarMensajeEnAPI(texto, textoNormalizado, analisis) {
        try {
            const mensajeData = {
                mensaje: texto,
                mensaje_normalizado: textoNormalizado,
                timestamp: new Date().toISOString(),
                fecha: new Date().toLocaleString('es-ES'),
                contador: ++contadorMensajes,
                contenido_especial: analisis.contenido_especial,
                detectores: analisis.detectores,
                advertencia: analisis.contenido_especial ? '⚠️ ESTE MENSAJE ROMPE LAS NORMAS' : null
            };
            
            // Mostrar información especial si hay contenido detectado
            if (analisis.contenido_especial) {
                console.log('🚨 ¡CONTENIDO ESPECIAL DETECTADO!');
                analisis.detectores.forEach(detector => {
                    console.log(`🔍 ${detector.mensaje}:`, detector.valores.join(', '));
                });
                console.log('📤 Enviando a API con advertencia...');
            } else {
                console.log('📤 Enviando a API...');
            }
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mensajeData)
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Mensaje guardado en API con ID:', data.id);
                
                // Mostrar resumen de lo que se guardó
                if (analisis.contenido_especial) {
                    console.log('🚨 JSON enviado incluía advertencia de contenido especial');
                }
                
                return true;
            } else {
                console.error('❌ Error al guardar en API:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            return false;
        }
    }
    
    // Función principal para procesar mensajes
    function procesarMensajes(esPrimeraEjecucion = false) {
        // Buscar todos los contenedores de mensajes
        const messageContainers = document.querySelectorAll('.sc-gtLWhw.jywoSP, .sc-gtLWhw.sc-bKrhu.jywoSP.hjwjal.long-press-selector');
        
        // Procesar de más reciente a más antiguo (invertir el array)
        const containersArray = Array.from(messageContainers);
        let mensajesProcesadosEnEstaEjecucion = 0;
        
        for (let i = containersArray.length - 1; i >= 0; i--) {
            const container = containersArray[i];
            
            // Buscar texto dentro del contenedor
            const textElements = container.querySelectorAll('.sc-kncOhb.dSsJuQ, .sc-dIaRMk.cNHXoo');
            
            for (const element of textElements) {
                if (element.textContent && element.textContent.trim() !== '') {
                    const texto = element.textContent.trim();
                    const textoNormalizado = normalizarTexto(texto);
                    
                    // En primera ejecución, solo registrar mensajes existentes
                    if (esPrimeraEjecucion) {
                        agregarAlHistorial(textoNormalizado);
                        
                        // Analizar contenido aunque sea primera ejecución (solo para mostrar)
                        const analisis = analizarContenido(texto);
                        if (analisis.contenido_especial) {
                            console.log('⚠️  Mensaje existente con contenido especial:');
                            console.log('📝 Texto:', texto.substring(0, 80) + (texto.length > 80 ? '...' : ''));
                            analisis.detectores.forEach(detector => {
                                console.log(`   🔍 ${detector.mensaje}`);
                            });
                        }
                        
                        mensajesProcesadosEnEstaEjecucion++;
                        if (mensajesProcesadosEnEstaEjecucion >= 5) break;
                    } 
                    // En ejecuciones normales, verificar si es nuevo y enviar
                    else if (!textoYaProcesado(textoNormalizado)) {
                        const analisis = analizarContenido(texto);
                        
                        console.log('💬 NUEVO MENSAJE IDENTIFICADO:');
                        console.log('📝 Texto:', texto);
                        
                        // Mostrar advertencia si tiene contenido especial
                        if (analisis.contenido_especial) {
                            console.log('🚨 ADVERTENCIA: Contenido especial detectado');
                        }
                        
                        // Guardar en API
                        guardarMensajeEnAPI(texto, textoNormalizado, analisis)
                            .then(guardado => {
                                if (guardado) {
                                    agregarAlHistorial(textoNormalizado);
                                }
                            });
                        
                        console.log('---');
                        mensajesProcesadosEnEstaEjecucion++;
                    }
                    
                    // Limitar a 2 mensajes por ejecución
                    if (!esPrimeraEjecucion && mensajesProcesadosEnEstaEjecucion >= 2) {
                        break;
                    }
                }
            }
            
            if (!esPrimeraEjecucion && mensajesProcesadosEnEstaEjecucion >= 2) {
                break;
            }
        }
        
        if (!esPrimeraEjecucion && mensajesProcesadosEnEstaEjecucion === 0) {
            console.log('👀 No se encontraron mensajes nuevos');
        }
    }
    
    // Observador de mutaciones
    const observer = new MutationObserver(function(mutations) {
        let mensajesAgregados = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && 
                        (node.matches?.('.sc-gtLWhw, .sc-gtLWhw *, .sc-kncOhb, .sc-dIaRMk') || 
                         node.querySelector?.('.sc-gtLWhw, .sc-kncOhb, .sc-dIaRMk'))) {
                        mensajesAgregados = true;
                    }
                });
            }
        });
        
        if (mensajesAgregados) {
            console.log('🔄 Cambios detectados en DOM...');
            setTimeout(() => procesarMensajes(false), 800);
        }
    });
    
    // Iniciar observación
    observer.observe(vscroll, config);
    
    // Primero: registrar mensajes existentes
    setTimeout(() => {
        console.log('📊 Registrando mensajes existentes...');
        procesarMensajes(true);
        primeraEjecucion = false;
        console.log('📚 Historial cargado:', ultimosTextosProcesados.length, 'mensajes');
        console.log('🎯 Listo para capturar nuevos mensajes');
    }, 2000);
    
    // Verificar periódicamente
    setInterval(() => {
        if (!primeraEjecucion) {
            procesarMensajes(false);
        }
    }, 3000);
    
    console.log('✅ Visualizador y detector iniciado correctamente');
    console.log('📡 API destino:', API_URL);
    console.log('🔍 Detectores activados:');
    console.log('   📱 Teléfonos (10 dígitos)');
    console.log('   @ Menciones');
    console.log('   🌐 URLs (http/https)');
    console.log('🔄 Escaneando cada 3 segundos...');
    
    // Función para probar los detectores (opcional)
    console.log('\n🧪 Ejemplos de detección:');
    console.log('   Teléfono: "Mi número es 1234567890" → detectado ✓');
    console.log('   Mención: "Hola @usuario" → detectado ✓');
    console.log('   URL: "Visita https://ejemplo.com" → detectado ✓');
})();
