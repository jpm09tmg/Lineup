import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const teamId = params.id;

    const client = await clientPromise;
    const db = client.db('lineup');
    
    const team = await db.collection('teams').findOne({ 
      _id: new ObjectId(teamId) 
    });

    if (!team) {
      return Response.json({ error: 'Team not found' }, { status: 404 });
    }

    const games = await db.collection('games')
      .find({ teamId: new ObjectId(teamId) })
      .sort({ date: 1 })
      .toArray();

    return Response.json({ team, games });

  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
