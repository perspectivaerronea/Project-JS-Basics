//CONSTANTES
const SALTO = "\n";
const DOS_DECIMALES = (num) => { return Math.round(num * 100) / 100; };

//VARIABLES
let cajaMeses = document.getElementById("meses");
let montoObjetivo = document.getElementById("montoObjetivo");
let ahorroMensual = document.getElementById("ahorroMensual");
let tna = document.getElementById("tna");
let reinvertir = document.getElementById('reinvertir');
let resultado = document.getElementById('resultado');
let mes_modificado = [];

//BOTONES
let submit = document.getElementById("procesar");
let btnLimpiar = document.getElementById("limpiar");
let btnGuardar = document.getElementById("guardar");
let btnCargar = document.getElementById("cargar");
let btnCargarPrueba = document.getElementById("cargarPrueba");
let btnBorrar = document.getElementById("borrar");


class PlazoFijo {
    constructor(inversion, tna) {
        this.inversion = inversion;
        this.tna = tna;
        this.interes = 0;
    }

    getTnaMensual() {
        return this.tna / 12;
    }

    getInteres() {
        return this.interes;
    }

    calcular() {
        this.interes = DOS_DECIMALES(this.inversion * this.getTnaMensual() / 100);
    }

}

class Mes {
    constructor(inversion, ahorroAcumulado, interesAnterior, reinvertir, tna) {
        this.inversion = inversion;
        this.ahorroAcumulado = ahorroAcumulado;
        this.interesAnterior = interesAnterior;
        this.reinvertir = reinvertir;
        this.tna = tna;
        this.plazoFijo = this.crearPlazo(this.calcularMontoInversion(), tna);
    }

    setInversion(inversion) {
        this.inversion = inversion;
    }

    getInversion() {
        return DOS_DECIMALES(this.inversion);
    }

    setAhorroAcumulado(ahorroAcumulado) {
        this.ahorroAcumulado = ahorroAcumulado;
    }

    setInteresAnterior(interesAnterior) {
        this.interesAnterior = interesAnterior;
    }

    getInteresGenerado() {
        return DOS_DECIMALES(this.plazoFijo.getInteres());
    }

    getAhorroAcumulado() {
        return DOS_DECIMALES(this.ahorroAcumulado);
    }

    calcularMontoInversion() {
        let monto = this.inversion + this.ahorroAcumulado;

        monto += (this.reinvertir) ? this.interesAnterior : 0;

        return monto;
    }

    crearPlazo(inversion, tna) {
        return new PlazoFijo(inversion, tna);
    }

    reCrearPlazo() {
        this.plazoFijo = this.crearPlazo(this.calcularMontoInversion(), this.tna);
    }

    procesarMes() {
        this.plazoFijo.calcular();
    }
}

class PlanAhorro {
    constructor(objetivo, inversionMensual, reinvertir, tna) {
        this.objetivo = objetivo;
        this.inversionMensual = inversionMensual;
        this.reinvertir = reinvertir;
        this.tna = tna;
        this.falta = objetivo;
        this.interesTotal = 0;
        this.ahorroAcumulado = 0;
        this.mes = [];
    }

    getObjetivo() {
        return this.objetivo;
    }

    getMes(id) {
        return this.mes[id];
    }

    getListadoMeses(){
        return this.mes;
    }

    actualizarMeses(id) {
        let temp;
        while (this.getMeses() > id) {
            temp = this.mes.pop();
        }
    }

    getMeses() {
        return this.mes.length;
    }

    getMesActual() {
        return this.mes.length - 1;
    }

    getFalta() {
        return DOS_DECIMALES(this.falta);
    }

    resetFalta() {
        this.falta = this.objetivo;
    }

    calcularFalta(acumulado) {
        this.falta -= acumulado;
    }

    getAhorroAcumulado() {
        return DOS_DECIMALES(this.ahorroAcumulado);
    }

