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


// Generar tabla basada en filtro
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
    generateTable(event.target.value);
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
// Inicialización
populateFilterOptions();
populateWeekOptions();
populateFilterOptionsAsesor();
