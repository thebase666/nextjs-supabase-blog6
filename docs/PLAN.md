# 博客项目完整实施计划

基于 Next.js 16 + Tailwind CSS + Clerk + Supabase 搭建博客应用，包含首页文章列表、动态路由文章详情、登录用户创建文章功能，所有 Supabase 操作均在服务端完成。

## 当前项目状态

- Next.js **16.2.1** + React 19 + Tailwind CSS v4 (已安装)
- Clerk 环境变量已配置于 `.env.local`（`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`）
- Supabase **未配置**，需要通过 MCP 获取项目信息并添加环境变量
- 项目为全新脚手架，`app/page.tsx` 仅渲染占位内容

---

## 第一阶段：环境与依赖

### 1.1 安装依赖

```bash
npm install @clerk/nextjs @supabase/supabase-js
```

### 1.2 配置 Supabase 环境变量

通过 Supabase MCP 工具获取项目 URL 和 anon key，写入 `.env.local`：

```
NEXT_PUBLIC_SUPABASE_URL=<从 MCP get_project_url 获取>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<从 MCP get_publishable_keys 获取>
```

> **注意**：这里使用 `anon` key（而非 `service_role`），因为 RLS 会基于 JWT 中的用户身份自动控制权限。

### 1.3 配置 Clerk 路由变量

在 `.env.local` 中补充：

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 1.4 配置 Clerk JWT Template（需用户手动操作）

在 Clerk Dashboard 中创建 Supabase JWT Template，让 Clerk 签发的 token 能被 Supabase 验证：

1. 进入 [Clerk Dashboard](https://dashboard.clerk.com) → **JWT Templates** → **New Template** → 选择 **Supabase**
2. Clerk 会自动生成一个包含 `sub`（user ID）等 claims 的模板
3. 复制 Clerk 提供的 **JWKS Endpoint** 或 **Signing Key**
4. 进入 Supabase Dashboard → **Authentication** → **JWT Configuration** → 粘贴 Clerk 的 JWT Secret
5. 确保 Supabase 的 JWT Secret 与 Clerk JWT Template 的 signing key 一致

---

## 第二阶段：Supabase 数据库

### 2.1 数据表设计

通过 MCP `apply_migration` 创建 `posts` 表：

```sql
CREATE TABLE posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  author_id  TEXT NOT NULL,        -- Clerk user ID (如 user_xxx)
  author_name TEXT NOT NULL,       -- 显示用的作者名
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_created_at ON posts (created_at DESC);
```

### 2.2 RLS 策略

Supabase 通过 Clerk JWT 中的 `sub` claim 识别用户身份，`auth.uid()` 会返回 Clerk 的 user ID。

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 所有人可读（首页和详情页，包括未登录用户使用 anon key）
CREATE POLICY "Anyone can read posts"
  ON posts FOR SELECT
  USING (true);

-- 已登录用户可插入，且 author_id 必须等于当前用户 ID
CREATE POLICY "Authenticated users can insert own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);
```

> **工作原理**：`createSupabaseClient()` 的 `accessToken` 回调每次请求时自动调用 Clerk `auth().getToken()`，Supabase 解析 JWT 中的 `sub` 字段作为 `auth.uid()`，RLS 策略自动生效。INSERT 时强制 `author_id = auth.uid()`，确保用户只能以自己的身份发布文章。未登录时 token 为 null，以 anon 身份执行，SELECT 照常工作。

---

## 第三阶段：代码架构

### 文件结构

```
app/
├── layout.tsx              -- ClerkProvider 包裹
├── page.tsx                -- 首页：文章列表
├── blog/[id]/page.tsx      -- 动态路由：文章详情
├── create/page.tsx         -- 创建文章（需登录）
├── sign-in/[[...sign-in]]/page.tsx  -- Clerk 登录页
└── sign-up/[[...sign-up]]/page.tsx  -- Clerk 注册页
lib/
├── supabase.ts             -- Supabase client（accessToken 回调自动注入 Clerk JWT）
└── posts.ts                -- 所有 Supabase 数据操作（"use server"）
proxy.ts                    -- Clerk middleware（Next.js 16 用 proxy.ts）
```

### 3.1 Supabase Client — `lib/supabase.ts`

统一使用一个 client，通过 `accessToken` 回调自动集成 Clerk 认证：

```typescript
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export const createSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken();
      },
    },
  );
};
```

**工作原理**：

- 每次 Supabase 发请求时，自动调用 `accessToken()` 从 Clerk 获取最新 JWT
- 已登录用户：返回有效 token → Supabase `auth.uid()` = Clerk user ID → RLS 生效
- 未登录用户：返回 `null` → 以 anon 身份执行 → RLS SELECT 策略允许读取

### 3.2 数据操作 — `lib/posts.ts`

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "./supabase";

// getPosts()       — 直接查询，未登录也能读（RLS SELECT = true）
// getPostById(id)  — 直接查询，未登录也能读
// createPost(formData) — auth() 校验登录状态 + RLS 校验 author_id
```

`createPost` 核心流程：

1. `const { userId } = await auth()` — 未登录则抛错
2. `const supabase = createSupabaseClient()` — accessToken 自动注入 Clerk JWT
3. `supabase.from("posts").insert({ author_id: userId, ... })` — RLS 自动校验 `auth.uid() = author_id`
4. 成功后 `redirect("/")`

### 3.3 Clerk 集成

- `app/layout.tsx`：用 `<ClerkProvider>` 包裹 `children`，顶部导航栏包含 `<SignedIn>` / `<SignedOut>` / `<UserButton>`
- `proxy.ts`（项目根目录，与 `app/` 同级）：调用 `clerkMiddleware()` 保护 `/create` 路由

### 3.4 页面实现

| 页面     | 路径                      | 说明                                                                           |
| -------- | ------------------------- | ------------------------------------------------------------------------------ |
| 首页     | `/`                       | Server Component，调用 `getPosts()` 渲染文章卡片列表                           |
| 文章详情 | `/blog/[id]`              | Server Component，`await params` 取 id，调用 `getPostById(id)`                 |
| 创建文章 | `/create`                 | Client Component（表单交互），`<form action={createPost}>`，使用 Server Action |
| 登录     | `/sign-in/[[...sign-in]]` | Clerk `<SignIn />` 组件                                                        |
| 注册     | `/sign-up/[[...sign-up]]` | Clerk `<SignUp />` 组件                                                        |

---

## 第四阶段：UI 设计

采用 Tailwind CSS 暗色主题，简洁现代风格：

- **导航栏**：左侧 Logo/站名，右侧登录状态（`<UserButton>` 或 Sign In 链接）+ 创建文章按钮
- **首页卡片**：每篇文章一张卡片，显示标题、作者、日期、内容摘要，点击跳转详情
- **详情页**：全宽内容区，标题 + 元信息 + 正文
- **创建页**：居中表单，标题输入 + 内容 textarea + 提交按钮
