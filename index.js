const express = require('express');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🎵 SEPTORCH MUSIC API is running');
});

app.get('/api', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing ?q=song-name' });

  try {
    const search = await yts(q);
    const video = search.videos[0];
    if (!video) return res.status(404).json({ error: 'No results found' });

    const info = await ytdl.getInfo(video.url);

    const audioFormat = ytdl.chooseFormat(info.formats, {
      filter: 'audioonly',
      quality: 'highestaudio'
    });

    const videoFormat = ytdl.chooseFormat(info.formats, {
      filter: 'audioandvideo',
      quality: '18' // 360p MP4
    });

    res.json({
      title: video.title,
      duration: video.timestamp,
      thumbnail: video.thumbnail,
      url: video.url,
      mp3: audioFormat.url,
      mp4: videoFormat.url
    });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`SEPTORCH API is running on port ${PORT}`);
});
