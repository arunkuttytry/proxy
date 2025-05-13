# 3Proxy UI Manager

A modern web interface for managing 3proxy servers with IP binding capabilities.

## Features

- Modern React-based dashboard
- Real-time proxy management
- IP binding support
- Automatic configuration generation
- Docker-based deployment
- Vercel frontend deployment support

## Architecture

- Frontend: React with Material-UI
- Backend: Node.js/Express
- Proxy: 3proxy
- Containerization: Docker

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3proxy-ui-manager
```

2. Start the services:
```bash
docker-compose up -d
```

## Configuration

### Frontend
- Set `REACT_APP_API_URL` in Vercel environment variables
- Default: http://localhost:4000

### Backend
- Set `FRONTEND_URL` in .env file
- Default port: 4000

### Proxy
- Configuration file: config/3proxy.cfg
- Ports: 3000-3010

## Usage

1. Access the dashboard at http://localhost:3000
2. Add proxies with IP and port
3. Configure your browser to use the proxy
4. Verify IP binding at whatismyip.com

## Development

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set environment variables
3. Deploy

### Backend (Ubuntu)
1. Install Docker and Docker Compose
2. Clone repository
3. Configure environment
4. Run docker-compose

## License

MIT
