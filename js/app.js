document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initProgress();
});

/* ==========================================================================
   1. Theme Management (Chalkboard Switch)
   ========================================================================== */
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  // Read saved theme from localStorage
  const savedTheme = localStorage.getItem('cloudmap_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Toggle theme on click
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('cloudmap_theme', isDark ? 'dark' : 'light');
  });
}

/* ==========================================================================
   2. Progress Sync & LocalStorage Engine
   ========================================================================== */
// Database of total inputs per phase to verify integrity
const PHASE_INPUT_COUNTS = {
  1: 12, // 7 objectives + 5 capstone requirements
  2: 13, // 7 objectives + 6 capstone requirements
  3: 13, // 7 objectives + 6 capstone requirements
  4: 12, // 6 objectives + 6 capstone requirements
  5: 17  // 8 objectives + 9 capstone requirements
};

function initProgress() {
  let progress = {};
  
  // 1. Read progress from localStorage
  try {
    const saved = localStorage.getItem('cloudmap_progress');
    if (saved) {
      progress = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading progress', e);
  }

  // 2. Setup checkbox event listeners on current page
  const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
  
  // Set initial checkbox states from saved progress
  checkboxes.forEach(cb => {
    if (progress[cb.id]) {
      cb.checked = true;
    } else {
      cb.checked = false;
    }

    // Bind change listener
    cb.addEventListener('change', (e) => {
      const target = e.target;
      const phaseNum = parseInt(target.getAttribute('data-phase'));
      
      // Fetch old phase percentage
      const oldPct = getPhaseCompletionPercentage(progress, phaseNum);
      
      // Update progress object
      if (target.checked) {
        progress[target.id] = true;
      } else {
        delete progress[target.id];
      }

      // Save updated progress
      localStorage.setItem('cloudmap_progress', JSON.stringify(progress));
      
      // Recalculate and update UI elements
      updateUI(progress);

      // Verify if phase has newly hit 100%
      const newPct = getPhaseCompletionPercentage(progress, phaseNum);
      if (newPct === 100 && oldPct < 100) {
        triggerPhaseCompletionCelebration(phaseNum);
      }
    });
  });

  // 3. Initial UI update
  updateUI(progress);

  // 4. Set up interactive node hover reviews
  initNodeHoverListeners(progress);
}

// Compute completion percentage for a single phase
function getPhaseCompletionPercentage(progress, phaseNum) {
  // Find all items currently in progress storage belonging to this phase
  // Note: checkbox IDs start with 'p1_', 'p2_', etc.
  const prefix = `p${phaseNum}_`;
  let checkedCount = 0;
  
  Object.keys(progress).forEach(key => {
    if (key.startsWith(prefix) && progress[key] === true) {
      checkedCount++;
    }
  });

  const total = PHASE_INPUT_COUNTS[phaseNum] || 10;
  return Math.min(100, Math.round((checkedCount / total) * 100));
}

// Compute total roadmap completion percentage
function getOverallCompletionPercentage(progress) {
  let totalChecked = 0;
  let totalRequired = 0;

  Object.values(PHASE_INPUT_COUNTS).forEach(count => {
    totalRequired += count;
  });

  Object.keys(progress).forEach(key => {
    if (progress[key] === true) {
      totalChecked++;
    }
  });

  if (totalRequired === 0) return 0;
  return Math.min(100, Math.round((totalChecked / totalRequired) * 100));
}

/* ==========================================================================
   3. UI Updates (Dashboard & Subpages)
   ========================================================================== */
function updateUI(progress) {
  // A. Update Overall Progress elements
  const overallPct = getOverallCompletionPercentage(progress);
  
  const overallPctText = document.getElementById('overall-pct-text');
  if (overallPctText) {
    animateCount(overallPctText, parseInt(overallPctText.innerText) || 0, overallPct, '%');
  }

  const overallProgressBar = document.getElementById('overall-progress-bar');
  if (overallProgressBar) {
    overallProgressBar.style.width = `${overallPct}%`;
  }

  // B. Update Dashboard Phase Milestones
  for (let i = 1; i <= 5; i++) {
    const phasePct = getPhaseCompletionPercentage(progress, i);
    
    // Update individual phase completion texts (e.g. on cards)
    const pctText = document.getElementById(`phase${i}-pct-text`);
    if (pctText) {
      pctText.innerText = `${phasePct}%`;
    }

    // Update phase nodes in SVG transit map
    const nodeGroup = document.getElementById(`node-p${i}`);
    if (nodeGroup) {
      if (phasePct === 100) {
        nodeGroup.classList.add('completed');
      } else {
        nodeGroup.classList.remove('completed');
      }
    }

    // Update trophy badges
    const badgeItem = document.getElementById(`badge-p${i}`);
    const activeBadge = document.getElementById(`phase-badge-p${i}`);
    
    if (badgeItem) {
      if (phasePct === 100) {
        badgeItem.classList.add('unlocked');
        badgeItem.querySelector('.tooltip').innerText = `${getPhaseBadgeName(i)} (Unlocked!)`;
      } else {
        badgeItem.classList.remove('unlocked');
        badgeItem.querySelector('.tooltip').innerText = `${getPhaseBadgeName(i)} (Locked - Complete Phase ${i})`;
      }
    }
    
    // Subpage big badge
    if (activeBadge) {
      if (phasePct === 100) {
        activeBadge.classList.add('unlocked');
      } else {
        activeBadge.classList.remove('unlocked');
      }
    }
  }

  // C. Update Dynamic Highlighter Ink Segments (only on index.html)
  for (let i = 1; i <= 4; i++) {
    const segment = document.getElementById(`path-p${i}`);
    if (segment) {
      const prevPhasePct = getPhaseCompletionPercentage(progress, i);
      if (prevPhasePct === 100) {
        segment.style.strokeDashoffset = '0';
      } else {
        segment.style.strokeDashoffset = '450';
      }
    }
  }

  // D. Highlight Current Active Target Node (the first uncompleted phase)
  let activeFound = false;
  for (let i = 1; i <= 5; i++) {
    const nodeGroup = document.getElementById(`node-p${i}`);
    if (nodeGroup) {
      nodeGroup.classList.remove('current-active');
      const phasePct = getPhaseCompletionPercentage(progress, i);
      if (phasePct < 100 && !activeFound) {
        nodeGroup.classList.add('current-active');
        activeFound = true;
      }
    }
  }

  // E. Update motivational quote depending on global progress
  updateMotivationalBanner(overallPct);
}

/* ==========================================================================
   3.5 Interactive Node Hover & Preview note binding
   ========================================================================== */
function initNodeHoverListeners(progress) {
  const nodes = document.querySelectorAll('.node-group');
  const previewCard = document.getElementById('phase-preview-card');
  const previewContent = document.getElementById('preview-content');
  if (!nodes.length || !previewCard || !previewContent) return;

  const defaultContent = previewContent.innerHTML;

  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const phaseNum = parseInt(node.getAttribute('data-phase'));
      const phasePct = getPhaseCompletionPercentage(progress, phaseNum);
      const data = getPhasePreviewData(phaseNum, phasePct);
      
      previewContent.innerHTML = `
        <span class="preview-tag" style="background-color: ${data.color}; color: #2D2F34; font-weight: bold;">Phase ${phaseNum}</span>
        <h3 style="font-family: 'Architects Daughter'; font-size: 1.25rem; margin-top: 4px;">${data.title}</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 10px; font-style: italic;">
          Duration: ${data.time} • Status: <strong>${data.status}</strong>
        </p>
        
        <div style="border-top: 1.5px dashed var(--border-color); padding-top: 8px; margin-bottom: 8px;">
          <h4 style="font-family: 'Architects Daughter'; font-size: 0.95rem; margin-bottom: 4px;">🎯 Capstone Project</h4>
          <p style="font-size: 0.9rem; line-height: 1.3;">
            <strong>${data.project}</strong>: ${data.projectDesc}
          </p>
        </div>

        <div style="border-top: 1.5px dashed var(--border-color); padding-top: 8px;">
          <h4 style="font-family: 'Architects Daughter'; font-size: 0.95rem; margin-bottom: 4px;">🛠️ Key Skills Unlocked</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
            ${data.skills.map(s => `<span style="font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; border: 1px solid var(--border-color); border-radius: 4px; padding: 1px 4px; background-color: var(--bg-paper);">${s}</span>`).join('')}
          </div>
        </div>

        <div style="border-top: 1.5px dashed var(--border-color); padding-top: 8px; margin-top: 8px; font-size: 0.85rem;">
          🎓 <strong>Free Cert Highlight</strong>: ${data.cert}
        </div>
      `;
      previewCard.style.transform = "scale(1.02) rotate(-0.5deg)";
    });

    node.addEventListener('mouseleave', () => {
      previewContent.innerHTML = defaultContent;
      previewCard.style.transform = "";
    });
  });
}

