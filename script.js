document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("results");

  let currentUserPage = 1;
  let currentRepoPage = 1;

  function getSvgFilename(lang) {
    return lang.toLowerCase().replace(/[^a-z0-9]/g, "") + ".svg";
  }

  searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
      resultsContainer.innerHTML = "Please enter a search query.";
      return;
    }
    currentUserPage = 1; // reset on new search
    await fetchGitHubUsers(query, currentUserPage);
  });

  async function fetchGitHubUsers(query, page) {
    resultsContainer.innerHTML = "Loading users...";
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=10`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      currentUserPage = page;
      displayResults(data.items, data.total_count);
    } catch (error) {
      console.error("Error fetching users:", error);
      resultsContainer.innerHTML =
        "An error occurred while fetching users. Please try again.";
    }
  }

  function displayResults(users, totalCount) {
    if (!users || users.length === 0) {
      resultsContainer.innerHTML = "No users found.";
      return;
    }

    resultsContainer.innerHTML = "";
    users.forEach((user) => {
      const userCard = createUserCard(user);
      resultsContainer.appendChild(userCard);
    });
    addUserPagination(totalCount);
  }

  function createUserCard(user) {
    const userCard = document.createElement("div");
    userCard.className = "user-card";
    userCard.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}'s avatar" class="avatar" title="${user.login}">
      <h3>${user.login}</h3>
      <button class="info-button" data-username="${user.login}">More Info</button>
    `;
    userCard
      .querySelector(".info-button")
      .addEventListener("click", async function () {
        const username = this.getAttribute("data-username");
        currentRepoPage = 1; // reset
        await fetchUserDetails(username);
      });
    return userCard;
  }

  async function fetchUserDetails(username) {
    resultsContainer.innerHTML = "Loading user details...";
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      createUserCardInfo(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
      resultsContainer.innerHTML =
        "An error occurred while fetching user details. Please try again.";
    }
  }

  function createUserCardInfo(user) {
    resultsContainer.innerHTML = "";
    const userCardInfo = document.createElement("div");
    userCardInfo.className = "user-card-info";
    userCardInfo.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}'s avatar" class="avatar">
      <h2>${user.name || user.login}</h2>
      <section class="user-details-section">
        <div class="detail-row">
          <span class="detail-label">Username:</span>
          <span class="detail-value">${user.login}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Bio:</span>
          <span class="detail-value">${user.bio || "N/A"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${user.location || "N/A"}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Public Repos:</span>
          <span class="detail-value">${user.public_repos}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Followers:</span>
          <span class="detail-value">${user.followers}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Following:</span>
          <span class="detail-value">${user.following}</span>
        </div>
        <div class="detail-link">
          <a href="${user.html_url}" target="_blank">View Profile on GitHub</a>
        </div>
      </section>
      <br><br>
      <button class="back-button">Back to Results</button>
    `;
    if (user.public_repos > 0) {
      const reposContainer = document.createElement("div");
      reposContainer.className = "repos-container";
      reposContainer.innerHTML = `<h3>Repositories:</h3><div class="repos-list">Loading repositories...</div>`;
      userCardInfo.appendChild(reposContainer);

      fetchUserRepos(user.repos_url, currentRepoPage);
    }
    resultsContainer.appendChild(userCardInfo);

    document
      .querySelector(".back-button")
      .addEventListener("click", async function () {
        const query = searchInput.value.trim();
        if (query) {
          await fetchGitHubUsers(query, currentUserPage);
        }
      });
  }

  async function fetchUserRepos(reposUrl, page) {
    try {
      const response = await fetch(
        `${reposUrl}?per_page=10&page=${page}&sort=updated`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const repos = await response.json();
      // Fetch languages for each repo
      const languagesPromises = repos.map((repo) =>
        fetch(repo.languages_url).then((res) => (res.ok ? res.json() : {})),
      );
      const languagesData = await Promise.all(languagesPromises);
      repos.forEach((repo, index) => {
        repo.languages = languagesData[index];
      });
      const reposList = document.querySelector(".repos-list");
      reposList.innerHTML = "";
      repos.forEach((repo) => {
        const repoCard = createRepoCard(repo);
        reposList.appendChild(repoCard);
      });
      currentRepoPage = page;
      addRepoPagination(repos.length, reposUrl);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      document.querySelector(".repos-list").innerHTML =
        "An error occurred while fetching repositories.";
    }
  }

  function addRepoPagination(repoCount, reposUrl) {
    const existing = document.querySelector(".repo-pagination");
    if (existing) existing.remove();
    const pagination = document.createElement("div");
    pagination.className = "repo-pagination";
    pagination.style.textAlign = "center";
    pagination.style.marginTop = "1rem";
    const prev = document.createElement("button");
    prev.textContent = "Previous";
    prev.className = "pagination-button";
    prev.disabled = currentRepoPage === 1;
    prev.addEventListener("click", () =>
      fetchUserRepos(reposUrl, currentRepoPage - 1),
    );
    pagination.appendChild(prev);
    const next = document.createElement("button");
    next.textContent = "Next";
    next.className = "pagination-button";
    next.disabled = repoCount < 10;
    next.addEventListener("click", () =>
      fetchUserRepos(reposUrl, currentRepoPage + 1),
    );
    pagination.appendChild(next);
    document.querySelector(".repos-container").appendChild(pagination);
  }

  function addUserPagination(totalCount) {
    const existing = document.querySelector(".user-pagination");
    if (existing) existing.remove();
    const pagination = document.createElement("div");
    pagination.className = "user-pagination";
    pagination.style.textAlign = "center";
    pagination.style.marginTop = "1rem";
    const prev = document.createElement("button");
    prev.textContent = "Previous";
    prev.className = "pagination-button";
    prev.disabled = currentUserPage === 1;
    prev.addEventListener("click", () =>
      fetchGitHubUsers(searchInput.value.trim(), currentUserPage - 1),
    );
    pagination.appendChild(prev);
    const next = document.createElement("button");
    next.textContent = "Next";
    next.className = "pagination-button";
    next.disabled = currentUserPage * 10 >= totalCount;
    next.addEventListener("click", () =>
      fetchGitHubUsers(searchInput.value.trim(), currentUserPage + 1),
    );
    pagination.appendChild(next);
    resultsContainer.appendChild(pagination);
  }

  function createRepoCard(repo) {
    const repoCard = document.createElement("div");
    repoCard.className = "repo-card";
    // Sort languages by bytes descending and take top 5
    const langEntries = Object.entries(repo.languages || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const langHtml = langEntries
      .map(([lang, bytes]) => {
        const svgFile = getSvgFilename(lang);
        return `<img src="assets/${svgFile}" alt="${lang}" title="${lang}: ${bytes} bytes" class="repo-language" onerror="this.style.display='none'">`;
      })
      .join("");
    repoCard.innerHTML = `
      <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
      <p>${repo.description || "No description available."}</p>
      <p><strong>Stars:</strong> ${repo.stargazers_count} | <strong>Forks:</strong> ${repo.forks_count}</p>
      <div class="repo-languages">${langHtml}</div>
    `;
    return repoCard;
  }
});
