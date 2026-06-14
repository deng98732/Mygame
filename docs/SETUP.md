# 设置指南

## 环境要求

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0 或 yarn >= 1.22.0
- **MongoDB**: >= 4.0
- **操作系统**: Windows, macOS, Linux

## 后端设置

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 服务器端口
PORT=5000

# MongoDB 连接字符串
MONGODB_URI=mongodb://localhost:27017/werewolf-game

# JWT 密钥（生成一个随机字符串）
JWT_SECRET=your_super_secret_key_here_change_me

# 环境
NODE_ENV=development

# 前端地址（用于 CORS）
CLIENT_URL=http://localhost:3000
```

### 3. 启动 MongoDB

#### macOS (使用 Homebrew)
```bash
brew services start mongodb-community
```

#### Windows
```bash
net start MongoDB
```

#### Linux
```bash
sudo systemctl start mongod
```

或使用 Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. 启动后端服务

```bash
npm run dev
```

输出示例：
```
🎮 服务器运行在端口 5000
MongoDB 连接成功
```

## 前端设置

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

Create `.env.local` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. 启动开发服务器

```bash
npm start
```

自动打开 http://localhost:3000

## 完整启动流程

### 终端 1 - 启动 MongoDB
```bash
# 如果使用 Docker
docker run -d -p 27017:27017 --name werewolf-mongo mongo:latest
```

### 终端 2 - 启动后端
```bash
cd backend
npm install  # 首次运行
npm run dev
```

### 终端 3 - 启动前端
```bash
cd frontend
npm install  # 首次运行
npm start
```

## 生产环境部署

### 后端部署

```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

### 前端构建

```bash
cd frontend
npm run build
```

构建的文件将在 `build/` 目录中。

## 常见问题排查

### 问题：MongoDB 连接失败

**检查清单：**
- MongoDB 服务是否正在运行？
- `.env` 中的 MONGODB_URI 是否正确？
- 防火墙是否阻止了 27017 端口？

**解决方案：**
```bash
# 测试 MongoDB 连接
mongosh mongodb://localhost:27017/werewolf-game
```

### 问题：端口已被占用

**macOS/Linux：**
```bash
# 查找占用 5000 端口的进程
lsof -i :5000

# 杀死进程
kill -9 <PID>
```

**Windows：**
```bash
# 查找占用 5000 端口的进程
netstat -ano | findstr :5000

# 杀死进程
taskkill /PID <PID> /F
```

### 问题：前端无法连接后端

**检查：**
1. 后端是否正在运行？
2. `.env.local` 中的 URL 是否正确？
3. CORS 是否已启用？

**检查浏览器控制台**：
```
打开 DevTools (F12) → Console 标签
查找 CORS 或连接错误信息
```

### 问题：WebSocket 连接失败

**可能原因：**
- 防火墙阻止了 WebSocket
- Socket.io 路径不正确

**解决方案：**
```bash
# 检查 Socket.io 是否正常工作
# 访问 http://localhost:5000/socket.io/
# 应该返回 WebSocket 连接端点信息
```

## 性能优化

### 前端
- 代码分割：使用 React.lazy() 和 Suspense
- 图片优化：使用适当的格式和尺寸
- 缓存：配置浏览器缓存策略

### 后端
- 数据库索引：为频繁查询的字段建立索引
- 查询优化：使用投影(projection)减少数据传输
- 连接池：配置 MongoDB 连接池

## 监控和日志

### 查看后端日志
```bash
# 使用 Winston 或其他日志库
# 日志会打印到控制台和文件
```

### 查看前端性能
```bash
# Chrome DevTools → Performance 标签
# 记录性能数据
```

## 下一步

- 查看 [API 文档](./API.md)
- 阅读 [游戏规则](./GAMEPLAY.md)
- 查看主 [README](../README.md)
