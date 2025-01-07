
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

   // Mostrar el formulario "Login" al presionar "Asesor-Encargada"
   document.getElementById("btnAsesorEncargada").addEventListener("click", () => {
       document.getElementById("loginForm").classList.remove("hidden");
       document.getElementById("asesorEncargadaForm").classList.add("hidden");
       document.getElementById("participanteSelection").classList.add("hidden");
   });

    // Filtrar participantes en la tabla
    document.getElementById("participantFilter").addEventListener("change", (event) => {
        generateTable(event.target.value);
    });

    // Login
    document.getElementById("login").addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        console.log(`Usuario: ${username}, Contraseña: ${password}`);

        if (username === "Asesor" && password === "1234") {
            console.log("Login exitoso: Mostrando formulario Asesor-Encargada");
            document.getElementById("loginForm").classList.add("hidden");
            document.getElementById("asesorEncargadaForm").classList.remove("hidden");
            console.log(document.getElementById("asesorEncargadaForm"));
            document.getElementById("loginError").classList.add("hidden");

            // Verificar que el formulario Asesor-Encargada se está mostrando
            console.log("Formulario Asesor-Encargada visible:",
                !document.getElementById("asesorEncargadaForm").classList.contains("hidden"));
        } else {
            document.getElementById("loginError").classList.remove("hidden");
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

    // Inicialización
    populateFilterOptions();