function getPhasePreviewData(phaseNum, pct) {
  let status = `${pct}% Complete`;
  if (pct === 100) status = "✨ Mastered! (100%)";
  else if (pct > 0) status = `⚡ In Progress (${pct}%)`;
  else status = "🔒 Locked (0%)";

  const phaseData = {
    1: {
      title: "Foundations & Security Mindset",
      time: "Months 1-2",
      color: "var(--marker-cyan)",
      project: "Secure Network Scanner",
      projectDesc: "A Python CLI scanner that probes subnets, grabs SSH/HTTP banners, and generates risk reports in JSON & HTML.",
      skills: ["Linux Shell", "Bash Scripts", "TCP/IP & DNS", "Python CLI", "Git workflow"],
      cert: "ISC2 CC exam & training ($0 Free)",
      status: status
    },
    2: {
      title: "Cloud Infrastructure & IaC Security",
      time: "Months 3-5",
      color: "var(--marker-cyan)",
      project: "Hardened Landing Zone",
      projectDesc: "Deploy AWS multi-tier networks using Terraform. Secure host configurations using Ansible CIS hardening playbooks.",
      skills: ["AWS IAM/VPC", "Terraform HCL", "Ansible YAML", "checkov & tfsec", "Secrets Vault"],
      cert: "Azure AZ-900 ($0 Free Virtual Voucher)",
      status: status
    },
    3: {
      title: "CI/CD Pipeline Security & AppSec",
      time: "Months 6-8",
      color: "var(--marker-green)",
      project: "Secure Web App DevSecOps Pipeline",
      projectDesc: "Structure multi-stage Docker builds, scan code with Semgrep SAST, dependencies with Snyk SCA, and live targets with ZAP DAST.",
      skills: ["GitHub Actions", "Docker Sec", "Semgrep SAST", "Trivy SCA", "OWASP ZAP DAST"],
      cert: "Snyk Associate & GitLab CI ($0 Free)",
      status: status
    },
    4: {
      title: "Compliance, Monitoring & IR",
      time: "Months 9-10",
      color: "var(--marker-green)",
      project: "Compliance Auditor SIEM",
      projectDesc: "Audit server baselines using scheduled OpenSCAP. Define Policy-as-Code checks using OPA Rego and pipeline slack hooks.",
      skills: ["OpenSCAP Audits", "OPA Rego Policy", "VPC Flow Logs", "GuardDuty Alerts"],
      cert: "Qualys VMDR Specialist ($0 Free Exam)",
      status: status
    },
    5: {
      title: "Advanced DevSecOps & Launch",
      time: "Months 11-12",
      color: "var(--marker-violet)",
      project: "Zero-Trust GitOps Production",
      projectDesc: "Deploy multi-service applications inside Kubernetes via ArgoCD GitOps, guarded by Zero Trust Istio mTLS and OPA Gatekeeper.",
      skills: ["ArgoCD GitOps", "K8s Hardening", "Istio mTLS Mesh", "OPA Gatekeeper", "Chaos Eng"],
      cert: "CNCF CKS (Gold Standard container cert)",
      status: status
    }
  };

  return phaseData[phaseNum];
}

