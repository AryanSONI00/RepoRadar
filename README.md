# RepoRadar - GitHub Profile Analyzer 🚀

<div align="center">
  <h3>🔍 Transform Your GitHub Activity into Stunning Visual Insights</h3>
  <p>
    <a href="https://aryansoni00.github.io/RepoRadar-/">
      <img src="https://img.shields.io/badge/Live%20Demo-RepoRadar-blue?style=for-the-badge&logo=github" alt="Live Demo">
    </a>
    <img src="https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge" alt="Version">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
  </p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#setup">Setup</a> •
    <a href="#roadmap">Roadmap</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

## 📌 What is RepoRadar?

RepoRadar is an advanced **GitHub Profile Analyzer** that leverages the GitHub API to fetch user statistics (repositories, commits, pull requests, etc.) and presents them using **dynamic, interactive visualizations**. It helps developers gain deep insights into their GitHub activity through beautifully crafted analytics dashboards.

---

## 🌟 Features

### ✅ Current Capabilities

#### 👤 Profile Overview

-   **Rich User Profile Display**: Avatar, bio, and essential GitHub stats.
-   **Key Metrics**: Followers, following count, and public repositories.
-   **Aesthetic Particle Background**: Powered by Particles.js.
-   **Fully Responsive UI**: Optimized for all screen sizes.

#### 📚 Repository Analysis

-   **Recent Repository Insights**: Fetches and displays key repository details.
-   **Language Breakdown**: Pie charts visualizing repo language distribution.
-   **Engagement Metrics**: Star and fork counts, last update timestamps.
-   **Repository Descriptions & Trends**: Easy-to-read, structured insights.

#### 📈 Activity Insights

-   **GitHub Contribution Heatmap** (last 52 weeks) using D3.js.
-   **Real-time Commit History & Trends** using Chart.js.
-   **Language Distribution Pie Charts**.
-   **Star & Fork Growth Trends** in a line chart.

#### 💫 Gists & Starred Repositories

-   **Recent Gists Display**: Showcasing public gists with timestamps.
-   **Top Starred Repositories**: Listing most popular starred repositories.
-   **Fork & Star Insights**: Tracks repository popularity over time.

#### 🔗 Sharing & Export Features

-   **Custom Profile Cards**: Generate beautiful, shareable GitHub profile cards.
-   **Social Media Integration**: Share insights on Twitter & LinkedIn.
-   **Downloadable Visuals**: Export profile cards as images.

---

## 🔮 Roadmap (Upcoming Features)

### 🚀 Advanced Analytics

-   [ ] **Repository Size & Growth Trends**
-   [ ] **Issue & Pull Request Analytics**
-   [ ] **Code Review & Collaboration Metrics**
-   [ ] **Repository Dependency Graphs**

### 🎨 Enhanced Visualizations

-   [ ] **3D Repository Network Graphs**
-   [ ] **Interactive Contribution Timeline**
-   [ ] **Commit Pattern Heatmaps**
-   [ ] **Code Complexity Analysis**

### 👥 Social & Community Features

-   [ ] **Developer Profile Comparisons**
-   [ ] **Gamified Achievement Badges**
-   [ ] **Profile Customization Options**
-   [ ] **Team Collaboration Insights**

### 🛠️ Dev Tools & Integrations

-   [ ] **GitHub API Rate Limit Management**
-   [ ] **Custom Data Export to CSV/JSON**
-   [ ] **API Documentation for Developers**
-   [ ] **Browser Extension Support**

---

## 🛠️ Tech Stack

| Technology            | Purpose                                    |
| --------------------- | ------------------------------------------ |
| **HTML5**             | Structuring the application layout         |
| **CSS3**              | Styling and making the UI responsive       |
| **JavaScript (ES6+)** | Dynamic interactions and API handling      |
| **GitHub API**        | Fetching user data and repository insights |
| **Chart.js**          | Rendering analytical visualizations        |
| **D3.js**             | Contribution heatmap and data charts       |
| **Particles.js**      | Interactive background animations          |
| **html2canvas**       | Exporting profile visuals                  |

---

## 🚀 Setup & Usage

### 🛠️ Clone the Repository

```bash
git clone https://github.com/AryanSONI00/RepoRadar-.git
cd RepoRadar-
```

### 🚀 Run the Project

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

### 🔗 Access the Application

Open your browser and visit: `http://localhost:8000`

### 🔧 Configuration: Increase API Rate Limits

To use the GitHub API efficiently, add a **Personal Access Token (PAT)**:

1. **Generate a GitHub Token** (Settings > Developer Settings > Tokens)
2. Add it to `script.js`:

```javascript
const headers = {
	Accept: "application/vnd.github.v3+json",
	Authorization: "token YOUR_GITHUB_TOKEN",
};
```

---

## 🤝 Contributing

🚀 Contributions are always welcome! Feel free to fork the repo, implement features, and open PRs.

### 🛠️ Contribution Workflow

1. **Fork the repository**
2. **Create a new branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Added AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Create a Pull Request** 🚀

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   **GitHub API**: Comprehensive data source.
-   **D3.js & Chart.js**: Powering stunning visualizations.
-   **Particles.js**: Adding aesthetic UI effects.
-   **Contributors & Users**: You make this project awesome!

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/AryanSONI00">Aryan Soni</a></p>
  <p>
    📧 <a href="mailto:aryan151soni@gmail.com">Contact</a>
  </p>
</div>
