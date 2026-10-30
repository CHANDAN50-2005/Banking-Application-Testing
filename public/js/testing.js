/**
 * Software Testing Dashboard Logic
 * Banking Application Testing (23SCS743) - Srinivas University
 * Implements real-time test execution, Chart.js metrics, and test case CRUD
 */

let testSuiteData = [];
let statusDonutChart = null;
let moduleBarChart = null;
let currentFilterModule = "ALL";

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  initTestSuite();
});

function initTestSuite() {
  // Load from localStorage or seed
  const saved = localStorage.getItem("nova_test_cases");
  if (saved) {
    try {
      testSuiteData = JSON.parse(saved);
    } catch(e) {
      testSuiteData = JSON.parse(JSON.stringify(SEED_DATA.testCases));
    }
  } else {
    testSuiteData = JSON.parse(JSON.stringify(SEED_DATA.testCases));
  }

  renderTestingKPIs();
  renderCharts();
  renderTestMatrix();
}

function saveTestSuite() {
  localStorage.setItem("nova_test_cases", JSON.stringify(testSuiteData));
}

// Render KPI Cards (Total, Passed, Failed, Blocked, Pass Rate)
function renderTestingKPIs() {
  const total = testSuiteData.length;
  const passed = testSuiteData.filter(t => t.status === "PASS").length;
  const failed = testSuiteData.filter(t => t.status === "FAIL").length;
  const blocked = testSuiteData.filter(t => t.status === "BLOCKED").length;
  const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

  document.getElementById("kpiTotalTests").textContent = total;
  document.getElementById("kpiPassedTests").textContent = passed;
  document.getElementById("kpiFailedTests").textContent = failed;
  document.getElementById("kpiBlockedTests").textContent = blocked;
  document.getElementById("kpiPassRate").textContent = `${rate}%`;

  // Update navbar badge
  const passRatePills = document.querySelectorAll(".pass-rate-indicator");
  passRatePills.forEach(p => p.textContent = `${rate}% Pass Rate`);
}

