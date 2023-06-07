const url = 'http://localhost:3008/api/metodo_pago/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalMetodo_pago = new bootstrap.Modal(document.getElementById('modalMetodo_pago'))
const formMetodo_pago = document.querySelector('form')
const nombre = document.getElementById('nombre')
const validacion = document.getElementById('validacion')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    nombre.value = ''
    validacion.value = ''
    modalMetodo_pago.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (metodo_pago) => {
    metodo_pago.forEach(metodo_pago => {
        resultados += `<tr>
                            <td>${metodo_pago.id}</td>
                            <td>${metodo_pago.nombre}</td>
                            <td>${metodo_pago.validacion}</td>
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
    const nombreForm = fila.children[1].innerHTML
    const validacionForm = fila.children[2].innerHTML
    nombre.value =  nombreForm
    validacion.value =  validacionForm
    opcion = 'editar'
    modalMetodo_pago.show()
})

//Procedimiento para Crear y Editar
formMetodo_pago.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                nombre:nombre.value,
                validacion:validacion.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoMetodo_pago = []
            nuevoMetodo_pago.push(data)
            mostrar(nuevoMetodo_pago)
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
                nombre:nombre.value,
                validacion:validacion.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalMetodo_pago.hide()
})