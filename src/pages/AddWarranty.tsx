
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
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
    <div className="max-w-3xl mx-auto space-y-12 pb-24 pt-8 px-4">
      <Link to="/dashboard" className="inline-flex items-center gap-2 font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest text-sm">
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </Link>

      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white leading-none">Add New Warranty</h1>
        <p className="text-slate-600 dark:text-slate-400 font-bold">Securely store your product details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="neo-outset p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Product Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. MacBook Pro"
                className="w-full neo-input rounded-2xl p-4 font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 bg-inherit"
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
            <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Receipts & Photos</label>
            <div 
              className="neo-inset rounded-3xl p-12 text-center relative group hover:neo-outset transition-all duration-300 border-2 border-dashed border-slate-300 dark:border-slate-700"
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
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                onChange={handleFileChange}
              />
              <div className="space-y-4">
                <div className="p-5 neo-outset rounded-2xl w-fit mx-auto group-hover:neo-inset transition-all">
                  <Upload className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black tracking-tight">
                    <span className="text-indigo-600">Drop files here</span> or click to upload
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">PNG, JPG or PDF up to 10MB</p>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {files.map((file, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={i} 
                    className="flex items-center justify-between p-4 neo-inset rounded-xl bg-inherit"
                  >
                    <span className="text-xs font-black truncate max-w-[200px] uppercase tracking-wider">{file.name}</span>
                    <button type="button" onClick={() => removeFile(i)} className="p-1.5 neo-button rounded-lg !p-1 bg-inherit text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
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
              <span className="uppercase tracking-widest">{uploadingFiles ? 'Uploading...' : 'Saving...'}</span>
            </>
          ) : (
            <span className="uppercase tracking-widest">Save Warranty</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddWarranty;
