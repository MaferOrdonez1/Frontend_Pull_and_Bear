const url = 'http://localhost:3008/api/usuario/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'))
const formUsuario = document.querySelector('form')
const nombre = document.getElementById('nombre')
const tipo_documento = document.getElementById('tipo_documento')
const num_documento = document.getElementById('num_documento')
const direccion = document.getElementById('direccion')
const telefono = document.getElementById('telefono')
const email = document.getElementById('email')
const estado= document.getElementById('estado')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    nombre.value = ''
    tipo_documento.value = ''
    num_documento.value = ''
    direccion.value = ''
    telefono.value = ''
    email.value = ''
    estado.value = ''
    modalUsuario.show()
    opcion = 'crear'
})

const mostrar = (usuarios) => {
    usuarios.forEach(usuarios => {
        usuarios += `<tr>
                            <td>${usuarios.id}</td>
                            <td>${usuarios.nombre}</td>
                            <td>${usuarios.tipo_documento}</td>
                            <td>${usuarios.num_documento}</td>
                            <td>${usuarios.direccion}</td>
                            <td>${usuarios.telefono}</td>
                            <td>${usuarios.email}</td>
                            <td>${usuarios.estado}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                       </tr>
                    `    
    })  
    contenedor.innerHTML = resultados
    
}

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

let idForm = 0
on(document, 'click', '.btnEditar', e => {    
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const nombreForm = fila.children[1].innerHTML
    const tipo_documentoForm = fila.children[2].innerHTML
    const num_documentoForm = fila.children[3].innerHTML
    const direccionForm = fila.children[4].innerHTML
    const telefonoForm = fila.children[5].innerHTML
    const estadoForm = fila.children[6].innerHTML
    nombre.value =  nombreForm
    tipo_documento.value =  tipo_documentoForm
    num_documento.value =  num_documentoForm
    direccion.value =  direccionForm
    telefono.value =  telefonoForm
    estado.value =  estadoForm
    opcion = 'editar'
    modalUsuario.show()
     
})

formUsuario.addEventListener('submit', (e)=>{
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
                tipo_documento:tipo_documento.value,
                num_documento:num_documento.value,
                direccion:direccion.value,
                telefono:telefono.value,
                estado:estado.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoUsuario = []
            nuevoUsuario.push(data)
            mostrar(nuevoUsuario)
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
                tipo_documento:tipo_documento.value,
                num_documento:num_documento.value,
                direccion:direccion.value,
                telefono:telefono.value,
                estado:estado.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalUsuario.hide()
})
