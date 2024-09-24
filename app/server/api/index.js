import { connectToDatabase } from '../../entry.server';
import { ObjectId } from 'mongodb';

export async function getProjects() {
  const db = await connectToDatabase();
  return db.collection('projects').find().toArray();
}

export async function createProject(name) {
  const db = await connectToDatabase();
  const existingProject = await db.collection('projects').findOne({ name });
  if (existingProject) {
    throw new Error('A project with this name already exists');
  }

  const result = await db.collection('projects').insertOne({
    name,
    createdAt: new Date(),
  });

  return {
    _id: result.insertedId,
    name,
    createdAt: new Date(),
  };
}

export async function getProjectByName(name) {
  const db = await connectToDatabase();
  return db.collection('projects').findOne(
    { name },
    {
      projection: {
        name: 1,
        description: 1,
        logs: {
          $slice: ['$logs', 20]  // Limit to the 20 most recent logs
        }
      }
    }
  );
}

export async function addLogToProject(projectName, logData) {
  const db = await connectToDatabase();
  return db.collection('projects').updateOne(
    { name: projectName },
    { 
      $push: { 
        logs: {
          _id: new ObjectId(),
          ...logData,
          addedDate: new Date(logData.addedDate)
        }
      }
    }
  );
}