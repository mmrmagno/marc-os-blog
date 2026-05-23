---
title: "Building VALART: A Tool for creating ASCII Art"
description: "Introducing VALART, a tool that lets Valorant players effortlessly create and share ASCII art in the in-game chat."
pubDate: 2025-05-20
tags: []
draft: false
---

# Project Overview

VALART is a web-based tool that provides a user-friendly interface for creating ASCII art specifically formatted for Valorant's in-game chat. The tool ensures that the created art fits within Valorant's chat constraints and can be easily copied and pasted into the game.

## Technical Implementation

### Frontend Architecture

The frontend is built with React and TypeScript, focusing on providing a seamless drawing experience. Key features include:

- A grid system that matches Valorant's chat width constraints
- Real-time preview of how the art will look in-game
- One-click copy functionality for easy sharing

The UI is styled using Styled Components, implementing Valorant's visual language to create a familiar experience for players.

### Backend Services

The backend is implemented using Node.js with Express, providing:
- Static file serving for the web application
- API endpoint for art submissions
- Email notifications for new submissions

### Deployment

The application is deployed using Docker containers.

## Development Challenges

The main challenges in developing VALART were:

1. **Chat Width Constraints**
   - Ensuring the grid system matches Valorant's chat width
   - Implementing proper character spacing
   - Testing with different font sizes in-game

2. **User Experience**
   - Making the tool intuitive for players
   - Providing quick copy-paste functionality
   - Ensuring the art looks good in-game

3. **Performance**
   - Optimizing the grid system for smooth drawing
   - Implementing efficient state management
   - Ensuring fast loading times

## Future Enhancements

Planned improvements include:
- Admin interface for easier management of the gallery
- Whatever else that comes to mind...

## Conclusion

You can try VALART at [val.marc-os.com](https://val.marc-os.com) and explore the source code on [GitHub](https://github.com/mmrmagno/valart).
