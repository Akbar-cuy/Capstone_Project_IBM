/**
 * script.js — Task List App
 * Features: CRUD, toggle complete, filter (All / Active / Completed), localStorage
 * Stack   : Vanilla JavaScript (ES6+), no external libraries
 */

// ─────────────────────────────────────────────
// 1. STATE
// ─────────────────────────────────────────────

/** @type {{ id: string, text: string, completed: boolean }[]} */
let tasks = [];

/** @type {'all' | 'active' | 'completed'} */
let currentFilter = "all";

/** ID of the task currently being edited (null when modal is closed) */
let editingId = null;

// ─────────────────────────────────────────────
// 2. DOM REFERENCES
// ─────────────────────────────────────────────
const taskForm       = document.getElementById("taskForm");
const taskInput      = document.getElementById("taskInput");
const formError      = document.getElementById("formError");
const taskList       = document.getElementById("taskList");
const emptyState     = document.getElementById("emptyState");
const taskCount      = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filterBtns     = document.querySelectorAll(".filter-btn");

// Modal
const editModal  = document.getElementById("editModal");
const editInput  = document.getElementById("editInput");
const cancelEdit = document.getElementById("cancelEdit");
const saveEdit   = document.getElementById("saveEdit");

// ─────────────────────────────────────────────
// 3. PERSISTENCE — localStorage helpers
// ─────────────────────────────────────────────

/** Load tasks array from localStorage (falls back to empty array). */
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  } catch {
    return [];
  }
}

/** Persist the current tasks array to localStorage. */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ─────────────────────────────────────────────
// 4. CORE TASK OPERATIONS (CRUD)
// ─────────────────────────────────────────────

/**
 * Generate a unique ID using timestamp + random suffix.
 * @returns {string}
 */
function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Create and add a new task.
 * @param {string} text - Task description
 */
function addTask(text) {
  const task = {
    id: generateId(),
    text: text.trim(),
    completed: false,
  };
  tasks.unshift(task); // newest first
  saveTasks();
  render();
}

/**
 * Toggle a task's completed status.
 * @param {string} id - Task ID
 */
function toggleTask(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  render();
}

/**
 * Delete a task by its ID.
 * @param {string} id - Task ID
 */
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

/**
 * Commit the edited text to the task.
 * @param {string} id      - Task ID
 * @param {string} newText - Updated text
 */
function updateTask(id, newText) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, text: newText.trim() } : t
  );
  saveTasks();
  render();
}

/** Remove every completed task from the list. */
function clearCompletedTasks() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
}

// ─────────────────────────────────────────────
// 5. FILTER HELPERS
// ─────────────────────────────────────────────

/**
 * Return the tasks that match the active filter.
 * @returns {{ id: string, text: string, completed: boolean }[]}
 */
function getFilteredTasks() {
  switch (currentFilter) {
    case "active":    return tasks.filter((t) => !t.completed);
    case "completed": return tasks.filter((t) =>  t.completed);
    default:          return tasks; // "all"
  }
}

// ─────────────────────────────────────────────
// 6. RENDER
// ─────────────────────────────────────────────

/**
 * Build the HTML for a single task item.
 * @param {{ id: string, text: string, completed: boolean }} task
 * @returns {string} HTML string
 */
function createTaskHTML(task) {
  const checked  = task.completed ? "checked" : "";
  const itemCls  = task.completed ? "task-item completed" : "task-item";
  // Escape text to prevent XSS
  const safeText = escapeHTML(task.text);

  return `
    <li class="${itemCls}" data-id="${task.id}">
      <!-- Toggle checkbox -->
      <input
        type="checkbox"
        class="task-checkbox"
        aria-label="Mark task as completed"
        ${checked}
        data-action="toggle"
      />

      <!-- Task text -->
      <span class="task-text flex-1 text-sm text-gray-700 leading-snug break-words min-w-0">
        ${safeText}
      </span>

      <!-- Action buttons -->
      <div class="flex gap-1 ml-auto flex-shrink-0">
        <!-- Edit -->
        <button class="btn-icon btn-edit" aria-label="Edit task" data-action="edit" title="Edit">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 pointer-events-none"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>

        <!-- Delete -->
        <button class="btn-icon btn-delete" aria-label="Delete task" data-action="delete" title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 pointer-events-none"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </li>
  `;
}

