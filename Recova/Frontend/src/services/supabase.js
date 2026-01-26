import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hyspncvztfiefpxgaumo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5c3BuY3Z6dGZpZWZweGdhdW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTgyNDQsImV4cCI6MjA4Mzk5NDI0NH0.gsg8B4sW5gg4Ak7OiNnMYya07N4CnUw6a3cjHFm-ceg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
