import { useState, useEffect, useMemo, useContext, createContext } from "react";
import { getAllStudents, getAllAssignments, createAssignment, deleteAssignment } from "../api";

// Theme System
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const THEMES = {
  dark: {
    appBg:         "bg-black",
    sidebarBg:     "bg-black",
    sidebarBorder: "border-white/10",
    textPrimary:   "text-white",
    textSecondary: "text-blue-300",
    textMuted:     "text-blue-200",
    textLabel:     "text-blue-200",
    card:          "bg-black/60 border-white/10",
    cardHover:     "hover:border-white/20",
    statCard:      "bg-black/80",
    statBorder:    "border-white/10",
    navItem:       "text-blue-200 hover:text-white hover:bg-blue-900/30",
    navActive:     "bg-blue-900/40 text-blue-300",
    navActiveDot:  "bg-blue-400",
    input:         "bg-black border-white/10 text-white placeholder-white/50",
    inputFocus:    "focus:border-blue-500",
    select:        "bg-black border-white/10 text-white",
    btnGhost:      "bg-black hover:bg-white/5 text-blue-200",
    tableHead:     "text-blue-200",
    tableRow:      "border-white/10 hover:bg-white/5",
    tableBorder:   "border-white/10",
    modalBg:       "bg-black",
    modalBorder:   "border-white/10",
    modalHeader:   "border-white/10",
    topbar:        "bg-black/95 border-white/10",
    divider:       "border-white/10",
    userFooter:    "border-white/10",
    userRole:      "text-blue-200",
    logoutBtn:     "text-blue-200 hover:text-red-400 hover:bg-red-900/20",
    themeBtn:      "text-blue-200 hover:text-blue-400 hover:bg-blue-900/20",
    activityHover: "hover:bg-white/5",
    activityBorder:"border-white/10",
    sectionHeader: "text-blue-200",
    alertUnread:   "bg-blue-900/20 border-blue-800/50",
    alertRead:     "bg-black/30 border-white/10",
    alertMsg:      "bg-black/80 border-white/10 text-blue-200",
    progressTrack: "bg-white/10",
    defaulterCard: "bg-black/60 border-red-900/40 hover:border-red-800/60",
  },
  light: {
    appBg:         "bg-white",
    sidebarBg:     "bg-white",
    sidebarBorder: "border-black",
    textPrimary:   "text-black",
    textSecondary: "text-blue-600",
    textMuted:     "text-blue-400",
    textLabel:     "text-blue-600",
    card:          "bg-white border-black",
    cardHover:     "hover:border-blue-200",
    statCard:      "bg-white",
    statBorder:    "border-black",
    navItem:       "text-blue-600 hover:text-white hover:bg-blue-600/10",
    navActive:     "bg-blue-50 text-blue-700",
    navActiveDot:  "bg-blue-500",
    input:         "bg-white border-black text-black placeholder-black/50",
    inputFocus:    "focus:border-blue-500",
    select:        "bg-white border-black text-black",
    btnGhost:      "bg-white hover:bg-blue-50 text-blue-600",
    tableHead:     "text-blue-600",
    tableRow:      "border-black/10 hover:bg-blue-50",
    tableBorder:   "border-black",
    modalBg:       "bg-white",
    modalBorder:   "border-black",
    modalHeader:   "border-black",
    topbar:        "bg-white/95 border-black",
    divider:       "border-black",
    userFooter:    "border-black",
    userRole:      "text-blue-400",
    logoutBtn:     "text-blue-400 hover:text-red-500 hover:bg-red-50",
    themeBtn:      "text-blue-400 hover:text-blue-600 hover:bg-blue-50",
    activityHover: "hover:bg-blue-50",
    activityBorder:"border-black/10",
    sectionHeader: "text-blue-600",
    alertUnread:   "bg-blue-50 border-blue-200",
    alertRead:     "bg-white border-black",
    alertMsg:      "bg-white border-black text-blue-600",
    progressTrack: "bg-blue-200",
    defaulterCard: "bg-white border-red-200 hover:border-red-300",
  },
};

// Seed Data
const SEED_STUDENTS = [
  { id: "s1", name: "Manthan Khotele", roll: "I 26", email: "manthankhotele7@gmail.com", div: "I2" },
  { id: "s2", name: "Ayush Chirde",    roll: "I 10", email: "ayush123@gmail.com",         div: "I1" },
  { id: "s3", name: "Ritesh Gujar",    roll: "I 41", email: "ritesh@ghriet.ac.in",         div: "I2" },
  { id: "s4", name: "Aryan Pathak",    roll: "I 8",  email: "aryan@ghriet.ac.in",          div: "I1" },
  { id: "s5", name: "Prachi Nawkhare", roll: "I 35", email: "Prachi@ghriet.ac.in",         div: "I2" },
  { id: "s6", name: "Noesha Sakhre",   roll: "I 32", email: "noesha@ghriet.ac.in",         div: "I2" },
  { id: "s7", name: "Anaisha Badhai",  roll: "I 78", email: "anaisha@ghriet.ac.in",        div: "I2" },
  { id: "s8", name: "Krish Kubde",     roll: "I 21", email: "krish@ghriet.ac.in",          div: "I1" },
];

const today     = new Date();
const fmt       = (d) => d.toISOString().split("T")[0];
const daysAgo   = (n) => fmt(new Date(today - n * 86400000));
const daysAhead = (n) => fmt(new Date(today.getTime() + n * 86400000));

const SEED_ASSIGNMENTS = [
  { id: "a1", title: "TAE 02",              subject: "PPS",          deadline: daysAgo(3),   maxMarks: 20, desc: "Solve by yourself don't use Chatgpt." },
  { id: "a2", title: "Practical Record 4th", subject: "CP",          deadline: daysAgo(1),   maxMarks: 15, desc: "Complete Record and Prepare for Viva." },
  { id: "a3", title: "IMPE",                subject: "All Subjects", deadline: daysAhead(2), maxMarks: 10, desc: "Give Internal Mid-sem practical exam." },
  { id: "a4", title: "Python Mini Project",  subject: "Python",      deadline: daysAhead(5), maxMarks: 30, desc: "Build a CLI-based student grade calculator." },
];

