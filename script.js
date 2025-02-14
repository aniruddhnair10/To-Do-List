
document.addEventListener('DOMContentLoaded', () => {
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Load tasks from local storage
    loadTasks();

    // Check local storage for dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = 'Light Mode';
    }

    addTaskButton.addEventListener('click', addTaskHandler);

    newTaskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTaskHandler();
        }
    });

    taskList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            event.target.parentElement.remove();
            saveTasks();
        } else if (event.target.type === 'checkbox') {
            event.target.parentElement.classList.toggle('task-complete');
            saveTasks();
        } else if (event.target.classList.contains('task-text')) {
            editTask(event.target);
        }
    });

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.textContent = 'Light Mode';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.textContent = 'Dark Mode';
        }
    });

    function addTaskHandler() {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            newTaskInput.value = '';
            newTaskInput.focus();
            saveTasks();
        }
    }

    function addTask(taskText) {
        const li = document.createElement('li');

        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.classList.add('task-text');

        label.appendChild(checkbox);
        label.appendChild(taskSpan);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.classList.add('delete-btn');

        li.appendChild(label);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    function editTask(taskSpan) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = taskSpan.textContent;
        taskSpan.replaceWith(input);
        input.focus();

        input.addEventListener('blur', () => {
            taskSpan.textContent = input.value.trim() || taskSpan.textContent;
            input.replaceWith(taskSpan);
            saveTasks();
        });

        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                input.blur();
            }
        });
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.querySelector('input[type="checkbox"]').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text);
            if (task.completed) {
                const li = taskList.lastElementChild;
                li.querySelector('input[type="checkbox"]').checked = true;
                li.querySelector('label').classList.add('task-complete');
            }
        });
    }
});
