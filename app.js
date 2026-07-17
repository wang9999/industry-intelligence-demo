'use strict';
const industrySelect=document.getElementById('industry');
const queryInput=document.getElementById('query');
const list=document.getElementById('news-list');
const total=document.getElementById('total');
const updated=document.getElementById('updated');
let dataset={items:[],industries:[]};
function safeLink(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:'#';}catch{return '#';}}
function render(){const industry=industrySelect.value;const q=queryInput.value.trim().toLocaleLowerCase();const items=dataset.items.filter(item=>(!industry||item.industry_id===industry)&&(!q||[item.title,item.summary,item.source_name,item.industry_name].join(' ').toLocaleLowerCase().includes(q)));list.replaceChildren();total.textContent=String(items.length);if(!items.length){const empty=document.createElement('div');empty.className='empty';empty.textContent='没有符合条件的资讯';list.append(empty);return;}for(const item of items){const article=document.createElement('article');article.className='news';const title=document.createElement('a');title.className='title';title.target='_blank';title.rel='noopener noreferrer';title.href=safeLink(item.original_url);title.textContent=item.title;const meta=document.createElement('div');meta.className='meta';const badge=document.createElement('span');badge.className='badge';badge.textContent=item.industry_name;meta.append(badge,document.createTextNode(`${item.source_name} · ${item.published_at.slice(0,10)}`));const summary=document.createElement('div');summary.className='summary';summary.textContent=item.summary;article.append(title,meta,summary);list.append(article);}}
fetch('./data/news.json',{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error('数据加载失败');return response.json();}).then(data=>{dataset=data;for(const industry of data.industries){const option=document.createElement('option');option.value=industry.id;option.textContent=industry.name;industrySelect.append(option);}updated.textContent=data.generated_at.slice(0,10);render();}).catch(error=>{list.textContent=error.message;});
industrySelect.addEventListener('change',render);queryInput.addEventListener('input',render);
