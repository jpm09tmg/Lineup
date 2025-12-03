import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
  try {
    const gameId = params.id;
    const { userId, status } = await request.json();

    if (!userId || !status || !['in', 'out'].includes(status)) {
      return Response.json({ error: 'Invalid data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('lineup');
    
    const game = await db.collection('games').findOne({ 
      _id: new ObjectId(gameId) 
    });

    if (!game) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }

    await db.collection('games').updateOne(
      { _id: new ObjectId(gameId) },
      { 
        $pull: { attendance: { userId: new ObjectId(userId) } }
      }
    );

    await db.collection('games').updateOne(
      { _id: new ObjectId(gameId) },
      { 
        $push: { 
          attendance: { 
            userId: new ObjectId(userId), 
            status,
            updatedAt: new Date()
          }
        }
      }
    );

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
