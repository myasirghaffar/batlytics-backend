# MongoDB Setup for Barlytics Backend

The backend connects to a local MongoDB instance. Use this guide to install, start, and verify MongoDB.

## Connection string

The backend uses:

```
mongodb://localhost:27017/inventory
```

- **Host:** `localhost` (127.0.0.1)
- **Port:** `27017` (default)
- **Database:** `inventory`

## 1. Check if MongoDB is installed

```bash
mongod --version
```

If the command is not found, install MongoDB first.

## 2. Install MongoDB (macOS with Homebrew)

```bash
# Tap the MongoDB repo
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community

# Optional: start MongoDB at login
brew services start mongodb-community
```

## 3. Start MongoDB

### Option A: One-time run (foreground)

```bash
mongod
```

### Option B: Run as a service (macOS)

```bash
brew services start mongodb-community
```

### Option C: Linux (systemd)

```bash
sudo systemctl start mongod
```

## 4. Verify MongoDB is running

```bash
# Check if mongod process exists
ps aux | grep mongod

# Or check MongoDB version (confirms installation)
mongod --version
```

## 5. Test the connection

From the backend directory:

```bash
cd Barlytics-backend-main
npm start
```

On success you should see:

```
MongoDB Connected: inventory
```

## 6. Troubleshooting

### Port 27017 in use

If another process uses port 27017:

```bash
# macOS: find what's using the port
lsof -i :27017
```

### Firewall

Ensure connections to `127.0.0.1:27017` or `::1:27017` are allowed. Local connections are usually allowed by default.

### Authentication

The default connection uses no authentication. If your MongoDB has auth enabled, use:

```
mongodb://username:password@localhost:27017/inventory
```

Then set `MONGO_URI` in `.env` accordingly.

### Custom port

If MongoDB runs on a different port, update `.env`:

```
MONGO_URI=mongodb://localhost:YOUR_PORT/inventory
```
