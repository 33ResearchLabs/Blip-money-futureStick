const WebSocket = require('ws');

let wss = null;

function init(server) {
  wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);
        // Handle ping
        if (data.type === 'ping') ws.send(JSON.stringify({ type: 'pong' }));
      } catch {}
    });
  });

  // Heartbeat every 30s
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  console.log('  🔌 WebSocket server ready on /ws');
}

// Broadcast to all connected clients
function broadcast(type, data) {
  if (!wss) return;
  const msg = JSON.stringify({ type, data, ts: Date.now() });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

// Specific broadcast helpers
const emit = {
  trendingUpdated: (stats) => broadcast('trending_updated', stats),
  clusterUpdated: (stats) => broadcast('clusters_updated', stats),
  queueUpdated: (stats) => broadcast('queue_updated', stats),
  workerCycleComplete: (report) => broadcast('worker_cycle', report),
  workerStatusChanged: (state) => broadcast('worker_status', state),
  newsRefreshed: (count) => broadcast('news_refreshed', { count }),
  socialRefreshed: (count) => broadcast('social_refreshed', { count }),
  performanceRecorded: (data) => broadcast('performance_recorded', data),
  contentGenerated: (data) => broadcast('content_generated', data),
};

module.exports = { init, broadcast, emit };
