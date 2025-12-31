#!/bin/bash

# MongoDB Atlas 配置助手脚本
# 帮助用户快速配置 MongoDB Atlas 连接

echo "╔════════════════════════════════════════════════════════╗"
echo "║        MongoDB Atlas 配置助手                          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# 检查当前配置
CURRENT_MONGO_URI=$(grep "^MONGODB_URI=" server/.env 2>/dev/null | cut -d'=' -f2-)

echo "📍 当前配置状态："
echo "   MONGODB_URI: $CURRENT_MONGO_URI"
echo ""

if [[ "$CURRENT_MONGO_URI" == *"localhost"* ]]; then
    echo "⚠️  检测到本地 MongoDB 配置，但 VPS 无法运行本地 MongoDB"
    echo "   建议使用 MongoDB Atlas 云数据库（完全免费）"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 MongoDB Atlas 免费版设置步骤："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  访问 MongoDB Atlas"
echo "   https://www.mongodb.com/cloud/atlas/register"
echo ""
echo "2️⃣  创建免费账号并登录"
echo ""
echo "3️⃣  创建免费集群（Free Tier）"
echo "   - 选择 M0 Sandbox（永久免费）"
echo "   - 选择离你最近的服务器区域"
echo ""
echo "4️⃣  创建数据库用户"
echo "   - Database Access → Add New Database User"
echo "   - 设置用户名和密码（记住密码！）"
echo ""
echo "5️⃣  配置网络访问"
echo "   - Network Access → Add IP Address"
echo "   - 选择 \"Allow Access from Anywhere\" (0.0.0.0/0)"
echo ""
echo "6️⃣  获取连接字符串"
echo "   - Clusters → Connect → Connect your application"
echo "   - 选择 Node.js 驱动"
echo "   - 复制连接字符串（类似下面格式）"
echo ""
echo "   示例格式："
echo "   mongodb+srv://用户名:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "是否现在配置 MongoDB Atlas 连接字符串？(y/n): " -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "请粘贴您的 MongoDB Atlas 连接字符串："
    echo "（确保已将 <password> 替换为实际密码）"
    read -r MONGO_URI

    if [[ -z "$MONGO_URI" ]]; then
        echo "❌ 未输入连接字符串，退出配置"
        exit 1
    fi

    # 验证连接字符串格式
    if [[ ! "$MONGO_URI" =~ ^mongodb ]]; then
        echo "❌ 连接字符串格式不正确，应该以 mongodb:// 或 mongodb+srv:// 开头"
        exit 1
    fi

    # 更新 .env 文件
    if [ -f "server/.env" ]; then
        # 备份原文件
        cp server/.env server/.env.backup.$(date +%Y%m%d_%H%M%S)

        # 更新 MONGODB_URI
        sed -i "s|^MONGODB_URI=.*|MONGODB_URI=$MONGO_URI|" server/.env

        echo "✅ MongoDB URI 已更新"
        echo "✅ 原配置已备份到 server/.env.backup.*"
    else
        echo "❌ 找不到 server/.env 文件"
        exit 1
    fi

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ 配置完成！"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "下一步："
    echo "1. 测试连接: cd server && npm run dev"
    echo "2. 如果连接成功，您将看到 '✓ MongoDB connected successfully'"
    echo ""

    read -p "是否现在测试连接？(y/n): " -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "正在测试 MongoDB 连接..."
        cd server
        timeout 30 npm run dev &
        SERVER_PID=$!

        sleep 5

        if ps -p $SERVER_PID > /dev/null; then
            echo ""
            echo "✅ 服务器正在运行！检查上方日志确认 MongoDB 连接状态"
            echo ""
            echo "按 Ctrl+C 停止服务器"
            wait $SERVER_PID
        else
            echo "❌ 服务器启动失败，请检查连接字符串和密码是否正确"
        fi
    fi
else
    echo "跳过配置。您可以手动编辑 server/.env 文件来配置 MongoDB URI"
    echo ""
    echo "编辑命令: nano server/.env"
    echo "或者: vi server/.env"
fi

echo ""
echo "💡 提示："
echo "   - MongoDB Atlas 免费版提供 512MB 存储空间"
echo "   - 完全够用于剪切板同步应用"
echo "   - 无需信用卡，永久免费"
echo ""
