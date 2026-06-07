import Storage from './storage.js';
import API from './api.js';

let allQuestions = [];
let currentSubject = '';

async function init() {
  try {
    allQuestions = await API.getQuestions();

    const subjectSelect = document.getElementById('analysis-subject-select');
    if (!subjectSelect) return;

    // Populate subject select
    allQuestions.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.subject;
      opt.textContent = s.subject;
      subjectSelect.appendChild(opt);
    });

    // Default to first subject or last used
    const lastSub = Storage.getSubject();
    const defaultSub = Array.isArray(lastSub) ? lastSub[0] : lastSub;

    if (defaultSub && allQuestions.some(s => s.subject === defaultSub)) {
      subjectSelect.value = defaultSub;
      currentSubject = defaultSub;
    } else if (allQuestions.length > 0) {
      currentSubject = allQuestions[0].subject;
      subjectSelect.value = currentSubject;
    }

    subjectSelect.onchange = (e) => {
      currentSubject = e.target.value;
      renderAnalysis();
    };

    renderAnalysis();
  } catch (err) {
    console.error('Failed to init analysis:', err);
  }
}

function renderAnalysis() {
  const subjectData = allQuestions.find(s => s.subject === currentSubject);
  if (!subjectData) return;

  const stats = Storage.getStats(currentSubject);

  // Total counts in the question bank
  const totalObj = subjectData.obj?.length || 0;
  const totalTheory = subjectData.theory?.length || 0;
  const totalInBank = totalObj + totalTheory;

  // Mastered / Failed from Storage
  const masteredObj = Storage.getMasteredObj(currentSubject).length;
  const masteredTheory = Storage.getMasteredTheory(currentSubject).length;
  const totalMastered = masteredObj + masteredTheory;

  const failedObj = Storage.getFailedObj(currentSubject).length;
  const failedTheory = Storage.getFailedTheory(currentSubject).length;
  const totalFailed = failedObj + failedTheory;

  // Update UI Stats
  document.getElementById('total-questions').textContent = totalInBank;
  document.getElementById('mastered-count').textContent = totalMastered;
  document.getElementById('failed-count').textContent = totalFailed;

  const completionPct = totalInBank > 0 ? Math.round((totalMastered / totalInBank) * 100) : 0;
  document.getElementById('mastery-pct').textContent = completionPct + '%';

  // Topic Level Analysis
  const topicMap = {};

  // Combine all questions to count totals per topic
  [...(subjectData.obj || []), ...(subjectData.theory || [])].forEach(q => {
    const t = q.topic || 'General';
    if (!topicMap[t]) {
      topicMap[t] = { total: 0, mastered: 0, failed: 0, unseen: 0 };
    }
    topicMap[t].total++;
  });

  // Count mastered per topic
  [...Storage.getMasteredObj(currentSubject), ...Storage.getMasteredTheory(currentSubject)].forEach(q => {
    const t = q.topic || 'General';
    if (topicMap[t]) topicMap[t].mastered++;
  });

  // Count failed per topic
  [...Storage.getFailedObj(currentSubject), ...Storage.getFailedTheory(currentSubject)].forEach(q => {
    const t = q.topic || 'General';
    if (topicMap[t]) topicMap[t].failed++;
  });

  // Derive unseen
  Object.keys(topicMap).forEach(t => {
    topicMap[t].unseen = topicMap[t].total - topicMap[t].mastered;
  });

  // Render Topic List
  const topicListEl = document.getElementById('topic-list');
  topicListEl.innerHTML = '';

  const sortedTopics = Object.entries(topicMap).sort((a, b) => b[1].total - a[1].total);

  sortedTopics.forEach(([name, data]) => {
    const pct = Math.round((data.mastered / data.total) * 100);
    const item = document.createElement('div');
    item.className = 'topic-item';
    item.innerHTML = `
      <div class="topic-header">
        <span class="topic-name">${name}</span>
        <span class="topic-count">${data.total} Questions</span>
      </div>
      <div class="topic-progress-bar">
        <div class="topic-progress-fill" style="width: ${pct}%"></div>
      </div>
      <div class="topic-stats">
        <span>${data.mastered} Mastered</span>
        <span>${data.unseen} Unseen</span>
        <span style="color: var(--fail)">${data.failed} Failed</span>
      </div>
    `;
    topicListEl.appendChild(item);
  });

  // Recommendations
  const recEl = document.getElementById('recommendations');
  if (completionPct === 100) {
    recEl.innerHTML = '<p>✨ You have mastered everything in this subject! Keep it fresh with regular reviews.</p>';
  } else {
    // Find topic with most unmastered
    const weakest = sortedTopics.filter(t => t[1].unseen > 0).sort((a, b) => b[1].unseen - a[1].unseen)[0];
    if (weakest) {
      recEl.innerHTML = `
        <p>You have <strong>${totalInBank - totalMastered}</strong> questions left to master.</p>
        <p style="margin-top: 12px;">Focus on <strong>${weakest[0]}</strong> next—it has the most unmastered questions (${weakest[1].unseen}).</p>
        <button class="btn btn--primary btn--sm" style="margin-top: 16px;" onclick="startFocusSession('${weakest[0]}')">
          Study ${weakest[0]} Now
        </button>
      `;
    } else {
      recEl.innerHTML = '<p>You are making great progress! Keep going through the remaining questions.</p>';
    }
  }

  // Priority Topics
  const priorityEl = document.getElementById('priority-topics');
  priorityEl.innerHTML = '';
  const priorities = sortedTopics
    .filter(t => t[1].unseen > 0)
    .sort((a, b) => b[1].unseen - a[1].unseen)
    .slice(0, 3);

  if (priorities.length === 0) {
    priorityEl.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">No priority topics! You are all set.</p>';
  }

  priorities.forEach(([name, data]) => {
    const div = document.createElement('div');
    div.className = 'priority-item';
    div.innerHTML = `
      <span class="priority-name">${name}</span>
      <span class="priority-badge">${data.unseen} Left</span>
    `;
    priorityEl.appendChild(div);
  });
}

window.startFocusSession = function(topic) {
  Storage.clearBatch();
  Storage.setFocusTopic(topic);
  const subjectData = allQuestions.find(s => s.subject === currentSubject);
  Storage.initSession([subjectData], 'both');
  window.location.href = '/study?mode=both';
};

init();
