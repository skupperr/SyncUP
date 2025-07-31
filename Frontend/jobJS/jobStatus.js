document.addEventListener('DOMContentLoaded', async () => {
    const userID = localStorage.getItem('ownUserID'); // or from your auth system
    const tbody = document.querySelector('table tbody');
    console.log("js "+ userID);
  
    try {
      const response = await fetch(`/api/my-applications?userID=${encodeURIComponent(userID)}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
  
      const applications = await response.json();

      console.log(applications);
  
      tbody.innerHTML = ''; // clear existing rows
  
      applications.forEach(app => {
        const tr = document.createElement('tr');
        tr.classList.add('hover:bg-slate-50', 'transition-colors');
  
        tr.innerHTML = `
          <td class="px-5 py-4 text-[var(--text-primary-color)] text-sm font-medium">${app.company_name}</td>
          <td class="px-5 py-4 text-[var(--text-secondary-color)] text-sm">${app.job_title}</td>
          <td class="px-5 py-4 text-sm">
          <span class="status-badge px-3 py-1 rounded-full text-xs font-semibold"
          style="background-color: ${getBgColor(app.applicant_status)}; color: ${getTextColor(app.applicant_status)}">
      ${app.applicant_status}
    </span>
          </td>
          <td class="px-5 py-4 text-[var(--text-secondary-color)] text-sm">${formatDate(app.applied_at)}</td>
          <td class="px-5 py-4 text-[var(--text-secondary-color)] text-sm">${formatDate(app.last_updated)}</td>
        `;
  
        tbody.appendChild(tr);
      });
  
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  });


  function getBgColor(status) {
    switch (status.toLowerCase()) {
      case 'pending': return 'var(--status-submitted-bg)';
      case 'processing': return 'var(--status-processing-bg)';
      case 'interview': return 'var(--status-interview-bg)';
      case 'accept': return 'var(--status-accepted-bg)';
      case 'rejected': return 'var(--status-rejected-bg)';
      default: return '#f3f4f6'; // gray
    }
  }
  
  function getTextColor(status) {
    switch (status.toLowerCase()) {
      case 'pending': return 'var(--status-submitted-text)';
      case 'processing': return 'var(--status-processing-text)';
      case 'interview': return 'var(--status-interview-text)';
      case 'accept': return 'var(--status-accepted-text)';
      case 'rejected': return 'var(--status-rejected-text)';
      default: return '#374151'; // gray-700
    }
  }
  
  
  // Helper functions to style status and format dates
  function getStatusClasses(status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-[var(--status-submitted-bg)] text-[var(--status-submitted-text)]';
      case 'processing':
        return 'bg-[var(--status-processing-bg)] text-[var(--status-processing-text)]';
      case 'interview':
        return 'bg-[var(--status-interview-bg)] text-[var(--status-interview-text)]';
      case 'accept':
        return 'bg-[var(--status-accepted-bg)] text-[var(--status-accepted-text)]';
      case 'rejected':
        return 'bg-[var(--status-rejected-bg)] text-[var(--status-rejected-text)]';
      default:
        return 'bg-gray-100 text-gray-600'; // fallback style
    }
  }

  
  function formatDate(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toISOString().split('T')[0]; // format YYYY-MM-DD
  }

