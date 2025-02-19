const horarioData = {
    "horarioClase": [
        {
            "id": 1,
            "codCurso": "BIF01",
            "nomCurso": "Biología General",
            "secCurso": "A",
            "docente": "Dr. Juan Pérez",
            "teopra": "T/P",
            "hora": "08:00-10:00",
            "dia": "LU",
            "semestre": "1er Semestre"
        },
        {
            "id": 2,
            "codCurso": "MAT02",
            "nomCurso": "Matemáticas I",
            "secCurso": "B",
            "docente": "Ing. Laura Gómez",
            "teopra": "T",
            "hora": "10:00-12:00",
            "dia": "MI",
            "semestre": "1er Semestre"
        },
        {
            "id": 3,
            "codCurso": "FIS03",
            "nomCurso": "Física para Ingeniería",
            "secCurso": "C",
            "docente": "Dr. Pedro Sánchez",
            "teopra": "P",
            "hora": "14:00-16:00",
            "dia": "VI",
            "semestre": "2do Semestre"
        },
        {
            "id": 4,
            "codCurso": "INF04",
            "nomCurso": "Introducción a la Programación",
            "secCurso": "D",
            "docente": "Prof. María Rodríguez",
            "teopra": "T/P",
            "hora": "16:00-18:00",
            "dia": "JU",
            "semestre": "1er Semestre"
        },
        {
            "id": 5,
            "codCurso": "HIS05",
            "nomCurso": "Historia de la Ciencia",
            "secCurso": "A",
            "docente": "Lic. Andrés Flores",
            "teopra": "T",
            "hora": "08:00-10:00",
            "dia": "MA",
            "semestre": "2do Semestre"
        }
    ]
};

const diaMapping = {
    'LU': 'LUNES',
    'MA': 'MARTES',
    'MI': 'MIERCOLES',
    'JU': 'JUEVES',
    'VI': 'VIERNES',
    'SA': 'SABADO',
    'DO': 'DOMINGO'
};

const days = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
const timeGrid = document.getElementById('timeGrid');

// Crear slots de tiempo y columnas para días
for (let hour = 7; hour <= 23; hour++) {
    const timeSlot = document.createElement('div');
    timeSlot.className = 'time-slot time-label';
    timeSlot.textContent = `${hour.toString().padStart(2, '0')}:00`;
    timeGrid.appendChild(timeSlot);

    for (let i = 0; i < 7; i++) {
        const daySlot = document.createElement('div');
        daySlot.className = 'time-slot day-column';
        daySlot.setAttribute('data-day', days[i]);
        timeGrid.appendChild(daySlot);
    }
}

function timeToPixels(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours - 7) * 60 + minutes;
}

function getColumnWidth() {
    const dayColumn = document.querySelector('.day-column');
    return dayColumn.offsetWidth;
}

window.addEventListener('load', () => {
    const columnWidth = getColumnWidth();
    const headerHeight = document.querySelector('.header-row').offsetHeight;

    horarioData.horarioClase.forEach(clase => {
        const classBlock = document.createElement('div');
        classBlock.className = 'class-block';
        
        const diaCompleto = diaMapping[clase.dia];
        const [horaInicio, horaFin] = clase.hora.split('-');
        
        const top = timeToPixels(horaInicio);
        const height = timeToPixels(horaFin) - timeToPixels(horaInicio);
        
        const column = document.querySelector(`.day-column[data-day="${diaCompleto}"]`);
        const columnRect = column.getBoundingClientRect();
        const gridRect = timeGrid.getBoundingClientRect();
        const leftOffset = columnRect.left - gridRect.left;

        classBlock.style.top = `${top + headerHeight}px`;
        classBlock.style.height = `${height}px`;
        classBlock.style.width = `${columnWidth - 2}px`;
        classBlock.style.left = `${leftOffset}px`;
        
        classBlock.innerHTML = `
            <div class="class-code">${clase.codCurso} - ${clase.teopra}</div>
            <div class="class-name">${clase.nomCurso}</div>
            <div class="class-section">
                <span>Sección: ${clase.secCurso}</span>
                <span>${clase.semestre}</span>
            </div>
            <div class="class-teacher">${clase.docente}</div>
        `;
        
        document.querySelector('.schedule-grid').appendChild(classBlock);
    });
});

window.addEventListener('resize', () => {
    document.querySelectorAll('.class-block').forEach(block => block.remove());
    const event = new Event('load');
    window.dispatchEvent(event);
});

/**------------------ */
document.getElementById("Años").addEventListener('change', Datos);

function Datos() {
    Clear();

    fetch('HorarioJS.json')
    .then(function(dat) {
        return dat.json();
    })
    .then(function(resp) {
        let semestre = document.getElementById("Años").value;

        resp.forEach(data => {
            if (data.CodigoD == 8161078 && data.Semestre == semestre) {
                horarios.push(data);
            }
        });
        console.log(horarios);
        cal_tabla();
    });
}
