const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

const setFilePublic = async (fileId) => {
  try {
    const publicFile = await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    console.log('publicFile', publicFile.data);
  } catch (error) {
    console.log('setFilePublic: ', error);
  }
};

const getFile = async (fileId) => {
  try {
    const getFile = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });
    console.log('getFile', getFile.data);
  } catch (error) {
    console.log('getFile: ', error);
  }
}

const uploadFile = async ({ shared = false }) => {
  try {
    const createFile = await drive.files.create({
      requestBody: {
        name: 'test123.jpg',
        mimeType: 'image/jpg',
      },
      media: {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(path.join(__dirname, 'test.jpg')),
      },
    });

    // createFile {
    //   kind: 'drive#file',
    //   id: '1KxasBwbhLU2rG9KpPdARkmbhnftXu3Dh',
    //   name: 'test123.jpg',
    //   mimeType: 'image/jpeg'
    // }
    console.log('createFile', createFile.data);
    if (shared) {
      setFilePublic(createFile.data.id);
    }

    getFile(createFile.data.id);
  } catch (error) {
    console.log('Error uploading file: ', error);
  }
};

const deleteFile = async (fileId) => {
  try {
    const deleteFiled = await drive.files.delete({
      fileId: fileId,
    });
    console.log('deleteFiled', deleteFiled.data, deleteFiled.status);
  } catch (error) {
    console.log('deleteFile: ', error);
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
