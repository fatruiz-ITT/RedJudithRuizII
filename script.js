document.addEventListener("DOMContentLoaded", async function () {
    const SHEET_ID = "1S3pmpHig1b-Zt3UCOmFF6LktaRT-tZzM79uAZdn-7U8"; // ID de tu hoja
    const RANGE = "Hoja1!A:H"; // Ajusta el rango según tu hoja
    const tableBody = document.querySelector("#participanteTable tbody");

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

    // Renovar token de acceso
    async function renovarAccessToken() {
        const clientId = '217452065709-eoi637u5kp9929b3laob6in6a6skknjv.apps.googleusercontent.com';
        const clientSecret = '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';
        const refreshToken = '1//04YzbTZvht8juCgYIARAAGAQSNwF-L9Ir9GmX3DjgLJnUPsgP889ElWofH2CYxZFwreBsPbLwdSpVXUNw-lsly-p8cuf0Nhje4U4';

        const body = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        });

        try {
            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body.toString()
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

    // Obtener los datos desde la hoja de Google
    async function fetchSheetData() {
        const accessToken = await renovarAccessToken();

        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.values || [];
            } else {
                console.error("Error al obtener los datos:", await response.text());
                alert("Error al obtener los datos de la hoja de cálculo.");
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
    }

    // Función para renderizar la tabla
    function renderTable(data) {
        tableBody.innerHTML = ""; // Limpiar la tabla

        data.forEach(row => {
            const [participante, semana, , pago, , ahorro, abono] = row; // Ajustar índices según la hoja
            if (participante && semana && pago) {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${participante}</td>
                    <td>${semana}</td>
                    <td>${new Date().toLocaleDateString()}</td>
                    <td>${pago === "Yes" ? "Si" : "No"}</td>
                    <td>${abono === "Yes" ? "Si" : "No"}</td>
                    <td>${ahorro || "0"}</td>
                `;
                tableBody.appendChild(tr);
            }
        });
    }

    // Poblar dropdown del filtro con los participantes desde la hoja de Google
    async function populateFilterOptions() {
        const filterSelect = document.getElementById("participantFilter");
        filterSelect.innerHTML = '<option value="">Todos</option>'; // Limpiar opciones previas

        const sheetData = await fetchSheetData();
        const participantes = Array.from(new Set(sheetData.map(row => row[0]))); // Obtener los nombres únicos de los participantes

        participantes.forEach(participante => {
            const option = document.createElement("option");
            option.value = participante;
            option.textContent = participante;
            filterSelect.appendChild(option);
        });
    }

    // Generar la tabla basada en el filtro
    function generateTable(filter = "") {
        const tbody = document.querySelector("#participanteTable tbody");
        tbody.innerHTML = ""; // Limpiar tabla

        if (!filter) return; // Si no se selecciona un participante, no mostrar nada

        const filteredParticipantes = participantes.filter(part => !filter || part === filter);
        filteredParticipantes.forEach(participante => {
            semanas.forEach((semana, index) => {
                const fecha = new Date(startDate);
                fecha.setDate(startDate.getDate() + index * 7);

                const row = `
                    <tr>
                        <td>${participante}</td>
                        <td>${semana}</td>
                        <td>${fecha.toLocaleDateString()}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        });
        document.getElementById("participanteTable").style.display = "block";
    }

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

    // Inicialización
    populateFilterOptions();
    populateFilterOptionsAsesor();
    populateWeekOptions();

    // Filtro por participante
    document.getElementById("participantFilter").addEventListener("change", (event) => {
        generateTable(event.target.value);
    });

    // Mostrar la tabla de participantes
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

    // Actualizar la fecha de pago cuando se selecciona una semana
    document.getElementById("weekSelect").addEventListener("change", (event) => {
        const selectedWeek = event.target.value;
        if (selectedWeek) {
            // Calcular la fecha correspondiente
            const semanaIndex = semanas.indexOf(selectedWeek);
            const fecha = new Date(startDate);
            fecha.setDate(startDate.getDate() + semanaIndex * 7);
            document.getElementById("paymentDate").value = fecha.toLocaleDateString();
        }
    });

});