    resetAhorroAcumulado() {
        this.ahorroAcumulado = 0;
    }

    calcularAhorroAcumulado(acumulado) {
        this.ahorroAcumulado += acumulado;
    }

    getInteresTotal() {
        return this.interesTotal;
    }

    resetInteresTotal() {
        this.interesTotal = 0;
    }

    calcularInteresGeneradoTotal(acumulado) {
        this.interesTotal += acumulado;
    }

    nuevoMes() {
        if (this.getMeses() < 1) {
            this.mes.push(new Mes(this.inversionMensual, 0, 0, this.reinvertir, this.tna));
        } else {
            this.mes.push(new Mes(this.inversionMensual, this.ahorroAcumulado, this.mes[this.getMesActual()].getInteresGenerado(), this.reinvertir, this.tna));
        }
    }

    procesarMes(id) {

        let mesActual = this.mes[id];

        mesActual.procesarMes();

        let inversion = mesActual.getInversion();
        let interesGenerado = mesActual.getInteresGenerado();
        let monto = 0;

        monto = (this.reinvertir) ? inversion + interesGenerado : inversion;

        this.calcularAhorroAcumulado(monto);
        this.calcularFalta(monto);
        this.calcularInteresGeneradoTotal(interesGenerado);

    }

    calcularPlanAhorro() {

        this.resetAhorroAcumulado();
        this.resetFalta();
        this.resetInteresTotal();

        while (this.falta > 0) {
            this.nuevoMes();
            this.procesarMes(this.getMesActual());
        }
    }

    reCalcularPlanDeAhorro() {
        let i = 0;

        this.resetAhorroAcumulado();
        this.resetFalta();
        this.resetInteresTotal();
        while (this.falta > 0) {

            if (i < this.getMeses()) {
                this.procesarMes(i);
                if ((i + 1) < this.getMeses()) {
                    this.mes[i + 1].setAhorroAcumulado(this.getAhorroAcumulado());
                    this.mes[i + 1].setInteresAnterior(this.mes[i].getInteresGenerado());
                }
            } else {
                this.nuevoMes();
                this.procesarMes(this.getMesActual());
            }

            i++;
        }

        this.actualizarMeses(i);

    }
}

//FUNCIONES

function mensajes(icono, titulo, texto, tiempo, botonConfirmar, botonCancelar, textoConfirmar, textoCancelar) {

    if (textoConfirmar == '') {
        textoConfirmar = 'Está bien';
    }

    if (textoCancelar == '') {
        textoCancelar = ' Cancelar';
    }

    if (tiempo != 0) {
        Swal.fire({
            icon: icono,
            title: titulo,
            text: texto,
            timer: tiempo,
            showConfirmButton: botonConfirmar,
            showCancelButton: botonCancelar,
            confirmButtonText: textoConfirmar,
            cancelButtonText: textoCancelar,
            timerProgressBar: true,
        })
    } else {
        Swal.fire({
            icon: icono,
            title: titulo,
            text: texto,
            showConfirmButton: botonConfirmar,
            showCancelButton: botonCancelar,
            confirmButtonText: textoConfirmar,
            cancelButtonText: textoCancelar,
        })
    }
}


function limpiarMeses(cajaMeses) {
    //Borrar los elementos en caso que se esté reprocesando        
    if (cajaMeses.children.length > 0) {
        while (cajaMeses.hasChildNodes()) {
            cajaMeses.removeChild(cajaMeses.firstChild);
        }
    }
}