const SEED_SUBMISSIONS = [
  { id: "sub1", studentId: "s1", assignmentId: "a1", submittedOn: daysAgo(4), marks: 18, late: false },
  { id: "sub2", studentId: "s2", assignmentId: "a1", submittedOn: daysAgo(2), marks: 14, late: true  },
  { id: "sub3", studentId: "s3", assignmentId: "a1", submittedOn: daysAgo(4), marks: 17, late: false },
  { id: "sub4", studentId: "s5", assignmentId: "a1", submittedOn: daysAgo(3), marks: 19, late: false },
  { id: "sub5", studentId: "s1", assignmentId: "a2", submittedOn: daysAgo(1), marks: 13, late: false },
  { id: "sub6", studentId: "s3", assignmentId: "a2", submittedOn: daysAgo(0), marks: 12, late: true  },
  { id: "sub7", studentId: "s6", assignmentId: "a2", submittedOn: daysAgo(1), marks: 15, late: false },
];

// Icons
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const paths = {
    dashboard:  <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    students:   <><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a7 7 0 0 1 14 0v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/></>,
    assignment: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    submit:     <><polyline points="20 6 9 17 4 12"/></>,
    alert:      <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    report:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    defaulter:  <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>,
    logout:     <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash:      <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></>,
    bell:       <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    check:      <><polyline points="20 6 9 17 4 12"/></>,
    mail:       <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    user:       <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    calendar:   <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    eye:        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    menu:       <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    sun:        <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon:       <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// Helpers
const isPastDeadline = (deadline) => new Date(deadline) < new Date();
const formatDate     = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const uid            = () => Math.random().toString(36).slice(2, 9);

// Shared Componenets
const Badge = ({ text, color }) => {
  const t = useTheme();
  const isDark = t === THEMES.dark;
  const colors = isDark ? {
    green: "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50",
    red:   "bg-red-900/60 text-red-300 border border-red-700/50",
    amber: "bg-amber-900/60 text-amber-300 border border-amber-700/50",
    blue:  "bg-blue-900/60 text-blue-300 border border-blue-700/50",
    teal:  "bg-teal-900/60 text-teal-300 border border-teal-700/50",
    gray:  "bg-gray-800/60 text-gray-400 border border-gray-700/50",
  } : {
    green: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    red:   "bg-red-100 text-red-600 border border-red-200",
    amber: "bg-amber-100 text-amber-700 border border-amber-200",
    blue:  "bg-blue-100 text-blue-700 border border-blue-200",
    teal:  "bg-teal-100 text-teal-700 border border-teal-200",
    gray:  "bg-slate-100 text-slate-500 border border-slate-200",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.gray}`}>{text}</span>;
};

const StatCard = ({ icon, label, value, sub, accent = "#2563eb" }) => {
  const t = useTheme();
  return (
    <div style={{ borderTop: `3px solid ${accent}` }}
      className={`${t.statCard} backdrop-blur rounded-xl p-5 flex items-start gap-4 border ${t.statBorder} ${t.cardHover} transition-all`}>
      <div style={{ background: `${accent}22` }} className="p-3 rounded-lg">
        <Icon name={icon} size={22} color={accent} />
      </div>
      <div>
        <div className={`text-2xl font-bold ${t.textPrimary} font-mono`}>{value}</div>
        <div className={`text-sm ${t.textSecondary} mt-0.5`}>{label}</div>
        {sub && <div className={`text-xs ${t.textMuted} mt-1`}>{sub}</div>}
      </div>
    </div>
  );
};

const Modal = ({ title, onClose, children }) => {
  const t = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className={`${t.modalBg} border ${t.modalBorder} rounded-2xl w-full max-w-lg shadow-2xl`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${t.modalHeader}`}>
          <h3 className={`${t.textPrimary} font-semibold text-lg`}>{title}</h3>
          <button onClick={onClose} className={`${t.textSecondary} hover:${t.textPrimary} transition-colors text-xl leading-none`}>+�</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => {
  const t = useTheme();
  return (
    <div className="mb-4">
      {label && <label className={`block text-sm ${t.textLabel} mb-1.5 font-medium`}>{label}</label>}
      <input {...props} className={`w-full ${t.input} border rounded-lg px-3 py-2.5 text-sm focus:outline-none ${t.inputFocus} transition-colors`} />
    </div>
  );
};

const SelectField = ({ label, options, ...props }) => {
  const t = useTheme();
  return (
    <div className="mb-4">
      {label && <label className={`block text-sm ${t.textLabel} mb-1.5 font-medium`}>{label}</label>}
      <select {...props} className={`w-full ${t.select} border rounded-lg px-3 py-2.5 text-sm focus:outline-none ${t.inputFocus} transition-colors`}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
};

const Textarea = ({ label, ...props }) => {
  const t = useTheme();
  return (
    <div className="mb-4">
      {label && <label className={`block text-sm ${t.textLabel} mb-1.5 font-medium`}>{label}</label>}
      <textarea {...props} rows={3} className={`w-full ${t.input} border rounded-lg px-3 py-2.5 text-sm focus:outline-none ${t.inputFocus} transition-colors resize-none`} />
    </div>
  );
};

const Btn = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const t = useTheme();
  const v = {
    primary: "bg-teal-600 hover:bg-teal-500 text-white",
    danger:  "bg-red-600/80 hover:bg-red-500 text-white",
    ghost:   t.btnGhost,
    amber:   "bg-amber-600/80 hover:bg-amber-500 text-white",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${v[variant]} ${className} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}>
      {children}
    </button>
  );
};

// Theme Toggle
const ThemeToggle = ({ theme, onToggle }) => {
  const t = useTheme();
  const isDark = theme === "dark";
  return (
    <button onClick={onToggle}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${t.themeBtn} transition-all`}>
      <Icon name={isDark ? "sun" : "moon"} size={13} />
      {isDark ? "Light Mode" : "Dark Mode"}
      <span className={`ml-auto w-8 h-4 rounded-full relative transition-colors duration-300 ${isDark ? "bg-gray-700" : "bg-teal-500"}`}>
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all duration-300 ${isDark ? "left-0.5" : "left-4"}`} />
      </span>
    </button>
  );
};

