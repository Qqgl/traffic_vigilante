module.exports = {
  tripId: 'trip-uuid-001',
  startTime: '2026-04-20T09:00:00',
  endTime: '2026-04-20T10:45:00',
  marks: [
    {
      timestamp: '2026-04-20T10:30:05',
      gps: { lat: 31.2304, lng: 121.4737 },
      roadName: '京沪高速上海方向',
      videoFile: 'record_001.mp4',
      offset: 5
    },
    {
      timestamp: '2026-04-20T10:35:20',
      gps: { lat: 31.2310, lng: 121.4740 },
      roadName: '京沪高速上海方向',
      videoFile: 'record_002.mp4',
      offset: 20
    }
  ],
  videoFiles: [
    { name: 'record_001.mp4', startTime: '2026-04-20T10:30:00', endTime: '2026-04-20T10:35:00' },
    { name: 'record_002.mp4', startTime: '2026-04-20T10:35:00', endTime: '2026-04-20T10:40:00' }
  ]
};