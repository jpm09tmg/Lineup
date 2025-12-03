import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return Response.json({ teams: [] });
    }

    const client = await clientPromise;
    const db = client.db('lineup');
    
    const teams = await db.collection('teams')
      .find({ 
        name: { $regex: query, $options: 'i' } 
      })
      .limit(10)
      .toArray();

    return Response.json({ teams });

  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
