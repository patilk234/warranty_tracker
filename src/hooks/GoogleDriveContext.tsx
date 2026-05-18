import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [database, setDatabase] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [dbFileId, setDbFileId] = useState<string | null>(null);
  const [tokenClient, setTokenClient] = useState<google.accounts.oauth2.TokenClient | null>(null);

  const initializeAppData = async () => {
    console.log('Starting app data initialization...');
    setIsLoading(true);
    try {
      let folder = await findAppFolder();
      console.log('findAppFolder result:', folder);
      if (!folder) {
        console.log('Folder not found, creating one...');
        folder = await createAppFolder();
        console.log('createAppFolder result:', folder);
      }
      
      if (!folder || !folder.id) {
        throw new Error('Failed to obtain folder ID from Google Drive');
      }
      
      setFolderId(folder.id);
      console.log('Using folder ID:', folder.id);

      let dbFile = await findDatabaseFile(folder.id);
      console.log('findDatabaseFile result:', dbFile);
      if (!dbFile) {
        console.log('database.json not found, creating initial database...');
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
      console.log('Loaded database content:', dbData);
      setDatabase(dbData as Database);
    } catch (err) {
      console.error('Error in initializeAppData:', err);
      alert('Failed to initialize app storage. Please check the browser console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeGis = () => {
      if (!window.google?.accounts?.oauth2) {
        setTimeout(initializeGis, 100);
        return;
      }

      if (!CLIENT_ID || CLIENT_ID === 'your_google_client_id_here' || CLIENT_ID === 'undefined') {
        console.error('Google Client ID is missing.');
        setIsLoading(false);
        return;
      }

      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.file',
          callback: async (response: google.accounts.oauth2.TokenResponse) => {
            if (response.error !== undefined) {
              console.error('GIS Error Response:', response);
              return;
            }
            
            console.log('OAuth token received successfully.');
            // Sync token with GAPI
            gapi.client.setToken(response);
            
            setIsAuthenticated(true);
            await initializeAppData();
            
            // Redirect to dashboard after everything is initialized
            console.log('Initialization complete, redirecting to dashboard...');
            navigate('/dashboard');
          },
        });
        setTokenClient(client);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing GIS client:', err);
        setIsLoading(false);
      }
    };

    const start = async () => {
      try {
        await initGapi();
        initializeGis();
      } catch (err) {
        console.error('Error initializing GAPI:', err);
        setIsLoading(false);
      }
    };
    start();
  }, [navigate]);

  const login = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      alert('Login system is still loading. Please try again in a moment.');
    }
  };

  const logout = () => {
    const token = gapi.auth.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        setIsAuthenticated(false);
        setUserInfo(null);
        setDatabase(null);
        setFolderId(null);
        setDbFileId(null);
        navigate('/');
      });
    }
  };

  const addWarranty = async (warrantyData: Omit<Warranty, 'id' | 'createdAt'>) => {
    console.log('addWarranty logic starting...', warrantyData);
    if (!database || !dbFileId) {
      console.error('Missing database or dbFileId', { database: !!database, dbFileId: !!dbFileId });
      throw new Error('Database not initialized');
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

    await writeJsonFile(dbFileId, updatedDb);
    setDatabase(updatedDb);
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
