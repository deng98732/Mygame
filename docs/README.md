# 🐺 狼人杀网页游戏

精美的在线多人狼人杀游戏，采用日式/二次元美学设计。

## ✨ 功能特性

### 核心功能
- ✅ **用户系统**：注册、登录、个人资料管理
- ✅ **房间系统**：创建房间、加入房间、房间管理
- ✅ **游戏逻辑**：
  - 白天投票淘汰
  - 夜晚身份技能使用
  - 自动角色分配
  - 胜负判定
- ✅ **实时通信**：WebSocket 实时聊天、通知和游戏状态同步
- ✅ **排行榜**：玩家排名、统计数据
- ✅ **游戏历史**：记录每局游戏结果

### 美学特性
- 🎨 深色渐变背景（深蓝/紫色主题）
- 🎭 二次元艺术风格UI设计
- ✨ 平滑动画和过渡效果
- 🌟 玻璃态效果和发光边框
- 📱 响应式设计（支持PC和移动设备）

## 🛠 技术栈

### 前端
```
React 18 + React Router v6
Tailwind CSS (样式框架)
Socket.io Client (实时通信)
Zustand (状态管理)
Axios (HTTP客户端)
Lucide React (图标库)
```

### 后端
```
Node.js + Express (Web框架)
Socket.io (实时通信)
MongoDB + Mongoose (数据库)
JWT (身份验证)
Bcryptjs (密码加密)
```

## 📁 项目结构

```
Mygame/
├── frontend/                 # React 前端应用
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── LobbyPage.js
│   │   │   ├── GamePage.js
│   │   │   └── ProfilePage.js
│   │   ├── store/           # Zustand 状态管理
│   │   │   ├── authStore.js
│   │   │   └── gameStore.js
│   │   ├── services/        # API 和 Socket 服务
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.local
│
├── backend/                 # Node.js 后端应用
│   ├── models/              # 数据库模型
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Game.js
│   ├── routes/              # API 路由
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── rooms.js
│   │   └── games.js
│   ├── socket/              # WebSocket 事件处理
│   │   └── gameSocket.js
│   ├── middleware/          # 中间件
│   │   └── auth.js
│   ├── utils/               # 工具函数
│   │   └── gameLogic.js
│   ├── server.js            # 启动文件
│   ├── package.json
│   └── .env.example
│
├── docs/                    # 文档
│   ├── API.md              # API 文档
│   ├── SETUP.md            # 设置指南
│   └── GAMEPLAY.md         # 游戏规则
│
└── README.md
```

## 🚀 快速开始

### 前置要求
- Node.js >= 14.0.0
- MongoDB >= 4.0
- npm 或 yarn

### 后端启动

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env，设置 MongoDB 连接字符串和 JWT 密钥

# 启动开发服务器
npm run dev

# 输出: 🎮 服务器运行在端口 5000
```

### 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start

# 自动打开 http://localhost:3000
```

## 🎮 游戏规则

### 角色分配
- **狼人**：需要淘汰所有村民
- **村民**：需要找出并淘汰所有狼人
- **先知**：每晚可以查看一个玩家的身份
- **医生**：每晚可以保护一个玩家（可选）
- **猎人**：死亡时可以带走一个玩家（可选）

### 游戏流程

#### 白天阶段 ☀️
1. 所有活着的玩家进行讨论
2. 进行投票
3. 获票最多的玩家被淘汰

#### 夜晚阶段 🌙
1. **狼人**：选择要淘汰的村民
2. **先知**：选择要查看身份的玩家
3. **医生**：选择要保护的玩家
4. 黎明时宣布夜晚结果

#### 胜负条件
- **村民胜利**：所有狼人都被淘汰
- **狼人胜利**：狼人数量等于或多于村民数量

## 📚 API 文档

### 认证 API

#### 注册
```
POST /api/auth/register
{
  "username": "玩家名",
  "email": "邮箱",
  "password": "密码"
}
```

#### 登录
```
POST /api/auth/login
{
  "email": "邮箱",
  "password": "密码"
}
```

### 房间 API

#### 获取房间列表
```
GET /api/rooms
```

#### 创建房间
```
POST /api/rooms
Headers: Authorization: Bearer {token}
{
  "name": "房间名",
  "maxPlayers": 12,
  "password": "可选的房间密码"
}
```

#### 加入房间
```
POST /api/rooms/{roomId}/join
Headers: Authorization: Bearer {token}
```

#### 离开房间
```
POST /api/rooms/{roomId}/leave
Headers: Authorization: Bearer {token}
```

### WebSocket 事件

#### 客户端事件
- `user:login` - 用户登录
- `room:join` - 加入房间
- `room:leave` - 离开房间
- `game:start` - 开始游戏
- `game:vote` - 投票
- `chat:message` - 发送消息

#### 服务器事件
- `room:player-joined` - 玩家加入
- `room:player-left` - 玩家离开
- `game:started` - 游戏开始
- `game:phase-update` - 游戏阶段更新
- `chat:new-message` - 新消息
- `game:vote-received` - 投票已接收

## 🎨 设计特色

### 色彩方案
- **主色**：紫色系（#a855f7, #9333ea）
- **背景**：深蓝/深紫渐变
- **强调色**：粉色、绿色（按角色分类）

### 动画效果
- 页面切入：slideIn 动画
- 背景：pulse-glow 发光效果
- 按钮：悬停时上浮效果
- 卡片：边框发光过渡

## 🔐 安全特性

- ✅ JWT Token 身份验证
- ✅ Bcrypt 密码加密
- ✅ CORS 跨域保护
- ✅ 输入验证和清理
- ✅ 错误处理机制

## 📊 数据库设计

### User（用户）
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  avatar: String,
  stats: {
    totalGames: Number,
    wins: Number,
    losses: Number,
    winRate: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Room（房间）
```javascript
{
  name: String,
  host: ObjectId (User),
  maxPlayers: Number,
  players: [ObjectId],
  status: Enum(['waiting', 'playing', 'finished']),
  currentGame: ObjectId (Game),
  password: String,
  isPrivate: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Game（游戏）
```javascript
{
  room: ObjectId (Room),
  players: [{
    user: ObjectId,
    role: String,
    isAlive: Boolean,
    votedFor: ObjectId
  }],
  phase: Enum(['day', 'night', 'voting', 'result']),
  phaseNumber: Number,
  winner: Enum(['villagers', 'werewolves']),
  chatHistory: [{...}],
  createdAt: Date,
  endedAt: Date
}
```

## 🐛 常见问题

### Q: MongoDB 连接失败？
A: 确保 MongoDB 服务已启动，检查 `.env` 中的 MONGODB_URI 是否正确。

### Q: 前端无法连接后端？
A: 检查 `.env.local` 中的 API URL，确保后端服务已启动在 5000 端口。

### Q: WebSocket 连接超时？
A: 检查防火墙设置，确保 5000 端口未被阻止。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👤 作者

**deng98732**

---

🎉 **祝你游戏愉快！** 🎉

有问题或建议？欢迎提交 Issue 或联系作者！
