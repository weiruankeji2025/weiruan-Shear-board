#!/bin/bash

# ClipSync 一键安装脚本
# 适用于 macOS 和 Linux

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印函数
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     ClipSync 安装脚本 v1.0             ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查必需软件
check_requirements() {
    print_info "检查系统环境..."

    # 检查 Node.js
    if ! command_exists node; then
        print_error "未检测到 Node.js！"
        echo "请访问 https://nodejs.org/ 下载安装"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 版本过低 (需要 >= 18)"
        exit 1
    fi
    print_success "Node.js $(node -v)"

    # 检查 npm
    if ! command_exists npm; then
        print_error "未检测到 npm！"
        exit 1
    fi
    print_success "npm $(npm -v)"

    # 检查 MongoDB 或 Docker
    if ! command_exists mongod && ! command_exists docker; then
        print_error "未检测到 MongoDB 或 Docker！"
        echo "请安装其中之一："
        echo "  MongoDB: https://www.mongodb.com/download-center/community"
        echo "  Docker: https://www.docker.com/products/docker-desktop"
        exit 1
    fi

    if command_exists docker; then
        print_success "Docker $(docker -v | cut -d' ' -f3 | cut -d',' -f1)"
    else
        print_success "MongoDB (本地安装)"
    fi
}

# 安装依赖
install_dependencies() {
    print_info "安装后端依赖..."
    cd server
    npm install || {
        print_error "后端依赖安装失败"
        exit 1
    }
    print_success "后端依赖安装完成"

    print_info "安装前端依赖..."
    cd ../client
    npm install || {
        print_error "前端依赖安装失败"
        exit 1
    }
    print_success "前端依赖安装完成"

    cd ..
}

# 配置环境变量
configure_env() {
    print_info "配置环境变量..."

    # 后端配置
    if [ ! -f server/.env ]; then
        cp server/.env.example server/.env

        # 生成随机 JWT 密钥
        if command_exists openssl; then
            JWT_SECRET=$(openssl rand -base64 32)
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" server/.env
            else
                sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" server/.env
            fi
        fi

        print_success "后端环境配置完成"
    else
        print_info "后端 .env 文件已存在，跳过"
    fi

    # 前端配置
    if [ ! -f client/.env ]; then
        cp client/.env.example client/.env
        print_success "前端环境配置完成"
    else
        print_info "前端 .env 文件已存在，跳过"
    fi
}

# 启动 MongoDB
start_mongodb() {
    print_info "启动 MongoDB..."

    if command_exists docker; then
        # 检查容器是否已存在
        if docker ps -a | grep -q mongodb; then
            if ! docker ps | grep -q mongodb; then
                docker start mongodb
            fi
            print_success "MongoDB 容器已启动"
        else
            docker run -d \
                --name mongodb \
                -p 27017:27017 \
                -v mongodb_data:/data/db \
                mongo:latest
            print_success "MongoDB 容器创建并启动"
        fi
    else
        # 本地 MongoDB
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew services start mongodb-community 2>/dev/null || true
        else
            sudo systemctl start mongod 2>/dev/null || true
        fi
        print_success "MongoDB 服务已启动"
    fi
}

# 创建启动脚本
create_start_scripts() {
    print_info "创建启动脚本..."

    # 创建启动脚本
    cat > start.sh << 'EOF'
#!/bin/bash

echo "启动 ClipSync..."

# 启动后端
cd server
npm run dev &
SERVER_PID=$!

# 等待后端启动
sleep 3

# 启动前端
cd ../client
npm run dev &
CLIENT_PID=$!

echo "✓ 后端运行在: http://localhost:5000"
echo "✓ 前端运行在: http://localhost:5173"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
wait
EOF

    chmod +x start.sh
    print_success "启动脚本创建完成 (./start.sh)"
}

# 主函数
main() {
    print_header

    # 检查是否在项目根目录
    if [ ! -d "server" ] || [ ! -d "client" ]; then
        print_error "请在项目根目录运行此脚本"
        exit 1
    fi

    check_requirements
    install_dependencies
    configure_env
    start_mongodb
    create_start_scripts

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║      安装完成！                         ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}下一步：${NC}"
    echo "  1. 启动应用: ./start.sh"
    echo "  2. 访问: http://localhost:5173"
    echo "  3. 注册账号并开始使用"
    echo ""
    echo -e "${YELLOW}手动启动：${NC}"
    echo "  后端: cd server && npm run dev"
    echo "  前端: cd client && npm run dev"
    echo ""
    echo -e "${YELLOW}配置 OAuth（可选）：${NC}"
    echo "  编辑 server/.env 添加 OAuth 凭据"
    echo "  详见: INSTALLATION.md"
    echo ""
}

main
