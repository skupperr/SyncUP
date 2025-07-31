const urlParams = new URLSearchParams(window.location.search);
const projectID = urlParams.get('projectID');

const selectprojectID = localStorage.getItem('selectedProjectID');
console.log("selectprojectID "+selectprojectID);

const userID = localStorage.getItem('ownUserID');
console.log("user id"+userID);

document.getElementById("friend-search").addEventListener("input", async function () {
  const query = this.value.trim();
 
  if (!query) {
    document.getElementById("friend-list").innerHTML = "";
    return;
  }

  const res = await fetch(`/search-friends?q=${encodeURIComponent(query)}&userID=${userID}`);
  const friends = await res.json();

  //
//   console.log(friends);
  //

  const list = document.getElementById("friend-list");
  list.innerHTML = "";

  friends.forEach(friend => {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between p-3 hover:bg-gray-50";

    li.innerHTML = `
      <div class="flex items-center">
        <img class="h-8 w-8 rounded-full" src="${friend.profile_pic}" alt="${friend.name}" />
        <div class="ml-3">
          <p class="text-sm font-medium text-[var(--text-color-primary)]">${friend.name}</p>
          <p class="text-xs text-[var(--text-color-secondary)]">${friend.email}</p>
        </div>
      </div>
      <button class="add-button rounded-md bg-[var(--accent-color)] px-2.5 py-1 text-xs font-medium text-white hover:bg-[var(--primary-color-hover)] focus:outline-none"
              data-id="${friend.id}">
        Add
      </button>
    `;

    list.appendChild(li);
  });

  document.querySelectorAll(".add-button").forEach(btn => {
    btn.addEventListener("click", async function () {
      const memberID = this.dataset.id;
      const selectprojectID = localStorage.getItem('selectedProjectID');
  
      const res = await fetch("/add-to-project-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectID: selectprojectID, memberID }) // ✅ fixed key name
      });
  
      const result = await res.json();
      if (result.success) {
        this.textContent = "Added";
        this.disabled = true;
        this.classList.add("bg-gray-200", "cursor-not-allowed");
      }
    });
  });
  


});

