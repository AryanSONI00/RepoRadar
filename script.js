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
            `;
		})
		.catch((error) => console.error("Error fetching data:", error));
}
