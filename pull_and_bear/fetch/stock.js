const url = 'http://localhost:3000/api/articulos/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalStock = new bootstrap.Modal(document.getElementById('modalStock'))
const formStock = document.querySelector('form')
const stock_reservado = document.getElementById('stock_reservado')
const stock_fisico = document.getElementById('stock_fisico')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    stock_reservado.value = ''
    stock_fisico.value = ''
    modalStock.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (stock) => {
    stock.forEach(stock => {
        resultados += `<tr>
                            <td>${stock.id}</td>
                            <td>${stock.stock_reservado}</td>
                            <td>${stock.stock_fisico}</td>
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
    const stock_reservadoForm = fila.children[1].innerHTML
    const stock_fisicoForm = fila.children[2].innerHTML
    stock_reservado.value =  stock_reservadoForm
    stock_fisico.value =  stock_fisicoForm
    opcion = 'editar'
    modalRol.show()
     
})

//Procedimiento para Crear y Editar
formStock.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                stock_reservado:stock_reservado.value,
                stock_fisico:stock_fisico.value
                
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoStock = []
            nuevoStock.push(data)
            mostrar(nuevoStock)
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
                stock_reservado:stock_reservado.value,
                stock_fisico:stock_fisico.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalStock.hide()
})