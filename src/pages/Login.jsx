import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
// Import necessary icons
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);
      // More descriptive error handling, trying to use the backend message
      alert(err.response?.data?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background Wrapper: subtle gray with background blurs (glassmorphism feel)
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative px-4 overflow-hidden">
      
      {/* 1. Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[45%] h-[45%] rounded-full bg-indigo-50 blur-[140px] opacity-70" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[45%] h-[45%] rounded-full bg-blue-50 blur-[140px] opacity-70" />
      </div>

      {/* 2. Main Login Card & Content Container */}
      <div className="relative w-full max-w-[440px]">
        
        {/* Logo/Brand Header Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-100 mb-5">
            <Lock size={30} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tighter">
            Admin Portal
          </h1>
          <p className="text-slate-600 mt-2.5 text-base">
            Securely sign in to your dashboard
          </p>
        </div>

        {/* 3. The Form Card (Glassmorphism Effect) */}
        <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_22px_70px_8px_rgba(0,0,0,0.06)] border border-white">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field Group */}
            <div className="space-y-2">
              <label htmlFor="email-address" className="text-sm font-semibold text-slate-800 ml-1">
                Email Address
              </label>
              <div className="relative group">
                {/* Mail Icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={19} />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@yourcompany.com"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all duration-150"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field Group */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="text-sm font-semibold text-slate-800">
                  Password
                </label>
                {/* Placeholder: Optional "Forgot Password?" */}
                <a href="#" className="text-xs font-medium text-indigo-700 hover:text-indigo-600 transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                {/* Lock Icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={19} />
                </div>
                <input
                  id="password"
                  name="password"
                  // Dynamically change type based on state
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all duration-150"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {/* 4. Show/Hide Password Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* 5. Submit Button with Integrated Loading Spinner */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                // Transition effects + subtle scaling on click
                className="w-full flex items-center justify-center py-4 px-5 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed overflow-hidden"
              >
                {loading ? (
                  // Lucide Loader Spinner
                  <Loader2 className="animate-spin mr-3" size={20} />
                ) : null}
                {loading ? "Verifying..." : "Sign in to Dashboard"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer info (Optional) */}
        <p className="text-center mt-9 text-sm text-slate-500">
          This is a protected admin system. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default Login;