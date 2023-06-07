const url = 'http://localhost:3008/api/detalle_ingreso/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalDetalle_ingreso = new bootstrap.Modal(document.getElementById('modalEntrada'))
const formDetalle_ingreso = document.querySelector('form')
const cantidad = document.getElementById('cantidad')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    cantidad.value = ''
    modalDetalle_ingreso.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (detalleingreso) => {
    detalleingreso.forEach(detalleingreso => {
        resultados += `<tr>
                            <td>${detalleingreso.id}</td>
                            <td>${detalleingreso.cantidad}</td>
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
    const cantidadForm = fila.children[1].innerHTML
    cantidad.value =  cantidadForm
    opcion = 'editar'
    modalDetalle_ingreso.show()
    
})

//Procedimiento para Crear y Editar
formDetalle_ingreso.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                cantidad:cantidad.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoDetalleingreso = []
            nuevoDetalleingreso.push(data)
            mostrar(nuevoDetalleingreso)
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
                cantidad:cantidad.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalDetalle_ingreso.hide()
})