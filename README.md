# Lineup - Hockey Team Attendance App

A simple attendance management app for hockey teams built with Next.js and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB:
   - Install MongoDB locally or create a MongoDB Atlas account
   - Update `.env.local` with your MongoDB connection string

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Database Structure

### Collections

**users**
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

**teams**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  members: [ObjectId], // user IDs
  createdAt: Date
}
```

**games**
```javascript
{
  _id: ObjectId,
  teamId: ObjectId,
  opponent: String,
  date: Date,
  location: String,
  attendance: [
    {
      userId: ObjectId,
      status: String, // 'in' or 'out'
      updatedAt: Date
    }
  ],
  createdAt: Date
}
```

## Sample Data

To test the app, you can insert sample data into MongoDB:

```javascript
// Sample team
db.teams.insertOne({
  name: "Calgary Warriors",
  description: "Div 3 Hockey Team",
  members: [],
  createdAt: new Date()
})

// Sample games (replace TEAM_ID with actual team _id)
db.games.insertMany([
  {
    teamId: ObjectId("TEAM_ID"),
    opponent: "Edmonton Elks",
    date: new Date("2024-12-15T19:00:00"),
    location: "Calgary Arena",
    attendance: [],
    createdAt: new Date()
  },
  {
    teamId: ObjectId("TEAM_ID"),
    opponent: "Red Deer Rebels",
    date: new Date("2024-12-22T18:30:00"),
    location: "Home Rink",
    attendance: [],
    createdAt: new Date()
  }
])
```

## Features Implemented

- User registration and login
- Team search
- View team schedule
- Mark attendance as In or Out
- See attendance counts per game

## Next Steps

- Create team functionality
- Add/remove team members
- Create/edit games
- Team admin features
- Better styling
