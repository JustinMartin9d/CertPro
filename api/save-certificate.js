import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
    const { certId, userName, userEmail, certification, score } = req.body;
    await supabase.from('exam_results').insert({ user_email: userEmail, certification, score, passed: score >= 70, created_at: new Date().toISOString() });
    const { data, error } = await supabase.from('certificates').insert({ cert_id: certId, user_name: userName, user_email: userEmail, certification, score, issued_at: new Date().toISOString(), hosted: false }).select();
    if (error) throw error;
    await supabase.from('users').upsert({ name: userName, email: userEmail }, { onConflict: 'email' });
    res.status(200).json({ success: true, certificate: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}