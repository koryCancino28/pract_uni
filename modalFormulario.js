document.addEventListener("DOMContentLoaded", function () {
    recopilar_datos_docente();
});
let datosArray = {
    domicilios: [],
    familiares: []
};
// VARIABLES PARA EL MODAL FAMILIAR
const abrirModalFamiliarBtn = document.querySelector('.AbrirModalFamiliar');
const cerrarModalFamiliarBtn = document.querySelector('.CerrarModalFamiliar');
const guardarModalFamiliarBtn = document.querySelector('.GuardarInfoFamiliar');
const modalFamiliar = document.getElementById('miModalF');
const tablaFamiliares = document.querySelector('.TablaFamiliar tbody');

// VARIABLES PARA EL MODAL DOMICILIO
const modal = document.getElementById("miModal");
const botonModal = document.querySelector(".AbrirModal");
const botonGuardar = document.querySelector(".GuardarInfo");
const botonCancelar = document.querySelector(".CancelarInfo");
const tabla = document.querySelector("#DOM tbody");
let filaActual = null;

// FETCH PARA OBTENER LOS DATOS DEL JSON
async function recopilar_datos_docente() {
    try {
        const response = await fetch('DatosFormulario.json');
        const data = await response.json();
        datosArray = data; // Asigna todos los datos recibidos
        console.log(datosArray);
    } catch (error) {
        console.error('Error fetching the JSON:', error);
    }
    llenar_datos();
}

function llenar_datos() {
    if (!datosArray || Object.keys(datosArray).length === 0) {
        console.warn("No hay datos para mostrar.");
        return;
    }

    document.getElementById('MostrarNombre').innerHTML = datosArray.Nombres || '';
    document.getElementById('MostrarDNI').innerHTML = datosArray.DNI || '';

    const inputs = {
        'Sexo': datosArray.Sexo || '',
        'FechaNacimiento': datosArray.FechaNacimiento || '',
        'DNI': datosArray.DNI || '',
        'TelefonoFijo': (datosArray.TelefonoFijo || []).join(" "),
        'Celular': (datosArray.Celular || []).join(" "),
        'RUC': datosArray.RUC || '',
        'GrupoSanguineo': datosArray.GrupoSanguineo || '',
        'Email': (datosArray.Email || []).join(" "),
        'PaisN': datosArray.PaisN || '',
        'DepartamentoN': datosArray.DepartamentoN || '',
        'ProvinciaN': datosArray.ProvinciaN || '',
        'DistritoN': datosArray.DistritoN || ''
    };

    for (const [id, value] of Object.entries(inputs)) {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.value = value;

            // AGREGAR EVENT LISTENER PARA ACTUALIZAR EL ARREGLO
            inputElement.addEventListener('input', (event) => {
                const inputId = event.target.id;
                const inputValue = event.target.value;

                if (['TelefonoFijo', 'Celular', 'Email'].includes(inputId)) {
                    datosArray[inputId] = inputValue.split(" ");
                } else {
                    datosArray[inputId] = inputValue;
                }
                console.log(datosArray);
            });
        }
    }

    // LLENAR TABLA DE DOMICILIOS
    const tabla = document.getElementById('DOM').getElementsByTagName('tbody')[0];
    tabla.innerHTML = ''; // LIMPIAR TABLA ANTES DE LLENARLA

    (datosArray.domicilios || []).forEach((domicilio, index) => {
        const nuevaFila = tabla.insertRow();

        nuevaFila.insertCell(0).innerText = index + 1;
        nuevaFila.insertCell(1).innerText = domicilio.Pais || '';
        nuevaFila.insertCell(2).innerText = domicilio.Departamento || '';
        nuevaFila.insertCell(3).innerText = domicilio.Provincia || '';
        nuevaFila.insertCell(4).innerText = domicilio.Distrito || '';
        nuevaFila.insertCell(5).innerText = domicilio.TipoVia || '';
        nuevaFila.insertCell(6).innerText = domicilio.NombreVia || '';
        nuevaFila.insertCell(7).innerText = domicilio.Tipo || '';
        nuevaFila.insertCell(8).innerText = domicilio.Numero || '';
        nuevaFila.insertCell(9).innerText = domicilio.TipoZona || '';
        nuevaFila.insertCell(10).innerText = domicilio.NombreZona || '';
        nuevaFila.insertCell(11).innerHTML = '<button type="button" class="Editar">Editar</button>'+"<br><br>" +'<button type="button" class="Eliminar">Eliminar</button>';

        asignarEventosBtns(nuevaFila);
    });
}

