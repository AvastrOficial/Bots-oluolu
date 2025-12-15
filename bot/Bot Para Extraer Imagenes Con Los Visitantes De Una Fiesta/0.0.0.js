// Script para extraer y enviar usuarios y vistas desde la consola
(function() {
    // Configuración
    const CONFIG = {
        delayEnvio: 2000  // Milisegundos antes de enviar
    };
    
    // Función principal para extraer y enviar datos
    function extraerYEnviar() {
        console.clear();
        console.log('🔍 Extrayendo y preparando para enviar...\n');
        
        // 1. EXTRAER DATOS
        const elementosAudiencia = document.querySelectorAll('.sc-kNwsoS.jtKjCr');
        let totalVistas = 0;
        
        elementosAudiencia.forEach(elemento => {
            const texto = elemento.textContent.trim();
            const match = texto.match(/Audiencia\s*\((\d+)\)/);
            if (match) {
                totalVistas = parseInt(match[1]);
                console.log(`✅ Total de Vistas: ${totalVistas}`);
            }
        });
        
        // Extraer usuarios
        const elementosUsuarios = document.querySelectorAll('.sc-cyUPVx');
        const datosUsuarios = [];
        let contador = 0;
        
        elementosUsuarios.forEach(elemento => {
            const nombreElemento = elemento.querySelector('.sc-bLmarx.gZLzRh');
            const usuarioElemento = elemento.querySelector('.sc-druKGx.gChIoG');
            const imagenElemento = elemento.querySelector('img.sc-bbQqnZ');
            
            if (nombreElemento && usuarioElemento) {
                const nombre = nombreElemento.textContent.trim();
                const usuario = usuarioElemento.textContent.trim();
                
                if (nombre && usuario) {
                    contador++;
                    const imagenUrl = imagenElemento ? imagenElemento.getAttribute('src') : null;
                    datosUsuarios.push({
                        numero: contador,
                        nombre: nombre,
                        usuario: usuario,
                        imagenUrl: imagenUrl
                    });
                }
            }
        });
        
        console.log(`✅ Usuarios encontrados: ${contador}\n`);
        
        // 2. CONSTRUIR MENSAJE (SOLO TEXTO, SIN HTML)
        let mensaje = `📊 **REPORTE DE SALA** 📊\n\n`;
        mensaje += `👁️ **Vistas Totales:** ${totalVistas}\n`;
        mensaje += `👥 **Usuarios en Sala:** ${contador}\n\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += `👤 **LISTA DE USUARIOS:**\n\n`;
        
        // Agregar cada usuario al mensaje (solo texto)
        datosUsuarios.forEach(user => {
            mensaje += `${user.numero}. **${user.nombre}**\n`;
            mensaje += `   📧 ${user.usuario}\n`;
            
            // Solo mostrar la URL de la imagen como texto, sin etiquetas HTML
            if (user.imagenUrl) {
                mensaje += `   🖼️ Imagen: ${user.imagenUrl}\n`;
            }
            
            mensaje += `\n`;
        });
        
        mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += `🕒 ${new Date().toLocaleString()}\n`;
        mensaje += `👨‍💻 Generado por Bsz - AvastrOficial`;
        
        // 3. MOSTRAR EN CONSOLA
        console.log('📝 **MENSAJE A ENVIAR:**\n');
        console.log(mensaje);
        console.log('\n━━━━━━━━━━━━━━━━━━━━');
        console.log(`📏 Longitud: ${mensaje.length} caracteres`);
        console.log(`⏱️  Enviando en ${CONFIG.delayEnvio/1000} segundos...\n`);
        
        // 4. ENVIAR AL CHAT
        setTimeout(() => {
            const enviado = enviarMensajeSimple(mensaje);
            if (enviado) {
                console.log('✅ **MENSAJE ENVIADO CORRECTAMENTE**');
                console.log('👉 Revisa el chat para ver el resultado');
            } else {
                console.log('❌ Error al enviar el mensaje');
            }
        }, CONFIG.delayEnvio);
        
        return {
            vistas: totalVistas,
            usuarios: contador,
            mensaje: mensaje,
            timestamp: new Date().toLocaleString()
        };
    }
    
    // Función SIMPLIFICADA para enviar mensaje
    function enviarMensajeSimple(texto) {
        console.log('🚀 Iniciando envío de mensaje...');
        
        try {
            // 1. ENCONTRAR EL INPUT
            const input = document.querySelector('.ql-editor.ql-blank.zdoc[contenteditable="true"]');
            if (!input) {
                console.log('❌ Input no encontrado, buscando alternativas...');
                // Intentar otros selectores
                const inputs = document.querySelectorAll('[contenteditable="true"]');
                if (inputs.length > 0) {
                    input = inputs[0];
                    console.log('✅ Input alternativo encontrado');
                } else {
                    return false;
                }
            } else {
                console.log('✅ Input encontrado');
            }
            
            // 2. ESCRIBIR EN EL INPUT (método más simple)
            input.focus();
            
            // Método 1: Usando textContent (más seguro para texto plano)
            input.textContent = texto;
            
            // 3. DISPARAR EVENTOS NECESARIOS
            const eventos = ['input', 'change', 'keydown', 'keyup'];
            eventos.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                input.dispatchEvent(event);
            });
            
            // 4. INTENTAR ENVIAR CON ENTER (método más confiable)
            setTimeout(() => {
                console.log('⌨️ Intentando enviar con Enter...');
                
                // Simular Ctrl+Enter o Enter
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true,
                    ctrlKey: false
                });
                
                input.dispatchEvent(enterEvent);
                
                // También disparar keyup
                setTimeout(() => {
                    const keyupEvent = new KeyboardEvent('keyup', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                    });
                    input.dispatchEvent(keyupEvent);
                    
                    // Intentar también con Ctrl+Enter
                    setTimeout(() => {
                        const ctrlEnterEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13,
                            bubbles: true,
                            cancelable: true,
                            ctrlKey: true
                        });
                        input.dispatchEvent(ctrlEnterEvent);
                        
                        console.log('✅ Eventos de teclado enviados');
                    }, 100);
                }, 100);
                
            }, 500);
            
            return true;
            
        } catch (error) {
            console.log('❌ Error al enviar:', error);
            return false;
        }
    }
    
    // Función para probar el envío con un mensaje simple
    function probarEnvio() {
        console.clear();
        console.log('🧪 Probando envío con mensaje simple...\n');
        
        const mensajePrueba = '🧪 Mensaje de prueba desde consola - Bsz - AvastrOficial';
        console.log(`Mensaje: "${mensajePrueba}"`);
        
        const resultado = enviarMensajeSimple(mensajePrueba);
        
        if (resultado) {
            console.log('✅ Prueba iniciada - revisa el chat');
        } else {
            console.log('❌ Error en la prueba');
        }
        
        return resultado;
    }
    
    // Función para solo extraer datos (sin enviar)
    function soloExtraer() {
        console.clear();
        console.log('🔍 Solo extrayendo datos (sin enviar)...\n');
        
        const elementosAudiencia = document.querySelectorAll('.sc-kNwsoS.jtKjCr');
        let totalVistas = 0;
        
        elementosAudiencia.forEach(elemento => {
            const texto = elemento.textContent.trim();
            const match = texto.match(/Audiencia\s*\((\d+)\)/);
            if (match) totalVistas = parseInt(match[1]);
        });
        
        const elementosUsuarios = document.querySelectorAll('.sc-cyUPVx');
        let contador = 0;
        
        elementosUsuarios.forEach(elemento => {
            const nombreElemento = elemento.querySelector('.sc-bLmarx.gZLzRh');
            const usuarioElemento = elemento.querySelector('.sc-druKGx.gChIoG');
            const imagenElemento = elemento.querySelector('img.sc-bbQqnZ');
            
            if (nombreElemento && usuarioElemento) {
                const nombre = nombreElemento.textContent.trim();
                const usuario = usuarioElemento.textContent.trim();
                const imagenUrl = imagenElemento ? imagenElemento.getAttribute('src') : null;
                
                if (nombre && usuario) {
                    contador++;
                    console.log(`${contador}. ${nombre}`);
                    console.log(`   📧 ${usuario}`);
                    if (imagenUrl) {
                        console.log(`   🖼️ ${imagenUrl}`);
                    }
                    console.log('');
                }
            }
        });
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━');
        console.log(`📊 RESUMEN:`);
        console.log(`   • Vistas: ${totalVistas}`);
        console.log(`   • Usuarios: ${contador}`);
        console.log('👨‍💻 Bsz - AvastrOficial');
        console.log('\n💡 Usa extraerYEnviar() para enviar al chat');
        
        return { vistas: totalVistas, usuarios: contador };
    }
    
    // Función de ayuda
    function mostrarAyuda() {
        console.clear();
        console.log('📋 **COMANDOS DEL SCRIPT:**\n');
        console.log('1. extraerYEnviar()');
        console.log('   - Extrae datos y los ENVÍA al chat (solo texto)\n');
        console.log('2. soloExtraer()');
        console.log('   - Solo extrae datos (NO los envía)\n');
        console.log('3. probarEnvio()');
        console.log('   - Envía un mensaje simple de prueba\n');
        console.log('4. mostrarAyuda()');
        console.log('   - Muestra esta ayuda\n');
        console.log('━━━━━━━━━━━━━━━━━━━━');
        console.log('⚙️ **CONFIGURACIÓN:**');
        console.log('   • Delay antes de enviar: 2 segundos');
        console.log('   • Formato: Solo texto (sin HTML)');
        console.log('━━━━━━━━━━━━━━━━━━━━');
        console.log('👨‍💻 Script por Bsz - AvastrOficial');
    }
    
    // Inicializar
    mostrarAyuda();
    
    // Hacer funciones globales
    window.extraerYEnviar = extraerYEnviar;
    window.soloExtraer = soloExtraer;
    window.probarEnvio = probarEnvio;
    window.mostrarAyuda = mostrarAyuda;
    
    console.log('\n✅ Script cargado');
    console.log('👉 Usa probarEnvio() primero para ver si funciona');
    console.log('   Luego usa extraerYEnviar() para enviar los datos');
    
})();
