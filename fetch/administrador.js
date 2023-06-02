const url = 'http://localhost:3000/api/articulos/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalAdministrador = new bootstrap.Modal(document.getElementById('modalAdministrador'))
const formAdministrador = document.querySelector('form')
const nombre = document.getElementById('nombre')
const apellido = document.getElementById('apellido')
const telefono = document.getElementById('telefono')
const edad = document.getElementById('edad')
const domicilio = document.getElementById('domicilio')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    nombre.value = ''
    apellido.value = ''
    telefono.value = ''
    edad.value = ''
    domicilio.value = ''
    modalAdministrador.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (administrador) => {
    administrador.forEach(administrador => {
        resultados += `<tr>
                            <td>${administrador.id}</td>
                            <td>${administrador.nombre}</td>
                            <td>${administrador.apellido}</td>
                            <td>${administrador.telefono}</td>
                            <td>${administrador.edad}</td>
                            <td>${administrador.domicilio}</td>
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
    const apellidoForm = fila.children[2].innerHTML
    const telefonoForm = fila.children[3].innerHTML
    const edadForm = fila.children[4].innerHTML
    const domicilioForm = fila.children[5].innerHTML
    nombre.value =  nombreForm
    apellido.value =  apellidoForm
    telefono.value =  telefonoForm
    edad.value =  edadForm
    domicilio.value =  domicilioForm
    opcion = 'editar'
    modalAdministrador.show()
    
})

//Procedimiento para Crear y Editar
formProducto.addEventListener('submit', (e)=>{
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
                apellido:apellido.value,
                telefono:telefono.value,
                edad:edad.value,
                domicilio:domicilio.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoAdministrador = []
            nuevoAdministrador.push(data)
            mostrar(nuevoAdministrador)
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
                apellido:apellido.value,
                telefono:telefono.value,
                edad:edad.value,
                domicilio:domicilio.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalAdministrador.hide()
})