document.addEventListener('DOMContentLoaded', async () => {
    const projectID = localStorage.getItem('selectedProjectID');
    if (!projectID) return;
  
    try {
      const res = await fetch(`/project-team?projectID=${encodeURIComponent(projectID)}`);
      const team = await res.json();
  
      const container = document.querySelector('.team-members-container'); // Add this class to your HTML wrapper
      container.innerHTML = ''; // Clear any default content
  
      team.forEach(member => {
        const div = document.createElement('div');
        div.className = "flex items-center gap-3";
  
        div.innerHTML = `
          <img alt="${member.full_name}" class="size-10 rounded-full ring-2 ring-white" src="${member.profile_pic}" />
          <div>
            <p class="text-sm font-medium text-[var(--text-color-primary)]">${member.fullName}</p>
            <p class="text-xs text-[var(--text-color-secondary)]">${member.email}</p>
          </div>
        `;
  
        container.appendChild(div);
      });
  
    } catch (err) {
      console.error('Error loading team:', err);
    }
  });

  document.addEventListener('DOMContentLoaded', async () => {
    const projectID = localStorage.getItem('selectedProjectID');
    const assigneeSelect = document.getElementById("task-assignee");
  
    // Load team members into assignee dropdown
    try {
      const res = await fetch(`/project-team?projectID=${projectID}`);
      const team = await res.json();
      console.log(team);
  
      team.forEach(member => {
        const option = document.createElement("option");
        option.value = member.user_ID;
        option.textContent = member.fullName;
        assigneeSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Failed to load assignees", err);
    }
  
    // Handle Add Task form submission
    const taskForm = document.querySelector("form");
    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const taskName = document.getElementById("task-name").value.trim();
      const assigneeID = document.getElementById("task-assignee").value;
      const dueDate = document.getElementById("task-due-date").value;
  
      if (!taskName || !assigneeID || !dueDate) {
        alert("Please fill out all fields");
        return;
      }
  
      const res = await fetch("/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_ID: projectID,
          task_name: taskName,
          assign_user_ID: assigneeID,
          task_details: dueDate,
          status: "To Do"
        })
      });
  
      const result = await res.json();
      if (result.success) {
        alert("Task added successfully!");
        taskForm.reset();
      } else {
        alert("Failed to add task.");
      }
    });
  });


  document.addEventListener("DOMContentLoaded", async () => {
    const projectID = localStorage.getItem("selectedProjectID");
    const taskTableBody = document.querySelector("tbody");
  
    async function loadTasks() {
      const res = await fetch(`/api/tasks?projectID=${projectID}`);
      const tasks = await res.json();
      taskTableBody.innerHTML = "";
  
      tasks.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="px-4 py-4">
            <input type="checkbox" class="form-checkbox rounded text-[var(--accent-color)] focus:ring-[var(--accent-color)]" />
          </td>
          <td class="table-task-name whitespace-nowrap px-6 py-4 text-sm font-medium text-[var(--text-color-primary)]">
            ${task.task_name}
          </td>
          <td class="table-task-status whitespace-nowrap px-6 py-4 text-sm">
            <select class="status-select form-select w-full rounded-md py-1.5 text-xs shadow-sm" data-id="${task.task_ID}">
              <option value="To Do" ${task.status === 'To Do' ? 'selected' : ''}>To Do</option>
              <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
          </td>
          <td class="table-task-assignee whitespace-nowrap px-6 py-4 text-sm">
            <select class="assignee-select form-select w-full rounded-md py-1.5 text-xs shadow-sm" data-id="${task.task_ID}">
              <option value="${task.user_ID}">${task.assignee_name}</option>
            </select>
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">
            ${task.due_date?.split('T')[0] || ''}
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
            <div class="flex items-center gap-2">
            <button 
            class="edit-task inline-flex items-center justify-center rounded-md bg-[var(--accent-color)] px-2 py-1 text-sm text-white hover:bg-[var(--primary-color-hover)] focus:outline-none"
            data-id="${task.task_ID}">
            ✎ Edit
          </button>
          
          <button 
            class="delete-task inline-flex items-center justify-center rounded-md bg-[var(--danger-color)] px-2 py-1 text-sm text-white hover:bg-[var(--danger-color-hover)] focus:outline-none"
            data-id="${task.task_ID}">
            🗑 Delete
          </button>
            </div>
          </td>
        `;
        taskTableBody.appendChild(row);
      });
  
      attachListeners();
    }
  
    async function attachListeners() {
      document.querySelectorAll(".status-select").forEach(sel => {
        sel.addEventListener("change", async () => {
          const taskID = sel.dataset.id;
          const status = sel.value;
          const assigneeSel = document.querySelector(`.assignee-select[data-id="${taskID}"]`);
          const assign_user_ID = assigneeSel?.value;
          await updateTask(taskID, status, assign_user_ID);
        });
      });
  
      document.querySelectorAll(".assignee-select").forEach(sel => {
        sel.addEventListener("change", async () => {
          const taskID = sel.dataset.id;
          const assign_user_ID = sel.value;
          const statusSel = document.querySelector(`.status-select[data-id="${taskID}"]`);
          const status = statusSel?.value;
          await updateTask(taskID, status, assign_user_ID);
        });
      });
  
      document.querySelectorAll(".delete-task").forEach(btn => {
        btn.addEventListener("click", async () => {
          const taskID = btn.dataset.id;
          if (confirm("Are you sure you want to delete this task?")) {
            const res = await fetch(`/api/tasks/${taskID}`, { method: "DELETE" });
            const result = await res.json();
            if (result.success) loadTasks();
          }
        });
      });
    }
  
    async function updateTask(taskID, status, assign_user_ID) {
      const res = await fetch(`/api/tasks/${taskID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, assign_user_ID })
      });
      const result = await res.json();
      if (!result.success) alert("Update failed");
    }
  
    await loadTasks();
  });


  document.addEventListener("DOMContentLoaded", async () => {
    const projectID = localStorage.getItem("selectedProjectID");
  
    // Load project details
    const detailRes = await fetch(`/api/project/details?projectID=${projectID}`);
    const project = await detailRes.json();
  
    document.getElementById("project-title").textContent = project.project_name;
    document.getElementById("created-date").textContent = "Created Date: " + new Date(project.created_date).toLocaleDateString();
    document.getElementById("project-description").textContent = project.project_details;
  
    // Load status counts
    const statusRes = await fetch(`/api/project/task-status?projectID=${projectID}`);
    const statusCounts = await statusRes.json();
  
    let total = 0;
    let counts = { "To Do": 0, "In Progress": 0, "Completed": 0 };
    statusCounts.forEach(row => {
      counts[row.status] = row.count;
      total += row.count;
    });
  
    function updateBar(idText, idBar, percent) {
      document.getElementById(idText).textContent = percent + "%";
      document.getElementById(idBar).style.width = percent + "%";
    }
  
    const todoPct = total ? Math.round((counts["To Do"] / total) * 100) : 0;
    const progPct = total ? Math.round((counts["In Progress"] / total) * 100) : 0;
    const compPct = total ? Math.round((counts["Completed"] / total) * 100) : 0;
  
    updateBar("todo-percent", "todo-bar", todoPct);
    updateBar("progress-percent", "progress-bar", progPct);
    updateBar("completed-percent", "completed-bar", compPct);
  });
  
  
  
  
