#!/bin/bash

# ═══════════════════════════════════════════════════════════════
#  ClipSync VPS 一键安装脚本
#  适用于 Linux VPS 服务器快速部署
# ═══════════════════════════════════════════════════════════════

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$PROJECT_ROOT/server"
CLIENT_DIR="$PROJECT_ROOT/client"

# 打印函数
print_header() {
    clear
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                                                           ║${NC}"
    echo -e "${CYAN}║        🚀 ClipSync VPS 一键安装脚本 v2.0               ║${NC}"
    echo -e "${CYAN}║                                                           ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

# 检查系统环境
check_environment() {
    print_step "检查系统环境..."

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_error "未检测到 Node.js！"
        echo ""
        echo "请先安装 Node.js >= 18："
        echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
        echo "  sudo apt-get install -y nodejs"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 版本过低 (当前: v$NODE_VERSION, 需要: >= 18)"
        exit 1
    fi

    print_success "Node.js $(node -v)"

    # 检查 npm
    if ! command -v npm &> /dev/null; then
        print_error "未检测到 npm！"
        exit 1
    fi

    print_success "npm v$(npm -v)"

    # 检查磁盘空间
    AVAILABLE_SPACE=$(df -BG "$PROJECT_ROOT" | awk 'NR==2 {print $4}' | sed 's/G//')
    if [ "$AVAILABLE_SPACE" -lt 2 ]; then
        print_warning "磁盘空间不足 2GB，建议清理后再安装"
    fi

    echo ""
}

# MongoDB 配置向导
configure_mongodb() {
    print_step "配置 MongoDB 数据库..."
    echo ""

    echo -e "${CYAN}请选择 MongoDB 配置方式：${NC}"
    echo ""
    echo "  1) MongoDB Atlas 云数据库 (推荐，免费，无需本地安装)"
    echo "  2) 已有 MongoDB 服务器 (输入连接字符串)"
    echo "  3) 稍后手动配置"
    echo ""

    read -p "请选择 [1-3]: " mongodb_choice

    MONGODB_URI="mongodb://localhost:27017/clipboard-sync"

    case $mongodb_choice in
        1)
            echo ""
            echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
            echo -e "${YELLOW}  MongoDB Atlas 配置指南 (1分钟完成)${NC}"
            echo -e "${YELLOW}════════════════════════════════════════════════════${NC}"
            echo ""
            echo "步骤 1: 访问 https://www.mongodb.com/cloud/atlas/register"
            echo "步骤 2: 注册账号（可使用 Google 账号快速注册）"
            echo "步骤 3: 创建免费 M0 集群（512MB，永久免费）"
            echo "步骤 4: 选择最近的区域（推荐 AWS Singapore）"
            echo "步骤 5: 创建数据库用户（记住用户名和密码）"
            echo "步骤 6: 添加 IP 白名单（选择 'Allow Access from Anywhere' 或添加你的 IP）"
            echo "步骤 7: 点击 'Connect' → 'Drivers' → 复制连接字符串"
            echo ""
            echo -e "${CYAN}连接字符串格式示例：${NC}"
            echo "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/clipboard-sync"
            echo ""

            read -p "是否已完成 MongoDB Atlas 配置？[y/N]: " atlas_ready

            if [[ "$atlas_ready" =~ ^[Yy]$ ]]; then
                echo ""
                read -p "请粘贴 MongoDB Atlas 连接字符串: " atlas_uri

                if [ ! -z "$atlas_uri" ]; then
                    # 验证连接字符串格式
                    if [[ "$atlas_uri" =~ ^mongodb(\+srv)?:// ]]; then
                        MONGODB_URI="$atlas_uri"
                        print_success "MongoDB 连接字符串已设置"
                    else
                        print_warning "连接字符串格式可能不正确，但已保存"
                        MONGODB_URI="$atlas_uri"
                    fi
                else
                    print_warning "未输入连接字符串，使用默认配置（稍后需手动修改）"
                fi
            else
                print_warning "请稍后在 server/.env 中手动配置 MONGODB_URI"
            fi
            ;;

        2)
            echo ""
            read -p "请输入 MongoDB 连接字符串: " custom_uri

            if [ ! -z "$custom_uri" ]; then
                MONGODB_URI="$custom_uri"
                print_success "MongoDB 连接字符串已设置"
            else
                print_warning "未输入连接字符串，使用默认配置"
            fi
            ;;

        3)
            print_info "稍后请手动编辑 server/.env 文件配置 MONGODB_URI"
            ;;

        *)
            print_warning "无效选择，使用默认配置"
            ;;
    esac

    echo ""
}

