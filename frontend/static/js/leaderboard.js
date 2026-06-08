import API from './api.js';
import Storage from './storage.js';

const Leaderboard = {
    async init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="leaderboard-card card">
                <div class="leaderboard-header">
                    <h3 class="leaderboard-title">🏆 Top Testdrillers</h3>
                    <span class="badge badge--accent">Daily</span>
                </div>
                <div id="leaderboard-list" class="leaderboard-list">
                    <div class="leaderboard-loading">
                        <div class="spinner"></div>
                        <span>Fetching rankings...</span>
                    </div>
                </div>
                <div class="leaderboard-footer">
                    <p>Compete to reach the top!</p>
                </div>
            </div>
        `;

        this.render();
    },

    async render() {
        const listContainer = document.getElementById('leaderboard-list');
        if (!listContainer) return;

        try {
            const rankings = await API.getLeaderboard();
            const currentUserUuid = Storage.getPlayerUuid();

            if (!rankings || rankings.length === 0) {
                listContainer.innerHTML = `
                    <div class="leaderboard-empty">
                        <p>No rankings yet today.</p>
                        <p class="small">Be the first to master a question!</p>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = rankings.map((player, index) => {
                const isCurrentUser = currentUserUuid && player.user?.id === currentUserUuid;
                return `
                    <div class="leaderboard-item ${index < 3 ? 'top-rank' : ''} ${isCurrentUser ? 'current-user' : ''} animate-fade-in" style="animation-delay: ${index * 0.05}s">
                        <div class="leaderboard-rank">${index + 1}</div>
                        <div class="leaderboard-player">
                            <div class="player-name">${player.user?.name || 'Anonymous'} ${isCurrentUser ? '(You)' : ''}</div>
                        </div>
                        <div class="leaderboard-score">
                            <strong>${player.value}</strong>
                            <span>pts</span>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            listContainer.innerHTML = `
                <div class="leaderboard-error">
                    <p>Failed to load rankings.</p>
                </div>
            `;
        }
    }
};

export default Leaderboard;
