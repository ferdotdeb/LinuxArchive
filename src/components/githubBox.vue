<script setup>
import { ref, onMounted } from 'vue'

// Props del componente
const props = defineProps({
  url: {
    type: String,
    default: null,
  },
  owner: {
    type: String,
    default: null,
  },
  repo: {
    type: String,
    default: null,
  },
  path: {
    type: String,
    default: null,
  },
  branch: {
    type: String,
    default: 'main',
  },
})

// Estado reactivo
const fileName = ref('Loading…')
const fileMeta = ref('—')
const htmlUrl = ref('')
const rawUrl = ref('')
const footerNote = ref('')
const copyUrlBtnText = ref('Copy URL')
const copyContentBtnText = ref('Copy Content')

// Funciones auxiliares
function formatBytes(bytes) {
  if (typeof bytes !== 'number') return ''
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0,
    n = bytes
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`
}

function parseGitHubUrl(url) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/').filter(Boolean)
    if (u.hostname !== 'github.com' || parts[2] !== 'blob') throw new Error('Unsupported URL')
    return {
      owner: parts[0],
      repo: parts[1],
      ref: parts[3],
      path: parts.slice(4).join('/'),
      html_url: url,
    }
  } catch {
    return null
  }
}

function toRawURL({ owner, repo, ref, path }) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(
    ref,
  )}/${path.split('/').map(encodeURIComponent).join('/')}`
}

function toHtmlURL({ owner, repo, ref, path }) {
  return `https://github.com/${owner}/${repo}/blob/${encodeURIComponent(ref)}/${path}`
}

// Funciones de acción
async function handleDownload() {
  try {
    const res = await fetch(rawUrl.value, { cache: 'no-store' })
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = fileName.value || 'download'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(a.href)
  } catch {
    alert('Download failed.')
  }
}

async function handleCopyUrl() {
  try {
    await navigator.clipboard.writeText(htmlUrl.value)
    copyUrlBtnText.value = 'Copied URL ✓'
    setTimeout(() => (copyUrlBtnText.value = 'Copy URL'), 1500)
  } catch {
    // Error silenciado intencionalmente
  }
}

async function handleCopyContent() {
  try {
    const res = await fetch(rawUrl.value, { cache: 'no-store' })
    const text = await res.text()
    await navigator.clipboard.writeText(text)
    copyContentBtnText.value = 'Copied ✓'
    setTimeout(() => (copyContentBtnText.value = 'Copy Content'), 1500)
  } catch {
    alert('Copy failed.')
  }
}

async function fetchMetaAndRender(ctx) {
  const api = `https://api.github.com/repos/${ctx.owner}/${
    ctx.repo
  }/contents/${ctx.path}?ref=${encodeURIComponent(ctx.ref)}`
  let name = ctx.path.split('/').pop()
  let size = null
  let html_url = toHtmlURL(ctx)
  let raw_url = toRawURL(ctx)
  let updated = null

  try {
    const res = await fetch(api, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.type === 'file') {
        name = data.name || name
        size = data.size ?? null
        html_url = data.html_url || html_url
        raw_url = data.download_url || raw_url
      }
    }
    try {
      const commitsApi = `https://api.github.com/repos/${ctx.owner}/${
        ctx.repo
      }/commits?path=${encodeURIComponent(ctx.path)}&sha=${encodeURIComponent(ctx.ref)}&per_page=1`
      const cres = await fetch(commitsApi, {
        headers: { Accept: 'application/vnd.github+json' },
      })
      if (cres.ok) {
        const arr = await cres.json()
        if (Array.isArray(arr) && arr.length) {
          updated = arr[0]?.commit?.committer?.date || arr[0]?.commit?.author?.date || null
        }
      }
    } catch {
      // Error silenciado intencionalmente
    }
  } catch {
    // Error silenciado intencionalmente
  }

  fileName.value = name || '(unknown)'
  const parts = []
  if (size != null) parts.push(formatBytes(size))
  if (updated) {
    const d = new Date(updated)
    const nice = d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
    parts.push(`updated ${nice}`)
  }
  fileMeta.value = parts.length ? parts.join(' · ') : '—'
  htmlUrl.value = html_url
  rawUrl.value = raw_url
  footerNote.value = `${ctx.owner}/${ctx.repo}@${ctx.ref} · ${ctx.path}`
}

