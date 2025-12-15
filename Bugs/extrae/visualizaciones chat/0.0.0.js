// Script para extraer y enviar usuarios, vistas e imágenes desde la consola
(function() {
    // Configuración
    const CONFIG = {
        delayEnvio: 2000,  // Milisegundos antes de enviar
        incluirImagenes: true // Incluir URLs de imágenes en el mensaje
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
            
            if (nombreElemento && usuarioElemento && imagenElemento) {
                const nombre = nombreElemento.textContent.trim();
                const usuario = usuarioElemento.textContent.trim();
                const imagenUrl = imagenElemento.getAttribute('src');
                const altText = imagenElemento.getAttribute('alt') || 'icon';
                
                if (nombre && usuario) {
                    contador++;
                    datosUsuarios.push({
                        numero: contador,
                        nombre: nombre,
                        usuario: usuario,
                        imagenUrl: imagenUrl,
                        altText: altText
                    });
                }
            }
        });
        
        console.log(`✅ Usuarios encontrados: ${contador}\n`);
        
        // 2. CONSTRUIR MENSAJE
        let mensaje = `📊 **REPORTE DE SALA** 📊\n\n`;
        mensaje += `👁️ **Vistas Totales:** ${totalVistas}\n`;
        mensaje += `👥 **Usuarios en Sala:** ${contador}\n\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += `👤 **LISTA DE USUARIOS:**\n\n`;
        
        // Agregar cada usuario al mensaje
        datosUsuarios.forEach(user => {
            mensaje += `${user.numero}. **${user.nombre}**\n`;
            mensaje += `   📧 ${user.usuario}\n`;
            
            if (CONFIG.incluirImagenes && user.imagenUrl) {
                mensaje += `   🖼️ <img src="${user.imagenUrl}" alt="${user.altText}">\n`;
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
            const enviado = enviarMensaje(mensaje);
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
    
    // Función para enviar mensaje al input y forzar el botón
    function enviarMensaje(texto) {
        console.log('🚀 Iniciando envío de mensaje...');
        
        try {
            // 1. ENCONTRAR EL INPUT
            const input = document.querySelector('.ql-editor.ql-blank.zdoc[contenteditable="true"]');
            if (!input) {
                console.log('❌ Input no encontrado');
                return false;
            }
            
            console.log('✅ Input encontrado');
            
            // 2. ESCRIBIR EN EL INPUT
            input.focus();
            input.innerHTML = `<p>${texto.replace(/\n/g, '<br>')}</p>`;
            
            // 3. DISPARAR EVENTOS DE INPUT
            input.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText'
            }));
            
            // Pequeña pausa para asegurar que se escribió
            setTimeout(() => {
                // 4. ENCONTRAR Y FORZAR EL BOTÓN DE ENVIAR
                const botonEnviar = document.querySelector('button.sc-gTTXEY.hMDGcf');
                if (botonEnviar) {
                    console.log('✅ Botón de enviar encontrado');
                    
                    // FORZAR HABILITACIÓN DEL BOTÓN
                    botonEnviar.removeAttribute('disabled');
                    botonEnviar.removeAttribute('aria-disabled');
                    
                    // FORZAR ESTILOS PARA HACERLO CLICKEABLE
                    botonEnviar.style.cssText = `
                        pointer-events: auto !important;
                        opacity: 1 !important;
                        cursor: pointer !important;
                        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQwSURBVHgB7ZrLVdtAFIavTQ6HpelAVIBcAaYDvOGxAldAUoGhgkAFkBXPc0wqwKkA0oHTAWue+X/OKEdRxvKMZika2w3wb+TGyrV//3Dv3jkUikUgkEolEIpFIJBKJzBcN+QAMBoPk8fExxcO1RqPRenl5OdzZ2RmZnPtJ/jMgRgtidN7e3hKIQUE6eN7K3sfr0mw2N/Bw2eTz5logivH8/JzCESkuehUXTzESvgdh3sdQEBfmRqBJYtgIgfH3pmNnVqDLy8v09fW1o8RIVQyxFkMHzv9hOnYmBGIQfXp6YtxYxdMOREjwuOVDDB0Qfmg6tnaB8mJAALoizQdREkKUPEtLS7MxxQrp9R8xQguhA79j2O12H0zHexPIJL3OApheP23GVxKojvQaCjrIZryxQMwqOOy7pNdZYGFxcWgz3lggCDHAIZH55t4m/pCm6UDWMDLn2CwQM4wFgoN6OIxkSqjYcYijlQPy4Bq+iyXGAm1tbd0gA6xLjSJRDHznIeLGMpLBKV7qcwEpFcFnWTuoUrvj/Pz8CD9+XwJBt6iWxJDPkSCYHI7EjRFu8opYYuygPNvb25/xg7+42L1I3i2bm5vrmThXV1d9D+OYp/c/54kDZ2dnCax/Kw7ZreiWPBQHoh2II/A5PXzHqVji3FFUK2je4V3Tc+gWiHKMmuhoXNrFtDqBc/bEE/jONpxZTwzSATcdwE39sjFlbsmg4ChmB1yQij8eEH+MOohFvPakdVPOxC0Zyo08PxWPML0jbm5IBbxW82yEQ6R1iPSVC0v8sGPY+srkXIqrxEnEP0OpyEzsavgI9mVUjT/v58qUYREcuM6rHH9IpXWQL5DGOzgEcw6pUn/lmZpA19fXu1ib3LqUDibYNOh1TEUglg7IbKdQA2YNeh21xyCVyu+kpt4S4o/TNdbuIK6FVFfgmwSmav2VZypTjOsl3Nk9FqcSENsGvY7gAjFTsejUvQehDrhGkUA9JgRoo0VrGcEF4s4HK3IWn4w/xfe5gFNTzvliithsEI4juEBYIa/xyMqczZmr5uIYNeW6nqecdYNeR3CB+MeD3FOWFHdw055uLKecr7au6/onI6hAyi1J4WUWsSclcWmoRHKaHj4yGAkqENwytm3BuHRxcVE25douU65Kg15HUIEMml7cur6FSNpxnHI4dMV+yt2b/gdxEqEdtGowLFlYWBjbrq2y3eRaoOYJHaQndQZHvHik+l7ZIDXlVkynHJYWXgI0CSaQ6vOMrdTZbcQWT7usP11EZbnepO0mOHIuHKR1D7MLXcO9tSrrFG7dwCFlq+9R1e6hjmACQYS/BOJd52ZjflOwKpxydB9dWHwPrznXX3lCOkiUPVDbPW24xnmHNIPu0+3w+qi/8gTtB2Xp29UxBt/DTNjHTfillgaRSCQSiUQskUgkEolEPiw/AT2GcUrJYLJwAAAAAElFTkSuQmCC") center center / cover no-repeat !important;
                        margin-bottom: 13px !important;
                    `;
                    
                    // INTENTAR MÚLTIPLES MÉTODOS DE CLIC
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
                            const eventos = ['mousedown', 'mouseup', 'click'];
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
                    let exito = false;
                    metodos.forEach((metodo, i) => {
                        setTimeout(() => {
                            try {
                                metodo();
                                console.log(`✅ Método ${i + 1} ejecutado`);
                                exito = true;
                            } catch(e) {
                                console.log(`⚠️ Error método ${i + 1}:`, e.message);
                            }
                        }, i * 100);
                    });
                    
                    // Método alternativo: Simular Enter
                    setTimeout(() => {
                        if (!exito) {
                            const enterEvent = new KeyboardEvent('keydown', {
                                key: 'Enter',
                                code: 'Enter',
                                keyCode: 13,
                                which: 13,
                                bubbles: true,
                                cancelable: true
                            });
                            input.dispatchEvent(enterEvent);
                            console.log('✅ Evento Enter enviado (alternativa)');
                        }
                        
                        // ✅ NO SE LIMPIA EL INPUT DESPUÉS DE ENVIAR
                        console.log('ℹ️ Input NO se limpia (según solicitud)');
                        
                    }, 500);
                    
                } else {
                    console.log('❌ Botón no encontrado, usando Enter');
                    
                    // Último recurso: Simular Enter
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                    });
                    input.dispatchEvent(enterEvent);
                    
                    // ✅ NO SE LIMPIA EL INPUT DESPUÉS DE ENVIAR
                    console.log('ℹ️ Input NO se limpia (según solicitud)');
                }
                
            }, 300);
            
            return true;
            
        } catch (error) {
            console.log('❌ Error crítico:', error);
            return false;
        }
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
            
            if (nombreElemento && usuarioElemento && imagenElemento) {
                const nombre = nombreElemento.textContent.trim();
                const usuario = usuarioElemento.textContent.trim();
                const imagenUrl = imagenElemento.getAttribute('src');
                const altText = imagenElemento.getAttribute('alt') || 'icon';
                
                if (nombre && usuario) {
                    contador++;
                    console.log(`${contador}. ${nombre}`);
                    console.log(`   📧 ${usuario}`);
                    console.log(`   🖼️ <img src="${imagenUrl}" alt="${altText}">`);
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
        console.log('   - Extrae datos y los ENVÍA al chat (NO limpia input)\n');
        console.log('2. soloExtraer()');
        console.log('   - Solo extrae datos (NO los envía)\n');
        console.log('3. mostrarAyuda()');
        console.log('   - Muestra esta ayuda\n');
        console.log('━━━━━━━━━━━━━━━━━━━━');
        console.log('⚙️ **CONFIGURACIÓN:**');
        console.log('   • Delay antes de enviar: 2 segundos');
        console.log('   • Incluye imágenes: Sí');
        console.log('   • Limpia input después: NO ✅');
        console.log('━━━━━━━━━━━━━━━━━━━━');
        console.log('👨‍💻 Script por Bsz - AvastrOficial');
    }
    
    // Inicializar
    mostrarAyuda();
    
    // Hacer funciones globales
    window.extraerYEnviar = extraerYEnviar;
    window.soloExtraer = soloExtraer;
    window.mostrarAyuda = mostrarAyuda;
    
    console.log('\n✅ Script cargado');
    console.log('👉 Usa extraerYEnviar() para enviar datos al chat');
    console.log('   (El mensaje quedará en el input después de enviar)');
    
})();