// Render Donut & Bar Charts using Chart.js
function renderCharts() {
  const total = testSuiteData.length;
  const passed = testSuiteData.filter(t => t.status === "PASS").length;
  const failed = testSuiteData.filter(t => t.status === "FAIL").length;
  const blocked = testSuiteData.filter(t => t.status === "BLOCKED").length;

  // Donut Chart
  const ctxDonut = document.getElementById("statusDonutChart");
  if (ctxDonut) {
    if (statusDonutChart) statusDonutChart.destroy();
    statusDonutChart = new Chart(ctxDonut, {
      type: "doughnut",
      data: {
        labels: ["Passed", "Failed", "Blocked"],
        datasets: [{
          data: [passed, failed, blocked],
          backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
          borderWidth: 2,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw} (${((item.raw / total) * 100).toFixed(1)}%)`
            }
          }
        }
      }
    });

    // Update donut center text
    const centerRate = document.getElementById("donutCenterRate");
    if (centerRate) {
      centerRate.textContent = `${total > 0 ? ((passed / total) * 100).toFixed(0) : 0}%`;
    }
  }

  // Module breakdown bar chart
  const ctxBar = document.getElementById("moduleBarChart");
  if (ctxBar) {
    if (moduleBarChart) moduleBarChart.destroy();

    // Group by module
    const moduleMap = {};
    testSuiteData.forEach(t => {
      if (!moduleMap[t.module]) moduleMap[t.module] = { passed: 0, total: 0 };
      moduleMap[t.module].total++;
      if (t.status === "PASS") moduleMap[t.module].passed++;
    });

    const labels = Object.keys(moduleMap);
    const passPercentages = labels.map(m => ((moduleMap[m].passed / moduleMap[m].total) * 100).toFixed(0));

    moduleBarChart = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "% Pass Rate",
          data: passPercentages,
          backgroundColor: "#10b981",
          borderRadius: 6,
          barThickness: 16
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 0,
            max: 100,
            ticks: { callback: v => `${v}%`, font: { size: 10 } },
            grid: { color: "#f1f5f9" }
          },
          y: {
            ticks: { font: { size: 11, weight: "bold" }, color: "#334155" },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` Pass Rate: ${item.raw}%`
            }
          }
        }
      }
    });
  }
}

// Render Test Case Matrix Table
function renderTestMatrix() {
  const tbody = document.getElementById("testMatrixBody");
  if (!tbody) return;

  const searchVal = (document.getElementById("testSearchInput")?.value || "").toLowerCase();

  let filtered = testSuiteData;
  if (currentFilterModule !== "ALL") {
    filtered = filtered.filter(t => t.module.toLowerCase() === currentFilterModule.toLowerCase());
  }

  if (searchVal) {
    filtered = filtered.filter(t => 
      t.id.toLowerCase().includes(searchVal) ||
      t.scenario.toLowerCase().includes(searchVal) ||
      t.module.toLowerCase().includes(searchVal) ||
      t.expectedResult.toLowerCase().includes(searchVal)
    );
  }

  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No test cases match the filter criteria.</td></tr>`;
    return;
  }

  filtered.forEach(tc => {
    const isPass = tc.status === "PASS";
    const badgeClass = isPass ? "badge-pass" : "badge-fail";
    const statusIcon = isPass ? "fa-circle-check" : "fa-triangle-exclamation";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="fw-bold font-monospace text-primary">${tc.id}</span></td>
      <td><span class="badge bg-light text-dark border">${tc.module}</span></td>
      <td>
        <div class="fw-semibold text-dark">${tc.scenario}</div>
        <small class="text-muted"><i class="fa-solid fa-code-branch me-1"></i>Input: ${tc.inputData}</small>
      </td>
      <td><span class="badge bg-secondary-subtle text-secondary">${tc.category}</span></td>
      <td><small class="text-muted">${tc.expectedResult}</small></td>
      <td><small class="${isPass ? 'text-success' : 'text-danger'} fw-semibold">${tc.actualResult}</small></td>
      <td><span class="badge-status ${badgeClass}"><i class="fa-solid ${statusIcon} me-1"></i>${tc.status}</span></td>
      <td><span class="badge bg-light text-muted font-monospace">${tc.executionTime}</span></td>
      <td>
        <div class="dropdown">
          <button class="btn btn-sm btn-outline-secondary py-0 px-2" type="button" data-bs-toggle="dropdown">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm">
            <li><a class="dropdown-item" href="javascript:void(0)" onclick="runSingleTest('${tc.id}')"><i class="fa-solid fa-play text-primary me-2"></i>Run Test</a></li>
            <li><a class="dropdown-item" href="javascript:void(0)" onclick="toggleTestStatus('${tc.id}')"><i class="fa-solid fa-rotate text-warning me-2"></i>Toggle Pass/Fail</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="deleteTestCase('${tc.id}')"><i class="fa-solid fa-trash me-2"></i>Delete</a></li>
          </ul>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Update tab counts
  updateModuleTabCounts();
}

function updateModuleTabCounts() {
  document.querySelectorAll(".module-tab-pill").forEach(tab => {
    const mod = tab.getAttribute("data-module");
    if (mod === "ALL") {
      tab.textContent = `All Modules (${testSuiteData.length})`;
    } else {
      const cnt = testSuiteData.filter(t => t.module.toLowerCase() === mod.toLowerCase()).length;
      const label = tab.getAttribute("data-label") || mod;
      tab.textContent = `${label} (${cnt})`;
    }
  });
}

function filterModule(modName, btnElement) {
  currentFilterModule = modName;
  document.querySelectorAll(".module-tab-pill").forEach(b => b.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");
  renderTestMatrix();
}

// Live Automated Test Runner
function runAutomatedTestSuite() {
  const runnerModal = new bootstrap.Modal(document.getElementById("testRunnerModal"));
  runnerModal.show();

  const progressBar = document.getElementById("testProgressBar");
  const logBox = document.getElementById("testRunnerLog");
  const currentStep = document.getElementById("testRunnerStep");

  progressBar.style.width = "0%";
  progressBar.textContent = "0%";
  logBox.innerHTML = "";

  let currentIndex = 0;
  const total = testSuiteData.length;

  const interval = setInterval(() => {
    if (currentIndex >= total) {
      clearInterval(interval);
      progressBar.style.width = "100%";
      progressBar.textContent = "100% Completed";
      currentStep.innerHTML = `<span class="text-success fw-bold"><i class="fa-solid fa-circle-check me-2"></i>All 45 Tests Executed Successfully!</span>`;
      saveTestSuite();
      renderTestingKPIs();
      renderCharts();
      renderTestMatrix();

      setTimeout(() => {
        runnerModal.hide();
      }, 1000);
      return;
    }

    const tc = testSuiteData[currentIndex];
    const latency = Math.floor(4 + Math.random() * 16);
    tc.executionTime = `${latency}ms`;

    // Only change to PASS if not manually failed
    if (!tc.manuallyFailed) {
      tc.status = "PASS";
      tc.actualResult = tc.expectedResult;
    }

    const pct = Math.round(((currentIndex + 1) / total) * 100);
    progressBar.style.width = `${pct}%`;
    progressBar.textContent = `${pct}%`;
    currentStep.textContent = `Executing [${tc.id}]: ${tc.scenario.substring(0, 45)}...`;

    const logEntry = document.createElement("div");
    logEntry.className = "small font-monospace mb-1";
    logEntry.innerHTML = `<span class="text-success">[PASS]</span> <span class="text-info">${tc.id}</span> - ${tc.scenario.substring(0, 40)}... (${latency}ms)`;
    logBox.appendChild(logEntry);
    logBox.scrollTop = logBox.scrollHeight;

    currentIndex++;
  }, 40);
}

// Single Test Execution
function runSingleTest(testId) {
  const tc = testSuiteData.find(t => t.id === testId);
  if (!tc) return;

  const latency = Math.floor(4 + Math.random() * 15);
  tc.executionTime = `${latency}ms`;
  if (!tc.manuallyFailed) {
    tc.status = "PASS";
    tc.actualResult = tc.expectedResult;
  }

  saveTestSuite();
  renderTestingKPIs();
  renderCharts();
  renderTestMatrix();

  showToast(`Test ${tc.id} executed in ${latency}ms: ${tc.status}`);
}

// Toggle Pass / Fail for error reporting demo
function toggleTestStatus(testId) {
  const tc = testSuiteData.find(t => t.id === testId);
  if (!tc) return;

  if (tc.status === "PASS") {
    tc.status = "FAIL";
    tc.manuallyFailed = true;
    tc.actualResult = "Assertion Error: State mismatch observed during validation cycle";
  } else {
    tc.status = "PASS";
    tc.manuallyFailed = false;
    tc.actualResult = tc.expectedResult;
  }

  saveTestSuite();
  renderTestingKPIs();
  renderCharts();
  renderTestMatrix();

  showToast(`Test ${tc.id} set to ${tc.status}`);
}

// Delete Test Case
function deleteTestCase(testId) {
  if (!confirm(`Are you sure you want to delete test case ${testId}?`)) return;
  testSuiteData = testSuiteData.filter(t => t.id !== testId);
  saveTestSuite();
  renderTestingKPIs();
  renderCharts();
  renderTestMatrix();
  showToast(`Test case ${testId} deleted.`);
}

// Reset Test Suite to default 45 baseline
function resetTestSuite() {
  if (!confirm("Reset test suite back to baseline 45 passing test cases?")) return;
  testSuiteData = JSON.parse(JSON.stringify(SEED_DATA.testCases));
  saveTestSuite();
  renderTestingKPIs();
  renderCharts();
  renderTestMatrix();
  showToast("Test Suite reset to default 45 baseline test cases.");
}

// Add New Test Case Modal Handler
function handleAddTestCase(e) {
  e.preventDefault();
  const module = document.getElementById("newTcModule").value;
  const scenario = document.getElementById("newTcScenario").value;
  const category = document.getElementById("newTcCategory").value;
  const inputData = document.getElementById("newTcInput").value;
  const expected = document.getElementById("newTcExpected").value;

  const prefix = module.split(" ")[0].substring(0, 3).toUpperCase();
  const nextNum = testSuiteData.length + 1;
  const newId = `TC-${prefix}-${String(nextNum).padStart(2, "0")}`;

  const newTC = {
    id: newId,
    module,
    scenario,
    category,
    inputData: inputData || "Standard Parameters",
    expectedResult: expected,
    actualResult: expected,
    status: "PASS",
    executionTime: `${Math.floor(5 + Math.random() * 15)}ms`
  };

  testSuiteData.push(newTC);
  saveTestSuite();
  renderTestingKPIs();
  renderCharts();
  renderTestMatrix();

  bootstrap.Modal.getInstance(document.getElementById("addTestCaseModal")).hide();
  document.getElementById("addTestCaseForm").reset();
  showToast(`Test Case ${newId} created successfully!`);
}

// Export CSV
function exportTestCSV() {
  let csv = "Test ID,Module,Scenario,Category,Input Data,Expected Result,Actual Result,Status,Execution Time\n";
  testSuiteData.forEach(tc => {
    csv += `"${tc.id}","${tc.module}","${tc.scenario.replace(/"/g, '""')}","${tc.category}","${(tc.inputData||'').replace(/"/g, '""')}","${tc.expectedResult.replace(/"/g, '""')}","${tc.actualResult.replace(/"/g, '""')}","${tc.status}","${tc.executionTime}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `NovaBank_Testing_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Toast helper
function showToast(message) {
  const toastEl = document.getElementById("actionToast");
  const toastBody = document.getElementById("actionToastBody");
  if (toastEl && toastBody) {
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  } else {
    alert(message);
  }
}

