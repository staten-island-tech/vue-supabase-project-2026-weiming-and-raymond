import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_Supabase_URL ||
  import.meta.env.SUPABASE_URL ||
  import.meta.env.Supabase_URL

const supabaseKey =
  import.meta.env.VITE_SUPABASE_KEY ||
  import.meta.env.VITE_Supabase_Key ||
  import.meta.env.SUPABASE_KEY ||
  import.meta.env.Supabase_Key

let supabase = null

function _makeId() {
  try {
    return crypto && crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}`
  } catch (e) {
    return `id_${Date.now()}`
  }
}

function createMockSupabase() {
  console.warn(
    'Supabase env missing — using localStorage-backed mock Supabase client for preview/development',
  )

  const STORAGE_KEY = 'mock_supabase_v1'
  let saved = null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    saved = raw ? JSON.parse(raw) : null
  } catch (e) {
    saved = null
  }

  const authUsers = (saved && saved.authUsers) || []
  const tables = (saved && saved.tables) || {}
  let currentUser = (saved && saved.currentUser) || null

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ authUsers, tables, currentUser }))
    } catch (e) {}
  }

  return {
    auth: {
      async signUp({ email, password }) {
        const id = _makeId()
        authUsers.push({ id, email, password })
        currentUser = { id, email }
        persist()
        return { data: { user: { id, email } }, error: null }
      },
      async signInWithPassword({ email, password }) {
        const u = authUsers.find((x) => x.email === email && x.password === password)
        if (!u) return { data: null, error: { message: 'Invalid credentials' } }
        currentUser = { id: u.id, email: u.email }
        persist()
        return { data: { user: currentUser }, error: null }
      },
      async signOut() {
        currentUser = null
        persist()
        return { error: null }
      },
      async getUser() {
        return { data: { user: currentUser }, error: null }
      },
      async getSession() {
        const session = currentUser ? { user: currentUser } : null
        return { data: { session }, error: null }
      },
    },
    from(table) {
      tables[table] = tables[table] || []

      return {
        insert: async (obj) => {
          const row = { ...obj }
          if (!row.id) row.id = _makeId()
          if (!row.created_at) row.created_at = new Date().toISOString()
          tables[table].push(row)
          persist()
          return { data: [row], error: null }
        },
        select: () => ({
          order: async (col, opts = { ascending: true }) => {
            let data = Array.from(tables[table])
            if (col) {
              data.sort((a, b) => {
                const va = a[col]
                const vb = b[col]
                if (va === vb) return 0
                return opts && opts.ascending === false ? (vb > va ? 1 : -1) : va > vb ? 1 : -1
              })
            }
            return { data, error: null }
          },
        }),
      }
    },
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Supabase client not initialized. Missing environment variables.\n' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY (Netlify: Site settings → Build & deploy → Environment).\n' +
      'For local development this project will use a small in-memory mock Supabase client instead.',
  )
  supabase = createMockSupabase()
} else {
  supabase = createClient(supabaseUrl, supabaseKey)
}

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_KEY are set and redeploy.',
    )
  }

  return supabase
}

export { supabase, requireSupabase }
