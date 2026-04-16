import { useEffect, useState } from "react";
import API from "../services/api";
import { Mail, MessageCircle, Clock, Trash2, ArrowLeft, Loader2, RefreshCw } from "lucide-react";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/contacts");
      setContacts(res.data);
    } catch (err) {
      console.error("Fetch contacts failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this contact message?")) {
      setLoading(true);
      try {
        await API.delete(`/contacts/${id}`);
        fetchContacts(); // Refresh list
      } catch (err) {
        alert("Delete failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="p-1.5 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-all"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Contact Messages</h1>
                <p className="text-slate-500 text-sm">{contacts.length} messages</p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchContacts}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-md disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <RefreshCw size={18} />}
            Refresh
          </button>
        </header>

        {loading && contacts.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="mx-auto w-8 h-8 animate-spin text-slate-400" />
            <p className="mt-2 text-slate-500">Loading messages...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="mx-auto w-16 h-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-600">No contact messages yet</h3>
            <p className="mt-1 text-slate-500">Messages from your contact form will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <div key={contact._id} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{contact.name}</h3>
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline text-sm font-medium">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    disabled={loading}
                    className="text-slate-400 hover:text-red-500 p-1.5 -m-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">{contact.message}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={14} />
                  <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                  <span className="ml-4">{new Date(contact.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
