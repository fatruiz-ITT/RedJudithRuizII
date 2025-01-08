const participantes = [
    "Juan Pablo Perez Alvarez", "Ana Lilia Vela Jimenez", "Berna Ariana Prudente Rodriguez",
    "Aurora Azucena Quintero Nuñez", "Fatima de Jesus Ruiz Garcia", "Guillermo Murgia Barradas",
    "Zuleyma Jazmin Fuentes Cantero"
];

const semanas = [
    "1ra", "2da", "3ra", "4ta", "5ta",
    "6ta", "7ma", "8va", "9na", "10ma",
    "11va", "12va", "13va", "14va",
    "15va", "16va"
];

const startDate = new Date("2025-01-14");

async function fetchExcelData() {
    const SHEET_ID = "1S3pmpHig1b-Zt3UCOmFF6LktaRT-tZzM79uAZdn-7U8"; // ID de tu hoja de cálculo
    const RANGE = "Hoja1!A:H"; // El rango que necesitas, ajusta según la estructura de tu archivo Excel
    const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}`;

    try {
        // Obtener el token de acceso renovado
        const accessToken = await renovarAccessToken(); // Llamamos a la función para obtener el token

        if (!accessToken) {
            console.error("No se pudo obtener un token de acceso válido.");
            return [];
        }

        // Obtener datos del archivo Excel (Google Sheets API)
        const response = await fetch(BASE_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`, // Usa el token renovado
            },
        });

        if (!response.ok) {
            console.error("Error en la solicitud:", await response.text());
            return [];
        }

        const data = await response.json();
        return data.values; // Retorna los valores de la hoja de cálculo
    } catch (error) {
        console.error("Error al obtener datos del archivo:", error);
        return [];
    }
}



