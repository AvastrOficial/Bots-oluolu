// EJECUTAR ESTO DIRECTAMENTE EN CONSOLA - VERSIÓN RÁPIDA

(() => {
    const recompensa = 1000;
    
    console.log('💰 Buscando recompensas...');
    
    // 1. Encontrar el contenedor
    let contenedor = null;
    document.querySelectorAll('.sc-blHHSb.hiwZgk').forEach(el => {
        if (el.textContent.includes('Recompensas Reclamables')) {
            contenedor = el;
        }
    });
    
    if (!contenedor) {
        alert('❌ No se encontraron recompensas');
        return;
    }
    
    // 2. Actualizar valor
    const valorElement = contenedor.querySelector('.sc-cKgerZ.kYihXS');
    if (valorElement) {
        valorElement.textContent = `USD${recompensa}`;
        console.log(`✅ Valor actualizado: USD${recompensa}`);
    }
    
    // 3. Habilitar botón
    const boton = contenedor.querySelector('button.sc-khLCKb.sc-dstKZu.eFONJI.iNsern');
    if (boton) {
        // Habilitar
        boton.classList.remove('sc-dstKZu');
        boton.classList.add('sc-ovuCP');
        boton.disabled = false;
        boton.style.opacity = '1';
        boton.style.cursor = 'pointer';
        boton.textContent = 'Reclamar Ahora';
        
        // Agregar funcionalidad
        boton.onclick = function(e) {
            e.stopPropagation();
            
            // Deshabilitar durante proceso
            boton.disabled = true;
            boton.textContent = 'Procesando...';
            
            setTimeout(() => {
                // Éxito
                valorElement.textContent = 'USD0';
                boton.textContent = 'Reclamado ✓';
                boton.style.opacity = '0.5';
                boton.style.cursor = 'default';
                boton.disabled = true;
                
                // Actualizar saldos globales
                document.querySelectorAll('[class*="USD"]').forEach(el => {
                    if (el.textContent.startsWith('USD')) {
                        const actual = parseInt(el.textContent.replace('USD', '')) || 0;
                        el.textContent = `USD${actual + recompensa}`;
                    }
                });
                
                alert(`✅ ${recompensa} USDC reclamados exitosamente`);
                console.log(`🎉 ${recompensa} USDC reclamados`);
            }, 2000);
        };
        
        console.log('✅ Botón habilitado');
        console.log('💡 Haz clic en "Reclamar Ahora"');
    }
})();
