const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API_BASE = 'https://www.googleapis.com/upload/drive/v3';

let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

const getAccessToken = () => {
  if (!accessToken) throw new Error('No access token available');
  return accessToken;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error('Drive API Error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorBody
    });
    throw new Error(`Drive API Error: ${response.status} ${JSON.stringify(errorBody)}`);
  }
  return response.json();
};

export const initGapi = () => {
  return new Promise<void>((resolve) => {
    const checkGapi = () => {
      if (typeof gapi !== 'undefined') {
        gapi.load('client', () => {
          // We only need the base client, no need for full init with discovery
          // as we will use fetch for data calls for better reliability
          resolve();
        });
      } else {
        setTimeout(checkGapi, 100);
      }
    };
    checkGapi();
  });
};

export const findAppFolder = async () => {
  const q = encodeURIComponent("name = 'warranty_tracker' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
  const response = await fetch(`${DRIVE_API_BASE}/files?q=${q}&fields=files(id, name)`, {
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`
    }
  });
  const data = await handleResponse(response);
  return data.files?.[0] || null;
};

export const createAppFolder = async () => {
  const response = await fetch(`${DRIVE_API_BASE}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'warranty_tracker',
      mimeType: 'application/vnd.google-apps.folder'
    })
  });
  return handleResponse(response);
};

export const findDatabaseFile = async (folderId: string) => {
  const q = encodeURIComponent(`'${folderId}' in parents and name = 'database.json' and trashed = false`);
  const response = await fetch(`${DRIVE_API_BASE}/files?q=${q}&fields=files(id, name)`, {
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`
    }
  });
  const data = await handleResponse(response);
  return data.files?.[0] || null;
};

export const readJsonFile = async (fileId: string) => {
  const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}?alt=media`, {
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`
    }
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Failed to read JSON: ${response.status} ${JSON.stringify(errorBody)}`);
  }
  return response.json();
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

  const response = await fetch(`${UPLOAD_API_BASE}/files/${fileId}?uploadType=multipart`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });
  return handleResponse(response);
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

  const response = await fetch(`${UPLOAD_API_BASE}/files?uploadType=multipart`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });
  return handleResponse(response);
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

      try {
        const response = await fetch(`${UPLOAD_API_BASE}/files?uploadType=multipart`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAccessToken()}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        });
        const result = await handleResponse(response);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsDataURL(file);
  });
};

export const deleteFile = async (fileId: string): Promise<void> => {
  const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`
    }
  });
  if (!response.ok && response.status !== 404) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Failed to delete file: ${response.status} ${JSON.stringify(errorBody)}`);
  }
};

export const getFileMetadata = async (fileId: string): Promise<{ id: string, name: string, webViewLink: string, webContentLink?: string }> => {
  const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}?fields=id,name,webViewLink,webContentLink`, {
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`
    }
  });
  return handleResponse(response);
};
