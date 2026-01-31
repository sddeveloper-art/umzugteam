import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// Validate API key
function validateApiKey(req: Request): boolean {
  const apiKey = req.headers.get('x-api-key')
  const expectedKey = Deno.env.get('ADMIN_API_KEY')
  return apiKey === expectedKey && !!expectedKey
}

// Create Supabase client with service role for admin operations
function createAdminClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
}

// Parse route from URL
function parseRoute(url: URL): { resource: string; id: string | null; action: string | null } {
  const pathParts = url.pathname.split('/').filter(Boolean)
  // Path format: /admin-api/{resource}/{id?}/{action?}
  const resource = pathParts[1] || ''
  const id = pathParts[2] || null
  const action = pathParts[3] || null
  return { resource, id, action }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Validate API key
  if (!validateApiKey(req)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized', message: 'Invalid or missing API key' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createAdminClient()
  const url = new URL(req.url)
  const { resource, id, action } = parseRoute(url)

  try {
    // Route handling
    switch (resource) {
      case 'announcements':
        return await handleAnnouncements(req, supabase, id, action)
      case 'bids':
        return await handleBids(req, supabase, id)
      case 'competitors':
        return await handleCompetitors(req, supabase, id)
      case 'stats':
        return await handleStats(supabase)
      case 'sync':
        return await handleSync(req, supabase)
      default:
        return new Response(
          JSON.stringify({ 
            error: 'Not Found',
            message: 'Available endpoints: /announcements, /bids, /competitors, /stats, /sync',
            documentation: {
              announcements: 'GET/POST/PUT/DELETE - Manage moving announcements',
              bids: 'GET/POST/PUT/DELETE - Manage company bids',
              competitors: 'GET/POST/PUT/DELETE - Manage competitor pricing',
              stats: 'GET - Get system statistics',
              sync: 'POST - Bulk sync data from external admin'
            }
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// ============ ANNOUNCEMENTS ============
async function handleAnnouncements(
  req: Request,
  supabase: SupabaseClient,
  id: string | null,
  action: string | null
) {
  const method = req.method

  // Special action: mark as completed with winner
  if (action === 'complete' && id && method === 'POST') {
    const body = await req.json()
    const { winner_bid_id } = body

    const { data, error } = await supabase
      .from('moving_announcements')
      .update({ 
        status: 'completed', 
        winner_bid_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return jsonResponse({ success: true, data })
  }

  switch (method) {
    case 'GET': {
      if (id) {
        // Get single announcement with bids
        const { data: announcement, error: annError } = await supabase
          .from('moving_announcements')
          .select('*')
          .eq('id', id)
          .single()
        
        if (annError) throw annError

        const { data: bids, error: bidsError } = await supabase
          .from('company_bids')
          .select('*')
          .eq('announcement_id', id)
          .order('price', { ascending: true })

        if (bidsError) throw bidsError

        return jsonResponse({ ...(announcement as Record<string, unknown>), bids })
      }

      // List all announcements with filters
      const url = new URL(req.url)
      const status = url.searchParams.get('status')
      const limit = parseInt(url.searchParams.get('limit') || '50')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      let query = supabase
        .from('moving_announcements')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error, count } = await query
      if (error) throw error

      return jsonResponse({ data, total: count, limit, offset })
    }

    case 'POST': {
      const body = await req.json()
      const { data, error } = await supabase
        .from('moving_announcements')
        .insert([body])
        .select()
        .single()

      if (error) throw error
      return jsonResponse({ success: true, data }, 201)
    }

    case 'PUT': {
      if (!id) return errorResponse('ID required for update', 400)
      const body = await req.json()
      body.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('moving_announcements')
        .update(body)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return jsonResponse({ success: true, data })
    }

    case 'DELETE': {
      if (!id) return errorResponse('ID required for delete', 400)
      
      // First delete related bids
      await supabase.from('company_bids').delete().eq('announcement_id', id)
      
      const { error } = await supabase
        .from('moving_announcements')
        .delete()
        .eq('id', id)

      if (error) throw error
      return jsonResponse({ success: true, message: 'Deleted successfully' })
    }

    default:
      return errorResponse('Method not allowed', 405)
  }
}

// ============ BIDS ============
async function handleBids(
  req: Request,
  supabase: SupabaseClient,
  id: string | null
) {
  const method = req.method

  switch (method) {
    case 'GET': {
      if (id) {
        const { data, error } = await supabase
          .from('company_bids')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return jsonResponse(data)
      }

      const url = new URL(req.url)
      const announcementId = url.searchParams.get('announcement_id')
      const limit = parseInt(url.searchParams.get('limit') || '100')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      let query = supabase
        .from('company_bids')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (announcementId) {
        query = query.eq('announcement_id', announcementId)
      }

      const { data, error, count } = await query
      if (error) throw error

      return jsonResponse({ data, total: count, limit, offset })
    }

    case 'POST': {
      const body = await req.json()
      const { data, error } = await supabase
        .from('company_bids')
        .insert([body])
        .select()
        .single()

      if (error) throw error
      return jsonResponse({ success: true, data }, 201)
    }

    case 'PUT': {
      if (!id) return errorResponse('ID required for update', 400)
      const body = await req.json()
      body.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('company_bids')
        .update(body)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return jsonResponse({ success: true, data })
    }

    case 'DELETE': {
      if (!id) return errorResponse('ID required for delete', 400)
      const { error } = await supabase
        .from('company_bids')
        .delete()
        .eq('id', id)

      if (error) throw error
      return jsonResponse({ success: true, message: 'Deleted successfully' })
    }

    default:
      return errorResponse('Method not allowed', 405)
  }
}

// ============ COMPETITORS ============
async function handleCompetitors(
  req: Request,
  supabase: SupabaseClient,
  id: string | null
) {
  const method = req.method

  switch (method) {
    case 'GET': {
      if (id) {
        const { data, error } = await supabase
          .from('competitors')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        return jsonResponse(data)
      }

      const url = new URL(req.url)
      const activeOnly = url.searchParams.get('active_only') === 'true'

      let query = supabase.from('competitors').select('*').order('name')
      if (activeOnly) {
        query = query.eq('is_active', true)
      }

      const { data, error } = await query
      if (error) throw error

      return jsonResponse({ data })
    }

    case 'POST': {
      const body = await req.json()
      const { data, error } = await supabase
        .from('competitors')
        .insert([body])
        .select()
        .single()

      if (error) throw error
      return jsonResponse({ success: true, data }, 201)
    }

    case 'PUT': {
      if (!id) return errorResponse('ID required for update', 400)
      const body = await req.json()
      body.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('competitors')
        .update(body)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return jsonResponse({ success: true, data })
    }

    case 'DELETE': {
      if (!id) return errorResponse('ID required for delete', 400)
      const { error } = await supabase
        .from('competitors')
        .delete()
        .eq('id', id)

      if (error) throw error
      return jsonResponse({ success: true, message: 'Deleted successfully' })
    }

    default:
      return errorResponse('Method not allowed', 405)
  }
}

// Define types for stats
interface AnnouncementRow {
  status: string
  created_at: string
}

interface BidRow {
  price: number
  created_at: string
}

// ============ STATS ============
async function handleStats(supabase: SupabaseClient) {
  // Get announcement stats
  const { data: announcements, error: annError } = await supabase
    .from('moving_announcements')
    .select('status, created_at')

  if (annError) throw annError

  const annData = (announcements || []) as AnnouncementRow[]
  const announcementStats = {
    total: annData.length,
    active: annData.filter(a => a.status === 'active').length,
    expired: annData.filter(a => a.status === 'expired').length,
    completed: annData.filter(a => a.status === 'completed').length,
    thisMonth: annData.filter(a => {
      const created = new Date(a.created_at)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length
  }

  // Get bid stats
  const { data: bids, error: bidsError } = await supabase
    .from('company_bids')
    .select('price, created_at')

  if (bidsError) throw bidsError

  const bidsData = (bids || []) as BidRow[]
  const bidStats = {
    total: bidsData.length,
    averagePrice: bidsData.length > 0 ? bidsData.reduce((sum, b) => sum + b.price, 0) / bidsData.length : 0,
    lowestPrice: bidsData.length > 0 ? Math.min(...bidsData.map(b => b.price)) : 0,
    highestPrice: bidsData.length > 0 ? Math.max(...bidsData.map(b => b.price)) : 0,
    thisMonth: bidsData.filter(b => {
      const created = new Date(b.created_at)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length
  }

  // Get competitor count
  const { count: competitorCount } = await supabase
    .from('competitors')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return jsonResponse({
    announcements: announcementStats,
    bids: bidStats,
    competitors: { active: competitorCount || 0 },
    generatedAt: new Date().toISOString()
  })
}

// ============ SYNC (Bulk operations) ============
async function handleSync(req: Request, supabase: SupabaseClient) {
  if (req.method !== 'POST') {
    return errorResponse('Only POST method allowed for sync', 405)
  }

  const body = await req.json()
  const results: Record<string, unknown> = {}

  // Sync announcements if provided
  if (body.announcements && Array.isArray(body.announcements)) {
    const { data, error } = await supabase
      .from('moving_announcements')
      .upsert(body.announcements, { onConflict: 'id' })
      .select()

    if (error) throw error
    results.announcements = { synced: data?.length || 0 }
  }

  // Sync bids if provided
  if (body.bids && Array.isArray(body.bids)) {
    const { data, error } = await supabase
      .from('company_bids')
      .upsert(body.bids, { onConflict: 'id' })
      .select()

    if (error) throw error
    results.bids = { synced: data?.length || 0 }
  }

  // Sync competitors if provided
  if (body.competitors && Array.isArray(body.competitors)) {
    const { data, error } = await supabase
      .from('competitors')
      .upsert(body.competitors, { onConflict: 'id' })
      .select()

    if (error) throw error
    results.competitors = { synced: data?.length || 0 }
  }

  return jsonResponse({
    success: true,
    results,
    syncedAt: new Date().toISOString()
  })
}

// ============ HELPERS ============
function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function errorResponse(message: string, status: number) {
  return new Response(
    JSON.stringify({ error: true, message }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
