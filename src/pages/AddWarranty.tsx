import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleDrive } from '../hooks/useGoogleDrive';
import { uploadFile } from '../lib/googleDrive';

const AddWarranty = () => {
  const navigate = useNavigate();
  const { addWarranty, folderId } = useGoogleDrive();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    purchaseDate: new Date().toISOString().split('T')[0],
    durationMonths: 12,
    description: '',
    tags: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted. FolderId:', folderId);

    if (!folderId) {
      alert('Application folder not found. Please try refreshing or re-logging.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload files first
      const fileIds: string[] = [];
      if (files.length > 0) {
        console.log(`Starting upload of ${files.length} files...`);
        setUploadingFiles(true);
        for (const file of files) {
          try {
            const result = await uploadFile(folderId, file);
            fileIds.push(result.id);
            console.log('Uploaded file successfully, ID:', result.id);
          } catch (uploadErr) {
            console.error('File upload failed for:', file.name, uploadErr);
            alert(`Failed to upload ${file.name}. The warranty will be saved without this file.`);
          }
        }
        setUploadingFiles(false);
      }

      // 2. Add warranty entry
      console.log('Adding warranty entry to database...');
      await addWarranty({
        title: formData.title,
        category: formData.category,
        purchaseDate: formData.purchaseDate,
        durationMonths: Number(formData.durationMonths),
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        fileIds,
      });

      console.log('Warranty added successfully, navigating to dashboard.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error during warranty submission:', err);
      alert('Failed to save warranty. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Add New Warranty</h1>
        <p className="text-slate-600 dark:text-slate-400">Fill in the details and upload your receipt.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Product Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. MacBook Pro"
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Category</label>
            <select 
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Purchase Date</label>
            <input 
              required
              type="date" 
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.purchaseDate}
              onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Duration (Months)</label>
            <input 
              required
              type="number" 
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.durationMonths}
              onChange={e => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Receipts & Photos</label>
          <div 
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-500 transition-colors relative"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              if (e.dataTransfer.files) {
                setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
              }
            }}
          >
            <input 
              type="file" 
              multiple 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileChange}
            />
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-500">
                <span className="text-indigo-600 font-bold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400">PNG, JPG or PDF up to 10MB</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                  <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {uploadingFiles ? 'Uploading Files...' : 'Saving Warranty...'}
            </>
          ) : (
            'Save Warranty'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddWarranty;