//Programa Principal
function listadoMeses(pa) {

    let cajaMeses = document.getElementById("meses");

    //Borrar los elementos en caso que se esté reprocesando        
    limpiarMeses(cajaMeses);

    for (let i = 0; i < pa.getMeses(); i++) {

        let mes = pa.getMes(i);
        let contenedorMes = document.createElement("div");
        let cambioAnio;

        // Para el més que indica un cambio de año se agrega una clase para que sea destacado
        cambioAnio = ((i + 1) % 12 == 0) ? 'cambioAnio' : '';

        if ((pa.getObjetivo() - mes.getAhorroAcumulado()) >= 0) {
            contenedorMes.innerHTML = ` <div class='flex-item ${cambioAnio}'>
                                        <div class='cabeceraMes'>
                                            <h4> Mes ${i + 1}°</h4> 
                                            <input type="checkbox" id="editar${i}" name="Editar" class="editar">
                                        </div>
                                        <form>
                                            <div>
                                                <label for="InversionMensual"> Inversión Mensual:</label>
                                                <input id="inversionMensual${i}" name="InversionMensual" value= ${mes.getInversion()} disabled>
                                            </div>
                                            <div>    
                                                <label for="GananciaAnterior"> Ganancia Anterior:</label>
                                                <input id="gananciaAnterior${i}" name="InversionMensual" value= ${mes.getInteresGenerado()} disabled>
                                            </div > 
                                            <div>    
                                            <label for="AhorroAcumulado"> Ahorro Acumulado:</label>
                                            <input id="ahorroAcumulado${i}" name="AhorroAcumulado" value= ${mes.getAhorroAcumulado()} disabled>
                                        </div > 
                                        </form >
                                    </div>`;
            cajaMeses.appendChild(contenedorMes);
        }
    }
}

function resultadoPlan(pa) {

    //limpia los resultados
    limpiarMeses(cajaMeses);

    //Borrar los elementos en caso que se esté reprocesando        
    if (resultado.children.length > 0) {
        resultado.removeChild(resultado.lastElementChild);
    }

    let parrafo = document.createElement('p');

    listadoMeses(pa);

    // PROCESAMIENTO DEL PLAZO FIJO    
    let mensaje = "El objetivo de tu plazo fijo es de un monto de $" + pa.getObjetivo() + SALTO;

    // EN BASE A LA CANTIDAD DE MESES QUE LLEVE LLEGAR AL OBJETIVO CAMBIA EL MENSAJE QUE SE MUESTRA AL USUARIO
    submensaje = (pa.getMeses() == 1) ? 'mes' : 'meses';

    // MENSAJE DE RESULTADO
    mensaje += 'Vas a lograr tu objetivo en ' + pa.getMeses() + ' ' + submensaje + ' con un ahorro total de $' + pa.getAhorroAcumulado() + '.';

    // SE LE MUESTRA AL USUARIO EL RESULTADO DEL PROCESAMIENTO
    let texto = document.createTextNode(mensaje);
    parrafo.appendChild(texto);
    resultado.appendChild(parrafo);

    let Editar = document.querySelectorAll(".editar");
    for (const ed of Editar) {
        ed.addEventListener("change", toggleEdicion);
    }
}

function creaPlan(montoObjetivo, ahorroMensual, decision, tna) {

    let pa = new PlanAhorro(parseFloat(montoObjetivo), parseFloat(ahorroMensual), decision, parseFloat(tna));

    pa.calcularPlanAhorro();

    resultadoPlan(pa);

    PlanAhorroTemp = pa;

    mensajes('success', 'Generación Completa', 'Se generó con éxito el plan de ahorro.', 1500, false, false, '', '');

    btnLimpiar.disabled = false;
    btnGuardar.disabled = false;
}


function valoresPrueba() {
    localStorage.setItem('montoObjetivoPrueba', JSON.stringify('1000000'));
    localStorage.setItem('ahorroMensualPrueba', JSON.stringify('35000'));
    localStorage.setItem('tnaPrueba', JSON.stringify('41.5'));
    localStorage.setItem('reinvertirPrueba', JSON.stringify('true'));
}


