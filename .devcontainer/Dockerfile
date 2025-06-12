FROM ubuntu:25.04

# パッケージインストール
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt update && apt install --no-install-recommends -y \
    ca-certificates \
    curl \
    git \
    unzip \
    openjdk-21-jre-headless \
    graphviz \
    fonts-ipafont

# PlantUMLインストール
ARG PLANTUML_VERSION=1.2025.2
ARG plantuml="https://github.com/plantuml/plantuml/releases/download/v${PLANTUML_VERSION}/plantuml-${PLANTUML_VERSION}.jar"
RUN curl -LsSf ${plantuml} -o /usr/local/bin/plantuml.jar

# AWS CLI v2 のインストール
# https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/getting-started-install.html
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip" && \
    unzip /tmp/awscliv2.zip -d /tmp && \
    /tmp/aws/install && \
    rm -rf /tmp/aws /tmp/awscliv2.zip

# dockerインストール
RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt update && apt install --no-install-recommends -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

# Node.jsインストール(nvsを利用)
ENV NVS_HOME=/root/.nvs
ENV PATH="${NVS_HOME}/default/bin:${PATH}"
RUN git clone https://github.com/jasongin/nvs.git $NVS_HOME && \
    bash -c ". $NVS_HOME/nvs.sh && nvs add lts && nvs use lts && nvs link lts"
RUN echo '. "$NVS_HOME/nvs.sh"' >> /root/.bashrc && \
    echo 'nvs use lts' >> /root/.bashrc

# 作業ディレクトリを作成
WORKDIR /workspace
