document.addEventListener('DOMContentLoaded', () => {
    const jobListingsContainer = document.querySelector('.job-listings');
    const filterContainer = document.querySelector('.filter-container');
    const filtersElement = document.querySelector('.filters');
    const clearButton = document.querySelector('.clear-btn');
    
    let jobsData = [];
    let selectedFilters = [];
  
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        jobsData = data;
        renderJobListings(jobsData);
      })
      .catch(error => console.error('Error loading data:', error));
  
    
    function renderJobListings(jobs) {
      jobListingsContainer.innerHTML = '';
      
      jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = `job-card ${job.featured ? 'featured' : ''}`;
        
        const tags = [job.role, job.level, ...job.languages, ...job.tools];
        
        jobCard.innerHTML = `
          <img src="${job.logo}" alt="${job.company} logo" class="job-logo">
          <div class="job-info">
            <div class="company-info">
              <span class="company-name">${job.company}</span>
              ${job.new ? '<span class="new-badge">New!</span>' : ''}
              ${job.featured ? '<span class="featured-badge">Featured</span>' : ''}
            </div>
            <h2 class="position">${job.position}</h2>
            <div class="job-meta">
              <span>${job.postedAt}</span>
              <span>${job.contract}</span>
              <span>${job.location}</span>
            </div>
          </div>
          <div class="job-tags">
            ${tags.map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`).join('')}
          </div>
        `;
        
        jobListingsContainer.appendChild(jobCard);
      });
  
   
      document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
          const tagValue = tag.getAttribute('data-tag');
          if (!selectedFilters.includes(tagValue)) {
            selectedFilters.push(tagValue);
            updateFilters();
            filterJobs();
          }
        });
      });
    }
  
   
    function updateFilters() {
      if (selectedFilters.length === 0) {
        filterContainer.classList.add('hidden');
        return;
      }
      
      filterContainer.classList.remove('hidden');
      filtersElement.innerHTML = '';
      
      selectedFilters.forEach(filter => {
        const filterItem = document.createElement('div');
        filterItem.className = 'filter-item';
        filterItem.innerHTML = `
          <span class="filter-text">${filter}</span>
          <button class="remove-filter" data-filter="${filter}">
            <img src="./images/icon-remove.svg" alt="Remove">
          </button>
        `;
        filtersElement.appendChild(filterItem);
      });
  
     
      document.querySelectorAll('.remove-filter').forEach(button => {
        button.addEventListener('click', (e) => {
          const filterToRemove = e.currentTarget.getAttribute('data-filter');
          selectedFilters = selectedFilters.filter(f => f !== filterToRemove);
          updateFilters();
          filterJobs();
        });
      });
    }
  
  
    function filterJobs() {
      if (selectedFilters.length === 0) {
        renderJobListings(jobsData);
        return;
      }
      
      const filteredJobs = jobsData.filter(job => {
        const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
        return selectedFilters.every(filter => jobTags.includes(filter));
      });
      
      renderJobListings(filteredJobs);
    }
  
  
    clearButton.addEventListener('click', () => {
      selectedFilters = [];
      updateFilters();
      filterJobs();
    });
  });