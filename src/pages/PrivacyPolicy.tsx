
const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="neo-outset p-10 md:p-16 space-y-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white">Privacy Policy</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Last updated: May 18, 2026</p>
        </div>
        
        <section className="space-y-8 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">1. Introduction</h2>
            <p>
              warranty-tracker is a static web application designed to help users track their product warranties. 
              We value your privacy and are committed to protecting your personal data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">2. Data Ownership and Storage</h2>
            <p>
              warranty-tracker is a <strong>serverless</strong> application. We do not maintain any databases or servers 
              that store your personal information. All data is stored directly in your personal <strong>Google Drive</strong> account.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">3. Google Drive Integration</h2>
            <div className="neo-inset p-6 space-y-3 bg-inherit rounded-2xl">
              <p>Our application requests access to your Google Drive via the <code>drive.file</code> scope. This allows us to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create a folder named "warranty_tracker"</li>
                <li>Store a configuration file (database.json)</li>
                <li>Upload receipt photos you explicitly add</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
