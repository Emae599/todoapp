const apiBase = window.LARAVEL_API_BASE || '/api';

async function fetchTasks() {
  const res = await fetch(`${apiBase}/tasks`);
  return await res.json();
}

let isCreatingTask = false;

async function createTask(payload) {
  const res = await fetch(`${apiBase}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

async function updateTask(id, payload) {
  const res = await fetch(`${apiBase}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

async function deleteTask(id) {
  await fetch(`${apiBase}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
  });
}

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.id = `card-${item.id}`;

  card.innerHTML = `
        <button class="delete-btn">
            <i class="fas fa-times"></i>
        </button>
        <button class="edit-btn" title="Edit">
            <i class="fas fa-pen"></i>
        </button>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
    `;

  card.querySelector('.delete-btn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(item.id);
      await renderCards();
    }
  });

  card.querySelector('.edit-btn').addEventListener('click', () => {
    startInlineEdit(card, item);
  });

  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);
  return card;
}

function startInlineEdit(card, item) {
  card.draggable = false;
  card.classList.add('editing');

  const originalHTML = card.innerHTML;
  card.innerHTML = `
    <div class="edit-form">
      <label>
        <span style="display:none">Title</span>
        <input type="text" class="edit-title" value="${escapeHtml(item.title)}" />
      </label>
      <label>
        <span style="display:none">Description</span>
        <textarea class="edit-description">${escapeHtml(item.description)}</textarea>
      </label>
      <label>
        <span style="display:none">Status</span>
        <select class="edit-status">
          <option value="todo" ${item.status === 'todo' ? 'selected' : ''}>To Do</option>
          <option value="inprogress" ${item.status === 'inprogress' ? 'selected' : ''}>In Progress</option>
          <option value="done" ${item.status === 'done' ? 'selected' : ''}>Done</option>
        </select>
      </label>
      <div style="display:flex; gap:8px; margin-top:10px;">
        <button class="btn-primary save-edit">Save</button>
        <button class="btn-secondary cancel-edit">Cancel</button>
      </div>
    </div>
  `;

  card.querySelector('.cancel-edit').addEventListener('click', () => {
    card.innerHTML = originalHTML;
    card.draggable = true;
    card.classList.remove('editing');
    // Reattach handlers since we restored original HTML
    card.querySelector('.delete-btn').addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this task?')) {
        await deleteTask(item.id);
        await renderCards();
      }
    });
    card.querySelector('.edit-btn').addEventListener('click', () => {
      startInlineEdit(card, item);
    });
  });

  let isSavingEdit = false;
  const saveBtn = card.querySelector('.save-edit');
  card.querySelector('.save-edit').addEventListener('click', async () => {
    if (isSavingEdit) return;
    const title = card.querySelector('.edit-title').value.trim();
    const description = card.querySelector('.edit-description').value.trim();
    const status = card.querySelector('.edit-status').value;

    if (!title || !description) {
      alert('Please fill in title and description');
      return;
    }

    try {
      isSavingEdit = true;
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
      await updateTask(item.id, { title, description, status });
    } finally {
      isSavingEdit = false;
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
    }
    await renderCards();
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function renderCards() {
  const todoCards = document.getElementById('todo-cards');
  const inprogressCards = document.getElementById('inprogress-cards');
  const doneCards = document.getElementById('done-cards');

  todoCards.innerHTML = '';
  inprogressCards.innerHTML = '';
  doneCards.innerHTML = '';

  const items = await fetchTasks();
  items.forEach(item => {
    const card = createCard(item);
    switch(item.status) {
      case 'todo':
        todoCards.appendChild(card);
        break;
      case 'inprogress':
        inprogressCards.appendChild(card);
        break;
      case 'done':
        doneCards.appendChild(card);
        break;
    }
  });
}

async function addTask(e) {
  e.preventDefault();
  const titleInput = document.getElementById('taskTitle');
  const descriptionInput = document.getElementById('taskDescription');
  const statusInput = document.getElementById('taskStatus');
  const addBtn = document.getElementById('addTaskBtn');

  if (!titleInput.value.trim() || !descriptionInput.value.trim()) {
    alert('Please fill in all fields');
    return;
  }

  if (isCreatingTask) return;
  isCreatingTask = true;
  addBtn.disabled = true;
  addBtn.textContent = 'Saving...';

  try {
    await createTask({
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      status: statusInput.value,
    });
  } finally {
    isCreatingTask = false;
    addBtn.disabled = false;
    addBtn.textContent = 'Add Task';
  }

  await renderCards();
  titleInput.value = '';
  descriptionInput.value = '';
  statusInput.value = 'todo';
}

function handleDragStart(e) {
  e.target.classList.add('dragging');
  e.dataTransfer.setData('text/plain', e.target.id);
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
}

document.querySelectorAll('.column').forEach(column => {
  column.addEventListener('dragover', e => {
    e.preventDefault();
    const draggingCard = document.querySelector('.dragging');
    if (draggingCard) {
      column.querySelector('.cards').appendChild(draggingCard);
    }
  });

  column.addEventListener('drop', async e => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    const itemId = parseInt(cardId.split('-')[1]);
    const newStatus = column.id;
    await updateTask(itemId, { status: newStatus });
  });
});

document.getElementById('addTaskBtn').addEventListener('click', addTask);
renderCards();



