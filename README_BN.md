# Zombie Arena FPS v13 — Multiplayer starter (বাংলা)

## কী আছে
- মূল v13 HTML গেমকে ভিত্তি করে আলাদা multiplayer build। Solo build আলাদা করে রাখো।
- Room code দিয়ে সর্বোচ্চ ৪ জনের room তৈরি/join।
- Co-op/PvP mode বেছে নেওয়ার UI।
- Match চলাকালে অন্য খেলোয়াড়ের অবস্থান ও দিক real-time-এ দেখা যায়।
- PvP mode-এ server-side approximate aim/range check দিয়ে ২০ damage-এর hit।
- Node.js + Socket.IO server; কোনো paid database দরকার নেই।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
এটি একটি **starter/prototype**, সম্পূর্ণ production multiplayer port নয়। মূল গেমের zombie AI, boss HP, wave progression, loot, coins, shop purchases এবং upgrades এখনও প্রতিটি player's browser-এ আলাদাভাবে চলে। তাই Co-op-এ একই room-এ খেলোয়াড়দের দেখা যাবে, কিন্তু একই zombie health/wave/loot shared নয়। PvP damage check-ও basic ray approximation; wall occlusion, lag compensation, anti-cheat, respawn/round rules নেই।

## নিজের কম্পিউটারে চালানো
1. Node.js LTS ইনস্টল করো: https://nodejs.org/
2. এই folder-এ terminal/command prompt খোলো।
3. চালাও: `npm install`
4. চালাও: `npm start`
5. browser-এ `http://localhost:10000` খোলো। Multiplayer-এর জন্য `file://` দিয়ে HTML খুলবে না; server URL ব্যবহার করবে।
6. একই Wi-Fi-তে পরীক্ষা করতে host computer-এর LAN IP-তে `http://YOUR-LAN-IP:10000` খুলো (firewall অনুমতি লাগতে পারে)।

## সম্পূর্ণ ফ্রিতে Render-এ deploy
1. GitHub-এ নতুন repository তৈরি করো।
2. এই folder-এর ফাইলগুলো repository-তে upload/push করো।
3. Render.com-এ account খুলে **New → Web Service** বেছে GitHub repository connect করো।
4. Runtime Node; Build command `npm install`; Start command `npm start`; plan `Free`। `render.yaml` blueprint-ও ব্যবহার করতে পারো।
5. Deploy শেষ হলে Render URL খোলো। URL বন্ধুদের পাঠাও। সবাই একই URL-এ ঢুকে Multiplayer → একজন Create room, অন্যরা code দিয়ে Join room করবে। Room creator Start match চাপবে।
6. Free service ১৫ মিনিট inbound HTTP/WebSocket activity না থাকলে sleep করতে পারে; পরেরবার জাগতে প্রায় এক মিনিট লাগতে পারে। Free tier production guarantee নয়।

## বন্ধুদের সঙ্গে খেলার ধাপ
1. সবাই Render URL খোলো।
2. নাম লিখে Multiplayer চাপো।
3. একজন Co-op বা PvP বেছে Create room চাপবে।
4. তৈরি হওয়া ৬ অক্ষরের code বন্ধুদের পাঠাও।
5. অন্যরা code লিখে Join room চাপবে। সর্বোচ্চ ৪ জন।
6. Room creator Start match চাপবে।
7. PvP-তে rifle/shotgun দিয়ে অন্য player-এর দিকে aim করে গুলি করো।

## নিরাপত্তা/খরচ
- কোডটি public hobby prototype; কোনো account/password বা payment তথ্য লাগবে না।
- Render Free ব্যবহার করলে hosting fee না-ও লাগতে পারে, কিন্তু free-tier limits/নীতিমালা পরিবর্তন হতে পারে। কোনো payment method যোগ করার আগে billing/usage settings পরীক্ষা করো।
- Public GitHub repository করলে source code সবার দেখা যাবে।
