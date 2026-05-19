
const DataUsage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="neo-outset p-10 md:p-16 space-y-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white leading-none">User Data Usage</h1>
        
        <section className="space-y-8 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">How we use your data</h2>
            <p>
              warranty-tracker's use of information received from Google APIs will adhere to the 
              <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" className="text-indigo-600 hover:underline"> Google API Service User Data Policy</a>.
            </p>
          </div>

          <div className="neo-inset p-8 space-y-6 bg-inherit rounded-3xl">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight uppercase tracking-widest text-xs">1. OAuth Scopes</h3>
              <p>We only request <code>drive.file</code>. We cannot see any other files in your Drive.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight uppercase tracking-widest text-xs">2. Purpose</h3>
              <p>To store your warranty database and receipt photos in a place YOU control.</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight uppercase tracking-widest text-xs">3. No Sharing</h3>
              <p>Your data never leaves the connection between your browser and Google.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DataUsage;
