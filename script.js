// Show loading spinner
function showLoading() {
	document.getElementById("loading").style.display = "flex";
	document.getElementById("output").innerHTML = "";
	document.getElementById("analytics-container").style.display = "none";
}

// Hide loading spinner
function hideLoading() {
	document.getElementById("loading").style.display = "none";
}

// Show error message
function showError(message) {
	hideLoading();
	document.getElementById("analytics-container").style.display = "none";
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

	// Common headers for GitHub API requests
	const headers = {
		Accept: "application/vnd.github.v3+json",
		// Add your GitHub token here if you have one
		// 'Authorization': 'token YOUR_GITHUB_TOKEN'
	};

	try {
		// Fetch user data
		const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
		if (!userResponse.ok) {
			if (userResponse.status === 403) {
				throw new Error("API rate limit exceeded. Please try again later.");
			} else if (userResponse.status === 404) {
				throw new Error("User not found!");
			} else {
				throw new Error(`Failed to fetch user data (Status: ${userResponse.status})`);
			}
		}
		const userData = await userResponse.json();

		// Fetch repositories data
		const [reposResponse, gistsResponse, starredReposResponse] = await Promise.all([
			fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`, { headers }),
			fetch(`https://api.github.com/users/${username}/gists?per_page=5`, { headers }),
			fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`, { headers }),
		]);

		if (!reposResponse.ok || !gistsResponse.ok || !starredReposResponse.ok) {
			throw new Error("Failed to fetch repository data. Please try again later.");
		}

		const [reposData, gistsData, starredReposData] = await Promise.all([
			reposResponse.json(),
			gistsResponse.json(),
			starredReposResponse.json(),
		]);

		// Fetch language data for each repo
		const reposWithLanguages = await Promise.all(
			reposData.map(async (repo) => {
				try {
					const langResponse = await fetch(repo.languages_url, { headers });
					if (langResponse.ok) {
						const languages = await langResponse.json();
						return { ...repo, languages };
					}
					return { ...repo, languages: {} };
				} catch (error) {
					console.warn(`Failed to fetch languages for ${repo.name}:`, error);
					return { ...repo, languages: {} };
				}
			})
		);

		// Fetch user activity for the last year
		const activityData = [];
		const pages = 10; // Fetch 10 pages of events (300 events)

		for (let page = 1; page <= pages; page++) {
			const activityResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=30&page=${page}`, { headers });

			if (activityResponse.ok) {
				const pageData = await activityResponse.json();
				if (pageData.length === 0) break; // Stop if no more events
				activityData.push(...pageData);
			} else {
				console.warn(`Failed to fetch activity data page ${page}:`, activityResponse.status);
				break;
			}
		}

		displayUserData(userData, reposWithLanguages, gistsData, starredReposData, activityData);
	} catch (error) {
		showError(error.message);
		console.error("Error fetching GitHub data:", error);
	}
}

