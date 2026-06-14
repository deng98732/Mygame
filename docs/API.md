# API 文档

## 基础信息

- **基础URL**: `http://localhost:5000/api`
- **认证方式**: JWT Token (Bearer Token)
- **响应格式**: JSON
- **错误处理**: 返回相应的 HTTP 状态码和错误信息

## 认证 API

### 用户注册

```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**请求参数：**
- `username` (string, required): 用户名，长度 >= 3
- `email` (string, required): 邮箱地址
- `password` (string, required): 密码，长度 >= 6

**响应示例 (201):**
```json
{
  "message": "注册成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "player123",
    "email": "player@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=..."
  }
}
```

**错误响应 (400):**
```json
{
  "message": "用户已存在"
}
```

### 用户登录

```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

**请求参数：**
- `email` (string, required): 邮箱地址
- `password` (string, required): 密码

**响应示例 (200):**
```json
{
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "player123",
    "email": "player@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=...",
    "stats": {
      "totalGames": 10,
      "wins": 6,
      "losses": 4,
      "winRate": 0.6
    }
  }
}
```

**错误响应 (401):**
```json
{
  "message": "邮箱或密码错误"
}
```

## 用户 API

### 获取用户信息

```http
GET /users/:userId
```

**参数：**
- `userId` (string, required): 用户ID

**响应示例 (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "player123",
  "email": "player@example.com",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=...",
  "stats": {
    "totalGames": 10,
    "wins": 6,
    "losses": 4,
    "winRate": 0.6
  },
  "createdAt": "2026-06-14T12:00:00Z",
  "updatedAt": "2026-06-14T12:30:00Z"
}
```

### 更新用户信息

```http
PUT /users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",
  "avatar": "string"
}
```

**需要认证**: ✅

**请求参数：**
- `username` (string, optional): 新用户名
- `avatar` (string, optional): 新头像URL

**响应示例 (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "newname",
  "email": "player@example.com",
  "avatar": "https://new-avatar-url.com/...",
  "stats": {...},
  "updatedAt": "2026-06-14T12:35:00Z"
}
```

### 获取排行榜

```http
GET /users/leaderboard/top
```

**响应示例 (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "topplayer",
    "avatar": "https://...",
    "stats": {
      "totalGames": 50,
      "wins": 40,
      "losses": 10,
      "winRate": 0.8
    }
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "secondplace",
    "avatar": "https://...",
    "stats": {
      "totalGames": 45,
      "wins": 35,
      "losses": 10,
      "winRate": 0.777
    }
  }
]
```

## 房间 API

### 获取房间列表

```http
GET /rooms
```

**查询参数：**
- `status` (string, optional): 房间状态 (waiting|playing|finished)

**响应示例 (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "欢乐狼人杀",
    "host": {
      "_id": "507f1f77bcf86cd799439001",
      "username": "host_user",
      "avatar": "https://..."
    },
    "maxPlayers": 12,
    "players": [
      {
        "_id": "507f1f77bcf86cd799439001",
        "username": "player1",
        "avatar": "https://..."
      }
    ],
    "status": "waiting",
    "isPrivate": false,
    "createdAt": "2026-06-14T12:00:00Z"
  }
]
```

### 创建房间

```http
POST /rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "maxPlayers": "number",
  "password": "string (optional)"
}
```

**需要认证**: ✅

**请求参数：**
- `name` (string, required): 房间名称
- `maxPlayers` (number, required): 最大玩家数 (4-20)
- `password` (string, optional): 房间密码

**响应示例 (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "我的房间",
  "host": {
    "_id": "507f1f77bcf86cd799439001",
    "username": "host_user",
    "avatar": "https://..."
  },
  "maxPlayers": 12,
  "players": ["507f1f77bcf86cd799439001"],
  "status": "waiting",
  "isPrivate": false,
  "createdAt": "2026-06-14T12:00:00Z"
}
```

### 获取房间详情

```http
GET /rooms/:roomId
```

**参数：**
- `roomId` (string, required): 房间ID

**响应示例 (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "欢乐狼人杀",
  "host": {...},
  "maxPlayers": 12,
  "players": [...],
  "status": "waiting",
  "currentGame": null,
  "isPrivate": false,
  "createdAt": "2026-06-14T12:00:00Z"
}
```

### 加入房间

```http
POST /rooms/:roomId/join
Authorization: Bearer <token>
```

**需要认证**: ✅

**参数：**
- `roomId` (string, required): 房间ID