/* FUNCIONES PARA EL MODAL FAMILIAR */

/* ABRE EL MODAL DE FAMILIARES */
abrirModalFamiliarBtn.onclick = function (event) {
    event.preventDefault();
    modalFamiliar.style.display = "flex";
};

/* CIERRA EL MODAL FAMILIAR Y LO LIMPIA*/
cerrarModalFamiliarBtn.onclick = function (event) {
    event.preventDefault();
    limpiarFormulario(modalFamiliar);
    modalFamiliar.style.display = "none";
};

/* GUARDA LA INFORMACIÓN INTRODUCIDA DEL MODAL Y LA MUESTRA EN LA TABLA */
guardarModalFamiliarBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const datosFamiliar = obtenerDatosFormularioFamiliar();

    /* MENSAJE DE ERROR POR CUANDO LOS CAMPOS ESTAN INCOMPLETOS */
    if (!datosFamiliar) {
        alert('Por favor, complete todos los campos antes de guardar.');
        return;
    }

    if (!datosArray.familiares) {
        datosArray.familiares = []; // Inicializa el array si no existe
    }
    datosArray.familiares.push(datosFamiliar);
    console.log(datosArray);
    if (filaActual) {
        actualizarFilaFamiliar(filaActual, datosFamiliar);
    } else {
        const filaDisponible = buscarFilaVacia(tablaFamiliares) || crearNuevaFilaFamiliar();
        actualizarFilaFamiliar(filaDisponible, datosFamiliar);
    }

    cerrarModalFamiliar()
});

/* FUNCIONES PARA EL MODAL DOMICILIO */

/* ABRE EL MODAL DOMICILIO */
botonModal.onclick = function (event) {
    event.preventDefault();
    modal.style.display = "flex";
};

/* CIERRA EL MODAL DOMICILIO */
botonCancelar.onclick = function (event) {
    event.preventDefault();
    cerrarModal();
};

/* GUARDA LA INFORMACIÓN DEL MODAL Y LA MUESTRA EN LA TABLA DOMICILIO */
botonGuardar.addEventListener('click', function (event) {
    event.preventDefault();
    const datos = obtenerDatosFormulario();

    if (!datos) {
        alert('Por favor, complete todos los campos antes de guardar.');
        return;
    }

    if (!datosArray.domicilios) {
        datosArray.domicilios = []; // Inicializa el array si no existe
    }
    datosArray.domicilios.push(datos);

    console.log(datosArray);
    if (filaActual) {
        actualizarFila(filaActual, datos);
    } else {
        const filaDisponible = buscarFilaVacia(tabla) || crearNuevaFila();
        actualizarFila(filaDisponible, datos);
    }

    cerrarModal();
});

/* LIMPIA LOS DATOS DEL FORMULARIO QUE PROVIENEN DEL MODAL */

