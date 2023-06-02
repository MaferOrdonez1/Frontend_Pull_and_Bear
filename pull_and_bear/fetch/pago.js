const url = 'http://localhost:3000/api/articulos/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalPago = new bootstrap.Modal(document.getElementById('modalPago'))
const formPago = document.querySelector('form')
const pago = document.getElementById('pago')
const fecha = document.getElementById('fecha')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    pago.value = ''
    fecha.value = ''
    modalPago.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (administrador) => {
    administrador.forEach(administrador => {
        resultados += `<tr>
                            <td>${administrador.id}</td>
                            <td>${administrador.pago}</td>
                            <td>${administrador.fecha}</td>
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
    const pagoForm = fila.children[1].innerHTML
    const fechaForm = fila.children[2].innerHTML
    pago.value =  pagoForm
    fecha.value =  fechaForm
    opcion = 'editar'
    modalPago.show()
    
})

//Procedimiento para Crear y Editar
formPago.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                pago:pago.value,
                fecha:fecha.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoPago = []
            nuevoPago.push(data)
            mostrar(nuevoPago)
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
                pago:pago.value,
                fecha:fecha.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalPago.hide()
})