**响应示例 (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "欢乐狼人杀",
  "host": {...},
  "maxPlayers": 12,
  "players": [
    {...},
    {
      "_id": "507f1f77bcf86cd799439002",
      "username": "newplayer",
      "avatar": "https://..."
    }
  ],
  "status": "waiting"
}
```

**错误响应 (400):**
```json
{
  "message": "房间已满"
}
```

### 离开房间

```http
POST /rooms/:roomId/leave
Authorization: Bearer <token>
```

**需要认证**: ✅

**响应示例 (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "欢乐狼人杀",
  "host": {...},
  "maxPlayers": 12,
  "players": [...],
  "status": "waiting"
}
```

## 游戏 API

### 获取游戏历史

```http
GET /games/history/:userId
```

**参数：**
- `userId` (string, required): 用户ID

**查询参数：**
- `limit` (number, optional): 返回记录数限制，默认 20

**响应示例 (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "room": {
      "_id": "507f1f77bcf86cd799439001",
      "name": "欢乐狼人杀"
    },
    "phaseNumber": 4,
    "winner": "villagers",
    "players": [
      {
        "user": "507f1f77bcf86cd799439002",
        "role": "werewolf",
        "isAlive": false
      }
    ],
    "createdAt": "2026-06-14T12:00:00Z",
    "endedAt": "2026-06-14T12:30:00Z"
  }
]
```

### 获取游戏详情

```http
GET /games/:gameId
```

**参数：**
- `gameId` (string, required): 游戏ID

**响应示例 (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "room": {...},
  "players": [...],
  "phase": "day",
  "phaseNumber": 2,
  "winner": "none",
  "chatHistory": [
    {
      "user": "507f1f77bcf86cd799439002",
      "message": "我觉得他是狼人",
      "timestamp": "2026-06-14T12:00:00Z",
      "phase": "day"
    }
  ],
  "createdAt": "2026-06-14T12:00:00Z"
}
```

## WebSocket 事件

### 客户端事件（发送）

#### user:login
```javascript
socket.emit('user:login', userId);
```

#### room:join
```javascript
socket.emit('room:join', {
  roomId: '507f1f77bcf86cd799439011',
  userId: '507f1f77bcf86cd799439002'
});
```

#### room:leave
```javascript
socket.emit('room:leave', {
  roomId: '507f1f77bcf86cd799439011',
  userId: '507f1f77bcf86cd799439002'
});
```

#### game:start
```javascript
socket.emit('game:start', {
  roomId: '507f1f77bcf86cd799439011'
});
```

#### game:vote
```javascript
socket.emit('game:vote', {
  gameId: '507f1f77bcf86cd799439011',
  voterId: '507f1f77bcf86cd799439002',
  votedForId: '507f1f77bcf86cd799439003'
});
```

#### chat:message
```javascript
socket.emit('chat:message', {
  roomId: '507f1f77bcf86cd799439011',
  gameId: '507f1f77bcf86cd799439011',
  message: '我的看法是...',
  phase: 'day'
});
```

### 服务器事件（接收）

#### room:player-joined
```javascript
socket.on('room:player-joined', (data) => {
  console.log('玩家加入:', data.userId);
});
```

#### room:player-left
```javascript
socket.on('room:player-left', (data) => {
  console.log('玩家离开:', data.userId);
});
```

#### game:started
```javascript
socket.on('game:started', (data) => {
  console.log('游戏开始');
  console.log('玩家及角色:', data.players);
});
```

#### game:phase-update
```javascript
socket.on('game:phase-update', (data) => {
  console.log('当前阶段:', data.phase);
  console.log('第几轮:', data.phaseNumber);
});
```

#### chat:new-message
```javascript
socket.on('chat:new-message', (data) => {
  console.log(`${data.userId}: ${data.message}`);
});
```

#### game:vote-received
```javascript
socket.on('game:vote-received', (data) => {
  console.log('投票已接收:', data.voterId);
});
```

## 错误代码

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权，需要登录或Token无效 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突（如用户已存在） |
| 500 | Server Error | 服务器错误 |

## 使用示例

### JavaScript/Fetch API

```javascript
// 注册
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'player123',
    email: 'player@example.com',
    password: 'password123'
  })
});
const data = await response.json();
console.log(data.token);
```

### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// 登录
const { data } = await api.post('/auth/login', {
  email: 'player@example.com',
  password: 'password123'
});

// 设置默认Token
api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

// 获取用户信息
const userResponse = await api.get(`/users/${data.user.id}`);
```

---

有问题？查看完整 [README](../README.md) 或提交 Issue。
