const userID = localStorage.getItem('user_ID');

  document.getElementById("friend-search").addEventListener("input", async function () {
    const query = this.value.trim();
    if (query.length === 0) {
      document.getElementById("friend-list").innerHTML = "";
      return;
    }

    const res = await fetch(`/search-friends?q=${encodeURIComponent(query)}&userID=${userID}`);
    const data = await res.json();

    const list = document.getElementById("friend-list");
    list.innerHTML = "";

    data.forEach(friend => {
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
        </button>`;
      list.appendChild(li);
    });

    // Add event listeners for "Add" buttons
    document.querySelectorAll(".add-button").forEach(btn => {
      btn.addEventListener("click", async function () {
        const friendID = this.dataset.id;

        const projectID = localStorage.getItem("project_ID"); // Or pass from your page
        const res = await fetch("/add-to-project-team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectID, memberID: friendID })
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