// Inicialización
onMounted(() => {
  let ctx = null
  if (props.url) {
    const parsed = parseGitHubUrl(props.url)
    if (parsed) ctx = parsed
  } else if (props.owner && props.repo && props.path) {
    ctx = {
      owner: props.owner,
      repo: props.repo,
      path: props.path,
      ref: props.branch,
      html_url: toHtmlURL({
        owner: props.owner,
        repo: props.repo,
        ref: props.branch,
        path: props.path,
      }),
    }
  }
  if (!ctx) {
    ctx = parseGitHubUrl('https://github.com/ferdotdeb/LinuxWizards/blob/main/softwareWizard.sh')
  }
  fetchMetaAndRender(ctx)
})
</script>

<template>
  <div class="outer">
    <div class="box">
      <div class="header">
        <div class="octo" aria-hidden="true">
          <img
            alt=""
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          />
        </div>
        <div class="title">
          <div class="name">{{ fileName }}</div>
          <div class="meta">{{ fileMeta }}</div>
        </div>
      </div>

      <div class="buttons">
        <a :href="htmlUrl" class="btn-link" target="_blank" rel="noopener noreferrer"
          >View on GitHub</a
        >
        <a :href="rawUrl" class="btn-link" target="_blank" rel="noopener noreferrer">Raw</a>
        <button @click="handleDownload" type="button">Download</button>
        <button @click="handleCopyUrl" type="button">{{ copyUrlBtnText }}</button>
        <button @click="handleCopyContent" type="button">{{ copyContentBtnText }}</button>
      </div>

      <div class="footer-note">{{ footerNote }}</div>
    </div>
  </div>
</template>

<style scoped>
.outer {
  /* CSS variables only for this component*/
  /* TODO in the future maybe i didn't use fc or bg, update here */
  --w-min: 280px;
  --w-max: 510px; /* max width on desktop */
  --muted: #cfcfcf;
  --stroke: 2px;
  --stroke-color: rgba(255, 255, 255, 0.55);
  --radius: 16px;
  --btn-border: #fff;
  --btn-hover: rgba(255, 255, 255, 0.08);
  width: clamp(var(--w-min), 80vw, var(--w-max));
  margin: 10px auto;
  padding: var(--stroke);
  border-radius: calc(var(--radius) + var(--stroke));
  background: var(--stroke-color);
  color: var(--fc);
}

/* Compact inner box */
.box {
  background: var(--bg);
  border-radius: var(--radius);
  padding: 14px;
}

.header {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  min-width: 0;
}

.octo {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  flex: 0 0 auto;
}
.octo img {
  width: 24px;
  height: 24px;
  filter: invert(1);
  display: block;
}

.title {
  min-width: 0;
}

.name {
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Metadata line below the title */
.meta {
  font-size: 1.2rem;
  color: var(--muted);
  margin-top: 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Buttons that adjust and take up less vertical space on desktop */
.buttons {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

button,
.btn-link {
  appearance: none;
  background: transparent;
  color: var(--fc);
  border: 1px solid var(--btn-border);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

button:hover,
.btn-link:hover {
  background: var(--btn-hover);
}

.footer-note {
  margin-top: 0.6rem;
  font-size: 1.1rem;
  color: var(--muted);
}

/* Micro-adjustments on very narrow mobiles */
@media (max-width: 420px) {
  .name {
    font-size: 1.5rem;
  }
  button,
  .btn-link {
    padding: 6px 10px;
    font-size: 1.2rem;
  }
}
</style>
