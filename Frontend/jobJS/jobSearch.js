document.addEventListener('DOMContentLoaded', () => {
  const filters = {
    location: null,
    experience: null,
    salary: null,
  };

  let currentPage = 1;

  async function loadJobs() {
    const searchInput = document.getElementById('searchBox');
    const search = searchInput.value.trim();

    const query = new URLSearchParams({
      page: currentPage,
      location: filters.location || '',
      experience: filters.experience || '',
      salary: filters.salary || '',
      search: search || '',
    });

    const res = await fetch(`/getJobs?${query}`);
    const { jobs, totalCount } = await res.json();

    renderJobs(jobs);
    renderPagination(totalCount);
  }

  document.getElementById('searchBox').addEventListener('input', () => {
    currentPage = 1;
    loadJobs();
  });

  function getPostedDaysAgo(createdAt) {
    const createdDate = new Date(createdAt);
    const today = new Date();

    createdDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = today - createdDate;
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) return "Posted today";
    else if (daysAgo === 1) return "Posted 1 day ago";
    else return `Posted ${daysAgo} days ago`;
  }

  function renderJobs(jobs) {
    const container = document.querySelector('.grid');
    container.innerHTML = '';

    jobs.forEach(job => {
      const jobCreatedAt = job.created_at;
      const job_posted_at = getPostedDaysAgo(jobCreatedAt);

      const jobHTML = `
        <div class="job-card flex flex-col justify-between">
          <div>
            <div class="flex items-center mb-2">
              <img
                alt="Company Logo"
                class="w-10 h-10 rounded-full mr-3 border border-[var(--border-color)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn-263qahs1ZT5f-5mn-AsMbRLSITHNZ0j3N3-zASFiSHYWENIXyzUQ0RChERZBWz11iF_jH0aaHer--aXqHhKMfxMMcpxLF_x0XN9A8_cUwjIC3eqddcNKl8EwsxZwg1BRC1pi1ZX-DmZbidr-fJ-jyTJ33mp2Q2lNXid3Y6Rn_cfo_D0JSWbHjtyuaXzWKNin8cix51rtycshKdae6EUC8dwiC7_WQ1NM1wO-Ydt8rmF3tPdvG-YAP0H5X09Cy2CHc0mxAL3TA"
              />
              <div>
                <h4 class="text-[var(--text-primary)] text-lg font-semibold leading-tight">
                  ${job.job_title}
                </h4>
                <p class="text-[var(--text-secondary)] text-sm">${job.company_name}</p>
              </div>
            </div>
            <p class="text-[var(--text-secondary)] text-sm mb-1">
              <span class="material-icons-outlined !text-sm align-middle mr-1">schedule</span>${job_posted_at}
            </p>
            <p class="text-[var(--text-secondary)] text-sm mb-3">
              <span class="material-icons-outlined !text-sm align-middle mr-1">location_on</span>${job.location}
            </p>
            <p class="text-[var(--text-primary)] text-sm leading-relaxed line-clamp-3 mb-4">
              ${job.job_description}
            </p>
          </div>
          <button
            id="applyNowBtn_${job.job_id}"
            class="btn-primary w-full h-10 rounded-lg text-sm font-medium"
            onclick="goToJobDetails(this.id)"
          >
            Apply Now
          </button>
        </div>
      `;
      container.innerHTML += jobHTML;
    });
  }

  function renderPagination(totalCount) {
    const paginationContainer = document.querySelector('.pagination');
    const totalPages = Math.ceil(totalCount / 6);
    if (!paginationContainer) return;

    let html = '';

    // Previous
    if (currentPage > 1) {
      html += `
        <a href="#" data-page="${currentPage - 1}" class="flex size-10 items-center justify-center rounded-lg hover:bg-gray-100 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <span class="material-icons-outlined !text-xl">chevron_left</span>
        </a>
      `;
    }

    // Page numbers (max 5)
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      html += `
        <a href="#" data-page="${i}" class="text-sm font-medium leading-normal flex size-10 items-center justify-center rounded-lg mx-1 ${
          i === currentPage
            ? 'text-white bg-[var(--primary-color)] font-semibold'
            : 'text-[var(--text-primary)] hover:bg-gray-100'
        }">${i}</a>
      `;
    }

    // Next
    if (currentPage < totalPages) {
      html += `
        <a href="#" data-page="${currentPage + 1}" class="flex size-10 items-center justify-center rounded-lg hover:bg-gray-100 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <span class="material-icons-outlined !text-xl">chevron_right</span>
        </a>
      `;
    }

    paginationContainer.innerHTML = html;

    // Attach page click events
    paginationContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const page = parseInt(link.dataset.page);
        if (!isNaN(page)) {
          currentPage = page;
          loadJobs();
        }
      });
    });
  }

  document.querySelectorAll('.filter-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const filterKey = btn.dataset.filter;
      if (!filterKey) return;

      const value = prompt(`Enter ${filterKey} value`);
      if (value !== null) {
        filters[filterKey] = value;
        currentPage = 1;
        loadJobs();
      }
    });
  });

  loadJobs(); // Initial load
});

function goToJobDetails(jobId) {
  window.location.href = `jobDetails.html?job_id=${encodeURIComponent(jobId)}`;
}
