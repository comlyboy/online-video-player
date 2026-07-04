# 🎥 Online Video Player

A lightweight, modern web-based video player built with **Angular 22** and **ArtPlayer.js** that streams videos directly from a URL.

Unlike traditional video players, this application is designed exclusively for **URL-based playback**. Simply paste a direct video URL and start watching instantly—no uploads, file management, or local storage required.

---

## ✨ Features

- 🎬 Play videos directly from a URL
- ⚡ No video uploads or file selection
- 📱 Responsive design for desktop and mobile
- 🎨 Modern UI powered by Angular 22
- 🚀 Fast playback using ArtPlayer.js
- 🔗 Supports publicly accessible video URLs
- ⏯️ Built-in playback controls
- 🔊 Volume and mute controls
- ⚙️ Fullscreen support
- ⏩ Playback speed controls
- 📺 Picture-in-Picture (browser support dependent)

---

## 📸 Preview

> _Add screenshots or a demo GIF here._

```
/docs/images/player.png
```

---

## 🛠️ Tech Stack

- **Framework:** Angular 22
- **Language:** TypeScript
- **Player:** ArtPlayer.js
- **Styling:** CSS / SCSS
- **Package Manager:** npm

---

## 📦 Installation

Clone the repository.

```bash
git clone https://github.com/comlyboy/online-video-player.git
```

Navigate into the project.

```bash
cd online-video-player
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
ng serve
```

Open your browser.

```
http://localhost:4200
```

---

## 🚀 Build

Create a production build.

```bash
ng build
```

The compiled application will be located in:

```
dist/
```

---

## ▶️ Usage

1. Open the application.
2. Paste a publicly accessible direct video URL.
3. Click **Play**.
4. Enjoy streaming.

Example:

```
https://example.com/video.mp4
```

---

## 📹 Supported Formats

Support depends on the browser.

Common supported formats include:

- MP4
- WebM
- Ogg
- HLS (with additional configuration)
- DASH (with additional configuration)

---

## 🌐 Video URL Requirements

The application only plays **direct video URLs**.

✅ Supported

```
https://example.com/movie.mp4
```

```
https://cdn.example.com/videos/sample.webm
```

❌ Not Supported

```
https://youtube.com/watch?v=xxxx
```

```
https://vimeo.com/xxxx
```

```
Local video files
```

```
Video pages instead of direct media URLs
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── shared/
├── assets/
├── environments/
└── styles/
```

---

## 📚 ArtPlayer

This project uses **ArtPlayer.js**, a modern HTML5 video player with an extensive plugin ecosystem and customizable UI.

Official Website:

https://artplayer.org/

Documentation:

https://artplayer.org/document/en/

GitHub:

https://github.com/zhw2590582/ArtPlayer

---

## 💡 Future Enhancements

- Playlist support
- Subtitle loading
- Subtitle search
- HLS support
- DASH support
- Keyboard shortcuts
- Video history
- Recently played videos
- URL validation
- Theme switching
- Custom themes
- Playback persistence
- Chromecast support
- AirPlay support
- Screenshot capture
- Thumbnail previews
- Media Session API
- Keyboard accessibility
- Mobile gesture controls

---

## 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/my-feature
```

3. Commit your changes.

```bash
git commit -m "Add awesome feature"
```

4. Push your branch.

```bash
git push origin feature/my-feature
```

5. Open a Pull Request.

---

## 🐛 Reporting Issues

Found a bug or have a feature request?

Please open an issue describing:

- Expected behaviour
- Actual behaviour
- Browser
- Operating System
- Steps to reproduce

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- Angular Team
- ArtPlayer.js
- TypeScript

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates continued development.