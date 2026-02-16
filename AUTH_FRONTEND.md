# Documentação Técnica - Sistema de Autenticação Frontend

## Visão Geral

Sistema completo de autenticação para VitrinePro V8, construído com Astro 4.0 + Vue 3.4, conectado a backend NestJS via API REST.

**Características:**
- Login/Registro tradicional (email/senha)
- OAuth com Google e LinkedIn
- Autenticação JWT
- Proteção de rotas client-side
- Gerenciamento de sessão com localStorage
- UX otimizada com OAuth prioritário

## Arquitetura

### Stack
- **Frontend:** Astro 4.0 (SSG) + Vue 3.4 (Composition API)
- **Backend:** NestJS (porta 3000)
- **Autenticação:** JWT (JSON Web Tokens)
- **Armazenamento:** localStorage (client-side)

### Fluxo de Dados

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Browser   │ ───> │   Astro     │ ───> │   NestJS     │
│  (Cliente)  │ <─── │  Frontend   │ <─── │   Backend    │
└─────────────┘      └─────────────┘      └──────────────┘
      │                     │                      │
      │                     │                      │
   localStorage         Vue Components        PostgreSQL
   (JWT Token)         (Forms, OAuth)        (User Data)
```

## Estrutura de Arquivos

```
src/
├── utils/
│   ├── api.ts              # Chamadas ao backend
│   └── auth.ts             # Gerenciamento de tokens
│
├── components/
│   ├── OAuthButtons.vue    # Botões OAuth (Google/LinkedIn)
│   ├── LoginForm.vue       # Formulário de login
│   ├── SignupForm.vue      # Formulário de registro
│   └── HeaderActions.vue   # Botões do header (dinâmicos)
│
├── pages/
│   ├── login.astro         # Página de login
│   ├── signup.astro        # Página de cadastro
│   ├── dashboard.astro     # Dashboard (protegido)
│   └── auth/
│       └── callback.astro  # Callback OAuth
│
└── styles/
    └── auth.css            # Estilos de autenticação
