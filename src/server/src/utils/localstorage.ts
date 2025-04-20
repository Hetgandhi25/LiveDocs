import fs from 'fs';
import path from 'path';
import axios from 'axios';

// import fs from 'fs';
// import path from 'path';

export function saveLocally(docId: string, docData: any) {
  const dir = path.join(__dirname, '../../local-storage');
  const filePath = path.join(dir, 'data.json');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let existingData: { [key: string]: any } = {};

  // Step 1: Read current data
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (err) {
      console.error('❌ Error reading local file:', err);
    }
  }

  // Step 2: Update or add this doc
  existingData[docId] = {
    ...docData,
    updatedAt: new Date(),
  };

  // Step 3: Write back to the same file
  try {
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    console.log(`✅ Saved doc '${docId}' to local file`);
  } catch (err) {
    console.error('❌ Error writing to local file:', err);
  }
}

export function getDocumentFromLocalStorage(docId: string) {
    const dir = path.join(__dirname, '../../local-storage');
    const filePath = path.join(dir, 'data.json');
  
    if (!fs.existsSync(filePath)) {
      console.log('❌ No data file found!');
      return null; // Or throw an error
    }
  
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const existingData = JSON.parse(fileContent);
  
      return existingData[docId] || null; // Return null if document not found
    } catch (err) {
      console.error('❌ Error reading local file:', err);
      return null; // Or throw an error
    }
  }


export async function sendToNearbyServer(docData: any) {
  try {
    await axios.post('http://<NEARBY-SERVER-IP>:<PORT>/api/replica', docData);
    console.log('✅ Sent to nearby server');
  } catch (err: any) {
    console.error('❌ Failed to replicate:', err.message);
  }
}