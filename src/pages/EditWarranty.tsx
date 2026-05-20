
import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Loader2, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { uploadFile } from '../lib/googleDrive';
import type { Warranty } from '../types';

const EditWarranty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { database, updateWarranty, folderId, isLoading: dbLoading } = useGoogleDrive();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    purchaseDate: '',
    durationMonths: 12,
    description: '',
    tags: '',
  });

  const [existingFileIds, setExistingFileIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    if (database && id) {
      const warranty = database.warranties.find(w => w.id === id);
      if (warranty) {
        setFormData({
          title: warranty.title,
          category: warranty.category,
          purchaseDate: warranty.purchaseDate,
          durationMonths: warranty.durationMonths,
          description: warranty.description || '',
          tags: warranty.tags.join(', '),
        });
        setExistingFileIds(warranty.fileIds || []);
      } else {
        navigate('/dashboard');
      }
    }
  }, [database, id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !folderId) return;

    setIsLoading(true);

    try {
      // 1. Upload new files if any
      const newFileIds: string[] = [];
      if (newFiles.length > 0) {
        setUploadingFiles(true);
        for (const file of newFiles) {
          try {
            const result = await uploadFile(folderId, file);
            newFileIds.push(result.id);
          } catch (uploadErr) {
            console.error('File upload failed:', uploadErr);
          }
        }
        setUploadingFiles(false);
      }

      // 2. Update warranty entry
      const updatedWarranty: Warranty = {
        id,
        title: formData.title,
        category: formData.category,
        purchaseDate: formData.purchaseDate,
        durationMonths: Number(formData.durationMonths),
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        fileIds: [...existingFileIds, ...newFileIds],
        createdAt: database?.warranties.find(w => w.id === id)?.createdAt || new Date().toISOString(),
      };

      await updateWarranty(updatedWarranty);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating warranty:', err);
      alert('Failed to update warranty.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (fileId: string) => {
    setExistingFileIds(prev => prev.filter(id => id !== fileId));
  };

  if (dbLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-24 pt-8 px-4">
      <Link to="/dashboard" className="inline-flex items-center gap-2 font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest text-sm">
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </Link>

      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white leading-none">Edit Warranty</h1>
        <p className="text-slate-600 dark:text-slate-400 font-bold">Update your product details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="neo-outset p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Product Name</label>
              <input 
                required
                type="text" 
                className="w-full neo-input rounded-2xl p-4 font-bold text-slate-700 dark:text-slate-200 bg-inherit"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Category</label>
              <select 
                className="w-full neo-input rounded-2xl p-4 font-bold text-slate-700 dark:text-slate-200 bg-inherit appearance-none cursor-pointer"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Electronics</option>
                <option>Appliances</option>
                <option>Vehicles</option>
                <option>Furniture</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Purchase Date</label>
              <input 
                required
                type="date" 
                className="w-full neo-input rounded-2xl p-4 font-bold text-slate-700 dark:text-slate-200 bg-inherit"
                value={formData.purchaseDate}
                onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Duration (Months)</label>
              <input 
                required
                type="number" 
                className="w-full neo-input rounded-2xl p-4 font-bold text-slate-700 dark:text-slate-200 bg-inherit"
                value={formData.durationMonths}
                onChange={e => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Current Files</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {existingFileIds.map((fileId) => (
                <div key={fileId} className="flex items-center justify-between p-4 neo-inset rounded-xl bg-inherit">
                  <span className="text-xs font-black truncate max-w-[200px] uppercase tracking-wider">File: {fileId.substring(0, 8)}...</span>
                  <button type="button" onClick={() => removeExistingFile(fileId)} className="p-1.5 neo-button rounded-lg !p-1 bg-inherit text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {existingFileIds.length === 0 && (
                <p className="text-sm font-bold text-slate-400 italic">No files attached.</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Add New Files</label>
            <div 
              className="neo-inset rounded-3xl p-8 text-center relative group hover:neo-outset transition-all duration-300 border-2 border-dashed border-slate-300 dark:border-slate-700"
            >
              <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
                <p className="text-sm font-black uppercase tracking-tight">Drop or click to add more</p>
              </div>
            </div>
            {newFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-4 neo-inset rounded-xl bg-inherit mt-2">
                <span className="text-xs font-black truncate max-w-[200px] uppercase tracking-wider">{file.name}</span>
                <button type="button" onClick={() => removeNewFile(i)} className="p-1.5 neo-button rounded-lg !p-1 bg-inherit text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-2xl transition-all shadow-[8px_8px_20px_rgba(79,70,229,0.3)] hover:shadow-[10px_10px_30px_rgba(79,70,229,0.4)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="uppercase tracking-widest">{uploadingFiles ? 'Uploading...' : 'Updating...'}</span>
            </>
          ) : (
            <>
              <Save className="w-6 h-6" />
              <span className="uppercase tracking-widest">Update Warranty</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditWarranty;