```

## Utilidades

### `src/utils/api.ts`

Funções para comunicação com o backend.

#### `getBackendUrl(): string`
Retorna a URL base do backend das variáveis de entorno.

```typescript
const url = getBackendUrl(); // http://localhost:3000
```

#### `fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T>`
Wrapper de `fetch` com funcionalidades adicionais:
- Adiciona headers automaticamente (Content-Type, Authorization)
- Injeta token JWT se existir
- Trata erros HTTP
- Retorna dados parseados

```typescript
const data = await fetchAPI('/auth/profile');
```

#### `loginWithCredentials(email: string, password: string): Promise<AuthResponse>`
Faz login com email e senha.

```typescript
const response = await loginWithCredentials('user@example.com', 'password');
// { access_token: 'jwt...', user: { id, email, firstName, lastName } }
```

#### `registerUser(email, firstName, lastName, password): Promise<AuthResponse>`
Registra novo usuário.

```typescript
const response = await registerUser(
  'user@example.com',
  'João',
  'Silva',
  'password123'
);
```

#### `getProfile(): Promise<UserProfile>`
Obtém perfil do usuário autenticado (requer token).

```typescript
const profile = await getProfile();
// { id, email, firstName, lastName, provider, createdAt }
```

#### `getErrorMessage(error: unknown): string`
Converte erros da API em mensagens amigáveis em português.

```typescript
try {
  await loginWithCredentials(email, password);
} catch (error) {
  const message = getErrorMessage(error);
  // "Email ou senha incorretos"
}
```

**Mapeamento de erros:**
- 401 + credentials → "Email ou senha incorretos"
- 401 + provider → "Esta conta usa autenticação via Google ou LinkedIn"
- 400 + exists → "Este email já está registrado"
- 404 → "Recurso não encontrado"
- 500 → "Erro no servidor. Tente novamente."
- 0 (network) → "Erro de conexão. Verifique sua internet."

### `src/utils/auth.ts`

Funções para gerenciamento de autenticação client-side.

#### `saveToken(token: string): void`
Salva token JWT no localStorage.

```typescript
saveToken(response.access_token);
```

#### `getToken(): string | null`
Obtém token do localStorage.

```typescript
const token = getToken();
```

#### `removeToken(): void`
Remove token do localStorage (logout).

```typescript
removeToken();
```

#### `isAuthenticated(): boolean`
Verifica se há token válido.

```typescript
if (!isAuthenticated()) {
  redirectToLogin();
}
```

#### `getUserFromToken(): JWTPayload | null`
Decodifica JWT e retorna dados do usuário (apenas client-side, sem validação de assinatura).

```typescript
const user = getUserFromToken();
// { sub, email, iat, exp, ... }
```

⚠️ **Atenção:** Esta função apenas decodifica o token, não valida a assinatura. Sempre confie no backend para validação.

#### `isTokenExpired(): boolean`
Verifica se o token está expirado (client-side).

```typescript
if (isTokenExpired()) {
  logout();
}
```

#### `redirectToLogin(returnUrl?: string): void`
Redireciona para página de login, opcionalmente salvando URL de retorno.

```typescript
redirectToLogin('/dashboard');
// Redireciona para: /login?redirect=/dashboard
```

#### `redirectAfterLogin(): void`
Redireciona após login bem-sucedido:
- Se há `?redirect=` na URL, vai para lá
- Caso contrário, vai para `/dashboard`

```typescript
redirectAfterLogin();
```

#### `logout(): void`
Remove token e redireciona para home.

```typescript
logout(); // Remove token + redirect para /
```

## Componentes Vue

### `OAuthButtons.vue`

Botões para autenticação OAuth.

**Props:**
- `provider: 'google' | 'linkedin'` - Provider OAuth

**Comportamento:**
1. Ao clicar, redireciona para `${BACKEND_URL}/auth/${provider}`
2. Backend processa OAuth
3. Callback retorna para `/auth/callback?token=...`

**Uso:**
```vue
<OAuthButtons provider="google" client:load />
<OAuthButtons provider="linkedin" client:load />
```

**Estilos:**
- Google: Fundo #4285F4 (azul Google)
- LinkedIn: Fundo #0077B5 (azul LinkedIn)
- Hover: Eleva e aumenta sombra
- Ícones SVG inline (sem dependências)

### `LoginForm.vue`

Formulário de login tradicional.

**Campos:**
- Email (required, type="email")
- Password (required, type="password")

**Comportamento:**
1. Validação HTML5
2. Submit → `loginWithCredentials()`
3. Se sucesso: salva token + `redirectAfterLogin()`
4. Se erro: mostra mensagem amigável

**Estados:**
- Loading: desabilita campos e botão
- Error: mostra mensagem em vermelho
- Success: redireciona automaticamente

**Uso:**
```vue
<LoginForm client:load />
```

### `SignupForm.vue`

Formulário de registro.

**Campos:**
- First Name (required)
- Last Name (required)
- Email (required, type="email")
- Password (required, minlength="8")
- Confirm Password (required, deve coincidir)

**Validação client-side:**
- Senhas coincidem
- Senha mínimo 8 caracteres
- Formato de email válido

**Comportamento:**
1. Validação em tempo real
2. Submit → `registerUser()`
3. Backend retorna token automaticamente
4. Salva token + redireciona para dashboard

**Uso:**
```vue
<SignupForm client:load />
```

### `HeaderActions.vue`

Botões de ação do header (login/logout) que mudam dinamicamente.

**Comportamento:**
- **Não autenticado:** Mostra "Entrar" + "Cadastre-se Grátis"
- **Autenticado:** Mostra "Minha Conta" + "Sair"

**Tecnologias:**
- Vue 3 Composition API
- `onMounted()` para verificar autenticação
- Reativo com `ref()`

**Uso:**
```astro
<HeaderActions client:load />
```

## Páginas Astro

### `/login` - `src/pages/login.astro`

Página de login.

**Layout:**
1. Header
2. Card centralizado com:
   - Título "Bem-vindo de volta"
   - Botões OAuth (Google + LinkedIn) - **Prioritários**
   - Divisor "OU"
   - Formulário tradicional - **Secundário**
   - Link para cadastro
3. Footer

**Script client-side:**
- Verifica se já está logueado
- Se sim, redireciona para `/dashboard`

### `/signup` - `src/pages/signup.astro`

Página de cadastro (estrutura idêntica ao login).

**Diferenças:**
- Título "Crie sua conta"
- Usa `SignupForm` ao invés de `LoginForm`
- Link para login

### `/auth/callback` - `src/pages/auth/callback.astro`

Página de callback OAuth (não deve ser acessada diretamente).

**Comportamento:**
1. Mostra spinner "Completando seu login..."
2. Extrai parâmetros da URL:
   - `?token=...` → Salva token + redireciona para dashboard
   - `?error=...` → Mostra erro + redireciona para login
   - Sem params → Erro + redireciona para login

**URL esperada do backend:**
```
http://localhost:4321/auth/callback?token=eyJhbGc...
```

### `/dashboard` - `src/pages/dashboard.astro`

Dashboard do usuário (rota protegida).

**Proteção:**
```typescript
<script>
  import { isAuthenticated, redirectToLogin } from '../utils/auth';

  if (!isAuthenticated()) {
    redirectToLogin('/dashboard');
  }
