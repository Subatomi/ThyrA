<!-- ================= HEADER ================= -->
<div align="center" style="padding:40px 20px">

<h1 style="margin-bottom:10px;">🧬 ThyrA</h1>

<p style="font-size:18px;">
AI-Powered FNAB Thyroid Slide Detection Mobile Application
</p>

<p>
<img src="https://img.shields.io/badge/FastAPI-Backend-green"/>
<img src="https://img.shields.io/badge/React_Native-Mobile-blue"/>
<img src="https://img.shields.io/badge/Supabase-Database-3ecf8e"/>
<img src="https://img.shields.io/badge/Expo-Frontend-black"/>
<img src="https://img.shields.io/badge/AI-Detection-purple"/>
</p>

</div>

---

<!-- ================= OVERVIEW ================= -->
<div style="background:#f6f8fa;padding:22px;border-radius:12px;margin:20px 0;">

<h2>📌 Overview</h2>

<p>
<b>ThyrA</b> is a mobile application that assists doctors in analyzing
<b>Fine Needle Aspiration Biopsy (FNAB)</b> thyroid slides using Artificial Intelligence.
</p>

<p>
The system automatically detects <b>thyrocytes</b> and <b>cell clusters</b>,
draws bounding boxes, and generates a visual summary to support faster
and more consistent medical analysis.
</p>

<p>
Built with a scalable <b>layered architecture</b> for clean separation of concerns.
</p>

</div>

---

<!-- ================= FEATURES ================= -->
<h2>✨ Functionalities</h2>

<table width="100%">
<tr>

<td width="50%" style="padding:12px;">
<div style="border:1px solid #eaeaea;border-radius:10px;padding:16px;">
<h3>🔐 Authentication</h3>
<ul>
<li>Login</li>
<li>Signup</li>
</ul>
</div>
</td>

<td width="50%" style="padding:12px;">
<div style="border:1px solid #eaeaea;border-radius:10px;padding:16px;">
<h3>📁 Folder Management</h3>
<ul>
<li>Create folders</li>
<li>Update folders</li>
<li>Delete folders</li>
<li>Organize images</li>
</ul>
</div>
</td>

</tr>

<tr>

<td width="50%" style="padding:12px;">
<div style="border:1px solid #eaeaea;border-radius:10px;padding:16px;">
<h3>🖼 Image Management</h3>
<ul>
<li>Save detected images</li>
<li>Delete images</li>
<li>Store by folders</li>
</ul>
</div>
</td>

<td width="50%" style="padding:12px;">
<div style="border:1px solid #eaeaea;border-radius:10px;padding:16px;">
<h3>🤖 AI Detection</h3>
<ul>
<li>Upload FNAB slides</li>
<li>Detect thyrocytes & clusters</li>
<li>Bounding box visualization</li>
<li>Detection summary results</li>
<li>Download processed images</li>
</ul>
</div>
</td>

</tr>
</table>

---

<!-- ================= TECH STACK ================= -->
<h2>🛠 Tech Stack</h2>

<table>
<tr><td><b>Frontend</b></td><td>React Native + Expo</td></tr>
<tr><td><b>Backend</b></td><td>FastAPI (Python)</td></tr>
<tr><td><b>Database</b></td><td>Supabase (PostgreSQL + Auth + Storage)</td></tr>
<tr><td><b>AI Engine</b></td><td>Computer Vision Detection Model</td></tr>
</table>

---

<!-- ================= ARCHITECTURE ================= -->
<h2>🏗 Architecture</h2>

<pre>
Presentation Layer   → React Native UI
Application Layer    → API & business logic
Service Layer        → AI inference engine
Data Layer           → Supabase database & storage
</pre>

<p>
Uses <b>Layered Architecture</b> to ensure modularity, scalability,
and maintainability.
</p>

---

<!-- ================= WORKFLOW ================= -->
<h2>🔄 Workflow</h2>

<ol>
<li>User logs in</li>
<li>Uploads FNAB slide image</li>
<li>Image sent to FastAPI backend</li>
<li>AI performs detection</li>
<li>Bounding boxes + summary generated</li>
<li>Result saved to folder or downloaded</li>
</ol>

---

<div align="center" style="margin-top:40px;color:gray;">
Built for AI-assisted medical diagnosis
</div>
