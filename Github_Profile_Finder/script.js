const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("usernameInput");
const profileContainer = document.getElementById("profileContainer");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");

async function fetchGitHubProfile(username) {
    try {
        loading.style.display = "block";
        errorDiv.textContent = "";
        profileContainer.innerHTML = "";

        const profileResponse = await fetch(`https://api.github.com/users/${username}`);
        
        if (!profileResponse.ok) {
            throw new Error("User not found");
        }

        const profileData = await profileResponse.json();

        const repoResponse = await fetch(profileData.repos_url);
        const repoData = await repoResponse.json();

        displayProfile(profileData, repoData.slice(0, 5));

    } catch (error) {
        errorDiv.textContent = error.message;
    } finally {
        loading.style.display = "none";
    }
}

function displayProfile(profile, repos) {

    profileContainer.innerHTML = `
        <div class="profile-card">
            <div class="profile-left">
                <img src="${profile.avatar_url}" alt="Avatar">
            </div>
            <div class="profile-right">
                <h2>${profile.name || profile.login}</h2>
                <p>@${profile.login}</p>
                <p>${profile.bio || "No bio available"}</p>
                <p>📍 ${profile.location || "Not specified"}</p>
                <p>🔗 <a href="${profile.html_url}" target="_blank">${profile.html_url}</a></p>

                <div class="stats">
                    <div class="stat">Followers: ${profile.followers}</div>
                    <div class="stat">Following: ${profile.following}</div>
                    <div class="stat">Public Repos: ${profile.public_repos}</div>
                </div>
            </div>
        </div>

        <div class="repo-list">
            <h3>Top Repositories</h3>
            ${repos.map(repo => `
                <div class="repo-item">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    <p>${repo.description || "No description"}</p>
                </div>
            `).join("")}
        </div>
    `;
}

searchBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (username) {
        fetchGitHubProfile(username);
    }
});

usernameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});
