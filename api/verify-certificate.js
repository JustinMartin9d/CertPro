import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
    const { certId } = req.query;
    if (!certId) return res.status(400).json({ error: 'Certificate ID required' });
    const { data, error } = await supabase.from('certificates').select('*').eq('cert_id', certId.toUpperCase()).single();
    if (error || !data) return res.status(404).json({ found: false });
    const isHosted = data.hosted && new Date(data.hosted_until) > new Date();
    if (!isHosted) return res.status(404).json({ found: false });
    res.status(200).json({ found: true, name: data.user_name, cert: data.certification, certId: data.cert_id, date: new Date(data.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), score: data.score + '%', expiry: new Date(data.hosted_until).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}