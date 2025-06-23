import 'kleur/colors';
import { d as decodeKey } from './chunks/astro/server_Y9XPr4rV.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_B87vIV2S.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/miguel/clients/NestorPower_Landing/","cacheDir":"file:///home/miguel/clients/NestorPower_Landing/node_modules/.astro/","outDir":"file:///home/miguel/clients/NestorPower_Landing/dist/","srcDir":"file:///home/miguel/clients/NestorPower_Landing/src/","publicDir":"file:///home/miguel/clients/NestorPower_Landing/public/","buildClientDir":"file:///home/miguel/clients/NestorPower_Landing/dist/client/","buildServerDir":"file:///home/miguel/clients/NestorPower_Landing/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/send-email","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/send-email\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"send-email","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/send-email.ts","pathname":"/api/send-email","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/ImageTestimonials.BbDeSBHL.css"},{"type":"external","src":"/_astro/index._sKwuHSQ.css"},{"type":"external","src":"/_astro/Form.Bbgo5x5y.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/miguel/clients/NestorPower_Landing/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/api/send-email@_@ts":"pages/api/send-email.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","/home/miguel/clients/NestorPower_Landing/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_bmId2jvX.mjs","\u0000@astrojs-manifest":"manifest_DguJaPt2.mjs","/home/miguel/clients/NestorPower_Landing/src/components/Form.tsx":"_astro/Form.C4HSDkE_.js","@astrojs/react/client.js":"_astro/client.BPIbHqJh.js","/home/miguel/clients/NestorPower_Landing/src/components/ThemeButton.astro?astro&type=script&index=0&lang.ts":"_astro/ThemeButton.astro_astro_type_script_index_0_lang.B0Urib_C.js","/home/miguel/clients/NestorPower_Landing/src/sections/ImageTestimonials.astro?astro&type=script&index=0&lang.ts":"_astro/ImageTestimonials.astro_astro_type_script_index_0_lang.CUe4HYoj.js","/home/miguel/clients/NestorPower_Landing/src/sections/CallToAction.astro?astro&type=script&index=0&lang.ts":"_astro/CallToAction.astro_astro_type_script_index_0_lang.cdL8K3hI.js","/home/miguel/clients/NestorPower_Landing/src/sections/FAQ.astro?astro&type=script&index=0&lang.ts":"_astro/FAQ.astro_astro_type_script_index_0_lang.CEvX_OaY.js","/home/miguel/clients/NestorPower_Landing/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.3u430bf-.js","/home/miguel/clients/NestorPower_Landing/src/components/PrimaryButton.astro?astro&type=script&index=0&lang.ts":"_astro/PrimaryButton.astro_astro_type_script_index_0_lang.BZsiNf76.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/miguel/clients/NestorPower_Landing/src/components/ThemeButton.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"theme-button\"),c=document.getElementById(\"sun-icon\"),m=document.getElementById(\"moon-icon\"),d=document.documentElement;function n(t){if(!t)return;const o=t.innerHTML;t.innerHTML=\"\",t.offsetWidth,t.innerHTML=o}e instanceof HTMLButtonElement&&e?.addEventListener(\"click\",()=>{const t=d.classList.toggle(\"dark\");localStorage.theme=t?\"dark\":\"light\",n(c),n(m)});(localStorage.theme===\"dark\"||!(\"theme\"in localStorage)&&window.matchMedia(\"(prefers-color-scheme: dark)\").matches)&&document.documentElement.classList.add(\"dark\");"],["/home/miguel/clients/NestorPower_Landing/src/sections/CallToAction.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{let e=document.getElementById(\"cta-heart\");if(!e)return;let t=!1;const n=new IntersectionObserver(i=>{i.forEach(s=>{if(e&&s.isIntersecting&&!t){const o=e.parentElement;if(!o)return;const r=e.cloneNode(!0);r.id=\"cta-heart\",o.replaceChild(r,e),n.unobserve(e),e=r,n.observe(e),t=!0}else!s.isIntersecting&&t&&(t=!1)})},{threshold:.5});e&&n.observe(e)});"],["/home/miguel/clients/NestorPower_Landing/src/sections/FAQ.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const c=document.querySelectorAll(\".faq-item\");c.forEach(e=>{const n=e.querySelector(\".faq-question\"),s=e.querySelector(\".faq-answer\");n?.addEventListener(\"click\",()=>{const o=e.classList.contains(\"active\");c.forEach(a=>{a.classList.remove(\"active\");const t=a.querySelector(\".faq-answer\");t&&(t.style.height=\"0\",t.classList.remove(\"open\"))}),!o&&s&&(e.classList.add(\"active\"),s.style.height=s.scrollHeight+\"px\",s.classList.add(\"open\"))})})});"],["/home/miguel/clients/NestorPower_Landing/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts","var f=\"@vercel/analytics\",l=\"1.5.0\",w=()=>{window.va||(window.va=function(...r){(window.vaq=window.vaq||[]).push(r)})};function d(){return typeof window<\"u\"}function u(){try{const e=\"production\"}catch{}return\"production\"}function v(e=\"auto\"){if(e===\"auto\"){window.vam=u();return}window.vam=e}function m(){return(d()?window.vam:u())||\"production\"}function c(){return m()===\"development\"}function b(e,r){if(!e||!r)return e;let n=e;try{const t=Object.entries(r);for(const[a,i]of t)if(!Array.isArray(i)){const o=s(i);o.test(n)&&(n=n.replace(o,`/[${a}]`))}for(const[a,i]of t)if(Array.isArray(i)){const o=s(i.join(\"/\"));o.test(n)&&(n=n.replace(o,`/[...${a}]`))}return n}catch{return e}}function s(e){return new RegExp(`/${h(e)}(?=[/?#]|$)`)}function h(e){return e.replace(/[.*+?^${}()|[\\]\\\\]/g,\"\\\\$&\")}function y(e){return e.scriptSrc?e.scriptSrc:c()?\"https://va.vercel-scripts.com/v1/script.debug.js\":e.basePath?`${e.basePath}/insights/script.js`:\"/_vercel/insights/script.js\"}function g(e={debug:!0}){var r;if(!d())return;v(e.mode),w(),e.beforeSend&&((r=window.va)==null||r.call(window,\"beforeSend\",e.beforeSend));const n=y(e);if(document.head.querySelector(`script[src*=\"${n}\"]`))return;const t=document.createElement(\"script\");t.src=n,t.defer=!0,t.dataset.sdkn=f+(e.framework?`/${e.framework}`:\"\"),t.dataset.sdkv=l,e.disableAutoTrack&&(t.dataset.disableAutoTrack=\"1\"),e.endpoint?t.dataset.endpoint=e.endpoint:e.basePath&&(t.dataset.endpoint=`${e.basePath}/insights`),e.dsn&&(t.dataset.dsn=e.dsn),t.onerror=()=>{const a=c()?\"Please check if any ad blockers are enabled and try again.\":\"Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.\";console.log(`[Vercel Web Analytics] Failed to load script from ${n}. ${a}`)},c()&&e.debug===!1&&(t.dataset.debug=\"false\"),document.head.appendChild(t)}function p({route:e,path:r}){var n;(n=window.va)==null||n.call(window,\"pageview\",{route:e,path:r})}function k(){try{return}catch{}}customElements.define(\"vercel-analytics\",class extends HTMLElement{constructor(){super();try{const r=JSON.parse(this.dataset.props??\"{}\"),n=JSON.parse(this.dataset.params??\"{}\");g({...r,disableAutoTrack:!0,framework:\"astro\",basePath:k(),beforeSend:window.webAnalyticsBeforeSend});const t=this.dataset.pathname;p({route:b(t??\"\",n),path:t})}catch(r){throw new Error(`Failed to parse WebAnalytics properties: ${r}`)}}});"],["/home/miguel/clients/NestorPower_Landing/src/components/PrimaryButton.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const o=document.querySelectorAll(\".form-button\"),e=document.querySelector(\"#main-dialog\");!o.length||!e||(e.showModal(),o.forEach(t=>{t.addEventListener(\"click\",()=>{e.classList.remove(\"modal-closing\"),e.showModal(),document.body.style.overflow=\"hidden\"})}),e.addEventListener(\"close\",()=>{document.body.style.overflow=\"auto\"}))});"]],"assets":["/_astro/lato-latin-ext-300-normal.BWm3ECDp.woff2","/_astro/lato-latin-ext-400-normal.C8eBZ-j2.woff2","/_astro/lato-latin-300-normal.BP2wSCML.woff2","/_astro/lato-latin-400-normal.BEhtfm5r.woff2","/_astro/lato-latin-900-normal.C3uaq3BA.woff2","/_astro/lato-latin-ext-900-normal.Bl5tLxDl.woff2","/_astro/lato-latin-ext-700-normal.C5WWfNwx.woff2","/_astro/lato-latin-700-normal.BUGMgin4.woff2","/_astro/lato-latin-ext-100-normal.DCnLPYms.woff2","/_astro/lato-latin-100-normal.Dw0I1B7H.woff2","/_astro/bebas-neue-latin-400-normal.dFjLRunK.woff2","/_astro/bebas-neue-latin-ext-400-normal.CeLpnxZh.woff2","/_astro/calendar.49j_LzuN.jpg","/_astro/guia.C-d6AuZM.jpg","/_astro/dieta.pyihtjgN.jpg","/_astro/plan.DqkAuE3J.jpg","/_astro/lato-latin-300-normal.CINZtfFB.woff","/_astro/lato-latin-400-normal.B11PyLys.woff","/_astro/lato-latin-700-normal.DAdL7O4w.woff","/_astro/lato-latin-900-normal.CZBfLiEO.woff","/_astro/bebas-neue-latin-400-normal.Cg4B5GFO.woff","/_astro/lato-latin-100-normal.pKQoWT5u.woff","/_astro/bebas-neue-latin-ext-400-normal.DX0KfPKU.woff","/_astro/andre-antes.X_Xxpe3I.jpg","/_astro/andre-despues.nzXfLLt6.jpg","/_astro/leandro-antes.CYoFy924.jpg","/_astro/leandro-despues.CbOR9rn-.jpg","/_astro/alex-antes.C8e3STQw.png","/_astro/alex-despues.DOas395l.png","/_astro/dario-antes.BU4_zllM.png","/_astro/esteban-antes.-8oJkDJl.png","/_astro/dario-despues.CvsyK8q3.png","/_astro/esteban-despues.BE_Xwf2R.png","/_astro/erlan-despues.BlyWTZik.png","/_astro/erlan-antes.D6xqgCj2.png","/_astro/index._sKwuHSQ.css","/favicon.svg","/_astro/Form.Bbgo5x5y.css","/_astro/Form.C4HSDkE_.js","/_astro/ImageTestimonials.BbDeSBHL.css","/_astro/ImageTestimonials.astro_astro_type_script_index_0_lang.CUe4HYoj.js","/_astro/client.BPIbHqJh.js","/_astro/index.BVOCwoKb.js","/fonts/Gerad-Regular.ttf"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"8qBuJIqXS3Xv41fx1grFwNDdljr3gdTWtjEqev8oj94="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
