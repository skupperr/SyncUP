document.addEventListener('DOMContentLoaded', async () => {
  const userID = localStorage.getItem('ownUserID'); // ensure this is set during login
  const tableBody = document.querySelector('tbody');

  try {
    const response = await fetch(`/api/dashboard/projects?userID=${encodeURIComponent(userID)}`);
    const data = await response.json();

    tableBody.innerHTML = '';

    data.forEach(project => {
      const memberImgs = project.team_members.map(member =>
        `<img alt="${member.name}" class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="${member.Profile_Pic}" />`
      ).slice(0, 3).join('');

      const extraCount = project.team_members.length - 3;
      const extraMembers = extraCount > 0
        ? `<span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 ring-2 ring-white">+${extraCount}</span>`
        : '';

      const row = `
        <tr>
          <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-[var(--primary-color)] cursor-pointer">
            <a href="#" class="project-link hover:underline" data-id="${project.project_ID}">
              ${project.project_name}
            </a>
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-full overflow-hidden rounded-full bg-gray-200 h-2.5">
                <div class="progress-bar-fill h-2.5 rounded-full" style="width: ${project.progress}%"></div>
              </div>
              <span class="text-xs font-medium text-[var(--text-secondary)]">${project.progress}%</span>
            </div>
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">
            <div class="flex -space-x-1 overflow-hidden">${memberImgs}${extraMembers}</div>
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">
            <button class="p-1 text-red-500 hover:text-red-700" onclick="deleteProject(${project.project_ID})">
              <span class="material-icons" style="font-size: 20px">delete</span>
            </button>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Add click event listeners for project links
    document.querySelectorAll('.project-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const projectID = link.getAttribute('data-id');
        localStorage.setItem('selectedProjectID', projectID);
        window.location.href = `taskPage.html?projectID=${projectID}`;
      });
    });

  } catch (err) {
    console.error('Error loading projects:', err);
  }
});

  async function deleteProject(projectID) {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const res = await fetch(`/api/dashboard/projects/${projectID}`, { method: 'DELETE' });
        if (res.ok) location.reload();
        else alert('Failed to delete project');
      } catch (err) {
        console.error(err);
      }
    }
  }
  