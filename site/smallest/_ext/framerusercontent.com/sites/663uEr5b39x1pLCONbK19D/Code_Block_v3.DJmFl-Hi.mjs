import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{A as t,B as n,F as r,H as i,I as a,L as o,P as ee,T as s,V as te,c as ne,i as re,l as c,o as l,s as u,u as d}from"./react.DtujDRE0.mjs";import{c as f,lt as p,z as m}from"./framer.B81LqQ9I.mjs";function h(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`)}function g(e,t){let n=[],r=0;for(;r<e.length;){let i=null;for(let{type:n,regex:a}of t){a.lastIndex=r;let t=a.exec(e);t&&(i===null||t.index<i.start)&&(i={start:t.index,end:t.index+t[0].length,type:n})}if(!i){n.push({type:null,text:e.slice(r)});break}i.start>r&&n.push({type:null,text:e.slice(r,i.start)}),n.push({type:i.type,text:e.slice(i.start,i.end)}),r=i.end}return n}function _(e){return e.map(e=>{let t=h(e.text);return e.type?`<span class="tok-${e.type}">${t}</span>`:t}).join(``)}function ie(e,t){return t===`typescript`||t===`javascript`?_(g(e,C)):t===`python`?_(g(e,w)):t===`curl`?_(g(e,T)):h(e)}function ae(e){let t=e.replace(`#`,``).trim();if(t.length!==6)return`#262626`;let n=Math.min(255,parseInt(t.slice(0,2),16)+18),r=Math.min(255,parseInt(t.slice(2,4),16)+18),i=Math.min(255,parseInt(t.slice(4,6),16)+18);return`#${n.toString(16).padStart(2,`0`)}${r.toString(16).padStart(2,`0`)}${i.toString(16).padStart(2,`0`)}`}function oe(e){if(!e)return{};let{height:t,minHeight:n,maxHeight:r,...i}=e;return i}function v(e,t,n,r){let i=typeof e==`number`?e:Number(e);return Number.isFinite(i)?Math.min(r,Math.max(n,i)):t}function y(e){let{style:n,controlsLayout:s=`row`,appearanceSettings:l,typographySettings:u,codeSnippets:f=b,snippetPreset:p=`custom`,showLanguageDropdown:m=!0,apiKeyUrl:h=``,buttonLabel:g=`Get API key`,background:_=`#FFFFFF`,border:y=`#E5E5E5`,codeText:C=`#404040`,codeHighlight:w=`#0066CC`,buttonText:T=`#FAFAFA`,buttonBackground:E=`#171717`,copyHover:se=`#F5F5F5`,languageBackground:ce=`#F5F5F5`,menuBackground:le=`#FFFFFF`,menuBorder:ue=`#EBEBEB`,menuItemHover:de=`#FAFAFA`,lineNumberColor:fe=`#D4D4D4`,borderRadius:pe=24,fontSize:me=14,lineHeight:he=20,codeFontSize:D=16,codeLineHeight:ge=26,copySuccessBackground:_e=`#DCFCE7`}=e,O=l?.customize?l:void 0,k=O?.background??_,ve=O?.border??y,A=O?.codeText??C,j=O?.codeHighlight??w,M=O?.buttonText??T,N=O?.buttonBackground??E,P=O?.copyHover??se,F=O?.languageBackground??ce,ye=O?.menuBackground??le,be=O?.menuBorder??ue,xe=O?.menuItemHover??de,Se=O?.lineNumberColor??fe,I=O?.copySuccessBackground??_e,Ce=v(O?.borderRadius,pe,0,48),L=u?.customize?u:void 0,R=v(L?.fontSize,me,10,20),z=v(L?.lineHeight,he,14,32),we=v(L?.codeFontSize,D,10,24),Te=v(L?.codeLineHeight,ge,16,40),B=p.trim().toLowerCase(),V=B===`stt`?x:B===`tts`?S:f?.length?f:b,[Ee,De]=o(0),[H,U]=o(!1),[W,G]=o(!1);r(()=>{m||U(!1)},[m]);let[K,Oe]=o({top:0,left:0}),q=Math.min(Ee,Math.max(0,V.length-1)),J=V[q]??V[0],ke=J.code.split(`
`),Y=t(null),X=t(null),Z=t(null),Q=ee(()=>{if(!Y.current)return;let e=Y.current.getBoundingClientRect();Oe({left:e.left,top:e.bottom+8})},[]);r(()=>{if(H)return Q(),i.addEventListener(`resize`,Q),i.addEventListener(`scroll`,Q,!0),()=>{i.removeEventListener(`resize`,Q),i.removeEventListener(`scroll`,Q,!0)}},[H,Q]),r(()=>{let e=e=>{let t=e.target;X.current?.contains(t)||Y.current?.contains(t)||U(!1)};return document.addEventListener(`click`,e),()=>document.removeEventListener(`click`,e)},[]);let Ae=async()=>{try{await te.clipboard.writeText(J.code),G(!0),Z.current&&clearTimeout(Z.current),Z.current=setTimeout(()=>{G(!1)},2200)}catch{G(!1)}},je=ae(N),$=n?.height===`100%`;return d(ne,{children:[c(`style`,{children:`
                @font-face {
                    font-family: "Geist Mono Perf";
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url("https://fonts.gstatic.com/s/geistmono/v6/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeE9KK5U5Cl4PuCTfNg.woff2") format("woff2");
                    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }

                .code-snippet-root .tok-keyword {
                    color: #7c3aed;
                }

                .code-snippet-root .tok-property,
                .code-snippet-root .tok-variable {
                    color: var(--highlight);
                }

                .code-snippet-root .tok-string {
                    color: #166534;
                }

                .code-snippet-root .tok-comment {
                    color: #737373;
                }

                .code-snippet-root .tok-command {
                    color: #7c3aed;
                }

                .code-snippet-root .tok-flag {
                    color: #be185d;
                }

                .code-snippet-root .tok-env {
                    color: #0f766e;
                }

                .code-snippet-root .code-scroll {
                    width: 100%;
                    overflow-x: auto;
                    overflow-y: hidden;

                    scrollbar-width: none;
                    -ms-overflow-style: none;

                    overscroll-behavior-x: contain;
                    overscroll-behavior-y: auto;

                    touch-action: pan-y pan-x;

                    -webkit-overflow-scrolling: touch;
                }

                .code-snippet-root .code-scroll::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }

                .code-snippet-root .icon-btn,
                .code-snippet-root .lang-btn,
                .code-snippet-root .cta-btn {
                    transition:
                        transform 120ms cubic-bezier(0.4, 0, 0.2, 1),
                        background-color 160ms ease,
                        box-shadow 160ms ease;
                }

                .code-snippet-root .icon-btn:hover {
                    background: var(--copy-hover) !important;
                }

                .code-snippet-root .icon-btn[data-copied="true"] {
                    background: var(--copy-success) !important;
                }

                .code-snippet-root .lang-btn:hover,
                .code-snippet-root .lang-btn[data-open="true"] {
                    background: var(--language-hover) !important;
                }

                .code-snippet-root .cta-btn:hover {
                    background: var(--button-hover) !important;
                    box-shadow:
                        0 2px 8px rgba(0, 0, 0, 0.18);
                }

                .code-snippet-root .icon-btn:active,
                .code-snippet-root .lang-btn:active,
                .code-snippet-root .cta-btn:active {
                    transform: scale(0.96);
                }
            `}),c(`div`,{className:`code-snippet-root`,style:{position:`relative`,width:`100%`,height:$?`100%`:`max-content`,minHeight:$?0:`max-content`,overflow:$?`auto`:`visible`,boxSizing:`border-box`,transition:`height 280ms cubic-bezier(0.4, 0, 0.2, 1)`,"--highlight":j,"--copy-hover":P,"--copy-success":I,"--language-hover":F,"--button-hover":je,...oe(n)},children:d(`div`,{style:{background:k,border:`1px solid ${ve}`,borderRadius:Ce,padding:16,overflow:`hidden`,boxSizing:`border-box`,fontFamily:`"Aeonik Regular", Arial, sans-serif`},children:[c(`div`,{className:`code-scroll`,children:c(`div`,{style:{display:`grid`,gridTemplateColumns:`28px max-content`,columnGap:10,width:`max-content`,minWidth:`100%`,padding:`12px 24px 12px 6px`,boxSizing:`border-box`,fontFamily:`"Geist Mono Perf", "Geist Mono", monospace`,fontSize:we,lineHeight:`${Te}px`,color:A},children:ke.map((e,t)=>d(a,{children:[c(`span`,{style:{position:`sticky`,left:0,zIndex:2,background:k,color:Se,textAlign:`right`,paddingRight:4,userSelect:`none`,boxShadow:`10px 0 18px -4px ${k}, 4px 0 12px -2px ${k}`},children:String(t+1).padStart(2,`0`)}),c(`span`,{style:{whiteSpace:`pre`},dangerouslySetInnerHTML:{__html:ie(e,J.syntax)||`&nbsp;`}})]},t))})}),d(`div`,{style:{display:`flex`,flexDirection:s===`stack`?`column`:`row`,justifyContent:`space-between`,alignItems:s===`stack`?`stretch`:`center`,gap:s===`stack`?8:void 0,marginTop:24},children:[d(`div`,{style:{display:`flex`,alignItems:`center`,gap:4},children:[c(`button`,{className:`icon-btn`,"data-copied":W?`true`:void 0,onClick:Ae,"aria-label":W?`Code copied`:`Copy code`,title:W?`Copied`:`Copy code`,style:{width:40,height:40,border:`none`,borderRadius:12,background:`transparent`,cursor:`pointer`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:W?d(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,children:[c(`circle`,{cx:`12`,cy:`12`,r:`10`,fill:`#16a34a`}),c(`path`,{d:`M8 12.5l2.2 2.2 5.8-5.8`,stroke:`#ffffff`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,fill:`none`})]}):d(`svg`,{width:`18`,height:`18`,viewBox:`0 0 18 18`,fill:`none`,children:[c(`path`,{d:`M6.5625 6.5625V3C6.5625 2.48223 6.98223 2.0625 7.5 2.0625H15C15.5178 2.0625 15.9375 2.48223 15.9375 3V10.5C15.9375 11.0178 15.5178 11.4375 15 11.4375H11.4375`,stroke:`#737373`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`}),c(`path`,{d:`M3 6.5625H10.5C11.0178 6.5625 11.4375 6.98223 11.4375 7.5V15C11.4375 15.5178 11.0178 15.9375 10.5 15.9375H3C2.48223 15.9375 2.0625 15.5178 2.0625 15V7.5C2.0625 6.98223 2.48223 6.5625 3 6.5625Z`,stroke:`#737373`,strokeWidth:`1.5`,strokeLinecap:`round`,strokeLinejoin:`round`})]})}),m?d(`button`,{ref:Y,className:`lang-btn`,"data-open":H?`true`:`false`,onClick:()=>U(!H),"aria-haspopup":`menu`,"aria-expanded":H,"aria-label":`Select code language. Current language: ${J.language}`,style:{height:40,border:`none`,borderRadius:12,display:`flex`,alignItems:`center`,gap:8,padding:`8px 16px`,background:`transparent`,cursor:`pointer`,fontFamily:`"Aeonik Medium", "Aeonik Regular", Arial, sans-serif`,fontSize:R,lineHeight:`${z}px`,fontWeight:500,color:A},children:[J.language,c(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,style:{transition:`transform 180ms ease`,transform:H?`rotate(180deg)`:`rotate(0deg)`},children:c(`path`,{d:`M6 9l6 6 6-6`,stroke:`#737373`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`})})]}):c(`span`,{style:{height:40,display:`flex`,alignItems:`center`,padding:`8px 16px`,boxSizing:`border-box`,fontFamily:`"Aeonik Medium", "Aeonik Regular", Arial, sans-serif`,fontSize:R,fontWeight:500,color:A},children:J.language})]}),c(`button`,{className:`cta-btn`,onClick:()=>{h?.trim()&&i.open(h.trim(),`_blank`,`noopener,noreferrer`)},style:{border:`none`,borderRadius:12,background:N,color:M,padding:`10px 18px`,cursor:`pointer`,fontFamily:`"Aeonik Medium", "Aeonik Regular", Arial, sans-serif`,fontSize:R,lineHeight:`${z}px`,fontWeight:500},children:g})]})]})}),m&&H&&re(c(`div`,{ref:X,style:{position:`fixed`,left:K.left,top:K.top,zIndex:1e4,minWidth:170,padding:6,border:`1px solid ${be}`,borderRadius:12,background:ye,boxShadow:`0 10px 26px rgba(23,23,23,0.1)`},children:V.map((e,t)=>c(`button`,{onClick:()=>{De(t),U(!1)},style:{width:`100%`,border:`none`,borderRadius:8,padding:`8px 10px`,textAlign:`left`,background:t===q?xe:`transparent`,cursor:`pointer`,fontFamily:`"Aeonik Medium", "Aeonik Regular", Arial, sans-serif`,fontSize:R,color:A},children:e.language},`${e.language}-${t}`))}),document.body)]})}var b,x,S,C,w,T,E=e((()=>{n(),u(),s(),l(),p(),b=[{language:`Typescript`,syntax:`typescript`,code:`import { ApiClient } from "@sdk/client"

