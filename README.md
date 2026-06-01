# CloudMap — Interactive DevSecOps & Cloud Security Learning Roadmap

Welcome to **CloudMap**! An interactive, wowed-by-design **multipage web application** styled as a handwritten classroom sketchbook/blackboard. It is tailored specifically for **computer engineering students** transitioning to high-demand cloud security and DevSecOps careers within **12 months**.

---

## 🎨 Theme & Creative Aesthetic: "Scribble Notebook"

To break away from standard sterile tech grids, **CloudMap** mimics a personal student lab workbook and school chalkboard:
- **Sketchbook (Light Mode)**: Warm parchment ivory background (`#FAF7F2`) with blue vertical/horizontal notebook lines.
- **Blackboard (Dark Mode)**: Slate charcoal backdrop (`#1B1C1E`) with faint white chalky grids.
- **Doodle Elements**: Features custom freehand-drawn organic borders (`border-radius: 255px 15px...`), hard ink drop-shadows, handwritten Google Fonts (`Architects Daughter` and `Patrick Hand`), and highlighter swipes.
- **Chalk Switch**: Smooth dark-mode slide designed as a chalkboard panel.
- **Interactive Map**: Dashboard houses a custom, animated wavy transit-line SVG roadmap. Completing a phase triggers interactive canvas-based colored marker confetti doodles!
- **Data Persistence**: State sync is powered by clean vanilla JS, mapping inputs to local storage (`localStorage`).

---

## 📁 Project Architecture

This is a clean, modern, zero-dependency frontend application with instant page load.

```
cloud-guard-sandbox/
├── index.html           # Main Dashboard Hub & SVG transit line roadmap
├── phase1.html          # Phase 1: Foundations (Months 1-2)
├── phase2.html          # Phase 2: Cloud Infrastructure & IaC (Months 3-5)
├── phase3.html          # Phase 3: CI/CD & AppSec (Months 6-8)
├── phase4.html          # Phase 4: Compliance & Monitoring (Months 9-10)
├── phase5.html          # Phase 5: Advanced DevSecOps (Months 11-12)
├── css/
│   └── styles.css       # Complete layout, scribble variables, animations
├── js/
│   └── app.js           # Multi-page progress calculations, sync, canvas confetti
├── DESIGN.md            # Technical details of the scribble design system
└── README.md            # You are here!
```

---

## 🚀 How to Run Locally

Since this app is written in pure vanilla HTML, CSS, and JS:
1. Simply double-click `index.html` to open it directly in any web browser!
2. Alternatively, run a lightweight local server if you'd like:
   ```bash
   npx serve .
   ```
   or using Python:
   ```bash
   python -m http.server 8000
   ```

---

## 📚 Curriculum Path Overview

| Phase | Time | Target Focus | Key Capstone Project | Recommended Free Cert |
|---|---|---|---|---|
| **Phase 1** | M 1-2 | Linux shell, Python, Git, OWASP awareness | **Secure Port & Service CLI Scanner** | **ISC2 CC** ($0 Free exam & course) |
| **Phase 2** | M 3-5 | AWS IAM/VPC, Terraform HCL, Ansible hardening | **CIS-hardened Landing Zone & IaC pipeline** | **Azure Fundamentals** ($0 via Microsoft) |
| **Phase 3** | M 6-8 | Docker hardening, Trivy/Snyk, OWASP ZAP | **Multi-gate Secure Web App Pipeline** | **Snyk Certified Associate** ($0 Free) |
| **Phase 4** | M 9-10 | OpenSCAP, OPA/Rego policies, GuardDuty alerting | **Automated Compliance SIEM Auditor** | **Qualys VMDR Specialist** ($0 Free exam) |
| **Phase 5** | M 11-12 | Kubernetes, ArgoCD GitOps, Istio mTLS | **Zero-Trust K8s Production Showcase** | **CNCF CKS** (Certified K8s Specialist) |

---

## ⚙️ Print-Friendly Workbook Mode

To print or export the roadmap as a physical, paper workbook:
1. Press `Ctrl + P` (or `Cmd + P` on Mac) inside any page.
2. The print-specific styles automatically strip non-essential buttons, chalkboard switches, and layouts, converting the page into a crisp, high-contrast, black-and-white checkable sketchbook.
3. Save as PDF or print on actual paper to track your progress physically!
