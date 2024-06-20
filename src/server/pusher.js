// server/pusher.js
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: '1822571',
  key: '1c63295fb2f1cc8e8963',
  secret: '898d38ee4bda16d380d6',
  cluster: 'us2',
  useTLS: true
});

export default pusher;