function limpiarFormulario(modal) {
    modal.querySelectorAll('input').forEach(input => {
        if (input.type === 'radio') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
}

/* FUNCION PARA OBTENER LOS DATOS DEL FORMULARIO DOMICILIO */
function obtenerDatosFormulario() {
    const pais = document.getElementById('Pais').value.trim();
    const departamento = document.getElementById('Departamento').value.trim();
    const provincia = document.getElementById('Provincia').value.trim();
    const distrito = document.getElementById('Distrito').value.trim();
    const tipoVia = document.getElementById('TipoVia').value.trim();
    const nombreVia = document.getElementById('NombreVia').value.trim();
    const tipo = document.getElementById('Tipo').value.trim();
    const numeroInmueble = document.getElementById('NumeroInmueble').value.trim();
    const tipoZona = document.getElementById('TipoZona').value.trim();
    const nombreZona = document.getElementById('NombreZona').value.trim();

    /* CONDICIÓN DE QUE TODOS LOS CAMPOS DEBEN ESTAR COMPLETOS */
    if (!pais || !departamento || !provincia || !distrito || !tipoVia ||
        !nombreVia || !tipo || !numeroInmueble || !tipoZona || !nombreZona) {
        return null;
    }
    /* DEVUELVE CON LOS VALORES INGRESADOS */
    return {
        pais, departamento, provincia, distrito, tipoVia, nombreVia,
        tipo, numeroInmueble, tipoZona, nombreZona
    };
}

/* FUNCION PARA OBTENER LOS DATOS DEL FORMULARIO FAMILIAR */
function obtenerDatosFormularioFamiliar() {
    const nombres = document.getElementById('nombres').value.trim();
    const parentesco = document.getElementById('parentesco').value.trim();
    const fechaNacimiento = document.getElementById('fechaNacimiento').value.trim();
    const estadoCivil = document.getElementById('estadoCivil').value.trim();
    const nivelEstudios = document.getElementById('nivelEstudios').value.trim();
    const ocupacion = document.getElementById('ocupacion').value.trim();
    const dependencia = document.querySelector('input[name="dependencia"]:checked')?.value || '';

    /* CONDICIÓN DE QUE TODOS LOS CAMPOS DEBEN ESTAR COMPLETOS */
    if (!nombres || !parentesco || !fechaNacimiento || !estadoCivil || !nivelEstudios || !ocupacion) {
        return null;
    }
    if (!dependencia) {
        alert('Debe seleccionar si el familiar depende económicamente de usted.');
        return null;
    }

    /* DEVUELVE CON LOS VALORES INGRESADOS */
    return { nombres, parentesco, fechaNacimiento, estadoCivil, nivelEstudios, ocupacion, dependencia };
}
// FUNCION PARA BUSCAR UNA FILA VACIA EN LA TABLA DOMICILIO
function buscarFilaVacia(table) {
    for (let fila of table.rows) {
        if (!fila.cells[1].textContent) {
            return fila;
        }
    }
    return null;
}

/* CREA UNA NUEVA FILA EN LA TABLA DOMICILIO */
function crearNuevaFila() {
    const nuevaFila = tabla.insertRow();
    for (let i = 0; i < 12; i++) nuevaFila.insertCell();
    return nuevaFila;
}

/* CREAR UNA NUEVA FILA EN LA TABLA FAMILIAR */
function crearNuevaFilaFamiliar() {
    const nuevaFila = tablaFamiliares.insertRow();
    for (let i = 0; i < 9; i++) nuevaFila.insertCell();
    return nuevaFila;
}

/* FUNCIÓN PARA ACTUALIZAR UNA FILA EN LA TABLA DOMICILIO */
function actualizarFila(fila, datos) {
    fila.cells[0].textContent = Array.from(tabla.rows).indexOf(fila) + 1;
    fila.cells[1].textContent = datos.pais;
    fila.cells[2].textContent = datos.departamento;
    fila.cells[3].textContent = datos.provincia;
    fila.cells[4].textContent = datos.distrito;
    fila.cells[5].textContent = datos.tipoVia;
    fila.cells[6].textContent = datos.nombreVia;
    fila.cells[7].textContent = datos.tipo;
    fila.cells[8].textContent = datos.numeroInmueble;
    fila.cells[9].textContent = datos.tipoZona;
    fila.cells[10].textContent = datos.nombreZona;
    fila.cells[11].innerHTML = '<button type="button" class="Editar">Editar</button>' + "<br><br>" + '<button type="button" class="Eliminar">Eliminar</button>';

    asignarEventosBtns(fila);
}

function actualizarFilaFamiliar(fila, datos) {
    fila.cells[0].textContent = Array.from(tablaFamiliares.rows).indexOf(fila) + 1;
    fila.cells[1].textContent = datos.nombres;
    fila.cells[2].textContent = datos.parentesco;
    fila.cells[3].textContent = datos.fechaNacimiento;
    fila.cells[4].textContent = datos.estadoCivil;
    fila.cells[5].textContent = datos.nivelEstudios;
    fila.cells[6].textContent = datos.ocupacion;
    fila.cells[7].textContent = datos.dependencia ? 'Sí' : 'No';
    fila.cells[8].innerHTML = '<button type="button" class="Editar">Editar</button>' + "<br><br>" + '<button type="button" class="Eliminar">Eliminar</button>';

    asignarEventosBtnsFamiliar(fila);
}

/* FUNCIÓN PARA ASIGNAR EVENTO DE EDICIÓN A UNA FILA EN LA TABLA DOMICILIO */
function asignarEventosBtns(fila) {
    fila.querySelector(".Editar").onclick = function () {
        editarFila(fila);
    };

    fila.querySelector(".Eliminar").onclick = function () {
        indice = fila.cells[0].textContent - 1;
        datosArray.domicilios.splice(indice, 1);

        fila.remove();

        let filas = tabla.rows;
        for (let i = 0; i < filas.length; i++) {
            filas[i].cells[0].textContent = i + 1;
        }

    }

}

/*BOTONES FAMILIARES */

function asignarEventosBtnsFamiliar(fila) {
    fila.querySelector(".Editar").onclick = function () {
        editarFilaFamiliar(fila);
    };

    fila.querySelector(".Eliminar").onclick = function () {
        indice = fila.cells[0].textContent - 1;
        datosArray.familiares.splice(indice, 1);

        fila.remove();

        let filas = tablaFamiliares.rows;
        for (let i = 0; i < filas.length; i++) {
            filas[i].cells[0].textContent = i + 1;
        }

    }

}

/* FUNCIÓN PARA EDITAR UNA FILA EN LA TABLA DOMICILIO */
function editarFila(fila) {
    filaActual = fila;
    document.getElementById('Pais').value = fila.cells[1].textContent;
    document.getElementById('Departamento').value = fila.cells[2].textContent;
    document.getElementById('Provincia').value = fila.cells[3].textContent;
    document.getElementById('Distrito').value = fila.cells[4].textContent;
    document.getElementById('TipoVia').value = fila.cells[5].textContent;
    document.getElementById('NombreVia').value = fila.cells[6].textContent;
    document.getElementById('Tipo').value = fila.cells[7].textContent;
    document.getElementById('NumeroInmueble').value = fila.cells[8].textContent;
    document.getElementById('TipoZona').value = fila.cells[9].textContent;
    document.getElementById('NombreZona').value = fila.cells[10].textContent;

    modal.style.display = 'flex';
}

/* FUNCIÓN PARA EDITAR UNA FILA EN LA TABLA FAMILIA */
function editarFilaFamiliar(fila) {
    filaActual = fila;
    document.getElementById('nombres').value = fila.cells[1].textContent;
    document.getElementById('parentesco').value = fila.cells[2].textContent;
    document.getElementById('fechaNacimiento').value = fila.cells[3].textContent;
    document.getElementById('estadoCivil').value = fila.cells[4].textContent;
    document.getElementById('nivelEstudios').value = fila.cells[5].textContent;
    document.getElementById('ocupacion').value = fila.cells[6].textContent;

    const dependencia = fila.cells[7].textContent;
    const radios = document.querySelectorAll('input[name="dependencia"]');
    radios.forEach(radio => {
        if (radio.value === dependencia) {
            radio.checked = true;
        }
    });

    modalFamiliar.style.display = 'flex';

}

/* FUNCIÓN PARA CERRAR EL MODAL DOMICILIO */
function cerrarModal() {
    limpiarFormulario(modal);
    filaActual = null;
    modal.style.display = 'none';
}

function cerrarModalFamiliar() {
    limpiarFormulario(modalFamiliar);
    filaActual = null;
    modalFamiliar.style.display = 'none';
}



//SCRIPT PARA CONFIGURAR E IMPLEMENTAR FOTO - TEXTO

/* VARIABLES PARA LOS ELEMENTOS DE FOTO Y TEXTO */
const archivoInput = document.getElementById('archivo');
const fotoPreview = document.getElementById('fotoPreview');
const actualizarBtn = document.getElementById('actualizarBtn');
const guardarDatosBtn = document.getElementById('guardarDatos');
const inputsOcultos = document.getElementById('inputsOcultos');

/* VARIABLES PARA LOS ELEMENTOS DE NOMBRE Y DNI */
const Mostrarnombre = document.getElementById('MostrarNombre');
const Mostrardni = document.getElementById('MostrarDNI');

/* VARIABLES PARA LOS CAMPOS DE NOMBRE Y DNI (OCULTOS) */
const nombreInput = document.getElementById('OcultarNombre');
const dniInput = document.getElementById('OcultarDNI');


/*FUNCIONALIDAD PARA SELECCIONAR Y MOSTRAR LA FOTO */

/* EVENTO PARA PREVISUALIZAR LA FOTO AL DARLE CLICK, ABRE EL INPUT DE ARCHIVO */
fotoPreview.addEventListener('click', () => {
    archivoInput.click();
});

/* EVENTO QUE SE ACTIVA AL SELECCIONAR UN ARCHIVO EN EL INPUT */
archivoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            fotoPreview.innerHTML = `<img src="${e.target.result}" alt="Foto">`;
        };
        reader.readAsDataURL(file);
    }
});



