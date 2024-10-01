document.addEventListener('DOMContentLoaded', function () {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Load stored tasks on page load
    loadTodos();

    // Add new task
    addBtn.addEventListener('click', () => {
        const task = todoInput.value.trim();
        if (task !== "") {
            const newTodo = { id: Date.now(), task, completed: false };
            todos.push(newTodo);
            saveAndRender();
            todoInput.value = ''; // Clear input
        }
    });

    // Handle task completion and delete
    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.parentElement.dataset.id);
            todos = todos.filter(todo => todo.id !== id);
            saveAndRender();
        }

        if (e.target.classList.contains('complete-btn')) {
            const id = parseInt(e.target.parentElement.dataset.id);
            todos = todos.map(todo => {
                if (todo.id === id) todo.completed = !todo.completed;
                return todo;
            });
            saveAndRender();
        }

        if (e.target.classList.contains('edit-btn')) {
            const li = e.target.parentElement;
            const id = parseInt(li.dataset.id);
            const task = li.querySelector('span').textContent;
            const editInput = document.createElement('input');
            editInput.className = 'edit-input';
            editInput.value = task;
            li.innerHTML = '';
            li.appendChild(editInput);
            editInput.focus();

            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const updatedTask = editInput.value.trim();
                    todos = todos.map(todo => {
                        if (todo.id === id) todo.task = updatedTask;
                        return todo;
                    });
                    saveAndRender();
                }
            });
        }
    });

    // Filter tasks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            renderTodos(filter);
        });
    });

    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    function loadTodos() {
        renderTodos();
    }

    function renderTodos(filter = 'all') {
        todoList.innerHTML = '';
        let filteredTodos = todos;

        if (filter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        } else if (filter === 'pending') {
            filteredTodos = todos.filter(todo => !todo.completed);
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;
            li.innerHTML = `
                <span>${todo.task}</span>
                <button class="complete-btn">${todo.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;
            todoList.appendChild(li);
        });
    }
});
