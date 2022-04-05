let data_input = document.getElementById('data_input');
let data_output = document.getElementById('data_output');
let submit = document.getElementById('submit');
let fInicio_input = document.getElementById('fechaInicial');
let fFinal_input = document.getElementById('fechaFinal');
let hInicio_input = document.getElementById('horaInicial');
let hFinal_input = document.getElementById('horaFinal');
data_output.classList.add('data_output');
data_output.setAttribute('id','data_output');

let fechaInicial;
let fechaFinal;

let razonCambio = "sobreflujo de vehiculos";
let currentDirection = "Norte-Sur";
let timeSkip = 30;

let accidente = false;
let razonesCambios =["Mantenimiento Áreas Verdes","Mantenimiento Sistemas Eléctricos","Reparaciones menores en vía","Colisiones","Cierres Preventivos","Manifestaciones"];
const semana = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
const mes = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function between(x, min, max) {
    return x >= min && x <= max;
}

class horarioTrafico{
    constructor(inicioHora, finalHora, trafico){
        this.inicioHora = inicioHora;
        this.finalHora = finalHora;
        this.trafico = trafico;
    }
}

class densidadVehicular{
    constructor(dias, sentido, horariosTrafico){
        this.dias = dias;
        this.sentido = sentido;
        this.horariosTrafico = horariosTrafico;

    }
}

class tiempoPromedio{
    constructor(dias, sentido, tiempoCola){
        this.dias = dias;
        this.sentido = sentido;        
        this.tiempoCola = tiempoCola;
    }
}

let densidad_Vehicular = [

    new densidadVehicular("Lunes-Viernes", "Norte-Sur", [new horarioTrafico(6,9,119),new horarioTrafico(11.5,13,105),new horarioTrafico(17,19.5,120)]),
    new densidadVehicular("Lunes-Viernes", "Sur-Norte", [new horarioTrafico(6,9,117),new horarioTrafico(11.5,13,98),new horarioTrafico(17,21,70)]),

    new densidadVehicular("Sabado-Domingo", "Norte-Sur", [new horarioTrafico(13,15,107),new horarioTrafico(18,20,80)]),
    new densidadVehicular("Sabado-Domingo", "Sur-Norte", [new horarioTrafico(7,9.5,105),new horarioTrafico(16.5,22,54)])

];

let tiempo_Promedio = [

    new tiempoPromedio("Lunes-Viernes", "Norte-Sur",18),
    new tiempoPromedio("Lunes-Viernes", "Sur-Norte",6),
    new tiempoPromedio("Sabado-Domingo", "Norte-Sur",8),
    new tiempoPromedio("Sabado-Domingo", "Sur-Norte",0)

]

function checkCurrentSchedule(currentDay, currentHour){

    if(between(currentDay, 1,5)) currentSchedule = "Lunes-Viernes"

    if(currentDay > 5 || currentDay < 1) currentSchedule = "Sabado-Domingo"

    let carros_via = carrosVia(currentHour,currentSchedule);

    let sentido = checkCurrentDirection(carros_via);
    
    return{
        currentSchedule, carros_via, sentido
    };
    
}

function carrosVia(currentHour, currentSchedule){
    let densidades = densidad_Vehicular.filter( densidad => densidad.dias == currentSchedule);
    let vehiculos = [0,0];
    densidades.forEach((element, x) => {

        let horario = element.horariosTrafico;

        for(let i = 0; i < horario.length; i++) {
            if(currentHour >= horario[i].inicioHora && currentHour <= horario[i].finalHora){
                vehiculos[x] = horario[i].trafico;
                
                break;
            }
        }
    });
    return vehiculos;
}

function RNG(min, max) {
    return Math.random() * (max - min) + min;
}


function checkCurrentDirection(vehiculos){
    let direction = currentDirection;
    
    if(vehiculos[0]>vehiculos[1]){
        direction = "Norte-Sur"
    }else direction = "Sur-Norte";

    return {shouldChange:direction!=currentDirection, direction}
}

Date.prototype.addMinutes = function(minutes) {
    this.setMinutes(this.getMinutes() + minutes);
}

function doSims5(fechaInicia,fechaFinal){
    let arrayAccidentes = "";
    while(fechaFinal>fechaInicia){

        let currentDay = fechaInicia.getDay();
        let currentHour = fechaInicia.getHours();
        let currentSchedule;

        let datos = checkCurrentSchedule(currentDay, currentHour);

        currentSchedule = datos.currentSchedule;
        let carros_via = datos.carros_via;

        let sentido = datos.sentido.direction;
        let shouldChange = datos.sentido.shouldChange;


        let randomNumber = RNG(0,100);
        chanceAccidentNS = (350/43800)*100
        chanceAccidentSN = (179/43800)*100
        
        let accidentes = false;

        if(currentDirection=="Norte-Sur"){
            accidentes = randomNumber<=chanceAccidentSN;
        }else accidentes = randomNumber<=chanceAccidentNS;

        if(accidentes){
            shouldChange = true;
        }
        if(shouldChange){
            
            currentDirection = sentido;
            if(accidentes){

                razonCambio = razonesCambios[parseInt(RNG(0,6))];

                arrayAccidentes+=[
                
                    '<div class="fechaResultado">En la Fecha: '+semana[fechaInicia.getDay()]+" "+fechaInicia.getDay()+" de "+mes[fechaInicia.getMonth()]+" entre "+currentSchedule+", A la hora "+fechaInicia.getHours()+":"+fechaInicia.getMinutes()+' se hizo un cambio de sentido a la direccion '+sentido+" debido ha "+razonCambio+' </div>',                 
                
                ];
            }else{
                arrayAccidentes+=[
                
                    '<div class="fechaResultado">En la Fecha: '+semana[fechaInicia.getDay()]+" "+fechaInicia.getDay()+" de "+mes[fechaInicia.getMonth()]+" entre "+currentSchedule+", A la hora "+fechaInicia.getHours()+":"+fechaInicia.getMinutes()+' se hizo un cambio de sentido a la direccion '+sentido+" debido ha "+razonCambio+' </div>',                 
                
                ];
            }
            arrayAccidentes+="<br>";
            arrayAccidentes+="<br>";
        }
        console.log(arrayAccidentes);
        fechaInicia.addMinutes(timeSkip);
    }
    data_output.innerHTML = arrayAccidentes
    console.log(arrayAccidentes);
}

submit.addEventListener("click",()=>{

    if(fInicio_input.value && hInicio_input.value && fFinal_input.value && hFinal_input.value){
        let inicioFecha = fInicio_input.value
        let inicioHora = hInicio_input.value
        let dateStringA = inicioFecha+"T"+inicioHora+":00"

        let finalFecha = fFinal_input.value
        let finalHora = hFinal_input.value
        let dateStringB = finalFecha+"T"+finalHora+":00"

        console.log(dateStringA);
        console.log(dateStringB);

        fechaInicial = new Date(dateStringA)
        fechaFinal = new Date(dateStringB)

        doSims5(fechaInicial,fechaFinal);
    }else alert("Error. Faltan Valores por ingresar, ingrese todos los campos por favor")
});
 
