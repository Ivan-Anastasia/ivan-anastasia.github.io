export function weddingDateParts(value,timeZone='Europe/Moscow') {
  if(!value || !/(Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
  const d=new Date(value); if(Number.isNaN(d.getTime())) return null;
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  return {year:+p.year,month:+p.month-1,day:+p.day,date:d};
}
export function calendarCells(parts) {
  if(!parts)return [];
  const offset=(new Date(Date.UTC(parts.year,parts.month,1)).getUTCDay()+6)%7;
  const count=new Date(Date.UTC(parts.year,parts.month+1,0)).getUTCDate();
  const cells=Array(offset).fill(null).concat(Array.from({length:count},(_,i)=>i+1));
  while(cells.length%7)cells.push(null);
  return cells;
}
export function countdown(value,now=Date.now()) {
  const target=value?new Date(value).getTime():NaN;
  if(!Number.isFinite(target))return null;
  const remaining=Math.max(0,Math.floor((target-now)/1000));
  return {days:Math.floor(remaining/86400),hours:Math.floor(remaining/3600)%24,minutes:Math.floor(remaining/60)%60,seconds:remaining%60,complete:target<=now};
}

