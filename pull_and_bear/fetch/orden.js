const url = 'http://localhost:3000/api/articulos/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalOrden = new bootstrap.Modal(document.getElementById('modalOrden'))
const formOrden = document.querySelector('form')
const fecha = document.getElementById('fecha')
const descripcion = document.getElementById('descripcion')
const total = document.getElementById('total')
const balance = document.getElementById('balance')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    fecha.value = ''
    descripcion.value = ''
    total.value = ''
    balance.value = ''
    modalOrden.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (orden) => {
    orden.forEach(orden => {
        resultados += `<tr>
                            <td>${orden.id}</td>
                            <td>${orden.fecha}</td>
                            <td>${orden.descripcion}</td>
                            <td>${orden.total}</td>
                            <td>${orden.balance}</td>
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
    const descripcionForm = fila.children[3].innerHTML
    const totalForm = fila.children[4].innerHTML
    const balanceForm = fila.children[5].innerHTML
    fecha.value =  fechaForm
    descripcion.value =  descripcionForm
    total.value =  totalForm
    balance.value =  balanceForm
    opcion = 'editar'
    modalOrden.show()
})

//Procedimiento para Crear y Editar
formOrden.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                    fecha:fecha.value,
                    descripcion:descripcion.value,
                    total:total.value,
                    balance:balance.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoOrden = []
            nuevoOrden.push(data)
            mostrar(nuevoOrden)
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
                fecha:fecha.value,
                descripcion:descripcion.value,
                total:total.value,
                balance:balance.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalOrden.hide()
})