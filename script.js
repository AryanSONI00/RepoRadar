// Show loading spinner
function showLoading() {
	document.getElementById("loading").style.display = "flex";
	document.getElementById("output").innerHTML = "";
}

// Hide loading spinner
function hideLoading() {
	document.getElementById("loading").style.display = "none";
}

// Show error message
function showError(message) {
	hideLoading();
	document.getElementById("output").innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

// Format number with commas
function formatNumber(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format date
function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

async function fetchGitHubData() {
	const username = document.getElementById("username").value.trim();
	if (!username) {
		showError("Please enter a GitHub username!");
		return;
	}

	showLoading();

	try {
		const userResponse = await fetch(`https://api.github.com/users/${username}`);
		if (!userResponse.ok) {
			throw new Error(userResponse.status === 404 ? "User not found!" : "Failed to fetch user data");
		}
		const userData = await userResponse.json();

		const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
		if (!reposResponse.ok) {
			throw new Error("Failed to fetch repositories");
		}
		const reposData = await reposResponse.json();

		displayUserData(userData, reposData);
	} catch (error) {
		showError(error.message);
	}
}

function displayUserData(userData, reposData) {
	hideLoading();

	document.getElementById("output").innerHTML = `
        <div class="user-profile">
            <img src="${userData.avatar_url}" alt="${userData.login}'s avatar">
            <h2>${userData.name || userData.login}</h2>
            <p class="bio">${userData.bio || "No bio available"}</p>

            <div class="stats">
                <div class="stat-item">
                    <i class="fas fa-users"></i>
                    <span>${formatNumber(userData.followers)} followers</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-user-friends"></i>
                    <span>${formatNumber(userData.following)} following</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-code-branch"></i>
                    <span>${formatNumber(userData.public_repos)} repos</span>
                </div>
            </div>

            <div class="repos-section">
                <h3><i class="fas fa-book"></i> Recent Repositories</h3>
                <ul id="repo-list">
                    ${reposData
						.map(
							(repo) => `
                        <li>
                            <div class="repo-info">
                                <a href="${repo.html_url}" target="_blank">
                                    <i class="fas fa-code-branch"></i> ${repo.name}
                                </a>
                                <p class="repo-description">${repo.description || "No description available"}</p>
                                <div class="repo-meta">
                                    <span><i class="fas fa-star"></i> ${formatNumber(repo.stargazers_count)}</span>
                                    <span><i class="fas fa-code-branch"></i> ${formatNumber(repo.forks_count)}</span>
                                    <span><i class="fas fa-calendar"></i> Updated ${formatDate(repo.updated_at)}</span>
                                </div>
                            </div>
                        </li>
                    `
						)
						.join("")}
                </ul>
            </div>
        </div>
    `;
}

// Add particle effect interactions
document.addEventListener("DOMContentLoaded", () => {
	document.querySelector(".user-profile")?.addEventListener("mouseenter", () => {
		particlesJS("particles-js", {
			particles: {
				move: { speed: 0.5 }, // Slow down particles on hover
				opacity: { value: 0.3 }, // Reduce opacity slightly
			},
		});
	});

	document.querySelector(".user-profile")?.addEventListener("mouseleave", () => {
		particlesJS("particles-js", {
			particles: {
				move: { speed: 2 }, // Restore normal speed
				opacity: { value: 0.5 }, // Restore opacity
			},
		});
	});
});
