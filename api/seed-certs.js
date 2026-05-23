import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
  
  const certs = [
    {cert_id:'CPM-748291',user_name:'Justin Martin',user_email:'Justin.Martin789@gmail.com',certification:'Project Management Professional (PMP)',score:92,issued_at:'2026-05-23T11:00:55.915Z',hosted:true,hosted_until:'2027-05-23T11:00:55.915Z'},
    {cert_id:'CAI-583047',user_name:'Justin Martin',user_email:'Justin.Martin789@gmail.com',certification:'Certified Project Manager — AI (CPMAI)',score:88,issued_at:'2026-05-23T11:00:55.915Z',hosted:true,hosted_until:'2027-05-23T11:00:55.915Z'},
    {cert_id:'CCB-916374',user_name:'Justin Martin',user_email:'Justin.Martin789@gmail.com',certification:'Certified Business Process Professional (CBPP)',score:90,issued_at:'2026-05-23T11:00:55.915Z',hosted:true,hosted_until:'2027-05-23T11:00:55.915Z'}
  ];

  const { data, error } = await supabase.from('certificates').upsert(certs, {onConflict:'cert_id'}).select();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true, inserted: data.length, ids: data.map(c => c.cert_id) });
}