function cargarValoresPrueba() {

    let decision = false;

    //Si hay datos guardados disparo la generación del plan
    montoObjetivo.value = JSON.parse(localStorage.getItem('montoObjetivoPrueba'));
    ahorroMensual.value = JSON.parse(localStorage.getItem('ahorroMensualPrueba'));
    tna.value = JSON.parse(localStorage.getItem('tnaPrueba'));
    reinvertir.checked = (JSON.parse(localStorage.getItem('reinvertirPrueba')) == 'true');


    //VALIDACIONES
    if (!(validacion(montoObjetivo))) { return false; }
    if (!(validacion(ahorroMensual))) { return false; }
    if (!(validacion(tna))) { return false; }

    decision = (reinvertir.checked) ? true : false;

    //limpia los resultados
    limpiarMeses(cajaMeses);

    //Borrar los elementos en caso que se esté reprocesando        
    if (resultado.children.length > 0) {
        resultado.removeChild(resultado.lastElementChild);
    }

    //Genera el plan asociado a los valores que se habían almacenado
    creaPlan(montoObjetivo.value, ahorroMensual.value, decision, tna.value);

    mensajes('info', 'Carga Valores de Prueba', 'Se cargó un caso de ejemplo para probar la funcionalidad.', 1500, false, false, '', '');
}

function validacion(obj) {
    let claseError = 'incompleto';
    obj.classList.remove(claseError);
    if (obj.value == "") {
        obj.focus();
        obj.classList.add(claseError);

        mensajes('error', 'Dato Requerido', 'Falta definir un valor para este campo.', 0, true, false, '', '');

        return false;
    }
    return true;
}

function actualizarValor() {
    let parrafo = document.createElement('p');
    let num = (this.id).replace('inversionMensual', '');
    let monto = this;

    Swal.fire({
        icon: 'warning',
        title: 'Actualización del Plan de Ahorro',
        text: '¿Quiere recalcular el plan de ahorro con el valor modificado?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '¡sí! Actualizalo',
        cancelButtonText: 'Pensandolo mejor, no lo actualices',
    }).then(function (res) {
        if (res.isDismissed) {

            let mes = PlanAhorroTemp.getMes(num);

            monto.value = mes.getInversion();
        } else {

            let mes = PlanAhorroTemp.getMes(num);

            mes.setInversion(parseFloat(monto.value));
            mes.reCrearPlazo();

            document.getElementById('gananciaAnterior' + num).value = mes.getInteresGenerado();
            document.getElementById('ahorroAcumulado' + num).value = mes.getAhorroAcumulado();

            PlanAhorroTemp.reCalcularPlanDeAhorro();

            resultadoPlan(PlanAhorroTemp);

            mensajes('success', 'Actualización del Plan de Ahorro', 'Se Actualizó el plan en base al cambio que se realizó en el mes.', 1000, false, false, '', '');
        }
    })
}

function toggleEdicion() {
    let valor = this.checked;
    let num = (this.id).replace('editar', '');
    let mesIM = document.getElementById("inversionMensual" + num);
    mesIM.disabled = !valor;

    mesIM.addEventListener("change", actualizarValor);

}

/*
Función general que se dispara al crear el plan de ahorro
*/
function armarPlanDeAhorro(e) {
    let decision = false;

    //Evito funcionamiento estandar
    e.preventDefault();

    //VALIDACIONES
    if (!(validacion(montoObjetivo))) { return false; }
    if (!(validacion(ahorroMensual))) { return false; }
    if (!(validacion(tna))) { return false; }

    decision = (reinvertir.checked) ? true : false;

    //Borrar los elementos en caso que se esté reprocesando        
    if (resultado.children.length > 0) {
        resultado.removeChild(resultado.lastElementChild);
    }

    creaPlan(montoObjetivo.value, ahorroMensual.value, decision, tna.value);
}

