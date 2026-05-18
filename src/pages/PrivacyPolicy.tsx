

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 prose dark:prose-invert">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">Last updated: May 18, 2026</p>
      
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">1. Introduction</h2>
        <p>
          warranty-tracker is a static web application designed to help users track their product warranties. 
          We value your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how our application interacts with your data.
        </p>

        <h2 className="text-2xl font-semibold">2. Data Ownership and Storage</h2>
        <p>
          warranty-tracker is a <strong>serverless</strong> application. We do not maintain any databases or servers 
          that store your personal information, warranty details, or uploaded files. 
          All data is stored directly in your personal <strong>Google Drive</strong> account.
        </p>

        <h2 className="text-2xl font-semibold">3. Google Drive Integration</h2>
        <p>
          Our application requests access to your Google Drive via the <code>drive.file</code> scope. 
          This scope allows warranty-tracker to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Create a folder named "warranty_tracker" in your Google Drive.</li>
          <li>Store a configuration file (database.json) within that folder.</li>
          <li>Upload and manage receipt photos and documents you explicitly add to the app.</li>
        </ul>
        <p>
          warranty-tracker <strong>cannot</strong> see or access any other files in your Google Drive 
          that were not created by this application.
        </p>

        <h2 className="text-2xl font-semibold">4. Data Usage</h2>
        <p>
          Your data is used solely to provide the functionality of the warranty tracker within your browser. 
          No data is transmitted to our servers or any third-party services, except for the direct 
          communication between your browser and Google's APIs.
        </p>

        <h2 className="text-2xl font-semibold">5. Your Rights</h2>
        <p>
          Since you own the data in your Google Drive, you have full control over it. 
          You can delete the "warranty_tracker" folder at any time to remove all data associated with the app. 
          You can also revoke the application's access in your Google Account security settings.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
