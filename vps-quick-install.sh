#!/bin/bash

# VPS 快速安装脚本
# 适用于无法运行Docker的受限环境

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   ClipSync VPS 快速安装                ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

print_header

# 检查Node.js
if ! command -v node &> /dev/null; then
    print_error "未检测到 Node.js！"
    exit 1
fi
print_success "Node.js $(node -v)"

# 获取MongoDB连接字符串
echo ""
echo -e "${YELLOW}MongoDB 配置选项：${NC}"
echo "1. 使用 MongoDB Atlas (免费云数据库，推荐)"
echo "2. 使用自己的 MongoDB 服务器"
echo "3. 稍后手动配置"
echo ""
read -p "请选择 (1/2/3): " choice

MONGODB_URI="mongodb://localhost:27017/clipboard-sync"

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}MongoDB Atlas 配置步骤：${NC}"
        echo "1. 访问 https://www.mongodb.com/cloud/atlas/register"
        echo "2. 注册并创建免费 M0 集群"
        echo "3. 点击 'Connect' -> 'Drivers'"
        echo "4. 复制连接字符串"
        echo ""
        read -p "请粘贴 MongoDB Atlas 连接字符串: " atlas_uri
        if [ ! -z "$atlas_uri" ]; then
            MONGODB_URI="$atlas_uri"
        fi
        ;;
    2)
        echo ""
        read -p "请输入 MongoDB 连接字符串: " custom_uri
        if [ ! -z "$custom_uri" ]; then
            MONGODB_URI="$custom_uri"
        fi
        ;;
    3)
        print_info "稍后需要手动编辑 server/.env 文件"
        ;;
esac

# 安装后端依赖
print_info "安装后端依赖..."
cd server
npm install || {
    print_error "后端依赖安装失败"
    exit 1
}
print_success "后端依赖安装完成"

# 配置后端环境变量
if [ ! -f .env ]; then
    cp .env.example .env

    # 生成JWT密钥
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" .env

    # 设置MongoDB URI
    sed -i "s|mongodb://localhost:27017/clipboard-sync|$MONGODB_URI|" .env

    # 设置前端URL（如果有公网IP）
    echo ""
    read -p "请输入服务器公网IP或域名 (留空使用localhost): " server_ip
    if [ ! -z "$server_ip" ]; then
        sed -i "s|http://localhost:5173|http://$server_ip:5173|" .env
    fi

    print_success "后端环境配置完成"
else
    print_info "后端 .env 已存在，跳过"
fi

cd ..

# 安装前端依赖
print_info "安装前端依赖..."
cd client
npm install || {
    print_error "前端依赖安装失败"
    exit 1
}
print_success "前端依赖安装完成"

# 配置前端环境变量
if [ ! -f .env ]; then
    cp .env.example .env

    # 如果有公网IP，配置API地址
    if [ ! -z "$server_ip" ]; then
        sed -i "s|http://localhost:5000|http://$server_ip:5000|" .env
        sed -i "s|http://localhost:5000|http://$server_ip:5000|" .env
    fi

    print_success "前端环境配置完成"
else
    print_info "前端 .env 已存在，跳过"
fi

cd ..

# 创建启动脚本
cat > start-server.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/server"
echo "启动 ClipSync 后端服务..."
npm run dev
EOF

cat > start-client.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/client"
echo "启动 ClipSync 前端服务..."
npm run dev
EOF

chmod +x start-server.sh start-client.sh

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      ✓ 安装完成！                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}启动方式：${NC}"
echo ""
echo "方式一：使用启动脚本（推荐）"
echo "  后端: ./start-server.sh"
echo "  前端: ./start-client.sh  (新终端)"
echo ""
echo "方式二：手动启动"
echo "  后端: cd server && npm run dev"
echo "  前端: cd client && npm run dev  (新终端)"
echo ""
echo -e "${YELLOW}访问地址：${NC}"
if [ ! -z "$server_ip" ]; then
    echo "  http://$server_ip:5173"
else
    echo "  http://localhost:5173"
fi
echo ""
echo -e "${YELLOW}配置文件：${NC}"
echo "  后端: server/.env"
echo "  前端: client/.env"
echo ""
