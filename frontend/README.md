# ShootingDApp CMS

A content management system for managing players, drones, achievements, rewards, and token balances for  ShootingDApp.

## Features

- **Authentication System**
  - JWT-based authentication
  - Protected routes and API endpoints
  - Admin access control

- **Player Management**
  - View and manage player profiles
  - Track player statistics
  - Handle wallet addresses
  - Monitor player activity

- **Drone Management**
  - Track drone positions
  - Monitor drone activity
  - Manage drone assignments

- **Achievement System**
  - Track player achievements
  - Manage achievement milestones
  - NFT token integration

- **Reward System**
  - Track reward distributions
  - Manage different reward types
  - Historical reward data

- **Token Balance Management**
  - Monitor player token balances
  - Track minted and pending tokens
  - Manage token transactions

## Tech Stack

- **Frontend**
  - React
  - Tailwind CSS
  - Lucide React Icons

- **Backend**
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Setup

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

3. Configure environment variables
```bash
# Create .env file in backend directory
cp .env.example .env

# Add required variables
PORT=3001
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-secret-key
```


5. Start the servers
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## API Endpoints

- `/api/auth/login` - Authentication
- `/api/players` - Player management
- `/api/drones` - Drone management
- `/api/achievements` - Achievement management
- `/api/rewards` - Reward management
- `/api/token-balances` - Token balance management

## Development

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Contact

Jose Catala - jfca68@gmail.com