/**
 * Re-render the task list, footer, and empty state.
 * Called after every state change.
 */
function render() {
  const filtered       = getFilteredTasks();
  const activeCount    = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) =>  t.completed).length;

  // ── Task list ──
  if (filtered.length === 0) {
    taskList.innerHTML = "";
    emptyState.classList.remove("hidden");
    emptyState.classList.add("flex-show");
  } else {
    emptyState.classList.add("hidden");
    emptyState.classList.remove("flex-show");
    taskList.innerHTML = filtered.map(createTaskHTML).join("");
  }

  // ── Footer: active count ──
  taskCount.textContent = `${activeCount} task${activeCount !== 1 ? "s" : ""} left`;

  // ── Footer: "Clear completed" visibility ──
  if (completedCount > 0) {
    clearCompleted.classList.remove("hidden");
  } else {
    clearCompleted.classList.add("hidden");
  }

  // ── Sync filter button styles ──
  filterBtns.forEach((btn) => {
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add("filter-active");
    } else {
      btn.classList.remove("filter-active");
    }
  });
}

// ─────────────────────────────────────────────
// 7. MODAL HELPERS
// ─────────────────────────────────────────────

/**
 * Open the edit modal pre-filled with the task's current text.
 * @param {string} id
 */
function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  editingId = id;
  editInput.value = task.text;
  editModal.classList.remove("hidden");
  // Focus the input after the modal is visible
  requestAnimationFrame(() => {
    editInput.focus();
    editInput.select();
  });
}

/** Close the edit modal and reset state. */
function closeEditModal() {
  editModal.classList.add("hidden");
  editingId = null;
  editInput.value = "";
}

// ─────────────────────────────────────────────
// 8. UTILITY
// ─────────────────────────────────────────────

/**
 * Escape HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─────────────────────────────────────────────
// 9. EVENT LISTENERS
// ─────────────────────────────────────────────

// ── Add Task Form submit ──
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = taskInput.value.trim();

  if (!value) {
    // Show inline validation error
    formError.classList.remove("hidden");
    taskInput.focus();
    return;
  }

  formError.classList.add("hidden");
  addTask(value);
  taskInput.value = "";
  taskInput.focus();
});

// Hide validation error once user starts typing
taskInput.addEventListener("input", () => {
  if (taskInput.value.trim()) {
    formError.classList.add("hidden");
  }
});

// ── Task list — event delegation (toggle / edit / delete) ──
taskList.addEventListener("click", (e) => {
  const btn    = e.target.closest("[data-action]");
  if (!btn) return;

  const li     = btn.closest("[data-id]");
  if (!li) return;

  const id     = li.dataset.id;
  const action = btn.dataset.action;

  if (action === "toggle")  toggleTask(id);
  if (action === "edit")    openEditModal(id);
  if (action === "delete")  deleteTask(id);
});

// ── Filter buttons ──
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ── Clear Completed ──
clearCompleted.addEventListener("click", clearCompletedTasks);

// ── Modal: Save edit ──
saveEdit.addEventListener("click", () => {
  const newText = editInput.value.trim();
  if (!newText || !editingId) return;

  updateTask(editingId, newText);
  closeEditModal();
});

// ── Modal: Cancel edit ──
cancelEdit.addEventListener("click", closeEditModal);

// ── Modal: Close on overlay click ──
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

// ── Modal: Save on Enter key ──
editInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    saveEdit.click();
  }
  if (e.key === "Escape") closeEditModal();
});

// ─────────────────────────────────────────────
// 10. INIT
// ─────────────────────────────────────────────
(function init() {
  tasks = loadTasks();
  render();
})();