# 获取服务器信息
get_server_info() {
    print_step "配置服务器访问地址..."
    echo ""

    # 尝试获取公网 IPv4 地址
    PUBLIC_IP=""
    PUBLIC_IP=$(curl -4 -s ifconfig.me 2>/dev/null || curl -4 -s icanhazip.com 2>/dev/null || curl -4 -s api.ipify.org 2>/dev/null || echo "")

    if [ ! -z "$PUBLIC_IP" ]; then
        echo -e "${CYAN}检测到服务器公网 IP: ${GREEN}$PUBLIC_IP${NC}"
        echo ""
        read -p "是否使用此 IP 作为访问地址？[Y/n]: " use_public_ip

        if [[ ! "$use_public_ip" =~ ^[Nn]$ ]]; then
            SERVER_HOST="$PUBLIC_IP"
            print_success "将使用公网 IP: $SERVER_HOST"
        else
            read -p "请输入自定义域名或 IP: " custom_host
            SERVER_HOST="${custom_host:-localhost}"
        fi
    else
        echo -e "${YELLOW}无法检测公网 IP${NC}"
        read -p "请输入服务器 IP 或域名 (留空使用 localhost): " custom_host
        SERVER_HOST="${custom_host:-localhost}"
    fi

    echo ""
}

# 安装依赖
install_dependencies() {
    print_step "安装项目依赖（这可能需要几分钟）..."
    echo ""

    # 设置 npm 镜像（加速下载）
    read -p "是否使用国内 npm 镜像加速下载？[Y/n]: " use_mirror
    if [[ ! "$use_mirror" =~ ^[Nn]$ ]]; then
        npm config set registry https://registry.npmmirror.com
        print_success "已切换到国内镜像"
    fi

    echo ""
    print_info "正在安装后端依赖..."
    cd "$SERVER_DIR"
    npm install --production --no-audit || {
        print_error "后端依赖安装失败"
        exit 1
    }
    print_success "后端依赖安装完成"

    echo ""
    print_info "正在安装前端依赖..."
    cd "$CLIENT_DIR"
    npm install --production --no-audit || {
        print_error "前端依赖安装失败"
        exit 1
    }
    print_success "前端依赖安装完成"

    cd "$PROJECT_ROOT"
    echo ""
}

# 配置环境变量
configure_environment() {
    print_step "配置环境变量..."
    echo ""

    # 配置后端
    cd "$SERVER_DIR"

    if [ -f .env ]; then
        read -p "后端 .env 文件已存在，是否覆盖？[y/N]: " overwrite
        if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
            print_info "跳过后端环境配置"
            cd "$PROJECT_ROOT"
            return
        fi
    fi

    cp .env.example .env

    # 生成 JWT 密钥
    JWT_SECRET=$(openssl rand -base64 32)

    # 使用 sed 替换配置
    sed -i.bak "s|your-super-secret-jwt-key-change-this-in-production|$JWT_SECRET|g" .env
    sed -i.bak "s|mongodb://localhost:27017/clipboard-sync|$MONGODB_URI|g" .env
    sed -i.bak "s|http://localhost:5173|http://$SERVER_HOST:5173|g" .env

    rm -f .env.bak

    print_success "后端环境配置完成"

    # 配置前端
    cd "$CLIENT_DIR"

    if [ ! -f .env ]; then
        cp .env.example .env

        sed -i.bak "s|http://localhost:5000|http://$SERVER_HOST:5000|g" .env
        rm -f .env.bak

        print_success "前端环境配置完成"
    fi

    cd "$PROJECT_ROOT"
    echo ""
}

