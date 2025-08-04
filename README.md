# Web-Based Translator Application

## Changelog

### Recent Major Updates

- **UI/UX Redesign:**
  - Clean, containerless single-page layout for a modern look.
  - All settings (theme, accent color, font size, background) moved into a hamburger menu for uncluttered access.
  - Unified button styles and sizes, replaced action buttons with emojis, and improved alignment and spacing.
  - Visually polished dark mode and restored theme toggle.
  - Removed high contrast theme and related code for simplicity.
  - Fixed switch button and hamburger menu event handling.
  - Translate button always shows emoji, with a spinner for loading state.

- **Feature Additions:**
  - **Copy to Clipboard, Speak Output, Download as .txt:** Quick actions for translated text.
  - **Translation History:** View and reuse previous translations.
  - **Auto-Detect Language:** Automatically detect input language.
  - **Share Translation:** Share translations easily.
  - **Character/Word Count:** Live count for input text.
  - **Input Validation:** Prevent empty or invalid submissions.
  - **UI Customization:** Change accent color, font size, and background pattern.
  - **Keyboard Shortcuts:** For faster workflow.
  - **Offline Mode:** Basic offline support for UI.
  - **Language Flags:** Visual cues for selected languages.
  - **Accessibility Improvements:**
    - ARIA live regions for screen readers.
    - Improved focus states and keyboard navigation.
    - Toast notifications for actions and errors.
    - Voice button state feedback and best-match TTS voice selection, with fallback notification if unsupported.

- **Bug Fixes & Refinements:**
  - Fixed button overlap, alignment, and spacing issues.
  - Ensured all action buttons are the same size and visually harmonious.
  - Improved loading states and feedback for all actions.
  - Addressed browser TTS support issues for some languages.

---

This is a web-based translation tool designed to facilitate easy and quick translation between multiple languages. The application leverages HTML, CSS, and JavaScript to provide a user-friendly interface and responsive design, suitable for both desktop and mobile browsers.

## Features

- **Multiple Language Support:** Users can select from a wide range of source and target languages.
- **Voice Recognition:** Allows for speech-to-text input in selected languages.
- **Text-to-Speech:** Users can listen to the translations.
- **Responsive Design:** Ensures that the application works well on a variety of devices, from phones to desktop computers.
- **Interactive UI:** Includes beautiful animations and a clean, modern aesthetic inspired by professional design references.

## Technology Stack

- **HTML:** Structures the web page and its content.
- **CSS:** Styles the presentation, including layout, colors, and fonts.
- **JavaScript:** Adds interactivity, handles API requests for translation, and manages DOM elements dynamically.

Open the HTML File
You can open the index.html file in any modern web browser to run the application.
How to Use
Choose the source and target languages from the dropdown menus.
Enter the text you want to translate in the input field.
Click the "Translate" button to see the translated text in the output area.
Use the "Speak" button to hear the spoken version of the translated text.
Contributing
We welcome contributions to improve the application. Here are some ways you can contribute:

Reporting Bugs: Open an issue if you find a bug.
New Features: Suggest new features or enhancements.
Pull Requests: Submit pull requests for your proposed changes.
Contributing Guidelines
Fork the repository and clone it locally.
Create a new branch for your edits (git checkout -b feature/YourFeature).
Commit your changes (git commit -am 'Add some YourFeature').
Push to the branch (git push origin feature/YourFeature).
Create a new Pull Request.


Acknowledgments
Google Translate API for backend translation services.
Inspiration from various design references.
Community contributions and feedback.

Made with ❤️ by Somnath
