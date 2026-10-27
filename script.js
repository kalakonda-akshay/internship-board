// Sample data (fictional companies)
const internships = [
  { id: 1, title: "Frontend Developer Intern", company: "PixelNest", category: "Web Development", mode: "Remote", location: "Remote", duration: 3, stipend: 8000, deadline: "2026-11-20", posted: "2026-10-22", skills: ["HTML", "CSS", "JavaScript"], desc: "Build responsive UI components and fix front-end bugs alongside our product team." },
  { id: 2, title: "Backend Developer Intern", company: "CloudLeaf", category: "Web Development", mode: "Hybrid", location: "Hyderabad", duration: 4, stipend: 12000, deadline: "2026-11-15", posted: "2026-10-20", skills: ["Node.js", "MongoDB", "REST"], desc: "Design REST APIs and work with databases on a growing SaaS platform." },
  { id: 3, title: "Data Analyst Intern", company: "InsightLoop", category: "Data Science", mode: "Remote", location: "Remote", duration: 3, stipend: 10000, deadline: "2026-11-30", posted: "2026-10-18", skills: ["Python", "SQL", "Excel"], desc: "Clean datasets, build dashboards and present insights to stakeholders." },
  { id: 4, title: "Machine Learning Intern", company: "NeuroByte", category: "Data Science", mode: "On-site", location: "Bengaluru", duration: 6, stipend: 20000, deadline: "2026-11-10", posted: "2026-10-15", skills: ["Python", "TensorFlow", "Pandas"], desc: "Train and evaluate models for a real-world recommendation system." },
  { id: 5, title: "UI/UX Design Intern", company: "Craftly Studio", category: "Design", mode: "Hybrid", location: "Pune", duration: 3, stipend: 9000, deadline: "2026-11-25", posted: "2026-10-24", skills: ["Figma", "Prototyping", "Research"], desc: "Create wireframes, user flows and polished interfaces for client projects." },
  { id: 6, title: "Digital Marketing Intern", company: "BrightWave", category: "Marketing", mode: "Remote", location: "Remote", duration: 2, stipend: 6000, deadline: "2026-12-05", posted: "2026-10-23", skills: ["SEO", "Social Media", "Copywriting"], desc: "Plan campaigns, write content and track performance across channels." },
  { id: 7, title: "Content Writing Intern", company: "InkSpring", category: "Marketing", mode: "Remote", location: "Remote", duration: 2, stipend: 5000, deadline: "2026-11-18", posted: "2026-10-10", skills: ["Writing", "Research", "Editing"], desc: "Write blogs, newsletters and website copy for tech brands." },
  { id: 8, title: "Android App Intern", company: "AppForge", category: "Mobile Development", mode: "On-site", location: "Chennai", duration: 5, stipend: 15000, deadline: "2026-11-12", posted: "2026-10-12", skills: ["Kotlin", "Android Studio", "Firebase"], desc: "Develop and test features for a consumer Android application." },
  { id: 9, title: "Flutter Developer Intern", company: "SwiftLane", category: "Mobile Development", mode: "Remote", location: "Remote", duration: 4, stipend: 11000, deadline: "2026-12-01", posted: "2026-10-26", skills: ["Flutter", "Dart", "APIs"], desc: "Build cross-platform mobile screens and integrate backend services." },
  { id: 10, title: "Cybersecurity Intern", company: "ShieldOps", category: "Security", mode: "Hybrid", location: "Mumbai", duration: 6, stipend: 14000, deadline: "2026-11-28", posted: "2026-10-19", skills: ["Networking", "Linux", "Pen-testing"], desc: "Assist with vulnerability assessments and security monitoring." },
  { id: 11, title: "HR & Recruitment Intern", company: "TalentBridge", category: "Business", mode: "On-site", location: "Delhi", duration: 3, stipend: 7000, deadline: "2026-11-22", posted: "2026-10-17", skills: ["Communication", "Screening", "Excel"], desc: "Source candidates, schedule interviews and support onboarding." },
  { id: 12, title: "Business Development Intern", company: "GrowthGrid", category: "Business", mode: "Remote", location: "Remote", duration: 3, stipend: 8000, deadline: "2026-12-10", posted: "2026-10-25", skills: ["Sales", "Outreach", "CRM"], desc: "Research leads, reach out to prospects and support the sales pipeline." }
];

const colors = ["#3b5bdb", "#0ca678", "#f08c00", "#e64980", "#7048e8", "#1098ad", "#d9480f"];
const $ = (id) => document.getElementById(id);
let saved = JSON.parse(localStorage.getItem("savedInternships") || "[]");

// Populate category dropdown
const cats = ["All", ...new Set(internships.map(i => i.category))];
$("category").innerHTML = cats.map(c => `<option value="${c === "All" ? "" : c}">${c}</option>`).join("");

