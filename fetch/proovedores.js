const url = 'http://localhost:3008/api/Proveedores/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalProovedores = new bootstrap.Modal(document.getElementById('modalProovedores'))
const formProovedores = document.querySelector('form')
const nombre = document.getElementById('nombre')
const fecha = document.getElementById('fecha')
const ciudad = document.getElementById('ciudad')
const estado = document.getElementById('estado')
const direccion = document.getElementById('direccion')
const telefono = document.getElementById('telefono')
const email = document.getElementById('email')
const pais = document.getElementById('pais')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    nombre.value = ''
    fecha.value = ''
    ciudad.value = ''
    estado.value = ''
    direccion.value = ''
    telefono.value = ''
    email.value = ''
    pais.value = ''
    modalProovedores.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (proovedores) => {
    proovedores.forEach(proovedores => {
        resultados += `<tr>
                            <td>${proovedores.id}</td>
                            <td>${proovedores.nombre}</td>
                            <td>${proovedores.fecha}</td>
                            <td>${proovedores.ciudad}</td>
                            <td>${proovedores.estado}</td>
                            <td>${proovedores.direccion}</td>
                            <td>${proovedores.telefono}</td>
                            <td>${proovedores.email}</td>
                            <td>${proovedores.pais}</td>
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
    const fechaForm = fila.children[2].innerHTML
    const ciudadForm = fila.children[3].innerHTML
    const estadoForm = fila.children[4].innerHTML
    const direccionForm = fila.children[5].innerHTML
    const telefonoForm = fila.children[6].innerHTML
    const emailForm = fila.children[7].innerHTML
    const paisForm = fila.children[8].innerHTML
    nombre.value =  nombreForm
    fecha.value =  fechaForm
    ciudad.value =  ciudadForm
    estado.value =  estadoForm
    direccion.value =  direccionForm
    telefono.value =  telefonoForm
    email.value =  emailForm
    pais.value =  paisForm
    opcion = 'editar'
    modalProovedores.show()
})

//Procedimiento para Crear y Editar
formProovedores.addEventListener('submit', (e)=>{
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
                fecha:fecha.value,
                ciudad:ciudad.value,
                estado:estado.value,
                direccion:direccion.value,
                telefono:telefono.value,
                email:email.value,
                pais:pais.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoProovedores = []
            nuevoProovedores.push(data)
            mostrar(nuevoProovedores)
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
                fecha:fecha.value,
                ciudad:ciudad.value,
                estado:estado.value,
                direccion:direccion.value,
                telefono:telefono.value,
                email:email.value,
                pais:pais.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalProovedores.hide()
})