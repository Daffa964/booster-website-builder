import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { action, userId, orderId } = await req.json();

    if (action === 'verify_payment') {
      // Update user payment status
      const { error: userError } = await supabaseClient
        .from('User')
        .update({ 
          has_paid: true,
          is_verified: true,
          password: 'bibooster2024' // Default password setelah verifikasi
        })
        .eq('id', userId);

      if (userError) throw userError;

      // Update order status
      const { error: orderError } = await supabaseClient
        .from('Order')
        .update({ status: 'paid' })
        .eq('id', orderId);

      if (orderError) throw orderError;

      return new Response(
        JSON.stringify({ success: true, message: 'Payment verified successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get_pending_orders') {
      const { data: orders, error } = await supabaseClient
        .from('Order')
        .select(`
          *,
          User (*)
        `)
        .eq('status', 'pending')
        .order('createdAt', { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({ orders }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});