const url = 'http://localhost:3000/api/articulos/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalMovimiento = new bootstrap.Modal(document.getElementById('modalMovimiento'))
const formMovimiento = document.querySelector('form')
const fecha = document.getElementById('fecha')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    fecha.value = ''
    modalMovimiento.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (movimiento) => {
    movimiento.forEach(movimiento => {
        resultados += `<tr>
                            <td>${movimiento.id}</td>
                            <td>${movimiento.fecha}</td>
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
    const fechaForm = fila.children[1].innerHTML
    fecha.value =  fechaForm
    opcion = 'editar'
    modalMovimiento.show()
})

//Procedimiento para Crear y Editar
formMovimiento.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                fecha:fecha.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoMovimiento = []
            nuevoMovimiento.push(data)
            mostrar(nuevoMovimiento)
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
                fecha:fecha.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalMovimiento.hide()
})