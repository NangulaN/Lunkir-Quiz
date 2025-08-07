import { createClient } from '@supabase/supabase-js'

// Get these from your Supabase project settings
const supabaseUrl = 'https://nhftjoucqzbqqveizjpm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZnRqb3VjcXpicXF2ZWl6anBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NDI5NTYsImV4cCI6MjA3MDExODk1Nn0.O_vge60UXL5Il1CHjTSWuXywR38krRGlphkbSktP5Zs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)