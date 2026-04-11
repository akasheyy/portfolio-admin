import { useEffect, useState } from "react";
import API from "../services/api";
import { Plus, Trash2, Globe, Star, X, Loader2, Upload, Edit3 } from "lucide-react";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null); // Track if we are editing
  
  const [form, setForm] = useState({ title: "", description: "", techStack: "", category: "react", url: "", featured: false });
  const [image, setImage] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) { console.error("Fetch failed"); }
  };

  useEffect(() => { fetchProjects(); }, []);

  // Pre-fill form for editing
  const handleEditClick = (project) => {
    setEditId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack ? project.techStack.join(", ") : "",
      category: project.category,
      url: project.liveLink,
      featured: project.featured,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      
      const techArray = form.techStack
        ? form.techStack.split(",").map((t) => t.trim())
        : [];
      formData.append("techStack", JSON.stringify(techArray));
      formData.append("category", form.category);
      formData.append("liveLink", form.url);
      formData.append("featured", form.featured ? "true" : "false");

      // Image is optional during edit
      if (image) {
        formData.append("image", image);
      } else if (!editId) {
        alert("Please select a cover image");
        setLoading(false);
        return;
      }

      if (editId) {
        // UPDATE EXISTING
        await API.put(`/projects/${editId}`, formData);
      } else {
        // CREATE NEW
        await API.post("/projects", formData);
      }

      // Reset
      setForm({ title: "", description: "", techStack: "", category: "react", url: "", featured: false });
      setImage(null);
      setEditId(null);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Project Manager</h1>
            <p className="text-slate-500 text-sm">Portfolio Content Administration</p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) setEditId(null); // Reset edit state if closing
            }}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all w-full sm:w-auto ${
              showForm ? "bg-white text-slate-600 border border-slate-200" : "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
            }`}
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Cancel" : "Add Project"}
          </button>
        </header>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8 mb-10">
            <h2 className="text-lg font-bold mb-4 text-slate-800">{editId ? "Edit Project" : "Add New Project"}</h2>
            <form onSubmit={handleAddOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border-transparent border rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tech Stack</label>
                <input required placeholder="React, Tailwind..." value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border-transparent border rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all" />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea required rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border-transparent border rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live URL</label>
                <input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border-transparent border rounded-xl focus:bg-white focus:border-indigo-600 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cover Image {editId && "(Optional)"}</label>
                <div className="relative">
                  <input type="file" onChange={(e) => setImage(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-full px-4 py-2.5 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center gap-2 text-slate-500 overflow-hidden">
                    <Upload size={16} />
                    <span className="truncate text-sm">{image ? image.name : editId ? "Keep current image" : "Choose file..."}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer">
                    <option value="react">React</option>
                    <option value="fullstack">Full Stack</option>
                    <option value="frontend">Frontend</option>
                  </select>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm font-medium text-slate-600">Featured</span>
                  </label>
                </div>
                <button disabled={loading} className="w-full sm:w-auto bg-slate-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  {loading && <Loader2 className="animate-spin" size={18} />}
                  {loading ? "Processing..." : editId ? "Update Project" : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl border border-slate-100 flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition-shadow">
              <div className="w-full sm:w-40 md:w-48 h-48 sm:h-auto relative flex-shrink-0">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                {p.featured && <div className="absolute top-2 left-2 bg-amber-400 p-1 rounded shadow-sm"><Star size={12} className="text-white fill-white" /></div>}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{p.category}</span>
                  <div className="flex gap-2">
                    {/* EDIT BUTTON */}
                    <button onClick={() => handleEditClick(p)} className="text-slate-300 hover:text-indigo-600 transition-colors">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-3">{p.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.techStack?.map((t, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{t}</span>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-slate-50 flex justify-end">
                  <a href={p.liveLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700">
                    Live Demo <Globe size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;