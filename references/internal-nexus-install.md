# 内网 Nexus tarball 安装手册

> 适用：观远官方 `guan*-skill` 系列（`guanvis-skill` 等）通过内网 Nexus 私服分发的场景。**公网 npm 装不到**，必须靠同事从私服下 tarball 传过来本地安装。
>
> 首次落地：2026-05-13（`guanvis-skill@0.1.13` 安装实录）。

## 前提理解

观远的 `package.json` `publishConfig.registry` 写死的是 **内网 Nexus 私服**：

```
https://app.mayidata.com/nexus/repository/guandata-web/
```

外网访问不到，所以 `npm install -g guanvis-skill` 或 `npm install -g @guandata/guanvis-skill` 在公网都会返回 `E404 Not Found`。**这不是命名错误，也不是版本过期，是渠道不通**。

目前（2026-05-13）已确认走过此通道发布的：

- `@guandata/guanvis-skill@0.1.13` —— Card/Page JS DSL 生成工具

未确认（公网 + 内网均 404）：

- `guanetl-skill` / `guands-skill` / `guanexport-skill` / `guanadmin-skill`

## 通用安装四步法

假设同事从内网 Nexus 下载了 tarball，通过微信/邮箱传给你，文件名类似 `package.tgz` 或解压后直接是 `package/` 目录。

### Step 1 · 从微信缓存搬到稳定路径

微信缓存目录形如：

```
/Users/<you>/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/<wxid>/msg/file/<YYYY-MM>/package
```

**微信会定期清理这个目录**，必须先搬出来：

```bash
mv "<wechat-cache-path>/package" ~/projects/<skill-name>-<version>
# 例：~/projects/guanvis-skill-0.1.13
```

### Step 2 · 清掉 macOS quarantine 扩展属性（关键，否则 SIGKILL）

> **2026-05-13 踩坑实录**：装 `guanvis-skill@0.1.13` 时第一次跑 `guanvis-skill --help` 直接被系统强杀：
>
> ```
> Error: Command failed: .../binaries/guanvis-skill-darwin-arm64 --help
>   status: null, signal: 'SIGKILL'
> ```
>
> `xattr -l <binary>` 查出来根因：
>
> ```
> com.apple.provenance:
> com.apple.quarantine: 0082;6a0434a1;WeChat;
> ```
>
> macOS Gatekeeper 看到从微信下载的未签名 binary 会直接拦截。`chmod +x` 不够，必须显式删 quarantine 标记。

```bash
cd ~/projects/<skill-name>-<version>
xattr -dr com.apple.quarantine .
```

`-d` = delete attribute，`-r` = 递归整个目录（覆盖所有 binary）。**这一步是新手最容易漏掉的**，缺它则下面的 `version` / `--help` / `install-skill` 全会 SIGKILL，没有任何 stdout/stderr 输出，非常具有误导性。

### Step 3 · npm link 把 bin 挂到全局 PATH

```bash
npm link
# 应输出："added 1 package, and audited X packages in Xs"
```

`npm link` 比 `npm install -g` 更适合本地 tarball 安装——它在全局 node_modules 里做软链回当前目录，方便后续 `git pull` 或重新解压新版本时自动生效。

### Step 4 · 调包内 install-skill 把 SKILL.md 注册到 AI agent

观远官方包都带一个 `install-skill` 子命令，会把包内的 `skills/<skill-name>/SKILL.md` 软链到 `~/.agents/skills/<skill-name>/`，然后再分别 symlink 到 Claude Code、Codex、Gemini CLI、Qoder、Trae CN 等 55 个 AI 编程助手的 skill 目录。

```bash
<bin-name> install-skill
# 例：guanvis-skill install-skill
```

成功后会看到类似：

```
✓ ~/.agents/skills/<skill-name>
    universal: Antigravity, Codex, Gemini CLI, Amp, Cline +8 more
    symlinked: Claude Code, Qoder, Trae CN
```

## 验证

```bash
<bin-name> version          # 应输出包内 package.json 的 version
<bin-name> --help           # 看子命令清单
ls -la ~/.claude/skills/    # 看到 <skill-name> -> ../../.agents/skills/<skill-name> 软链
```

如果 `version` 之外的命令仍 SIGKILL，回 Step 2 确认 `xattr -l` 输出里**没有** `com.apple.quarantine` 这行。

## 验证 auth 共享

观远官方 skill 默认复用 `guancli` 的 auth profile（`~/Library/Application Support/guancli/config.json`），所以装完 `guanvis-skill` 直接能用现有 BI 实例的登录态：

```bash
guancli auth status            # 看当前 profile
guanvis-skill init <dsId> -d ./test/   # 用 guancli 已登录的 profile 拉数据集 schema
```

## 卸载

```bash
cd ~/projects/<skill-name>-<version>
npm unlink -g                            # 摘掉全局 bin 软链
rm ~/.claude/skills/<skill-name>         # 断 Claude Code 入口
rm ~/.agents/skills/<skill-name>         # 断中央目录入口（如是软链）
# 可选：rm -rf ~/projects/<skill-name>-<version>   # 物理删除
```

## 常见问题

### Q: 同事从私服 `npm pack` 出来的 tarball 怎么用？

`npm pack` 出来通常是 `<name>-<version>.tgz`，解开后里面有 `package/` 目录。`tar -xzf` 完之后照上面四步走，把 `package/` 那个目录搬到 `~/projects/<name>-<version>/`，再 `xattr -dr` + `npm link`。

### Q: 能不能配 npm registry 直接走私服？

可以，但需要内网 VPN + Nexus 账号 token：

```bash
npm config set @guandata:registry https://app.mayidata.com/nexus/repository/guandata-web/
npm login --scope=@guandata --registry=https://app.mayidata.com/nexus/repository/guandata-web/
npm install -g @guandata/guanvis-skill@latest
```

但内网员工大多没拿到 Nexus 个人 token，所以走 tarball + `npm link` 是更稳的路径。

### Q: 安装时 binary 报 `Unsupported platform`？

`bin/run.js` 里写了 `PLATFORM_MAP`，只覆盖 `darwin-arm64 / darwin-x64 / win32-x64`。Linux 没编 binary——理论上要让作者重编一份，或者拿源码自己 `go build`（如果是 Go 项目）。

### Q: 包里没有 `install-skill` 子命令怎么办？

老版本的 `guan*-skill` 可能只暴露原始 binary。手动建软链也行：

```bash
ln -s ~/projects/<skill-name>-<version>/skills/<skill-name> ~/.claude/skills/<skill-name>
```

但这样跳过了 `~/.agents/skills/` 中央目录，其他 agent 框架就看不到了。能用 `install-skill` 还是优先用它。
