<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learn HTML</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
    <h1>Lorem, ipsum dolor.</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, placeat?</p>
    <a href="https://wa.me/2127089898?text=hello-world">
    <i class="fa-brands fa-whatsapp" style="color: green;font-size:30px;position:absolute;right:20px;bottom:10px"></i>
    </a>
    <i class="fa-brands fa-facebook"></i>

    <div id="app">
      <h2>Todo List</h2>
      <div class="header">
        <input id="taskInput" class="new-task" placeholder="Add a new task...">
        <button id="addBtn" class="add-task">Add</button>
      </div>
      <ul id="taskList" class="task-list"></ul>
      <div class="footer">
        <div id="count" class="task-count"></div>
        <button id="clearCompleted" class="clear-completed">Clear Completed</button>
        <div class="filters">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="active">Active</button>
          <button class="filter-btn" data-filter="completed">Completed</button>
        </div>
      </div>
    </div>

    <script>
      (function(){
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');
  const countEl = document.getElementById('count');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));

  const STORAGE_KEY = 'todo.tasks';
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  let filter = 'all';

  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render(){
    taskList.innerHTML = '';
    const filtered = tasks.filter(t => {
      if(filter === 'all') return true;
      if(filter === 'active') return !t.completed;
      return t.completed;
    });

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.innerHTML = `
        <div class="task-left">
          <button class="check ${task.completed ? 'checked' : ''}" data-id="${task.id}" title="Toggle"></button>
          <div class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</div>
        </div>
        <div>
          <button class="delete-btn" data-id="${task.id}" title="Delete">&times;</button>
        </div>
      `;
      taskList.appendChild(li);
    });

    const remaining = tasks.filter(t => !t.completed).length;
    countEl.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;
  }

  function addTask(text){
    const trimmed = text.trim();
    if(!trimmed) return;
    tasks.unshift({ id: Date.now().toString(), text: trimmed, completed: false });
    save();
    render();
    taskInput.value = '';
    taskInput.focus();
  }

  function toggleTask(id){
    const t = tasks.find(x => x.id === id);
    if(!t) return;
    t.completed = !t.completed;
    save();
    render();
  }

  function deleteTask(id){
    tasks = tasks.filter(x => x.id !== id);
    save();
    render();
  }

  function clearCompleted(){
    tasks = tasks.filter(x => !x.completed);
    save();
    render();
  }

  function setFilter(f){
    filter = f;
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === f));
    render();
  }

  // event delegation for list buttons
  taskList.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if(!id) return;
    if(e.target.classList.contains('check')) toggleTask(id);
    if(e.target.classList.contains('delete-btn')) deleteTask(id);
  });

  addBtn.addEventListener('click', () => addTask(taskInput.value));
  taskInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') addTask(taskInput.value);
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);
  filterBtns.forEach(btn => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));

  // helper to avoid XSS when rendering
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // initial render
  render();
})();
    </script>
</body>
</html>