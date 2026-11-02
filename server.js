const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }, pingInterval: 25000, pingTimeout: 20000 });
const PORT = process.env.PORT || 10000;
const rooms = new Map();
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function code(){let c;do{c='';for(let i=0;i<6;i++)c+=alphabet[Math.floor(Math.random()*alphabet.length)]}while(rooms.has(c));return c}
function publicPlayers(r){const o={};for(const [id,p] of r.players)o[id]={id,name:p.name,x:p.x,z:p.z,yaw:p.yaw,pitch:p.pitch,hp:p.hp};return o}
function emitRoom(r){io.to(r.code).emit('room-state',{code:r.code,mode:r.mode,players:publicPlayers(r),started:r.started})}
function remove(socket){const c=socket.data.room;if(!c)return;const r=rooms.get(c);if(!r)return;r.players.delete(socket.id);socket.leave(c);socket.data.room=null;if(!r.players.size)rooms.delete(c);else{io.to(c).emit('player-left',{id:socket.id});emitRoom(r)}}
function current(socket){const r=rooms.get(socket.data.room);return r&&r.players.has(socket.id)?r:null}
io.on('connection',socket=>{
 socket.on('create-room',d=>{remove(socket);const c=code();const mode=d&&d.mode==='pvp'?'pvp':'coop';const r={code:c,mode,host:socket.id,started:false,players:new Map()};r.players.set(socket.id,{id:socket.id,name:String(d?.name||'Player').slice(0,16),x:0,z:0,yaw:0,pitch:0,hp:100});rooms.set(c,r);socket.join(c);socket.data.room=c;socket.emit('room-created',{code:c,mode,players:publicPlayers(r)});emitRoom(r)});
 socket.on('join-room',d=>{const c=String(d?.code||'').toUpperCase();const r=rooms.get(c);if(!r)return socket.emit('room-error',{message:'এই code-এর room পাওয়া যায়নি।'});if(r.started)return socket.emit('room-error',{message:'এই match ইতিমধ্যে শুরু হয়েছে।'});if(r.players.size>=4)return socket.emit('room-error',{message:'Room full — সর্বোচ্চ ৪ জন।'});remove(socket);r.players.set(socket.id,{id:socket.id,name:String(d?.name||'Player').slice(0,16),x:Math.random()*4-2,z:Math.random()*4-2,yaw:0,pitch:0,hp:100});socket.join(c);socket.data.room=c;socket.emit('room-joined',{code:c,mode:r.mode,players:publicPlayers(r)});emitRoom(r)});
 socket.on('start-match',d=>{const r=current(socket);if(!r)return socket.emit('room-error',{message:'আগে room-এ ঢুকতে হবে।'});if(r.host!==socket.id)return socket.emit('room-error',{message:'শুধু room creator match শুরু করতে পারবে।'});r.started=true;for(const p of r.players.values())p.hp=100;io.to(r.code).emit('match-start',{code:r.code,mode:r.mode,players:publicPlayers(r)});emitRoom(r)});
 socket.on('player-state',d=>{const r=current(socket);if(!r||!r.started||!d)return;const p=r.players.get(socket.id);p.x=Number.isFinite(d.x)?Math.max(-450,Math.min(450,d.x)):p.x;p.z=Number.isFinite(d.z)?Math.max(-450,Math.min(450,d.z)):p.z;p.yaw=Number.isFinite(d.yaw)?d.yaw:p.yaw;p.pitch=Number.isFinite(d.pitch)?Math.max(-1.5,Math.min(1.5,d.pitch)):p.pitch;p.hp=Number.isFinite(d.hp)?Math.max(0,Math.min(10000,d.hp)):p.hp;p.name=String(d.name||p.name).slice(0,16);socket.to(r.code).volatile.emit('player-state',{id:socket.id,name:p.name,x:p.x,z:p.z,yaw:p.yaw,pitch:p.pitch,hp:p.hp})});
 socket.on('player-fire',d=>{const r=current(socket);if(!r||!r.started||r.mode!=='pvp'||!d)return;const shooter=r.players.get(socket.id);if(!shooter)return;const x=Number(d.x),z=Number(d.z),yaw=Number(d.yaw);if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(yaw))return;for(const [id,target] of r.players){if(id===socket.id||target.hp<=0)continue;const dx=target.x-x,dz=target.z-z,dist=Math.hypot(dx,dz);if(dist>90||dist<.1)continue;const aimX=-Math.sin(yaw),aimZ=-Math.cos(yaw),dot=(dx*aimX+dz*aimZ)/dist;const perp=Math.abs(dx*aimZ-dz*aimX);if(dot>.985&&perp<Math.max(.9,dist*.025)){target.hp=Math.max(0,target.hp-20);io.to(r.code).emit('pvp-hit',{shooter:socket.id,target:id,damage:20,hp:target.hp});io.to(id).emit('pvp-damage',{shooter:socket.id,target:id,damage:20,hp:target.hp});break}}});
 socket.on('leave-room',()=>remove(socket));socket.on('disconnect',()=>remove(socket));
});
app.get('/health',(req,res)=>res.json({ok:true,rooms:rooms.size}));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'Zombie_Arena_FPS_Multiplayer.html')));
app.use(express.static(__dirname));
server.listen(PORT,'0.0.0.0',()=>console.log(`Zombie Arena multiplayer server listening on ${PORT}`));
