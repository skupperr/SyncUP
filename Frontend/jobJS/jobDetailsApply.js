async function fetchJobs() {
  const userID = localStorage.getItem("ownUserID");
  console.log("apply " + userID);
  // const userID = localStorage.getItem('ownUserID');
  const res = await fetch(`/api/jobs?userID=${encodeURIComponent(userID)}`);

  if (!res.ok) {
    // Read response text for debugging
    const errorText = await res.text();
    throw new Error(`Failed to fetch jobs: ${errorText}`);
  }

  const jobs = await res.json();

  console.log(jobs);

  const container = document.getElementById("jobList");
  container.innerHTML = "";

  jobs.forEach((job) => {
    const jobCard = document.createElement("div");
    jobCard.className =
      "bg-[var(--card-background-color)] shadow-lg rounded-xl overflow-hidden border border-[var(--border-color)]";

    jobCard.innerHTML = `
        <div class="px-6 py-4 border-b border-[var(--border-color)]">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 class="text-xl font-semibold text-[var(--text-primary)]">${job.job_title}</h3>
              <p class="text-sm text-[var(--text-secondary)]">
                Posted ${job.posted_days_ago} days ago - <span id="applicantCount-${job.job_ID}">Loading...</span> Applicants
              </p>
            </div>

            <div class="flex items-center gap-2 mt-2 sm:mt-0">
              <span class="status-badge status-processing">Processing</span>
              <button
                class="p-1 text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
                onclick="toggleApplicants(${job.job_ID}, this)"
              >
                <span class="material-icons text-xl">expand_more</span>
              </button>
            </div>

            <button
            class="job-position-delete flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-red-600 text-white text-base font-semibold leading-normal tracking-wide hover:bg-red-700 transition-colors"
            data-job-id="${job.job_ID}"
          >
            <span class="truncate">Delete</span>
          </button>

          </div>
        </div>
        <div id="applicantList-${job.job_ID}" class="applicant-list p-6 pt-0 hidden"></div>
      `;

    container.appendChild(jobCard);

    // Add Delete button listener
jobCard.querySelector(".job-position-delete").addEventListener("click", async (e) => {
    const jobID = e.currentTarget.dataset.jobId;
  
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        const res = await fetch(`/api/delete-job/${jobID}`, {
          method: "DELETE",
        });
  
        const result = await res.json();
        if (res.ok) {
          alert("Job deleted successfully!");
          fetchJobs(); // Refresh job list
        } else {
          alert("Failed to delete job: " + result.error);
        }
      } catch (err) {
        console.error("Error deleting job:", err);
        alert("Error deleting job.");
      }
    }
  });
  

    //   Fetch applicant count for each job (optional optimization: you can send count in job API)
    fetchApplicantCount(job.job_ID);
  });
}


async function fetchApplicantCount(job_ID) {
  const res = await fetch(`/api/jobs/${job_ID}/applicant-count`);
  const { count } = await res.json();
  document.getElementById(`applicantCount-${job_ID}`).textContent = count;
}