function displayUserData(userData, reposData, gistsData, starredReposData, activityData) {
	hideLoading();

	// Show the analytics container
	document.getElementById("analytics-container").style.display = "block";

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
                                <div class="language-breakdown">
                                    ${Object.entries(repo.languages)
										.map(
											([lang, bytes]) => `
                                            <div class="language-item">
                                                <span class="language-name">${lang}</span>
                                                <div class="progress-bar">
                                                    <div class="progress" style="width: ${
														(bytes / Object.values(repo.languages).reduce((a, b) => a + b, 0)) * 100
													}%"></div>
                                                </div>
                                            </div>
                                        `
										)
										.join("")}
                                </div>
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

            <div class="gists-section">
                <h3><i class="fas fa-code"></i> Recent Gists</h3>
                <ul id="gists-list">
                    ${gistsData
						.map(
							(gist) => `
                        <li>
                            <div class="gist-info">
                                <a href="${gist.html_url}" target="_blank">
                                    <i class="fas fa-code"></i> ${Object.keys(gist.files)[0]}
                                </a>
                                <p class="gist-description">${gist.description || "No description available"}</p>
                                <div class="gist-meta">
                                    <span><i class="fas fa-code-branch"></i> ${formatNumber(gist.forks?.length || 0)} forks</span>
                                    <span><i class="fas fa-calendar"></i> Created ${formatDate(gist.created_at)}</span>
                                </div>
                            </div>
                        </li>
                    `
						)
						.join("")}
                </ul>
            </div>

            <div class="starred-section">
                <h3><i class="fas fa-star"></i> Most Starred Repositories</h3>
                <ul id="starred-list">
                    ${starredReposData
						.map(
							(repo) => `
                        <li>
                            <div class="repo-info">
                                <a href="${repo.html_url}" target="_blank">
                                    <i class="fas fa-star"></i> ${repo.name}
                                </a>
                                <p class="repo-description">${repo.description || "No description available"}</p>
                                <div class="repo-meta">
                                    <span><i class="fas fa-star"></i> ${formatNumber(repo.stargazers_count)} stars</span>
                                    <span><i class="fas fa-code-branch"></i> ${formatNumber(repo.forks_count)} forks</span>
                                </div>
                            </div>
                        </li>
                    `
						)
						.join("")}
                </ul>
            </div>

            <div class="activity-section">
                <h3><i class="fas fa-chart-line"></i> Recent Activity</h3>
                <ul id="activity-list">
                    ${activityData
						.map(
							(activity) => `
                        <li>
                            <div class="activity-info">
                                <i class="fas ${getActivityIcon(activity.type)}"></i>
                                <span>${formatActivity(activity)}</span>
                                <span class="activity-time">${formatDate(activity.created_at)}</span>
                            </div>
                        </li>
                    `
						)
						.join("")}
                </ul>
            </div>
        </div>
    `;

	// Clear previous charts and create new ones
	createActivityHeatmap(activityData);
	createCharts(reposData, activityData);
	setupShareButtons(userData, reposData);
}

function getActivityIcon(type) {
	const icons = {
		PushEvent: "fa-code-branch",
		CreateEvent: "fa-plus-circle",
		ForkEvent: "fa-code-fork",
		WatchEvent: "fa-star",
		IssuesEvent: "fa-exclamation-circle",
		PullRequestEvent: "fa-code-pull-request",
		IssueCommentEvent: "fa-comment",
		PullRequestReviewEvent: "fa-check-circle",
		ReleaseEvent: "fa-tag",
		DeleteEvent: "fa-trash",
	};
	return icons[type] || "fa-circle";
}

function formatActivity(activity) {
	const actor = activity.actor.login;
	const repo = activity.repo.name;

	switch (activity.type) {
		case "PushEvent":
			return `${actor} pushed to ${repo}`;
		case "CreateEvent":
			return `${actor} created ${activity.payload.ref_type} in ${repo}`;
		case "ForkEvent":
			return `${actor} forked ${repo}`;
		case "WatchEvent":
			return `${actor} starred ${repo}`;
		case "IssuesEvent":
			return `${actor} ${activity.payload.action} an issue in ${repo}`;
		case "PullRequestEvent":
			return `${actor} ${activity.payload.action} a pull request in ${repo}`;
		case "IssueCommentEvent":
			return `${actor} commented on an issue in ${repo}`;
		case "PullRequestReviewEvent":
			return `${actor} reviewed a pull request in ${repo}`;
		case "ReleaseEvent":
			return `${actor} released a new version of ${repo}`;
		case "DeleteEvent":
			return `${actor} deleted ${activity.payload.ref_type} in ${repo}`;
		default:
			return `${actor} performed an action in ${repo}`;
	}
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

// Activity Heatmap
function createActivityHeatmap(activityData) {
	const heatmapContainer = document.getElementById("activity-heatmap");
	if (!heatmapContainer) return;

	// Clear previous content
	heatmapContainer.innerHTML = "";

	// Process data
	const contributions = processActivityData(activityData);
	const dates = Object.keys(contributions).sort();
	if (dates.length === 0) {
		heatmapContainer.innerHTML = '<p class="no-data">No activity data available</p>';
		return;
	}

	// Create SVG
	const margin = { top: 20, right: 30, bottom: 20, left: 30 };
	const cellSize = 10;
	const cellPadding = 2;
	const width = 53 * (cellSize + cellPadding); // 53 weeks
	const height = 7 * (cellSize + cellPadding); // 7 days

	const svg = d3
		.select("#activity-heatmap")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	// Create color scale with more granular steps
	const maxContributions = Math.max(...Object.values(contributions));
	const colorSteps = [0, 1, 2, 4, 8, maxContributions];
	const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

	const colorScale = d3.scaleThreshold().domain(colorSteps.slice(1, -1)).range(colors);

	// Create cells
	const today = new Date();
	const dateArray = d3.timeDays(d3.timeWeek.offset(today, -52), today);

	svg.selectAll("rect")
		.data(dateArray)
		.enter()
		.append("rect")
		.attr("width", cellSize)
		.attr("height", cellSize)
		.attr("x", (d) => d3.timeWeek.count(d3.timeYear(d), d) * (cellSize + cellPadding))
		.attr("y", (d) => d.getDay() * (cellSize + cellPadding))
		.attr("fill", (d) => {
			const dateStr = d.toISOString().split("T")[0];
			const value = contributions[dateStr] || 0;
			return colorScale(value);
		})
		.attr("rx", 2)
		.attr("ry", 2)
		.on("mouseover", function (event, d) {
			const dateStr = d.toISOString().split("T")[0];
			const count = contributions[dateStr] || 0;

			// Show tooltip
			const tooltip = d3
				.select("#activity-heatmap")
				.append("div")
				.attr("class", "heatmap-tooltip")
				.style("position", "absolute")
				.style("background-color", "rgba(0, 0, 0, 0.8)")
				.style("color", "#fff")
				.style("padding", "5px 10px")
				.style("border-radius", "4px")
				.style("font-size", "12px")
				.style("left", `${event.pageX + 10}px`)
				.style("top", `${event.pageY - 25}px`);

			tooltip.html(`${formatDate(dateStr)}: ${count} contribution${count !== 1 ? "s" : ""}`);
		})
		.on("mouseout", function () {
			d3.selectAll(".heatmap-tooltip").remove();
		});

	// Add day labels
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	svg.selectAll(".day-label")
		.data(days)
		.enter()
		.append("text")
		.attr("class", "day-label")
		.style("font-size", "9px")
		.style("fill", "#8b949e")
		.attr("x", -margin.left)
		.attr("y", (d, i) => i * (cellSize + cellPadding) + cellSize)
		.text((d) => d);

	// Add month labels
	const months = d3.timeMonths(d3.timeMonth.offset(today, -11), today);
	svg.selectAll(".month-label")
		.data(months)
		.enter()
		.append("text")
		.attr("class", "month-label")
		.style("font-size", "10px")
		.style("fill", "#8b949e")
		.attr("x", (d) => {
			const firstSunday = d3.timeWeek.ceil(d);
			return d3.timeWeek.count(d3.timeYear(d), firstSunday) * (cellSize + cellPadding);
		})
		.attr("y", -5)
		.text((d) => d3.timeFormat("%b")(d));
}

function processActivityData(activityData) {
	const contributions = {};
	activityData.forEach((activity) => {
		if (activity.type === "PushEvent") {
			const date = activity.created_at.split("T")[0];
			const commitCount = activity.payload.commits?.length || 0;
			contributions[date] = (contributions[date] || 0) + commitCount;
		} else if (["CreateEvent", "PullRequestEvent", "IssuesEvent"].includes(activity.type)) {
			const date = activity.created_at.split("T")[0];
			contributions[date] = (contributions[date] || 0) + 1;
		}
	});
	return contributions;
}

// Charts
function createCharts(reposData, activityData) {
	// Language Distribution Chart
	const languageData = processLanguageData(reposData);
	new Chart(document.getElementById("languageChart"), {
		type: "pie",
		data: {
			labels: Object.keys(languageData),
			datasets: [
				{
					data: Object.values(languageData),
					backgroundColor: [
						"#58a6ff",
						"#1f6feb",
						"#238636",
						"#da3633",
						"#f6f8fa",
						"#ff7b72",
						"#7ee787",
						"#ffa657",
						"#c9d1d9",
						"#8b949e",
					],
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: "right",
					labels: {
						color: "#c9d1d9",
					},
				},
			},
		},
	});

	// Improved Star & Fork Trends Chart
	const trendsData = processTrendsData(reposData);
	new Chart(document.getElementById("trendsChart"), {
		type: "line",
		data: {
			labels: trendsData.labels,
			datasets: [
				{
					label: "Stars",
					data: trendsData.stars,
					borderColor: "#58a6ff",
					backgroundColor: "rgba(88, 166, 255, 0.1)",
					fill: true,
					tension: 0.3,
					pointRadius: 4,
					pointHoverRadius: 6,
					pointBackgroundColor: "#58a6ff",
					borderWidth: 2,
				},
				{
					label: "Forks",
					data: trendsData.forks,
					borderColor: "#238636",
					backgroundColor: "rgba(35, 134, 54, 0.1)",
					fill: true,
					tension: 0.3,
					pointRadius: 4,
					pointHoverRadius: 6,
					pointBackgroundColor: "#238636",
					borderWidth: 2,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					labels: { color: "#c9d1d9" },
				},
				tooltip: {
					mode: "index",
					intersect: false,
					backgroundColor: "rgba(13, 17, 23, 0.9)",
					titleColor: "#c9d1d9",
					bodyColor: "#c9d1d9",
					borderColor: "#30363d",
					borderWidth: 1,
				},
			},
			interaction: {
				mode: "nearest",
				axis: "x",
				intersect: false,
			},
			scales: {
				y: {
					beginAtZero: true,
					grid: {
						color: "rgba(255, 255, 255, 0.1)",
						drawBorder: false,
					},
					ticks: {
						color: "#8b949e",
						padding: 10,
						font: {
							size: 11,
						},
					},
				},
				x: {
					grid: {
						display: false,
					},
					ticks: {
						color: "#8b949e",
						maxRotation: 45,
						minRotation: 45,
						font: {
							size: 11,
						},
					},
				},
			},
		},
	});

	// Improved Commit History Chart
	const commitsData = processCommitsData(activityData);
	new Chart(document.getElementById("commitsChart"), {
		type: "bar",
		data: {
			labels: commitsData.labels,
			datasets: [
				{
					label: "Commits",
					data: commitsData.counts,
					backgroundColor: "rgba(35, 134, 54, 0.6)",
					borderColor: "#238636",
					borderWidth: 1,
					borderRadius: 4,
					hoverBackgroundColor: "rgba(35, 134, 54, 0.8)",
					barThickness: "flex",
					maxBarThickness: 25,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					labels: { color: "#c9d1d9" },
				},
				tooltip: {
					backgroundColor: "rgba(13, 17, 23, 0.9)",
					titleColor: "#c9d1d9",
					bodyColor: "#c9d1d9",
					borderColor: "#30363d",
					borderWidth: 1,
					callbacks: {
						label: function (context) {
							return `Commits: ${context.parsed.y}`;
						},
					},
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					grid: {
						color: "rgba(255, 255, 255, 0.1)",
						drawBorder: false,
					},
					ticks: {
						color: "#8b949e",
						padding: 10,
						font: {
							size: 11,
						},
						callback: function (value) {
							return Math.floor(value);
						},
					},
				},
				x: {
					grid: {
						display: false,
					},
					ticks: {
						color: "#8b949e",
						maxRotation: 45,
						minRotation: 45,
						font: {
							size: 11,
						},
					},
				},
			},
		},
	});
}

function processLanguageData(reposData) {
	const languages = {};
	reposData.forEach((repo) => {
		Object.entries(repo.languages).forEach(([lang, bytes]) => {
			languages[lang] = (languages[lang] || 0) + bytes;
		});
	});
	return languages;
}

function processTrendsData(reposData) {
	const sortedRepos = [...reposData].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
	return {
		labels: sortedRepos.map((repo) => repo.name),
		stars: sortedRepos.map((repo) => repo.stargazers_count),
		forks: sortedRepos.map((repo) => repo.forks_count),
	};
}

function processCommitsData(activityData) {
	const commits = {};
	activityData.forEach((activity) => {
		if (activity.type === "PushEvent") {
			const date = activity.created_at.split("T")[0];
			commits[date] = (commits[date] || 0) + activity.payload.commits.length;
		}
	});
	const sortedDates = Object.keys(commits).sort();
	return {
		labels: sortedDates,
		counts: sortedDates.map((date) => commits[date]),
	};
}

// Share Functionality
function setupShareButtons(userData, reposData) {
	document.getElementById("generateCard").addEventListener("click", () => generateProfileCard(userData, reposData));
	document.getElementById("shareTwitter").addEventListener("click", () => shareOnTwitter(userData));
	document.getElementById("shareLinkedIn").addEventListener("click", () => shareOnLinkedIn(userData));
	document.getElementById("downloadCard").addEventListener("click", downloadProfileCard);
}

function generateProfileCard(userData, reposData) {
	const cardContainer = document.getElementById("profileCard");
	const card = cardContainer.querySelector(".profile-card");

	// Generate card content
	card.innerHTML = `
        <img src="${userData.avatar_url}" alt="${
		userData.login
	}'s avatar" style="width: 120px; height: 120px; border-radius: 50%; margin-bottom: 20px;">
        <h2 style="color: #58a6ff; margin-bottom: 10px;">${userData.name || userData.login}</h2>
        <p style="color: #8b949e; margin-bottom: 20px;">${userData.bio || "No bio available"}</p>
        <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center;">
                <div style="color: #58a6ff; font-size: 1.5rem;">${formatNumber(userData.followers)}</div>
                <div style="color: #8b949e;">Followers</div>
            </div>
            <div style="text-align: center;">
                <div style="color: #58a6ff; font-size: 1.5rem;">${formatNumber(userData.public_repos)}</div>
                <div style="color: #8b949e;">Repositories</div>
            </div>
        </div>
        <div style="text-align: left;">
            <h3 style="color: #58a6ff; margin-bottom: 10px;">Top Languages</h3>
            ${generateLanguageBreakdown(reposData)}
        </div>
    `;

	cardContainer.style.display = "block";
}

function generateLanguageBreakdown(reposData) {
	const languages = processLanguageData(reposData);
	const total = Object.values(languages).reduce((a, b) => a + b, 0);

	return Object.entries(languages)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 5)
		.map(
			([lang, bytes]) => `
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #8b949e;">${lang}</span>
                    <span style="color: #8b949e;">${((bytes / total) * 100).toFixed(1)}%</span>
                </div>
                <div style="height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden;">
                    <div style="height: 100%; width: ${(bytes / total) * 100}%; background: #58a6ff; border-radius: 3px;"></div>
                </div>
            </div>
        `
		)
		.join("");
}

function downloadProfileCard() {
	const card = document.querySelector(".profile-card");
	html2canvas(card).then((canvas) => {
		const link = document.createElement("a");
		link.download = "github-profile-card.png";
		link.href = canvas.toDataURL();
		link.click();
	});
}

function shareOnTwitter(userData) {
	const text =
		`Check out ${userData.name || userData.login}'s GitHub profile! 🚀\n` +
		`Followers: ${formatNumber(userData.followers)}\n` +
		`Repositories: ${formatNumber(userData.public_repos)}\n` +
		`\nView on RepoRadar: ${window.location.href}`;

	const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
	window.open(url, "_blank");
}

function shareOnLinkedIn(userData) {
	const text =
		`Check out ${userData.name || userData.login}'s GitHub profile on RepoRadar! 🚀\n\n` +
		`A talented developer with ${formatNumber(userData.followers)} followers and ` +
		`${formatNumber(userData.public_repos)} public repositories.\n\n` +
		`View the full profile: ${window.location.href}`;

	const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
	window.open(url, "_blank");
}
