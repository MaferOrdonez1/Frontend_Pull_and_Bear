const url = 'http://localhost:3000/api/articulos/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalCamiones = new bootstrap.Modal(document.getElementById('modalCamiones'))
const formCamiones = document.querySelector('form')
const marca = document.getElementById('marca')
const num_marca = document.getElementById('num_marca')
const color = document.getElementById('color')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    marca.value = ''
    num_marca.value = ''
    color.value = ''
    modalCamiones.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (camiones) => {
    camiones.forEach(camiones => {
        resultados += `<tr>
                            <td>${camiones.id}</td>
                            <td>${camiones.marca}</td>
                            <td>${camiones.num_marca}</td>
                            <td>${camiones.color}</td>
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
    const marcaForm = fila.children[1].innerHTML
    const num_marcaForm = fila.children[2].innerHTML
    const colorForm = fila.children[3].innerHTML
    marca.value =  marcaForm
    num_marca.value =  num_marcaForm
    color.value =  colorForm
    opcion = 'editar'
    modalCamiones.show()
    
})

//Procedimiento para Crear y Editar
formCamiones.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                marca:marca.value,
                num_marca:num_marca.value,
                color:color.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoCamiones = []
            nuevoCamiones.push(data)
            mostrar(nuevoCamiones)
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
                marca:marca.value,
                num_marca:num_marca.value,
                color:color.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalCamiones.hide()
})