async function toggleApplicants(job_ID, btn) {
  const listDiv = document.getElementById(`applicantList-${job_ID}`);
  const icon = btn.querySelector("span.material-icons");

  if (listDiv.classList.contains("hidden")) {
    // Show applicant list
    listDiv.classList.remove("hidden");
    listDiv.classList.add("pb-8", "pt-2"); // Add extra spacing
    icon.textContent = "expand_less";

    if (!listDiv.dataset.loaded) {
      listDiv.innerHTML = "Loading applicants...";

      try {
        const res = await fetch(`/api/jobs/${job_ID}/applicants`);
        const applicants = await res.json();

        if (applicants.length === 0) {
          listDiv.innerHTML = "<p>No applicants yet.</p>";
          listDiv.dataset.loaded = true;
          return;
        }

        listDiv.innerHTML = `
          <h4 class="text-md font-semibold text-[var(--text-primary)] mb-3 pt-6">Applicants:</h4>
          <ul class="space-y-6"></ul>
        `;

        const ul = listDiv.querySelector("ul");

        applicants.forEach((applicant) => {
            const li = document.createElement("li");
            li.className =
              "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border border-[var(--border-color)] rounded-lg hover:shadow-md transition-shadow";
          
            li.innerHTML = `
              <div class="flex items-center gap-4">
                <img
                  alt="Applicant Avatar"
                  class="h-12 w-12 rounded-full object-cover bg-gray-200 border"
                  src="${applicant.Profile_Pic || "default-avatar.png"}"
                  onerror="this.onerror=null;this.src='default-avatar.png';"
                />
                <div>
                  <p class="text-sm font-medium text-[var(--text-primary)]">${applicant.full_name}</p>
                  <a
                    class="text-xs text-[var(--accent-color)] hover:underline flex items-center gap-1"
                    href="#"
                    onclick="downloadCV(${applicant.application_ID})"
                  >
                    <span class="material-icons text-sm">attachment</span> View / Download CV
                  </a>
                </div>
              </div>
          
              <div class="relative w-full sm:w-48 mt-3 sm:mt-0">
                <select class="custom-select block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] bg-white text-[var(--text-secondary)]">
                  <option value="pending" ${applicant.applicant_status === "pending" ? "selected" : ""}>Pending</option>
                  <option value="processing" ${applicant.applicant_status === "processing" ? "selected" : ""}>Processing</option>
                  <option value="under review" ${applicant.applicant_status === "under review" ? "selected" : ""}>Under Review</option>
                  <option value="interview" ${applicant.applicant_status === "interview" ? "selected" : ""}>interview</option>
                  <option value="accepted" ${applicant.applicant_status === "accepted" ? "selected" : ""}>Accepted</option>
                  <option value="rejected" ${applicant.applicant_status === "rejected" ? "selected" : ""}>Rejected</option>
                </select>
              </div>
          
              <button
                class="applicant-status-btn flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-[var(--primary-color)] text-white text-base font-semibold leading-normal tracking-wide hover:bg-blue-600 transition-colors"
                data-application-id="${applicant.application_ID}"
              >
                <svg class="mr-2.5" fill="currentColor" height="20" viewBox="0 0 256 256" width="20">
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                </svg>
                <span class="truncate">Save</span>
              </button>
            `;
          
            ul.appendChild(li);
          });
          
          // ✅ Attach event listeners after rendering all <li> items
          ul.querySelectorAll(".applicant-status-btn").forEach((button) => {
            button.addEventListener("click", async () => {
              const applicationId = button.dataset.applicationId;
          
              // Safely find the <select> element
              const select = button.parentElement.querySelector("select");
              if (!select) return;
          
              const newStatus = select.value;
              const current_Date = new Date();
          
              try {
                const res = await fetch("/api/update-applicant-status", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    application_ID: applicationId,
                    status: newStatus,
                    last_updated: current_Date
                  }),
                });
          
                const result = await res.json();
                if (res.ok) {
                  alert("Status updated successfully!");
                } else {
                  alert("Failed to update status: " + result.error);
                }
              } catch (err) {
                console.error("Error updating status:", err);
                alert("Error updating status.");
              }
            });
          });
          
        listDiv.dataset.loaded = true;
      } catch (error) {
        listDiv.innerHTML =
          '<p class="text-red-500">Failed to load applicants.</p>';
        console.error(error);
      }
    }
  } else {
    // Hide applicant list
    listDiv.classList.add("hidden");
    icon.textContent = "expand_more";
  }
}

function downloadCV(application_ID) {
  // You can trigger a file download by opening a hidden link or window to your backend endpoint
  window.open(`/api/applications/${application_ID}/download-cv`, "_blank");
}
// // async function downloadCV(applicationID) {
// //     try {
// //       const res = await fetch(`/api/applications/${applicationID}/download-cv`);
// //       if (!res.ok) throw new Error('Failed to download CV');

// //       const blob = await res.blob();
// //       const url = window.URL.createObjectURL(blob);

// //       const a = document.createElement('a');
// //       a.href = url;
// //       a.download = `cv_${applicationID}.pdf`; // You can dynamically name it
// //       document.body.appendChild(a);
// //       a.click();

// //       a.remove();
// //       window.URL.revokeObjectURL(url);
// //     } catch (err) {
// //       console.error('CV download error:', err);
// //       alert('Failed to download CV. Please try again later.');
// //     }
// //   }

// On page load:
fetchJobs();
