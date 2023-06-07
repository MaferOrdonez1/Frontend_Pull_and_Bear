const url = 'http://localhost:3008/api/productos/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'))
const formProducto = document.querySelector('form')
const nombre = document.getElementById('nombre')
const descripcion = document.getElementById('descripcion')
const precio = document.getElementById('precio')
const costo = document.getElementById('costo')
const talla = document.getElementById('talla')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    nombre.value = ''
    descripcion.value = ''
    precio.value = ''
    costo.value = ''
    talla.value = ''
    modalProducto.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (producto) => {
    producto.forEach(producto => {
        resultados += `<tr>
                            <td>${producto.id}</td>
                            <td>${producto.descripcion}</td>
                            <td>${producto.precio}</td>
                            <td>${producto.costo}</td>
                            <td>${producto.talla}</td>
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
    const descripcionForm = fila.children[2].innerHTML
    const precioForm = fila.children[3].innerHTML
    const costoForm = fila.children[4].innerHTML
    const tallaForm = fila.children[5].innerHTML
    nombre.value =  nombreForm
    descripcion.value =  descripcionForm
    precio.value =  precioForm
    costo.value =  costoForm
    talla.value =  tallaForm
    opcion = 'editar'
    modalProducto.show()
     
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
                descripcion:descripcion.value,
                precio:precio.value,
                costo:costo.value,
                talla:talla.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoProducto = []
            nuevoProducto.push(data)
            mostrar(nuevoProducto)
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
                descripcion:descripcion.value,
                precio:precio.value,
                costo:costo.value,
                talla:talla.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalProducto.hide()
})