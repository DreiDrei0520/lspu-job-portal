import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './supabase/info.tsx'

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
)

export const getAccessToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}