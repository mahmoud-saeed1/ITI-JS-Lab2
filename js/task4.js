/*~~~~~$ Selectors $~~~~~*/
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

/*~~~~~$ Global Variables $~~~~~*/
let todos = JSON.parse(localStorage.getItem('todos')) || [];

/*~~~~~$ Handlers $~~~~~*/
todoForm.addEventListener('submit', addTodoItem);
document.addEventListener('DOMContentLoaded', renderTodoList);

/*~~~~~$ Validation $~~~~~*/

// ? Function to validate task input
function validateTask(task) {
  return task.trim() !== '';
}

/*~~~~~$ Utility $~~~~~*/

// ? Function to add a new todo item
function addTodoItem(event) {
    event.preventDefault();
    const task = todoInput.value.trim();

    if (!validateTask(task)) {
        alert('Task cannot be empty.');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: task
    };

    todos.push(newTask);
    todoInput.value = '';
    saveTodos();
    renderTodoList();
}

// ? Function to render the todo list
function renderTodoList() {
    todoList.innerHTML = '';

    todos.forEach(task => {
        const listItem = document.createElement('li');
        listItem.textContent = task.text;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTodoItem(task.id));
        listItem.appendChild(deleteButton);
        todoList.appendChild(listItem);
    });
}

// ? Function to delete a todo item
function deleteTodoItem(id) {
    todos = todos.filter(task => task.id !== id);
    saveTodos();
    renderTodoList();
}

// ? Function to save todos to local storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// ? Initial render
renderTodoList();