</script>
```

**Funcionalidades:**
- Carrega perfil do usuário via `getProfile()`
- Mostra dados do usuário
- Grid de cards com ações
- Botão de logout

## Fluxos de Autenticação

### Fluxo 1: Registro Tradicional

```
1. Usuário → /signup
2. Preenche formulário (firstName, lastName, email, password)
3. Submit → POST /auth/register
4. Backend valida + cria usuário + retorna JWT
5. Frontend salva token no localStorage
6. Redirecionamento para /dashboard
```

### Fluxo 2: Login Tradicional

```
1. Usuário → /login
2. Preenche email e senha
3. Submit → POST /auth/login
4. Backend valida credenciais + retorna JWT
5. Frontend salva token
6. Redirecionamento para /dashboard
```

### Fluxo 3: OAuth (Google/LinkedIn)

```
1. Usuário → /login ou /signup
2. Clica "Continuar com Google/LinkedIn"
3. Redirecionamento para http://localhost:3000/auth/{provider}
4. Backend redireciona para Google/LinkedIn
5. Usuário autoriza no provider
6. Provider callback → Backend
7. Backend:
   - Verifica/cria usuário
   - Gera JWT
   - Redireciona para http://localhost:4321/auth/callback?token=...
8. Frontend:
   - Extrai token da URL
   - Salva no localStorage
   - Redireciona para /dashboard
```

### Fluxo 4: Proteção de Rota

```
1. Usuário tenta acessar /dashboard
2. Script verifica isAuthenticated()
3. Se false:
   - Salva URL atual (?redirect=/dashboard)
   - Redireciona para /login
4. Após login bem-sucedido:
   - redirectAfterLogin() detecta ?redirect
   - Volta para /dashboard
```

### Fluxo 5: Logout

```
1. Usuário clica "Sair"
2. Confirmação (opcional)
3. removeToken() limpa localStorage
4. Redirecionamento para /
5. Header atualiza (mostra botões de login)
```

## Estilos

### `src/styles/auth.css`

Estilos centralizados para autenticação.

**Classes principais:**
- `.auth-page` - Container da página
- `.auth-card` - Card centralizado
- `.auth-header` - Cabeçalho do card
- `.oauth-section` - Botões OAuth
- `.auth-divider` - Divisor "OU"
- `.form-error` - Mensagens de erro
- `.loading-spinner` - Spinner de loading

**Sistema de Design:**
- Usa variáveis CSS de `variables.css`
- Primary color: `var(--primary)` (#2563eb)
- Espacamento: `var(--spacing-*)`
- Border radius: `var(--radius-*)`
- Sombras: `var(--shadow-*)`

## Segurança

### Client-Side
- ✅ Tokens JWT armazenados em localStorage
- ✅ HTTPS obrigatório em produção
- ✅ Validação client-side (UX, não segurança)
- ⚠️ localStorage vulnerável a XSS (aceitável para MVP)

### Backend (Responsabilidade do NestJS)
- ✅ Validação de JWT em todas as rotas protegidas
- ✅ CORS configurado corretamente
- ✅ Passwords hasheados (bcrypt)
- ✅ Rate limiting
- ✅ SQL injection prevention (TypeORM)

### Melhorias Futuras
- [ ] Cookies HttpOnly (mais seguro que localStorage)
- [ ] Refresh tokens
- [ ] CSRF protection
- [ ] Two-factor authentication

## Variáveis de Entorno

### Frontend (`.env`)

```env
# Backend API URL
PUBLIC_BACKEND_URL=http://localhost:3000

