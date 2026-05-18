import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { initGapi, findAppFolder, createAppFolder, findDatabaseFile, readJsonFile, createDatabaseFile, writeJsonFile } from '../lib/googleDrive';
import type { Database, UserInfo, Warranty } from '../types';

interface GoogleDriveContextType {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  database: Database | null;
  isLoading: boolean;
  folderId: string | null;
  login: () => void;
  logout: () => void;
  addWarranty: (warranty: Omit<Warranty, 'id' | 'createdAt'>) => Promise<void>;
  updateWarranty: (warranty: Warranty) => Promise<void>;
  deleteWarranty: (id: string) => Promise<void>;
}

const GoogleDriveContext = createContext<GoogleDriveContextType | undefined>(undefined);

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const GoogleDriveProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [database, setDatabase] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [dbFileId, setDbFileId] = useState<string | null>(null);
  const [tokenClient, setTokenClient] = useState<google.accounts.oauth2.TokenClient | null>(null);

  const initializeAppData = async () => {
    setIsLoading(true);
    try {
      let folder = await findAppFolder();
      if (!folder) {
        folder = await createAppFolder();
      }
      setFolderId(folder.id);

      let dbFile = await findDatabaseFile(folder.id);
      if (!dbFile) {
        const initialDb: Database = {
          warranties: [],
          version: '1.0',
          lastUpdated: new Date().toISOString(),
        };
        const response = await createDatabaseFile(folder.id, initialDb);
        const result = await response.json();
        dbFile = { id: result.id, name: 'database.json' };
      }
      setDbFileId(dbFile.id);

      const dbData = await readJsonFile(dbFile.id);
      setDatabase(dbData as Database);
    } catch (err) {
      console.error('Error initializing app data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeGis = () => {
      if (!window.google?.accounts?.oauth2) {
        console.log('GIS not ready, retrying in 100ms...');
        setTimeout(initializeGis, 100);
        return;
      }

      if (!CLIENT_ID || CLIENT_ID === 'your_google_client_id_here' || CLIENT_ID === 'undefined') {
        console.error('CRITICAL: Google Client ID is missing or undefined.');
        setIsLoading(false);
        return;
      }

      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.file',
          callback: async (response: google.accounts.oauth2.TokenResponse) => {
            if (response.error !== undefined) {
              console.error('GIS Error:', response);
              return;
            }
            setIsAuthenticated(true);
            await initializeAppData();
          },
        });
        setTokenClient(client);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing GIS', err);
        setIsLoading(false);
      }
    };

    const start = async () => {
      try {
        await initGapi();
        initializeGis();
      } catch (err) {
        console.error('Error initializing GAPI', err);
        setIsLoading(false);
      }
    };
    start();
  }, []);

  const login = () => {
    if (tokenClient) {
      try {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        console.error('Login request failed', err);
        alert('Login failed to start. Please check if popups are blocked.');
      }
    } else {
      console.error('Login clicked but tokenClient not initialized.');
      if (!CLIENT_ID) {
        alert('Google Client ID is missing. Please set VITE_GOOGLE_CLIENT_ID in your GitHub Secrets.');
      } else {
        alert('Google login is still initializing. Please wait a few seconds and try again.');
      }
    }
  };

  const logout = () => {
    const token = gapi.auth.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        setIsAuthenticated(false);
        setUserInfo(null);
        setDatabase(null);
      });
    }
  };

  const addWarranty = async (warrantyData: Omit<Warranty, 'id' | 'createdAt'>) => {
    console.log('addWarranty called with:', warrantyData);
    if (!database || !dbFileId) {
      console.error('addWarranty failed: database or dbFileId is missing', { database: !!database, dbFileId: !!dbFileId });
      return;
    }

    const newWarranty: Warranty = {
      ...warrantyData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const updatedDb = {
      ...database,
      warranties: [...database.warranties, newWarranty],
      lastUpdated: new Date().toISOString(),
    };

    try {
      console.log('Attempting to write updated database to Google Drive...');
      await writeJsonFile(dbFileId, updatedDb);
      setDatabase(updatedDb);
      console.log('Successfully saved warranty and updated local state.');
    } catch (err) {
      console.error('Failed to write database file to Drive:', err);
      throw err;
    }
  };

  const updateWarranty = async (updatedWarranty: Warranty) => {
    if (!database || !dbFileId) return;

    const updatedDb = {
      ...database,
      warranties: database.warranties.map(w => w.id === updatedWarranty.id ? updatedWarranty : w),
      lastUpdated: new Date().toISOString(),
    };

    await writeJsonFile(dbFileId, updatedDb);
    setDatabase(updatedDb);
  };

  const deleteWarranty = async (id: string) => {
    if (!database || !dbFileId) return;

    const updatedDb = {
      ...database,
      warranties: database.warranties.filter(w => w.id !== id),
      lastUpdated: new Date().toISOString(),
    };

    await writeJsonFile(dbFileId, updatedDb);
    setDatabase(updatedDb);
  };

  return (
    <GoogleDriveContext.Provider value={{
      isAuthenticated,
      userInfo,
      database,
      isLoading,
      folderId,
      login,
      logout,
      addWarranty,
      updateWarranty,
      deleteWarranty
    }}>
      {children}
    </GoogleDriveContext.Provider>
  );
};

export { GoogleDriveContext };
export type { GoogleDriveContextType };