const client = new ApiClient()

const response = await client.generate({
  text: "Hello there!",
  modelId: "v3",
})`},{language:`Python`,syntax:`python`,code:`from sdk.client import ApiClient

client = ApiClient()

response = client.generate(
    text="Hello there!",
    model_id="v3",
)`}],x=[{language:`cURL`,syntax:`curl`,code:`curl -X POST https://api.smallest.ai/waves/v1/pulse/get_text \\
     -H "Authorization: Bearer <BearerAuth>" \\
     -H "Content-Type: application/octet-stream"`}],S=[{language:`cURL`,syntax:`curl`,code:`curl --request POST \\
  --url "https://api.smallest.ai/waves/v1/stt/?model=pulse&language=en" \\
  --header "Authorization: Bearer $SMALLEST_API_KEY" \\
  --header "Content-Type: audio/wav" \\
  --data-binary "@audio.wav"`}],C=[{type:`comment`,regex:/\/\/[^\n]*/g},{type:`string`,regex:/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g},{type:`keyword`,regex:/\b(?:import|from|const|let|var|new|await|return|async)\b/g},{type:`property`,regex:/\b(?:text|modelId)\b(?=\s*:)/g},{type:`variable`,regex:/\b(?:ApiClient|client|response)\b/g}],w=[{type:`comment`,regex:/#[^\n]*/g},{type:`string`,regex:/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g},{type:`keyword`,regex:/\b(?:from|import)\b/g},{type:`property`,regex:/\b(?:client|response|text|model_id)\b(?=\s*[=:])/g},{type:`variable`,regex:/\bApiClient\b/g}],T=[{type:`string`,regex:/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g},{type:`command`,regex:/^curl\b/g},{type:`flag`,regex:RegExp(`(?<=^|\\s)-[A-Za-z]\\b`,`g`)},{type:`env`,regex:/\$[A-Za-z_][A-Za-z0-9_]*/g}],m(y,{snippetPreset:{title:`Snippet Preset`,type:f.Enum,options:[`custom`,`stt`,`tts`],optionTitles:[`Custom`,`Speech to Text`,`Text to Speech`],defaultValue:`custom`},codeSnippets:{title:`Code Snippets`,type:f.Array,hidden:e=>e.snippetPreset===`stt`||e.snippetPreset===`tts`,maxCount:12,defaultValue:b,control:{type:f.Object,controls:{language:{type:f.String,title:`Language`,defaultValue:`JavaScript`},syntax:{type:f.Enum,title:`Syntax`,options:[`typescript`,`javascript`,`python`,`curl`],optionTitles:[`TypeScript`,`JavaScript`,`Python`,`cURL`],defaultValue:`javascript`},code:{type:f.String,title:`Code`,displayTextArea:!0,defaultValue:``}}}},showLanguageDropdown:{title:`Language Dropdown`,type:f.Boolean,defaultValue:!0},buttonLabel:{title:`Button Label`,type:f.String,defaultValue:`Get API key`},apiKeyUrl:{type:f.Link,defaultValue:``},controlsLayout:{type:f.Enum,title:`Controls Layout`,options:[`row`,`stack`],optionTitles:[`Row`,`Stack`],defaultValue:`row`,displaySegmentedControl:!0,description:`Stack places Copy and language above the API button. Set per breakpoint.`},appearanceSettings:{type:f.Object,title:`Appearance`,icon:`color`,controls:{customize:{type:f.Boolean,title:`Customize`,defaultValue:!1},background:{type:f.Color,title:`Surface`,defaultValue:`#FFFFFF`,hidden:e=>!e.customize},border:{type:f.Color,title:`Border`,defaultValue:`#E5E5E5`,hidden:e=>!e.customize},codeText:{type:f.Color,title:`Code Text`,defaultValue:`#404040`,hidden:e=>!e.customize},codeHighlight:{type:f.Color,title:`Highlight`,defaultValue:`#0066CC`,hidden:e=>!e.customize},buttonText:{type:f.Color,title:`Button Text`,defaultValue:`#FAFAFA`,hidden:e=>!e.customize},buttonBackground:{type:f.Color,title:`Button Surface`,defaultValue:`#171717`,hidden:e=>!e.customize},copyHover:{type:f.Color,title:`Copy Hover`,defaultValue:`#F5F5F5`,hidden:e=>!e.customize},copySuccessBackground:{type:f.Color,title:`Copy Success`,defaultValue:`#DCFCE7`,hidden:e=>!e.customize},languageBackground:{type:f.Color,title:`Language Hover`,defaultValue:`#F5F5F5`,hidden:e=>!e.customize},menuBackground:{type:f.Color,title:`Menu Surface`,defaultValue:`#FFFFFF`,hidden:e=>!e.customize},menuBorder:{type:f.Color,title:`Menu Border`,defaultValue:`#EBEBEB`,hidden:e=>!e.customize},menuItemHover:{type:f.Color,title:`Menu Item`,defaultValue:`#FAFAFA`,hidden:e=>!e.customize},lineNumberColor:{type:f.Color,title:`Line Numbers`,defaultValue:`#D4D4D4`,hidden:e=>!e.customize},borderRadius:{type:f.Number,title:`Radius`,defaultValue:20,min:0,max:48,step:4,unit:`px`,hidden:e=>!e.customize}}},typographySettings:{type:f.Object,title:`Typography`,icon:`object`,controls:{customize:{type:f.Boolean,title:`Customize`,defaultValue:!1},fontSize:{type:f.Number,title:`Controls Size`,defaultValue:14,min:10,max:20,unit:`px`,hidden:e=>!e.customize},lineHeight:{type:f.Number,title:`Controls Line`,defaultValue:20,min:14,max:32,unit:`px`,hidden:e=>!e.customize},codeFontSize:{type:f.Number,title:`Code Size`,defaultValue:16,min:10,max:24,unit:`px`,hidden:e=>!e.customize},codeLineHeight:{type:f.Number,title:`Code Line`,defaultValue:26,min:16,max:40,unit:`px`,hidden:e=>!e.customize}}},background:{type:f.Color,defaultValue:`#FFFFFF`,hidden:!0},border:{type:f.Color,defaultValue:`#E5E5E5`,hidden:!0},codeText:{type:f.Color,defaultValue:`#404040`,hidden:!0},codeHighlight:{type:f.Color,defaultValue:`#0066CC`,hidden:!0},buttonText:{type:f.Color,defaultValue:`#FAFAFA`,hidden:!0},buttonBackground:{type:f.Color,defaultValue:`#171717`,hidden:!0},copyHover:{type:f.Color,defaultValue:`#F5F5F5`,hidden:!0},languageBackground:{type:f.Color,defaultValue:`#F5F5F5`,hidden:!0},menuBackground:{type:f.Color,defaultValue:`#FFFFFF`,hidden:!0},menuBorder:{type:f.Color,defaultValue:`#EBEBEB`,hidden:!0},menuItemHover:{type:f.Color,defaultValue:`#FAFAFA`,hidden:!0},lineNumberColor:{type:f.Color,defaultValue:`#D4D4D4`,hidden:!0},borderRadius:{type:f.Number,defaultValue:24,hidden:!0},fontSize:{type:f.Number,defaultValue:14,hidden:!0},lineHeight:{type:f.Number,defaultValue:20,hidden:!0},codeFontSize:{type:f.Number,defaultValue:16,hidden:!0},codeLineHeight:{type:f.Number,defaultValue:26,hidden:!0},copySuccessBackground:{type:f.Color,defaultValue:`#DCFCE7`,hidden:!0}})}));export{E as n,y as t};
//# sourceMappingURL=Code_Block_v3.DJmFl-Hi.mjs.map