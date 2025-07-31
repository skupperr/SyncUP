// Get job_id from URL
const params = new URLSearchParams(window.location.search);
const buttonId = params.get("job_id");
// const buttonId = "applyNowBtn_3";
const jobId = buttonId.split("_")[1];
console.log(jobId);

if (jobId) {
  fetch(`/get-job-details?job_id=${encodeURIComponent(jobId)}`)
    .then((res) => res.json())
    .then((job) => {
      console.log("Job Details:", job.job_resposibility);

      // Example: insert job info into HTML
      //   document.getElementById('job-title').textContent = job.title;
      //   document.getElementById('job-company').textContent = job.company;
      //   document.getElementById('job-description').textContent = job.description;
      const container = document.querySelector(".layout-content-container");
      container.innerHTML = "";

      const jobHTML = `
      <div class="flex flex-wrap gap-2 items-center mb-6">
      <a
        class="text-slate-500 hover:text-[var(--primary-color)] text-sm font-medium leading-normal transition-colors"
        href="#"
        >Jobs</a
      >
      <svg
        class="text-slate-400"
        fill="currentColor"
        height="16"
        viewBox="0 0 256 256"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
        ></path>
      </svg>
      <span class="text-slate-800 text-sm font-medium leading-normal"
        >${job.job_title}</span
      >
    </div>
    <div class="flex flex-wrap justify-between items-start gap-6 mb-6">
      <div class="flex flex-col gap-2">
        <h1
          class="text-slate-900 tracking-tight text-3xl md:text-4xl font-bold leading-tight"
        >
         ${job.job_title}
        </h1>
        <div class="flex items-center gap-2 text-slate-600 text-sm">
          <svg
            fill="currentColor"
            height="16"
            viewBox="0 0 256 256"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M208,56H180.28L166.65,24.83a8,8,0,0,0-7.3-4.83H96.65a8,8,0,0,0-7.3,4.83L75.72,56H48A24,24,0,0,0,24,80V200a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,144a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,7.3-4.83L100.93,40h54.14l13.63,27.17A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"
            ></path>
          </svg>
          <span>${job.company_name}</span>

          <svg
          fill="currentColor"
          height="16"
          width="16"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"
          />
        </svg>
          <span>${job.location}</span>
        </div>
      </div>
      <div class="flex gap-3">


      </div>
    </div>
    <div class="space-y-6">
      <div>
        <h2
          class="text-slate-900 text-xl font-semibold leading-tight tracking-tight mb-3"
        >
          About the job
        </h2>
        <p class="text-slate-700 text-sm font-normal leading-relaxed">
          ${job.job_description}
        </p>
      </div>
      <div>
        <h2
          class="text-slate-900 text-xl font-semibold leading-tight tracking-tight mb-3"
        >
          Responsibilities
        </h2>
        <ul class="space-y-2.5 pl-1">
          <li class="flex items-start gap-x-3">
            <svg
              class="text-[var(--primary-color)] mt-0.5 shrink-0"
              fill="currentColor"
              height="20"
              viewBox="0 0 256 256"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"
              ></path>
            </svg>
            <p
              class="text-slate-700 text-sm font-normal leading-relaxed"
            >
              ${job.job_resposibility}
            </p>
          </li>
        </ul>
      </div>
      <div>
        <h2
          class="text-slate-900 text-xl font-semibold leading-tight tracking-tight mb-3"
        >
          Qualifications
        </h2>
        <ul class="space-y-2.5 pl-1">
          <li class="flex items-start gap-x-3">
            <svg
              class="text-[var(--primary-color)] mt-0.5 shrink-0"
              fill="currentColor"
              height="20"
              viewBox="0 0 256 256"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"
              ></path>
            </svg>
            <p
              class="text-slate-700 text-sm font-normal leading-relaxed"
            >
              ${job.job_requirement}
            </p>
          </li>
        </ul>
      </div>
      <div>
        <h2
          class="text-slate-900 text-xl font-semibold leading-tight tracking-tight mb-3"
        >
          Benefits
        </h2>
        <ul class="space-y-2.5 pl-1">
          <li class="flex items-start gap-x-3">
            <svg
              class="text-[var(--primary-color)] mt-0.5 shrink-0"
              fill="currentColor"
              height="20"
              viewBox="0 0 256 256"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"
              ></path>
            </svg>
            <p
              class="text-slate-700 text-sm font-normal leading-relaxed"
            >
              ${job.job_benefits}
            </p>
          </li>
        </ul>
      </div>
      <div>
        <h2
          class="text-slate-900 text-xl font-semibold leading-tight tracking-tight mb-3"
        >
          Salary Range
        </h2>
        <p class="text-slate-700 text-sm font-normal leading-relaxed">
          ${job.salary_min} - ${job.salary_max} BDT per year
        </p>
      </div>
      <div>
        <h2
          class="text-slate-900 text-xl font-semibold leading-tight tracking-tight mb-3"
        >
          About Company
        </h2>
        <p class="text-slate-700 text-sm font-normal leading-relaxed">
            ${job.about_company}
        </p>
      </div>
      <div>
      <h2
        class="text-slate-900 text-xl font-semibold leading-tight tracking-tight mb-3"
      >
        Apply Process
      </h2>
      <p class="text-slate-700 text-sm font-normal leading-relaxed">
        ${job.application_process}
      </p>
    </div>
    </div>
    <div class="flex justify-end mt-8 pt-6 border-t border-slate-200">
      <button
        class="job-apply-btn flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-[var(--primary-color)] text-white text-base font-semibold leading-normal tracking-wide hover:bg-blue-600 transition-colors"
      >
        <svg
          class="mr-2.5"
          fill="currentColor"
          height="20"
          viewBox="0 0 256 256"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"
          ></path>
        </svg>
        <span class="truncate">Apply Now</span>
      </button>
    </div>
    `;
      container.innerHTML += jobHTML;

      const applyBtn = document.querySelector(".job-apply-btn");
      console.log("Button found?", applyBtn);

      const user_ID = localStorage.getItem('ownUserID'); 

      if (applyBtn) {
        applyBtn.addEventListener("click", async () => {
          console.log("Apply button clicked!");

          try {
            const response = await fetch("/applyJob", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ job_ID: jobId, user_ID: user_ID }),
            });

            const result = await response.json();
            if (response.ok) {
              alert("Application submitted successfully!");
            } else {
              alert("Failed to apply: " + result.error);
            }
          } catch (err) {
            console.error("Application error:", err);
            alert("An error occurred while applying.");
          }
        });
      } else {
        console.warn("Apply button not found in DOM.");
      }
    })
    .catch((err) => {
      console.error("Failed to fetch job:", err);
    });
} else {
  console.warn("No job_id found in URL.");
}

// document
//   .querySelector(".job-apply-btn")?.addEventListener("click", async () => {
//     const job_ID = jobId; // implement this function if needed
//     console.log("yes click");

//     try {
//       const response = await fetch("/applyJob", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ job_ID }), // user_ID will be taken from session
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert("Application submitted successfully!");
//       } else {
//         alert("Failed to apply: " + result.error);
//       }
//     } catch (err) {
//       console.error("Application error:", err);
//       alert("An error occurred while applying.");
//     }
//   });
