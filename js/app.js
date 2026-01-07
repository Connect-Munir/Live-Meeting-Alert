/**
 * Live Meeting Alert - Application Logic
 * Glassmorphism Dark Theme
 */

// =============================================
// State Management
// =============================================

let meetings = JSON.parse(localStorage.getItem('meetings')) || [];
let editingId = null;

// =============================================
// DOM Elements
// =============================================

const meetingForm = document.getElementById('meetingForm');
const editForm = document.getElementById('editForm');
const editModal = document.getElementById('editModal');

// =============================================
// Event Listeners
// =============================================

// Add Meeting
meetingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const meeting = {
        id: Date.now(),
        name: document.getElementById('meetingName').value,
        time: document.getElementById('meetingTime').value,
        link: document.getElementById('meetingLink').value,
    };
    meetings.push(meeting);
    saveMeetings();
    meetingForm.reset();
    renderMeetings();
});

// Edit Meeting
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const meeting = meetings.find(m => m.id === editingId);
    if (meeting) {
        meeting.name = document.getElementById('editName').value;
        meeting.time = document.getElementById('editTime').value;
        meeting.link = document.getElementById('editLink').value;
        saveMeetings();
        renderMeetings();
        closeEditModal();
    }
});

// Close modal when clicking outside
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !editModal.classList.contains('hidden')) {
        closeEditModal();
    }
});

// =============================================
// Storage Functions
// =============================================

function saveMeetings() {
    localStorage.setItem('meetings', JSON.stringify(meetings));
}

// =============================================
// Modal Functions
// =============================================

function openEditModal(id) {
    editingId = id;
    const meeting = meetings.find(m => m.id === id);
    if (meeting) {
        document.getElementById('editName').value = meeting.name;
        document.getElementById('editTime').value = meeting.time;
        document.getElementById('editLink').value = meeting.link;
        editModal.classList.remove('hidden');
    }
}

function closeEditModal() {
    editModal.classList.add('hidden');
    editingId = null;
}

// Make functions available globally for onclick handlers
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;

// =============================================
// Meeting CRUD Operations
// =============================================

function deleteMeeting(id) {
    if (confirm('Are you sure you want to delete this meeting?')) {
        meetings = meetings.filter(m => m.id !== id);
        saveMeetings();
        renderMeetings();
    }
}

// Make deleteMeeting available globally
window.deleteMeeting = deleteMeeting;

// =============================================
// Utility Functions
// =============================================

function getStatus(meetingTime) {
    const now = new Date();
    const meetingDate = new Date(meetingTime);
    const diffMs = meetingDate - now;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 0 && diffMins > -60) {
        return 'live';
    } else if (diffMins >= 0) {
        return 'upcoming';
    } else {
        return 'past';
    }
}

function isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// =============================================
// Card Template
// =============================================

function createMeetingCard(meeting) {
    const status = getStatus(meeting.time);
    const isLive = status === 'live';
    const isUpcoming = status === 'upcoming';

    const tagConfig = isLive ? {
        bg: 'bg-red-500/20',
        border: 'border-red-500/40',
        text: 'text-red-300',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
    } : isUpcoming ? {
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/40',
        text: 'text-amber-300',
        glow: ''
    } : {
        bg: 'bg-white/5',
        border: 'border-white/10',
        text: 'text-white/50',
        glow: ''
    };

    const tagText = isLive ? 'LIVE' : isUpcoming ? 'UPCOMING' : 'PAST';

    return `
        <div class="fade-in glass-card rounded-2xl p-6 ${isLive ? 'ring-1 ring-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : ''}">
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-semibold text-white flex-1 pr-3">${escapeHtml(meeting.name)}</h3>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium ${tagConfig.bg} ${tagConfig.text} border ${tagConfig.border} ${tagConfig.glow}">
                    ${isLive ? '<span class="flex w-2 h-2 bg-red-500 rounded-full mr-2 live-indicator"></span>' : ''}
                    ${tagText}
                </span>
            </div>
            <div class="flex items-center text-white/50 text-sm mb-5 font-mono">
                <svg class="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                ${formatTime(meeting.time)}
            </div>
            <div class="flex gap-2">
                <a href="${escapeHtml(meeting.link)}" target="_blank" rel="noopener noreferrer" class="btn-glow flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white rounded-xl">
                    <span class="relative z-10 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        Join Meeting
                    </span>
                </a>
                <button type="button" onclick="openEditModal(${meeting.id})" class="inline-flex items-center justify-center w-10 h-10 text-white/50 hover:text-cyan-400 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 rounded-xl transition-all" title="Edit">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </button>
                <button type="button" onclick="deleteMeeting(${meeting.id})" class="inline-flex items-center justify-center w-10 h-10 text-white/50 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl transition-all" title="Delete">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4v2h16V7h-3z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// =============================================
// Security Helper
// =============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================
// Empty State Template
// =============================================

function createEmptyState(icon, title, subtitle) {
    return `
        <div class="glass-card rounded-2xl p-8 text-center md:col-span-2 lg:col-span-3">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg class="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${icon}
                </svg>
            </div>
            <p class="text-white/40 font-medium">${title}</p>
            <p class="text-white/20 text-sm mt-1">${subtitle}</p>
        </div>
    `;
}

// =============================================
// Render Function
// =============================================

function renderMeetings() {
    const live = meetings.filter(m => getStatus(m.time) === 'live');
    const today = meetings.filter(m => isToday(m.time) && getStatus(m.time) !== 'past');
    const all = meetings.filter(m => getStatus(m.time) !== 'past');

    // Live Now
    const liveNowDiv = document.getElementById('liveNow');
    liveNowDiv.innerHTML = live.length > 0
        ? live.map(m => createMeetingCard(m)).join('')
        : createEmptyState(
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>',
            'No live meetings right now',
            'Meetings will appear here when they go live'
        );

    // Today Meetings
    const todayDiv = document.getElementById('todayMeetings');
    document.getElementById('todayCount').textContent = today.length;
    todayDiv.innerHTML = today.length > 0
        ? today.map(m => createMeetingCard(m)).join('')
        : createEmptyState(
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>',
            'No meetings scheduled for today',
            'Add a meeting above to get started'
        );

    // All Meetings
    const allDiv = document.getElementById('allMeetings');
    document.getElementById('allCount').textContent = all.length;
    allDiv.innerHTML = all.length > 0
        ? all.map(m => createMeetingCard(m)).join('')
        : createEmptyState(
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
            'No meetings added yet',
            'Schedule your first meeting to see it here'
        );
}

// =============================================
// Initialize Application
// =============================================

// Initial render
renderMeetings();

// Re-render every minute to update meeting status
setInterval(renderMeetings, 60000);