function getPhaseBadgeName(phaseNum) {
  const names = {
    1: "🛡️ Foundation Shield",
    2: "🏗️ Infrastructure Architect",
    3: "🔄 Pipeline Guardian",
    4: "🔍 Compliance Sentinel",
    5: "🚀 DevSecOps Engineer"
  };
  return names[phaseNum] || "Completed Phase";
}

function updateMotivationalBanner(pct) {
  const banner = document.getElementById('motivational-text');
  if (!banner) return;

  let msg = "A journey of a thousand miles begins with a single commit. Check some objectives to start!";
  if (pct > 0 && pct < 20) {
    msg = "Looking good! Foundations are key. Keep sketching out your goals! 🛡️";
  } else if (pct >= 20 && pct < 40) {
    msg = "Fantastic progress. You are designing secure architecture like a pro now! 🏗️";
  } else if (pct >= 40 && pct < 60) {
    msg = "Halfway through! Your DevSecOps pipelines are locking down vulnerability risks! 🔄";
  } else if (pct >= 60 && pct < 80) {
    msg = "Compliance audits and SIEM triggers are running smooth. Recruiters are taking notes! 🔍";
  } else if (pct >= 80 && pct < 100) {
    msg = "So close! Final GitOps configurations are falling into place. You are almost there! 🚀";
  } else if (pct === 100) {
    msg = "AMAZING! You have mastered the entire DevSecOps portfolio. You are officially ready to launch! 🎉";
  }
  
  banner.innerText = msg;
}

