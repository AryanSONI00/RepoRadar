# RepoRadar - GitHub Profile Analyzer

<div align="center">
  <img src="assets/logo.png" alt="RepoRadar Logo" width="200"/>
  <p>
    <strong>A beautiful and interactive GitHub profile analyzer that provides deep insights into a developer's GitHub activity.</strong>
  </p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#roadmap">Roadmap</a>
  </p>
</div>

## 🌟 Features

### Current Features

#### Profile Overview

-   Beautiful user profile display with avatar and bio
-   Key statistics (followers, following, public repositories)
-   Interactive particle background effect
-   Responsive design for all devices

#### Repository Analysis

-   Recent repositories with detailed information
-   Language breakdown for each repository
-   Star and fork counts
-   Last update timestamps
-   Repository descriptions

#### Activity Insights

-   GitHub contribution heatmap (last 52 weeks)
-   Recent activity feed
-   Commit history visualization
-   Star and fork trends
-   Language distribution charts

#### Gists & Starred Repositories

-   Recent gists display
-   Most starred repositories
-   Fork counts and creation dates

#### Analytics & Visualization

-   Interactive charts using Chart.js
-   Contribution heatmap using D3.js
-   Language distribution pie chart
-   Star and fork trends line chart
-   Commit history bar chart

#### Sharing Capabilities

-   Generate beautiful profile cards
-   Share on Twitter and LinkedIn
-   Download profile cards as images
-   Customizable sharing messages

### Upcoming Features

#### Enhanced Analytics

-   [ ] Repository size and growth trends
-   [ ] Issue and pull request statistics
-   [ ] Code review metrics
-   [ ] Repository collaboration network

#### Advanced Visualizations

-   [ ] 3D repository network graph
-   [ ] Interactive timeline of contributions
-   [ ] Code complexity analysis
-   [ ] Commit pattern analysis

#### Social Features

-   [ ] Compare profiles with other developers
-   [ ] Achievement badges system
-   [ ] Profile customization options
-   [ ] Team collaboration insights

#### Developer Tools

-   [ ] GitHub API rate limit management
-   [ ] Custom data export options
-   [ ] API documentation
-   [ ] Browser extension support

## 🛠️ Tech Stack

-   **Frontend Framework**: Vanilla JavaScript
-   **Styling**: CSS3 with modern features
-   **Visualization Libraries**:
    -   D3.js for contribution heatmap
    -   Chart.js for interactive charts
    -   Particles.js for background effects
-   **GitHub Integration**: GitHub REST API v3
-   **Image Processing**: html2canvas for profile cards

## 🚀 Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/RepoRadar.git
    ```

2. Navigate to the project directory:

    ```bash
    cd RepoRadar
    ```

3. Open `index.html` in your browser or use a local server:

    ```bash
    # Using Python
    python -m http.server 8000

    # Using Node.js
    npx serve
    ```

4. Visit `http://localhost:8000` in your browser

## 🔧 Configuration

To use the GitHub API with higher rate limits, you can add your GitHub token:

1. Create a GitHub Personal Access Token
2. Add it to the headers in `script.js`:
    ```javascript
    const headers = {
    	Accept: "application/vnd.github.v3+json",
    	Authorization: "token YOUR_GITHUB_TOKEN",
    };
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   GitHub API for providing comprehensive developer data
-   D3.js and Chart.js for powerful visualization capabilities
-   Particles.js for the beautiful interactive background
-   All contributors and users of RepoRadar

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/AryanSONI00">Aryan Soni</a></p>
  <p>
    <a href="mailto:aryan151soni@gmail.com">
      <i class="fas fa-envelope"></i> Contact
    </a>
  </p>
</div>
