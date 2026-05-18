const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

export const initGapi = () => {
  return new Promise<void>((resolve, reject) => {
    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
};

export const findAppFolder = async () => {
  const response = await gapi.client.drive.files.list({
    q: "name = 'warranty_tracker' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
    fields: 'files(id, name)',
  });
  return response.result.files?.[0] || null;
};

export const createAppFolder = async () => {
  const fileMetadata = {
    name: 'warranty_tracker',
    mimeType: 'application/vnd.google-apps.folder',
  };
  const response = await gapi.client.drive.files.create({
    resource: fileMetadata,
    fields: 'id',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any); 
  return response.result;
};

export const findDatabaseFile = async (folderId: string) => {
  const response = await gapi.client.drive.files.list({
    q: `'${folderId}' in parents and name = 'database.json' and trashed = false`,
    fields: 'files(id, name)',
  });
  return response.result.files?.[0] || null;
};

export const readJsonFile = async (fileId: string) => {
  const response = await gapi.client.drive.files.get({
    fileId: fileId,
    alt: 'media',
  });
  return response.result;
};

export const writeJsonFile = async (fileId: string, content: unknown) => {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  const contentType = 'application/json';
  const metadata = {
    name: 'database.json',
    mimeType: contentType,
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' + contentType + '\r\n\r\n' +
    JSON.stringify(content) +
    close_delim;

  const accessToken = gapi.auth.getToken().access_token;

  return fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });
};

export const createDatabaseFile = async (folderId: string, content: unknown) => {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  const contentType = 'application/json';
  const metadata = {
    name: 'database.json',
    mimeType: contentType,
    parents: [folderId],
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' + contentType + '\r\n\r\n' +
    JSON.stringify(content) +
    close_delim;

  const accessToken = gapi.auth.getToken().access_token;

  return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });
};

export const uploadFile = async (folderId: string, file: File): Promise<{ id: string }> => {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  const metadata = {
    name: file.name,
    mimeType: file.type,
    parents: [folderId],
  };

  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + file.type + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n\r\n' +
        base64Data +
        close_delim;

      const accessToken = gapi.auth.getToken().access_token;

      try {
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        });
        const result = await response.json();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsDataURL(file);
  });
};
