const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});
const corsHeaders = {};
const encoder = new TextEncoder();

async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {name:"HMAC", hash:"SHA-256"}, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
async function makeToken(secret) {
  const payload = btoa(JSON.stringify({exp:Date.now()+8*60*60*1000, role:"admin"})).replace(/=/g,"");
  return payload+"."+await sign(payload,secret);
}
async function authorized(request, secret) {
  const h=request.headers.get("Authorization")||"";
  const token=h.startsWith("Bearer ")?h.slice(7):"";
  const [payload,sig]=token.split(".");
  if(!payload||!sig||sig!==await sign(payload,secret))return false;
  try { const data=JSON.parse(atob(payload)); return data.role==="admin"&&data.exp>Date.now(); } catch { return false; }
}
async function body(request) { try{return await request.json()}catch{return null} }
export async function onRequest({request,env}) {
  const url=new URL(request.url), path=url.pathname.replace(/^\/api\/?/,"").split("/").filter(Boolean);
  const method=request.method.toUpperCase();
  if(!env.DB)return json({error:"Database D1 belum terhubung."},503);
  if(path[0]==="login"&&method==="POST"){
    const data=await body(request);
    if(!env.ADMIN_PASSWORD||!env.TOKEN_SECRET)return json({error:"ADMIN_PASSWORD dan TOKEN_SECRET belum disetel."},500);
    if(!data||data.password!==env.ADMIN_PASSWORD)return json({error:"Password admin salah."},401);
    return json({token:await makeToken(env.TOKEN_SECRET)});
  }
  if(path[0]!=="products")return json({error:"Endpoint tidak ditemukan."},404);
  if(method==="GET"){
    const {results}=await env.DB.prepare("SELECT id,name,category,price,description,image FROM products ORDER BY created_at DESC").all();
    return json({products:results||[]});
  }
  if(!await authorized(request,env.TOKEN_SECRET||""))return json({error:"Akses admin diperlukan."},401);
  if(method==="POST"&&path.length===1){
    const d=await body(request);
    if(!d||!String(d.name||"").trim()||!Number.isFinite(Number(d.price)))return json({error:"Data produk tidak valid."},400);
    const r=await env.DB.prepare("INSERT INTO products(name,category,price,description,image) VALUES(?,?,?,?,?)").bind(String(d.name).trim(),String(d.category||"Lainnya"),Number(d.price),String(d.description||""),String(d.image||"")).run();
    return json({ok:true,id:r.meta.last_row_id},201);
  }
  const id=Number(path[1]);
  if(!Number.isInteger(id)||id<1)return json({error:"ID produk tidak valid."},400);
  if(method==="PUT"){
    const d=await body(request);
    if(!d||!String(d.name||"").trim()||!Number.isFinite(Number(d.price)))return json({error:"Data produk tidak valid."},400);
    await env.DB.prepare("UPDATE products SET name=?,category=?,price=?,description=?,image=? WHERE id=?").bind(String(d.name).trim(),String(d.category||"Lainnya"),Number(d.price),String(d.description||""),String(d.image||""),id).run();
    return json({ok:true});
  }
  if(method==="DELETE"){await env.DB.prepare("DELETE FROM products WHERE id=?").bind(id).run();return json({ok:true});}
  return json({error:"Method tidak didukung."},405);
}