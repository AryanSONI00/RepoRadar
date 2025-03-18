function fetchGitHubData() {
	let username = document.getElementById("username").value;
	if (!username) return alert("Please enter a GitHub username!");

	fetch(`https://api.github.com/users/${username}`)
		.then((response) => response.json())
		.then((data) => {
			document.getElementById("output").innerHTML = `
                <h2>${data.name || data.login}</h2>
                <p>Followers: ${data.followers} | Following: ${data.following}</p>
                <img src="${data.avatar_url}" width="100" alt="Avatar">
                <h3>Repositories:</h3>
                <ul id="repo-list"></ul>
            `;

			fetchRepos(username);
		})
		.catch((error) => console.error("Error fetching user data:", error));
}

function fetchRepos(username) {
	fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`)
		.then((response) => response.json())
		.then((repos) => {
			let repoList = document.getElementById("repo-list");
			repoList.innerHTML = repos
				.map(
					(repo) => `
                <li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    ⭐ ${repo.stargazers_count}
                </li>
            `
				)
				.join("");
		})
		.catch((error) => console.error("Error fetching repos:", error));
}
