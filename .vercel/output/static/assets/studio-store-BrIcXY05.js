import{o as e,s as t}from"./index-DUsRGlot.js";var n=t(e(),1),r=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},i=(e=>e?r(e):r),a=e=>e;function o(e,t=a){let r=n.useSyncExternalStore(e.subscribe,n.useCallback(()=>t(e.getState()),[e,t]),n.useCallback(()=>t(e.getInitialState()),[e,t]));return n.useDebugValue(r),r}var s=e=>{let t=i(e),n=e=>o(t,e);return Object.assign(n,t),n},c=(e=>e?s(e):s);function l(e,t){let n;try{n=e()}catch{return}return{getItem:e=>{let r=e=>e===null?null:JSON.parse(e,t?.reviver),i=n.getItem(e)??null;return i instanceof Promise?i.then(r):r(i)},setItem:(e,r)=>n.setItem(e,JSON.stringify(r,t?.replacer)),removeItem:e=>n.removeItem(e)}}var u=e=>t=>{try{let n=e(t);return n instanceof Promise?n:{then(e){return u(e)(n)},catch(e){return this}}}catch(e){return{then(e){return this},catch(t){return u(t)(e)}}}},d=(e,t)=>(n,r,i)=>{let a={storage:l(()=>window.localStorage),partialize:e=>e,version:0,merge:(e,t)=>({...t,...e}),...t},o=!1,s=0,c=new Set,d=new Set,f=a.storage;if(!f)return e((...e)=>{console.warn(`[zustand persist middleware] Unable to update item '${a.name}', the given storage is currently unavailable.`),n(...e)},r,i);let p=()=>{let e=a.partialize({...r()});return f.setItem(a.name,{state:e,version:a.version})},m=i.setState;i.setState=(e,t)=>(m(e,t),p());let h=e((...e)=>(n(...e),p()),r,i);i.getInitialState=()=>h;let g,_=()=>{if(!f)return;let e=++s;o=!1,c.forEach(e=>e(r()??h));let t=a.onRehydrateStorage?.call(a,r()??h)||void 0;return u(f.getItem.bind(f))(a.name).then(e=>{if(e)if(typeof e.version==`number`&&e.version!==a.version){if(a.migrate){let t=a.migrate(e.state,e.version);return t instanceof Promise?t.then(e=>[!0,e]):[!0,t]}console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`)}else return[!1,e.state];return[!1,void 0]}).then(t=>{if(e!==s)return;let[i,o]=t;if(g=a.merge(o,r()??h),n(g,!0),i)return p()}).then(()=>{e===s&&(t?.(r(),void 0),g=r(),o=!0,d.forEach(e=>e(g)))}).catch(n=>{e===s&&t?.(void 0,n)})};return i.persist={setOptions:e=>{a={...a,...e},e.storage&&(f=e.storage)},clearStorage:()=>{f?.removeItem(a.name)},getOptions:()=>a,rehydrate:()=>_(),hasHydrated:()=>o,onHydrate:e=>(c.add(e),()=>{c.delete(e)}),onFinishHydration:e=>(d.add(e),()=>{d.delete(e)})},a.skipHydration||_(),g||h},f=`import React from "react";

export default function App() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1C1D21] font-sans">
      <header className="border-b border-black/10 px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold tracking-tight">Aurora</h1>
        <nav className="flex gap-6 text-sm text-black/60">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <button className="rounded-lg bg-[#D96B43] px-4 py-2 text-white font-medium">
            Get started
          </button>
        </nav>
      </header>
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-medium tracking-widest text-[#D96B43] uppercase">
          Warm Brutalism
        </p>
        <h2 className="font-serif text-5xl font-bold leading-tight mb-6">
          Design that feels handmade
        </h2>
        <p className="text-lg text-black/60 mb-10 max-w-xl mx-auto">
          A starter landing page generated inside COSY Studio. Edit with AI agents and watch the preview update live.
        </p>
        <div className="flex justify-center gap-3">
          <button className="rounded-xl bg-[#D96B43] px-6 py-3 text-white font-medium shadow-[4px_4px_0_#1C1D21]">
            Start building
          </button>
          <button className="rounded-xl border-2 border-[#1C1D21] px-6 py-3 font-medium">
            View demo
          </button>
        </div>
      </section>
    </main>
  );
}
`,p=`/* Warm Brutalism tokens */
:root {
  --cream: #F4F1EA;
  --charcoal: #1C1D21;
  --terracotta: #D96B43;
}

body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: var(--cream);
  color: var(--charcoal);
}
`;function m(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function h(e,t,n){return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, system-ui, sans-serif; background: #F4F1EA; color: #1C1D21; min-height: 100vh; }
    header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(28,29,33,0.1); }
    .logo { font-family: "Playfair Display", Georgia, serif; font-size: 1.35rem; font-weight: 700; }
    nav { display: flex; gap: 1.25rem; align-items: center; font-size: 0.875rem; color: rgba(28,29,33,0.55); }
    .btn { background: #D96B43; color: white; border: none; border-radius: 0.65rem; padding: 0.55rem 1rem; font-weight: 500; font-size: 0.875rem; cursor: pointer; box-shadow: 3px 3px 0 #1C1D21; }
    .btn-outline { background: transparent; color: #1C1D21; border: 2px solid #1C1D21; border-radius: 0.75rem; padding: 0.7rem 1.25rem; font-weight: 500; cursor: pointer; }
    .btn-primary { background: #D96B43; color: white; border: none; border-radius: 0.75rem; padding: 0.75rem 1.5rem; font-weight: 500; cursor: pointer; box-shadow: 4px 4px 0 #1C1D21; }
    main { max-width: 42rem; margin: 0 auto; padding: 4rem 1.5rem; text-align: center; }
    .eyebrow { font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase; color: #D96B43; font-weight: 600; margin-bottom: 1rem; }
    h1 { font-family: "Playfair Display", Georgia, serif; font-size: clamp(2rem, 6vw, 3rem); line-height: 1.15; margin-bottom: 1.25rem; }
    p { color: rgba(28,29,33,0.6); font-size: 1.05rem; line-height: 1.6; margin-bottom: 2rem; }
    .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    .card-grid { display: grid; gap: 1rem; margin-top: 3rem; text-align: left; }
    @media (min-width: 640px) { .card-grid { grid-template-columns: 1fr 1fr; } }
    .card { background: white; border: 1px solid rgba(28,29,33,0.1); border-radius: 1rem; padding: 1.25rem; box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
    .card h3 { font-family: "Playfair Display", Georgia, serif; margin-bottom: 0.4rem; }
    .card p { font-size: 0.9rem; margin: 0; }
    .badge { display: inline-block; background: rgba(217,107,67,0.12); color: #C85A32; font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.55rem; border-radius: 999px; margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <header>
    <div class="logo">${m(e)}</div>
    <nav>
      <span>Features</span>
      <span>Pricing</span>
      <button class="btn">Get started</button>
    </nav>
  </header>
  <main>
    <p class="eyebrow">Warm Brutalism</p>
    <h1>${m(t)}</h1>
    <p>${m(n)}</p>
    <div class="actions">
      <button class="btn-primary">Start building</button>
      <button class="btn-outline">View demo</button>
    </div>
    <div class="card-grid">
      <div class="card">
        <div class="badge">G0 Planner</div>
        <h3>Architecture first</h3>
        <p>Tasks broken into component graphs before a single line is written.</p>
      </div>
      <div class="card">
        <div class="badge">Live Preview</div>
        <h3>Instant feedback</h3>
        <p>Hot-reload frames for phone, tablet, and desktop side by side with your diff.</p>
      </div>
    </div>
  </main>
</body>
</html>`}var g=h(`Aurora`,`Design that feels handmade`,`A starter landing page generated inside COSY Studio.`),_={"src/App.tsx":{path:`src/App.tsx`,language:`typescript`,content:f},"src/styles.css":{path:`src/styles.css`,language:`css`,content:p},"package.json":{path:`package.json`,language:`json`,content:`{
  "name": "aurora-landing",
  "private": true,
  "version": "0.1.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
`}},v=[{id:`g0`,agent:`G0_PLANNER`,label:`Planner`,status:`idle`,payload:`Waiting for prompt`},{id:`g1`,agent:`G1_CODER`,label:`Coder`,status:`idle`,payload:`Waiting for plan`},{id:`g2`,agent:`G2_AUDITOR`,label:`Auditor`,status:`idle`,payload:`Waiting for code`}];function y(e,t){if(e===t)return[];let n=e.split(`
`),r=t.split(`
`),i=[],a=0,o=-1,s=Math.max(n.length,r.length);for(let e=0;e<s;e++)(n[e]??``)===(r[e]??``)?o!==-1&&(i.push({id:`chunk-${a++}`,startLine:o+1,endLine:e,type:`modify`,accepted:null}),o=-1):o===-1&&(o=e);return o!==-1&&i.push({id:`chunk-${a++}`,startLine:o+1,endLine:s,type:`modify`,accepted:null}),i.length?i:[{id:`chunk-0`,startLine:1,endLine:r.length,type:`modify`,accepted:null}]}var b=c()(d((e,t)=>({theme:`light`,planTier:`PRO`,promptsUsed:12,promptLimit:9999,device:`mobile`,activeFile:`src/App.tsx`,files:_,originalCode:f,modifiedCode:f,language:`typescript`,diffChunks:[],agents:v,isPipelineRunning:!1,pipelinePhase:`idle`,pipelineProgress:0,pipelineProgressLabel:``,taskGraph:[],chat:[{id:`welcome`,role:`system`,content:`COSY multi-agent pipeline ready. Describe a UI change — G0 plans, G1 codes, G2 audits.`,timestamp:Date.now()}],pendingApproval:null,showRejectionPoll:!1,lastPrompt:``,previewHtml:g,previewKey:0,commandOpen:!1,mobilePanel:`chat`,publishUrl:null,showcase:[{id:`1`,name:`Aurora Landing`,description:`Warm brutalist product landing with glass cards`,author:`erik`,remixes:128,url:`aurora.cosy.studio`,tags:[`landing`,`brutalism`]},{id:`2`,name:`Ledger Dashboard`,description:`Finance overview with terracotta metrics`,author:`maya`,remixes:84,url:`ledger.cosy.studio`,tags:[`dashboard`,`fintech`]},{id:`3`,name:`Nomad Portfolio`,description:`Editorial portfolio for product designers`,author:`jules`,remixes:56,url:`nomad.cosy.studio`,tags:[`portfolio`,`serif`]}],telemetry:[],pipelineLatencyMs:0,_abort:null,setTheme:t=>{e({theme:t}),typeof document<`u`&&document.documentElement.classList.toggle(`dark`,t===`dark`)},toggleTheme:()=>{let e=t().theme===`light`?`dark`:`light`;t().setTheme(e)},setDevice:t=>e({device:t}),setActiveFile:n=>{let r=t().files[n];r&&e({activeFile:n,originalCode:r.content,modifiedCode:r.content,language:r.language,diffChunks:[]})},setCommandOpen:t=>e({commandOpen:t}),setMobilePanel:t=>e({mobilePanel:t}),setPlanTier:t=>e({planTier:t,promptLimit:t===`FREE`?100:9999}),setAgents:t=>e({agents:t}),updateAgent:(n,r)=>e({agents:t().agents.map(e=>e.id===n?{...e,...r}:e)}),addChat:n=>e({chat:[...t().chat,{...n,id:`msg-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,timestamp:Date.now()}]}),setDiff:(n,r,i)=>e({originalCode:n,modifiedCode:r,language:i??t().language,diffChunks:y(n,r)}),streamModifiedCode:n=>e({modifiedCode:n,diffChunks:y(t().originalCode,n)}),acceptChunk:n=>e({diffChunks:t().diffChunks.map(e=>e.id===n?{...e,accepted:!0}:e)}),rejectChunk:n=>e({diffChunks:t().diffChunks.map(e=>e.id===n?{...e,accepted:!1}:e)}),acceptAllDiffs:()=>{let{modifiedCode:n,activeFile:r,files:i,language:a}=t();e({originalCode:n,files:{...i,[r]:{path:r,language:a,content:n}},diffChunks:t().diffChunks.map(e=>({...e,accepted:!0}))})},rejectAllDiffs:()=>{e({modifiedCode:t().originalCode,diffChunks:[]})},setPendingApproval:t=>e({pendingApproval:t}),approvePending:()=>{let n=t().pendingApproval;n&&(t().acceptAllDiffs(),t().setPreviewHtml(n.previewHtml),t().addChat({role:`assistant`,content:`Approved: ${n.title}. Changes written to project.`,agent:`G2_AUDITOR`}),t().addTelemetry({prompt:t().lastPrompt,status:`APPROVED`,agentType:`G0-G1-G2`,latencyMs:t().pipelineLatencyMs}),e({pendingApproval:null}))},rejectPending:()=>{t().rejectAllDiffs(),e({pendingApproval:null,showRejectionPoll:!0})},submitRejection:n=>{t().addTelemetry({prompt:t().lastPrompt,status:`REJECTED`,rejectionReason:n,agentType:`G0-G1-G2`,latencyMs:t().pipelineLatencyMs}),t().addChat({role:`system`,content:`Rejection recorded (${n??`no reason`}). Feedback loop updated.`}),e({showRejectionPoll:!1})},dismissRejectionPoll:()=>{t().addTelemetry({prompt:t().lastPrompt,status:`REJECTED`,rejectionReason:null,agentType:`G0-G1-G2`,latencyMs:t().pipelineLatencyMs}),e({showRejectionPoll:!1})},setPreviewHtml:n=>e({previewHtml:n,previewKey:t().previewKey+1}),refreshPreview:()=>e({previewKey:t().previewKey+1}),setPipelineRunning:t=>e({isPipelineRunning:t}),setPipelinePhase:t=>e({pipelinePhase:t}),setPipelineProgress:(n,r)=>e({pipelineProgress:n,pipelineProgressLabel:r??t().pipelineProgressLabel}),setTaskGraph:t=>e({taskGraph:t}),beginPipeline:()=>{t()._abort?.abort();let n=new AbortController;return e({_abort:n,isPipelineRunning:!0,pipelinePhase:`planning`,pipelineProgress:0,pipelineProgressLabel:`Starting…`,taskGraph:[]}),n.signal},cancelPipeline:()=>{t()._abort?.abort(),e({_abort:null,isPipelineRunning:!1,pipelinePhase:`cancelled`,pipelineProgressLabel:`Cancelled`}),t().addChat({role:`system`,content:`Pipeline cancelled by user.`})},incrementPrompts:()=>e({promptsUsed:t().promptsUsed+1}),setPublishUrl:t=>e({publishUrl:t}),addTelemetry:n=>e({telemetry:[{...n,id:`tel-${Date.now()}`,createdAt:Date.now()},...t().telemetry].slice(0,50)}),updateFileContent:(n,r)=>{let i={...t().files};i[n]={path:n,language:i[n]?.language??`typescript`,content:r},e({files:i})},setPipelineLatency:t=>e({pipelineLatencyMs:t}),resetAgents:()=>e({agents:v.map(e=>({...e})),taskGraph:[],pipelineProgress:0,pipelineProgressLabel:``,pipelinePhase:`idle`})}),{name:`cosy-studio-v1`,partialize:e=>({theme:e.theme,planTier:e.planTier,promptsUsed:e.promptsUsed,device:e.device,files:e.files,previewHtml:e.previewHtml,telemetry:e.telemetry,showcase:e.showcase,publishUrl:e.publishUrl})}));export{b as n,h as t};