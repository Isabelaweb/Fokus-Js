const taskListContainer = document.querySelector('.app__section-task-list')
const formTask = document.querySelector('.app__form-add-task')
const toggleFormTaskBtn = document.querySelector('.app__button--add-task')
const formLabel = document.querySelector('.app__form-label')
const btnCancel = document.querySelector('.app__form-footer__button--cancel')
const btnDeleted = document.querySelector('.app__form-footer__button--delete')
const bntDeletedAll = document.querySelector('.btn-remover-todas')
const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas')
const textArea = document.querySelector('.app__form-textarea')
const localStorageTarefas = localStorage.getItem('tarefas')
const taskAtiveDescription = document.querySelector('.app__section-active-task-description')
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : []

const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`
let tarefaSelecionada = null
let itemTarefaSelecionada = null

let tarefaEmEdicao = null
let paragraphEmEdicao = null

const selecionaTarefa = (tarefa, elemento) => {
    if(tarefa.completed){
        return
    }

document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
    button.classList.remove('app__section-task-list-item-active')
})

if (tarefaSelecionada == tarefa) {
    taskAtiveDescription.textContent = null
    itemTarefaSelecionada = null
    tarefaSelecionada = null
    return
}

tarefaSelecionada = tarefa
itemTarefaSelecionada = elemento
taskAtiveDescription.textContent = tarefa.description
elemento.classList.add('app__section-task-list-item-active')
}


const limparForm = () => {
    tarefaEmEdicao = null
    paragraphEmEdicao = null
    textArea.value = ''
    formTask.classList.add('hidden')
}
const selecionaTarefaParaEditar = (tarefa, elemento) => {
    if(tarefaEmEdicao == tarefa) {
        limparForm()
        return
    }
    formLabel.textContent = 'Editando tarefa'
    tarefaEmEdicao = tarefa
    paragraphEmEdicao = elemento
    textArea.value = tarefa.description
    formTask.classList.remove('hidden')
}


function createTask(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = taskIconSvg

    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')

    paragraph.textContent = tarefa.description

     const button = document.createElement('button')

     button.classList.add('app_button-edit')

     const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')

    button.appendChild(editIcon)

    button.addEventListener('click', (event) => {
        event.stopPropagation()
        selecionaTarefaParaEditar(tarefa,paragraph)
    })


    li.onclick = () =>{
        selecionaTarefa(tarefa, li)
    }



    svgIcon.addEventListener('click', (event) => {
        if(tarefa==tarefaSelecionada){
            event.stopPropagation()
            button.setAttribute('disabled', true )
            li.classList.add('app__section-task-list-item-complete')
            tarefaSelecionada.completed = true
            updateLocalStorage()
        }
    })

    if(tarefa.completed){
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }
    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button) // aqui
    return li
}

tarefas.forEach(task => {
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
})

toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando Tarefa'
    formTask.classList.toggle('hidden')

})

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault()
    if(tarefaEmEdicao){
        tarefaEmEdicao.description = textArea.value
        paragraphEmEdicao.textContent = textArea.value
    } else {
        const task = {
            description: textArea.value,
            completed: false
    
        }
        tarefas.push(task)
        const taskItem = createTask(task)
        taskListContainer.appendChild(taskItem)
        textArea.value = ''
    
    }
   
    updateLocalStorage()
})

btnCancel.addEventListener('click', () => {
    formTask.classList.add('hidden')
    textArea.value = ''
})

btnDeleted.addEventListener('click', () => {
    if(tarefaSelecionada){
        const index = tarefas.indexOf(tarefaSelecionada) 

        if(index !=-1){
            tarefas.slice(index, 1)
        }
        itemTarefaSelecionada.remove()
        tarefas.filter(t=> t!= tarefaSelecionada)
        itemTarefaSelecionada = null
        tarefaSelecionada = null
    }

    updateLocalStorage()
    limparForm()
})



document.addEventListener('TarefaFinalizada', function (e) {
    if(tarefaSelecionada){
        tarefaSelecionada.completed = true
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
        updateLocalStorage()
    } 
})