# Frontend URL
PUBLIC_FRONTEND_URL=http://localhost:4321
```

⚠️ **Importante:** Use prefixo `PUBLIC_` para expor ao cliente.

### Backend (backend `.env`)

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/vitrineproDB

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# Frontend URL (para callbacks OAuth)
FRONTEND_URL=http://localhost:4321

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

## Configuração de OAuth Providers

### Google Console

1. Acesse https://console.cloud.google.com/
2. Crie projeto ou selecione existente
3. APIs & Services → Credentials
4. Criar credenciais → OAuth 2.0 Client ID
5. Configurar:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
6. Copiar Client ID e Client Secret para backend `.env`

### LinkedIn Apps

1. Acesse https://www.linkedin.com/developers/apps
2. Crie novo app
3. Auth → OAuth 2.0 settings
4. Redirect URLs: `http://localhost:3000/auth/linkedin/callback`
5. Products → Request "Sign In with LinkedIn"
6. Copiar Client ID e Client Secret para backend `.env`

## Troubleshooting

### Erro: "Erro de conexão. Verifique sua internet."

**Causa:** Backend não está rodando ou URL incorreta.

**Solução:**
1. Verifique se backend está em `http://localhost:3000`
2. Confirme `PUBLIC_BACKEND_URL` no `.env`
3. Teste: `curl http://localhost:3000/auth/profile`

### Erro: CORS policy

**Causa:** Backend não tem CORS habilitado ou URL incorreta.

**Solução:**
Backend deve ter:
```typescript
app.enableCors({
  origin: 'http://localhost:4321',
  credentials: true,
});
```

### OAuth não redireciona corretamente

**Causa:** `FRONTEND_URL` no backend está incorreto.

**Solução:**
Verificar backend `.env`:
```env
FRONTEND_URL=http://localhost:4321
```

### Token não persiste após refresh

**Causa:** localStorage não está salvando.

**Solução:**
1. Verificar DevTools → Application → Local Storage
2. Garantir que domínio seja `http://localhost:4321`
3. Testar: `localStorage.setItem('test', '123')`

### Flash de conteúdo não autorizado (FOUC)

**Causa:** Astro gera HTML estático, verificação é client-side.

**Solução:** Aceitável para SSG. Para melhorar:
1. Adicionar loading spinner
2. Esconder conteúdo com `opacity: 0` até verificar
3. Em produção: usar Edge Functions (Cloudflare Workers)

## Testing

### Testar fluxo completo

```bash
# 1. Iniciar backend
cd backend
npm run start:dev

# 2. Iniciar frontend
cd frontend
npm run dev

# 3. Testar no navegador
open http://localhost:4321/login
```

### Testar API diretamente

```bash
# Registrar
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","firstName":"Test","lastName":"User","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Perfil (com token)
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Testar localStorage

```javascript
// Console do navegador
localStorage.getItem('token')
// Deve retornar JWT se logado

import { isAuthenticated } from './utils/auth';
isAuthenticated()
// true se logado
```

## Próximos Passos

### Features Recomendadas

1. **Password Reset**
   - Endpoint `/auth/forgot-password`
   - Email com token de reset
   - Página `/reset-password`

2. **Email Verification**
   - Email de confirmação ao registrar
   - Página `/verify-email?token=...`

3. **Profile Edit**
   - Página `/profile/edit`
   - Upload de avatar
   - Atualizar dados

4. **Remember Me**
   - Checkbox no login
   - Tokens de longa duração

5. **2FA**
   - TOTP com QR code
   - Backup codes

6. **Session Management**
   - Lista de sessões ativas
   - Logout remoto

## Referências

- [Astro Docs](https://docs.astro.build/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [JWT.io](https://jwt.io/)
- [OAuth 2.0](https://oauth.net/2/)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [LinkedIn OAuth](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)

---

**Documentação criada em:** 2026-02-16
**Versão:** 1.0.0
**Autor:** Claude Code