// Función para listar domicilios en el HTML
function listarDomicilios() {
    const contenedor = document.getElementById("listaDomicilios");
    contenedor.innerHTML = "";
    datosArray.domicilios.forEach(domicilio => {
        const item = document.createElement("div");
        item.innerHTML = `${domicilio.calle} ${domicilio.numero}, ${domicilio.ciudad}, ${domicilio.pais} 
            <button onclick="editarDomicilio(${domicilio.id})">Editar</button>
            <button onclick="eliminarDomicilio(${domicilio.id})">Eliminar</button>`;
        contenedor.appendChild(item);
    });
}

// Función para listar familiares en el HTML
function listarFamiliares() {
    const contenedor = document.getElementById("listaFamiliares");
    contenedor.innerHTML = "";
    datosArray.familiares.forEach(familiar => {
        const item = document.createElement("div");
        item.innerHTML = `${familiar.nombre} (${familiar.parentesco})
            <button onclick="editarFamiliar(${familiar.id})">Editar</button>
            <button onclick="eliminarFamiliar(${familiar.id})">Eliminar</button>`;
        contenedor.appendChild(item);
    });
}

// Función para agregar un domicilio
function agregarDomicilio(calle, numero, ciudad, pais) {
    const nuevoId = Date.now();
    datosArray.domicilios.push({ id: nuevoId, calle, numero, ciudad, pais });
    listarDomicilios();
}

