export default function RegisterSchoolPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">School Registration</h2>
          <form className="space-y-4">
            <input type="text" placeholder="School Name" className="w-full border rounded-xl p-3" />
            <input type="email" placeholder="Admin Email" className="w-full border rounded-xl p-3" />
            <input type="number" placeholder="Number of Teachers" className="w-full border rounded-xl p-3" />
            <input type="number" placeholder="Children per Teacher" className="w-full border rounded-xl p-3" />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
              Request Quote
            </button>
          </form>
        </div>
      </div>
    );
  }
  