# 创建启动脚本
create_start_scripts() {
    print_step "创建启动脚本..."

    # 后端启动脚本
    cat > "$PROJECT_ROOT/start-server.sh" << 'SERVERSCRIPT'
#!/bin/bash
cd "$(dirname "$0")/server"

echo "════════════════════════════════════════"
echo "  🚀 启动 ClipSync 后端服务"
echo "════════════════════════════════════════"
echo ""
echo "端口: 5000"
echo "环境: development"
echo ""

npm run dev
SERVERSCRIPT

    # 前端启动脚本
    cat > "$PROJECT_ROOT/start-client.sh" << 'CLIENTSCRIPT'
#!/bin/bash
cd "$(dirname "$0")/client"

echo "════════════════════════════════════════"
echo "  🚀 启动 ClipSync 前端服务"
echo "════════════════════════════════════════"
echo ""
echo "端口: 5173"
echo ""

npm run dev
CLIENTSCRIPT

    # 后台启动脚本
    cat > "$PROJECT_ROOT/start-all-background.sh" << 'BGSCRIPT'
#!/bin/bash
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$PROJECT_ROOT/logs"

echo "启动 ClipSync 服务（后台模式）..."

# 启动后端
cd "$PROJECT_ROOT/server"
nohup npm run dev > "$PROJECT_ROOT/logs/server.log" 2>&1 &
echo $! > "$PROJECT_ROOT/server.pid"
echo "✓ 后端已启动 (PID: $(cat "$PROJECT_ROOT/server.pid"))"

sleep 3

# 启动前端
cd "$PROJECT_ROOT/client"
nohup npm run dev > "$PROJECT_ROOT/logs/client.log" 2>&1 &
echo $! > "$PROJECT_ROOT/client.pid"
echo "✓ 前端已启动 (PID: $(cat "$PROJECT_ROOT/client.pid"))"

echo ""
echo "════════════════════════════════════════"
echo "服务已在后台运行"
echo "════════════════════════════════════════"
echo ""
echo "查看日志:"
echo "  后端: tail -f logs/server.log"
echo "  前端: tail -f logs/client.log"
echo ""
echo "停止服务:"
echo "  ./stop-all.sh"
echo ""
BGSCRIPT

    # 停止脚本
    cat > "$PROJECT_ROOT/stop-all.sh" << 'STOPSCRIPT'
#!/bin/bash
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "停止 ClipSync 服务..."

if [ -f "$PROJECT_ROOT/server.pid" ]; then
    kill $(cat "$PROJECT_ROOT/server.pid") 2>/dev/null
    rm -f "$PROJECT_ROOT/server.pid"
    echo "✓ 后端已停止"
fi

if [ -f "$PROJECT_ROOT/client.pid" ]; then
    kill $(cat "$PROJECT_ROOT/client.pid") 2>/dev/null
    rm -f "$PROJECT_ROOT/client.pid"
    echo "✓ 前端已停止"
fi

echo "所有服务已停止"
STOPSCRIPT

    chmod +x "$PROJECT_ROOT"/*.sh

    print_success "启动脚本创建完成"
    echo ""
}

# 显示完成信息
show_completion_info() {
    print_header

    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}║                 ✓ 安装完成！                             ║${NC}"
    echo -e "${GREEN}║                                                           ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""

    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  启动方式${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    echo -e "${YELLOW}方式一：前台运行（推荐用于开发调试）${NC}"
    echo ""
    echo "  终端 1 - 启动后端:"
    echo -e "  ${GREEN}./start-server.sh${NC}"
    echo ""
    echo "  终端 2 - 启动前端:"
    echo -e "  ${GREEN}./start-client.sh${NC}"
    echo ""

    echo -e "${YELLOW}方式二：后台运行（推荐用于生产环境）${NC}"
    echo ""
    echo "  启动所有服务:"
    echo -e "  ${GREEN}./start-all-background.sh${NC}"
    echo ""
    echo "  停止所有服务:"
    echo -e "  ${GREEN}./stop-all.sh${NC}"
    echo ""

    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  访问地址${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    if [ "$SERVER_HOST" != "localhost" ]; then
        echo -e "  前端界面: ${GREEN}http://$SERVER_HOST:5173${NC}"
        echo -e "  后端 API: ${GREEN}http://$SERVER_HOST:5000${NC}"
        echo ""
        echo -e "${YELLOW}⚠ 需要在防火墙中开放端口：${NC}"
        echo "  sudo ufw allow 5173"
        echo "  sudo ufw allow 5000"
    else
        echo -e "  前端界面: ${GREEN}http://localhost:5173${NC}"
        echo -e "  后端 API: ${GREEN}http://localhost:5000${NC}"
    fi

    echo ""

    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  配置文件${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "  后端配置: server/.env"
    echo "  前端配置: client/.env"
    echo ""

    if [ "$MONGODB_URI" == "mongodb://localhost:27017/clipboard-sync" ]; then
        echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
        echo -e "${YELLOW}  ⚠ 重要提示${NC}"
        echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
        echo ""
        echo -e "${RED}MongoDB 使用默认配置，需要手动配置！${NC}"
        echo ""
        echo "请编辑 server/.env 文件，修改 MONGODB_URI 为："
        echo "  - MongoDB Atlas 连接字符串（推荐）"
        echo "  - 或你的 MongoDB 服务器地址"
        echo ""
    fi

    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  快速验证${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "  启动服务后，运行以下命令测试："
    echo -e "  ${GREEN}curl http://localhost:5000/health${NC}"
    echo ""
    echo "  应返回: {\"status\":\"ok\",\"timestamp\":\"...\"}"
    echo ""

    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  文档资源${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "  详细文档: INSTALLATION.md"
    echo "  快速参考: QUICKREF.md"
    echo "  VPS 指南: 快速启动指南-VPS.md"
    echo ""

    echo -e "${GREEN}开始使用 ClipSync 吧！ 🎉${NC}"
    echo ""
}

# 主函数
main() {
    print_header

    # 检查是否在项目根目录
    if [ ! -d "$SERVER_DIR" ] || [ ! -d "$CLIENT_DIR" ]; then
        print_error "请在项目根目录运行此脚本"
        exit 1
    fi

    # 执行安装步骤
    check_environment
    configure_mongodb
    get_server_info
    install_dependencies
    configure_environment
    create_start_scripts

    # 显示完成信息
    show_completion_info
}

# 运行主函数
main
