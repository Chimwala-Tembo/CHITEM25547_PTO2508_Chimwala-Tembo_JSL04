/**
 * @typedef {Object} Task
 * @property {number} id          - Unique identifier for the task.
 * @property {string} title       - Display title of the task.
 * @property {string} description - Longer description of the task.
 * @property {'todo'|'doing'|'done'} status - Current column the task belongs to.
 */

/**
 * Clears all column task containers, re-renders every task card into its
 * correct column, and updates each column header with the current task count.
 * Relies on the global initialTasks array loaded from initialData.js.
 *s
 * @returns {void}
 */
function renderTasks() {
  // Clear existing task cards from all columns before re-rendering
  document.querySelectorAll(".tasks-container").forEach((container) => {
    container.innerHTML = "";
  });

  // Tally task counts per status to update column headers
  const counts = { todo: 0, doing: 0, done: 0 };
  initialTasks.forEach((task) => {
    if (counts[task.status] !== undefined) {
      counts[task.status]++;
    }
  });

  // Reflect live counts in the column header elements
  document.getElementById("toDoText").textContent = `TODO (${counts.todo})`;
  document.getElementById("doingText").textContent = `DOING (${counts.doing})`;
  document.getElementById("doneText").textContent = `DONE (${counts.done})`;

  // Build a card element for each task and attach it to its column
  initialTasks.forEach((task) => {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task-div");
    taskEl.textContent = task.title;
    taskEl.dataset.taskId = task.id;

    // Each card opens the modal with that task's details when clicked
    taskEl.addEventListener("click", () => openModal(task));

    const column = document.querySelector(
      `.column-div[data-status="${task.status}"] .tasks-container`,
    );
    if (column) column.appendChild(taskEl);
  });
}

/**
 * Populates the modal form fields with the selected task's data and opens
 * the native <dialog> element using showModal() for built-in accessibility
 * and backdrop support.
 *
 * @param {Task} task - The task object whose details should be displayed.
 * @returns {void}
 */
function openModal(task) {
  // Populate each form field with the task's current values
  document.getElementById("modal-title-input").value = task.title;
  document.getElementById("modal-description-input").value = task.description;
  document.getElementById("modal-status-select").value = task.status;

  // Store the task id on the dialog so saveTask() knows which task to update
  document.getElementById("task-modal").dataset.taskId = task.id;

  // showModal() opens the dialog as a top-layer modal with a ::backdrop overlay
  document.getElementById("task-modal").showModal();
}

/**
 * Closes the task modal by calling the native dialog close() method.
 *
 * @returns {void}
 */
function closeModal() {
  document.getElementById("task-modal").close();
}

/**
 * Reads the current values from the modal form fields, updates the
 * corresponding task in initialTasks, closes the modal, and re-renders
 * the board to reflect any changes.
 *
 * @returns {void}
 */
function saveTask() {
  const taskId = parseInt(
    document.getElementById("task-modal").dataset.taskId,
    10,
  );
  const task = initialTasks.find((t) => t.id === taskId);

  if (task) {
    task.title = document.getElementById("modal-title-input").value.trim();
    task.description = document
      .getElementById("modal-description-input")
      .value.trim();
    task.status = document.getElementById("modal-status-select").value;
  }

  closeModal();
  renderTasks();
}

document.addEventListener("DOMContentLoaded", () => {
  // Perform the initial render of all task cards into their columns
  renderTasks();

  // Close the modal when the × button is clicked
  document
    .getElementById("modal-close-btn")
    .addEventListener("click", closeModal);

  // Close the modal when the user clicks on the ::backdrop (outside the dialog)
  document.getElementById("task-modal").addEventListener("click", (e) => {
    const dialog = e.currentTarget;
    const rect = dialog.getBoundingClientRect();

    // The click is on the backdrop if it falls outside the dialog's bounding box
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (clickedOutside) closeModal();
  });

  // Save the task when the "Create Task" button is clicked
  document.getElementById("modal-save-btn").addEventListener("click", saveTask);
});
