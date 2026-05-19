import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const body = await req.json();
    const { full_name, email, mobile_number, city, address, date_of_birth } = body ?? {};

    const html = `
      <h2>New User Signed Up — Nearby Estate Service</h2>
      <ul>
        <li><b>Name:</b> ${full_name ?? ''}</li>
        <li><b>Email:</b> ${email ?? ''}</li>
        <li><b>Mobile:</b> ${mobile_number ?? ''}</li>
        <li><b>City:</b> ${city ?? ''}</li>
        <li><b>Address:</b> ${address ?? ''}</li>
        <li><b>Date of Birth:</b> ${date_of_birth ?? ''}</li>
      </ul>
      <p>Signed up at ${new Date().toISOString()}</p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Nearby Estate Service <onboarding@resend.dev>',
        to: ['indiahello17@gmail.com'],
        subject: `New Signup: ${full_name ?? email ?? 'Unknown'}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Resend error', data);
      return new Response(JSON.stringify({ success: false, error: data }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
