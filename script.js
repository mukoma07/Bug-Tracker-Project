document.addEventListener('DOMContentLoaded', function () {
    const bugList = document.getElementById('bugList');
    const bugForm = document.getElementById('bugForm');
  
    // Fetch bugs from the GitHub API
    function fetchBugs() {
      const owner = 'your-github-username';
      const repo = 'your-github-repo';
  
      fetch(`https://api.github.com/repos/${owner}/${repo}/issues`)
        .then(response => response.json())
        .then(data => {
          bugList.innerHTML = '';
          data.forEach(bug => {
            const bugItem = document.createElement('li');
            bugItem.innerHTML = `
              <h3>${bug.title}</h3>
              <p>${bug.body}</p>
              <div>
                <input type="text" id="commitInput_${bug.id}" placeholder="Add commit message">
                <button onclick="addCommit(${bug.id})">Add Commit</button>
                <ul id="commitList_${bug.id}"></ul>
              </div>
            `;
            bugList.appendChild(bugItem);
            fetchCommits(bug.id);
          });
        })
        .catch(error => {
          console.error('Error fetching bugs from GitHub API:', error);
        });
    }
  
    // Add new bug to the GitHub API
    function addBug(event) {
      event.preventDefault();
  
      const bugTitle = document.getElementById('bugTitle').value;
      const bugDescription = document.getElementById('bugDescription').value;
  
      const bug = {
        title: bugTitle,
        body: bugDescription
      };
  
      fetch('https://api.github.com/repos/:owner/:repo/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_PERSONAL_ACCESS_TOKEN'
        },
        body: JSON.stringify(bug)
      })
        .then(response => response.json())
        .then(() => {
          bugForm.reset();
          fetchBugs();
        })
        .catch(error => {
          console.error('Error adding bug to GitHub API:', error);
        });
    }
  
    // Fetch commits for a bug from the GitHub API
    function fetchCommits(bugId) {
      const owner = 'your-github-username';
      const repo = 'your-github-repo';
  
      fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${bugId}/comments`)
        .then(response => response.json())
        .then(data => {
          const commitList = document.getElementById(`commitList_${bugId}`);
          commitList.innerHTML = '';
          data.forEach(commit => {
            const commitItem = document.createElement('li');
            commitItem.textContent = commit.body;
            commitList.appendChild(commitItem);
          });
        })
        .catch(error => {
          console.error(`Error fetching commits for bug ${bugId} from GitHub API:`, error);
        });
    }
  
    // Add commit to a bug in the GitHub API
    function addCommit(bugId) {
      const commitInput = document.getElementById(`commitInput_${bugId}`);
      const commitMessage = commitInput.value;
  
      const comment = {
        body: commitMessage
      };
  
      fetch(`https://api.github.com/repos/:owner/:repo/issues/${bugId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_PERSONAL_ACCESS_TOKEN'
        },
        body: JSON.stringify(comment)
      })
        .then(response => response.json())
        .then(() => {
          commitInput.value ='';
          fetchCommits(bugId);
        })
        .catch(error => {
          console.error(`Error adding commit to bug ${bugId} in GitHub API:`, error);
        });
    }
  
    // Event listeners
    bugForm.addEventListener('submit', addBug);
  
    // Initial fetch
    fetchBugs();
  });
  