// Module 1 Login
function LoginPage({ onLogin, theme, onToggleTheme }) {
  const [form,    setForm]    = useState({ user: "", pass: "" });
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  const USERS = {
    "admin":   { pass: "admin123", role: "admin",   name: "Dr. Admin" },
    "teacher": { pass: "teach123", role: "teacher",  name: "Prof. Sharma" },
  };

  const handle = () => {
    setErr(""); setLoading(true);
    setTimeout(() => {
      const u = USERS[form.user];
      if (u && u.pass === form.pass) onLogin({ username: form.user, role: u.role, name: u.name });
      else { setErr("Invalid credentials. Try teacher/teach123 or admin/admin123"); setLoading(false); }
    }, 600);
  };

  const bg    = isDark ? "bg-gray-950" : "bg-slate-100";
  const card  = isDark ? "bg-gray-900/90 border-gray-800" : "bg-white border-slate-200";
  const text  = isDark ? "text-white"   : "text-slate-900";
  const sub   = isDark ? "text-gray-500": "text-slate-400";
  const inp   = isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-600" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400";
  const lbl   = isDark ? "text-gray-400": "text-slate-600";
  const foot  = isDark ? "border-gray-800 text-gray-600": "border-slate-100 text-slate-400";
  const footT = isDark ? "text-gray-500": "text-slate-500";

  return (
    <div className={`min-h-screen flex items-center justify-center ${bg} relative overflow-hidden transition-colors duration-300`}>
      <div style={{ position:"absolute",inset:0,opacity:isDark?0.04:0.06,backgroundImage:"linear-gradient(#2563eb 1px,transparent 1px),linear-gradient(90deg,#2563eb 1px,transparent 1px)",backgroundSize:"48px 48px" }} />
      <div style={{ position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle, rgba(0,188,212,0.08) 0%, transparent 70%)" }} />

      {/* Theme toggle top-right */}
      <button onClick={onToggleTheme}
        className={`absolute top-5 right-5 z-10 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all
          ${isDark ? "bg-gray-900 border-gray-700 text-gray-400 hover:text-yellow-400" : "bg-white border-slate-200 text-slate-500 hover:text-indigo-600"}`}>
        <Icon name={isDark ? "sun" : "moon"} size={14} />
        {isDark ? "Light" : "Dark"}
      </button>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #2563eb, #1e40af)" }}>
            <Icon name="assignment" size={28} color="white" />
          </div>
          <h1 className={`text-3xl font-bold ${text} tracking-tight`} style={{ fontFamily: "'Georgia', serif" }}>
            Acadence
          </h1>
          <p className={`${sub} text-sm mt-1`}>GHRIET Nagpur -+ IT Department</p>
        </div>

        <div className={`${card} border rounded-2xl p-8 shadow-2xl backdrop-blur transition-colors duration-300`}>
          <h2 className={`${text} font-semibold text-lg mb-6`}>Sign In to Continue</h2>
          <div className="mb-4">
            <label className={`block text-sm ${lbl} mb-1.5 font-medium`}>Username</label>
            <input value={form.user} onChange={e => setForm(f => ({ ...f, user: e.target.value }))} placeholder="e.g. teacher"
              className={`w-full ${inp} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors`} />
          </div>
          <div className="mb-4">
            <label className={`block text-sm ${lbl} mb-1.5 font-medium`}>Password</label>
            <input type="password" value={form.pass} onChange={e => setForm(f => ({ ...f, pass: e.target.value }))}
              placeholder="G��G��G��G��G��G��G��G��" onKeyDown={e => e.key === "Enter" && handle()}
              className={`w-full ${inp} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors`} />
          </div>
          {err && <div className="text-red-400 text-xs mb-4 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">{err}</div>}
          <button onClick={handle} disabled={loading} className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all"
            style={{ background: loading ? "#1e40af" : "linear-gradient(135deg, #2563eb, #1e40af)" }}>
            {loading ? "Authenticating..." : "Sign In G��"}
          </button>
          <div className={`mt-4 pt-4 border-t ${foot} text-center text-xs`}>
            Demo: <span className={footT}>teacher / teach123</span> &nbsp;|&nbsp; <span className={footT}>admin / admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Module 2 Student Management
function StudentManagement({ students, setStudents }) {
  const t = useTheme();
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState({ name: "", roll: "", email: "", div: "I1" });
  const [search, setSearch] = useState("");

  const filtered = students.filter(s => {
    const query = search.toLowerCase();
    const name  = String(s.name || "").toLowerCase();
    const roll  = String(s.roll || s.rollNo || "").toLowerCase();
    const div   = String(s.div || s.division || "").toLowerCase();
    return name.includes(query) || roll.includes(query) || div.includes(query);
  });

  const add = () => {
    if (!form.name || !form.roll || !form.email) return;
    setStudents(prev => [...prev, { id: uid(), ...form }]);
    setForm({ name: "", roll: "", email: "", div: "I1" }); setModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${t.textPrimary}`}>Student Management</h2>
          <p className={`${t.textSecondary} text-sm mt-1`}>{students.length} students enrolled</p>
        </div>
        <Btn onClick={() => setModal(true)}><Icon name="plus" size={16} />Add Student</Btn>
      </div>
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, roll, or divisionGǪ"
          className={`w-full max-w-sm ${t.input} border rounded-lg px-3 py-2.5 text-sm focus:outline-none ${t.inputFocus} transition-colors`} />
      </div>
      <div className={`border ${t.card} rounded-xl overflow-hidden`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${t.tableBorder} ${t.tableHead} text-xs uppercase tracking-wider`}>
              {["#","Name","Roll No","Email","Div","Actions"].map(h => <th key={h} className="text-left px-5 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className={`border-b ${t.tableRow} transition-colors`}>
                <td className={`px-5 py-3 ${t.textMuted} font-mono text-xs`}>{i + 1}</td>
                <td className={`px-5 py-3 ${t.textPrimary} font-medium`}>{s.name}</td>
                <td className="px-5 py-3 font-mono text-teal-500 text-xs">{s.roll}</td>
                <td className={`px-5 py-3 ${t.textSecondary} text-xs`}>{s.email}</td>
                <td className="px-5 py-3"><Badge text={`Div ${s.div}`} color={s.div === "A" ? "teal" : "blue"} /></td>
                <td className="px-5 py-3">
                  <button onClick={() => setStudents(p => p.filter(x => x.id !== s.id))} className={`${t.textMuted} hover:text-red-500 transition-colors`}>
                    <Icon name="trash" size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className={`px-5 py-10 text-center ${t.textMuted}`}>No students found</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title="Add New Student" onClose={() => setModal(false)}>
          <Input label="Full Name"  value={form.name}  onChange={e => setForm(f => ({ ...f, name:  e.target.value }))} placeholder="e.g. Ravi Kumar" />
          <Input label="Roll Number" value={form.roll} onChange={e => setForm(f => ({ ...f, roll:  e.target.value }))} placeholder="e.g. IT2409" />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="student@ghriet.ac.in" />
          <SelectField label="Division" value={form.div} onChange={e => setForm(f => ({ ...f, div: e.target.value }))}
            options={[
              { value: "I1", label: "Division I1" },
              { value: "I2", label: "Division I2" },
              { value: "I3", label: "Division I3" }
            ]} />
          <div className="flex gap-3 mt-2"><Btn onClick={add}>Add Student</Btn><Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

//Module 3 Assignment Management
function AssignmentManagement({ assignments, setAssignments }) {
  const t = useTheme();
  const [modal, setModal] = useState(false);
  const [form,  setForm]  = useState({ title: "", subject: "", deadline: "", maxMarks: "20", desc: "" });
  const sorted = useMemo(() => [...assignments].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)), [assignments]);

  const add = async () => {
    if (!form.title || !form.subject || !form.deadline) return;
    try {
      const result = await createAssignment(form);
      const payload = result.assignment || result;
      const assignmentId = payload._id || payload.id;
      if (!payload || !assignmentId) {
        throw new Error("Invalid assignment response from server");
      }
      const newAssignment = {
        id: assignmentId,
        title: payload.title,
        subject: payload.subject,
        deadline: payload.dueDate || payload.deadline || form.deadline,
        maxMarks: Number(form.maxMarks) || 20,
        desc: payload.desc || form.desc || ""
      };
      setAssignments(prev => [newAssignment, ...prev]);
      setForm({ title: "", subject: "", deadline: "", maxMarks: "20", desc: "" });
      setModal(false);
    } catch (err) {
      console.error("Failed to create assignment:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAssignment(id);
    } catch (err) {
      console.error("Failed to delete assignment:", err);
    }
    setAssignments(prev => prev.filter(x => x.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${t.textPrimary}`}>Assignment Management</h2>
          <p className={`${t.textSecondary} text-sm mt-1`}>{assignments.length} assignments</p>
        </div>
        <Btn onClick={() => setModal(true)}><Icon name="plus" size={16} />New Assignment</Btn>
      </div>
      <div className="grid gap-3">
        {sorted.map(a => {
          const past = isPastDeadline(a.deadline);
          return (
            <div key={a.id} className={`border ${t.card} ${t.cardHover} rounded-xl p-5 transition-colors`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className={`${t.textPrimary} font-semibold`}>{a.title}</span>
                    <Badge text={a.subject} color="teal" />
                    <Badge text={past ? "Closed" : "Active"} color={past ? "red" : "green"} />
                  </div>
                  {a.desc && <p className={`${t.textSecondary} text-xs mb-2`}>{a.desc}</p>}
                  <div className={`flex items-center gap-4 text-xs ${t.textSecondary}`}>
                    <span>Deadline: <span className={past ? "text-red-500" : t.textPrimary}>{formatDate(a.deadline)}</span></span>
                    <span>Max Marks: <span className={t.textPrimary}>{a.maxMarks}</span></span>
                  </div>
                </div>
                <button onClick={() => handleDelete(a.id)} className={`${t.textMuted} hover:text-red-500 transition-colors ml-4`}>
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </div>
          );
        })}
        {assignments.length === 0 && <div className={`${t.textMuted} text-center py-16 border ${t.card} rounded-xl`}>No assignments yet.</div>}
      </div>
      {modal && (
        <Modal title="New Assignment" onClose={() => setModal(false)}>
          <Input    label="Title"       value={form.title}    onChange={e => setForm(f => ({ ...f, title:    e.target.value }))} placeholder="e.g. Lab Report 3" />
          <Input    label="Subject"     value={form.subject}  onChange={e => setForm(f => ({ ...f, subject:  e.target.value }))} placeholder="e.g. DSA" />
          <Input    label="Deadline" type="date" value={form.deadline}  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
          <Input    label="Max Marks" type="number" value={form.maxMarks} onChange={e => setForm(f => ({ ...f, maxMarks: e.target.value }))} />
          <Textarea label="Description" value={form.desc}     onChange={e => setForm(f => ({ ...f, desc:     e.target.value }))} placeholder="Assignment detailsGǪ" />
          <div className="flex gap-3 mt-2"><Btn onClick={add}>Add Assignment</Btn><Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// Module 4 Submission Entry
function SubmissionEntry({ students, assignments, submissions, setSubmissions }) {
  const t = useTheme();
  const [selAssign, setSelAssign] = useState(assignments[0]?.id || "");
  const [modal,     setModal]     = useState(null);
  const [marks,     setMarks]     = useState("");

  const assignment   = assignments.find(a => a.id === selAssign);
  const submittedIds = new Set(submissions.filter(s => s.assignmentId === selAssign).map(s => s.studentId));
  const isLate       = assignment ? isPastDeadline(assignment.deadline) : false;

  const markSubmitted = () => {
    if (!modal) return;
    setSubmissions(prev => [...prev, { id: uid(), studentId: modal.id, assignmentId: selAssign, submittedOn: fmt(new Date()), marks: Number(marks) || 0, late: isLate }]);
    setMarks(""); setModal(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-xl font-bold ${t.textPrimary} mb-1`}>Submission Entry</h2>
        <p className={`${t.textSecondary} text-sm`}>Mark students as submitted for each assignment</p>
      </div>
      <div className="mb-5">
        <label className={`block text-sm ${t.textLabel} mb-1.5 font-medium`}>Select Assignment</label>
        <select value={selAssign} onChange={e => setSelAssign(e.target.value)}
          className={`${t.select} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 min-w-72`}>
          {assignments.map(a => <option key={a.id} value={a.id}>{a.title} ({a.subject})</option>)}
        </select>
      </div>
      {assignment && (
        <div className="mb-4 flex items-center gap-3 text-sm flex-wrap">
          <Badge text={isPastDeadline(assignment.deadline) ? "Past Deadline" : "Active"} color={isPastDeadline(assignment.deadline) ? "red" : "green"} />
          <span className={t.textSecondary}>Deadline: <span className={t.textPrimary}>{formatDate(assignment.deadline)}</span></span>
          <span className={t.textSecondary}>Submitted: <span className="text-emerald-500 font-mono">{submittedIds.size}/{students.length}</span></span>
        </div>
      )}
      <div className={`border ${t.card} rounded-xl overflow-hidden overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${t.tableBorder} ${t.tableHead} text-xs uppercase tracking-wider`}>
              {["Student","Roll No","Status","Submitted On","Marks","Action"].map(h => <th key={h} className="text-left px-5 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {students.map(s => {
              const sub = submissions.find(x => x.studentId === s.id && x.assignmentId === selAssign);
              return (
                <tr key={s.id} className={`border-b ${t.tableRow} transition-colors`}>
                  <td className={`px-5 py-3 ${t.textPrimary} font-medium`}>{s.name}</td>
                  <td className="px-5 py-3 font-mono text-teal-500 text-xs">{s.roll}</td>
                  <td className="px-5 py-3">{sub ? <Badge text={sub.late ? "Late Submitted" : "Submitted"} color={sub.late ? "amber" : "green"} /> : <Badge text="Not Submitted" color="red" />}</td>
                  <td className={`px-5 py-3 ${t.textSecondary} text-xs`}>{sub ? formatDate(sub.submittedOn) : "G��"}</td>
                  <td className="px-5 py-3 font-mono text-sm">{sub ? <span className={t.textPrimary}>{sub.marks}</span> : <span className={t.textMuted}>G��</span>}</td>
                  <td className="px-5 py-3">
                    {sub
                      ? <button onClick={() => setSubmissions(p => p.filter(x => !(x.assignmentId === selAssign && x.studentId === s.id)))} className={`${t.textMuted} hover:text-red-500 text-xs transition-colors`}>Unmark</button>
                      : <button onClick={() => setModal(s)} className="text-teal-500 hover:text-teal-400 text-xs font-medium transition-colors">Mark Submitted</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title={`Mark Submission G�� ${modal.name}`} onClose={() => setModal(null)}>
          <p className={`${t.textSecondary} text-sm mb-4`}>Assignment: <span className={t.textPrimary}>{assignment?.title}</span></p>
          {isLate && <div className="text-amber-500 text-xs bg-amber-900/20 border border-amber-800/30 rounded-lg px-3 py-2 mb-4">G�� Deadline has passed. This will be marked as a late submission.</div>}
          <Input label="Marks Awarded" type="number" value={marks} onChange={e => setMarks(e.target.value)} placeholder={`Out of ${assignment?.maxMarks}`} />
          <div className="flex gap-3 mt-2"><Btn onClick={markSubmitted}><Icon name="check" size={16} />Mark Submitted</Btn><Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// Module 5 Deafulter Detection
function DefaulterDetection({ students, assignments, submissions }) {
  const t = useTheme();
  const [selAssign, setSelAssign] = useState("all");
  const pastAssignments = assignments.filter(a => isPastDeadline(a.deadline));

  const defaulters = useMemo(() => {
    const result = [];
    const toCheck = selAssign === "all" ? pastAssignments : pastAssignments.filter(a => a.id === selAssign);
    for (const a of toCheck)
      for (const s of students)
        if (!submissions.some(x => x.studentId === s.id && x.assignmentId === a.id))
          result.push({ student: s, assignment: a });
    return result;
  }, [students, pastAssignments, submissions, selAssign]);

  const grouped = useMemo(() => {
    const map = {};
    for (const d of defaulters) {
      if (!map[d.student.id]) map[d.student.id] = { student: d.student, assignments: [] };
      map[d.student.id].assignments.push(d.assignment);
    }
    return Object.values(map).sort((a, b) => b.assignments.length - a.assignments.length);
  }, [defaulters]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`text-xl font-bold ${t.textPrimary}`}>Defaulter Detection</h2>
          <p className={`${t.textSecondary} text-sm mt-1`}>Students who missed past-deadline assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-red-500 font-bold text-2xl font-mono">{defaulters.length}</div>
          <div className={`${t.textSecondary} text-sm`}>defaults</div>
        </div>
      </div>
      <div className="mb-5">
        <select value={selAssign} onChange={e => setSelAssign(e.target.value)}
          className={`${t.select} border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500`}>
          <option value="all">All Past Assignments</option>
          {pastAssignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      </div>
      {pastAssignments.length === 0
        ? <div className={`${t.textMuted} text-center py-16`}>No assignments past deadline yet.</div>
        : defaulters.length === 0
        ? <div className="text-emerald-500 text-center py-16 bg-emerald-900/10 border border-emerald-800/30 rounded-xl">=��� All students submitted on time!</div>
        : <div className="grid gap-3">
            {grouped.map(({ student, assignments: da }) => (
              <div key={student.id} className={`border ${t.defaulterCard} rounded-xl p-5 transition-colors`}>
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className={`${t.textPrimary} font-semibold`}>{student.name}</span>
                      <span className="font-mono text-teal-500 text-xs">{student.roll}</span>
                      <Badge text={`Div ${student.div}`} color="gray" />
                    </div>
                    <div className={`${t.textSecondary} text-xs mb-3`}>{student.email}</div>
                    <div className="flex flex-wrap gap-2">
                      {da.map(a => <span key={a.id} className="text-xs bg-red-900/30 text-red-400 border border-red-800/40 rounded-md px-2 py-0.5">{a.title} -+ {a.subject}</span>)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-500 font-bold text-lg font-mono">{da.length}</div>
                    <div className={`${t.textMuted} text-xs`}>missed</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// Module 6 Alert Module
function AlertModule({ students, assignments, submissions, alerts, setAlerts }) {
  const t = useTheme();
  const pastAssignments = assignments.filter(a => isPastDeadline(a.deadline));

  const generateAlerts = () => {
    const newAlerts = [];
    for (const a of pastAssignments) {
      for (const s of students) {
        const submitted = submissions.some(x => x.studentId === s.id && x.assignmentId === a.id);
        const exists    = alerts.some(al => al.studentId === s.id && al.assignmentId === a.id);
        if (!submitted && !exists) newAlerts.push({
          id: uid(), studentId: s.id, assignmentId: a.id,
          studentName: s.name, studentRoll: s.roll, studentEmail: s.email,
          assignmentTitle: a.title, subject: a.subject, deadline: a.deadline,
          message: `Dear ${s.name} (${s.roll}),\n\nThis is an automated alert to inform you that you have NOT submitted the assignment "${a.title}" (${a.subject}), which was due on ${formatDate(a.deadline)}.\n\nPlease submit your assignment immediately or contact your faculty for further instructions.\n\nG�� GHRIET Assignment Tracking System`,
          generatedAt: new Date().toISOString(), read: false,
        });
      }
    }
    setAlerts(prev => [...prev, ...newAlerts]);
    return newAlerts.length;
  };

  const unread = alerts.filter(a => !a.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`text-xl font-bold ${t.textPrimary}`}>Alert Module</h2>
          <p className={`${t.textSecondary} text-sm mt-1`}>{unread} unread -+ {alerts.length} total alerts</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Btn variant="amber" onClick={() => { const n = generateAlerts(); alert(n > 0 ? `${n} new alerts generated!` : "No new alerts to generate."); }}>
            <Icon name="bell" size={16} />Generate Alerts
          </Btn>
          {alerts.length > 0 && <Btn variant="ghost" onClick={() => setAlerts([])}>Clear All</Btn>}
        </div>
      </div>
      {alerts.length === 0
        ? <div className={`${t.textMuted} text-center py-16 border ${t.card} rounded-xl`}>No alerts yet. Click "Generate Alerts" to detect defaulters.</div>
        : <div className="grid gap-3">
            {alerts.map(al => (
              <div key={al.id} className={`border rounded-xl p-5 transition-colors ${al.read ? t.alertRead + " opacity-60" : t.alertUnread}`}>
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <Icon name="alert" size={16} color={al.read ? "#9ca3af" : "#2563eb"} />
                      <span className={`${t.textPrimary} font-semibold`}>{al.studentName}</span>
                      <span className="font-mono text-teal-500 text-xs">{al.studentRoll}</span>
                      {!al.read && <Badge text="New" color="amber" />}
                    </div>
                    <p className={`${t.textSecondary} text-xs mb-1`}>
                      Assignment: <span className={t.textPrimary}>{al.assignmentTitle}</span> -+ Deadline: <span className="text-red-500">{formatDate(al.deadline)}</span>
                    </p>
                    <div className={`mt-3 ${t.alertMsg} border rounded-lg p-3 text-xs font-mono whitespace-pre-wrap leading-relaxed`}>{al.message}</div>
                  </div>
                  {!al.read && <Btn variant="ghost" className="text-xs py-1 px-2" onClick={() => setAlerts(p => p.map(a => a.id === al.id ? { ...a, read: true } : a))}>Mark Read</Btn>}
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// Module 7 Report Module
function ReportModule({ students, assignments, submissions }) {
  const t = useTheme();

  const stats = useMemo(() => assignments.map(a => {
    const subs = submissions.filter(s => s.assignmentId === a.id);
    const submitted = subs.length;
    const avg = subs.length ? (subs.reduce((acc, s) => acc + (s.marks || 0), 0) / subs.length).toFixed(1) : 0;
    return { ...a, submitted, notSubmitted: students.length - submitted, late: subs.filter(s => s.late).length, avg, rate: Math.round((submitted / students.length) * 100) };
  }), [assignments, submissions, students]);

  const topDefaulters = useMemo(() => students.map(s => ({
    ...s, missed: assignments.filter(a => isPastDeadline(a.deadline) && !submissions.some(x => x.studentId === s.id && x.assignmentId === a.id)).length
  })).sort((a, b) => b.missed - a.missed).slice(0, 5), [students, assignments, submissions]);

  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-xl font-bold ${t.textPrimary}`}>Report Module</h2>
        <p className={`${t.textSecondary} text-sm mt-1`}>Assignment-wise submission analytics</p>
      </div>
      <div className={`border ${t.card} rounded-xl overflow-hidden mb-6 overflow-x-auto`}>
        <div className={`px-5 py-3 border-b ${t.tableBorder} ${t.sectionHeader} text-sm font-semibold`}>Assignment-wise Report</div>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${t.tableBorder} ${t.tableHead} text-xs uppercase tracking-wider`}>
              {["Assignment","Subject","Deadline","Submitted","Not Submitted","Late","Avg Marks","Rate"].map(h => <th key={h} className="text-left px-5 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {stats.map(a => (
              <tr key={a.id} className={`border-b ${t.tableRow} transition-colors`}>
                <td className={`px-5 py-3 ${t.textPrimary} text-xs font-medium max-w-[180px] truncate`}>{a.title}</td>
                <td className="px-5 py-3"><Badge text={a.subject} color="teal" /></td>
                <td className={`px-5 py-3 text-xs ${t.textSecondary}`}>{formatDate(a.deadline)}</td>
                <td className="px-5 py-3 text-emerald-500 font-mono font-bold">{a.submitted}</td>
                <td className="px-5 py-3 text-red-500 font-mono font-bold">{a.notSubmitted}</td>
                <td className="px-5 py-3 text-amber-500 font-mono">{a.late}</td>
                <td className={`px-5 py-3 ${t.textPrimary} font-mono`}>{a.avg}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-16 h-1.5 ${t.progressTrack} rounded-full overflow-hidden`}>
                      <div style={{ width: `${a.rate}%`, background: a.rate > 70 ? "#1e90ff" : a.rate > 40 ? "#60a5fa" : "#93c5fd" }} className="h-full rounded-full" />
                    </div>
                    <span className={`text-xs font-mono ${t.textSecondary}`}>{a.rate}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`border ${t.card} rounded-xl overflow-hidden`}>
        <div className={`px-5 py-3 border-b ${t.tableBorder} ${t.sectionHeader} text-sm font-semibold`}>Top Defaulters</div>
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${t.tableBorder} ${t.tableHead} text-xs uppercase tracking-wider`}>
              {["Student","Roll","Division","Assignments Missed"].map(h => <th key={h} className="text-left px-5 py-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {topDefaulters.map(s => (
              <tr key={s.id} className={`border-b ${t.tableRow} transition-colors`}>
                <td className={`px-5 py-3 ${t.textPrimary} font-medium`}>{s.name}</td>
                <td className="px-5 py-3 font-mono text-teal-500 text-xs">{s.roll}</td>
                <td className="px-5 py-3"><Badge text={`Div ${s.div}`} color="gray" /></td>
                <td className="px-5 py-3">{s.missed === 0 ? <Badge text="No defaults" color="green" /> : <span className="font-mono font-bold text-red-500">{s.missed}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

//Module 8 Dashboard
function Dashboard({ students, assignments, submissions, alerts }) {
  const t = useTheme();
  const pastAssigns   = assignments.filter(a =>  isPastDeadline(a.deadline));
  const activeAssigns = assignments.filter(a => !isPastDeadline(a.deadline));

  const defaulters = useMemo(() => {
    const s = new Set();
    for (const a of pastAssigns)
      for (const st of students)
        if (!submissions.some(x => x.studentId === st.id && x.assignmentId === a.id)) s.add(st.id);
    return s.size;
  }, [pastAssigns, students, submissions]);

  const unreadAlerts = alerts.filter(a => !a.read).length;

  const recentActivity = useMemo(() => submissions
    .map(s => ({ ...s, studentName: students.find(x => x.id === s.studentId)?.name, assignTitle: assignments.find(x => x.id === s.assignmentId)?.title }))
    .sort((a, b) => new Date(b.submittedOn) - new Date(a.submittedOn)).slice(0, 5),
  [submissions, students, assignments]);

  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-xl font-bold ${t.textPrimary}`}>Dashboard</h2>
        <p className={`${t.textSecondary} text-sm mt-1`}>Overview of assignment tracking system</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="students"   label="Total Students"  value={students.length}    sub="Enrolled"                        accent="#2563eb" />
        <StatCard icon="assignment" label="Assignments"     value={assignments.length} sub={`${activeAssigns.length} active`} accent="#2563eb" />
        <StatCard icon="defaulter"  label="Defaulters"      value={defaulters}         sub="Past deadline"                   accent="#1e40af" />
        <StatCard icon="bell"       label="Unread Alerts"   value={unreadAlerts}       sub="Pending review"                  accent="#2563eb" />
      </div>
      <div className={`border ${t.card} rounded-xl p-5 mb-4`}>
        <h3 className={`${t.sectionHeader} font-semibold text-sm mb-4`}>Submission Progress</h3>
        <div className="grid gap-3">
          {assignments.map(a => {
            const count = submissions.filter(s => s.assignmentId === a.id).length;
            const pct   = students.length ? Math.round((count / students.length) * 100) : 0;
            const past  = isPastDeadline(a.deadline);
            return (
              <div key={a.id}>
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <span className={`${t.textSecondary} text-xs font-medium`}>{a.title} <span className={t.textMuted}>-+ {a.subject}</span></span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${t.textSecondary}`}>{count}/{students.length}</span>
                    <Badge text={past ? "Closed" : "Active"} color={past ? "red" : "green"} />
                  </div>
                </div>
                <div className={`w-full h-2 ${t.progressTrack} rounded-full overflow-hidden`}>
                  <div style={{ width: `${pct}%`, background: pct === 100 ? "#1e40af" : past ? "#ef4444" : "#2563eb" }} className="h-full rounded-full transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`border ${t.card} rounded-xl overflow-hidden`}>
        <div className={`px-5 py-3 border-b ${t.tableBorder} ${t.sectionHeader} text-sm font-semibold`}>Recent Submissions</div>
        {recentActivity.length === 0
          ? <div className={`px-5 py-8 ${t.textMuted} text-center text-sm`}>No submissions yet.</div>
          : recentActivity.map(s => (
              <div key={s.id} className={`flex items-center gap-4 px-5 py-3 border-b ${t.activityBorder} ${t.activityHover} transition-colors`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #2563eb, #1e40af)" }}>{s.studentName?.[0]}</div>
                <div className="flex-1 min-w-0">
                  <span className={`${t.textPrimary} text-sm font-medium`}>{s.studentName}</span>
                  <span className={`${t.textSecondary} text-xs ml-2`}>submitted <span className={t.textPrimary}>{s.assignTitle}</span></span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {s.late && <Badge text="Late" color="amber" />}
                  <span className={`${t.textMuted} text-xs`}>{formatDate(s.submittedOn)}</span>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}

// Root App
const PAGES = [
  { id: "dashboard",   label: "Dashboard",       icon: "dashboard"  },
  { id: "students",    label: "Students",         icon: "students"   },
  { id: "assignments", label: "Assignments",      icon: "assignment" },
  { id: "submissions", label: "Submission Entry", icon: "submit"     },
  { id: "defaulters",  label: "Defaulters",       icon: "defaulter"  },
  { id: "alerts",      label: "Alerts",           icon: "alert"      },
  { id: "reports",     label: "Reports",          icon: "report"     },
];

export default function App() {
  const [user,        setUser]        = useState(null);
  const [page,        setPage]        = useState("dashboard");
  const [students,    setStudents]    = useState(SEED_STUDENTS);
  const [assignments, setAssignments] = useState(SEED_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState(SEED_SUBMISSIONS);
  const [alerts,      setAlerts]      = useState([]);

  // Theme
  const [theme, setTheme] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const toggleTheme = () => setTheme(th => th === "dark" ? "light" : "dark");
  const t = THEMES[theme];

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop,   setIsDesktop]   = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handle = () => { const d = window.innerWidth >= 768; setIsDesktop(d); if (d) setSidebarOpen(false); };
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  useEffect(() => {
    getAllStudents()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data.map(s => ({
            id: s._id,
            name: s.name,
            roll: s.rollNo || s.roll || "",
            email: s.email || "",
            div: s.division || s.div || "I1"
          })));
        }
      })
      .catch(err => console.error("Failed to fetch students:", err));

    getAllAssignments()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAssignments(data.map(a => ({
            id: a._id,
            title: a.title,
            subject: a.subject,
            deadline: a.dueDate || a.deadline,
            maxMarks: a.maxMarks || 20,
            desc: a.desc || ""
          })));
        }
      })
      .catch(err => console.error("Failed to fetch assignments:", err));
  }, []);

  const navigate = (pageId) => { setPage(pageId); if (!isDesktop) setSidebarOpen(false); };
  const unreadAlerts = alerts.filter(a => !a.read).length;

  if (!user) return (
    <ThemeContext.Provider value={t}>
      <LoginPage onLogin={setUser} theme={theme} onToggleTheme={toggleTheme} />
    </ThemeContext.Provider>
  );

  const renderPage = () => {
    switch (page) {
      case "dashboard":   return <Dashboard    students={students} assignments={assignments} submissions={submissions} alerts={alerts} setPage={setPage} />;
      case "students":    return <StudentManagement students={students} setStudents={setStudents} />;
      case "assignments": return <AssignmentManagement assignments={assignments} setAssignments={setAssignments} />;
      case "submissions": return <SubmissionEntry students={students} assignments={assignments} submissions={submissions} setSubmissions={setSubmissions} />;
      case "defaulters":  return <DefaulterDetection students={students} assignments={assignments} submissions={submissions} />;
      case "alerts":      return <AlertModule students={students} assignments={assignments} submissions={submissions} alerts={alerts} setAlerts={setAlerts} />;
      case "reports":     return <ReportModule students={students} assignments={assignments} submissions={submissions} />;
      default: return null;
    }
  };

  return (
    <ThemeContext.Provider value={t}>
      <div className={`flex min-h-screen ${t.appBg} ${t.textPrimary} transition-colors duration-300`}
        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Mobile overlay */}
        {!isDesktop && sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-black/50" style={{ backdropFilter: "blur(2px)" }}
            onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside style={{ position: isDesktop ? "relative" : "fixed", top: 0, bottom: 0, left: 0, zIndex: 30, transform: isDesktop ? "translateX(0)" : sidebarOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s ease-in-out", width: "240px", flexShrink: 0 }}
          className={`${t.sidebarBg} border-r ${t.sidebarBorder} flex flex-col transition-colors duration-300`}>

          {/* Logo */}
          <div className={`px-5 py-5 border-b ${t.divider} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #2563eb, #1e40af)" }}>
                <Icon name="assignment" size={16} color="white" />
              </div>
              <div>
                <div className={`${t.textPrimary} font-bold text-sm leading-tight`}>Acadence</div>
                <div className={`${t.textMuted} text-xs`}>GHRIET -+ IT Dept</div>
              </div>
            </div>
            {!isDesktop && (
              <button onClick={() => setSidebarOpen(false)} className={`${t.textSecondary} text-2xl leading-none ml-2 transition-colors`}>+�</button>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {PAGES.map(p => {
              const active = page === p.id;
              return (
                <button key={p.id} onClick={() => navigate(p.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative ${active ? t.navActive + " font-medium" : t.navItem}`}>
                  {active && <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full ${t.navActiveDot}`} />}
                  <Icon name={p.icon} size={16} color={active ? "#0d9488" : "currentColor"} />
                  {p.label}
                  {p.id === "alerts" && unreadAlerts > 0 && (
                    <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{unreadAlerts}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User + Theme + Logout footer */}
          <div className={`px-4 py-4 border-t ${t.userFooter}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #2563eb, #1e40af)" }}>{user.name[0]}</div>
              <div className="min-w-0">
                <div className={`${t.textPrimary} text-xs font-medium truncate`}>{user.name}</div>
                <div className={`${t.userRole} text-xs capitalize`}>{user.role}</div>
              </div>
            </div>
            {/* Theme toggle with pill switch */}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button onClick={() => setUser(null)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${t.logoutBtn} transition-all mt-1`}>
              <Icon name="logout" size={13} />Logout
            </button>
          </div>
        </aside>

        {/*Main */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {/* Mobile topbar */}
          {!isDesktop && (
            <div className={`sticky top-0 z-10 ${t.topbar} border-b px-4 py-3 flex items-center gap-3 transition-colors duration-300`}
              style={{ backdropFilter: "blur(8px)" }}>
              <button onClick={() => setSidebarOpen(true)} className={`${t.textSecondary} p-1.5 rounded-lg transition-colors`}>
                <Icon name="menu" size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563eb, #1e40af)" }}>
                  <Icon name="assignment" size={12} color="white" />
                </div>
                <span className={`${t.textPrimary} font-semibold text-sm`}>Acadence</span>
              </div>
              {/* Theme icon on mobile topbar */}
              <button onClick={toggleTheme} className={`ml-auto p-1.5 rounded-lg ${t.themeBtn} transition-colors`}>
                <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
              </button>
              {unreadAlerts > 0 && (
                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadAlerts}</span>
              )}
            </div>
          )}

          <div className="max-w-6xl mx-auto p-4 md:p-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
