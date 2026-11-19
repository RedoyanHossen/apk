// CDN script gulo download kore app-er bhitore rakhe, jate app fast load hoy
const fs=require('fs'),path=require('path'),https=require('https');
const f='www/index.html';let html=fs.readFileSync(f,'utf8');
fs.mkdirSync('www/vendor',{recursive:true});
const get=u=>new Promise((res,rej)=>https.get(u,r=>{
  if(r.statusCode>=300&&r.statusCode<400&&r.headers.location)return res(get(r.headers.location));
  const c=[];r.on('data',d=>c.push(d));r.on('end',()=>res(Buffer.concat(c)));}).on('error',rej));
(async()=>{
  const re=/<script src="(https:\/\/(?:cdn\.tailwindcss\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)[^"]+)"/g;
  let m,i=0;const jobs=[];
  while((m=re.exec(html))){jobs.push(m[1]);}
  for(const u of jobs){
    const name='lib'+(i++)+'.js';
    const buf=await get(u);fs.writeFileSync('www/vendor/'+name,buf);
    html=html.replace('src="'+u+'"','src="vendor/'+name+'"');
    console.log('vendored',u,buf.length);
  }
  fs.writeFileSync(f,html);
})();