//Limpia el formulario y todo lo demás.
function limpiar() {
    Swal.fire({
        icon: 'question',
        title: 'Limpar Plan de Ahorro',
        text: '¿Quiere borrar el plan de ahorro actual?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Limpiá todo por favor',
        cancelButtonText: 'Mejor no, lo estoy revisando todavía',
    }).then(function (res) {
        if (!(res.isDismissed)) {
            montoObjetivo.value = '';
            ahorroMensual.value = '';
            tna.value = '';
            reinvertir.checked = false;

            limpiarMeses(cajaMeses);

            //Borrar los elementos en caso que se esté reprocesando        
            if (resultado.children.length > 0) {
                resultado.removeChild(resultado.lastElementChild);
            }

            btnLimpiar.disabled = true;
            btnGuardar.disabled = true;
        }
    })
}

//Guarda el objeto que se pasa como parametro en formato JSON dentro del local storage
function guardarJSON(obj) {
    let enJSON = JSON.stringify(obj.value);
    localStorage.setItem(obj.id, enJSON);
}

//Recupera del JSON el valor almacenado
function cargarJSON(obj) {
    return JSON.parse(localStorage.getItem(obj.id));
}

function borrarGuardado() {
    localStorage.clear();
    valoresPrueba();

    btnCargar.disabled = true;
    btnBorrar.disabled = true;
}

//Guardar Plan
function guardarPlan() {

    reinvertir.value = (reinvertir.checked) ? 'true' : 'false';

    //JSON
    guardarJSON(montoObjetivo);
    guardarJSON(ahorroMensual);
    guardarJSON(tna);
    guardarJSON(reinvertir);

    btnCargar.disabled = false;
    btnBorrar.disabled = false;
}

//Carga Plan, dispara el procesamiento si es que hay algún valor guardado
function cargarPlan() {
    let decision = false;

    //Si hay datos guardados disparo la generación del plan    
    montoObjetivo.value = cargarJSON(montoObjetivo) || 0;
    ahorroMensual.value = cargarJSON(ahorroMensual) || 0;
    tna.value = cargarJSON(tna) || 0;
    reinvertir.checked = (cargarJSON(reinvertir) == 'true') ? true : false;    

    //VALIDACIONES
    if (!(validacion(montoObjetivo))) { return false; }
    if (!(validacion(ahorroMensual))) { return false; }
    if (!(validacion(tna))) { return false; }

    if (cargarJSON(montoObjetivo) != null) {
        decision = (reinvertir.checked) ? true : false;

        //limpia los resultados
        limpiarMeses(cajaMeses);

        //Borrar los elementos en caso que se esté reprocesando        
        if (resultado.children.length > 0) {
            resultado.removeChild(resultado.lastElementChild);
        }

        //Genera el plan asociado a los valores que se habían almacenado
        creaPlan(montoObjetivo.value, ahorroMensual.value, decision, tna.value);

    }

}

let PlanAhorroTemp = new PlanAhorro(parseFloat(0), parseFloat(0), false, parseFloat(0));

//EVENTOS 

//PROCESAR 
submit.addEventListener("click", armarPlanDeAhorro);

//LIMPIAR
btnLimpiar.addEventListener("click", limpiar);

//GUARDAR
btnGuardar.addEventListener("click", guardarPlan);

//CARGAR
btnCargar.addEventListener("click", cargarPlan);

//CREA VALORES DE PRUEBA EN EL LOCAL STORAGE
valoresPrueba();

//CARGAR VALORES DE PRUEBA
btnCargarPrueba.addEventListener("click", cargarValoresPrueba);

//BORRAR DATOS GUARDADOS
btnBorrar.addEventListener("click", borrarGuardado);

//Si bien todos los botones especiales como 'limpiar', 'guardar', 'cargar', 'borrar datos guardados' arrancan en estado disabled
//evaluo si ya existe alguna de las variables en el storage, y de ser así, habilito los campos correspondientes. 
//¡IMPORTANTE! <-- Este código evalua por el localstorage de las variables generadas por el usuario, NO por los valores de prueba
if (cargarJSON(montoObjetivo) != null) {
    btnCargar.disabled = false;
    btnBorrar.disabled = false;
}