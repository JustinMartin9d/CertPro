export default async function handler(req, res) {
  try {
    const url = process.env.SUPABASE_URL + '/rest/v1/certificates';
    const key = process.env.SUPABASE_SECRET_KEY;
    
    const certs = [
      {cert_id:'CPM-748291',user_name:'Justin Martin',user_email:'Justin.Martin789@gmail.com',certification:'Project Management Professional (PMP)',score:92,issued_at:'2026-05-23T11:07:42.048Z',hosted:true,hosted_until:'2027-05-23T11:07:42.048Z'},
      {cert_id:'CAI-583047',user_name:'Justin Martin',user_email:'Justin.Martin789@gmail.com',certification:'Certified Project Manager — AI (CPMAI)',score:88,issued_at:'2026-05-23T11:07:42.048Z',hosted:true,hosted_until:'2027-05-23T11:07:42.048Z'},
      {cert_id:'CCB-916374',user_name:'Justin Martin',user_email:'Justin.Martin789@gmail.com',certification:'Certified Business Process Professional (CBPP)',score:90,issued_at:'2026-05-23T11:07:42.048Z',hosted:true,hosted_until:'2027-05-23T11:07:42.048Z'}
    ];

    const r = await fetch(url + '?on_conflict=cert_id', {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation,resolution=merge-duplicates'
      },
      body: JSON.stringify(certs)
    });
    const data = await r.json();
    return res.status(200).json({status: r.status, data: data, url: url.substring(0,50)});
  } catch(e) {
    return res.status(500).json({error: e.message, stack: e.stack?.substring(0,200)});
  }
}