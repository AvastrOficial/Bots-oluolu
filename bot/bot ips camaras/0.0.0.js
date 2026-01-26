// =============================================
// SCRIPT SIMPLE DE CÁMARAS IP - SOLO IPS
// =============================================

(function() {
    'use strict';
    
    console.log('🚀 Iniciando Script Simple de Cámaras IP...');
    
    // Variables simples
    let scanResults = [];
    let isScanning = false;
    let currentCountry = '';
    
    // Lista simplificada de países
    const COUNTRIES = {
        "AF": "Afghanistan", "AX": "Åland Islands", "AL": "Albania", "DZ": "Algeria", "AS": "American Samoa",
        "AD": "Andorra", "AO": "Angola", "AI": "Anguilla", "AQ": "Antarctica", "AG": "Antigua and Barbuda",
        "AR": "Argentina", "AM": "Armenia", "AW": "Aruba", "AU": "Australia", "AT": "Austria", "AZ": "Azerbaijan",
        "BS": "Bahamas", "BH": "Bahrain", "BD": "Bangladesh", "BB": "Barbados", "BY": "Belarus", "BE": "Belgium",
        "BZ": "Belize", "BJ": "Benin", "BM": "Bermuda", "BT": "Bhutan", "BO": "Bolivia", "BQ": "Bonaire",
        "BA": "Bosnia and Herzegovina", "BW": "Botswana", "BV": "Bouvet Island", "BR": "Brazil", "IO": "British Indian Ocean Territory",
        "BN": "Brunei Darussalam", "BG": "Bulgaria", "BF": "Burkina Faso", "BI": "Burundi", "CV": "Cabo Verde",
        "KH": "Cambodia", "CM": "Cameroon", "CA": "Canada", "KY": "Cayman Islands", "CF": "Central African Republic",
        "TD": "Chad", "CL": "Chile", "CN": "China", "CX": "Christmas Island", "CC": "Cocos (Keeling) Islands",
        "CO": "Colombia", "KM": "Comoros", "CD": "Congo (Democratic Republic)", "CG": "Congo", "CK": "Cook Islands",
        "CR": "Costa Rica", "CI": "Côte d'Ivoire", "HR": "Croatia", "CU": "Cuba", "CW": "Curaçao", "CY": "Cyprus",
        "CZ": "Czech Republic", "DK": "Denmark", "DJ": "Djibouti", "DM": "Dominica", "DO": "Dominican Republic",
        "EC": "Ecuador", "EG": "Egypt", "SV": "El Salvador", "GQ": "Equatorial Guinea", "ER": "Eritrea",
        "EE": "Estonia", "SZ": "Eswatini", "ET": "Ethiopia", "FK": "Falkland Islands", "FO": "Faroe Islands",
        "FJ": "Fiji", "FI": "Finland", "FR": "France", "GF": "French Guiana", "PF": "French Polynesia",
        "TF": "French Southern Territories", "GA": "Gabon", "GM": "Gambia", "GE": "Georgia", "DE": "Germany",
        "GH": "Ghana", "GI": "Gibraltar", "GR": "Greece", "GL": "Greenland", "GD": "Grenada", "GP": "Guadeloupe",
        "GU": "Guam", "GT": "Guatemala", "GG": "Guernsey", "GN": "Guinea", "GW": "Guinea-Bissau", "GY": "Guyana",
        "HT": "Haiti", "HM": "Heard Island and McDonald Islands", "VA": "Holy See", "HN": "Honduras", "HK": "Hong Kong",
        "HU": "Hungary", "IS": "Iceland", "IN": "India", "ID": "Indonesia", "IR": "Iran", "IQ": "Iraq",
        "IE": "Ireland", "IM": "Isle of Man", "IL": "Israel", "IT": "Italy", "JM": "Jamaica", "JP": "Japan",
        "JE": "Jersey", "JO": "Jordan", "KZ": "Kazakhstan", "KE": "Kenya", "KI": "Kiribati", "KP": "Korea (North)",
        "KR": "Korea (South)", "KW": "Kuwait", "KG": "Kyrgyzstan", "LA": "Lao", "LV": "Latvia", "LB": "Lebanon",
        "LS": "Lesotho", "LR": "Liberia", "LY": "Libya", "LI": "Liechtenstein", "LT": "Lithuania", "LU": "Luxembourg",
        "MO": "Macao", "MG": "Madagascar", "MW": "Malawi", "MY": "Malaysia", "MV": "Maldives", "ML": "Mali",
        "MT": "Malta", "MH": "Marshall Islands", "MQ": "Martinique", "MR": "Mauritania", "MU": "Mauritius",
        "YT": "Mayotte", "MX": "Mexico", "FM": "Micronesia", "MD": "Moldova", "MC": "Monaco", "MN": "Mongolia",
        "ME": "Montenegro", "MS": "Montserrat", "MA": "Morocco", "MZ": "Mozambique", "MM": "Myanmar", "NA": "Namibia",
        "NR": "Nauru", "NP": "Nepal", "NL": "Netherlands", "NC": "New Caledonia", "NZ": "New Zealand", "NI": "Nicaragua",
        "NE": "Niger", "NG": "Nigeria", "NU": "Niue", "NF": "Norfolk Island", "MK": "North Macedonia", "MP": "Northern Mariana Islands",
        "NO": "Norway", "OM": "Oman", "PK": "Pakistan", "PW": "Palau", "PS": "Palestine", "PA": "Panama",
        "PG": "Papua New Guinea", "PY": "Paraguay", "PE": "Peru", "PH": "Philippines", "PN": "Pitcairn",
        "PL": "Poland", "PT": "Portugal", "PR": "Puerto Rico", "QA": "Qatar", "RE": "Réunion", "RO": "Romania",
        "RU": "Russia", "RW": "Rwanda", "BL": "Saint Barthélemy", "SH": "Saint Helena", "KN": "Saint Kitts and Nevis",
        "LC": "Saint Lucia", "MF": "Saint Martin", "PM": "Saint Pierre and Miquelon", "VC": "Saint Vincent and the Grenadines",
        "WS": "Samoa", "SM": "San Marino", "ST": "Sao Tome and Principe", "SA": "Saudi Arabia", "SN": "Senegal",
        "RS": "Serbia", "SC": "Seychelles", "SL": "Sierra Leone", "SG": "Singapore", "SX": "Sint Maarten",
        "SK": "Slovakia", "SI": "Slovenia", "SB": "Solomon Islands", "SO": "Somalia", "ZA": "South Africa",
        "GS": "South Georgia", "SS": "South Sudan", "ES": "Spain", "LK": "Sri Lanka", "SD": "Sudan", "SR": "Suriname",
        "SJ": "Svalbard and Jan Mayen", "SE": "Sweden", "CH": "Switzerland", "SY": "Syria", "TW": "Taiwan",
        "TJ": "Tajikistan", "TZ": "Tanzania", "TH": "Thailand", "TL": "Timor-Leste", "TG": "Togo", "TK": "Tokelau",
        "TO": "Tonga", "TT": "Trinidad and Tobago", "TN": "Tunisia", "TR": "Turkey", "TM": "Turkmenistan",
        "TC": "Turks and Caicos Islands", "TV": "Tuvalu", "UG": "Uganda", "UA": "Ukraine", "AE": "United Arab Emirates",
        "GB": "United Kingdom", "US": "United States", "UM": "United States Minor Outlying Islands", "UY": "Uruguay",
        "UZ": "Uzbekistan", "VU": "Vanuatu", "VE": "Venezuela", "VN": "Vietnam", "VG": "Virgin Islands (British)",
        "VI": "Virgin Islands (U.S.)", "WF": "Wallis and Futuna", "EH": "Western Sahara", "YE": "Yemen", "ZM": "Zambia",
        "ZW": "Zimbabwe"
    };

    // Países con más cámaras (prioridad)
    const TOP_COUNTRIES = [
        "US", "RU", "DE", "FR", "ES", "CN", 
        "JP", "GB", "IT", "BR", "CA", "AU",
        "NL", "PL", "IN", "MX", "TR", "KR"
    ];

    // ==================== FUNCIONES SIMPLES ====================
    
    function showSimpleNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 999999;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
        
        if (!document.querySelector('#simple-styles')) {
            const style = document.createElement('style');
            style.id = 'simple-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ==================== FUNCIÓN DE ESCANEO SIMPLE ====================
    
    async function fetchCameras(countryCode) {
        if (isScanning) {
            showSimpleNotification('Ya hay un escaneo en progreso');
            return;
        }
        
        isScanning = true;
        currentCountry = countryCode;
        scanResults = [];
        
        showSimpleNotification(`Escaneando ${COUNTRIES[countryCode]}...`);
        
        try {
            // Usar proxy para evitar CORS
            const proxy = 'https://corsproxy.io/?';
            const url = `http://www.insecam.org/en/bycountry/${countryCode}/`;
            
            const response = await fetch(proxy + encodeURIComponent(url), {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Buscar IPs de cámaras
            const ipPatterns = [
                /http:\/\/\d+\.\d+\.\d+\.\d+:\d+/g,
                /https:\/\/\d+\.\d+\.\d+\.\d+:\d+/g
            ];
            
            const foundIPs = new Set();
            
            ipPatterns.forEach(pattern => {
                const matches = html.match(pattern) || [];
                matches.forEach(ip => {
                    foundIPs.add(ip);
                });
            });
            
            scanResults = Array.from(foundIPs);
            
            if (scanResults.length === 0) {
                // Intentar encontrar en otras páginas
                const pagePattern = /pagenavigator\("\\?page=", (\d+)/;
                const pageMatch = html.match(pagePattern);
                
                if (pageMatch) {
                    const pages = Math.min(parseInt(pageMatch[1]), 5);
                    
                    for (let page = 1; page <= pages; page++) {
                        try {
                            const pageUrl = `http://www.insecam.org/en/bycountry/${countryCode}/?page=${page}`;
                            const pageResponse = await fetch(proxy + encodeURIComponent(pageUrl));
                            const pageHtml = await pageResponse.text();
                            
                            ipPatterns.forEach(pattern => {
                                const matches = pageHtml.match(pattern) || [];
                                matches.forEach(ip => {
                                    foundIPs.add(ip);
                                });
                            });
                            
                            // Actualizar resultados
                            scanResults = Array.from(foundIPs);
                            
                        } catch (pageError) {
                            console.log(`Error en página ${page}:`, pageError);
                        }
                    }
                }
            }
            
            isScanning = false;
            
            if (scanResults.length > 0) {
                // Mostrar resultados
                showResults();
                showSimpleNotification(`Encontradas ${scanResults.length} cámaras`);
            } else {
                showSimpleNotification('No se encontraron cámaras en este país');
            }
            
        } catch (error) {
            isScanning = false;
            console.error('Error:', error);
            showSimpleNotification('Error al escanear. Intenta otro país.');
        }
    }
    
    // ==================== MOSTRAR RESULTADOS ====================
    
    function showResults() {
        // Limpiar resultados anteriores
        const oldResults = document.getElementById('camera-results');
        if (oldResults) oldResults.remove();
        
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'camera-results';
        resultsDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(25, 25, 35, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 25px;
            z-index: 999998;
            color: white;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            border: 1px solid rgba(52, 152, 219, 0.3);
            min-width: 500px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        let resultsHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 24px; color: #3498db; margin-bottom: 10px;">📹</div>
                <div style="font-weight: 800; font-size: 18px; margin-bottom: 5px;">
                    Cámaras encontradas en ${COUNTRIES[currentCountry] || currentCountry}
                </div>
                <div style="font-size: 14px; color: rgba(255,255,255,0.6);">
                    Total: ${scanResults.length} IPs
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <button id="copy-all" style="
                        padding: 10px 20px;
                        background: linear-gradient(135deg, #2ecc71, #27ae60);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 14px;
                    ">
                        📋 Copiar todas (${scanResults.length})
                    </button>
                    <button id="download-ips" style="
                        padding: 10px 20px;
                        background: linear-gradient(135deg, #3498db, #2980b9);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 14px;
                    ">
                        💾 Descargar .txt
                    </button>
                </div>
            </div>
            
            <div style="
                background: rgba(0,0,0,0.3);
                border-radius: 10px;
                padding: 15px;
                max-height: 300px;
                overflow-y: auto;
                margin-bottom: 20px;
            ">
        `;
        
        if (scanResults.length === 0) {
            resultsHTML += `
                <div style="text-align: center; padding: 40px 20px; color: rgba(255,255,255,0.5);">
                    No se encontraron cámaras IP
                </div>
            `;
        } else {
            scanResults.forEach((ip, index) => {
                resultsHTML += `
                    <div style="
                        padding: 12px;
                        margin-bottom: 8px;
                        background: rgba(255,255,255,0.05);
                        border-radius: 6px;
                        border-left: 3px solid #3498db;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <div style="font-family: monospace; font-size: 14px; color: #f1c40f;">
                            ${index + 1}. ${ip}
                        </div>
                        <button class="copy-ip" data-ip="${ip}" style="
                            padding: 5px 12px;
                            background: rgba(52,152,219,0.2);
                            border: 1px solid rgba(52,152,219,0.3);
                            color: #3498db;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                        ">
                            Copiar
                        </button>
                    </div>
                `;
            });
        }
        
        resultsHTML += `
            </div>
            
            <div style="text-align: center;">
                <button id="close-results" style="
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                ">
                    Cerrar
                </button>
            </div>
            
            <div style="
                margin-top: 20px;
                padding: 15px;
                background: rgba(231, 76, 60, 0.1);
                border-radius: 8px;
                border-left: 3px solid #e74c3c;
            ">
                <div style="font-size: 11px; color: rgba(255,255,255,0.7); line-height: 1.5;">
                    ⚠️ <strong>ADVERTENCIA:</strong> Este script es solo para fines educativos.<br>
                    Respetar la privacidad de los demás es esencial.
                </div>
            </div>
        `;
        
        resultsDiv.innerHTML = resultsHTML;
        document.body.appendChild(resultsDiv);
        
        // Event listeners para resultados
        resultsDiv.querySelector('#copy-all').addEventListener('click', () => {
            const allIPs = scanResults.join('\n');
            navigator.clipboard.writeText(allIPs)
                .then(() => {
                    const btn = resultsDiv.querySelector('#copy-all');
                    const originalText = btn.textContent;
                    btn.textContent = '✅ ¡Copiadas!';
                    btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
                    setTimeout(() => {
                        btn.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error al copiar:', err);
                    showSimpleNotification('Error al copiar');
                });
        });
        
        resultsDiv.querySelector('#download-ips').addEventListener('click', () => {
            downloadResults();
        });
        
        resultsDiv.querySelector('#close-results').addEventListener('click', () => {
            resultsDiv.remove();
        });
        
        // Botones de copiar individuales
        resultsDiv.querySelectorAll('.copy-ip').forEach(button => {
            button.addEventListener('click', (e) => {
                const ip = e.target.dataset.ip;
                navigator.clipboard.writeText(ip)
                    .then(() => {
                        e.target.textContent = '✅';
                        e.target.style.background = 'rgba(46,204,113,0.2)';
                        e.target.style.borderColor = 'rgba(46,204,113,0.3)';
                        e.target.style.color = '#2ecc71';
                        setTimeout(() => {
                            e.target.textContent = 'Copiar';
                            e.target.style.background = 'rgba(52,152,219,0.2)';
                            e.target.style.borderColor = 'rgba(52,152,219,0.3)';
                            e.target.style.color = '#3498db';
                        }, 1500);
                    })
                    .catch(err => {
                        console.error('Error al copiar IP:', err);
                    });
            });
        });
        
        // Cerrar al hacer clic fuera
        resultsDiv.addEventListener('click', (e) => {
            if (e.target === resultsDiv) {
                resultsDiv.remove();
            }
        });
    }
    
    function downloadResults() {
        if (scanResults.length === 0) return;
        
        const content = `Cámaras IP - ${currentCountry} (${COUNTRIES[currentCountry]})\n`;
        content += `Fecha: ${new Date().toLocaleString()}\n`;
        content += `Total: ${scanResults.length}\n`;
        content += '='.repeat(50) + '\n\n';
        
        scanResults.forEach((ip, index) => {
            content += `${index + 1}. ${ip}\n`;
        });
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cameras_${currentCountry}_${Date.now()}.txt`;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        showSimpleNotification(`✅ Descargadas ${scanResults.length} IPs`);
    }
    
    // ==================== PANEL SIMPLE ====================
    
    function createSimplePanel() {
        const panel = document.createElement('div');
        panel.id = 'simple-camera-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(25, 25, 35, 0.95);
            backdrop-filter: blur(15px);
            border-radius: 12px;
            padding: 20px;
            z-index: 999997;
            color: white;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            border: 1px solid rgba(52, 152, 219, 0.3);
            width: 300px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        panel.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 20px; color: #3498db; margin-bottom: 8px;">📹</div>
                <div style="font-weight: 700; font-size: 16px;">Scanner de Cámaras IP</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 4px;">
                    Solo IPs - Sin complicaciones
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="font-size: 12px; font-weight: 600; margin-bottom: 10px; color: rgba(255,255,255,0.9);">
                    🎯 Países con más cámaras:
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 15px;">
                    ${TOP_COUNTRIES.slice(0, 9).map(code => `
                        <button class="quick-country" data-code="${code}" style="
                            padding: 10px 5px;
                            background: rgba(52, 152, 219, 0.15);
                            border: 1px solid rgba(52, 152, 219, 0.3);
                            color: #3498db;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 11px;
                            font-weight: 700;
                            transition: all 0.2s;
                        ">${code}</button>
                    `).join('')}
                </div>
                
                <div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 15px;">
                    💡 <strong>Consejo:</strong> USA, Rusia y Alemania suelen tener más cámaras públicas.
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px; color: rgba(255,255,255,0.9);">
                    🔍 Buscar por país:
                </div>
                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <input type="text" id="country-input" placeholder="Código (ej: US, ES, FR)" style="
                        flex: 1;
                        padding: 12px 15px;
                        background: rgba(255,255,255,0.08);
                        border: 1px solid rgba(255,255,255,0.15);
                        border-radius: 8px;
                        color: white;
                        font-size: 14px;
                    ">
                    <button id="search-btn" style="
                        padding: 12px 20px;
                        background: linear-gradient(135deg, #e74c3c, #c0392b);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 14px;
                    ">🔍</button>
                </div>
                
                <select id="country-select" style="
                    width: 100%;
                    padding: 12px 15px;
                    background: rgba(52,152,219,0.1);
                    border: 1px solid rgba(52,152,219,0.3);
                    border-radius: 8px;
                    color: #3498db;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 20px;
                ">
                    <option value="">-- Selecciona un país --</option>
                    ${Object.entries(COUNTRIES)
                        .sort((a, b) => a[1].localeCompare(b[1]))
                        .map(([code, name]) => `
                            <option value="${code}">${name} (${code})</option>
                        `).join('')}
                </select>
                
                <button id="scan-btn" style="
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 800;
                    font-size: 14px;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                ">
                    <span>📡</span>
                    <span>ESCANEAR CÁMARAS</span>
                </button>
            </div>
            
            <div style="
                padding: 15px;
                background: rgba(0,0,0,0.2);
                border-radius: 8px;
                border-left: 3px solid #2ecc71;
            ">
                <div style="font-size: 11px; color: rgba(255,255,255,0.8); line-height: 1.5;">
                    📊 <strong>Último escaneo:</strong><br>
                    <span id="last-scan">Ninguno aún</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Event Listeners
        panel.querySelector('#scan-btn').addEventListener('click', () => {
            const selectValue = panel.querySelector('#country-select').value;
            const inputValue = panel.querySelector('#country-input').value.toUpperCase().trim();
            
            let countryCode = selectValue || inputValue;
            
            if (!countryCode) {
                showSimpleNotification('❌ Ingresa un código de país');
                return;
            }
            
            if (!COUNTRIES[countryCode]) {
                showSimpleNotification(`❌ País no válido: ${countryCode}`);
                return;
            }
            
            fetchCameras(countryCode);
            
            // Actualizar último escaneo
            panel.querySelector('#last-scan').innerHTML = `
                <strong>${COUNTRIES[countryCode]}</strong><br>
                <span style="color: rgba(255,255,255,0.6);">Código: ${countryCode}</span>
            `;
        });
        
        panel.querySelector('#search-btn').addEventListener('click', () => {
            panel.querySelector('#scan-btn').click();
        });
        
        panel.querySelector('#country-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                panel.querySelector('#scan-btn').click();
            }
        });
        
        panel.querySelector('#country-select').addEventListener('change', (e) => {
            if (e.target.value) {
                panel.querySelector('#country-input').value = e.target.value;
            }
        });
        
        // Botones rápidos de países
        panel.querySelectorAll('.quick-country').forEach(button => {
            button.addEventListener('click', () => {
                const countryCode = button.dataset.code;
                panel.querySelector('#country-input').value = countryCode;
                panel.querySelector('#country-select').value = countryCode;
                panel.querySelector('#scan-btn').click();
            });
        });
        
        return panel;
    }
    
    // ==================== INICIALIZACIÓN SIMPLE ====================
    
    function initialize() {
        console.log('📹 Script Simple de Cámaras IP cargado');
        
        // Crear panel
        createSimplePanel();
        
        // Mostrar mensaje inicial
        setTimeout(() => {
            showSimpleNotification('Scanner de Cámaras IP listo');
        }, 1000);
        
        // Añadir botón de minimizar
        const toggleBtn = document.createElement('div');
        toggleBtn.innerHTML = '📹';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            z-index: 999996;
            box-shadow: 0 6px 20px rgba(52,152,219,0.4);
            transition: all 0.3s;
        `;
        
        let panelVisible = true;
        
        toggleBtn.onclick = () => {
            const panel = document.querySelector('#simple-camera-panel');
            if (panel) {
                panelVisible = !panelVisible;
                panel.style.transform = panelVisible ? 'translateX(0)' : 'translateX(400px)';
                panel.style.opacity = panelVisible ? '1' : '0';
                toggleBtn.innerHTML = panelVisible ? '📹' : '📹';
                toggleBtn.style.background = panelVisible ? 
                    'linear-gradient(135deg, #3498db, #2980b9)' : 
                    'linear-gradient(135deg, #e74c3c, #c0392b)';
            }
        };
        
        document.body.appendChild(toggleBtn);
    }
    
    // ==================== API GLOBAL SIMPLE ====================
    
    window.SimpleCamScanner = {
        scan: fetchCameras,
        getResults: () => scanResults,
        getCurrentCountry: () => currentCountry,
        showPanel: () => {
            const panel = document.querySelector('#simple-camera-panel');
            if (panel) {
                panel.style.transform = 'translateX(0)';
                panel.style.opacity = '1';
            }
        },
        hidePanel: () => {
            const panel = document.querySelector('#simple-camera-panel');
            if (panel) {
                panel.style.transform = 'translateX(400px)';
                panel.style.opacity = '0';
            }
        }
    };
    
    // Auto-inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }
    
})();
