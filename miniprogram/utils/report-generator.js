/**
 * 生成12123举报包
 */

function generateReportPackage(clipData, mark, violationType) {
  const videoClip = {
    originalFile: mark.videoFile,
    clipStart: clipData.clipStart,
    clipEnd: clipData.clipEnd,
    roadName: mark.roadName,
    gps: mark.gps
  };

  const info = {
    reportId: generateUUID(),
    violationType: violationType,
    occurredAt: mark.timestamp,
    roadName: mark.roadName,
    gps: mark.gps,
    clipStart: clipData.clipStart,
    clipEnd: clipData.clipEnd,
    generatedAt: new Date().toISOString()
  };

  return {
    videoClip,
    info
  };
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

module.exports = {
  generateReportPackage,
  formatTime
};