// Función para editar un domicilio
function editarDomicilio(id) {
    const index = datosArray.domicilios.findIndex(d => d.id === id);
    if (index !== -1) {
        datosArray.domicilios[index].calle = prompt("Nueva calle", datosArray.domicilios[index].calle);
        datosArray.domicilios[index].numero = prompt("Nuevo número", datosArray.domicilios[index].numero);
        datosArray.domicilios[index].ciudad = prompt("Nueva ciudad", datosArray.domicilios[index].ciudad);
        datosArray.domicilios[index].pais = prompt("Nuevo país", datosArray.domicilios[index].pais);
        listarDomicilios();
    }
}

// Función para eliminar un domicilio
function eliminarDomicilio(id) {
    datosArray.domicilios = datosArray.domicilios.filter(d => d.id !== id);
    listarDomicilios();
}

// Función para agregar un familiar
function agregarFamiliar(nombre, parentesco) {
    const nuevoId = Date.now();
    datosArray.familiares.push({ id: nuevoId, nombre, parentesco });
    listarFamiliares();
}

// Función para editar un familiar
function editarFamiliar(id) {
    const index = datosArray.familiares.findIndex(f => f.id === id);
    if (index !== -1) {
        datosArray.familiares[index].nombre = prompt("Nuevo nombre", datosArray.familiares[index].nombre);
        datosArray.familiares[index].parentesco = prompt("Nuevo parentesco", datosArray.familiares[index].parentesco);
        listarFamiliares();
    }
}

// Función para eliminar un familiar
function eliminarFamiliar(id) {
    datosArray.familiares = datosArray.familiares.filter(f => f.id !== id);
    listarFamiliares();
}

// Eventos keyUp para datos personales
const inputsPersonales = document.querySelectorAll(".datos-personales input");
inputsPersonales.forEach(input => {
    input.addEventListener("keyup", () => {
        console.log(`Campo ${input.name}: ${input.value}`);
    });
});

