# Live Meeting Alert

A lightweight, modern web application for scheduling, managing, and receiving alerts for upcoming meetings. Features a beautiful glassmorphism design with animated backgrounds.

## Features

- **Meeting Management** - Add, edit, and delete meetings with ease
- **Smart Status Detection** - Automatically categorizes meetings as Live, Upcoming, or Past
- **Organized Views** - Separate sections for Live Now, Today's Schedule, and All Upcoming meetings
- **Quick Join** - One-click access to meeting links (Zoom, Teams, Google Meet, etc.)
- **Persistent Storage** - Meetings saved locally in your browser
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Glassmorphism design with animated gradient backgrounds

## Tech Stack

- Vanilla JavaScript (no frameworks)
- Tailwind CSS (via CDN)
- HTML5 LocalStorage API
- Google Fonts (Outfit, JetBrains Mono)

## Installation

No build process or dependencies required. Simply:

1. Clone or download this repository
2. Open `index.html` in any modern web browser

### Optional: Local Server

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## Usage

1. **Add a Meeting** - Fill in the meeting name, date, time, and link, then click "Add Meeting"
2. **View Meetings** - Meetings automatically appear in the appropriate section based on their status
3. **Join a Meeting** - Click the "Join Meeting" button to open the meeting link
4. **Edit a Meeting** - Click the pencil icon to modify meeting details
5. **Delete a Meeting** - Click the trash icon to remove a meeting

### Meeting Status

- **LIVE** - Meetings within 60 minutes of their scheduled time (red pulsing indicator)
- **UPCOMING** - Future meetings (amber indicator)
- **PAST** - Completed meetings (grayed out)

## Project Structure

```
Live Meeting Alert/
├── index.html      # Main application entry point
├── css/
│   └── styles.css  # Custom styles and animations
├── js/
│   └── app.js      # Application logic and state management
└── README.md
```

## Browser Support

Works on all modern browsers with ES6+ support:
- Chrome
- Firefox
- Safari
- Edge

## License

MIT License
