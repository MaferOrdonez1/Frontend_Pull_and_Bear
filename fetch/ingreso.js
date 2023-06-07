const url = 'http://localhost:3008/api/ingreso/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalIngreso = new bootstrap.Modal(document.getElementById('modalIngreso'))
const formIngreso = document.querySelector('form')
const tipo_comprobante = document.getElementById('tipo_comprobante')
const serie_comprobante = document.getElementById('serie_comprobante')
const num_comprobante = document.getElementById('num_comprobante')
const fecha_hora = document.getElementById('fecha_hora')
const impuesto = document.getElementById('impuesto')
const total_compra = document.getElementById('total_compra')
const estado = document.getElementById('estado')
const tipo = document.getElementById('tipo')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    tipo_comprobante.value = ''
    serie_comprobante.value = ''
    num_comprobante.value = ''
    fecha_hora.value = ''
    impuesto.value = ''
    total_compra.value = ''
    estado.value = ''
    tipo.value = ''
    modalIngreso.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (ingreso) => {
    ingreso.forEach(ingreso => {
        resultados += `<tr>
                            <td>${ingreso.id}</td>
                            <td>${ingreso.tipo_comprobante }</td>
                            <td>${ingreso.serie_comprobante}</td>
                            <td>${ingreso.num_comprobante}</td>
                            <td>${ingreso.fecha_hora}</td>
                            <td>${ingreso.impuesto}</td>
                            <td>${ingreso.total_compra}</td>
                            <td>${ingreso.estado}</td>
                            <td>${ingreso.tipo}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                       </tr>
                    `    
    })
    contenedor.innerHTML = resultados
    
}   

//Procedimiento Mostrar
fetch(url)
    .then( response => response.json() )
    .then( data => mostrar(data) )
    .catch( error => console.log(error))

  
const on = (element, event, selector, handler) => {
    //console.log(element)
    //console.log(event)
    //console.log(selector)
    //console.log(handler)
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

//Procedimiento Borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("This is a confirm dialog.",
    function(){
        fetch(url+id, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
        //alertify.success('Ok')
    },
    function(){
        alertify.error('Cancel')
    })
})

//Procedimiento Editar
let idForm = 0
on(document, 'click', '.btnEditar', e => {    
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const tipo_comprobanteForm = fila.children[1].innerHTML
    const serie_comprobanteForm = fila.children[2].innerHTML
    const num_comprobanteForm = fila.children[3].innerHTML
    const fecha_horaForm = fila.children[4].innerHTML
    const impuestoForm = fila.children[5].innerHTML
    const total_compraForm = fila.children[6].innerHTML
    const estadoForm = fila.children[7].innerHTML
    const tipoForm = fila.children[8].innerHTML
    tipo_comprobante.value =  tipo_comprobanteForm
    serie_comprobante.value =  serie_comprobanteForm
    num_comprobante.value =  num_comprobanteForm
    fecha_hora.value =  fecha_horaForm
    impuesto.value =  impuestoForm
    total_compra.value =  total_compraForm
    estado.value =  estadoForm
    tipo.value =  tipoForm
    opcion = 'editar'
    modalIngreso.show()

})

//Procedimiento para Crear y Editar
formIngreso.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({

                tipo_comprobante:tipo_comprobante.value,
                serie_comprobante:serie_comprobante.value,
                num_comprobante:num_comprobante.value,
                fecha_hora:fecha_hora.value,
                impuesto:impuesto.value,
                total_compra:total_compra.value,
                estado:estado.value,
                tipo:tipo.value

            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoIngreso = []
            nuevoIngreso.push(data)
            mostrar(nuevoIngreso)
        })
    }
    if(opcion=='editar'){    
        //console.log('OPCION EDITAR')
        fetch(url+idForm,{
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                tipo_comprobante:tipo_comprobante.value,
                serie_comprobante:serie_comprobante.value,
                num_comprobante:num_comprobante.value,
                fecha_hora:fecha_hora.value,
                impuesto:impuesto.value,
                total_compra:total_compra.value,
                estado:estado.value,
                tipo:tipo.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalIngreso.hide()
})