const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtMoney = (n) => "₹" + n.toLocaleString("en-IN") + "/mo";

function getFiltered() {
  const q = $("search").value.trim().toLowerCase();
  const cat = $("category").value, mode = $("mode").value;
  const maxDur = +$("duration").value, onlySaved = $("savedOnly").checked;
  let list = internships.filter(i =>
    (!q || [i.title, i.company, i.category, ...i.skills].join(" ").toLowerCase().includes(q)) &&
    (!cat || i.category === cat) &&
    (!mode || i.mode === mode) &&
    i.duration <= maxDur &&
    (!onlySaved || saved.includes(i.id))
  );
  const sort = $("sort").value;
  if (sort === "stipend") list.sort((a, b) => b.stipend - a.stipend);
  else if (sort === "deadline") list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  else list.sort((a, b) => new Date(b.posted) - new Date(a.posted));
  return list;
}

function render() {
  const list = getFiltered();
  $("resultCount").textContent = `${list.length} internship${list.length === 1 ? "" : "s"} found`;
  $("empty").hidden = list.length > 0;
  $("savedCount").textContent = saved.length;
  $("grid").innerHTML = list.map(i => `
    <article class="card">
      <div class="card-head">
        <div class="avatar" style="background:${colors[i.id % colors.length]}">${i.company[0]}</div>
        <div><h3>${i.title}</h3><div class="company">${i.company} · ${i.location}</div></div>
        <button class="save ${saved.includes(i.id) ? "active" : ""}" data-save="${i.id}" aria-label="Save internship">♥</button>
      </div>
      <div class="tags">
        <span class="tag">${i.mode}</span>
        <span class="tag gray">${i.duration} months</span>
        ${i.skills.slice(0, 2).map(s => `<span class="tag gray">${s}</span>`).join("")}
      </div>
      <div class="meta"><span><strong>${fmtMoney(i.stipend)}</strong></span><span>Apply by ${fmtDate(i.deadline)}</span></div>
      <div class="card-actions">
        <button class="btn btn-outline" data-details="${i.id}">Details</button>
        <button class="btn btn-primary" data-apply="${i.id}">Apply</button>
      </div>
    </article>`).join("");
}

// Modal
function openModal(id, applyMode) {
  const i = internships.find(x => x.id === id);
  $("modalBody").innerHTML = `
    <h2 id="modalTitle">${i.title}</h2>
    <div class="company">${i.company} · ${i.location} · ${i.mode}</div>
    <p>${i.desc}</p>
    <ul>
      <li><strong>Duration:</strong> ${i.duration} months</li>
      <li><strong>Stipend:</strong> ${fmtMoney(i.stipend)}</li>
      <li><strong>Deadline:</strong> ${fmtDate(i.deadline)}</li>
      <li><strong>Skills:</strong> ${i.skills.join(", ")}</li>
    </ul>
    <form class="form" id="applyForm">
      <input required name="name" placeholder="Full name" />
      <input required type="email" name="email" placeholder="Email address" />
      <textarea required rows="3" placeholder="Why are you a good fit?"></textarea>
      <button class="btn btn-primary" type="submit">Submit application</button>
    </form>`;
  $("modal").hidden = false;
  if (applyMode) $("applyForm").querySelector("input").focus();
  $("applyForm").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.outerHTML = `<p class="success">✓ Application submitted for ${i.title} at ${i.company}!</p>`;
  });
}
const closeModal = () => ($("modal").hidden = true);

// Events
$("grid").addEventListener("click", (e) => {
  const s = e.target.closest("[data-save]"), d = e.target.closest("[data-details]"), a = e.target.closest("[data-apply]");
  if (s) {
    const id = +s.dataset.save;
    saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
    localStorage.setItem("savedInternships", JSON.stringify(saved));
    render();
  } else if (d) openModal(+d.dataset.details, false);
  else if (a) openModal(+a.dataset.apply, true);
});
["search", "category", "mode", "sort", "savedOnly"].forEach(id => $(id).addEventListener("input", render));
$("duration").addEventListener("input", () => { $("durLabel").textContent = $("duration").value; render(); });
$("reset").addEventListener("click", () => {
  $("search").value = ""; $("category").value = ""; $("mode").value = "";
  $("duration").value = 6; $("durLabel").textContent = 6; $("sort").value = "new"; $("savedOnly").checked = false;
  render();
});
$("savedBtn").addEventListener("click", () => { $("savedOnly").checked = !$("savedOnly").checked; render(); });
$("filterToggle").addEventListener("click", () => {
  const open = $("filters").classList.toggle("open");
  $("filterToggle").setAttribute("aria-expanded", open);
});
$("closeModal").addEventListener("click", closeModal);
$("modal").addEventListener("click", (e) => { if (e.target === $("modal")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

$("year").textContent = new Date().getFullYear();
render();
