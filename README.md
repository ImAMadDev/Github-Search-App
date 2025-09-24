# GitHub Search App

A modern, responsive web application for searching GitHub users and exploring their repositories. Built with vanilla JavaScript, featuring a sleek glassmorphism design, pagination, and dynamic language icons.

## Features

### 🔍 User Search
- Search for GitHub users by username or keywords
- Displays user profiles with avatars, bios, and stats
- Responsive grid layout for user cards

### 📄 User Details
- Click "More Info" to view detailed user information
- Shows followers, following, public repos, location, and bio
- Direct link to the user's GitHub profile

### 📚 Repository Exploration
- View user's repositories with descriptions and stats
- Dynamic programming language icons for each repo
- Pagination for large repository lists

### 🎨 Modern UI
- Glassmorphism design with translucent backgrounds and blur effects
- Dark theme optimized for readability
- Smooth animations and hover effects

### 📱 Responsive Design
- Works seamlessly on desktop, tablet, and mobile devices
- Adaptive layouts for different screen sizes

### ⚡ Performance
- Efficient API calls with pagination
- Parallel fetching of repository languages
- Optimized loading states

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: GitHub REST API
- **Styling**: Custom CSS with glassmorphism effects
- **Icons**: Custom SVG icons for programming languages

## Getting Started

### Prerequisites
- A modern web browser
- Internet connection for GitHub API access

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ImAMadDev/github-search-app.git
   cd github-search-app
   ```

2. Open `index.html` in your web browser

### Usage
1. Enter a GitHub username or search term in the input field
2. Click "Search" or press Enter
3. Browse through user results
4. Click "More Info" on any user to view their details and repositories
5. Use pagination buttons to navigate through results

## Project Structure

```
github-search-app/
├── index.html          # Main HTML file
├── script.js           # JavaScript logic
├── styles.css          # CSS styles
├── assets/             # SVG icons for programming languages
│   ├── javascript.svg
│   ├── python.svg
│   └── ...
└── README.md           # This file
```

## API Usage

This app uses the GitHub REST API:
- `GET /search/users` - Search for users
- `GET /users/{username}` - Get user details
- `GET /users/{username}/repos` - Get user repositories
- `GET /repos/{owner}/{repo}/languages` - Get repository languages

Note: GitHub API has rate limits. For unauthenticated requests, you can make up to 60 requests per hour.

## Customization

### Adding Language Icons
To add support for more programming languages:
1. Create or obtain an SVG icon for the language
2. Save it in the `assets/` folder with the normalized filename (e.g., `kotlin.svg` for Kotlin)
3. The app automatically detects and displays new icons

### Styling
Modify `styles.css` to customize colors, fonts, and effects. The glassmorphism effects use CSS `backdrop-filter` and `rgba` backgrounds.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- GitHub for providing the API
- Programming language icons inspired by various open-source projects
- Glassmorphism design trends

---

Built with ❤️ using vanilla JavaScript