// Generar tabla basada en filtro
async function generateTable(filter = "") {
    const tbody = document.querySelector("#participanteTable tbody");
    tbody.innerHTML = ""; // Limpiar tabla

    if (!filter) return; // Si no se selecciona un participante, no mostrar nada

    const filteredParticipantes = participantes.filter(part => !filter || part === filter);
    const excelData = await fetchExcelData(); // Obtener los datos del archivo Excel

    filteredParticipantes.forEach(participante => {
        semanas.forEach((semana, index) => {
            const fecha = new Date(startDate);
            fecha.setDate(startDate.getDate() + index * 7);

            // Buscar si existe una coincidencia en el archivo Excel
            const excelRow = excelData.find(row => row[0] === participante && row[1] === semana);

            // Si se encuentra, obtener los valores de las columnas D, G y F
            const pago = excelRow ? excelRow[3] : "-";  // Columna D
            const abono = excelRow ? excelRow[6] : "-";  // Columna G
            const ahorroEnCaja = excelRow ? excelRow[7] : "-";  // Columna F

            const row = `
                <tr>
                    <td>${participante}</td>
                    <td>${semana}</td>
                    <td>${fecha.toLocaleDateString()}</td>
                    <td>${pago}</td>
                    <td>${abono}</td>
                    <td>${ahorroEnCaja}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    });
    document.getElementById("participanteTable").style.display = "block";
}


// Poblar dropdown del filtro
function populateFilterOptions() {
    const filterSelect = document.getElementById("participantFilter");
    filterSelect.innerHTML = '<option value="">Todos</option>'; // Limpiar opciones previas
    participantes.forEach(participante => {
        const option = document.createElement("option");
        option.value = participante;
        option.textContent = participante;
        filterSelect.appendChild(option);
    });
}

// Mostrar tabla de participantes
document.getElementById("btnParticipante").addEventListener("click", () => {
    document.getElementById("participanteSelection").classList.remove("hidden");
    document.getElementById("asesorEncargadaForm").classList.add("hidden");
    document.getElementById("loginForm").classList.add("hidden");
    populateFilterOptions(); // Llamar para refrescar el filtro
    generateTable(); // Mostrar la tabla
});

// Mostrar el formulario Login al hacer clic en "Asesor-Encargada"
document.getElementById('btnAsesorEncargada').addEventListener('click', function() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('asesorEncargadaForm').classList.add('hidden');
    document.getElementById('participanteSelection').classList.add('hidden');
});

// Login
document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que se recargue la página al hacer submit del formulario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aquí agregamos una simple verificación de usuario y contraseña
    if (username === 'Asesor' && password === '1234') {
        // Login exitoso: ocultar el formulario de login y mostrar el formulario "Asesor-Encargada"
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('loginError').classList.add('hidden'); // Ocultar mensaje de error si las credenciales son correctas
        document.getElementById('asesorEncargadaForm').classList.remove('hidden');
    } else {
        // Mostrar mensaje de error si el login falla
        document.getElementById('loginError').classList.remove('hidden');
    }
});

// Función para mostrar u ocultar los días de atraso si se selecciona "No" en "Lo dio a tiempo"
function toggleFundDays() {
    const onTimeNo = document.getElementById('onTimeNo');
    const fundDaysDiv = document.getElementById('fundDaysDiv');
    if (onTimeNo.checked) {
        fundDaysDiv.style.display = 'block';
    } else {
        fundDaysDiv.style.display = 'none';
    }
}

// Función para mostrar u ocultar el monto de caja de ahorro si se selecciona "Sí" en "Dio caja de ahorro"
function toggleFundAmount() {
    const gaveFundNo = document.getElementById('gaveFundNo');
    const fundAmountDiv = document.getElementById('fundAmountDiv');
    if (!gaveFundNo.checked) {
        fundAmountDiv.style.display = 'block';
    } else {
        fundAmountDiv.style.display = 'none';
    }
}

// Filtrar participantes en la tabla
document.getElementById("participantFilter").addEventListener("change", (event) => {
    generateTable(event.target.value);  // Filtrar participantes en la tabla
});

// Cargar las semanas en el dropdown
function populateWeekOptions() {
    const weekSelect = document.getElementById("weekSelect");
    weekSelect.innerHTML = '<option value="">Seleccione una semana</option>'; // Limpiar opciones previas
    semanas.forEach(semana => {
        const option = document.createElement("option");
        option.value = semana;
        option.textContent = semana;
        weekSelect.appendChild(option);
    });
}

// Función para formatear la fecha en formato 'Lunes 13 de Enero de 2024'
function formatDateToSpanish(date) {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const monthsOfYear = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
        "Octubre", "Noviembre", "Diciembre"
    ];

    const day = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    const year = date.getFullYear();
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${dayOfWeek} ${day} de ${month} de ${year}`;
}

// Actualizar la fecha de pago cuando se selecciona una semana
document.getElementById("weekSelect").addEventListener("change", (event) => {
    const selectedWeek = event.target.value;
    if (selectedWeek) {
        // Calcular la fecha correspondiente
        const semanaIndex = semanas.indexOf(selectedWeek);
        const fecha = new Date(startDate);
        fecha.setDate(startDate.getDate() + semanaIndex * 7);

        // Establecer la fecha en el input de fecha en formato 'Lunes 13 de Enero de 2024'
        const paymentDateInput = document.getElementById("paymentDate");
        paymentDateInput.value = formatDateToSpanish(fecha); // Mostrar la fecha formateada
    } else {
        document.getElementById("paymentDate").value = ''; // Limpiar fecha si no se selecciona una semana
    }
});

// Poblar dropdown del filtro
function populateFilterOptionsAsesor() {
    const filterSelect = document.getElementById("participantSelect");
    filterSelect.innerHTML = '<option value="">Seleccione Participante</option>'; // Limpiar opciones previas
    participantes.forEach(participante => {
        const option = document.createElement("option");
        option.value = participante;
        option.textContent = participante;
        filterSelect.appendChild(option);
    });
}


document.getElementById("paymentForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtener valores del formulario
    const participant = document.getElementById("participantSelect").value;
    const week = document.getElementById("weekSelect").value;
    const paymentDate = document.getElementById("paymentDate").value;
    const gaveSavings = document.querySelector('input[name="gaveSavings"]:checked')?.value || "no";
    const onTime = document.querySelector('input[name="onTime"]:checked')?.value || "no";
    const fundDays = onTime === "no" ? document.getElementById("fundDays").value || "0" : "NA";
    const gaveFund = document.querySelector('input[name="gaveFund"]:checked')?.value || "no";
    const fundAmount = gaveFund === "yes" ? document.getElementById("fundAmount").value || "0" : "0";

    // Validación simple
    if (!participant || !week || !paymentDate) {
        alert("Por favor completa todos los campos requeridos.");
        return;
    }

    // Formar los datos para enviar
    const data = {
        values: [
            [participant, week, paymentDate, gaveSavings, onTime, fundDays, gaveFund, fundAmount],
        ],
    };

    // ID de la hoja y rango
    const SHEET_ID = "1S3pmpHig1b-Zt3UCOmFF6LktaRT-tZzM79uAZdn-7U8"; // Reemplaza con el ID de tu hoja
    const RANGE = "Hoja1!A:H"; // Rango en la hoja donde guardar los datos
    const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED`;

    try {
        // Renovar token de acceso
        const accessToken = await renovarAccessToken();
        if (!accessToken) {
            alert("No se pudo obtener un token de acceso válido.");
            return;
        }

        // Enviar los datos a la hoja de cálculo
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert("Datos guardados exitosamente.");
            document.getElementById("paymentForm").reset();
        } else {
            console.error("Error al guardar los datos:", await response.text());
            alert("Error al guardar los datos. Revisa la consola para más detalles.");
        }
    } catch (error) {
        console.error("Error al enviar los datos:", error);
        alert("Hubo un problema al conectarse a la API.");
    }
});

// Función para renovar el token de acceso
async function renovarAccessToken() {
    const clientId = '217452065709-eoi637u5kp9929b3laob6in6a6skknjv.apps.googleusercontent.com';
    const clientSecret = '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';
    const refreshToken = '1//04YzbTZvht8juCgYIARAAGAQSNwF-L9Ir9GmX3DjgLJnUPsgP889ElWofH2CYxZFwreBsPbLwdSpVXUNw-lsly-p8cuf0Nhje4U4';

    const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
    });

    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        if (response.ok) {
            const data = await response.json();
            return data.access_token;
        } else {
            console.error('Error al renovar el token de acceso:', await response.text());
            alert('No se pudo renovar el token de acceso.');
        }
    } catch (error) {
        console.error('Error al renovar el token:', error);
    }
}

// Inicialización
populateFilterOptions();
populateWeekOptions();
populateFilterOptionsAsesor();
