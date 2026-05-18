import { useContext } from 'react';
import { GoogleDriveContext, GoogleDriveContextType } from '../hooks/GoogleDriveContext';

export const useGoogleDrive = (): GoogleDriveContextType => {
  const context = useContext(GoogleDriveContext);
  if (context === undefined) {
    throw new Error('useGoogleDrive must be used within a GoogleDriveProvider');
  }
  return context;
};
