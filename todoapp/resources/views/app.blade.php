<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Todo List App</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="container">
        <h1>Todo List App</h1>
        <div class="add-task-form">
            <input type="text" id="taskTitle" placeholder="Task title" required>
            <textarea id="taskDescription" placeholder="Task description" required></textarea>
            <select id="taskStatus">
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
            </select>
            <button id="addTaskBtn" class="btn-primary">
                <i class="fas fa-plus"></i> Add Task
            </button>
        </div>
        <div class="board">
            <div class="column" id="todo">
                <h2><i class="fas fa-list"></i> To Do</h2>
                <div class="cards" id="todo-cards"></div>
            </div>
            <div class="column" id="inprogress">
                <h2><i class="fas fa-spinner"></i> In Progress</h2>
                <div class="cards" id="inprogress-cards"></div>
            </div>
            <div class="column" id="done">
                <h2><i class="fas fa-check-circle"></i> Done</h2>
                <div class="cards" id="done-cards"></div>
            </div>
        </div>
    </div>
    <script src="/app.js"></script>
    <script src="/script.js"></script>
    <script>
      window.LARAVEL_API_BASE = '/api';
    </script>
</body>
</html>



