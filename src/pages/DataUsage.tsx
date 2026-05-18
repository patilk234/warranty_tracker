

const DataUsage = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 prose dark:prose-invert">
      <h1 className="text-3xl font-bold mb-8">User Data Usage</h1>
      
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">How we use your data</h2>
        <p>
          Warracker's use of information received from Google APIs will adhere to the 
          <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" className="text-indigo-600 hover:underline"> Google API Service User Data Policy</a>, 
          including the Limited Use requirements.
        </p>

        <h3 className="text-xl font-semibold">1. OAuth Scopes Requested</h3>
        <p>We only request the <code>https://www.googleapis.com/auth/drive.file</code> scope. This is the most restrictive Drive scope, allowing us only to access files that were created by Warracker or opened with Warracker.</p>

        <h3 className="text-xl font-semibold">2. Purpose of Access</h3>
        <p>We access your Google Drive for the sole purpose of providing a cloud-synced storage backend for your warranty information. This includes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>database.json:</strong> To store the structured data (product name, purchase date, etc.).</li>
          <li><strong>Files/Photos:</strong> To store your uploaded receipts and product photos.</li>
        </ul>

        <h3 className="text-xl font-semibold">3. No Third-Party Sharing</h3>
        <p>Your data is <strong>never</strong> shared with third parties. Since there is no central server, your data never leaves the secure connection between your browser and Google's servers.</p>

        <h3 className="text-xl font-semibold">4. Data Deletion</h3>
        <p>If you wish to delete your data, simply delete the <code>warranty_tracker</code> folder from your Google Drive. All associated metadata and files will be permanently removed from your storage.</p>
      </section>
    </div>
  );
};

export default DataUsage;