// Numerical count animation for premium feel
function animateCount(element, start, end, suffix = '') {
  if (start === end) {
    element.innerText = `${end}${suffix}`;
    return;
  }
  
  const duration = 600; // ms
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quad
    const easeProgress = progress * (2 - progress);
    
    const value = Math.round(start + (end - start) * easeProgress);
    element.innerText = `${value}${suffix}`;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/* ==========================================================================
   4. Achievements & Custom HTML5 Canvas Confetti
   ========================================================================== */
function triggerPhaseCompletionCelebration(phaseNum) {
  // 1. Create a custom modal on the fly and append to body
  const overlay = document.createElement('div');
  overlay.className = 'doodle-alert-overlay';
  
  const alertBox = document.createElement('div');
  alertBox.className = 'doodle-alert';
  
  const badgeName = getPhaseBadgeName(phaseNum);
  
  alertBox.innerHTML = `
    <span class="doodle-alert-icon">🎉</span>
    <h3>Phase ${phaseNum} Complete!</h3>
    <p>Incredible effort! You have successfully mastered all objectives and completed the Capstone project for Phase ${phaseNum}.</p>
    <p>You have unlocked the prestigious handwritten badge:<br><strong>${badgeName}</strong>!</p>
    <button class="sketch-btn" id="close-celebrate-btn">Awesome!</button>
  `;
  
  overlay.appendChild(alertBox);
  document.body.appendChild(overlay);
  
  // 2. Trigger Visibility
  setTimeout(() => {
    overlay.classList.add('visible');
  }, 10);

  // 3. Bind close handler
  const closeBtn = alertBox.querySelector('#close-celebrate-btn');
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.remove();
    }, 300);
  });

  // 4. Run pure canvas confetti!
  runSketchConfetti();
}

function runSketchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '999';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = [
    '#FDE047', // Yellow marker
    '#67E8F9', // Cyan marker
    '#86EFAC', // Green marker
    '#D8B4FE', // Violet marker
    '#FCA5A5'  // Red marker
  ];

  const particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * -height - 20,
      r: Math.random() * 6 + 4,
      d: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
      speed: Math.random() * 3 + 4
    });
  }

  let animationFrameId;
  const startTime = Date.now();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, idx) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += p.speed;
      p.x += Math.sin(p.tiltAngle) * 0.5;
      p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

      // Draw custom sketchy confetti (little crayon rectangles!)
      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      
      const x1 = p.x + p.tilt;
      const y1 = p.y;
      const x2 = p.x;
      const y2 = p.y + p.tilt + p.r;
      
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    // Check if animation should stop
    const elapsed = Date.now() - startTime;
    if (elapsed < 3500) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  draw();
}
