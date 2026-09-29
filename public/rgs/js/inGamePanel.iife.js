!function(){var t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),a=new WeakMap,n=class{constructor(t,e,a){if(this._$cssResult$=!0,a!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=a.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&a.set(i,t))}return t}toString(){return this.cssText}},o=(t,...e)=>new n(1===t.length?t[0]:e.reduce((e,i,a)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[a+1],t[0]),t,i),s=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:r,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,g=m?m.emptyScript:"",C=u.reactiveElementPolyfillSupport,b=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},f=(t,e)=>!r(t,e),y={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:f};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(t,i,e);void 0!==a&&l(this.prototype,t,a)}}static getPropertyDescriptor(t,e,i){const{get:a,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:a,set(e){const o=a?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const t=this._$Eu(e,i);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(s(t))}else void 0!==t&&e.push(s(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,a)=>{if(e)i.adoptedStyleSheets=a.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of a){const a=document.createElement("style"),n=t.litNonce;void 0!==n&&a.setAttribute("nonce",n),a.textContent=e.cssText,i.appendChild(a)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(void 0!==a&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(a):this.setAttribute(a,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,a=i._$Eh.get(t);if(void 0!==a&&this._$Em!==a){const t=i.getPropertyOptions(a),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=a;const o=n.fromAttribute(e,t.type);this[a]=o??this._$Ej?.get(a)??o,this._$Em=null}}requestUpdate(t,e,i,a=!1,n){if(void 0!==t){const o=this.constructor;if(!1===a&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??f)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:a,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===a&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,a=this[e];!0!==t||this._$AL.has(e)||void 0===a||this.C(e,void 0,i,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,C?.({ReactiveElement:x}),(u.reactiveElementVersions??=[]).push("2.1.2");var w=globalThis,_=t=>t,$=w.trustedTypes,k=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,I="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+L,A=`<${T}>`,S=document,M=()=>S.createComment(""),j=t=>null===t||"object"!=typeof t&&"function"!=typeof t,E=Array.isArray,P=t=>E(t)||"function"==typeof t?.[Symbol.iterator],U="[ \t\n\f\r]",B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,N=/>/g,Z=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,z=/"/g,R=/^(?:script|style|textarea|title)$/i,O=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),D=O(1),J=(O(2),O(3),Symbol.for("lit-noChange")),V=Symbol.for("lit-nothing"),G=new WeakMap,W=S.createTreeWalker(S,129);function q(t,e){if(!E(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}var K=(t,e)=>{const i=t.length-1,a=[];let n,o=2===e?"<svg>":3===e?"<math>":"",s=B;for(let r=0;r<i;r++){const e=t[r];let i,l,c=-1,d=0;for(;d<e.length&&(s.lastIndex=d,l=s.exec(e),null!==l);)d=s.lastIndex,s===B?"!--"===l[1]?s=F:void 0!==l[1]?s=N:void 0!==l[2]?(R.test(l[2])&&(n=RegExp("</"+l[2],"g")),s=Z):void 0!==l[3]&&(s=Z):s===Z?">"===l[0]?(s=n??B,c=-1):void 0===l[1]?c=-2:(c=s.lastIndex-l[2].length,i=l[1],s=void 0===l[3]?Z:'"'===l[3]?z:H):s===z||s===H?s=Z:s===F||s===N?s=B:(s=Z,n=void 0);const h=s===Z&&t[r+1].startsWith("/>")?" ":"";o+=s===B?e+A:c>=0?(a.push(i),e.slice(0,c)+I+e.slice(c)+L+h):e+L+(-2===c?r:h)}return[q(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),a]},Y=class t{constructor({strings:e,_$litType$:i},a){let n;this.parts=[];let o=0,s=0;const r=e.length-1,l=this.parts,[c,d]=K(e,i);if(this.el=t.createElement(c,a),W.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=W.nextNode())&&l.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(I)){const e=d[s++],i=n.getAttribute(t).split(L),a=/([.?@])?(.*)/.exec(e);l.push({type:1,index:o,name:a[2],strings:i,ctor:"."===a[1]?it:"?"===a[1]?at:"@"===a[1]?nt:et}),n.removeAttribute(t)}else t.startsWith(L)&&(l.push({type:6,index:o}),n.removeAttribute(t));if(R.test(n.tagName)){const t=n.textContent.split(L),e=t.length-1;if(e>0){n.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],M()),W.nextNode(),l.push({type:2,index:++o});n.append(t[e],M())}}}else if(8===n.nodeType)if(n.data===T)l.push({type:2,index:o});else{let t=-1;for(;-1!==(t=n.data.indexOf(L,t+1));)l.push({type:7,index:o}),t+=L.length-1}o++}}static createElement(t,e){const i=S.createElement("template");return i.innerHTML=t,i}};function X(t,e,i=t,a){if(e===J)return e;let n=void 0!==a?i._$Co?.[a]:i._$Cl;const o=j(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,a)),void 0!==a?(i._$Co??=[])[a]=n:i._$Cl=n),void 0!==n&&(e=X(t,n._$AS(t,e.values),n,a)),e}var Q=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,a=(t?.creationScope??S).importNode(e,!0);W.currentNode=a;let n=W.nextNode(),o=0,s=0,r=i[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new tt(n,n.nextSibling,this,t):1===r.type?e=new r.ctor(n,r.name,r.strings,this,t):6===r.type&&(e=new ot(n,this,t)),this._$AV.push(e),r=i[++s]}o!==r?.index&&(n=W.nextNode(),o++)}return W.currentNode=S,a}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},tt=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,a){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),j(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==J&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):P(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&j(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,a="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(e);else{const t=new Q(a,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new Y(t)),e}k(e){E(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let a,n=0;for(const o of e)n===i.length?i.push(a=new t(this.O(M()),this.O(M()),this,this.options)):a=i[n],a._$AI(o),n++;n<i.length&&(this._$AR(a&&a._$AB.nextSibling,n),i.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=_(t).nextSibling;_(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}},et=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,a,n){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=a,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,a){const n=this.strings;let o=!1;if(void 0===n)t=X(this,t,e,0),o=!j(t)||t!==this._$AH&&t!==J,o&&(this._$AH=t);else{const a=t;let s,r;for(t=n[0],s=0;s<n.length-1;s++)r=X(this,a[i+s],e,s),r===J&&(r=this._$AH[s]),o||=!j(r)||r!==this._$AH[s],r===V?t=V:t!==V&&(t+=(r??"")+n[s+1]),this._$AH[s]=r}o&&!a&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},it=class extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}},at=class extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}},nt=class extends et{constructor(t,e,i,a,n){super(t,e,i,a,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??V)===J)return;const i=this._$AH,a=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==V&&(i===V||a);a&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ot=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}},st={M:I,P:L,A:T,C:1,L:K,R:Q,D:P,V:X,I:tt,H:et,N:at,U:nt,B:it,F:ot},rt=w.litHtmlPolyfillSupport;rt?.(Y,tt),(w.litHtmlVersions??=[]).push("3.3.2");var lt=globalThis,ct=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const a=i?.renderBefore??e;let n=a._$litPart$;if(void 0===n){const t=i?.renderBefore??null;a._$litPart$=n=new tt(e.insertBefore(M(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return J}};ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});var dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");var ht=o`
    :host {
        z-index: 100;
        position: fixed;
        display: block;
        pointer-events: none;
    }

    .panel {
        position: relative;
        width: 100%;
        height: 100%;
    }

    /* === Desktop === */
    :host(:not([mobile])) {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 375px;
        height: calc(100% - 32px);
    }

    /* === Mobile === */

    :host([mobile]) {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    }
`,pt=o`
    :host {
        /* border-radius */
        --border-radius-lg: 16px;
        --border-radius-md: 12px;
        --border-radius-sm: 8px;
        --border-radius-xs: 6px;

        /* TITLES */
        --fz-title-lg: 18px;
        --lh-title-lg: 24px;

        --fz-title-md: 16px;
        --lh-title-md: 22px;

        --fz-title-sm: 13px;
        --lh-title-sm: 16px;

        --fz-title-xs: 12px;
        --lh-title-xs: 16px;

        /* BODY */
        --fz-body-md: 14px;
        --lh-body-md: 20px;

        --fz-body-sm: 12px;
        --lh-body-sm: 16px;

        --fz-caption: 11px;
        --lh-caption: 14px;
        
        --fz-caption-xs: 11px;
        --lh-caption-xs: 14px;
    }

    @media (max-width: 767px) {
        :host {
            --lh-title-md: 20px;
            --fz-body-md: 13px;
            --fz-caption: 10px;
            --lh-caption: 12px;
        }
    }

    /* Scrollbar */

    ::-webkit-scrollbar {
        width: 2px;
        height: 2px;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--in-game-secondary-text-color);
        border-radius: 5px;
    }
    
    @media (max-width: 767px) {
        ::-webkit-scrollbar {
            display: none;
        }
    }

    /* displays */

    .flex {
        display: flex;
    }

    .block {
        display: block;
    }

    .none {
        display: none;
    }

    .direction-column {
        flex-direction: column;
    }

    .align-center {
        align-items: center;
    }

    .space-between {
        justify-content: space-between;
    }

    .justify-center {
        justify-content: center;
    }


    /* TITLES */

    .title-lg {
        font-size: var(--fz-title-lg);
        line-height: var(--lh-title-lg);
    }

    .title-md {
        font-size: var(--fz-title-md);
        line-height: var(--lh-title-md);
    }

    .title-sm {
        font-size: var(--fz-title-sm);
        line-height: var(--lh-title-sm);
    }

    .title-xs {
        font-size: var(--fz-title-xs);
        line-height: var(--lh-title-xs);
    }

    /* BODY */

    .body-text-md {
        font-size: var(--fz-body-md);
        line-height: var(--lh-body-md);
    }

    .body-text-sm {
        font-size: var(--fz-body-sm);
        line-height: var(--lh-body-sm);
    }

    .caption {
        font-size: var(--fz-caption);
        line-height: var(--lh-caption);
        font-weight: 400;
    }

    .caption-xs {
        font-size: var(--fz-caption-xs);
        line-height: var(--lh-caption-xs);
        font-weight: 400;
    }
`,ut=o`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :host {
    display: block;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  * {
    margin: 0;
    padding: 0;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select,
  optgroup {
    font: inherit;
    color: inherit;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  textarea {
    resize: vertical;
  }

  ul {
    list-style: none;
  }

  ol {
    padding-inline-start: 20px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  hr {
    border: none;
    border-top: 1px solid currentColor;
    height: 0;
    color: inherit;
  }

  fieldset {
    border: none;
    padding: 0;
  }

  legend {
    padding: 0;
  }

  summary {
    cursor: pointer;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`,mt=class extends ct{static get styles(){const t=this.elementStyles??[];return[ut,pt,...Array.isArray(t)?t:[t]]}},gt="jackpots",Ct="tournaments",bt="notifications",vt=1e4,ft="icon",yt=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],xt=async({id:t,periodId:e,baseFetch:i,partnerIdentity:a,playerCurrencyId:n})=>i({method:"GET",url:`inGameWidget/gmc/getPublicTournamentInfo/${a}/${t}/${e}/${n}`,hasLanguageIdInPath:!0}),wt=async({id:t,periodId:e,baseFetch:i})=>i({method:"GET",url:`inGameWidget/getPrivateTournamentInfo/${t}/${e}`}),_t=o`
    :host {
        display: contents;
    }

    .sidebar-container {
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }

    /* === Desktop === */

    :host(:not([mobile])) .sidebar-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--in-game-background-color);
        padding: 12px 0;
        border-radius: var(--border-radius-lg);
        transform: translateX(calc(100% + 16px));
        opacity: 0;
        pointer-events: none;
        transition: transform 0.3s ease, opacity 0.25s ease;
    }

    :host([open]:not([mobile])) .sidebar-container {
        transform: translateX(0);
        opacity: 1;
        pointer-events: auto;
    }

    /* === Mobile === */

    :host([mobile]) .sidebar-container {
        position: absolute;
        left: 0;
        bottom: 100%;
        width: 100%;
        height: 384px;
        background-color: var(--in-game-background-color);
        border-radius: 16px 16px 0 0;
        padding: 12px 0;
        z-index: 2;

        transform-origin: bottom center;
        transform: scaleY(0);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.3s ease, opacity 0.2s ease;
    }

    :host([open][mobile]) .sidebar-container {
        transform: scaleY(1);
        opacity: 1;
        pointer-events: auto;
    }
`,$t=(D`
    <svg width="36" height="4" viewBox="0 0 36 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="4" rx="2" fill="#373A47"/>
    </svg>
`,D`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.1881 11.9997L18.4214 6.76644C18.6335 6.55429 18.7163 6.24514 18.6387 5.95536C18.5611 5.66565 18.3347 5.43927 18.045 5.36161C17.7552 5.28404 17.446 5.36682 17.2339 5.57896L12.0007 10.8122L6.76741 5.57896C6.55527 5.36681 6.24612 5.28404 5.95633 5.36161C5.66663 5.43927 5.44025 5.66565 5.36258 5.95536C5.28502 6.24516 5.36779 6.5543 5.57993 6.76644L10.8132 11.9997L5.57993 17.2329C5.36779 17.4451 5.28501 17.7542 5.36258 18.044C5.44024 18.3337 5.66663 18.5601 5.95633 18.6377C6.24614 18.7153 6.55528 18.6325 6.76741 18.4204L12.0007 13.1872L17.2339 18.4204C17.446 18.6325 17.7552 18.7153 18.045 18.6377C18.3347 18.5601 18.5611 18.3337 18.6387 18.044C18.7163 17.7542 18.6335 17.445 18.4214 17.2329L13.1881 11.9997Z"
              fill="var(--in-game-secondary-text-color)"/>
    </svg>
`),kt=D`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="12" transform="matrix(-1 0 0 1 24 0)" fill="var(--in-game-expanded-widget-surface-color)"/>
        <rect x="-0.5" y="0.5" width="23" height="23" rx="11.5" transform="matrix(-1 0 0 1 23 0)" stroke="white" stroke-opacity="0.1" fill="var(--in-game-border-color)"/>
        <path d="M12.8319 12.0003L16.4952 15.6636C16.6437 15.8121 16.7016 16.0285 16.6473 16.2313C16.5929 16.4341 16.4345 16.5926 16.2317 16.647C16.0288 16.7013 15.8124 16.6433 15.6639 16.4948L12.0007 12.8316L8.33739 16.4948C8.18889 16.6433 7.97248 16.7013 7.76963 16.647C7.56683 16.5926 7.40837 16.4341 7.354 16.2313C7.29971 16.0285 7.35765 15.8121 7.50615 15.6636L11.1694 12.0003L7.50615 8.33706C7.35765 8.18856 7.2997 7.97215 7.354 7.7693C7.40836 7.56651 7.56683 7.40804 7.76963 7.35368C7.97249 7.29938 8.18889 7.35732 8.33739 7.50582L12.0007 11.1691L15.6639 7.50582C15.8124 7.35732 16.0288 7.29938 16.2317 7.35368C16.4345 7.40804 16.5929 7.56651 16.6473 7.7693C16.7016 7.97217 16.6437 8.18856 16.4952 8.33706L12.8319 12.0003Z" fill="var(--in-game-text-color)"/>
    </svg>
`,It=o`
    :host {
        width: 100%;
    }

    .header-wrapper {
        width: 100%;
        gap: 8px;
        margin-bottom: 8px;
        padding: 0 8px;
    }

    .items-wrapper {
        width: 100%;
        gap: 4px;
    }

    .active-tab {
        background-color: var(--in-game-expanded-widget-surface-color);
        border-radius: var(--border-radius-md);
    }

    .header-item {
        flex: 1 1 0;
        color: var(--in-game-text-color);
        cursor: pointer;
        gap: 8px;
        padding: 4px 8px;
    }

    .item-img {
        max-width: 32px;
        max-height: 32px;
    }

    .close-icon {
        display: flex;
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        cursor: pointer;

        &:hover {
            background-color: var(--in-game-expanded-widget-surface-color);
            border-radius: 4px;
        }
    }

    .justifyCenter {
        justify-content: center;
    }

    .notification-bell {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 36px;
        flex: 0 0 auto;
        color: var(--in-game-text-color);
        cursor: pointer;
        position: relative;
    }
    .notification-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        min-width: 12px;
        height: 12px;
        background-color: #E35656;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #FFFFFF;
        font-size: 8px;
        line-height: 1;
        box-sizing: border-box;
    }

    .notificationIndicator {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #E35656;
    }
`,Lt=D`
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 8.76621C9.65833 8.76621 9.375 8.48288 9.375 8.14121V5.36621C9.375 5.02454 9.65833 4.74121 10 4.74121C10.3417 4.74121 10.625 5.02454 10.625 5.36621V8.14121C10.625 8.49121 10.3417 8.76621 10 8.76621Z" fill="currentColor" fill-opacity="0.6"/>
        <path d="M10.0148 16.9582C7.86477 16.9582 5.7231 16.6165 3.68143 15.9332C2.9231 15.6832 2.3481 15.1415 2.0981 14.4582C1.8481 13.7749 1.93143 12.9915 2.33977 12.3082L3.3981 10.5415C3.63143 10.1499 3.83977 9.41654 3.83977 8.9582V7.2082C3.83977 3.79987 6.60643 1.0332 10.0148 1.0332C13.4231 1.0332 16.1898 3.79987 16.1898 7.2082V8.9582C16.1898 9.4082 16.3981 10.1499 16.6314 10.5415L17.6898 12.3082C18.0814 12.9582 18.1481 13.7332 17.8898 14.4415C17.6314 15.1499 17.0648 15.6915 16.3481 15.9332C14.3064 16.6249 12.1648 16.9582 10.0148 16.9582ZM10.0148 2.29154C7.2981 2.29154 5.08977 4.49987 5.08977 7.21654V8.96654C5.08977 9.64154 4.8231 10.6165 4.4731 11.1915L3.41477 12.9665C3.1981 13.3249 3.1481 13.7082 3.2731 14.0415C3.3981 14.3749 3.68143 14.6249 4.08143 14.7582C7.91477 16.0332 12.1314 16.0332 15.9648 14.7582C16.3231 14.6415 16.5981 14.3749 16.7231 14.0249C16.8564 13.6749 16.8148 13.2915 16.6231 12.9665L15.5648 11.1999C15.2148 10.6249 14.9481 9.64987 14.9481 8.97487V7.22487C14.9398 4.49987 12.7314 2.29154 10.0148 2.29154Z" fill="currentColor" fill-opacity="0.6"/>
        <path d="M10.0016 19.0836C9.1099 19.0836 8.2349 18.7169 7.60156 18.0836C6.96823 17.4503 6.60156 16.5753 6.60156 15.6836H7.85156C7.85156 16.2503 8.0849 16.8003 8.4849 17.2003C8.8849 17.6003 9.4349 17.8336 10.0016 17.8336C11.1849 17.8336 12.1516 16.8669 12.1516 15.6836H13.4016C13.4016 17.5586 11.8766 19.0836 10.0016 19.0836Z" fill="currentColor" fill-opacity="0.6"/>
    </svg>
`,Tt=D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
            <path d="M14.8451 4.25211C14.509 3.91596 14.0048 3.91596 13.6686 4.25211L7.36582 10.5549L4.76066 7.94975C4.42451 7.6136 3.92029 7.6136 3.58414 7.94975C3.24799 8.2859 3.24799 8.79012 3.58414 9.12627L6.77756 12.3197C6.94563 12.4878 7.1137 12.5718 7.36582 12.5718C7.61793 12.5718 7.786 12.4878 7.95408 12.3197L14.8451 5.42863C15.1813 5.09248 15.1813 4.58826 14.8451 4.25211Z" fill="currentColor"/>
            <path d="M9.11178 6.1849C8.86525 5.93837 8.49545 5.93837 8.24891 6.1849L3.62639 10.8074L1.71574 8.89678C1.46921 8.65025 1.0994 8.65025 0.85287 8.89678C0.606335 9.14332 0.606335 9.51312 0.85287 9.75965L3.19495 12.1017C3.31822 12.225 3.44148 12.2866 3.62639 12.2866C3.81129 12.2866 3.93455 12.225 4.05782 12.1017L9.11178 7.04777C9.35832 6.80124 9.35832 6.43144 9.11178 6.1849Z" fill="currentColor"/>
        </g>
    </svg>
`,At=class extends mt{static properties={activeTab:{type:String},mobile:{type:Boolean,reflect:!0},onClose:{attribute:!1},onTabClick:{attribute:!1},hasJackpotTab:{type:Boolean,attribute:!1},hasTournamentTab:{type:Boolean,attribute:!1},jackpotTranslations:{attribute:!1},tournamentTranslations:{attribute:!1},jackpotIconUrl:{attribute:!1},tournamentIconUrl:{attribute:!1},showNotifications:{type:Boolean},hasUnreadNotifications:{type:Boolean}};static elementStyles=It;constructor(){super(),this.activeTab=null,this.mobile=!1,this.onClose=()=>{},this.onTabClick=()=>{},this.hasJackpotTab=!1,this.hasTournamentTab=!1,this.jackpotIconUrl=null,this.tournamentIconUrl=null,this.jackpotTranslations={},this.tournamentTranslations={},this.showNotifications=!1,this.hasUnreadNotifications=!1}_onClose=t=>{t.stopPropagation(),this.onClose()};render(){const{activeTab:t,onTabClick:e,mobile:i,_onClose:a,hasJackpotTab:n,hasTournamentTab:o,jackpotTranslations:s,tournamentTranslations:r,jackpotIconUrl:l,tournamentIconUrl:c,showNotifications:d,hasUnreadNotifications:h}=this;return i?D``:D`
        <div class="header-wrapper flex align-center space-between">
            <div class="items-wrapper flex align center">
                ${n?D`
                    <div
                            class="header-item flex align-center ${!o&&"justifyCenter"} ${"jackpots"===t?"active-tab":""}"
                            @click=${()=>{e(gt,!0)}}>
                        <img alt="#" src=${l} class="item-img"/>
                        <div class="title-sm tab-text">
                            ${s?.jackpot??"Jackpots"}
                        </div>
                    </div>`:V}

                ${o?D`
                    <div
                            class="header-item flex align-center ${!n&&"justifyCenter"} ${"tournaments"===t?"active-tab":""}"
                            @click=${()=>{e(Ct,!0)}}>
                        <img class="item-img" alt="#" src=${c}/>
                        <div class="title-sm tab-text">${r?.tournaments??"Tournaments"}</div>
                    </div>`:V}
            </div>

            ${d?D`
                <div
                    class="notification-bell flex align-center ${"notifications"===t?"active-tab":""}"
                    @click=${()=>e(bt,!0)}
                >
                    ${Lt}
                    ${h?D`<div class="notificationIndicator" />`:V}
                </div>`:V}
            
            <span @click=${a} class="close-icon">${$t}</span>
        </div>
    `}};customElements.define("sidebar-header",At);var St=1,Mt=2,jt=t=>(...e)=>({_$litDirective$:t,values:e}),Et=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}},{I:Pt}=st,Ut=t=>t,Bt=()=>document.createComment(""),Ft=(t,e,i)=>{const a=t._$AA.parentNode,n=void 0===e?t._$AB:e._$AA;if(void 0===i)i=new Pt(a.insertBefore(Bt(),n),a.insertBefore(Bt(),n),t,t.options);else{const e=i._$AB.nextSibling,o=i._$AM,s=o!==t;if(s){let e;i._$AQ?.(t),i._$AM=t,void 0!==i._$AP&&(e=t._$AU)!==o._$AU&&i._$AP(e)}if(e!==n||s){let t=i._$AA;for(;t!==e;){const e=Ut(t).nextSibling;Ut(a).insertBefore(t,n),t=e}}}return i},Nt=(t,e,i=t)=>(t._$AI(e,i),t),Zt={},Ht=(t,e=Zt)=>t._$AH=e,zt=t=>{t._$AR(),t._$AA.remove()},Rt=jt(class extends Et{constructor(){super(...arguments),this.key=V}render(t,e){return this.key=t,e}update(t,[e,i]){return e!==this.key&&(Ht(t),this.key=e),i}}),Ot=o`
    :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%; // todo: check auto
        color: var(--in-game-text-color);
        font-size: 14px;
        line-height: 1.4;
    }

    .general {
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: auto;
        overflow-y: auto;
        box-sizing: border-box;
        scrollbar-width: thin;
        scrollbar-color: var(--in-game-border-color) transparent;
    }

    .general::-webkit-scrollbar {
        width: 6px;
    }

    .general::-webkit-scrollbar-thumb {
        background: var(--in-game-border-color);
        border-radius: 3px;
    }
    
    :host([mobile]) .general {
        gap: 8px;
    }
`,Dt=o`
    :host {
        display: block;
    }

    .banner {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid var(--in-game-inactive-state-color);
        background: var(--in-game-collapsed-widget-surface-color);
    }

    .banner--5 {
        border-color: var(--in-game-info-state-color);
    }

    .banner__title {
        font-weight: 700;
        color: var(--in-game-inactive-state-color);
    }

    .banner--5 .banner__title {
        color: var(--in-game-info-state-color);
    }

    .banner__message {
        color: var(--in-game-secondary-text-color);
    }
`;customElements.define("jackpot-status-banner",class extends mt{static properties={status:{type:String},message:{type:String}};static elementStyles=Dt;constructor(){super(),this.status="",this.message=""}render(){const{status:t,message:e}=this;return D`
        <div class="banner banner--${t}">
            <div class="banner__title body-text-sm">${t}</div>
            ${e?D`
                <div class="body-text-sm banner__message">${this.message}</div>`:V}
        </div>
    `}});var Jt=o`
    :host {
        display: block;
    }

    .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: var(--border-radius-md);
        background: var(--in-game-expanded-widget-surface-color);
        height: 198px;
    }

    .total-amount {
        font-weight: 600;
        color: var(--in-game-text-color);
    }

    .card__logo-wrapper {
        width: 100%;
        justify-content: center;
        padding: 12px 0;
    }

    .card__logo {
        width: 180px;
        height: 84px;
        border-radius: var(--border-radius-sm);
        object-fit: contain;
    }

    .card__info {
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
    }

    .info-top {
        gap: 2px;
        align-items: center;
    }

    .card__label {
        width: 100%;
        justify-content: center;
        color: var(--in-game-secondary-text-color);
    }

    .card__total {
        font-weight: 700;
        color: var(--in-game-amount-color);
    }

    .card__min-bet {
        font-weight: 500;
        color: var(--in-game-secondary-text-color);
    }

    .card__min-bet-value {
        font-weight: 600;
        color: var(--in-game-text-color);
        font-variant-numeric: tabular-nums;
    }

    /* ---------- Mobile  ---------- */

    :host([mobile][isMobileHeader]) .card {
        height: 100px;
        flex-direction: row;
        align-items: center;
    }

    :host([mobile][isMobileHeader]) .card__logo-wrapper {
        width: 168px;
        height: 93px;
        padding: 0 0 0 8px;
    }

    :host([mobile][isMobileHeader]) .card__info {
        width: auto;
        flex: 1;
        align-items: flex-start;
        padding: 12px 0 12px 12px;
    }

    :host([mobile][isMobileHeader]) .card__label {
        justify-content: unset;
    }

    :host([mobile][isMobileHeader]) .card__logo {
        width: 100%;
        height: 100%;
        border-radius: var(--border-radius-sm);
    }
`,Vt=o`
    :host {
        display: inline-block;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }

    .amount {
        font: inherit;
        color: inherit;
    }
`,Gt=(t,e=null)=>`${t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}).replace(/,/g," ")} ${e||""}`,Wt=({host:t,variableName:e,color:i,percentage:a})=>{const n=`color-mix(in srgb, ${i.value} ${a}%, transparent)`;t.style.setProperty(e,n)},qt=(t,e={})=>{const i={Jan:e.jan??"Jan",Feb:e.feb??"Feb",Mar:e.mar??"Mar",Apr:e.apr??"Apr",May:e.may??"May",Jun:e.jun??"Jun",Jul:e.jul??"Jul",Aug:e.aug??"Aug",Sep:e.sep??"Sep",Oct:e.oct??"Oct",Nov:e.nov??"Nov",Dec:e.dec??"Dec"};if(!t)return"";const a=new Date(t);return isNaN(a.getTime())?"":`${String(a.getDate()).padStart(2,"0")} ${i[a.toLocaleString("en-US",{month:"short"})]}, ${a.getFullYear()} ${String(a.getHours()).padStart(2,"0")}:${String(a.getMinutes()).padStart(2,"0")}`},Kt=(t,e)=>{if(!t)return"";const i=new Date(t);return isNaN(i.getTime())?"":`${String(i.getDate()).padStart(2,"0")} ${e?.[yt[i.getMonth()]]||""}`.trim()};var Yt=(t,e,i)=>{e||i||("hidden"!==document.visibilityState?t.resume():t.pause())},Xt=class{constructor({el:t,value:e,duration:i=2500}){this.el=t,this.duration=i,this.decimals=2,this.currentValue=e,this._rafId=null,this._formatter=new Intl.NumberFormat("en-US",{minimumFractionDigits:this.decimals,maximumFractionDigits:this.decimals}),this.animateNumber(this.currentValue,e)}formatter(t){return this._formatter.format(t)}animateNumber(t,e){this._rafId&&cancelAnimationFrame(this._rafId);const i=performance.now(),a=this.duration,n=o=>{const s=o-i,r=Math.min(s/a,1),l=1-Math.pow(1-r,3),c=t+(e-t)*l;this.el.textContent=this.formatter(c),r<1?this._rafId=requestAnimationFrame(n):(this.currentValue=e,this._rafId=null)};this._rafId=requestAnimationFrame(n)}update(t){t!==this.currentValue&&this.animateNumber(this.currentValue,t)}};customElements.define("jackpot-animated-amount",class extends mt{static properties={value:{type:Number},suffix:{type:String}};static elementStyles=Vt;constructor(){super(),this.value=0,this.suffix="",this._odometer=null}render(){return D`<span class="amount"></span>`}firstUpdated(){const t=this.renderRoot?.querySelector(".amount");if(!t)return;this._odometer=new Xt({el:t,value:0,duration:1500});const e=this.suffix;this._odometer.formatter=t=>Gt(t,e),null!=this.value&&0!==this.value&&this._odometer.update(this.value)}updated(t){if(this._odometer){if(t.has("suffix")){const t=this.suffix;this._odometer.formatter=e=>Gt(e,t)}t.has("value")&&null!=this.value&&this._odometer.update(this.value)}}disconnectedCallback(){super.disconnectedCallback(),this._odometer&&this._odometer._rafId&&(cancelAnimationFrame(this._odometer._rafId),this._odometer._rafId=null),this._odometer=null}});var Qt=class extends mt{static properties={jackpot:{type:Object},mobile:{type:Boolean,reflect:!0},isMobileHeader:{type:Boolean,reflect:!0},totalAmount:{type:Number},currency:{attribute:!1},translations:{attribute:!1}};static elementStyles=Jt;constructor(){super(),this.jackpot={},this.mobile=!1,this.totalAmount=0,this.currency=null,this.translations={}}render(){const{logo:t="",name:e="",levels:i,translations:a}=this.jackpot,n=i?.[0]?.minBetAmount??null;return this.isMobileHeader=i?.length>=2,D`
        <div class="card">
            ${t?D`
                        <div class="card__logo-wrapper flex">
                            <img class="card__logo" src=${t} alt=${e} loading="lazy"/>
                        </div>`:V}

            <div class="card__info flex direction-column">
                <div class="info-top flex direction-column ">
                    <div class="card__label flex body-text-sm">${a?.jackpotTotal??"Jackpot Total"}</div>

                    <jackpot-animated-amount
                            class="title-lg total-amount"
                            .value=${this.totalAmount}
                            .suffix=${this.currency}
                    ></jackpot-animated-amount>

                </div>

                <div class="info-bottom">
                    ${null!=n?D`
                                <div class="card__min-bet body-text-sm">
                                    ${a?.minBet??"Min Bet"}: <span
                                        class="card__min-bet-value">${Gt(n,this.currency)}</span>
                                    <!-- Min Bet Amount:  todo: translations-->
                                </div>
                            `:V}
                </div>
            </div>
        </div>
    `}};customElements.define("jackpot-header",Qt);var te=(t,e,i)=>{const a=new Map;for(let n=e;n<=i;n++)a.set(t[n],n);return a},ee=jt(class extends Et{constructor(t){if(super(t),t.type!==Mt)throw Error("repeat() can only be used in text expressions")}dt(t,e,i){let a;void 0===i?i=e:void 0!==e&&(a=e);const n=[],o=[];let s=0;for(const r of t)n[s]=a?a(r,s):s,o[s]=i(r,s),s++;return{values:o,keys:n}}render(t,e,i){return this.dt(t,e,i).values}update(t,[e,i,a]){const n=(t=>t._$AH)(t),{values:o,keys:s}=this.dt(e,i,a);if(!Array.isArray(n))return this.ut=s,o;const r=this.ut??=[],l=[];let c,d,h=0,p=n.length-1,u=0,m=o.length-1;for(;h<=p&&u<=m;)if(null===n[h])h++;else if(null===n[p])p--;else if(r[h]===s[u])l[u]=Nt(n[h],o[u]),h++,u++;else if(r[p]===s[m])l[m]=Nt(n[p],o[m]),p--,m--;else if(r[h]===s[m])l[m]=Nt(n[h],o[m]),Ft(t,l[m+1],n[h]),h++,m--;else if(r[p]===s[u])l[u]=Nt(n[p],o[u]),Ft(t,n[h],n[p]),p--,u++;else if(void 0===c&&(c=te(s,u,m),d=te(r,h,p)),c.has(r[h]))if(c.has(r[p])){const e=d.get(s[u]),i=void 0!==e?n[e]:null;if(null===i){const e=Ft(t,n[h]);Nt(e,o[u]),l[u]=e}else l[u]=Nt(i,o[u]),Ft(t,n[h],i),n[e]=null;u++}else zt(n[p]),p--;else zt(n[h]),h++;for(;u<=m;){const e=Ft(t,l[m+1]);Nt(e,o[u]),l[u++]=e}for(;h<=p;){const t=n[h++];null!==t&&zt(t)}return this.ut=s,Ht(t,l),J}}),ie=o`
    :host {
        display: block;
    }

    :host([mobile]) {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
    }

    .levels {
        display: flex;
        flex-direction: column;
    }

    :host([mobile]) .levels {
        justify-content: center;   
        flex: 1;              
        min-height: 0;
    }

    :host([mobile]) .levels > jackpot-level {
        flex: 0 0 auto;
    }

    ::slotted(jackpot-level),
    jackpot-level {
        border-bottom: 1px solid var(--in-game-border-color);
    }

    jackpot-level:last-child {
        border-bottom: none;
    }
`,ae=jt(class extends Et{constructor(t){if(super(t),t.type!==St||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const a of this.st)a in e||(i.remove(a),this.st.delete(a));for(const a in e){const t=!!e[a];t===this.st.has(a)||this.nt?.has(a)||(t?(i.add(a),this.st.add(a)):(i.remove(a),this.st.delete(a)))}return J}}),ne="important",oe=" !"+ne,se=jt(class extends Et{constructor(t){if(super(t),t.type!==St||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const a=t[i];return null==a?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${a};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const a of this.ft)e[a]??(this.ft.delete(a),a.includes("-")?i.removeProperty(a):i[a]=null);for(const a in e){const t=e[a];if(null!=t){this.ft.add(a);const e="string"==typeof t&&t.endsWith(oe);a.includes("-")||e?i.setProperty(a,e?t.slice(0,-11):t,e?ne:""):i[a]=t}}return J}}),re=o`
    :host {
        display: block;
    }

    .level {
        display: flex;
        flex-direction: column;
        border-radius: var(--border-radius-md);
        transition: background 160ms ease;
    }

    .level--clickable {
        cursor: pointer;
    }

    .level--clickable:hover {
        background: var(--in-game-expanded-widget-surface-color);
    }

    .level--clickable:active {
        background: var(--in-game-expanded-widget-surface-color);
        transform: scale(0.99);
    }

    .level--clickable:focus-visible {
        outline: 2px solid var(--level-color, var(--in-game-primary-color));
        outline-offset: 1px;
    }

    .level__row {
        display: grid;
        grid-template-columns: 32px 1fr auto;
        align-items: center;

        gap: 8px;
        min-width: 0;
        padding: 4px 40px 4px 12px;
    }

    .level__icon {
        width: 28px;
        height: 28px;
        object-fit: contain;
        display: block;
    }

    .level__dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--level-color, var(--in-game-primary-color));
        justify-self: center;
    }

    .level__text {
        display: flex;
        gap: 4px;
        flex-direction: column;
        align-items: center;
        min-width: 0;
        text-align: center;
    }

    .level__name {
        color: var(--in-game-secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    .level__amount {
        font-weight: 700;
        color: var(--in-game-amount-color);
    }
`;customElements.define("jackpot-level",class extends mt{static properties={level:{type:Object},currency:{type:String},onOpen:{attribute:!1},currentAmount:{type:Number}};static elementStyles=re;constructor(){super(),this.level=null,this.currency="",this.onOpen=null,this.currentAmount=0}_onClick=()=>{this.level&&this.level.stats&&"function"==typeof this.onOpen&&this.onOpen(this.level,this.currentAmount)};render(){if(!this.level)return V;const t=this.level;return D`
        <div
                class=${ae({level:!0,"level--clickable":!!t.stats})}
                style=${se({"--level-color":t.color||"var(--in-game-primary-color)"})}
                @click=${this._onClick}
        >
            <div class="level__row">
                ${t.iconInfo.icon?D`<img class="level__icon" src=${t.iconInfo.icon} alt=${t.translations.name||""} loading="lazy"/>`:D`<span class="level__dot" aria-hidden="true"></span>`}
                <div class="level__text">
                    <div class="level__name caption">${t.translations.name}</div> <!--todo: remove levelTranslations => translations-->

                    <jackpot-animated-amount
                            class="body-text-sm level__amount"
                            .value=${this.currentAmount}
                            .suffix=${this.currency}
                    ></jackpot-animated-amount>
                </div>
            </div>
        </div>
    `}});var le=class extends mt{static properties={jackpotId:{type:Number},levels:{type:Array},currency:{type:String},onLevelOpen:{attribute:!1},mobile:{type:Boolean,reflect:!0},currentAmounts:{type:Array,attribute:!1}};static elementStyles=ie;constructor(){super(),this.jackpotId=null,this.levels=[],this.currency="",this.onLevelOpen=()=>{}}render(){return this.levels.length?D`
        <div class="levels">
            ${ee(this.levels,t=>`${this.jackpotId}:${t.levelOrder}`,(t,e)=>D`
                            <jackpot-level
                                    .level=${t}
                                    .currency=${this.currency}
                                    .onOpen=${this.onLevelOpen}
                                    .currentAmount=${this.currentAmounts[e]?.amount||0}
                            ></jackpot-level>
                        `)}
        </div>
    `:V}};customElements.define("jackpot-levels",le);var ce=o`
    :host {
        position: absolute;
        inset: 0;
        z-index: 10;
        display: block;
    }

    .panel {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: var(--in-game-background-color);
        box-sizing: border-box;
    }

    .panel__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 0 0 12px 0;
        flex-shrink: 0;
    }

    .panel__title {
        font-weight: 700;
        color: var(--in-game-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
    }

    .panel__close {
        cursor: pointer;
    }

    .panel__body {
        overflow-y: auto;
        flex: 1;
        min-height: 0;
        scrollbar-width: thin;
        scrollbar-color: var(--in-game-expanded-widget-surface-color);
    }

    .panel__body::-webkit-scrollbar {
        width: 6px;
    }

    .panel__body::-webkit-scrollbar-thumb {
        background: var(--in-game-border-color, rgba(255, 255, 255, 0.1));
        border-radius: 3px;
    }
`,de=o`
    :host {
        display: block;
    }

    .card {
        display: flex;
        align-items: center;
        min-height: 56px;
        padding: 8px;
        margin-bottom: 12px;
        background: var(--in-game-expanded-widget-surface-color);
        border-radius: 16px;
        box-sizing: var(--border-radius-lg);
    }

    .card__icon {
        width: 28px;
        height: 28px;
        object-fit: contain;
        pointer-events: none;
    }

    .card__content {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        text-align: center;
    }

    .card__level {
        font-weight: 600;
        color: var(--in-game-secondary-text-color);
    }

    .card__amount {
        font-weight: 700;
        color: var(--in-game-text-color);
        font-variant-numeric: tabular-nums;
    }

    .card__winner {
        display: inline-flex;
        align-items: baseline;
        gap: 5px;
        color: var(--in-game-secondary-text-color);
    }

    .card__winner strong {
        font-weight: 700;
        color: var(--in-game-text-color);
    }

    /* ---- Stat rows ---- */

    .stats {
        display: flex;
        flex-direction: column;
        padding: 0 8px;
    }

    .row {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 8px 0;
        border-top: 1px solid var(--in-game-border-color);
    }

    .row:first-child {
        padding: 0 0 8px 0;
    }

    .row:last-child {
        padding: 8px 0 0 0;
    }

    .row:first-child {
        border-top: none;
    }

    .row--single {
        flex-direction: row;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
    }

    .row__line {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 4px;
    }

    .row__line--sub {
        margin-top: 1px;
    }

    .row__label {
        max-width: 60%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 700;
        color: var(--in-game-text-color);
        min-width: 0;
    }

    .row__primary {
        max-width: 38%;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
        color: var(--in-game-text-color);
        font-variant-numeric: tabular-nums;
    }

    .row__meta {
        color: var(--in-game-secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }


    .row__meta:first-child {

    }

    .row__meta-left-text {
        max-width: 60%;
    }

    .row__meta-right-text {
        max-width: 38%;
    }
`,he=t=>{const{label:e,win:i,currency:a,translations:n}=t;return i?D`
      <div class="row row--win">
          <div class="row__line title-sm">
              <div class="row__label">${e}</div>
              <div class="row__primary">${Gt(i.amount,a)}</div>
          </div>

          <div class="row__line body-text-sm row__line--sub">
              <div class="row__meta row__meta-left-text">${n.playerId??"ID"}: ${i.playerId} | ${i.game}</div>
              <!-- todo: add Translation -->
              <div class="row__meta row__meta-right-text">${qt(i.date,n)}</div>
          </div>
      </div>
  `:V};customElements.define("jackpot-level-stats",class extends mt{static properties={level:{type:Object},stats:{type:Object},currency:{type:String},jackpot:{type:Object},translations:{attribute:!1}};static elementStyles=de;constructor(){super(),this.level=null,this.stats=null,this.currency="",this.jackpot=null,this.translations={}}render(){const t=this.stats??this.level?.stats??null;if(!t&&!this.level)return V;const{currency:e,level:i,jackpot:a,translations:n}=this;return D`
        ${(({level:t,currency:e})=>{if(!t)return V;const i=t.translations.name??"",a=t.amount??0,n=t.winnerNumber??t.winnersCount??t.winner??null,o=t.iconInfo.icon;return D`
      <div class="card">
          ${o?D`<img class="card__icon" src=${o} alt="" aria-hidden="true"/>`:V}
          <div class="card__content">
              ${i?D`
                          <div class="card__level">${i}</div>`:V}
              ${null!==a?D`
                          <div class="card__amount">${Gt(a,e)}</div>`:V}
              ${null!==n?D`
                          <div class="card__winner">
                              <span>Winner</span><!--todo: add Translation-->
                              <strong>${n}</strong>
                          </div>`:V}
          </div>
      </div>
  `})({level:i,currency:e})}

        <div class="stats">
            ${he({label:a?.translation?.largestWinAmount,win:t?.largestWin,currency:e,translations:n})}
            <!--todo: add Translation-->
            ${he({label:a?.translation?.lastWinAmount,win:t?.lastWin,currency:e,translations:n})}
            <!--todo: add Translation-->

            ${(({label:t,value:e})=>null==e?V:D`
      <div class="row row--single">
          <div class="row__label title-sm">${t}</div>
          <div class="row__primary title-sm">${Number(e).toLocaleString("en-US")}</div>
      </div>
  `)({label:a?.translation?.numberOfWinners,value:t?.numberOfWinners})}
            <!--todo: add Translation-->

            ${null!=t?.totalWon?D`
                ${(t=>{const{label:e,totalWon:i,currency:a}=t;return D`
        <div class="row row--single">
            <div class="row__label title-sm">${e}</div>
            <div class="row__primary title-sm">${Gt(i,a)}</div>
        </div>
    `})({label:a?.translation?.totalWon,currency:e,totalWon:t.totalWon})}
            `:V}
            <!--todo: add Translation-->
        </div>
    `}});customElements.define("jackpot-level-stats-overlay",class extends mt{static properties={level:{type:Object},currency:{type:String},onClose:{attribute:!1},jackpot:{type:Object},translations:{attribute:!1}};static elementStyles=ce;constructor(){super(),this.level=null,this.currency="",this.onClose=()=>{},this.jackpot=null,this.translations={}}render(){if(!this.level)return V;const{level:t,currency:e,jackpot:i,translations:a}=this;return D`
        <div class="panel" role="dialog" aria-label="Level Information">
            <div class="panel__header">
                <div class="panel__title title-md">Level Information</div> <!--todo: add Translation-->
                <span @click=${()=>this.onClose()} class="panel__close">
                    ${kt}
                </span>
            </div>
            <div class="panel__body">
                <jackpot-level-stats
                        .jackpot=${i}
                        .level=${t}
                        .stats=${t.stats}
                        .currency=${e}
                        .translations=${a}
                ></jackpot-level-stats>
            </div>
        </div>
    `}});var pe=class extends mt{static properties={jackpot:{type:Object},_openLevel:{state:!0},mobile:{type:Boolean,reflect:!0},currentAmounts:{type:Array,attribute:!1},currencySymbol:{attribute:!1},translations:{attribute:!1}};static elementStyles=Ot;constructor(){super(),this.jackpot=null,this._openLevel=null,this.mobile=!1,this.currentAmounts=[],this.currencySymbol=null,this.translations={}}willUpdate(t){if(!t.has("jackpot"))return;const e=t.get("jackpot");if(this._openLevel)if(e&&this.jackpot&&e.groupId!==this.jackpot.groupId)this._openLevel=null;else if(this.jackpot&&this.jackpot.levels){const t=this.jackpot.levels;let e=null;for(let i=0;i<t.length;i++)if(t[i].id===this._openLevel.id){e=t[i];break}this._openLevel=e&&e.stats?e:null}else this._openLevel=null}_openStats=(t,e)=>{this._openLevel=t,this._openLevel.amount=e??0};_closeStats=()=>{this._openLevel=null};render(){const{jackpot:t,_closeStats:e,_openStats:i,currentAmounts:a,mobile:n,translations:o,currencySymbol:s}=this;if(!t)return V;const{id:r,levels:l}=t;let c=0;return a.forEach(t=>{c+=t.amount}),D`
        <div class="general">
            ${Rt(r,D`
                <jackpot-header
                        .jackpot=${t}
                        .totalAmount=${c}
                        ?mobile=${n}
                        .currency=${s}
                        .translations=${o}
                ></jackpot-header>
            `)}

            <jackpot-levels
                    .jackpotId=${r}
                    .levels=${l||[]}
                    .currentAmounts=${a}
                    .currency=${s||""}
                    .onLevelOpen=${i}
                    ?mobile=${n}
            ></jackpot-levels>
        </div>

        ${this._openLevel?D`
                    <jackpot-level-stats-overlay
                            .level=${this._openLevel}
                            .jackpot=${t}
                            .currency=${s||""}
                            .onClose=${e}
                            .translations=${o}
                    ></jackpot-level-stats-overlay>
                `:V}
    `}};customElements.define("general-tab",pe);var ue=o`
    :host {
        display: block;
        height: 100%;
        min-height: 0;
    }

    :host([mobile]) .top-winners-wrapper::-webkit-scrollbar {
        display: none;
    }

    .top-winners-wrapper {
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
`,me=o`
    :host {
        display: block;
        background: var(--in-game-expanded-widget-surface-color);
        border-radius: var(--border-radius-md);
    }

    .card {
        display: grid;
        grid-template-columns: 86px 1fr;
        gap: 8px;
        padding: 4px 12px 4px 4px;
        align-items: center;
    }

    .game-image {
        width: 84px;
        height: 56px;
        border-radius: var(--border-radius-sm);
        overflow: hidden;
    }

    .game-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    .info-top,
    .info-bottom {
        display: flex;
        width: 100%;
        min-width: 0;
    }

    .amount {
        font-weight: 700;
        text-align: left;
        color: var(--in-game-amount-color);
        width: 45%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .game-name {
        text-align: right;
        font-weight: 600;
        color: var(--in-game-text-color);
        width: 55%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .player-id {
        text-align: left;
        color: var(--in-game-secondary-text-color);
        width: 45%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .date {
        text-align: right;
        color: var(--in-game-secondary-text-color);
        width: 55%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`,ge=class extends mt{static properties={amount:{type:Number},currency:{type:String},playerId:{type:String},gameName:{type:String},gameImage:{type:String},date:{type:String},active:{type:Boolean,reflect:!0},translations:{attribute:!1}};static elementStyles=me;constructor(){super(),this.amount=0,this.currency="",this.playerId="",this.gameName="",this.gameImage="",this.date="",this.active=!1,this.translations={}}_formattedAmount="";_formattedDate="";willUpdate(t){(t.has("amount")||t.has("currency"))&&(this._formattedAmount=`${this.currency} ${this.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g," ")}`),t.has("date")&&this.date&&(this._formattedDate=qt(this.date,this.translations))}render(){return D`
        <div class="card">
            
            <div class="game-image">
                <img src=${this.gameImage} alt=${this.gameName} loading="lazy"/>
            </div>

            <div class="info flex">
                <div class="info-top">
                    <span class="amount title-sm">${this._formattedAmount}</span>
                    <span class="game-name title-sm">${this.gameName}</span>
                </div>

                <div class="info-bottom">
                    <span class="player-id body-text-sm secondary">ID: ${this.playerId}</span>
                    <span class="date secondary body-text-sm">${this._formattedDate}</span>
                </div>

            </div>
        </div>
    `}};customElements.define("top-winners-card",ge);var Ce=class extends mt{static properties={topWinners:{type:Array},currency:{type:String},mobile:{type:Boolean,reflect:!0},translations:{attribute:!1}};static elementStyles=ue;constructor(){super(),this.topWinners=[],this.currency="",this.translations={}}render(){const{topWinners:t,currency:e,translations:i}=this;return D`
        <div class="top-winners-wrapper">
            ${t.map(t=>{const{amount:a,playerId:n,gameName:o,gameImage:s,date:r}=t;return D`
                    <top-winners-card
                            .amount=${a}
                            .currency=${e}
                            .playerId=${n}
                            .gameName=${o}
                            .gameImage=${s}
                            .date=${r}
                            .translations=${i}
                    ></top-winners-card>
                `})}
        </div>
    `}};customElements.define("top-winners-tab",Ce);var be=o`
    :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
    }

    .grid {
        display: grid;
        gap: 8px;
        padding: 4px 0 0 0;
        width: 100%;
    }

    .grid--vertical {
        grid-template-columns: repeat(3, 1fr);
    }

    .grid--horizontal {
        grid-template-columns: repeat(2, 1fr);
    }

    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: var(--border-radius-md);
        overflow: hidden;
    }

    .card--current {
        outline: 2px solid var(--accent-color);
    }

    .card__image-vertical {
        width: 100%;
        aspect-ratio: 4 / 5.6;
        object-fit: cover;
        display: block;
    }

    .card__image-horizontal {
        width: 100%;
        aspect-ratio: 4 / 2.7;
        object-fit: cover;
        display: block;
    }
`;customElements.define("games-tab",class extends mt{static properties={games:{type:Array},gameThumbnailType:{type:Number},gameId:{attribute:!1}};static elementStyles=be;render(){const t=this.games??[],e=2===this.gameThumbnailType,i=e?"card__image-vertical":"card__image-horizontal";return D`
        <div class=${e?"grid grid--vertical":"grid grid--horizontal"}>
            ${t.map(t=>t.id!==this.gameId?D`
                <div class="card">
                    <img
                            class=${i}
                            src=${e?t.imageVerticalUrl:t.imageHorizontalUrl}
                            alt=${t.name}
                            loading="lazy"
                    />
                </div>
            `:V)}
        </div>
    `}});var ve=class extends Et{constructor(t){if(super(t),this.it=V,t.type!==Mt)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===V||null==t)return this._t=void 0,this.it=t;if(t===J)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};ve.directiveName="unsafeHTML",ve.resultType=1;var fe=jt(ve),ye=o`
    .rules-wrapper {
        color: var(--in-game-text-color);
    }

    .title {
        display: block;
        margin-bottom: 8px;
    }

    .inner-text {
        font-size: var(--fz-body-md) !important;
        line-height: var(--lh-body-md) !important;
    }
`;customElements.define("rules-tab",class extends mt{static properties={rules:{type:String},title:{type:String}};static elementStyles=ye;constructor(){super(),this.rules=""}render(){const{rules:t,title:e}=this;return D`
      <div class="rules-wrapper">
        ${e?D`<span class="title-md title">${e}</span>`:V}  <!-- todo: translation -->
        <div class="body-text-md inner-text">${fe(t)}</div>
      </div>
    `}});var xe=o`
    .switcher-wrapper {
        margin-bottom: 4px;
        height: 32px;
    }

    .icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--in-game-text-color);
    }

    .name {
        color: var(--in-game-text-color);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        min-width: 0;
        flex: 1;
        text-align: center;
        user-select: none;
    }
`;customElements.define("entity-switcher",class extends mt{static properties={name:{type:String},currentId:{type:Number},allItems:{type:Array},onChange:{attribute:!1}};static elementStyles=xe;constructor(){super(),this.name="",this.currentId=null,this.allItems=[],this.onChange=null,this._isStart=!1,this._isEnd=!1}willUpdate(t){if(t.has("currentId")||t.has("allItems")){const t=this.allItems.indexOf(this.currentId);this._isStart=t<=0,this._isEnd=t<0||t>=this.allItems.length-1}}onSwitch=t=>{if(t?this._isEnd:this._isStart)return;const e=this.allItems.indexOf(this.currentId),i=this.allItems[t?e+1:e-1];this.onChange?.(i)};render(){const t=this.allItems.length>1;return D`
        <div class="switcher-wrapper flex align-center space-between ${t?"":"justify-center"}">
            ${t?D`<span
                            class=${ae({icon:!0,disabled:this._isStart})}
                            @click=${()=>this.onSwitch(!1)}
                    >
            ${((t=!1)=>D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M10.7285 3.39409L6.27486 7.99382L10.7285 12.6189C11.3303 13.2288 10.3433 14.2708 9.74139 13.6354L4.66182 8.42565C4.44519 8.19699 4.44519 7.81578 4.66182 7.61249L9.74139 2.35203C10.3432 1.74215 11.3303 2.78398 10.7285 3.39401L10.7285 3.39409Z"
              fill-opacity=${t?.3:1}/>
    </svg>
`)(this._isStart)}
        </span>`:V}

            <span class="name title-md">${this.name}</span>
            ${t?D`<span
                            class=${ae({icon:!0,disabled:this._isEnd})}
                            @click=${()=>this.onSwitch(!0)}
                    >
                ${((t=!1)=>D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M5.2715 12.6059L9.72513 8.00618L5.2715 3.38109C4.66971 2.77121 5.65667 1.72919 6.25861 2.36462L11.3382 7.57435C11.5548 7.80301 11.5548 8.18422 11.3382 8.38751L6.25861 13.648C5.65682 14.2578 4.66967 13.216 5.2715 12.606L5.2715 12.6059Z"
              fill-opacity=${t?.3:1}/>
    </svg>
`)(this._isEnd)}
            </span>`:V}
        </div>
    `}});var we=o`
    :host {
        display: block;
        width: 100%;
    }

    .tabs-wrapper {
        display: flex;
        align-items: center;
        overflow: auto;
        padding: 0 0 4px 0;
        margin: 0 16px 8px 16px;
        scrollbar-width: none;
    }

    .tabs-wrapper::-webkit-scrollbar {
        display: none;
    }

    :host([mobile]) .tabs-wrapper {
        padding: 0 12px 4px 12px;
        margin: 0 0 8px 0;
    }

    .tab {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 8px 16px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--in-game-secondary-text-color);
        line-height: 1;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .tab:hover, .tab:hover svg, .tab:hover svg path {
        color: var(--in-game-text-color);
    }

    .tab::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background: var(--in-game-primary-color);
        transform: scaleX(0);
        transform-origin: left; 
        transition: transform 0.1s ease;
    }

    .tab.active::after {
        transform: scaleX(1);
    }

    .tab svg {
        flex-shrink: 0;
        transition: opacity 0.2s ease;
    }

    .tab.active {
        color: var(--in-game-text-color);
    }

    .tab.active svg path {
        fill: var(--in-game-text-color);
    }
`,_e=class extends mt{static properties={availableTabs:{type:Array},activeTabId:{type:Number},onChange:{attribute:!1},mobile:{type:Boolean,reflect:!0}};static elementStyles=we;constructor(){super(),this.availableTabs=[],this.activeTabId=null,this.onChange=()=>{}}firstUpdated(){this._tabsWrapper=this.renderRoot.querySelector(".tabs-wrapper"),this._onWheel=t=>{t.preventDefault(),this._tabsWrapper.scrollLeft+=t.deltaY},this._tabsWrapper.addEventListener("wheel",this._onWheel,{passive:!1})}disconnectedCallback(){super.disconnectedCallback(),this._tabsWrapper?.removeEventListener("wheel",this._onWheel)}willUpdate(t){if(!t.has("availableTabs")||!this.availableTabs?.length)return;const e=this.availableTabs.some(t=>t.id===this.activeTabId);this.activeTabId&&e||(this.activeTabId=this.availableTabs[0].id,this.onChange(this.activeTabId))}_onTabClick=(t,e)=>{t!==this.activeTabId&&(this.activeTabId=t,this.onChange(t)),this._scrollTabIntoView(e.currentTarget)};_scrollTabIntoView(t){t&&this._tabsWrapper&&t.scrollIntoView({behavior:"smooth",block:"nearest",inline:"nearest"})}render(){const{_onTabClick:t,availableTabs:e,activeTabId:i}=this;return D`
          <div class="tabs-wrapper">
              ${e?.map(e=>D`
                              <span
                                      class=${ae({tab:!0,active:e.id===i})}
                                      @click=${i=>t(e.id,i)}
                              >
                             ${e.icon}
                             <span class="body-text-sm">${e.name}</span>
                         </span>`)}
          </div>
      `}};customElements.define("tab-navigation",_e);var $e=o`
    :host {
        display: block;
        width: 100%;
        height: 100%;
    }

    .loader-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .loader {
        width: 40px;
        height: 40px;
        border: 4px solid var(--in-game-border-color);
        border-top-color: var(--in-game-text-color);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`,ke=class extends mt{static properties={loading:{type:Boolean}};static elementStyles=$e;constructor(){super(),this.loading=!1}render(){return this.loading?D`
      <div class="loader-wrapper">
        <div class="loader"></div>
      </div>
    `:V}};customElements.define("panel-loader",ke);var Ie=o`
    :host {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        width: 100%;
    }


    .content-wrapper {
        flex: 1;
        overflow: auto;
        padding: 0 16px;
    }


    .content-wrapper::-webkit-scrollbar {
        height: 2px;
        width: 2px;
    }

    .content-wrapper::-webkit-scrollbar-thumb {
        background: var(--in-game-secondary-text-color);
        border-radius: 5px;
    }

    &::-webkit-scrollbar-track {
        background: var(--in-game-secondary-text-color);
    }

    .tab-wrapper {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }

    .error {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
    }

    .loader-wrapper {
        flex: 1;
        min-height: 0;
    }


    /* ===== Mobile ===== */

    :host([mobile]) .content-wrapper::-webkit-scrollbar {
        display: none;
    }

    :host([mobile]) .content-wrapper {
        padding: 0 12px;
    }
`,Le=D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.31948 13.7937C5.98615 13.7937 5.75281 13.6804 5.61281 13.5737C5.34615 13.3804 4.93281 12.8804 5.19281 11.7604L5.5728 10.1204C5.60613 9.98036 5.5328 9.72703 5.4328 9.62036L4.10614 8.2937C3.40614 7.5937 3.46614 6.98703 3.55947 6.68703C3.6528 6.38703 3.95947 5.86036 4.9328 5.6937L6.63281 5.4137C6.75948 5.3937 6.96614 5.24037 7.01947 5.12703L7.95947 3.24703C8.41281 2.34036 9.01281 2.20703 9.33281 2.20703C9.65281 2.20703 10.2528 2.34036 10.7061 3.24703L11.6461 5.12703C11.7061 5.24037 11.9061 5.3937 12.0328 5.4137L13.7328 5.6937C14.7061 5.8537 15.0128 6.38703 15.1061 6.68703C15.1995 6.98703 15.2595 7.5937 14.5595 8.2937L13.2328 9.62036C13.1328 9.72036 13.0595 9.98036 13.0928 10.1204L13.4728 11.7604C13.7328 12.887 13.3195 13.3804 13.0528 13.5737C12.7861 13.767 12.1928 14.0137 11.1928 13.4204L9.59947 12.4737C9.46614 12.3937 9.18613 12.3937 9.0528 12.4737L7.45947 13.4204C6.99947 13.7004 6.61281 13.7937 6.31948 13.7937ZM9.33281 3.20703C9.22614 3.20703 9.0328 3.3337 8.8528 3.6937L7.9128 5.5737C7.7128 5.98037 7.23947 6.32704 6.79281 6.40037L5.09282 6.68037C4.71282 6.74704 4.53948 6.88704 4.50615 6.9937C4.47281 7.10037 4.5328 7.3137 4.80613 7.58704L6.13281 8.9137C6.47281 9.2537 6.65281 9.8737 6.54614 10.3404L6.16614 11.9804C6.05281 12.4537 6.12613 12.707 6.19946 12.767C6.2728 12.8204 6.53947 12.8137 6.9528 12.5604L8.5528 11.6137C8.99946 11.347 9.67281 11.347 10.1128 11.6137L11.7061 12.5604C12.1261 12.807 12.3928 12.8204 12.4661 12.767C12.5395 12.7137 12.6128 12.4604 12.4995 11.9804L12.1195 10.3404C12.0128 9.86703 12.1861 9.2537 12.5328 8.9137L13.8595 7.58704C14.1328 7.3137 14.1928 7.0937 14.1595 6.9937C14.1261 6.8937 13.9528 6.74704 13.5728 6.68037L11.8728 6.40037C11.4261 6.32704 10.9528 5.98037 10.7528 5.5737L9.81281 3.6937C9.63281 3.3337 9.43947 3.20703 9.33281 3.20703Z"/>
        <path d="M5.33398 3.83301H1.33398C1.06065 3.83301 0.833984 3.60634 0.833984 3.33301C0.833984 3.05967 1.06065 2.83301 1.33398 2.83301H5.33398C5.60732 2.83301 5.83398 3.05967 5.83398 3.33301C5.83398 3.60634 5.60732 3.83301 5.33398 3.83301Z"/>
        <path d="M3.33398 13.167H1.33398C1.06065 13.167 0.833984 12.9403 0.833984 12.667C0.833984 12.3937 1.06065 12.167 1.33398 12.167H3.33398C3.60732 12.167 3.83398 12.3937 3.83398 12.667C3.83398 12.9403 3.60732 13.167 3.33398 13.167Z"/>
        <path d="M2.00065 8.5H1.33398C1.06065 8.5 0.833984 8.27333 0.833984 8C0.833984 7.72667 1.06065 7.5 1.33398 7.5H2.00065C2.27398 7.5 2.50065 7.72667 2.50065 8C2.50065 8.27333 2.27398 8.5 2.00065 8.5Z"/>
    </svg>
`,Te=D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.99984 15.167C7.59984 15.167 7.20651 15.0737 6.88651 14.8937L3.73318 13.0737C2.42651 12.1937 2.33984 12.0337 2.33984 10.6537V7.34703C2.33984 5.96703 2.42651 5.80703 3.70651 4.94703L6.89318 3.10703C7.52651 2.74036 8.47984 2.74036 9.11318 3.10703L12.2665 4.92703C13.5732 5.80703 13.6598 5.96703 13.6598 7.34703V10.6537C13.6598 12.0337 13.5732 12.1937 12.2932 13.0537L9.10651 14.8937C8.79318 15.0804 8.39318 15.167 7.99984 15.167ZM7.99984 3.8337C7.77318 3.8337 7.54651 3.88036 7.38651 3.9737L4.23318 5.7937C3.33984 6.40036 3.33984 6.40036 3.33984 7.34703V10.6537C3.33984 11.6004 3.33984 11.6004 4.26651 12.227L7.39318 14.027C7.71318 14.2137 8.29318 14.2137 8.61318 14.027L11.7665 12.207C12.6598 11.6004 12.6598 11.6004 12.6598 10.6537V7.34703C12.6598 6.40036 12.6598 6.40036 11.7332 5.7737L8.60651 3.9737C8.45318 3.88036 8.22651 3.8337 7.99984 3.8337Z"/>
        <path d="M11.6673 5.58634C11.394 5.58634 11.1673 5.35967 11.1673 5.08634V3.33301C11.1673 2.27967 10.7207 1.83301 9.66732 1.83301H6.33398C5.28065 1.83301 4.83398 2.27967 4.83398 3.33301V5.03967C4.83398 5.31301 4.60732 5.53967 4.33398 5.53967C4.06065 5.53967 3.83398 5.31967 3.83398 5.03967V3.33301C3.83398 1.71967 4.72065 0.833008 6.33398 0.833008H9.66732C11.2807 0.833008 12.1673 1.71967 12.1673 3.33301V5.08634C12.1673 5.35967 11.9407 5.58634 11.6673 5.58634Z"/>
        <path d="M9.08748 11.7534C8.94748 11.7534 8.80081 11.7267 8.65414 11.6667L8.00081 11.4134L7.34748 11.6734C6.99414 11.8134 6.63414 11.7801 6.36748 11.5867C6.10081 11.3934 5.96081 11.0601 5.98081 10.6801L6.02081 9.98008L5.57414 9.44008C5.33414 9.14008 5.25414 8.79341 5.36081 8.47341C5.46081 8.16008 5.73414 7.92008 6.10081 7.82674L6.78081 7.65341L7.16081 7.06008C7.56748 6.42008 8.44081 6.42008 8.84748 7.06008L9.22748 7.65341L9.90748 7.82674C10.2741 7.92008 10.5475 8.16008 10.6475 8.47341C10.7475 8.78674 10.6675 9.14008 10.4275 9.43341L9.98081 9.97341L10.0208 10.6734C10.0408 11.0534 9.90081 11.3801 9.63414 11.5801C9.47414 11.6934 9.28748 11.7534 9.08748 11.7534ZM6.34748 8.80008L6.79414 9.34008C6.94748 9.52008 7.03414 9.80674 7.02081 10.0401L6.98081 10.7401L7.63414 10.4801C7.85414 10.3934 8.14748 10.3934 8.36748 10.4801L9.02081 10.7401L8.98081 10.0401C8.96748 9.80674 9.05414 9.52674 9.20748 9.34008L9.65414 8.80008L8.97414 8.62674C8.74748 8.56674 8.50748 8.39341 8.38081 8.20008L8.00748 7.61341L7.62748 8.20008C7.50081 8.40008 7.26081 8.57341 7.03414 8.63341L6.34748 8.80008Z"/>
    </svg>
`,Ae=D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.99984 15.167C7.59984 15.167 7.20651 15.0737 6.88651 14.8937L3.73318 13.0737C2.42651 12.1937 2.33984 12.0337 2.33984 10.6537V7.34703C2.33984 5.96703 2.42651 5.80703 3.70651 4.94703L6.89318 3.10703C7.52651 2.74036 8.47984 2.74036 9.11318 3.10703L12.2665 4.92703C13.5732 5.80703 13.6598 5.96703 13.6598 7.34703V10.6537C13.6598 12.0337 13.5732 12.1937 12.2932 13.0537L9.10651 14.8937C8.79318 15.0804 8.39318 15.167 7.99984 15.167ZM7.99984 3.8337C7.77318 3.8337 7.54651 3.88036 7.38651 3.9737L4.23318 5.7937C3.33984 6.40036 3.33984 6.40036 3.33984 7.34703V10.6537C3.33984 11.6004 3.33984 11.6004 4.26651 12.227L7.39318 14.027C7.71318 14.2137 8.29318 14.2137 8.61318 14.027L11.7665 12.207C12.6598 11.6004 12.6598 11.6004 12.6598 10.6537V7.34703C12.6598 6.40036 12.6598 6.40036 11.7332 5.7737L8.60651 3.9737C8.45318 3.88036 8.22651 3.8337 7.99984 3.8337Z"/>
        <path d="M11.6673 5.58634C11.394 5.58634 11.1673 5.35967 11.1673 5.08634V3.33301C11.1673 2.27967 10.7207 1.83301 9.66732 1.83301H6.33398C5.28065 1.83301 4.83398 2.27967 4.83398 3.33301V5.03967C4.83398 5.31301 4.60732 5.53967 4.33398 5.53967C4.06065 5.53967 3.83398 5.31967 3.83398 5.03967V3.33301C3.83398 1.71967 4.72065 0.833008 6.33398 0.833008H9.66732C11.2807 0.833008 12.1673 1.71967 12.1673 3.33301V5.08634C12.1673 5.35967 11.9407 5.58634 11.6673 5.58634Z"/>
        <path d="M9.08748 11.7534C8.94748 11.7534 8.80081 11.7267 8.65414 11.6667L8.00081 11.4134L7.34748 11.6734C6.99414 11.8134 6.63414 11.7801 6.36748 11.5867C6.10081 11.3934 5.96081 11.0601 5.98081 10.6801L6.02081 9.98008L5.57414 9.44008C5.33414 9.14008 5.25414 8.79341 5.36081 8.47341C5.46081 8.16008 5.73414 7.92008 6.10081 7.82674L6.78081 7.65341L7.16081 7.06008C7.56748 6.42008 8.44081 6.42008 8.84748 7.06008L9.22748 7.65341L9.90748 7.82674C10.2741 7.92008 10.5475 8.16008 10.6475 8.47341C10.7475 8.78674 10.6675 9.14008 10.4275 9.43341L9.98081 9.97341L10.0208 10.6734C10.0408 11.0534 9.90081 11.3801 9.63414 11.5801C9.47414 11.6934 9.28748 11.7534 9.08748 11.7534ZM6.34748 8.80008L6.79414 9.34008C6.94748 9.52008 7.03414 9.80674 7.02081 10.0401L6.98081 10.7401L7.63414 10.4801C7.85414 10.3934 8.14748 10.3934 8.36748 10.4801L9.02081 10.7401L8.98081 10.0401C8.96748 9.80674 9.05414 9.52674 9.20748 9.34008L9.65414 8.80008L8.97414 8.62674C8.74748 8.56674 8.50748 8.39341 8.38081 8.20008L8.00748 7.61341L7.62748 8.20008C7.50081 8.40008 7.26081 8.57341 7.03414 8.63341L6.34748 8.80008Z"/>
    </svg>
`,Se=D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.65973 15.1664C6.52639 15.1664 6.41973 15.1398 6.33973 15.1064C6.07306 15.0064 5.61973 14.6798 5.61973 13.6464V9.34643H4.05973C3.16639 9.34643 2.84639 8.92643 2.73306 8.67976C2.61973 8.42643 2.51973 7.91309 3.10639 7.23976L8.15306 1.50643C8.83306 0.733093 9.38639 0.786427 9.65306 0.886427C9.91973 0.986427 10.3731 1.31309 10.3731 2.34643V6.64643H11.9331C12.8264 6.64643 13.1464 7.06643 13.2597 7.31309C13.3731 7.56643 13.4731 8.07976 12.8864 8.75309L7.83973 14.4864C7.36639 15.0264 6.95306 15.1664 6.65973 15.1664ZM9.28639 1.82643C9.26639 1.85309 9.12639 1.91976 8.90639 2.17309L3.85973 7.90643C3.67306 8.11976 3.64639 8.25309 3.64639 8.27976C3.65973 8.28643 3.77973 8.35309 4.05973 8.35309H6.11973C6.39306 8.35309 6.61973 8.57976 6.61973 8.85309V13.6531C6.61973 13.9864 6.67973 14.1331 6.70639 14.1731C6.72639 14.1464 6.86639 14.0798 7.08639 13.8264L12.1331 8.09309C12.3197 7.87976 12.3464 7.74643 12.3464 7.71976C12.3331 7.71309 12.2131 7.64643 11.9331 7.64643H9.87306C9.59973 7.64643 9.37306 7.41976 9.37306 7.14643V2.34643C9.37973 2.01309 9.31306 1.87309 9.28639 1.82643Z"/>
    </svg>
`,Me=D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.00065 15.2063C7.54065 15.2063 7.10732 14.973 6.80065 14.5663L5.80065 13.233C5.78065 13.2063 5.70065 13.173 5.66732 13.1663H5.33398C2.55398 13.1663 0.833984 12.413 0.833984 8.66634V5.33301C0.833984 2.38634 2.38732 0.833008 5.33398 0.833008H10.6673C13.614 0.833008 15.1673 2.38634 15.1673 5.33301V8.66634C15.1673 11.613 13.614 13.1663 10.6673 13.1663H10.334C10.2807 13.1663 10.234 13.193 10.2007 13.233L9.20065 14.5663C8.89398 14.973 8.46065 15.2063 8.00065 15.2063ZM5.33398 1.83301C2.94732 1.83301 1.83398 2.94634 1.83398 5.33301V8.66634C1.83398 11.6797 2.86732 12.1663 5.33398 12.1663H5.66732C6.00732 12.1663 6.39398 12.3597 6.60065 12.633L7.60065 13.9663C7.83398 14.273 8.16732 14.273 8.40065 13.9663L9.40065 12.633C9.62065 12.3397 9.96732 12.1663 10.334 12.1663H10.6673C13.054 12.1663 14.1673 11.053 14.1673 8.66634V5.33301C14.1673 2.94634 13.054 1.83301 10.6673 1.83301H5.33398Z"/>
        <path d="M11.3327 5.83301H4.66602C4.39268 5.83301 4.16602 5.60634 4.16602 5.33301C4.16602 5.05967 4.39268 4.83301 4.66602 4.83301H11.3327C11.606 4.83301 11.8327 5.05967 11.8327 5.33301C11.8327 5.60634 11.606 5.83301 11.3327 5.83301Z"/>
        <path d="M8.66602 9.16699H4.66602C4.39268 9.16699 4.16602 8.94033 4.16602 8.66699C4.16602 8.39366 4.39268 8.16699 4.66602 8.16699H8.66602C8.93935 8.16699 9.16602 8.39366 9.16602 8.66699C9.16602 8.94033 8.93935 9.16699 8.66602 9.16699Z"/>
    </svg>
`,je=[{id:1,name:"General",tabKey:"levels",icon:Le},{id:2,name:"Top Winners",tabKey:"topWinners",icon:Te},{id:3,name:"Games",tabKey:"games",icon:Se},{id:4,name:"Rules",tabKey:"rules",icon:Me}],Ee=class extends mt{static properties={initialId:{type:Number,attribute:!1},cache:{attribute:!1},_selectedId:{state:!0},_activeTabId:{state:!0},_loading:{state:!0},_allJackpots:{state:!0},mobile:{type:Boolean,reflect:!0},gameThumbnailType:{type:Number},onSelectedJackpotOrTournamentIdChange:{attribute:!1},jackpotsAmounts:{type:Object,attribute:!1},baseFetch:{attribute:!1},partnerIdentity:{attribute:!1},gameId:{attribute:!1},categoryId:{attribute:!1},subCategory:{attribute:!1},providerId:{attribute:!1},currencySymbol:{state:!0},translations:{attribute:!1},playerCurrencyId:{attribute:!1}};static elementStyles=Ie;constructor(){super(),this.initialId=null,this.baseFetch=null,this.partnerIdentity=null,this.gameId=null,this.categoryId=null,this.subCategory=null,this.providerId=null,this.playerCurrencyId=null,this.cache=null,this._selectedId=null,this._activeTabId=null,this._loading=!1,this._allJackpots=[],this.mobile=!1,this.gameThumbnailType=null,this.currencySymbol=null,this.translations={}}connectedCallback(){super.connectedCallback(),this._loadAll()}async _loadAll(){const t=this.cache?.jackpotsCache?.all;if(t)return void(Array.isArray(t)?this._allJackpots=t:(this._allJackpots=t.jackpots||[],this.currencySymbol=t.currencySymbol??null));this._loading=!0;const e=await(async t=>{const{baseFetch:e,playerCurrencyId:i,partnerIdentity:a,currentGameId:n,categoryId:o,subCategory:s,providerId:r}=t;return e({method:"GET",url:`inGameWidget/gmc/GetJackpotExpandedList/${a}/${i}/${r}/${n}/${o}/${s}`,hasLanguageIdInPath:!0})})({baseFetch:this.baseFetch,partnerIdentity:this.partnerIdentity,currentGameId:this.gameId,categoryId:this.categoryId,subCategory:this.subCategory,providerId:this.providerId,playerCurrencyId:this.playerCurrencyId});this._loading=!1,!1===e?.hasError&&(this._allJackpots=e?.data?.jackpots||[],this.currencySymbol=e?.data?.currencySymbol??null,this.cache?.jackpotsCache&&(this.cache.jackpotsCache.all={jackpots:this._allJackpots,currencySymbol:this.currencySymbol}))}willUpdate(t){if(t.has("initialId")||null===this._selectedId){const t=this.initialId??this._allJackpots?.[0]?.id??null;null!==t&&t!==this._selectedId&&(this._selectedId=t)}}_onSwitch=t=>{t!==this._selectedId&&(this._selectedId=t,this._activeTabId=1,this.onSelectedJackpotOrTournamentIdChange("selectedJackpotId",t))};_onTabChange=t=>{this._activeTabId=t};render(){const{_allJackpots:t,_selectedId:e,_loading:i,_onSwitch:a,jackpotsAmounts:n,_activeTabId:o,_onTabChange:s,gameThumbnailType:r,mobile:l,currencySymbol:c,translations:d}=this;let{current:h,ids:p}=((t,e,i={})=>{let a=null;const n=[],o={1:i?.generalTab,2:i?.jackpotTopWinnersTab,3:i?.gamesTab,4:i?.jackpotRulesTab};return t.forEach(t=>{if(e===t.groupId){a=t,a.availableTabs=[];for(const t of je)(4!==t.id||a.rules)&&(2!==t.id||a.topWinners)&&a.availableTabs.push({...t,name:o[t.id]??t.name})}n.push(t.groupId)}),{current:a,ids:n}})(t,e,d);const u=n[e]?[...n[e]]:[];return D`
        <div class="tab-wrapper">
            ${i?D`
                        <div class="loader-wrapper">
                            <panel-loader .loading=${i}>
                            </panel-loader>
                        </div>`:D`
                        <entity-switcher
                                .name=${h?.name??""}
                                .currentId=${e}
                                .allItems=${p}
                                .onChange=${a}
                        ></entity-switcher>

                        <tab-navigation
                                .availableTabs=${h?.availableTabs}
                                .onChange=${s}
                                .activeTabId=${o}
                                ?mobile=${l}
                        ></tab-navigation>

                        <div class="content-wrapper">
                            ${1===o?D`
                                <general-tab
                                        .jackpot=${h}
                                        .currentAmounts=${u}
                                        .translations=${d}
                                        ?mobile=${l}
                                        .currencySymbol=${c}
                                >
                                </general-tab>`:V}

                            ${2===o?D`
                                <top-winners-tab
                                        .topWinners=${h.topWinners}
                                        .currency=${c}
                                        .translations=${d}
                                        ?mobile=${l}
                                ></top-winners-tab>`:V}

                            ${3===o?D`
                                <games-tab
                                        .games=${h.games}
                                        .gameThumbnailType=${r}
                                        .gameId=${this.gameId}
                                ></games-tab>`:V}

                            ${4===o?D`
                                <rules-tab
                                        .title=${d?.jackpotRules??"Rules And Conditions"}
                                        .rules=${h.rules}
                                ></rules-tab>`:V}
                        </div>`}
        </div>
    `}};customElements.define("jackpots-section",Ee);var Pe=[{id:1,name:"General",tabKey:"levels",icon:Le},{id:2,name:"Leaderboard",tabKey:"leaderboard",icon:Ae},{id:3,name:"Games",tabKey:"games",icon:Se},{id:4,name:"Rules",tabKey:"rules",icon:Me}],Ue={3:"live",2:"upcoming",4:"ended"},Be=1,Fe=2,Ne=3,Ze=4,He=6,ze=7,Re={[Be]:1,[Fe]:2,[Ne]:3,[Ze]:4,5:5,[He]:6,[ze]:7},Oe={[Be]:{translationKey:"freeBet",label:"Free Bet"},[Fe]:{translationKey:"freeBet",label:"Free Bet"},[Ne]:{translationKey:"freeAmount",label:"Free Amount"},[Ze]:{translationKey:"realMoney",label:"Real Money"},5:{translationKey:"freeSpin",label:"Free Spin"},[He]:{translationKey:"freeAmount",label:"Free Amount"},[ze]:{translationKey:"freeAmount",label:"Free Amount"}},De=o`
    :host {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        width: 100%;
    }

    .content-wrapper {
        flex: 1;
        overflow: auto;
        padding: 0 12px;
    }

    .tab-wrapper {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }

    .loader-wrapper {
        flex: 1;
        min-height: 0;
    }


    /*======== Status Badge ========*/

    /*======== Desktop ========*/

    :host([mobile]) .content-wrapper {
        padding: 0 12px;
    }
`,Je=class{constructor(t,{onExpire:e}={}){this.host=t,t.addController(this),this._seconds=0,this._timerId=null,this._onExpire=e,this.parts={day:"00",hour:"00",minute:"00",second:"00"}}hostDisconnected(){this.stop(),this._onExpire=null}start(t){this.stop(),this._seconds=0|t,this._compute(),this.host.requestUpdate(),this._seconds<=0||(this._timerId=setInterval(()=>this._tick(),1e3))}stop(){this._timerId&&(clearInterval(this._timerId),this._timerId=null)}_tick(){if(this._seconds-=1,this._seconds<=0)return this._seconds=0,this._compute(),this.stop(),this.host.requestUpdate(),void this._onExpire?.();this._compute(),this.host.requestUpdate()}_compute(){const t=this._seconds,e=t/86400|0,i=t%86400/3600|0,a=t%3600/60|0,n=t%60;this.parts={day:this._pad(e),hour:this._pad(i),minute:this._pad(a),second:this._pad(n)}}_pad(t){return t<10?`0${t}`:`${t}`}},Ve=o`
    :host {
        display: flex;
    }

    .btn {
        all: unset;
        font: inherit;
        box-sizing: border-box;
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 0;
        border-radius: var(--border-radius-sm);
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
    }

    .btn:active {
        transform: scale(0.98);
    }

    /* ===== Variants ===== */

    :host([variant="primary"]) .btn {
        background: var(--in-game-expanded-widget-surface-color);
        color: var(--in-game-text-color);
    }

    :host([variant="secondary"]) .btn {
        background: var(--in-game-primary-color);
        color: var(--in-game-button-text-color);
    }

    :host([variant="joined"]) .btn {
        background: color-mix(in srgb, var(--in-game-positive-state-color) 10%, transparent);
        color: var(--in-game-text-color);
    }

    /* ===== States ===== */

    :host([disabled]) .btn {
        cursor: not-allowed;
    }

    :host([disabled]) .btn:active {
        transform: none;
    }

    /* ===== Mobile ===== */

    :host([mobile]) .btn {
        padding: 6px 0;
    }
`,Ge=class extends mt{static properties={variant:{type:String,reflect:!0},disabled:{type:Boolean,reflect:!0},mobile:{type:Boolean,reflect:!0},onClick:{attribute:!1}};static elementStyles=Ve;constructor(){super(),this.variant="primary",this.disabled=!1,this.mobile=!1}_handleClick=t=>{this.disabled||this.onClick?.(t)};render(){return D`
        <button
                class="btn"
                @click=${this._handleClick}
        >
            <slot></slot>
        </button>
    `}};customElements.define("button-custom",Ge);var We=o`
    :host {
        width: 100%;
    }

    /* ============ Desktop ============ */

    .buttons-wrapper {
        gap: 8px;
    }

    .buttons-wrapper > * {
        flex: 1;
    }

    button-custom {
        background-color: var(--in-game-background-color);
        border-radius: var(--border-radius-sm);
    }

    .join-anchor {
        position: relative;
    }

    .join-anchor > button-custom {
        width: 100%;
    }

    .join-tooltip {
        position: absolute;
        bottom: calc(100% + 10px);
        right: 0;
        width: 320px;
        max-width: 90vw;
        padding: 16px;
        border: 1px solid var(--in-game-border-color);
        border-radius: var(--border-radius-md);
        background-color: var(--in-game-background-color);
        display: flex;
        flex-direction: column;
        z-index: 10;
    }

    .join-tooltip__title {
        margin: 0;
        color: var(--in-game-text-color);
    }

    .join-tooltip__text {
        margin: 0;
        color: var(--in-game-secondary-text-color);
    }

    .join-tooltip__actions {
        gap: 8px;
        margin-top: 8px;
    }

    .join-tooltip__actions > * {
        flex: 1;
    }

    .join-tooltip__arrow {
        position: absolute;
        top: calc(100% + 1px);
        right: 24px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 9px solid var(--in-game-border-color);
    }

    .join-tooltip__arrow::after {
        content: "";
        position: absolute;
        top: -9px;
        left: -7px;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid var(--in-game-background-color);
    }

    /* ============ Mobile ============ */
`,qe=D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.9987 1.33301C4.32536 1.33301 1.33203 4.32634 1.33203 7.99967C1.33203 11.673 4.32536 14.6663 7.9987 14.6663C11.672 14.6663 14.6654 11.673 14.6654 7.99967C14.6654 4.32634 11.672 1.33301 7.9987 1.33301ZM11.1854 6.46634L7.40536 10.2463C7.31203 10.3397 7.18536 10.393 7.05203 10.393C6.9187 10.393 6.79203 10.3397 6.6987 10.2463L4.81203 8.35967C4.6187 8.16634 4.6187 7.84634 4.81203 7.65301C5.00536 7.45967 5.32536 7.45967 5.5187 7.65301L7.05203 9.18634L10.4787 5.75967C10.672 5.56634 10.992 5.56634 11.1854 5.75967C11.3787 5.95301 11.3787 6.26634 11.1854 6.46634Z"
              fill="var(--in-game-positive-state-color)"/>
    </svg>
`,Ke=D`
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.05685 13.2712H1.16602C0.926849 13.2712 0.728516 13.0728 0.728516 12.8337V9.33366C0.728516 8.44699 1.44602 7.72949 2.33268 7.72949H5.05685C5.29601 7.72949 5.49435 7.92783 5.49435 8.16699V12.8337C5.49435 13.0728 5.29601 13.2712 5.05685 13.2712ZM1.60352 12.3962H4.61935V8.60449H2.33268C1.93018 8.60449 1.60352 8.93116 1.60352 9.33366V12.3962Z"
              fill="var(--in-game-primary-color)"/>
        <path d="M8.94357 13.2705H5.05273C4.81357 13.2705 4.61523 13.0722 4.61523 12.833V6.99967C4.61523 6.11301 5.33273 5.39551 6.2194 5.39551H7.7769C8.66357 5.39551 9.38107 6.11301 9.38107 6.99967V12.833C9.38107 13.0722 9.18857 13.2705 8.94357 13.2705ZM5.49607 12.3955H8.5119V6.99967C8.5119 6.59717 8.18523 6.27051 7.78273 6.27051H6.22523C5.82273 6.27051 5.49607 6.59717 5.49607 6.99967V12.3955Z"
              fill="var(--in-game-primary-color)"/>
        <path d="M12.8342 13.2712H8.94336C8.70419 13.2712 8.50586 13.0728 8.50586 12.8337V9.91699C8.50586 9.67783 8.70419 9.47949 8.94336 9.47949H11.6675C12.5542 9.47949 13.2717 10.197 13.2717 11.0837V12.8337C13.2717 13.0728 13.0734 13.2712 12.8342 13.2712ZM9.38086 12.3962H12.3967V11.0837C12.3967 10.6812 12.07 10.3545 11.6675 10.3545H9.38086V12.3962Z"
              fill="var(--in-game-primary-color)"/>
        <path d="M7.99169 4.8708C7.85169 4.8708 7.67669 4.82996 7.47835 4.71329L7.00002 4.42747L6.52752 4.70747C6.04918 4.99331 5.73419 4.82414 5.61752 4.74247C5.50085 4.6608 5.25002 4.40414 5.37252 3.86747L5.48335 3.38329L5.08669 2.98663C4.84169 2.74163 4.75418 2.44996 4.84168 2.18163C4.92918 1.9133 5.16835 1.72663 5.50668 1.66829L6.01419 1.5808L6.30002 1.00914C6.61502 0.384974 7.37919 0.384974 7.68835 1.00914L7.97418 1.5808L8.48169 1.66829C8.82002 1.72663 9.06502 1.9133 9.14669 2.18163C9.23419 2.44996 9.14085 2.74163 8.90168 2.98663L8.50502 3.38329L8.61585 3.86747C8.73835 4.40997 8.48752 4.66081 8.37085 4.74831C8.31835 4.79498 8.18419 4.8708 7.99169 4.8708ZM7.00002 3.54663C7.14002 3.54663 7.28002 3.58164 7.39669 3.65164L7.72335 3.84413L7.65335 3.52913C7.59502 3.28413 7.68252 2.98663 7.86335 2.8058L8.16085 2.50829L7.79335 2.44414C7.56002 2.4033 7.33252 2.23414 7.22752 2.02413L7.00002 1.58663L6.77835 2.02413C6.67335 2.23414 6.44585 2.4033 6.21252 2.44414L5.84502 2.50247L6.14252 2.79996C6.32335 2.98079 6.40502 3.27831 6.35252 3.52331L6.28252 3.83829L6.60919 3.6458C6.72002 3.5758 6.86002 3.54663 7.00002 3.54663Z"
              fill="var(--in-game-primary-color)"/>
    </svg>
`,Ye=D`
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.74191 11.5094H4.25858C3.82691 11.5094 3.38941 11.2003 3.24358 10.7978L0.82858 4.03694C0.53108 3.18527 0.746914 2.79444 0.980247 2.61944C1.21358 2.44444 1.65108 2.33944 2.38608 2.86444L4.66108 4.49194C4.73108 4.53277 4.79525 4.55027 4.84191 4.53861C4.89441 4.52111 4.93525 4.47444 4.96441 4.39277L5.99108 1.65694C6.30025 0.840273 6.75525 0.717773 7.00025 0.717773C7.24525 0.717773 7.70025 0.840273 8.00941 1.65694L9.03608 4.39277C9.06525 4.46861 9.10608 4.52111 9.15858 4.53861C9.21108 4.55611 9.27525 4.53861 9.33941 4.48611L11.4744 2.96361C12.2561 2.40361 12.7111 2.51444 12.9619 2.69527C13.2069 2.88194 13.4344 3.29611 13.1136 4.20027L10.7569 10.7978C10.6111 11.2003 10.1736 11.5094 9.74191 11.5094ZM1.56358 3.38944C1.57525 3.47111 1.59858 3.58777 1.65691 3.73944L4.07191 10.5003C4.09525 10.5586 4.20025 10.6344 4.25858 10.6344H9.74191C9.80608 10.6344 9.91108 10.5586 9.92858 10.5003L12.2852 3.90861C12.3669 3.68694 12.3902 3.53527 12.3961 3.44777C12.3086 3.47694 12.1744 3.54111 11.9819 3.68111L9.84691 5.20361C9.55525 5.40777 9.21108 5.47194 8.90191 5.37861C8.59275 5.28527 8.34191 5.04027 8.21358 4.70777L7.18691 1.97194C7.11108 1.76777 7.04108 1.66861 7.00025 1.62194C6.95941 1.66861 6.88941 1.76777 6.81358 1.96611L5.78691 4.70194C5.66441 5.03444 5.41358 5.27944 5.09858 5.37277C4.78941 5.46611 4.43941 5.40194 4.15358 5.19777L1.87858 3.57027C1.74441 3.47694 1.63941 3.41861 1.56358 3.38944Z"
              fill="var(--in-game-primary-color)"/>
        <path d="M10.2077 13.2705H3.79102C3.55185 13.2705 3.35352 13.0722 3.35352 12.833C3.35352 12.5938 3.55185 12.3955 3.79102 12.3955H10.2077C10.4468 12.3955 10.6452 12.5938 10.6452 12.833C10.6452 13.0722 10.4468 13.2705 10.2077 13.2705Z"
              fill="var(--in-game-primary-color)"/>
        <path d="M8.45768 8.60449H5.54102C5.30185 8.60449 5.10352 8.40616 5.10352 8.16699C5.10352 7.92783 5.30185 7.72949 5.54102 7.72949H8.45768C8.69685 7.72949 8.89518 7.92783 8.89518 8.16699C8.89518 8.40616 8.69685 8.60449 8.45768 8.60449Z"
              fill="var(--in-game-primary-color)"/>
    </svg>
`,Xe=D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.99935 15.1667C4.50602 15.1667 1.66602 12.3267 1.66602 8.83333C1.66602 5.34 4.50602 2.5 7.99935 2.5C11.4927 2.5 14.3327 5.34 14.3327 8.83333C14.3327 12.3267 11.4927 15.1667 7.99935 15.1667ZM7.99935 3.5C5.05935 3.5 2.66602 5.89333 2.66602 8.83333C2.66602 11.7733 5.05935 14.1667 7.99935 14.1667C10.9393 14.1667 13.3327 11.7733 13.3327 8.83333C13.3327 5.89333 10.9393 3.5 7.99935 3.5Z"
              fill="var(--in-game-secondary-text-color)"/>
        <path d="M8 9.16634C7.72667 9.16634 7.5 8.93967 7.5 8.66634V5.33301C7.5 5.05967 7.72667 4.83301 8 4.83301C8.27333 4.83301 8.5 5.05967 8.5 5.33301V8.66634C8.5 8.93967 8.27333 9.16634 8 9.16634Z"
              fill="var(--in-game-secondary-text-color)"/>
        <path d="M10 1.83301H6C5.72667 1.83301 5.5 1.60634 5.5 1.33301C5.5 1.05967 5.72667 0.833008 6 0.833008H10C10.2733 0.833008 10.5 1.05967 10.5 1.33301C10.5 1.60634 10.2733 1.83301 10 1.83301Z"
              fill="var(--in-game-secondary-text-color)"/>
    </svg>
`,Qe=D`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.1533 6.27544L18.776 6.61564C18.4402 6.91838 17.9944 7.13097 17.5436 7.22055C17.0687 7.32265 16.5458 7.30142 16.1403 7.02287C16.0263 6.94453 16.1928 7.05137 15.8781 6.849C15.8673 6.84206 15.8596 6.83117 15.8567 6.81865C15.8538 6.80613 15.856 6.79298 15.8626 6.78201L16.1041 6.39044C16.393 5.92147 16.809 5.57157 17.3377 5.46239C17.7004 5.38424 18.0935 5.43979 18.4732 5.65314C18.7221 5.80282 18.8775 5.98564 18.9794 6.09042C19.0372 6.15225 19.0975 6.21183 19.1533 6.27544Z"
              fill="#FECC81"/>
        <path d="M19.1526 6.27724L19.5299 5.93705C20.0587 5.46034 20.2601 4.75516 20.0012 3.99095C19.8198 3.49573 19.4887 3.09248 19.0795 2.80971C18.9002 2.68657 19.0979 2.81145 18.5762 2.47744C18.5707 2.47394 18.5646 2.47157 18.5582 2.47045C18.5518 2.46934 18.5453 2.46951 18.539 2.47095C18.5326 2.4724 18.5266 2.47509 18.5214 2.47886C18.5161 2.48264 18.5116 2.48743 18.5082 2.49296L18.2676 2.88303C17.9768 3.35514 17.9289 3.94496 18.0382 4.48115C18.2235 5.34807 18.6356 5.73964 18.9786 6.09221C19.0364 6.15404 19.0967 6.21363 19.1526 6.27724Z"
              fill="#E59001"/>
        <path d="M21.078 9.67432L20.5919 9.82199C20.2108 9.93754 19.7874 9.95179 19.3993 9.88494C18.7432 9.77169 18.3681 9.51329 18.1183 9.20268C18.0513 9.11821 18.0742 9.13574 17.8688 8.80933C17.862 8.79848 17.8597 8.7854 17.8624 8.77288C17.8651 8.76036 17.8726 8.7494 17.8833 8.74234L18.2677 8.48948C18.6029 8.26868 18.9976 8.12059 19.4004 8.12308C19.9334 8.12795 20.406 8.36844 20.7266 8.82208C20.8027 8.93869 20.8667 9.06274 20.9176 9.19232C21.0159 9.48142 20.9888 9.40149 21.0401 9.55314C21.0542 9.59308 21.0671 9.63335 21.078 9.67432Z"
              fill="#FECC81"/>
        <path d="M21.0769 9.67379L21.5631 9.52613C22.1655 9.34349 22.5627 8.89758 22.7194 8.40555C22.9049 7.84133 22.8275 7.21222 22.6037 6.74002C22.4833 6.48322 22.3083 6.21208 22.1621 5.98519C22.1586 5.97977 22.154 5.97509 22.1487 5.97144C22.1434 5.96779 22.1374 5.96523 22.1311 5.96392C22.1248 5.9626 22.1183 5.96255 22.1119 5.96377C22.1056 5.96499 22.0996 5.96746 22.0942 5.97103L21.711 6.22309C21.3583 6.45537 21.1166 6.79496 20.9558 7.18372C20.7538 7.6682 20.6915 8.27064 20.8027 8.78906C20.8271 8.92677 20.8652 9.06169 20.9165 9.19179C21.0148 9.48089 20.9876 9.40096 21.039 9.55261C21.0531 9.59255 21.0661 9.63282 21.0769 9.67379Z"
              fill="#E59001"/>
        <path d="M21.374 13.5776L20.871 13.5059C20.4752 13.4492 20.0885 13.2849 19.7664 13.0585C19.4138 12.8154 19.1726 12.5282 19.0581 12.3162C18.8695 11.9911 18.882 11.7986 18.8363 11.4276C18.8347 11.4148 18.8381 11.4019 18.8459 11.3917C18.8537 11.3814 18.8651 11.3747 18.8779 11.3728L19.3331 11.3078C19.7356 11.2502 20.1413 11.2853 20.5142 11.4591C20.6831 11.5399 20.8414 11.6527 20.9792 11.7905C21.0019 11.8134 21.0246 11.8369 21.0456 11.8611C21.1502 11.9857 21.2363 12.1246 21.3036 12.2719C21.368 12.4229 21.4103 12.5972 21.4308 12.7586C21.4387 12.861 21.4388 12.967 21.4308 13.0728L21.4211 13.1995C21.4175 13.2417 21.411 13.2835 21.406 13.3256L21.374 13.5776Z"
              fill="#FECC81"/>
        <path d="M21.373 13.5713L21.876 13.643C22.3009 13.7038 22.7082 13.6206 23.0693 13.392C23.2491 13.2754 23.4096 13.1208 23.5434 12.9479C23.9355 12.4349 24.0555 11.7656 23.977 11.1338C23.9722 11.0797 23.9644 11.0258 23.958 10.9717L23.9231 10.697C23.9223 10.6906 23.9202 10.6844 23.9169 10.6788C23.9137 10.6732 23.9094 10.6682 23.9042 10.6643C23.8991 10.6604 23.8932 10.6575 23.8869 10.6559C23.8806 10.6542 23.8741 10.6539 23.8677 10.6548L23.4138 10.7195C23.0024 10.7784 22.624 10.9851 22.3215 11.2667C22.1659 11.4084 22.0322 11.5611 21.9181 11.7291C21.899 11.757 21.8812 11.7853 21.8628 11.8138C21.7645 11.9617 21.686 12.1129 21.6267 12.2647C21.5582 12.428 21.5087 12.5796 21.4774 12.7546C21.4538 12.8573 21.4379 12.9615 21.4299 13.0665L21.4203 13.1931C21.4166 13.2353 21.4101 13.2772 21.4051 13.3192L21.373 13.5713Z"
              fill="#E59001"/>
        <path d="M19.9903 17.2252L19.5659 16.946C19.3282 16.7894 19.1305 16.5951 18.9701 16.3884C18.6395 15.9633 18.3618 15.3235 18.4359 14.7954C18.4543 14.5935 18.5596 14.3574 18.6066 14.207C18.6146 14.1813 18.6416 14.1672 18.6673 14.175L19.106 14.3082C19.4973 14.4269 19.8485 14.629 20.1099 14.9435C20.4343 15.3336 20.5693 15.8555 20.4198 16.4095C20.4008 16.4749 20.3814 16.5417 20.3527 16.605C20.2571 16.8185 20.1025 17.0497 19.9903 17.2252Z"
              fill="#FECC81"/>
        <path d="M19.9902 17.2276L20.4147 17.5068C20.94 17.8528 21.5811 17.9134 22.2209 17.5886C22.752 17.3058 23.1114 16.8406 23.33 16.2773C23.3892 16.1044 23.4822 15.8361 23.5231 15.7034C23.5249 15.6973 23.5256 15.6909 23.525 15.6845C23.5243 15.6781 23.5225 15.6719 23.5194 15.6662C23.5164 15.6605 23.5123 15.6555 23.5073 15.6515C23.5023 15.6474 23.4966 15.6444 23.4904 15.6426L23.0508 15.509C22.6254 15.38 22.0882 15.3934 21.4473 15.695C21.1009 15.862 20.7334 16.1467 20.4939 16.4505C20.4503 16.5038 20.4122 16.561 20.3712 16.6177C20.2566 16.7771 20.3152 16.7191 19.9902 17.2276Z"
              fill="#E59001"/>
        <path d="M17.1854 19.95L16.9187 19.5176C16.7077 19.175 16.5875 18.7717 16.5554 18.3817C16.5182 17.9583 16.5751 17.4351 16.8053 17.0887C16.9205 16.8994 17.0513 16.8038 17.2113 16.6268C17.2156 16.622 17.2208 16.6181 17.2266 16.6152C17.2324 16.6124 17.2387 16.6108 17.2451 16.6104C17.2516 16.6101 17.258 16.611 17.2641 16.6131C17.2702 16.6152 17.2758 16.6185 17.2807 16.6228L17.6214 16.93C17.9775 17.2509 18.2302 17.6508 18.2986 18.1215C18.3803 18.7568 18.0938 19.3365 17.6095 19.6704L17.506 19.744C17.3716 19.8307 17.4425 19.7851 17.1854 19.95Z"
              fill="#FECC81"/>
        <path d="M17.1855 19.9516L17.4522 20.384C17.7505 20.8682 18.2299 21.1742 18.8293 21.2168C19.3972 21.262 20.043 21.0475 20.6108 20.5045C20.6719 20.4455 20.9246 20.181 21.0279 20.0691C21.0323 20.0643 21.0357 20.0587 21.0379 20.0527C21.0401 20.0466 21.0411 20.0402 21.0407 20.0337C21.0404 20.0273 21.0388 20.0209 21.0361 20.0151C21.0333 20.0093 21.0294 20.004 21.0246 19.9997L20.6837 19.6924C20.3277 19.3715 19.844 19.2083 19.3593 19.1845C18.7887 19.1467 18.1599 19.2926 17.6097 19.6721C17.6096 19.6721 17.4427 19.7868 17.1855 19.9516Z"
              fill="#E59001"/>
        <path d="M16.9694 4.5083L16.6987 3.93765C16.0921 2.65886 14.5637 2.11395 13.2849 2.72056L12.7584 2.97028C12.7526 2.97303 12.7474 2.97689 12.7431 2.98166C12.7388 2.98642 12.7355 2.99199 12.7333 2.99804C12.7312 3.00409 12.7302 3.01051 12.7305 3.01692C12.7309 3.02334 12.7324 3.02963 12.7352 3.03544L12.9849 3.56188C13.5915 4.84067 15.1199 5.38558 16.3987 4.77897L16.9694 4.5083Z"
              fill="#FECC81"/>
        <path d="M4.8457 6.27544L5.22303 6.61564C5.55886 6.91838 6.00467 7.13097 6.4554 7.22055C6.93037 7.32265 7.45325 7.30142 7.8587 7.02287C7.97275 6.94453 7.80624 7.05137 8.12094 6.849C8.13175 6.84206 8.13941 6.83117 8.1423 6.81865C8.1452 6.80613 8.14308 6.79298 8.13641 6.78201L7.89489 6.39044C7.60603 5.92147 7.19008 5.57157 6.66129 5.46239C6.2986 5.38424 5.90557 5.43979 5.52586 5.65314C5.27689 5.80282 5.12158 5.98564 5.01967 6.09042C4.96187 6.15225 4.90158 6.21183 4.8457 6.27544Z"
              fill="#E59001"/>
        <path d="M4.84575 6.27724L4.46843 5.93705C3.9396 5.46034 3.73826 4.75516 3.99712 3.99095C4.17854 3.49573 4.50959 3.09248 4.91879 2.80971C5.0981 2.68657 4.90041 2.81145 5.42212 2.47744C5.42759 2.47394 5.4337 2.47157 5.4401 2.47045C5.4465 2.46934 5.45305 2.46951 5.45938 2.47095C5.46571 2.4724 5.47169 2.47509 5.47697 2.47886C5.48225 2.48264 5.48673 2.48743 5.49014 2.49296L5.73072 2.88303C6.02155 3.35514 6.06946 3.94496 5.96009 4.48115C5.77488 5.34807 5.36277 5.73964 5.01977 6.09221C4.96192 6.15404 4.90163 6.21363 4.84575 6.27724Z"
              fill="#FECC81"/>
        <path d="M2.92188 9.67432L3.408 9.82199C3.78912 9.93754 4.21248 9.95179 4.60058 9.88494C5.25673 9.77169 5.6318 9.51329 5.88162 9.20268C5.94856 9.11821 5.92568 9.13574 6.13106 8.80933C6.13787 8.79848 6.14017 8.7854 6.13746 8.77288C6.13475 8.76036 6.12726 8.7494 6.11657 8.74234L5.73222 8.48948C5.39699 8.26868 5.00228 8.12059 4.59945 8.12308C4.06654 8.12795 3.59392 8.36844 3.27327 8.82208C3.19721 8.93869 3.13322 9.06274 3.08229 9.19232C2.98399 9.48142 3.01113 9.40149 2.9598 9.55314C2.94574 9.59308 2.93275 9.63335 2.92188 9.67432Z"
              fill="#E59001"/>
        <path d="M2.92028 9.67379L2.43416 9.52613C1.83168 9.34349 1.43448 8.89758 1.27786 8.40555C1.09232 7.84133 1.16971 7.21222 1.39351 6.74002C1.51394 6.48322 1.68893 6.21208 1.83515 5.98519C1.83864 5.97977 1.84318 5.97509 1.8485 5.97144C1.85382 5.96779 1.85981 5.96523 1.86613 5.96392C1.87244 5.9626 1.87896 5.96255 1.88529 5.96377C1.89162 5.96499 1.89765 5.96746 1.90303 5.97103L2.28621 6.22309C2.63887 6.45537 2.88058 6.79496 3.04137 7.18372C3.24346 7.6682 3.30576 8.27064 3.19452 8.78906C3.17016 8.92677 3.13204 9.06169 3.08075 9.19179C2.98244 9.48089 3.00958 9.40096 2.95825 9.55261C2.94398 9.59248 2.93131 9.63291 2.92028 9.67379Z"
              fill="#FECC81"/>
        <path d="M2.62526 13.5776L3.12822 13.5059C3.52401 13.4492 3.91071 13.2849 4.23281 13.0585C4.58547 12.8154 4.82661 12.5282 4.94114 12.3162C5.12973 11.9911 5.11726 11.7986 5.16292 11.4276C5.16454 11.4148 5.1611 11.4019 5.15333 11.3917C5.14557 11.3814 5.1341 11.3747 5.12138 11.3728L4.6661 11.3078C4.26365 11.2502 3.85792 11.2853 3.48501 11.4591C3.3162 11.5399 3.15785 11.6527 3.02007 11.7905C2.99713 11.8133 2.97496 11.8368 2.9536 11.8611C2.84906 11.9857 2.76299 12.1246 2.69567 12.2719C2.63122 12.4229 2.58893 12.5972 2.56845 12.7586C2.56049 12.8632 2.56052 12.9682 2.56854 13.0728L2.57815 13.1995C2.58176 13.2417 2.58832 13.2835 2.59329 13.3256L2.62526 13.5776Z"
              fill="#E59001"/>
        <path d="M2.62522 13.5713L2.12226 13.643C1.6974 13.7038 1.29008 13.6206 0.928932 13.392C0.717746 13.2548 0.532437 13.0653 0.387208 12.8553C0.278357 12.689 0.191961 12.5085 0.126097 12.3234C-0.0226939 11.8905 -0.0236314 11.4217 0.0402166 10.9717L0.0751876 10.697C0.0760053 10.6906 0.0780941 10.6844 0.0813325 10.6788C0.0845708 10.6732 0.088894 10.6682 0.0940504 10.6643C0.0992068 10.6604 0.105093 10.6575 0.111368 10.6559C0.117642 10.6542 0.124179 10.6539 0.130598 10.6548L0.584425 10.7195C0.995874 10.7784 1.37427 10.9851 1.67673 11.2667C1.83237 11.4084 1.96606 11.5611 2.08012 11.7291C2.0992 11.757 2.1171 11.7853 2.13543 11.8138C2.23374 11.9617 2.3123 12.1129 2.37156 12.2647C2.44005 12.428 2.48955 12.5796 2.52087 12.7546C2.5445 12.8573 2.56039 12.9615 2.5684 13.0665L2.57801 13.1931C2.58162 13.2353 2.58818 13.2772 2.59315 13.3192L2.62522 13.5713Z"
              fill="#FECC81"/>
        <path d="M4.00979 17.2252L4.43423 16.946C4.6719 16.7895 4.86958 16.5951 5.02995 16.3884C5.36059 15.9633 5.63829 15.3235 5.56418 14.7954C5.54575 14.5936 5.44051 14.3574 5.39349 14.207C5.38968 14.1947 5.38114 14.1845 5.36975 14.1785C5.35835 14.1724 5.34504 14.1712 5.33274 14.175L4.8941 14.3083C4.50281 14.4269 4.1516 14.629 3.89021 14.9435C3.56581 15.3336 3.4308 15.8556 3.5803 16.4095C3.59928 16.4749 3.61874 16.5418 3.64743 16.605C3.74296 16.8185 3.89761 17.0497 4.00979 17.2252Z"
              fill="#E59001"/>
        <path d="M4.00957 17.2276L3.58514 17.5068C3.05978 17.8528 2.41872 17.9134 1.77893 17.5886C1.24784 17.3058 0.88843 16.8406 0.669837 16.2773C0.61063 16.1044 0.517624 15.8361 0.476746 15.7034C0.474864 15.6973 0.474216 15.6909 0.474839 15.6845C0.475462 15.6781 0.477345 15.6719 0.480378 15.6662C0.483411 15.6605 0.487535 15.6555 0.492511 15.6515C0.497488 15.6474 0.503219 15.6444 0.509373 15.6426L0.949043 15.509C1.37442 15.38 1.91159 15.3934 2.55246 15.695C2.89894 15.862 3.26642 16.1467 3.50587 16.4505C3.54951 16.5038 3.58758 16.561 3.62864 16.6177C3.74317 16.7771 3.68457 16.7191 4.00957 17.2276Z"
              fill="#FECC81"/>
        <path d="M6.8126 19.95L7.07929 19.5176C7.29029 19.175 7.41044 18.7717 7.44255 18.3817C7.47977 17.9583 7.42281 17.4351 7.19269 17.0887C7.07742 16.8994 6.94667 16.8038 6.78668 16.6268C6.78238 16.622 6.77718 16.6181 6.77137 16.6152C6.76556 16.6124 6.75926 16.6108 6.75281 16.6104C6.74637 16.6101 6.73992 16.611 6.73382 16.6131C6.72773 16.6152 6.72212 16.6185 6.7173 16.6228L6.37654 16.93C6.0205 17.2509 5.76778 17.6508 5.69939 18.1215C5.61768 18.7568 5.9042 19.3365 6.38845 19.6704L6.49196 19.744C6.62635 19.8307 6.55548 19.7851 6.8126 19.95Z"
              fill="#E59001"/>
        <path d="M6.81228 19.9572L6.54559 20.3896C6.24735 20.8737 5.76798 21.1798 5.16855 21.2224C4.60067 21.2675 3.95483 21.053 3.38699 20.5101C3.32591 20.4511 3.07319 20.1865 2.96992 20.0746C2.96555 20.0698 2.96216 20.0643 2.95996 20.0582C2.95775 20.0521 2.95678 20.0457 2.95709 20.0392C2.9574 20.0328 2.95899 20.0265 2.96176 20.0206C2.96453 20.0148 2.96844 20.0096 2.97325 20.0053L3.3141 19.698C3.67014 19.3771 4.15387 19.2139 4.6385 19.19C5.2091 19.1523 5.83797 19.2982 6.38813 19.6777C6.38822 19.6776 6.55516 19.7923 6.81228 19.9572ZM7.02909 4.5083L7.29977 3.93765C7.90637 2.65886 9.43478 2.11395 10.7136 2.72056L11.24 2.97028C11.2644 2.98186 11.2748 3.01101 11.2633 3.03544L11.0135 3.56188C10.4069 4.84067 8.87853 5.38558 7.59974 4.77897L7.02909 4.5083Z"
              fill="#FECC81"/>
        <path d="M13.8399 21.5319C13.7514 21.5317 13.6662 21.4981 13.6013 21.4378C13.5365 21.3775 13.4967 21.295 13.4901 21.2067C13.4835 21.1184 13.5104 21.0308 13.5655 20.9615C13.6206 20.8922 13.6998 20.8462 13.7874 20.8328C17.9668 20.1951 21.1167 16.5228 21.1143 12.2906C21.1121 8.4686 18.6608 5.14837 15.0148 4.02864C14.8291 3.97164 14.7249 3.77493 14.7819 3.58934C14.8389 3.40375 15.0356 3.29931 15.2212 3.35645C17.0895 3.93019 18.7685 5.11237 19.949 6.68508C21.1701 8.31199 21.8162 10.2502 21.8174 12.2902C21.8187 14.5342 21.0093 16.7054 19.5383 18.4037C18.0819 20.0851 16.0772 21.1947 13.8934 21.5279C13.8757 21.5306 13.8578 21.5319 13.8399 21.5319ZM10.1591 21.5319C10.1415 21.5319 10.1236 21.5306 10.1056 21.5279C7.92191 21.1947 5.91713 20.0851 4.46072 18.4037C2.98973 16.7053 2.18033 14.5342 2.18164 12.2902C2.18281 10.2502 2.82889 8.31199 4.05002 6.68508C5.2305 5.11237 6.90953 3.93019 8.77786 3.35645C8.86683 3.32966 8.96279 3.33918 9.04476 3.38292C9.12673 3.42667 9.18806 3.50108 9.21533 3.5899C9.24261 3.67873 9.23361 3.77473 9.19031 3.85694C9.14702 3.93915 9.07294 4.00088 8.98427 4.02864C5.33818 5.14832 2.88702 8.4686 2.88481 12.2906C2.88238 16.5228 6.03226 20.1951 10.2117 20.8328C10.2994 20.8461 10.3787 20.892 10.434 20.9613C10.4892 21.0307 10.5162 21.1183 10.5095 21.2067C10.5029 21.2951 10.4631 21.3778 10.3981 21.4381C10.3331 21.4984 10.2478 21.5319 10.1591 21.5319Z"
              fill="#FECC81"/>
        <path d="M14.0023 15.6811C13.9258 15.6738 13.8401 15.6665 13.7453 15.6592C13.6615 15.6519 13.5612 15.6464 13.4445 15.6428C13.3279 15.6391 13.193 15.6373 13.0398 15.6373C12.7445 15.6373 12.4018 15.6501 12.0117 15.6756C11.6216 15.7011 11.1987 15.7503 10.743 15.8232C10.8232 15.6592 10.8924 15.4514 10.9508 15.1998C11.0091 14.9482 11.0565 14.6803 11.093 14.3959C11.1331 14.1079 11.1641 13.8162 11.1859 13.5209C11.2078 13.2256 11.2242 12.9503 11.2352 12.6951C11.2461 12.4399 11.2516 12.2193 11.2516 12.0334C11.2552 11.8475 11.257 11.7199 11.257 11.6506C11.257 11.6396 11.2552 11.5959 11.2516 11.5193C11.2516 11.4391 11.2497 11.3352 11.2461 11.2076C11.2424 11.08 11.237 10.9342 11.2297 10.7701C11.226 10.6024 11.2206 10.4256 11.2133 10.2396C11.0128 10.1995 10.8122 10.1631 10.6117 10.1303C10.4148 10.0975 10.2344 10.0701 10.0703 10.0482C9.88073 10.0227 9.69844 10.0027 9.52344 9.98809C9.775 9.75111 9.98099 9.52324 10.1414 9.30449C10.3018 9.08574 10.4294 8.87975 10.5242 8.68652C10.6227 8.49329 10.6956 8.31647 10.743 8.15605C10.794 7.99564 10.8341 7.85345 10.8633 7.72949C11.2315 7.79512 11.5687 7.83887 11.875 7.86074C12.1849 7.88262 12.4638 7.89355 12.7117 7.89355C12.8758 7.89355 13.0234 7.88991 13.1547 7.88262C13.2859 7.87533 13.3971 7.86803 13.4883 7.86074C13.594 7.8498 13.687 7.83887 13.7672 7.82793C13.7234 8.0321 13.6852 8.25996 13.6523 8.51152C13.6195 8.75944 13.5904 9.02559 13.5648 9.30996C13.5393 9.59069 13.5193 9.886 13.5047 10.1959C13.4937 10.5058 13.4883 10.8248 13.4883 11.1529C13.4883 11.5321 13.4974 11.9186 13.5156 12.3123C13.5339 12.7024 13.563 13.0907 13.6031 13.4771C13.6469 13.8636 13.6997 14.2428 13.7617 14.6146C13.8273 14.9865 13.9076 15.342 14.0023 15.6811Z"
              fill="#FDAC30"/>
    </svg>

`,ti=D`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.1533 6.27447L18.776 6.61466C18.4402 6.9174 17.9944 7.12999 17.5436 7.21958C17.0687 7.32168 16.5458 7.30044 16.1403 7.02189C16.0263 6.94356 16.1928 7.05039 15.8781 6.84802C15.8673 6.84108 15.8596 6.83019 15.8567 6.81767C15.8538 6.80516 15.856 6.79201 15.8626 6.78103L16.1041 6.38946C16.393 5.92049 16.809 5.57059 17.3377 5.46141C17.7004 5.38327 18.0935 5.43882 18.4732 5.65216C18.7221 5.80184 18.8775 5.98467 18.9794 6.08944C19.0372 6.15127 19.0975 6.21085 19.1533 6.27447Z" fill="#EBEBEB"/>
        <path d="M19.1526 6.27529L19.5299 5.93509C20.0587 5.45839 20.2601 4.7532 20.0012 3.989C19.8198 3.49378 19.4887 3.09053 19.0795 2.80776C18.9002 2.68461 19.0979 2.8095 18.5762 2.47549C18.5707 2.47199 18.5646 2.46961 18.5582 2.4685C18.5518 2.46739 18.5453 2.46756 18.539 2.469C18.5326 2.47044 18.5266 2.47313 18.5214 2.47691C18.5161 2.48069 18.5116 2.48548 18.5082 2.49101L18.2676 2.88108C17.9768 3.35319 17.9289 3.94301 18.0382 4.4792C18.2235 5.34612 18.6356 5.73769 18.9786 6.09026C19.0364 6.15209 19.0967 6.21167 19.1526 6.27529Z" fill="#A4A4A2"/>
        <path d="M21.0761 9.67432L20.5899 9.82199C20.2088 9.93754 19.7855 9.95179 19.3974 9.88494C18.7412 9.77169 18.3661 9.51329 18.1163 9.20268C18.0494 9.11821 18.0723 9.13574 17.8669 8.80933C17.8601 8.79848 17.8578 8.7854 17.8605 8.77288C17.8632 8.76036 17.8707 8.7494 17.8814 8.74234L18.2657 8.48948C18.601 8.26868 18.9957 8.12059 19.3985 8.12308C19.9314 8.12795 20.404 8.36844 20.7247 8.82208C20.8007 8.93869 20.8647 9.06274 20.9157 9.19232C21.014 9.48142 20.9868 9.40149 21.0381 9.55314C21.0522 9.59308 21.0652 9.63335 21.0761 9.67432Z" fill="#EBEBEB"/>
        <path d="M21.0769 9.67379L21.5631 9.52613C22.1655 9.34349 22.5627 8.89758 22.7194 8.40555C22.9049 7.84133 22.8275 7.21222 22.6037 6.74002C22.4833 6.48322 22.3083 6.21208 22.1621 5.98519C22.1586 5.97977 22.154 5.97509 22.1487 5.97144C22.1434 5.96779 22.1374 5.96523 22.1311 5.96392C22.1248 5.9626 22.1183 5.96255 22.1119 5.96377C22.1056 5.96499 22.0996 5.96746 22.0942 5.97103L21.711 6.22309C21.3583 6.45537 21.1166 6.79496 20.9558 7.18372C20.7538 7.6682 20.6915 8.27064 20.8027 8.78906C20.8271 8.92677 20.8652 9.06169 20.9165 9.19179C21.0148 9.48089 20.9876 9.40096 21.039 9.55261C21.0531 9.59255 21.0661 9.63282 21.0769 9.67379Z" fill="#A4A4A2"/>
        <path d="M21.374 13.5757L20.871 13.504C20.4752 13.4473 20.0885 13.2829 19.7664 13.0565C19.4138 12.8135 19.1726 12.5262 19.0581 12.3142C18.8695 11.9891 18.882 11.7966 18.8363 11.4256C18.8347 11.4129 18.8381 11.4 18.8459 11.3897C18.8537 11.3795 18.8651 11.3727 18.8779 11.3708L19.3331 11.3059C19.7356 11.2483 20.1413 11.2833 20.5142 11.4572C20.6831 11.538 20.8414 11.6508 20.9792 11.7886C21.0019 11.8114 21.0246 11.8349 21.0456 11.8591C21.1502 11.9837 21.2363 12.1226 21.3036 12.27C21.368 12.4209 21.4103 12.5952 21.4308 12.7566C21.4387 12.8591 21.4388 12.965 21.4308 13.0709L21.4211 13.1975C21.4175 13.2397 21.411 13.2816 21.406 13.3236L21.374 13.5757Z" fill="#EBEBEB"/>
        <path d="M21.373 13.5713L21.876 13.643C22.3009 13.7038 22.7082 13.6206 23.0693 13.392C23.2491 13.2754 23.4096 13.1208 23.5434 12.9479C23.9355 12.4349 24.0555 11.7656 23.977 11.1338C23.9722 11.0797 23.9644 11.0258 23.958 10.9717L23.9231 10.697C23.9223 10.6906 23.9202 10.6844 23.9169 10.6788C23.9137 10.6732 23.9094 10.6682 23.9042 10.6643C23.8991 10.6604 23.8932 10.6575 23.8869 10.6559C23.8806 10.6542 23.8741 10.6539 23.8677 10.6548L23.4138 10.7195C23.0024 10.7784 22.624 10.9851 22.3215 11.2667C22.1659 11.4084 22.0322 11.5611 21.9181 11.7291C21.899 11.757 21.8812 11.7853 21.8628 11.8138C21.7645 11.9617 21.686 12.1129 21.6267 12.2647C21.5582 12.428 21.5087 12.5796 21.4774 12.7546C21.4538 12.8573 21.4379 12.9615 21.4299 13.0665L21.4203 13.1931C21.4166 13.2353 21.4101 13.2772 21.4051 13.3192L21.373 13.5713Z" fill="#A4A4A2"/>
        <path d="M19.9883 17.2252L19.5639 16.946C19.3262 16.7894 19.1286 16.5951 18.9682 16.3884C18.6376 15.9633 18.3598 15.3235 18.434 14.7954C18.4524 14.5935 18.5576 14.3574 18.6046 14.207C18.6127 14.1813 18.6396 14.1672 18.6654 14.175L19.104 14.3082C19.4953 14.4269 19.8465 14.629 20.1079 14.9435C20.4323 15.3336 20.5673 15.8555 20.4178 16.4095C20.3989 16.4749 20.3794 16.5417 20.3507 16.605C20.2552 16.8185 20.1005 17.0497 19.9883 17.2252Z" fill="#EBEBEB"/>
        <path d="M19.9883 17.2276L20.4127 17.5068C20.9381 17.8528 21.5791 17.9134 22.2189 17.5886C22.75 17.3058 23.1094 16.8406 23.328 16.2773C23.3872 16.1044 23.4802 15.8361 23.5211 15.7034C23.523 15.6973 23.5236 15.6909 23.523 15.6845C23.5224 15.6781 23.5205 15.6719 23.5175 15.6662C23.5144 15.6605 23.5103 15.6555 23.5053 15.6515C23.5004 15.6474 23.4946 15.6444 23.4885 15.6426L23.0488 15.509C22.6234 15.38 22.0863 15.3934 21.4454 15.695C21.0989 15.862 20.7315 16.1467 20.492 16.4505C20.4483 16.5038 20.4103 16.561 20.3692 16.6177C20.2547 16.7771 20.3133 16.7191 19.9883 17.2276Z" fill="#A4A4A2"/>
        <path d="M17.1873 19.95L16.9206 19.5176C16.7096 19.175 16.5895 18.7717 16.5574 18.3817C16.5201 17.9583 16.5771 17.4351 16.8072 17.0887C16.9225 16.8994 17.0532 16.8038 17.2132 16.6268C17.2175 16.622 17.2227 16.6181 17.2285 16.6152C17.2344 16.6124 17.2407 16.6108 17.2471 16.6104C17.2535 16.6101 17.26 16.611 17.2661 16.6131C17.2722 16.6152 17.2778 16.6185 17.2826 16.6228L17.6234 16.93C17.9794 17.2509 18.2321 17.6508 18.3005 18.1215C18.3822 18.7568 18.0957 19.3365 17.6115 19.6704L17.508 19.744C17.3736 19.8307 17.4444 19.7851 17.1873 19.95Z" fill="#EBEBEB"/>
        <path d="M17.1855 19.9516L17.4522 20.384C17.7505 20.8682 18.2299 21.1742 18.8293 21.2168C19.3972 21.262 20.043 21.0475 20.6108 20.5045C20.6719 20.4455 20.9246 20.181 21.0279 20.0691C21.0323 20.0643 21.0357 20.0587 21.0379 20.0527C21.0401 20.0466 21.0411 20.0402 21.0407 20.0337C21.0404 20.0273 21.0388 20.0209 21.0361 20.0151C21.0333 20.0093 21.0294 20.004 21.0246 19.9997L20.6837 19.6924C20.3277 19.3715 19.844 19.2083 19.3593 19.1845C18.7887 19.1467 18.1599 19.2926 17.6097 19.6721C17.6096 19.6721 17.4427 19.7868 17.1855 19.9516Z" fill="#A4A4A2"/>
        <path d="M16.9694 4.50635L16.6987 3.9357C16.0921 2.65691 14.5637 2.112 13.2849 2.7186L12.7584 2.96832C12.7526 2.97107 12.7474 2.97494 12.7431 2.9797C12.7388 2.98447 12.7355 2.99003 12.7333 2.99608C12.7312 3.00214 12.7302 3.00855 12.7305 3.01497C12.7309 3.02139 12.7324 3.02768 12.7352 3.03348L12.9849 3.55992C13.5915 4.83871 15.1199 5.38362 16.3987 4.77702L16.9694 4.50635Z" fill="#EBEBEB"/>
        <path d="M4.8457 6.27447L5.22303 6.61466C5.55886 6.9174 6.00467 7.12999 6.4554 7.21958C6.93037 7.32168 7.45325 7.30044 7.8587 7.02189C7.97275 6.94356 7.80624 7.05039 8.12094 6.84802C8.13175 6.84108 8.13941 6.83019 8.1423 6.81767C8.1452 6.80516 8.14308 6.79201 8.13641 6.78103L7.89489 6.38946C7.60603 5.92049 7.19008 5.57059 6.66129 5.46141C6.2986 5.38327 5.90557 5.43882 5.52586 5.65216C5.27689 5.80184 5.12158 5.98467 5.01967 6.08944C4.96187 6.15127 4.90158 6.21085 4.8457 6.27447Z" fill="#A4A4A2"/>
        <path d="M4.84575 6.27529L4.46843 5.93509C3.9396 5.45839 3.73826 4.7532 3.99712 3.989C4.17854 3.49378 4.50959 3.09053 4.91879 2.80776C5.0981 2.68461 4.90041 2.8095 5.42212 2.47549C5.42759 2.47199 5.4337 2.46961 5.4401 2.4685C5.4465 2.46739 5.45305 2.46756 5.45938 2.469C5.46571 2.47044 5.47169 2.47313 5.47697 2.47691C5.48225 2.48069 5.48673 2.48548 5.49014 2.49101L5.73072 2.88108C6.02155 3.35319 6.06946 3.94301 5.96009 4.4792C5.77488 5.34612 5.36277 5.73769 5.01977 6.09026C4.96192 6.15209 4.90163 6.21167 4.84575 6.27529Z" fill="#EBEBEB"/>
        <path d="M2.92188 9.67432L3.408 9.82199C3.78912 9.93754 4.21248 9.95179 4.60058 9.88494C5.25673 9.77169 5.6318 9.51329 5.88162 9.20268C5.94856 9.11821 5.92568 9.13574 6.13106 8.80933C6.13787 8.79848 6.14017 8.7854 6.13746 8.77288C6.13475 8.76036 6.12726 8.7494 6.11657 8.74234L5.73222 8.48948C5.39699 8.26868 5.00228 8.12059 4.59945 8.12308C4.06654 8.12795 3.59392 8.36844 3.27327 8.82208C3.19721 8.93869 3.13322 9.06274 3.08229 9.19232C2.98399 9.48142 3.01113 9.40149 2.9598 9.55314C2.94574 9.59308 2.93275 9.63335 2.92188 9.67432Z" fill="#A4A4A2"/>
        <path d="M2.92028 9.67379L2.43416 9.52613C1.83168 9.34349 1.43448 8.89758 1.27786 8.40555C1.09232 7.84133 1.16971 7.21222 1.39351 6.74002C1.51394 6.48322 1.68893 6.21208 1.83515 5.98519C1.83864 5.97977 1.84318 5.97509 1.8485 5.97144C1.85382 5.96779 1.85981 5.96523 1.86613 5.96392C1.87244 5.9626 1.87896 5.96255 1.88529 5.96377C1.89162 5.96499 1.89765 5.96746 1.90303 5.97103L2.28621 6.22309C2.63887 6.45537 2.88058 6.79496 3.04137 7.18372C3.24346 7.6682 3.30576 8.27064 3.19452 8.78906C3.17016 8.92677 3.13204 9.06169 3.08075 9.19179C2.98244 9.48089 3.00958 9.40096 2.95825 9.55261C2.94398 9.59248 2.93131 9.63291 2.92028 9.67379Z" fill="#EBEBEB"/>
        <path d="M2.62526 13.5757L3.12822 13.504C3.52401 13.4473 3.91071 13.2829 4.23281 13.0565C4.58547 12.8135 4.82661 12.5262 4.94114 12.3142C5.12973 11.9891 5.11726 11.7966 5.16292 11.4256C5.16454 11.4129 5.1611 11.4 5.15333 11.3897C5.14557 11.3795 5.1341 11.3727 5.12138 11.3708L4.6661 11.3059C4.26365 11.2483 3.85792 11.2833 3.48501 11.4572C3.3162 11.538 3.15785 11.6508 3.02007 11.7886C2.99713 11.8114 2.97496 11.8349 2.9536 11.8591C2.84906 11.9837 2.76299 12.1226 2.69567 12.27C2.63122 12.4209 2.58893 12.5952 2.56845 12.7566C2.56049 12.8612 2.56052 12.9663 2.56854 13.0709L2.57815 13.1975C2.58176 13.2397 2.58832 13.2816 2.59329 13.3236L2.62526 13.5757Z" fill="#A4A4A2"/>
        <path d="M2.62522 13.5713L2.12226 13.643C1.6974 13.7038 1.29008 13.6206 0.928932 13.392C0.717746 13.2548 0.532437 13.0653 0.387208 12.8553C0.278357 12.689 0.191961 12.5085 0.126097 12.3234C-0.0226939 11.8905 -0.0236314 11.4217 0.0402166 10.9717L0.0751876 10.697C0.0760053 10.6906 0.0780941 10.6844 0.0813325 10.6788C0.0845708 10.6732 0.088894 10.6682 0.0940504 10.6643C0.0992068 10.6604 0.105093 10.6575 0.111368 10.6559C0.117642 10.6542 0.124179 10.6539 0.130598 10.6548L0.584425 10.7195C0.995874 10.7784 1.37427 10.9851 1.67673 11.2667C1.83237 11.4084 1.96606 11.5611 2.08012 11.7291C2.0992 11.757 2.1171 11.7853 2.13543 11.8138C2.23374 11.9617 2.3123 12.1129 2.37156 12.2647C2.44005 12.428 2.48955 12.5796 2.52087 12.7546C2.5445 12.8573 2.56039 12.9615 2.5684 13.0665L2.57801 13.1931C2.58162 13.2353 2.58818 13.2772 2.59315 13.3192L2.62522 13.5713Z" fill="#EBEBEB"/>
        <path d="M4.00979 17.2252L4.43423 16.946C4.6719 16.7895 4.86958 16.5951 5.02995 16.3884C5.36059 15.9633 5.63829 15.3235 5.56418 14.7954C5.54575 14.5936 5.44051 14.3574 5.39349 14.207C5.38968 14.1947 5.38114 14.1845 5.36975 14.1785C5.35835 14.1724 5.34504 14.1712 5.33274 14.175L4.8941 14.3083C4.50281 14.4269 4.1516 14.629 3.89021 14.9435C3.56581 15.3336 3.4308 15.8556 3.5803 16.4095C3.59928 16.4749 3.61874 16.5418 3.64743 16.605C3.74296 16.8185 3.89761 17.0497 4.00979 17.2252Z" fill="#A4A4A2"/>
        <path d="M4.00957 17.2276L3.58514 17.5068C3.05978 17.8528 2.41872 17.9134 1.77893 17.5886C1.24784 17.3058 0.88843 16.8406 0.669837 16.2773C0.61063 16.1044 0.517624 15.8361 0.476746 15.7034C0.474864 15.6973 0.474216 15.6909 0.474839 15.6845C0.475462 15.6781 0.477345 15.6719 0.480378 15.6662C0.483411 15.6605 0.487535 15.6555 0.492511 15.6515C0.497488 15.6474 0.503219 15.6444 0.509373 15.6426L0.949043 15.509C1.37442 15.38 1.91159 15.3934 2.55246 15.695C2.89894 15.862 3.26642 16.1467 3.50587 16.4505C3.54951 16.5038 3.58758 16.561 3.62864 16.6177C3.74317 16.7771 3.68457 16.7191 4.00957 17.2276Z" fill="#EBEBEB"/>
        <path d="M6.8126 19.95L7.07929 19.5176C7.29029 19.175 7.41044 18.7717 7.44255 18.3817C7.47977 17.9583 7.42281 17.4351 7.19269 17.0887C7.07742 16.8994 6.94667 16.8038 6.78668 16.6268C6.78238 16.622 6.77718 16.6181 6.77137 16.6152C6.76556 16.6124 6.75926 16.6108 6.75281 16.6104C6.74637 16.6101 6.73992 16.611 6.73382 16.6131C6.72773 16.6152 6.72212 16.6185 6.7173 16.6228L6.37654 16.93C6.0205 17.2509 5.76778 17.6508 5.69939 18.1215C5.61768 18.7568 5.9042 19.3365 6.38845 19.6704L6.49196 19.744C6.62635 19.8307 6.55548 19.7851 6.8126 19.95Z" fill="#A4A4A2"/>
        <path d="M6.81228 19.9552L6.54559 20.3876C6.24735 20.8718 5.76798 21.1778 5.16855 21.2204C4.60067 21.2656 3.95483 21.0511 3.38699 20.5081C3.32591 20.4491 3.07319 20.1845 2.96992 20.0726C2.96555 20.0679 2.96216 20.0623 2.95996 20.0563C2.95775 20.0502 2.95678 20.0437 2.95709 20.0373C2.9574 20.0308 2.95899 20.0245 2.96176 20.0187C2.96453 20.0128 2.96844 20.0076 2.97325 20.0033L3.3141 19.696C3.67014 19.3751 4.15387 19.2119 4.6385 19.1881C5.2091 19.1503 5.83797 19.2962 6.38813 19.6757C6.38822 19.6756 6.55516 19.7903 6.81228 19.9552ZM7.02909 4.50635L7.29977 3.9357C7.90637 2.65691 9.43478 2.112 10.7136 2.7186L11.24 2.96832C11.2644 2.9799 11.2748 3.00906 11.2633 3.03348L11.0135 3.55992C10.4069 4.83871 8.87853 5.38362 7.59974 4.77702L7.02909 4.50635Z" fill="#EBEBEB"/>
        <path d="M13.8399 21.5329C13.7514 21.5327 13.6662 21.4991 13.6013 21.4388C13.5365 21.3785 13.4967 21.296 13.4901 21.2077C13.4835 21.1194 13.5104 21.0318 13.5655 20.9625C13.6206 20.8932 13.6998 20.8472 13.7874 20.8337C17.9668 20.196 21.1167 16.5238 21.1143 12.2916C21.1121 8.46958 18.6608 5.14935 15.0148 4.02962C14.8291 3.97261 14.7249 3.77591 14.7819 3.59032C14.8389 3.40473 15.0356 3.30029 15.2212 3.35743C17.0895 3.93117 18.7685 5.11334 19.949 6.68606C21.1701 8.31296 21.8162 10.2512 21.8174 12.2912C21.8187 14.5352 21.0093 16.7063 19.5383 18.4046C18.0819 20.0861 16.0772 21.1957 13.8934 21.5288C13.8757 21.5316 13.8578 21.5329 13.8399 21.5329ZM10.1591 21.5329C10.1415 21.5329 10.1236 21.5316 10.1056 21.5288C7.92191 21.1957 5.91713 20.0861 4.46072 18.4046C2.98973 16.7063 2.18033 14.5352 2.18164 12.2912C2.18281 10.2512 2.82889 8.31296 4.05002 6.68606C5.2305 5.11334 6.90953 3.93117 8.77786 3.35743C8.86683 3.33064 8.96279 3.34016 9.04476 3.3839C9.12673 3.42765 9.18806 3.50206 9.21533 3.59088C9.24261 3.6797 9.23361 3.77571 9.19031 3.85792C9.14702 3.94013 9.07294 4.00186 8.98427 4.02962C5.33818 5.1493 2.88702 8.46958 2.88481 12.2916C2.88238 16.5238 6.03226 20.196 10.2117 20.8337C10.2994 20.847 10.3787 20.893 10.434 20.9623C10.4892 21.0317 10.5162 21.1193 10.5095 21.2077C10.5029 21.2961 10.4631 21.3787 10.3981 21.439C10.3331 21.4993 10.2478 21.5329 10.1591 21.5329Z" fill="#C4C4C4"/>
        <path d="M9.05703 15.8791C9.05703 15.3723 9.10625 14.9367 9.20469 14.5721C9.30312 14.2038 9.43255 13.8848 9.59297 13.615C9.75703 13.3452 9.94297 13.1156 10.1508 12.926C10.3586 12.7364 10.5701 12.565 10.7852 12.4119C11.0039 12.2588 11.2172 12.1148 11.425 11.9799C11.6328 11.845 11.8169 11.6992 11.9773 11.5424C12.1414 11.3856 12.2727 11.2088 12.3711 11.0119C12.4695 10.815 12.5187 10.5762 12.5187 10.2955C12.5187 10.2299 12.5078 10.1588 12.4859 10.0822C12.4677 10.0057 12.4349 9.93457 12.3875 9.86895C12.3401 9.79967 12.2763 9.74316 12.1961 9.69941C12.1159 9.65566 12.0174 9.63379 11.9008 9.63379C11.8023 9.63379 11.7148 9.65202 11.6383 9.68848C11.5654 9.72493 11.5034 9.77051 11.4523 9.8252C11.4049 9.87988 11.3685 9.94186 11.343 10.0111C11.3211 10.0768 11.3102 10.1406 11.3102 10.2025C11.3102 10.2609 11.3211 10.3174 11.343 10.3721C11.3685 10.4231 11.4013 10.4687 11.4414 10.5088C11.4815 10.5489 11.5253 10.5817 11.5727 10.6072C11.6237 10.6291 11.6747 10.64 11.7258 10.64C11.7805 10.64 11.8461 10.6291 11.9227 10.6072C11.8607 10.7239 11.7768 10.8296 11.6711 10.9244C11.569 11.0156 11.4523 11.0921 11.3211 11.1541C11.1935 11.2161 11.0549 11.2635 10.9055 11.2963C10.7596 11.3291 10.6102 11.3455 10.457 11.3455C10.2602 11.3455 10.0742 11.3182 9.89922 11.2635C9.72786 11.2088 9.57656 11.1268 9.44531 11.0174C9.31771 10.9044 9.21745 10.7658 9.14453 10.6018C9.07161 10.434 9.03516 10.2372 9.03516 10.0111C9.03516 9.70853 9.09167 9.41504 9.20469 9.13066C9.32135 8.84629 9.49635 8.5929 9.72969 8.37051C9.96302 8.14811 10.2547 7.97129 10.6047 7.84004C10.9547 7.70514 11.3648 7.6377 11.8352 7.6377C12.3711 7.6377 12.8359 7.71426 13.2297 7.86738C13.6271 8.02051 13.9552 8.23197 14.2141 8.50176C14.4766 8.77155 14.6716 9.09056 14.7992 9.45879C14.9305 9.82702 14.9961 10.2244 14.9961 10.651C14.9961 10.9536 14.9578 11.2161 14.8812 11.4385C14.8047 11.6609 14.7008 11.8541 14.5695 12.0182C14.4383 12.1822 14.2852 12.3244 14.1102 12.4447C13.9388 12.565 13.7547 12.6762 13.5578 12.7783C13.3646 12.8768 13.1659 12.9715 12.9617 13.0627C12.7576 13.1538 12.5589 13.2541 12.3656 13.3635C12.176 13.4692 11.9974 13.5895 11.8297 13.7244C11.662 13.8593 11.518 14.0215 11.3977 14.2111C12.1341 14.1601 12.7867 14.0252 13.3555 13.8064C13.9242 13.584 14.4036 13.2979 14.7937 12.9479C14.7682 13.1411 14.75 13.3325 14.7391 13.5221C14.7281 13.708 14.7227 13.8939 14.7227 14.0799C14.7227 14.3825 14.7372 14.6851 14.7664 14.9877C14.7992 15.2867 14.8484 15.5838 14.9141 15.8791C14.4583 15.8135 13.9862 15.7643 13.4977 15.7314C13.0091 15.6986 12.5151 15.6822 12.0156 15.6822C11.5052 15.6822 11.0021 15.6986 10.5062 15.7314C10.0141 15.7643 9.53099 15.8135 9.05703 15.8791Z" fill="#EBEBEB"/>
    </svg>

`,ei=D`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.1533 6.27447L18.776 6.61466C18.4402 6.9174 17.9944 7.12999 17.5436 7.21958C17.0687 7.32168 16.5458 7.30044 16.1403 7.02189C16.0263 6.94356 16.1928 7.05039 15.8781 6.84802C15.8673 6.84108 15.8596 6.83019 15.8567 6.81767C15.8538 6.80516 15.856 6.79201 15.8626 6.78103L16.1041 6.38946C16.393 5.92049 16.809 5.57059 17.3377 5.46141C17.7004 5.38327 18.0935 5.43882 18.4732 5.65216C18.7221 5.80184 18.8775 5.98467 18.9794 6.08944C19.0372 6.15127 19.0975 6.21085 19.1533 6.27447Z"
              fill="#F0D2B7"/>
        <path d="M19.1526 6.27529L19.5299 5.93509C20.0587 5.45839 20.2601 4.7532 20.0012 3.989C19.8198 3.49378 19.4887 3.09053 19.0795 2.80776C18.9002 2.68461 19.0979 2.8095 18.5762 2.47549C18.5707 2.47199 18.5646 2.46961 18.5582 2.4685C18.5518 2.46739 18.5453 2.46756 18.539 2.469C18.5326 2.47044 18.5266 2.47313 18.5214 2.47691C18.5161 2.48069 18.5116 2.48548 18.5082 2.49101L18.2676 2.88108C17.9768 3.35319 17.9289 3.94301 18.0382 4.4792C18.2235 5.34612 18.6356 5.73769 18.9786 6.09026C19.0364 6.15209 19.0967 6.21167 19.1526 6.27529Z"
              fill="#DB9557"/>
        <path d="M21.0761 9.67432L20.5899 9.82199C20.2088 9.93754 19.7855 9.95179 19.3974 9.88494C18.7412 9.77169 18.3661 9.51329 18.1163 9.20268C18.0494 9.11821 18.0723 9.13574 17.8669 8.80933C17.8601 8.79848 17.8578 8.7854 17.8605 8.77288C17.8632 8.76036 17.8707 8.7494 17.8814 8.74234L18.2657 8.48948C18.601 8.26868 18.9957 8.12059 19.3985 8.12308C19.9314 8.12795 20.404 8.36844 20.7247 8.82208C20.8007 8.93869 20.8647 9.06274 20.9157 9.19232C21.014 9.48142 20.9868 9.40149 21.0381 9.55314C21.0522 9.59308 21.0652 9.63335 21.0761 9.67432Z"
              fill="#F0D2B7"/>
        <path d="M21.0769 9.67379L21.5631 9.52613C22.1655 9.34349 22.5627 8.89758 22.7194 8.40555C22.9049 7.84133 22.8275 7.21222 22.6037 6.74002C22.4833 6.48322 22.3083 6.21208 22.1621 5.98519C22.1586 5.97977 22.154 5.97509 22.1487 5.97144C22.1434 5.96779 22.1374 5.96523 22.1311 5.96392C22.1248 5.9626 22.1183 5.96255 22.1119 5.96377C22.1056 5.96499 22.0996 5.96746 22.0942 5.97103L21.711 6.22309C21.3583 6.45537 21.1166 6.79496 20.9558 7.18372C20.7538 7.6682 20.6915 8.27064 20.8027 8.78906C20.8271 8.92677 20.8652 9.06169 20.9165 9.19179C21.0148 9.48089 20.9876 9.40096 21.039 9.55261C21.0531 9.59255 21.0661 9.63282 21.0769 9.67379Z"
              fill="#DB9557"/>
        <path d="M21.374 13.5757L20.871 13.504C20.4752 13.4473 20.0885 13.2829 19.7664 13.0565C19.4138 12.8135 19.1726 12.5262 19.0581 12.3142C18.8695 11.9891 18.882 11.7966 18.8363 11.4256C18.8347 11.4129 18.8381 11.4 18.8459 11.3897C18.8537 11.3795 18.8651 11.3727 18.8779 11.3708L19.3331 11.3059C19.7356 11.2483 20.1413 11.2833 20.5142 11.4572C20.6831 11.538 20.8414 11.6508 20.9792 11.7886C21.0019 11.8114 21.0246 11.8349 21.0456 11.8591C21.1502 11.9837 21.2363 12.1226 21.3036 12.27C21.368 12.4209 21.4103 12.5952 21.4308 12.7566C21.4387 12.8591 21.4388 12.965 21.4308 13.0709L21.4211 13.1975C21.4175 13.2397 21.411 13.2816 21.406 13.3236L21.374 13.5757Z"
              fill="#F0D2B7"/>
        <path d="M21.373 13.5713L21.876 13.643C22.3009 13.7038 22.7082 13.6206 23.0693 13.392C23.2491 13.2754 23.4096 13.1208 23.5434 12.9479C23.9355 12.4349 24.0555 11.7656 23.977 11.1338C23.9722 11.0797 23.9644 11.0258 23.958 10.9717L23.9231 10.697C23.9223 10.6906 23.9202 10.6844 23.9169 10.6788C23.9137 10.6732 23.9094 10.6682 23.9042 10.6643C23.8991 10.6604 23.8932 10.6575 23.8869 10.6559C23.8806 10.6542 23.8741 10.6539 23.8677 10.6548L23.4138 10.7195C23.0024 10.7784 22.624 10.9851 22.3215 11.2667C22.1659 11.4084 22.0322 11.5611 21.9181 11.7291C21.899 11.757 21.8812 11.7853 21.8628 11.8138C21.7645 11.9617 21.686 12.1129 21.6267 12.2647C21.5582 12.428 21.5087 12.5796 21.4774 12.7546C21.4538 12.8573 21.4379 12.9615 21.4299 13.0665L21.4203 13.1931C21.4166 13.2353 21.4101 13.2772 21.4051 13.3192L21.373 13.5713Z"
              fill="#DB9557"/>
        <path d="M19.9883 17.2252L19.5639 16.946C19.3262 16.7894 19.1286 16.5951 18.9682 16.3884C18.6376 15.9633 18.3598 15.3235 18.434 14.7954C18.4524 14.5935 18.5576 14.3574 18.6046 14.207C18.6127 14.1813 18.6396 14.1672 18.6654 14.175L19.104 14.3082C19.4953 14.4269 19.8465 14.629 20.1079 14.9435C20.4323 15.3336 20.5673 15.8555 20.4178 16.4095C20.3989 16.4749 20.3794 16.5417 20.3507 16.605C20.2552 16.8185 20.1005 17.0497 19.9883 17.2252Z"
              fill="#F0D2B7"/>
        <path d="M19.9883 17.2276L20.4127 17.5068C20.9381 17.8528 21.5791 17.9134 22.2189 17.5886C22.75 17.3058 23.1094 16.8406 23.328 16.2773C23.3872 16.1044 23.4802 15.8361 23.5211 15.7034C23.523 15.6973 23.5236 15.6909 23.523 15.6845C23.5224 15.6781 23.5205 15.6719 23.5175 15.6662C23.5144 15.6605 23.5103 15.6555 23.5053 15.6515C23.5004 15.6474 23.4946 15.6444 23.4885 15.6426L23.0488 15.509C22.6234 15.38 22.0863 15.3934 21.4454 15.695C21.0989 15.862 20.7315 16.1467 20.492 16.4505C20.4483 16.5038 20.4103 16.561 20.3692 16.6177C20.2547 16.7771 20.3133 16.7191 19.9883 17.2276Z"
              fill="#DB9557"/>
        <path d="M17.1873 19.95L16.9206 19.5176C16.7096 19.175 16.5895 18.7717 16.5574 18.3817C16.5201 17.9583 16.5771 17.4351 16.8072 17.0887C16.9225 16.8994 17.0532 16.8038 17.2132 16.6268C17.2175 16.622 17.2227 16.6181 17.2285 16.6152C17.2344 16.6124 17.2407 16.6108 17.2471 16.6104C17.2535 16.6101 17.26 16.611 17.2661 16.6131C17.2722 16.6152 17.2778 16.6185 17.2826 16.6228L17.6234 16.93C17.9794 17.2509 18.2321 17.6508 18.3005 18.1215C18.3822 18.7568 18.0957 19.3365 17.6115 19.6704L17.508 19.744C17.3736 19.8307 17.4444 19.7851 17.1873 19.95Z"
              fill="#F0D2B7"/>
        <path d="M17.1855 19.9516L17.4522 20.384C17.7505 20.8682 18.2299 21.1742 18.8293 21.2168C19.3972 21.262 20.043 21.0475 20.6108 20.5045C20.6719 20.4455 20.9246 20.181 21.0279 20.0691C21.0323 20.0643 21.0357 20.0587 21.0379 20.0527C21.0401 20.0466 21.0411 20.0402 21.0407 20.0337C21.0404 20.0273 21.0388 20.0209 21.0361 20.0151C21.0333 20.0093 21.0294 20.004 21.0246 19.9997L20.6837 19.6924C20.3277 19.3715 19.844 19.2083 19.3593 19.1845C18.7887 19.1467 18.1599 19.2926 17.6097 19.6721C17.6096 19.6721 17.4427 19.7868 17.1855 19.9516Z"
              fill="#DB9557"/>
        <path d="M16.9694 4.50635L16.6987 3.9357C16.0921 2.65691 14.5637 2.112 13.2849 2.7186L12.7584 2.96832C12.7526 2.97107 12.7474 2.97494 12.7431 2.9797C12.7388 2.98447 12.7355 2.99003 12.7333 2.99608C12.7312 3.00214 12.7302 3.00855 12.7305 3.01497C12.7309 3.02139 12.7324 3.02768 12.7352 3.03348L12.9849 3.55992C13.5915 4.83871 15.1199 5.38362 16.3987 4.77702L16.9694 4.50635Z"
              fill="#F0D2B7"/>
        <path d="M4.8457 6.27447L5.22303 6.61466C5.55886 6.9174 6.00467 7.12999 6.4554 7.21958C6.93037 7.32168 7.45325 7.30044 7.8587 7.02189C7.97275 6.94356 7.80624 7.05039 8.12094 6.84802C8.13175 6.84108 8.13941 6.83019 8.1423 6.81767C8.1452 6.80516 8.14308 6.79201 8.13641 6.78103L7.89489 6.38946C7.60603 5.92049 7.19008 5.57059 6.66129 5.46141C6.2986 5.38327 5.90557 5.43882 5.52586 5.65216C5.27689 5.80184 5.12158 5.98467 5.01967 6.08944C4.96187 6.15127 4.90158 6.21085 4.8457 6.27447Z"
              fill="#DB9557"/>
        <path d="M4.84575 6.27529L4.46843 5.93509C3.9396 5.45839 3.73826 4.7532 3.99712 3.989C4.17854 3.49378 4.50959 3.09053 4.91879 2.80776C5.0981 2.68461 4.90041 2.8095 5.42212 2.47549C5.42759 2.47199 5.4337 2.46961 5.4401 2.4685C5.4465 2.46739 5.45305 2.46756 5.45938 2.469C5.46571 2.47044 5.47169 2.47313 5.47697 2.47691C5.48225 2.48069 5.48673 2.48548 5.49014 2.49101L5.73072 2.88108C6.02155 3.35319 6.06946 3.94301 5.96009 4.4792C5.77488 5.34612 5.36277 5.73769 5.01977 6.09026C4.96192 6.15209 4.90163 6.21167 4.84575 6.27529Z"
              fill="#F0D2B7"/>
        <path d="M2.92188 9.67432L3.408 9.82199C3.78912 9.93754 4.21248 9.95179 4.60058 9.88494C5.25673 9.77169 5.6318 9.51329 5.88162 9.20268C5.94856 9.11821 5.92568 9.13574 6.13106 8.80933C6.13787 8.79848 6.14017 8.7854 6.13746 8.77288C6.13475 8.76036 6.12726 8.7494 6.11657 8.74234L5.73222 8.48948C5.39699 8.26868 5.00228 8.12059 4.59945 8.12308C4.06654 8.12795 3.59392 8.36844 3.27327 8.82208C3.19721 8.93869 3.13322 9.06274 3.08229 9.19232C2.98399 9.48142 3.01113 9.40149 2.9598 9.55314C2.94574 9.59308 2.93275 9.63335 2.92188 9.67432Z"
              fill="#DB9557"/>
        <path d="M2.92028 9.67379L2.43416 9.52613C1.83168 9.34349 1.43448 8.89758 1.27786 8.40555C1.09232 7.84133 1.16971 7.21222 1.39351 6.74002C1.51394 6.48322 1.68893 6.21208 1.83515 5.98519C1.83864 5.97977 1.84318 5.97509 1.8485 5.97144C1.85382 5.96779 1.85981 5.96523 1.86613 5.96392C1.87244 5.9626 1.87896 5.96255 1.88529 5.96377C1.89162 5.96499 1.89765 5.96746 1.90303 5.97103L2.28621 6.22309C2.63887 6.45537 2.88058 6.79496 3.04137 7.18372C3.24346 7.6682 3.30576 8.27064 3.19452 8.78906C3.17016 8.92677 3.13204 9.06169 3.08075 9.19179C2.98244 9.48089 3.00958 9.40096 2.95825 9.55261C2.94398 9.59248 2.93131 9.63291 2.92028 9.67379Z"
              fill="#F0D2B7"/>
        <path d="M2.62526 13.5757L3.12822 13.504C3.52401 13.4473 3.91071 13.2829 4.23281 13.0565C4.58547 12.8135 4.82661 12.5262 4.94114 12.3142C5.12973 11.9891 5.11726 11.7966 5.16292 11.4256C5.16454 11.4129 5.1611 11.4 5.15333 11.3897C5.14557 11.3795 5.1341 11.3727 5.12138 11.3708L4.6661 11.3059C4.26365 11.2483 3.85792 11.2833 3.48501 11.4572C3.3162 11.538 3.15785 11.6508 3.02007 11.7886C2.99713 11.8114 2.97496 11.8349 2.9536 11.8591C2.84906 11.9837 2.76299 12.1226 2.69567 12.27C2.63122 12.4209 2.58893 12.5952 2.56845 12.7566C2.56049 12.8612 2.56052 12.9663 2.56854 13.0709L2.57815 13.1975C2.58176 13.2397 2.58832 13.2816 2.59329 13.3236L2.62526 13.5757Z"
              fill="#DB9557"/>
        <path d="M2.62522 13.5713L2.12226 13.643C1.6974 13.7038 1.29008 13.6206 0.928932 13.392C0.717746 13.2548 0.532437 13.0653 0.387208 12.8553C0.278357 12.689 0.191961 12.5085 0.126097 12.3234C-0.0226939 11.8905 -0.0236314 11.4217 0.0402166 10.9717L0.0751876 10.697C0.0760053 10.6906 0.0780941 10.6844 0.0813325 10.6788C0.0845708 10.6732 0.088894 10.6682 0.0940504 10.6643C0.0992068 10.6604 0.105093 10.6575 0.111368 10.6559C0.117642 10.6542 0.124179 10.6539 0.130598 10.6548L0.584425 10.7195C0.995874 10.7784 1.37427 10.9851 1.67673 11.2667C1.83237 11.4084 1.96606 11.5611 2.08012 11.7291C2.0992 11.757 2.1171 11.7853 2.13543 11.8138C2.23374 11.9617 2.3123 12.1129 2.37156 12.2647C2.44005 12.428 2.48955 12.5796 2.52087 12.7546C2.5445 12.8573 2.56039 12.9615 2.5684 13.0665L2.57801 13.1931C2.58162 13.2353 2.58818 13.2772 2.59315 13.3192L2.62522 13.5713Z"
              fill="#F0D2B7"/>
        <path d="M4.00979 17.2252L4.43423 16.946C4.6719 16.7895 4.86958 16.5951 5.02995 16.3884C5.36059 15.9633 5.63829 15.3235 5.56418 14.7954C5.54575 14.5936 5.44051 14.3574 5.39349 14.207C5.38968 14.1947 5.38114 14.1845 5.36975 14.1785C5.35835 14.1724 5.34504 14.1712 5.33274 14.175L4.8941 14.3083C4.50281 14.4269 4.1516 14.629 3.89021 14.9435C3.56581 15.3336 3.4308 15.8556 3.5803 16.4095C3.59928 16.4749 3.61874 16.5418 3.64743 16.605C3.74296 16.8185 3.89761 17.0497 4.00979 17.2252Z"
              fill="#DB9557"/>
        <path d="M4.00957 17.2276L3.58514 17.5068C3.05978 17.8528 2.41872 17.9134 1.77893 17.5886C1.24784 17.3058 0.88843 16.8406 0.669837 16.2773C0.61063 16.1044 0.517624 15.8361 0.476746 15.7034C0.474864 15.6973 0.474216 15.6909 0.474839 15.6845C0.475462 15.6781 0.477345 15.6719 0.480378 15.6662C0.483411 15.6605 0.487535 15.6555 0.492511 15.6515C0.497488 15.6474 0.503219 15.6444 0.509373 15.6426L0.949043 15.509C1.37442 15.38 1.91159 15.3934 2.55246 15.695C2.89894 15.862 3.26642 16.1467 3.50587 16.4505C3.54951 16.5038 3.58758 16.561 3.62864 16.6177C3.74317 16.7771 3.68457 16.7191 4.00957 17.2276Z"
              fill="#F0D2B7"/>
        <path d="M6.8126 19.95L7.07929 19.5176C7.29029 19.175 7.41044 18.7717 7.44255 18.3817C7.47977 17.9583 7.42281 17.4351 7.19269 17.0887C7.07742 16.8994 6.94667 16.8038 6.78668 16.6268C6.78238 16.622 6.77718 16.6181 6.77137 16.6152C6.76556 16.6124 6.75926 16.6108 6.75281 16.6104C6.74637 16.6101 6.73992 16.611 6.73382 16.6131C6.72773 16.6152 6.72212 16.6185 6.7173 16.6228L6.37654 16.93C6.0205 17.2509 5.76778 17.6508 5.69939 18.1215C5.61768 18.7568 5.9042 19.3365 6.38845 19.6704L6.49196 19.744C6.62635 19.8307 6.55548 19.7851 6.8126 19.95Z"
              fill="#DB9557"/>
        <path d="M6.81228 19.9552L6.54559 20.3876C6.24735 20.8718 5.76798 21.1778 5.16855 21.2204C4.60067 21.2656 3.95483 21.0511 3.38699 20.5081C3.32591 20.4491 3.07319 20.1845 2.96992 20.0726C2.96555 20.0679 2.96216 20.0623 2.95996 20.0563C2.95775 20.0502 2.95678 20.0437 2.95709 20.0373C2.9574 20.0308 2.95899 20.0245 2.96176 20.0187C2.96453 20.0128 2.96844 20.0076 2.97325 20.0033L3.3141 19.696C3.67014 19.3751 4.15387 19.2119 4.6385 19.1881C5.2091 19.1503 5.83797 19.2962 6.38813 19.6757C6.38822 19.6756 6.55516 19.7903 6.81228 19.9552ZM7.02909 4.50635L7.29977 3.9357C7.90637 2.65691 9.43478 2.112 10.7136 2.7186L11.24 2.96832C11.2644 2.9799 11.2748 3.00906 11.2633 3.03348L11.0135 3.55992C10.4069 4.83871 8.87853 5.38362 7.59974 4.77702L7.02909 4.50635Z"
              fill="#F0D2B7"/>
        <path d="M13.8399 21.5329C13.7514 21.5327 13.6662 21.4991 13.6013 21.4388C13.5365 21.3785 13.4967 21.296 13.4901 21.2077C13.4835 21.1194 13.5104 21.0318 13.5655 20.9625C13.6206 20.8932 13.6998 20.8472 13.7874 20.8337C17.9668 20.196 21.1167 16.5238 21.1143 12.2916C21.1121 8.46958 18.6608 5.14935 15.0148 4.02962C14.8291 3.97261 14.7249 3.77591 14.7819 3.59032C14.8389 3.40473 15.0356 3.30029 15.2212 3.35743C17.0895 3.93117 18.7685 5.11334 19.949 6.68606C21.1701 8.31296 21.8162 10.2512 21.8174 12.2912C21.8187 14.5352 21.0093 16.7063 19.5383 18.4046C18.0819 20.0861 16.0772 21.1957 13.8934 21.5288C13.8757 21.5316 13.8578 21.5329 13.8399 21.5329ZM10.1591 21.5329C10.1415 21.5329 10.1236 21.5316 10.1056 21.5288C7.92191 21.1957 5.91713 20.0861 4.46072 18.4046C2.98973 16.7063 2.18033 14.5352 2.18164 12.2912C2.18281 10.2512 2.82889 8.31296 4.05002 6.68606C5.2305 5.11334 6.90953 3.93117 8.77786 3.35743C8.86683 3.33064 8.96279 3.34016 9.04476 3.3839C9.12673 3.42765 9.18806 3.50206 9.21533 3.59088C9.24261 3.6797 9.23361 3.77571 9.19031 3.85792C9.14702 3.94013 9.07294 4.00186 8.98427 4.02962C5.33818 5.1493 2.88702 8.46958 2.88481 12.2916C2.88238 16.5238 6.03226 20.196 10.2117 20.8337C10.2994 20.847 10.3787 20.893 10.434 20.9623C10.4892 21.0317 10.5162 21.1193 10.5095 21.2077C10.5029 21.2961 10.4631 21.3787 10.3981 21.439C10.3331 21.4993 10.2478 21.5329 10.1591 21.5329Z"
              fill="#E7B78E"/>
        <path d="M13.6723 11.9143C13.84 11.9617 14.004 12.0255 14.1645 12.1057C14.3285 12.1822 14.4725 12.288 14.5965 12.4229C14.7241 12.5541 14.8262 12.72 14.9027 12.9205C14.9793 13.1174 15.0176 13.3617 15.0176 13.6533C15.0176 14.007 14.952 14.3351 14.8207 14.6377C14.6931 14.9403 14.498 15.2028 14.2355 15.4252C13.9767 15.6439 13.6486 15.8153 13.2512 15.9393C12.8574 16.0669 12.3926 16.1307 11.8566 16.1307C11.3863 16.1307 10.9762 16.0632 10.6262 15.9283C10.2762 15.7971 9.98451 15.6202 9.75117 15.3979C9.51784 15.1755 9.34284 14.9221 9.22617 14.6377C9.11315 14.3497 9.05664 14.0544 9.05664 13.7518C9.05664 13.5294 9.0931 13.3361 9.16602 13.1721C9.23893 13.0044 9.33919 12.8658 9.4668 12.7564C9.59805 12.6434 9.74935 12.5596 9.9207 12.5049C10.0957 12.4502 10.2816 12.4229 10.4785 12.4229C10.6316 12.4229 10.7811 12.4393 10.927 12.4721C11.0764 12.5049 11.215 12.5541 11.3426 12.6197C11.4738 12.6817 11.5905 12.7583 11.6926 12.8494C11.7983 12.9406 11.8822 13.0445 11.9441 13.1611C11.8676 13.1393 11.802 13.1283 11.7473 13.1283C11.6962 13.1283 11.6452 13.1411 11.5941 13.1666C11.5467 13.1885 11.503 13.2195 11.4629 13.2596C11.4228 13.2997 11.39 13.3471 11.3645 13.4018C11.3426 13.4528 11.3316 13.5075 11.3316 13.5658C11.3316 13.6278 11.3426 13.6934 11.3645 13.7627C11.39 13.8283 11.4264 13.8885 11.4738 13.9432C11.5249 13.9979 11.5868 14.0434 11.6598 14.0799C11.7363 14.1163 11.8238 14.1346 11.9223 14.1346C12.0389 14.1346 12.1374 14.1127 12.2176 14.0689C12.2978 14.0216 12.3616 13.965 12.409 13.8994C12.4564 13.8338 12.4892 13.7627 12.5074 13.6861C12.5293 13.6096 12.5402 13.5385 12.5402 13.4729C12.5402 13.2031 12.4874 12.9825 12.3816 12.8111C12.2759 12.6361 12.1465 12.4939 11.9934 12.3846C11.8439 12.2715 11.6853 12.1804 11.5176 12.1111C11.3535 12.0419 11.2095 11.9762 11.0855 11.9143C11.3189 11.8486 11.5249 11.7775 11.7035 11.701C11.8858 11.6244 12.0389 11.5278 12.1629 11.4111C12.2868 11.2945 12.3798 11.1468 12.4418 10.9682C12.5074 10.7895 12.5402 10.5653 12.5402 10.2955C12.5402 10.2299 12.5293 10.1588 12.5074 10.0822C12.4892 10.0057 12.4564 9.93457 12.409 9.86895C12.3616 9.79967 12.2978 9.74316 12.2176 9.69941C12.1374 9.65566 12.0389 9.63379 11.9223 9.63379C11.8238 9.63379 11.7363 9.65202 11.6598 9.68848C11.5868 9.72494 11.5249 9.77051 11.4738 9.8252C11.4264 9.87988 11.39 9.94186 11.3645 10.0111C11.3426 10.0768 11.3316 10.1406 11.3316 10.2025C11.3316 10.2609 11.3426 10.3174 11.3645 10.3721C11.39 10.4231 11.4228 10.4687 11.4629 10.5088C11.503 10.5489 11.5467 10.5817 11.5941 10.6072C11.6452 10.6291 11.6962 10.64 11.7473 10.64C11.802 10.64 11.8676 10.6291 11.9441 10.6072C11.8822 10.7239 11.7983 10.8296 11.6926 10.9244C11.5905 11.0156 11.4738 11.0921 11.3426 11.1541C11.215 11.2161 11.0764 11.2635 10.927 11.2963C10.7811 11.3291 10.6316 11.3455 10.4785 11.3455C10.2816 11.3455 10.0957 11.3182 9.9207 11.2635C9.74935 11.2088 9.59805 11.1268 9.4668 11.0174C9.33919 10.9044 9.23893 10.7658 9.16602 10.6018C9.0931 10.434 9.05664 10.2372 9.05664 10.0111C9.05664 9.70853 9.11315 9.41504 9.22617 9.13066C9.34284 8.84629 9.51784 8.5929 9.75117 8.37051C9.98451 8.14811 10.2762 7.97129 10.6262 7.84004C10.9762 7.70514 11.3863 7.6377 11.8566 7.6377C12.3926 7.6377 12.8574 7.70879 13.2512 7.85098C13.6486 7.99316 13.9767 8.18275 14.2355 8.41973C14.498 8.65671 14.6931 8.92832 14.8207 9.23457C14.952 9.54082 15.0176 9.85618 15.0176 10.1807C15.0176 10.4176 14.9775 10.6364 14.8973 10.8369C14.8207 11.0338 14.7186 11.207 14.591 11.3564C14.4634 11.5059 14.3194 11.6281 14.159 11.7229C13.9986 11.8176 13.8363 11.8814 13.6723 11.9143Z"
              fill="#F0D2B7"/>
    </svg>
`,ii=t=>{t.tooltipProps={open:!1}},ai=async t=>{const e=await(async(t,e,i)=>i({method:"GET",url:`V1/Widget/Join/${t}/${e}`}))(t.tournament.id,t.tournament.periodId,t.baseFetch);!1===e?.hasError?(t.tournament.joinedStatus=1,t._onChangeJoinedStatus(t.tournament.id)):t.tooltipProps={open:!0,joinPopUp:!0,text:e?.data?.joinPopUp,okText:t.translations?.ok??t.okText,hasCancelButton:!1,onConfirm:()=>ii(t)}};var ni=({tournamentRedirectionUrl:t,tournament:e,languageId:i})=>{var a;if("string"==typeof t&&(t=(a=t,a.endsWith("/")?a.slice(0,-1):a).replaceAll("{0}",i)),t){let i=`/${e.seoName}/${e.id}/Periods/${e.periodId}`;e.isPrivate&&(i+="/private"),t+=i,window.self!==window.top?window.parent.postMessage({type:"rgs-backToHome",mainDomain:t},"*"):window.location.href=t}},oi=class extends mt{static properties={mobile:{type:Boolean,reflect:!0},okText:{type:String},isLoadingBtn:{type:Boolean,attribute:!1},tooltipProps:{type:Object,attribute:!1},tournament:{type:Object,attribute:!1},baseFetch:{attribute:!1},_onChangeJoinedStatus:{attribute:!1},translations:{attribute:!1},tournamentRedirectionUrl:{attribute:!1},languageId:{attribute:!1}};constructor(){super(),this.mobile=!1,this.okText="OK",this.isLoadingBtn=!1,this.tooltipProps={open:!1},this.tournament={},this.translations={},this.tournamentRedirectionUrl=null,this.languageId=null,this._onChangeJoinedStatus=()=>{}}static elementStyles=We;_handleJoin=()=>(async t=>{if(t.isPlayerStatusJoined||t.isLoadingBtn)return;t.isLoadingBtn=!0;const e=await(async(t,e,i)=>i({method:"GET",url:`V1/Widget/VerifyJoin/${t}/${e}`}))(t.tournament.id,t.tournament.periodId,t.baseFetch);null!=e?.data?.joinPopUp?t.tooltipProps={open:!0,joinPopUp:!0,text:e.data.joinPopUp,okText:t.translations?.ok??t.okText,hasCancelButton:!1,onConfirm:()=>ii(t)}:null!=e?.data?.freezePointsPopUp?t.tooltipProps={open:!0,text:e.data.freezePointsPopUp,okText:t.translations?.ok??t.okText,hasCancelButton:!0,onConfirm:()=>{ii(t),ai(t)}}:await ai(t),t.isLoadingBtn=!1})(this);_closeTooltip=()=>ii(this);_handleLearnMore=ni;render(){const{_handleLearnMore:t,_handleJoin:e,_closeTooltip:i,tournamentRedirectionUrl:a,isLoadingBtn:n,tooltipProps:o,mobile:s,tournament:r,translations:l,languageId:c}=this,d=r?.status,h=1===r?.joinedStatus,p=3===d||2===d;return D`
          <div class="buttons-wrapper flex">
              <button-custom
                      class="body-text-md"
                      variant="primary"
                      ?mobile=${s}
                      .onClick=${()=>t({tournamentRedirectionUrl:a,tournament:r,languageId:c})}
              >
                  ${l?.learnMore??"Learn More"}
              </button-custom>

              ${p?D`
                  <div class="join-anchor">
                      <button-custom
                              class="body-text-md secondary-button-text"
                              variant=${h?"joined":"secondary"}
                              ?disabled=${h||n}
                              ?mobile=${s}
                              .onClick=${e}
                      >
                          ${h?D`${qe}`:V}
                          ${h?l?.joined??"Joined":l?.joinTournament??"Join Tournament"}
                      </button-custom>

                      ${o.open?D`
                          <div class="join-tooltip" role="tooltip">
                              <p class="join-tooltip__title title-sm">${l?.attention??"Attention"}</p>
                              <p class="join-tooltip__text body-text-md">${D`${fe(o.text)}`}</p>

                              <div class="join-tooltip__actions flex">
                                  ${o.hasCancelButton?D`
                                      <button-custom
                                              class="body-text-md"
                                              variant="primary"
                                              ?mobile=${s}
                                              .onClick=${i}
                                      >
                                          ${l?.cancel??"Cancel"}
                                      </button-custom>
                                  `:V}

                                  <button-custom
                                          class="body-text-md"
                                          variant="secondary"
                                          ?mobile=${s}
                                          .onClick=${o.onConfirm}
                                  >
                                      ${o.okText}
                                  </button-custom>
                              </div>

                              <span class="join-tooltip__arrow"></span>
                          </div>
                      `:V}
                  </div>
              `:V}
          </div>
      `}};customElements.define("buttons-wrapper",oi);var si=o`
    :host {
        display: block;
    }

    .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: var(--border-radius-lg);
        background: var(--in-game-expanded-widget-surface-color);
    }

    .card__logo-wrapper {
        width: 100%;
        justify-content: center;
    }

    .card__logo {
        width: 100%;
        padding: 4px;
        height: 160px;
        border-radius: var(--border-radius-lg);
    }

    .card__info {
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
    }

    .info-top {
        gap: 2px;
    }

    .card__label {
        justify-content: center;
        color: var(--in-game-secondary-text-color);
    }

    .card__prize {
        font-weight: 600;
        text-align: center;
        color: var(--in-game-text-color);
    }

    .card__total {
        font-weight: 700;
        color: var(--in-game-amount-color);
    }

    .card__min-bet {
        font-weight: 500;
        color: var(--in-game-secondary-text-color);
    }

    .card__min-bet-value {
        font-weight: 600;
        color: var(--in-game-text-color);
        font-variant-numeric: tabular-nums;
    }

    /* ---------- Mobile  ---------- */

    :host([mobile]) .card {
        height: 100px;
        flex-direction: row;
        align-items: center;
        border-radius: var(--border-radius-sm);
    }

    :host([mobile]) .card__logo-wrapper {
        width: 168px;
        height: 93px;
        padding: 0 0 0 4px;
    }

    :host([mobile]) .card__prize {
        text-align: start;
    }

    :host([mobile]) .card__info {
        width: auto;
        flex: 1;
        align-items: flex-start;
        padding: 12px 0 12px 12px;
    }

    :host([mobile]) .card__label {
        justify-content: unset;
    }

    :host([mobile]) .card__logo {
        width: 100%;
        height: 100%;
        border-radius: var(--border-radius-xs);
        object-fit: cover;
        padding: unset;
    }
`,ri=class extends mt{static properties={tournament:{type:Object},mobile:{type:Boolean,reflect:!0},translations:{attribute:!1}};static elementStyles=si;constructor(){super(),this.tournament={},this.mobile=!1,this.translations={}}render(){const{name:t="",currencySymbol:e="",prizePool:i=0,minBet:a=null,mobileImageUrl:n,desktopImageUrl:o}=this.tournament;return D`
        <div class="card">

            <div class="card__logo-wrapper flex">
                <img class="card__logo" src=${this.mobile?n:o} alt=${t} loading="lazy"/>
            </div>

            <div class="card__info flex direction-column">
                <div class="info-top flex direction-column ">
                    <div class="card__label flex body-text-sm">${this.translations?.prizePool??"Prize Pool"}</div>
                    <div class="card__prize title-lg">${Gt(i)} ${e}</div>

                </div>

                <div class="info-bottom">
                    ${null!=a?D`
                                <div class="card__min-bet body-text-sm">
                                    ${this.translations?.minBet??"Min Bet"}: <span
                                        class="card__min-bet-value">${Gt(a,e)}</span>
                                </div>
                            `:V}
                </div>
            </div>
        </div>
    `}};customElements.define("tournament-info-card",ri);var li=o`

    .wrapper {
        gap: 4px;
        text-align: center;
    }

    .date {
        gap: 4px;
        color: var(--in-game-text-color);
        align-items: center;
    }

    .item {
        font-weight: 600;
        align-items: center;
    }

    .title {
        color: var(--in-game-secondary-text-color);
    }

`;customElements.define("date-time",class extends mt{static properties={tournament:{type:Object},countdownParts:{type:Object},translations:{type:Object}};static elementStyles=li;constructor(){super(),this.tournament=null,this.countdownParts=null,this.translations={}}render(){const t=this.tournament,e=this.translations||{};if(4===t.status){const i=Kt(t.startDate,e),a=Kt(t.endDate,e);if(!i&&!a)return V;const n=i&&a?`${i} - ${a}`:i||a;return D`
          <div class="wrapper flex align-center title-xs">
              <div>
                  <span>${Xe}</span>
              </div>
              <div class="title">${e?.date||"Date"}:</div>
              <div class="date">${n}</div>
          </div>
      `}const{day:i="00",hour:a="00",minute:n="00",second:o="00"}=this.countdownParts??{};let s=e?.startsIn||"Starts In";return 3===t.status&&(s=e?.endsIn||"Ends In"),D`
        <div class="wrapper flex align-center title-xs">
            <div>
                <span>${Xe}</span>
            </div>

            <div class="title">${s}:</div>

            <div class="date flex">
                <div class="item flex">
                    <span class="number">${i}</span>
                    <span class="label">${e?.day||"d"}</span>
                </div>
                <div class="item flex">
                    <span class="number">${a}:${n}:${o}</span>
                </div>
            </div>
        </div>
    `}});var ci=o`

    /*======== Desktop ========*/

    .general {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .date-status-wrapper {
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
    }

    .description-wrapper {
        width: 100%;
    }

    .description-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        overflow-wrap: anywhere;
        word-break: break-word;
        color: var(--in-game-secondary-text-color);
    }

    .status-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: var(--border-radius-sm);
        overflow: hidden;
    }

    .player-info-wrapper {
        display: flex;
        width: 100%;
    }

    .score-and-position-wrapper {
        width: 100%;
        color: var(--in-game-text-color);
    }

    .score-and-position-wrapper > * {
        flex: 1;
    }

    .position-score-content {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .score {
        font-weight: 600;
    }

    .line {
        width: 100%;
        height: 1px;
        background-color: var(--in-game-border-color);
    }

    .background-2 {
        background-color: color-mix(in srgb, var(--in-game-info-state-color) 10%, transparent);
    }

    .background-3 {
        background-color: color-mix(in srgb, var(--in-game-positive-state-color) 10%, transparent);
    }

    .background-4 {
        background-color: color-mix(in srgb, var(--in-game-negative-state-color) 10%, transparent);
    }

    .background-5 {
        background-color: color-mix(in srgb, var(--in-game-inactive-state-color) 10%, transparent);
    }

    .circle-wrapper {
        display: flex;
        align-items: center;
    }

    .status-circle {
        width: 5px;
        height: 5px;
        border-radius: 50%;
    }

    .status-circle-2 {
        background-color: var(--in-game-info-state-color);
    }

    .status-circle-3 {
        background-color: var(--in-game-positive-state-color);
    }

    .status-circle-4 {
        background-color: var(--in-game-negative-state-color);
    }


    .status-circle-5 {
        background-color: var(--in-game-inactive-state-color);
    }

    .status-text {
        font-weight: 500;
        text-align: center;
        color: var(--in-game-text-color);
    }


    /*======== Mobile ========*/

    :host([mobile]) .date-status-wrapper {
        justify-content: flex-start;
        gap: 4px;
    }

    :host([mobile]) .description-wrapper {
        height: 40px;
    }

    :host([mobile]) .status-wrapper {
        gap: 4px;
        padding: 4px 8px;
    }

    :host([mobile]) .description-text {
        -webkit-line-clamp: 2;
        line-clamp: 2;
    }
`,di=class extends mt{static properties={tournament:{type:Object},countdownParts:{type:Object},translations:{type:Object},mobile:{type:Boolean,reflect:!0},player:{type:Object},baseFetch:{attribute:!1},_onChangeJoinedStatus:{attribute:!1},tournamentsPositionAndScore:{attribute:!1},tournamentRedirectionUrl:{attribute:!1},languageId:{attribute:!1}};static elementStyles=ci;constructor(){super(),this.tournament={},this.countdownParts=null,this.translations={},this.mobile=!1,this.baseFetch=null,this._onChangeJoinedStatus=()=>{},this.tournamentsPositionAndScore={},this.tournamentRedirectionUrl=null,this.languageId=null}render(){const{tournament:t,translations:e,mobile:i,countdownParts:a,tournamentRedirectionUrl:n,baseFetch:o,_onChangeJoinedStatus:s,tournamentsPositionAndScore:r,languageId:l}=this;if(!t)return V;const c=3===t.status||2===t.status||4===t.status&&!(!t.endDate&&!t.startDate),d=r[t.id]||{};return D`
        <div class="general">

            <tournament-info-card
                    .tournament=${t}
                    ?mobile=${i}
                    .translations=${e}
            ></tournament-info-card>

            <div class="flex date-status-wrapper">
                ${(({status:t,translations:e={}})=>{const i=Ue[t];return D`
      <div class="status-wrapper background-${t}">
          <div class="circle-wrapper">
              <div class="status-circle status-circle-${t}"></div>
          </div>
          <div class="status-text title-xs">${e[i]??i}</div>
      </div>
  `})({status:t.status,translations:e})}

                ${c?D`
                    <date-time
                            .tournament=${t}
                            .countdownParts=${a}
                            .translations=${e}
                    ></date-time>`:V}
            </div>

            <div class="description-wrapper">
                <span class="description-text body-text-md">${fe(t.description)}</span>
            </div>

            <div class="player-info-wrapper flex">
                <div class="score-and-position-wrapper flex">
                    ${(({text:t="Position",position:e})=>D`
      <div class="position-score body-text-md flex">
          <div class="position-score-content flex align-center">
                <span class="icon">
                     ${Ke}
                </span>
              <div class="text-score">
                  <span class="text">${t}: </span>
                  <span class="score">${e||"-"}</span>
              </div>
          </div>
      </div>
  `)({text:e?.myPosition??"My Position",position:d.position})}
                    ${(({text:t="Score",score:e})=>D`
      <div class="position-score body-text-md flex">
          <div class="position-score-content flex align-center">
                <span class="icon">
                     ${Ye}
                </span>
              <div class="text-score">
                  <span class="text">${t}: </span>
                  <span class="score">${null!=e?Gt(e):"-"}</span>
              </div>
          </div>
      </div>
  `)({text:e?.score??"Score",score:d.score})}
                </div>
            </div>

            <div class="line"></div>

            <buttons-wrapper
                    ?mobile=${i}
                    .tournament=${t}
                    .languageId=${l}
                    .baseFetch=${o}
                    ._onChangeJoinedStatus=${s}
                    .translations=${e}
                    .tournamentRedirectionUrl=${n}
            >
            </buttons-wrapper>


        </div>
    `}};customElements.define("tournament-general-tab",di);var hi=o`
  :host {
    display: block;
    height: 100%;
    overflow: auto;
  }

  .leaderboard {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .table-wrapper {
    width: 100%;
    display: flex;
  }

  table {
    table-layout: fixed;
    width: 100%;
    height: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  .th_row {
    height: 36px;
  }

  .th_1 {
    text-align: center;
    padding: 0 4px 0 8px;
    width: 32px;
  }

  .th_2 {
    text-align: start;
    padding: 0 4px;
    width: 60px;
  }

  .th_3 {
    text-align: center;
    padding: 0 4px;
    width: 84px;
  }

  .th_4 {
    text-align: end;
    padding: 0 8px 0 4px;
    width: 127px;
  }


  .td_1 {
    border-radius: var(--border-radius-sm) 0 0 var(--border-radius-sm);
    text-align: center;
    width: 32px;
    padding: 0 4px 0 8px;
  }

  .td_1 span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .td_2 {
    text-align: start;
    padding: 0 4px;
    width: 60px;
  }

  .td_3 {
    text-align: center;
    padding: 0 4px;
    width: 102px;
  }

  .td_4 {
    text-align: end;
    padding: 0 8px 0 4px;
    border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
    width: 127px;
  }

  .place_icon-td {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tr_row {
    height: 40px;
  }


  thead th {
    color: var(--in-game-secondary-text-color);
  }

  tbody tr:nth-child(odd) {
    background: var(--in-game-expanded-widget-surface-color);
  }

  /* tbody tr:nth-child(even) {
    background: var(--in-game-expanded-widget-surface-color);
  } */

  td {
    background: inherit;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--in-game-text-color);
  }

  .tr_my_place td {
    border-top: 1px solid var(--in-game-primary-color);
    border-bottom: 1px solid var(--in-game-primary-color);
  }

  .tr_my_place td:first-child {
    border-left: 1px solid var(--in-game-primary-color);
    border-top-left-radius: var(--border-radius-sm) !important;
    border-bottom-left-radius: var(--border-radius-sm) !important;
  }

  .tr_my_place td:last-child {
    border-right: 1px solid var(--in-game-primary-color);
    border-top-right-radius: var(--border-radius-sm) !important;
    border-bottom-right-radius: var(--border-radius-sm) !important;
  }

  .loader-wrapper {
    flex: 1;
    min-height: 0;
  }

  .player-name-cell {
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
  }

  .player-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .position-change {
    display: inline-flex;
    align-items: center;
    gap: 1px;
    flex-shrink: 0;
    font-size: 10px;
    line-height: 1;
    border-radius: var(--border-radius-sm);
    padding: 4px;
  }

  .position-change--positive {
    background-color: color-mix(in srgb, var(--in-game-positive-state-color) 10%, transparent);
    color: var(--in-game-positive-state-color);
    border: 1px solid var(--in-game-positive-state-color);
  }


  .position-change--negative {
    background-color: color-mix(in srgb, var(--in-game-inactive-state-color) 10%, transparent);
    color: var(--in-game-inactive-state-color);
    border: 1px solid var(--in-game-inactive-state-color);
  }

`,pi=class{constructor(t,e){this.fn=t,this.intervalMs=e,this._timer=null,this._paused=!1,this._started=!1}get isRunning(){return this._started&&!this._paused}runImmediately(){Promise.resolve(this.fn()).catch(()=>{})}start(){this._started||(this._started=!0,this.#t())}pause(){this._paused||(this._paused=!0,this.#e())}resume(){this._paused&&(this._paused=!1,this._started&&(Promise.resolve(this.fn()).catch(()=>{}),this.#t()))}destroy(){this._started=!1,this._paused=!1,this.#e()}#t(){!this._paused&&this._started&&(this.#e(),this._timer=setInterval(()=>Promise.resolve(this.fn()).catch(()=>{}),this.intervalMs))}#e(){null!==this._timer&&(clearInterval(this._timer),this._timer=null)}},ui=t=>{const{translations:e={},leaderboard:i,leaderboardComulative:a,loading:n,positionChange:o}=t;return n?D`
        <div class="loader-wrapper">
            <panel-loader .loading=${n}></panel-loader>
        </div>
    `:D`

        <table>
            <thead>
            <tr class="body-text-sm th_row">
                <th class="th_1">#</th>
                <th class="th_2">${e.player??"Player"}</th>
                <th class="th_3">${e.score??"Score"}</th>
                <th class="th_4">${e.toWin??"To Win"}</th>
            </tr>
            </thead>

            <tbody>
            ${ee(i??[],t=>t.id,(t,i)=>{const a=t.isMyPlace?"tr_my_place":"",n=o>0,s=t.isMyPlace&&null!==o&&0!==o;return D`
                            <tr class="body-text-sm tr_row ${a}">
                                <td class="td_1 ">
                                    ${0===i?D`<span>${Qe}</span>`:1===i?D`<span>${ti}</span>`:2===i?D`<span>${ei}</span>`:i+1}
                                </td>
                                <td class="td_2">
                                    ${t.isMyPlace?D`<div class="player-name-cell">
                                                <span class="player-name">${e.me||"Me"}</span>
                                                ${s?D`
                                                    <span class="position-change position-change--${n?"positive":"negative"}">
                                                        ${((t=!1)=>D`
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="${t?"rotate(180 6 6)":""}">
            <path d="M2.50391 7.5L6.00391 11L9.50391 7.5M6.00391 11L6.00391 4M5.50391 1.5C5.50391 1.22386 5.72776 1 6.00391 1C6.28005 1 6.50391 1.22386 6.50391 1.5C6.50391 1.77614 6.28005 2 6.00391 2C5.72776 2 5.50391 1.77614 5.50391 1.5Z"
                  style="stroke: ${t?"var(--in-game-positive-state-color)":"var(--in-game-inactive-state-color)"}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
    </svg>
  `)(n)}
                                                        <span>${Math.abs(o)}</span>
                                                    </span>`:V}
                                              </div>`:t.userName}
                                </td>
                                <td class="td_3">${Gt(t.score)}</td>
                                <td class="td_4">${t.prize??"-"}</td>
                            </tr>
                        `})}
            </tbody>
        </table>
    `},mi=o`
    .periods-switcher-wrapper {
        display: flex;
        gap: 2px;
        padding: 2px;
        height: 30px;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        background: var(--in-game-expanded-widget-surface-color);
        border-radius: var(--border-radius-sm);
        overflow-x: auto;
        overflow-y: hidden;
    }

    .periods-switcher-tab {
        flex: 1 1 0;
        min-width: 0;
        height: 100%;
        padding: 4px 16px;
        border: none;
        background: transparent;
        color: var(--in-game-text-color);
        border-radius: var(--border-radius-xs);
        font-family: inherit;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: background-color 0.15s ease;
        cursor: pointer;
    }

    .periods-switcher-tab:not(.active):hover {
        background: color-mix(in srgb, var(--in-game-expanded-widget-surface-color) 50%, transparent);
    }

    .periods-switcher-tab.active {
        background: var(--in-game-background-color);
        cursor: default;
    }
`,gi=(t,e,i=null)=>{const a=Number(t);return Number.isNaN(a)?t:`${a.toLocaleString("en-US",{maximumFractionDigits:2})} ${e||""} ${i||""}`},Ci=(t,e,i,a)=>{const{amount:n,prizeTypeId:o,description:s,quantity:r,showDistribution:l,distributionPercentage:c,externalBonus:d}=t;let h;return 4===o&&d&&(h=d.bonusType===Re[5]?gi(r,i):gi(n,e,a[Oe[d.bonusType].translationKey]??Oe[d.bonusType].label)),l&&`${Gt(c)} %`||1===o&&Gt(n,e)||2===o&&Gt(s)||3===o&&gi(r,i)||4===o&&h},bi=t=>{const{leaderboardsArray:e,prizes:i,myScore:a,currency:n="Eur",translations:o}=t;let s=!1;if(e.forEach((t,r)=>{const l=r+1,c=i[r]?.prizeTypeId;t.place=l,t.prize="-",null!==a&&Object.keys(a).length>0&&(a?.id===t.id||!s&&l===e.length)&&(a?.id===t.id?(t.isMyPlace=!0,t.score=a?.score):e.push({isMyPlace:!0,place:a?.place,score:a?.score,prize:"-",userName:a?.userName}),s=!0),void 0!==i[r]&&(2===c?t.prize=gi(i[r]?.description):1===c?t.prize=Gt(i[r]?.amount,n):3===c?t.prize=gi(i[r]?.quantity,o?.xFreeRound||"x Free Round"):4===c&&(t.prize=Ci(i[r],n,o?.xFreeRound||"x Free Round",o)))}),e.length<i.length){const t=i.length-e.length;for(let a=0;a<t;a++){let t="";void 0!==i[e.length]&&(t=Ci(i[e.length],n,o?.xFreeRound||"x Free Round",o)),e.push({id:Math.random(),userName:"-",score:"-",place:e.length+1,prize:t})}}return e},vi=class extends mt{static properties={id:{type:Number,attribute:!1},mobile:{type:Boolean,reflect:!0},currentPeriodId:{type:Number,attribute:!1},baseFetch:{attribute:!1},status:{attribute:!1},prizes:{type:Array,attribute:!1},comulativePrizes:{type:Array,attribute:!1},translations:{type:Object},isCumulative:{type:Boolean,attribute:!1},leaderboard:{state:!0},leaderboardComulative:{state:!0},loading:{state:!0},periods:{state:!0},positionChange:{state:!0},currencySymbol:{attribute:!1}};static elementStyles=[hi,mi];constructor(){super(),this.id=null,this.leaderboard=[],this.leaderboardComulative=[],this.currentPeriodId=null,this.leaderboardRequestManager=new pi(()=>this.getLeaderboard(this.id,this.currentPeriodId,this.baseFetch),vt),this.loading=null,this.baseFetch=null,this.prizes=[],this.comulativePrizes=[],this.translations={},this.status=null,this.isCumulative=null,this.periods=[],this.positionChange=null,this.currencySymbol=null,this._prevMyPlace=null}_onVisibilityChange=()=>Yt(this.leaderboardRequestManager,null,!1);async connectedCallback(){this.loading=!0,super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),this.isCumulative&&(this.periods=((t,e={})=>[{periodId:t,name:e?.periodic||"Periodic"},{periodId:"cumulative",name:e.cumulative||"Cumulative"}])(this.currentPeriodId,this.translations)),await this.getLeaderboard(this.id,this.currentPeriodId,this.baseFetch),4!==this.status&&this.leaderboardRequestManager.start(),this.loading=!1}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibilityChange),this.leaderboardRequestManager.destroy()}async getLeaderboard(t,e){if(!t)return;const i=await(async(t,e,i)=>i({method:"GET",url:`inGameWidget/Leaderboard/Tournament/${t}${"cumulative"!==e?`?periodId=${e}`:""}`}))(t,e,this.baseFetch);if(!1===i?.hasError){const t=i.data.myScore?.place??null;null!==this._prevMyPlace&&null!==t&&(this.positionChange=this._prevMyPlace-t),this._prevMyPlace=t,this.leaderboard=bi({leaderboardsArray:structuredClone(i.data.leaderboard),prizes:this.prizes,myScore:i.data.myScore,currency:this.currencySymbol,translations:this.translations}),this.isCumulative&&(this.leaderboardComulative=bi({leaderboardsArray:structuredClone(i.data.leaderboard),prizes:this.comulativePrizes,myScore:i.data.myScore,currency:this.currencySymbol,translations:this.translations}))}}handlePeriodChange=async t=>{this.currentPeriodId!==t&&(this.loading=!0,this.leaderboardRequestManager.destroy(),this.currentPeriodId=t,this._prevMyPlace=null,this.positionChange=null,await this.getLeaderboard(this.id,t,this.baseFetch),4!==this.status&&this.leaderboardRequestManager.start(),this.loading=!1)};render(){const{leaderboardComulative:t,leaderboard:e,isCumulative:i,currentPeriodId:a,periods:n,loading:o,positionChange:s}=this,r="cumulative"===a?t:e;return D`
        <div class="leaderboard">
            ${i?(t=>{const{periods:e,currentPeriodId:i,onPeriodChange:a}=t;return D`
        <div class="periods-switcher-wrapper">
            ${ee(e,t=>t.periodId,t=>{const e=t.periodId===i;return D`
                            <button
                                    type="button"
                                    class=${ae({"periods-switcher-tab":!0,"body-text-sm":!0,active:e})}
                                    ?disabled=${e}
                                    @click=${e?null:()=>a(t.periodId)}
                            >
                                ${t.name}
                            </button>
                        `})}
        </div>
    `})({periods:n,currentPeriodId:a,onPeriodChange:this.handlePeriodChange}):V}

            <div class="table-wrapper">
                ${ui({leaderboard:r,loading:o,translations:this.translations,positionChange:s})}
            </div>

        </div>
    `}};customElements.define("tournament-leaderboard-tab",vi);var fi=class extends mt{static properties={initialId:{type:Number,attribute:!1},mobile:{type:Boolean,reflect:!0},gameThumbnailType:{type:Number},tournamentsPanelList:{type:Array},_selectedId:{state:!0},_activeTabId:{state:!0},_loading:{state:!0},tournament:{state:!0},onSelectedJackpotOrTournamentIdChange:{attribute:!1},currentPeriodId:{state:!0},baseFetch:{attribute:!1},partnerIdentity:{attribute:!1},gameId:{attribute:!1},_onChangeJoinedStatus:{attribute:!1},tournamentsPositionAndScore:{attribute:!1},tournamentManager:{attribute:!1},_getTournamentPositionAndScore:{attribute:!1},translations:{attribute:!1},tournamentRedirectionUrl:{attribute:!1},playerCurrencyId:{attribute:!1},languageId:{attribute:!1}};static elementStyles=De;constructor(){super(),this.initialId=null,this.mobile=!1,this.gameThumbnailType=null,this.tournamentsPanelList=[],this._selectedId=null,this._activeTabId=null,this._loading=!1,this.tournament=null,this.currentPeriodId=null,this.baseFetch=null,this.partnerIdentity=null,this.gameId=null,this.playerCurrencyId=null,this.languageId=null,this._onChangeJoinedStatus=()=>{},this.tournamentManager=()=>{},this._getTournamentPositionAndScore=()=>{},this.translations={},this.tournamentsPositionAndScore={},this.tournamentRedirectionUrl=null,this._countdown=new Je(this,{onExpire:()=>(t=>{if(null!=t._selectedId){let e=null;2===t.tournament.status?e=3:3===t.tournament.status&&(e=4),t.tournament={...t.tournament,status:e},t._startCountdown()}})(this)})}willUpdate(t){if(t.has("initialId")||null===this._selectedId){const t=this.initialId??this.tournamentsPanelList?.[0]?.id??null;null!==t&&t!==this._selectedId&&(this._selectedId=t)}}updated(t){t.has("_selectedId")&&null!=this._selectedId&&this._loadTournament(this._selectedId)}async _loadTournament(t){this._loading=!0,this._countdown.stop();try{const e=this.tournamentsPanelList.find(e=>e.id===t);if(!e)return console.error("TournamentsTab: tournament not found in list",t),void(this._loading=!1);this.currentPeriodId=e.periodId;const i=await(e?.isPrivate?wt:xt)({id:t,periodId:this.currentPeriodId,baseFetch:this.baseFetch,partnerIdentity:this.partnerIdentity,playerCurrencyId:this.playerCurrencyId});!1===i?.hasError&&(this.tournament=i.data,this.tournament.joinedStatus=e.joinedStatus,this.tournament.currencySymbol=e.currencySymbol,this.tournament.isPrivate=e.isPrivate,this._startCountdown(),this._getTournamentPositionAndScore(),1===this._activeTabId&&(4===this.tournament.status?this.tournamentManager.destroy():this.tournamentManager.isRunning||this.tournamentManager.start()))}catch(ve){console.error("TournamentsTab: _loadTournament failed",ve)}this._loading=!1}_startCountdown(){const t=this.tournament;t&&(2===t.status?this._countdown.start(t.startDateSecond):3===t.status?this._countdown.start(t.endDateSecond):4===t.status&&this._countdown.start(0))}_onSwitch=t=>{t!==this._selectedId&&(this._selectedId=t,this._activeTabId=1,this.onSelectedJackpotOrTournamentIdChange("selectedTournamentId",this._selectedId))};_onTabChange=t=>{const e=this._activeTabId;this._activeTabId=t,1===t?(null!==e&&this._getTournamentPositionAndScore(),4===this.tournament?.status||this.tournamentManager.isRunning||this.tournamentManager.start()):this.tournamentManager.isRunning&&this.tournamentManager.destroy()};render(){const{mobile:t,tournament:e,tournamentsPanelList:i,currentPeriodId:a,baseFetch:n,_onChangeJoinedStatus:o,_selectedId:s,_onSwitch:r,_activeTabId:l,_onTabChange:c,_loading:d,gameThumbnailType:h,tournamentsPositionAndScore:p,tournamentRedirectionUrl:u,languageId:m}=this;if(d||!e)return D`
          <div class="tab-wrapper">
              <div class="loader-wrapper">
                  <panel-loader .loading=${!0}></panel-loader>
              </div>
          </div>
      `;const{availableTabs:g,ids:C}=(({tournamentsPanelList:t,translations:e={}})=>{const i=Pe.map(t=>({...t,name:[e?.general,e?.leaderboard,e?.tournamentGames,e?.tournamentRules][t.id-1]??t.name})),a=[];return t.forEach(t=>{a.push(t.id)}),{availableTabs:i,ids:a}})({tournamentsPanelList:i,translations:this.translations});return D`
        <div class="tab-wrapper">
            <entity-switcher
                    .name=${`${e?.name} ${e?.isPeriodic?`(${e?.periodName})`:""}`}
                    .currentId=${s}
                    .allItems=${C}
                    .onChange=${r}
            ></entity-switcher>

            <tab-navigation
                    .availableTabs=${g}
                    .onChange=${c}
                    .activeTabId=${l}
                    ?mobile=${t}
            ></tab-navigation>

            <div class="content-wrapper">
                ${1===l?D`
                    <tournament-general-tab
                            .tournament=${e}
                            .countdownParts=${this._countdown.parts}
                            .translations=${this.translations}
                            ?mobile=${t}
                            .baseFetch=${n}
                            ._onChangeJoinedStatus=${o}
                            .tournamentsPositionAndScore=${p}
                            .tournamentRedirectionUrl=${u}
                            .languageId=${m}
                    ></tournament-general-tab>`:V}

                ${2===l?D`
                    <tournament-leaderboard-tab
                            .id=${s}
                            .currentPeriodId=${a}
                            .prizes=${e.prizes}
                            .comulativePrizes=${e.comulativePrizes}
                            .currencySymbol=${e.currencySymbol}
                            ?mobile=${t}
                            .baseFetch=${n}
                            .status=${e.status}
                            .isCumulative=${e.isCumulative}
                            .translations=${this.translations}
                    ></tournament-leaderboard-tab>`:V}

                ${3===l?D`
                    <games-tab
                            .games=${e.games}
                            .gameThumbnailType=${h}
                            .gameId=${this.gameId}
                    ></games-tab>`:V}

                ${4===l?D`
                    <rules-tab
                            .rules=${e.rules}
                    ></rules-tab>`:V}
            </div>
        </div>
    `}};customElements.define("tournaments-section",fi);var yi=o`
    :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 0;
        min-height: 0;
        overflow: hidden;
    }
    .section-title {
        flex-shrink: 0;
        padding: 6px;
        color: var(--in-game-text-color);
        text-align: center;
        font-weight: 400;
    }
`,xi=o`
    :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow: hidden;
        flex: 1 1 0;
        min-height: 0;
    }
    .list-scroll {
        flex: 1 1 0;
        min-height: 0;
        overflow-y: auto;
        padding: 0 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .no-notifications {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 32px 0;
        color: var(--in-game-secondary-text-color);
        text-align: center;
    }
    .load-more-wrapper {
        padding: 8px 16px 4px;
        display: flex;
        justify-content: center;
        flex-shrink: 0;
    }
    .load-more-btn {
        background: none;
        border: 1px solid var(--in-game-border-color);
        border-radius: var(--border-radius-sm);
        color: var(--in-game-secondary-text-color);
        cursor: pointer;
        padding: 6px 16px;
        width: 100%;
    }
    .load-more-btn:hover {
        color: var(--in-game-text-color);
        border-color: var(--in-game-secondary-text-color);
    }
`,wi="unread",_i=o`
    :host {
        display: block;
        width: 100%;
    }
    .tabs-header {
        display: flex;
        align-items: center;
        margin: 0 16px 12px 16px;
        border-bottom: 1px solid var(--in-game-border-color);
    }
    .tabs-row {
        display: flex;
        align-items: center;
        flex: 1 1 0;
        min-width: 0;
        padding-bottom: 4px;
        gap: 0;
    }
    .tab {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        cursor: pointer;
        color: var(--in-game-secondary-text-color);
        white-space: nowrap;
        flex-shrink: 0;
    }
    .tab::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -4px;
        width: 100%;
        height: 2px;
        background: var(--in-game-primary-color);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.15s ease;
    }
    .tab.active {
        color: var(--in-game-text-color);
    }
    .tab:hover {
        color: var(--in-game-text-color);
    }
    .tab.active::after {
        transform: scaleX(1);
    }
    .mark-all-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        color: var(--in-game-secondary-text-color);
        background: none;
        border: none;
        padding: 4px 0;
        white-space: nowrap;
        flex-shrink: 0;
        margin-left: auto;
    }
    .mark-all-btn:hover {
        color: var(--in-game-text-color);
    }
    .mark-all-btn.hidden {
        visibility: hidden;
        pointer-events: none;
    }
`;customElements.define("notifications-tabs",class extends mt{static properties={activeTab:{type:String},totalUnreadCount:{type:Number},onTabChange:{attribute:!1},onMarkAllRead:{attribute:!1},translations:{attribute:!1}};static elementStyles=_i;constructor(){super(),this.activeTab="all",this.totalUnreadCount=0,this.onTabChange=()=>{},this.onMarkAllRead=()=>{},this.translations={}}render(){const{activeTab:t,totalUnreadCount:e,onTabChange:i,onMarkAllRead:a,translations:n}=this,{all:o="All",unread:s="Unread",markAll:r="Mark all as read"}=n;return D`
      <div class="tabs-header">
        <div class="tabs-row">
          <span
            class=${ae({tab:!0,"body-text-sm":!0,active:"all"===t})}
            @click=${()=>i("all")}
          >${o}</span>
          <span
            class=${ae({tab:!0,"body-text-sm":!0,active:t===wi})}
            @click=${()=>i(wi)}
          >${s}${e>0?`(${e})`:""}</span>
        </div>
        <button
          class=${ae({"mark-all-btn":!0,caption:!0,hidden:0===e})}
          @click=${a}
        >
          ${r} ${Tt}
        </button>
      </div>
    `}});var $i=o`
    :host {
        display: block;
        width: 100%;
    }
    .unread-card {
        background-color: var(--in-game-expanded-widget-surface-color);
    }
    .card {
        border-radius: var(--border-radius-xs);
        padding: 10px 12px;
        cursor: pointer;
        box-sizing: border-box;
        transition: background-color 0.15s ease;
        position: relative;
    }
    .card:hover {
        background-color: var(--in-game-collapsed-widget-surface-color);
    }
    .card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 6px;
        margin-bottom: 4px;
    }
    .title {
        color: var(--in-game-text-color);
        font-weight: 600;
        flex: 1 1 0;
        min-width: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .unread-dot {
        flex-shrink: 0;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #E35656;
        margin-top: 4px;
    }
    .content {
        color: var(--in-game-secondary-text-color);
        overflow: hidden;
    }
    .content.truncated {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 6px;
        gap: 8px;
    }
    .read-more-btn {
        color: var(--in-game-text-color);
        font-weight: 500;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        flex-shrink: 0;
    }
    .time {
        color: var(--in-game-secondary-text-color);
        margin-left: auto;
        white-space: nowrap;
        flex-shrink: 0;
    }
`;customElements.define("notifications-card",class extends mt{static properties={notification:{attribute:!1},onMarkRead:{attribute:!1},translations:{attribute:!1},_expanded:{state:!0},_showExpandButton:{state:!0}};static elementStyles=$i;constructor(){super(),this.notification=null,this.onMarkRead=()=>{},this.translations={},this._expanded=!1,this._showExpandButton=!1}firstUpdated(){this._handleExpandButtonVisibility()}_onClick=()=>{this.notification?.isRead||this.onMarkRead(this.notification.notificationId)};_onToggleExpand=t=>{t.stopPropagation(),this._expanded=!this._expanded};_handleExpandButtonVisibility(){const t=this.renderRoot.querySelector(".content");if(!t)return;const e=t.classList.contains("truncated");e||t.classList.add("truncated");const i=t.scrollHeight>t.clientHeight+1;e||t.classList.remove("truncated"),this._showExpandButton!==i&&(this._showExpandButton=i)}render(){const{notification:t,translations:e,_expanded:i,_showExpandButton:a}=this,{readMore:n="Read more",readLess:o="Read less"}=e;if(!t)return V;const{title:s,content:r,isRead:l,creationDate:c,isTest:d}=t,h=d?"Now":function(t,e={}){const{ago:i="ago",hour:a="h",day:n="d",now:o="Now"}=e,s=36e5,r=864e5,l=30*r,c=Date.now()-new Date(t).getTime();if(c>=l)return null;if(c<=18e5)return o;if(c<s)return`1${a} ${i}`;const d=c/s;return c<846e5?`${Math.ceil(d)}${a} ${i}`:`${Math.max(1,Math.floor(c/r))}${n} ${i}`}(c,e);return D`
      <div class="card ${l?"":"unread-card"}" @click=${this._onClick}>
        <div class="card-header">
          <span class="title body-text-sm">${s}</span>
          ${l?V:D`<span class="unread-dot"></span>`}
        </div>
        <p class="content body-text-sm ${i?"":"truncated"}">${r}</p>
        <div class="card-footer">
          ${a?D`<button class="read-more-btn body-text-sm" @click=${this._onToggleExpand}>
                      ${i?o:n}
                    </button>`:V}
          ${h?D`<span class="time caption">${h}</span>`:V}
        </div>
      </div>
    `}});var ki=class extends mt{static properties={translations:{attribute:!1},mobile:{type:Boolean,reflect:!0},activeTab:{state:!0},notifications:{state:!1},unreadNotifications:{state:!1},currentPage:{state:!0},totalCount:{state:!0},totalUnreadCount:{type:Number},onResetHasUnreadNotifications:{attribute:!1},baseFetch:{attribute:!1}};static elementStyles=xi;constructor(){super(),this.translations={},this.mobile=!1,this.activeTab="all",this.notifications=[],this.unreadNotifications=[],this.currentPage=1,this.totalCount=0,this.totalUnreadCount=0,this.baseFetch=null,this.onResetHasUnreadNotifications=()=>{}}connectedCallback(){super.connectedCallback(),this._fetchAllNotifications(this.currentPage)}async _fetchAllNotifications(t){const e=await(async({page:t,pageSize:e,baseFetch:i})=>i({method:"GET",url:`inGameWidget/GetNotifications?pageNumber=${t}&pageSize=${e}`}))({page:t,pageSize:10,baseFetch:this.baseFetch});if(!1===e?.hasError){const{notifications:i,totalCount:a,totalUnreadCount:n}=e.data??{};this.notifications=1===t?i:[...this.notifications,...i],this.totalCount=a,this.totalUnreadCount=n,this.onResetHasUnreadNotifications(),this.requestUpdate()}}async _fetchUnreadNotifications(){const t=await(async({baseFetch:t})=>t({method:"GET",url:"inGameWidget/GetUnreadNotifications"}))({baseFetch:this.baseFetch});!1===t?.hasError&&(this.unreadNotifications=t.data??[],this.requestUpdate())}_onTabChange=t=>{t!==this.activeTab&&(this.activeTab=t,this.currentPage=1,"all"===t?this._fetchAllNotifications(1):this._fetchUnreadNotifications())};_onLoadMore=()=>{const t=this.currentPage+1;this.currentPage=t,this._fetchAllNotifications(t)};_markNotificationRead=async t=>{!1===(await(async({id:t,baseFetch:e})=>e({method:"POST",url:`inGameWidget/MarkNotificationRead/${t}`}))({id:t,baseFetch:this.baseFetch}))?.hasError&&("all"===this.activeTab?this.notifications=this.notifications.map(e=>e.notificationId===t?{...e,isRead:!0}:e):this.unreadNotifications=this.unreadNotifications.map(e=>e.notificationId===t?{...e,isRead:!0}:e),this.totalUnreadCount=this.totalUnreadCount-1,this.requestUpdate())};_markAllNotificationsRead=async()=>{!1===(await(async({baseFetch:t})=>t({method:"POST",url:"inGameWidget/MarkAllNotificationsRead"}))({baseFetch:this.baseFetch}))?.hasError&&("all"===this.activeTab?this.notifications=this.notifications.map(t=>({...t,isRead:!0})):this.unreadNotifications=this.unreadNotifications.map(t=>({...t,isRead:!0})),this.totalUnreadCount=0,this.requestUpdate())};render(){const{activeTab:t,totalCount:e,totalUnreadCount:i,notifications:a,unreadNotifications:n,translations:o}=this,{noNotification:s="You have no notifications.",noUnreadNotification:r="You have no unread notifications.",loadPrevious:l="Load More"}=o,c="unread"===t?n:a,d="all"===t&&e>a.length;return D`
      <notifications-tabs
        .activeTab=${t}
        .totalUnreadCount=${i}
        .onTabChange=${this._onTabChange}
        .onMarkAllRead=${this._markAllNotificationsRead}
        .translations=${o}
      ></notifications-tabs>

      <div class="list-scroll">
        ${0===c.length?D`<p class="no-notifications body-text-sm">${"unread"===t?r:s}</p>`:ee(c,t=>t.id,t=>D`
              <notifications-card
                .notification=${t}
                .onMarkRead=${this._markNotificationRead}
                .translations=${o}
              ></notifications-card>
            `)}

        ${d?D`
          <button-custom
            class="body-text-md load-more-wrapper"
            variant="primary"
            ?mobile=${this.mobile}
            @click=${this._onLoadMore}
          >
            ${l}
          </button-custom>`:V}
      </div>
    `}};customElements.define("notifications-list",ki);var Ii=class extends mt{static properties={translations:{attribute:!1},onResetHasUnreadNotifications:{attribute:!1},mobile:{type:Boolean,reflect:!0},baseFetch:{attribute:!1}};static elementStyles=yi;constructor(){super(),this.translations={},this.mobile=!1,this.baseFetch=null,this.onResetHasUnreadNotifications=()=>{}}render(){const{translations:t,onResetHasUnreadNotifications:e}=this;return D`
      <h2 class="section-title title-md">${t.notifications??"Notifications"}</h2>
      <notifications-list 
              .translations=${t}
              .onResetHasUnreadNotifications=${e}
              ?mobile=${this.mobile}
              .baseFetch=${this.baseFetch}
      ></notifications-list>
    `}};customElements.define("notifications-section",Ii);var Li=class extends mt{static properties={activeTab:{attribute:!1},open:{type:Boolean,reflect:!0},mobile:{type:Boolean,reflect:!0},onClose:{attribute:!1},onTabClick:{attribute:!1},jackpotGameThumbnailType:{type:Number},tournamentGameThumbnailType:{type:Number},tournamentsPanelList:{attribute:!1},cache:{attribute:!1},onSelectedJackpotOrTournamentIdChange:{attribute:!1},jackpotsAmounts:{attribute:!1},selectedJackpotId:{attribute:!1},selectedTournamentId:{attribute:!1},baseFetch:{attribute:!1},partnerIdentity:{attribute:!1},gameId:{attribute:!1},languageId:{attribute:!1},jackpots:{attribute:!1},_onChangeJoinedStatus:{attribute:!1},tournamentsPositionAndScore:{attribute:!1},tournamentManager:{attribute:!1},_getTournamentPositionAndScore:{attribute:!1},jackpotTranslations:{attribute:!1},tournamentTranslations:{attribute:!1},categoryId:{attribute:!1},subCategory:{attribute:!1},providerId:{attribute:!1},playerCurrencyId:{attribute:!1},jackpotIconUrl:{attribute:!1},tournamentIconUrl:{attribute:!1},tournamentRedirectionUrl:{attribute:!1},showNotifications:{type:Boolean},notificationTranslations:{attribute:!1},hasUnreadNotifications:{type:Boolean},onResetHasUnreadNotifications:{attribute:!1}};static elementStyles=_t;constructor(){super(),this.activeTab=null,this.open=!1,this.mobile=!1,this.selectedJackpotId=null,this.selectedTournamentId=null,this.baseFetch=null,this.partnerIdentity=null,this.gameId=null,this.categoryId=null,this.subCategory=null,this.providerId=null,this.playerCurrencyId=null,this.jackpotIconUrl=null,this.tournamentIconUrl=null,this.languageId=null,this.tournamentRedirectionUrl=null,this.showNotifications=!1,this.notificationTranslations={},this.hasUnreadNotifications=!1,this.onClose=()=>{},this.onTabClick=()=>{},this.tournamentsPanelList=[],this.jackpots=[],this._onChangeJoinedStatus=()=>{},this.cache={jackpotsCache:{}},this.jackpotsAmounts={},this.tournamentsPositionAndScore={},this.tournamentManager=()=>{},this._getTournamentPositionAndScore=()=>{},this.jackpotTranslations={},this.tournamentTranslations={},this.onResetHasUnreadNotifications=()=>{}}render(){const{activeTab:t,open:e,mobile:i,jackpots:a,selectedJackpotId:n,selectedTournamentId:o,onClose:s,tournamentManager:r,onTabClick:l,jackpotGameThumbnailType:c,tournamentGameThumbnailType:d,jackpotsAmounts:h,baseFetch:p,partnerIdentity:u,gameId:m,providerId:g,tournamentRedirectionUrl:C,_onChangeJoinedStatus:b,_getTournamentPositionAndScore:v,categoryId:f,subCategory:y,tournamentsPanelList:x,cache:w,onSelectedJackpotOrTournamentIdChange:_,tournamentsPositionAndScore:$,jackpotTranslations:k,tournamentTranslations:I,playerCurrencyId:L,jackpotIconUrl:T,tournamentIconUrl:A,languageId:S,showNotifications:M,notificationTranslations:j,hasUnreadNotifications:E,onResetHasUnreadNotifications:P}=this;return D`
        <div class="sidebar-container">
            ${e?D`
                <sidebar-header
                        ?mobile=${i}
                        .onClose=${s}
                        .activeTab=${t}
                        .onTabClick=${l}
                        .baseFetch=${p}
                        .hasJackpotTab=${a.length}
                        .hasTournamentTab=${x.length}
                        .jackpotTranslations=${k}
                        .tournamentTranslations=${I}
                        .jackpotIconUrl=${T}
                        .tournamentIconUrl=${A}
                        .showNotifications=${M}
                        .hasUnreadNotifications=${E}
                ></sidebar-header>

                ${"jackpots"===t?D`
                            <jackpots-section
                                    .gameThumbnailType=${c}
                                    .initialId=${n}
                                    .cache=${w}
                                    ?mobile=${i}
                                    .jackpotsAmounts=${h}
                                    .onSelectedJackpotOrTournamentIdChange=${_}
                                    .baseFetch=${p}
                                    .partnerIdentity=${u}
                                    .gameId=${m}
                                    .translations=${k}
                                    .categoryId=${f}
                                    .subCategory=${y}
                                    .providerId=${g}
                                    .playerCurrencyId=${L}
                            ></jackpots-section>`:"notifications"===t?D`
                            <notifications-section 
                                    .translations=${j}
                                    .onResetHasUnreadNotifications=${P}
                                    ?mobile=${i}
                                    .baseFetch=${p}
                            ></notifications-section>`:t?D`
                                    <tournaments-section
                                            .initialId=${o}
                                            .tournamentsPanelList=${x}
                                            .languageId=${S}
                                            .tournamentsPositionAndScore=${$}
                                            ?mobile=${i}
                                            .onSelectedJackpotOrTournamentIdChange=${_}
                                            .baseFetch=${p}
                                            .partnerIdentity=${u}
                                            .gameId=${m}
                                            .gameThumbnailType=${d}
                                            ._onChangeJoinedStatus=${b}
                                            .tournamentManager=${r}
                                            ._getTournamentPositionAndScore=${v}
                                            .translations=${I}
                                            .tournamentRedirectionUrl=${C}
                                            .playerCurrencyId=${L}
                                    ></tournaments-section>`:V}
            `:V}
        </div>
    `}};customElements.define("sidebar-wrapper",Li);var Ti=class{constructor(t,e){this.host=t,this.y=0,this._suppress=!1,this._pendingMoveCleanup=null,this._parentElement=e}attach(){this.host.addEventListener("pointerdown",this._start),this.host.addEventListener("click",this._click,{capture:!0})}detach(){this._pendingMoveCleanup?.(),this.host.removeEventListener("pointerdown",this._start),this.host.removeEventListener("click",this._click,{capture:!0})}_start=t=>{const e=t.clientY,i=this.y;let a=!1;const n=t=>{const n=t.clientY-e;if(!a&&Math.abs(n)<5)return;a=!0;const o=this._parentElement.clientHeight-this.host.offsetHeight;this.y=Math.max(0,Math.min(i+n,o)),this.host.style.transform=`translateY(${this.y}px)`},o=()=>{document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",s),this._pendingMoveCleanup=null},s=()=>{o(),a&&(this._suppress=!0,setTimeout(()=>this._suppress=!1))};this._pendingMoveCleanup=o,document.addEventListener("pointermove",n),document.addEventListener("pointerup",s,{once:!0})};_click=t=>{this._suppress&&(t.stopPropagation(),t.preventDefault())}},Ai=o`
    :host {
        display: block;
        pointer-events: none;
    }

    .tabs-root {
        position: relative;
        z-index: 1;
        pointer-events: none;
    }

    .surface {
        position: relative;
        pointer-events: auto;
    }

    .buttons-wrapper {
        position: relative;
        gap: 4px;
        pointer-events: auto;
    }

    .buttons-wrapper skeleton-custom {
        flex: 1 1 0;
    }

    .icon-layer,
    .bar-layer {
        overflow: hidden;
    }

    /* === Desktop === */

    :host(:not([mobile])) .tabs-root {
        justify-content: flex-end;
        transition: transform 0.3s ease, opacity 0.25s ease;
    }

    :host(:not([mobile])) .surface {
        width: fit-content;
        box-sizing: border-box;
        padding: 8px;
        background-color: var(--in-game-background-color);
        border-radius: var(--border-radius-lg);
    }

    :host(:not([mobile])) .drag-handle {
        cursor: grab;
        touch-action: none;
        user-select: none;
        will-change: transform;
    }

    :host([dragging]:not([mobile])) .drag-handle {
        cursor: grabbing;
    }

    :host([open]:not([mobile])) .tabs-root {
        transform: translateX(calc(100% + 16px));
        opacity: 0;
        pointer-events: none;
    }


    :host(:not([mobile])) panel-chevron {
        width: 0;
        height: 42px;
        margin-right: 0;
        opacity: 0;
        align-self: center;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        flex-shrink: 0;
        transition: width 0.25s ease, margin-right 0.25s ease, opacity 0.2s ease;
    }

    :host(:not([mobile])) .surface:hover panel-chevron {
        width: 20px;
        margin-right: 4px;
        opacity: 1;
    }


    :host(:not([mobile])) .icon-layer,
    :host(:not([mobile])) .bar-layer {
        height: 42px;
        transition: max-width 0.3s ease, opacity 0.25s ease;
    }

    :host(:not([mobile])) .icon-layer {
        max-width: 0;
        opacity: 0;
    }

    :host(:not([mobile])) .bar-layer {
        max-width: 360px;
        opacity: 1;
    }

    :host([view="icon"]:not([mobile])) .icon-layer {
        max-width: 48px;
        opacity: 1;
    }

    :host([view="icon"]:not([mobile])) .bar-layer {
        max-width: 0;
        opacity: 0;
    }

    /* === Mobile === */

    :host([mobile]) panel-chevron {
        display: none;
    }

    :host([mobile]) .icon-layer {
        display: none;
    }

    :host([mobile]) .surface {
        width: 100%;
        box-sizing: border-box;
        background-color: var(--in-game-background-color);
        padding: 4px;
    }

    :host([mobile]) .bar-layer {
        width: 100%;
    }

    :host([mobile]) .buttons-wrapper {
        width: 100%;
    }
    
    .notificationIndicator {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #E35656;
    }
`,Si=({item:t,id:e,contentItems:i})=>{let a=0;return i?.[e]?.forEach(t=>{a+=t.amount}),D`
      <span class="amount title-sm">
            <jackpot-animated-amount
                    class="amount title-sm"
                    .value=${a??0}
                    .suffix=${t.currencySymbol}
            ></jackpot-animated-amount>
        </span>
  `},Mi=t=>{const{item:e,id:i,contentItems:a,translations:n={},selectedCurrentId:o}=t;return 1!==e.joinedStatus||o?D`
              <span class="amount title-sm">
          ${Gt(e.prizePool,e.currencySymbol)}
        </span>
    `:D`
              <div class="flex position-wrapper">
          <span class="amount position-text title-sm">
            ${n.myPosition??"My Position"}
          </span>
                  <span class="amount position-number title-sm">
             : ${a?.[i]?.position||"-"}
          </span>
              </div>
    `},ji=o`
    :host {
        display: flex;
        flex: 1 1 0;
        min-width: 0;
    }

    :host(:not([mobile])) {
        flex: 0 0 auto;
    }

    .button-wrapper {
        width: 100%;
        overflow: hidden;
        justify-content: space-between;
        gap: 4px;
        cursor: pointer;
        padding: 4px 4px 4px 8px;
        box-sizing: border-box;
        background-color: var(--in-game-collapsed-widget-surface-color);
        border-radius: var(--border-radius-md);
    }

    :host(:not([mobile])) .button-wrapper {
        height: 42px;
    }

    .img-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        flex-shrink: 0;
    }

    .img {
        width: 100%;
        height: 100%;
    }

    .collapsible {
        display: flex;
        min-width: 0;
    }

    .collapsible-inner {
        overflow: hidden;
        min-width: 0;
    }

    :host(:not([mobile])) .collapsible-inner {
        width: 104px;
        max-width: 104px;
        opacity: 1;
    }

    :host([mobile]) .collapsible {
        flex: 1 1 0;
    }

    :host([mobile]) .collapsible-inner {
        flex: 1 1 0;
        width: 100%;
    }

    .ticker-strip {
        width: 100%;
        min-width: 0;
        overflow: hidden;
        min-height: 32px;
    }

    :host([mobile]) .ticker-strip {
        min-height: 30px;
    }

    .ticker {
        width: 100%;
        will-change: transform;
    }

    .ticker-row {
        width: 100%;
    }

    .name-amount-wrapper {
        width: 100%;
        min-width: 0;
        gap: 2px;
    }

    .name {
        width: 100%;
        color: var(--in-game-secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }

    .amount {
        font-weight: 600;
        color: var(--in-game-amount-color);
    }

    .tab-icon-wrapper {
        flex-shrink: 0;
    }

    .position-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-width: 0;
    }

    .position-text {
        flex: 0 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .position-number {
        flex: 0 0 auto;
        white-space: nowrap;
    }


    :host([mobile]) .button-wrapper {
        height: 36px;
        padding: 2px 4px 2px 8px;
        border-radius: var(--border-radius-xs);
    }
`,Ei=D`
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
                d="M10.452 14.8225L14.8083 10.596C15.0582 10.3509 15.0665 9.95362 14.8333 9.70004C14.5918 9.44645 14.2003 9.438 13.9504 9.67468L10.0105 13.4869L6.07068 9.67468C5.82079 9.42954 5.42931 9.44645 5.18775 9.70004C4.9462 9.95362 4.96286 10.3594 5.21274 10.596L9.58573 14.8225C9.70234 14.9408 9.8606 15 10.0189 15C10.1771 15 10.3271 14.9408 10.452 14.8225Z"
                fill="var(--in-game-text-color)"/>
        <path
                d="M10.452 9.82249L14.8083 5.59604C15.0582 5.35091 15.0665 4.95362 14.8333 4.70004C14.5918 4.44645 14.2003 4.438 13.9504 4.67468L10.0105 8.48693L6.07068 4.67468C5.82079 4.42954 5.42931 4.44645 5.18775 4.70004C4.9462 4.95362 4.96286 5.35936 5.21274 5.59604L9.58573 9.82249C9.70234 9.94083 9.8606 10 10.0189 10C10.1771 10 10.3271 9.94083 10.452 9.82249Z"
                fill="var(--in-game-secondary-text-color)"/>
    </svg>
`,Pi=D`
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
                d="M9.548 5.17751L5.19167 9.40396C4.94179 9.64909 4.93346 10.0464 5.16668 10.3C5.40824 10.5536 5.79973 10.562 6.04961 10.3253L9.98947 6.51307L13.9293 10.3253C14.1792 10.5705 14.5707 10.5536 14.8123 10.3C15.0538 10.0464 15.0371 9.64064 14.7873 9.40396L10.4143 5.17751C10.2977 5.05917 10.1394 5 9.98114 5C9.82288 5 9.67295 5.05917 9.548 5.17751Z"
                fill="var(--in-game-secondary-text-color)"/>
        <path
                d="M9.548 10.1775L5.19167 14.404C4.94179 14.6491 4.93346 15.0464 5.16668 15.3C5.40824 15.5536 5.79973 15.562 6.04961 15.3253L9.98947 11.5131L13.9293 15.3253C14.1792 15.5705 14.5707 15.5536 14.8123 15.3C15.0538 15.0464 15.0371 14.6406 14.7873 14.404L10.4143 10.1775C10.2977 10.0592 10.1394 10 9.98114 10C9.82288 10 9.67295 10.0592 9.548 10.1775Z"
                fill="var(--in-game-text-color)"/>
    </svg>
`,Ui=D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.62254 8C7.62254 7.87339 7.66963 7.75345 7.76382 7.65349L11.1277 4.1551C11.3228 3.95519 11.639 3.94853 11.8408 4.13511C12.0426 4.32835 12.0493 4.64154 11.861 4.84145L8.82679 7.99334L11.861 11.1452C12.0561 11.3451 12.0426 11.6583 11.8408 11.8516C11.639 12.0448 11.316 12.0315 11.1277 11.8316L7.76382 8.33318C7.66963 8.23989 7.62254 8.11328 7.62254 7.98667V8ZM3.80795 8.35983L7.17178 11.8449C7.36689 12.0448 7.68309 12.0515 7.88492 11.8649C8.08675 11.6716 8.09348 11.3585 7.9051 11.1585L4.87092 8.00666L7.9051 4.85478C8.1002 4.65487 8.08675 4.34168 7.88492 4.14844C7.68309 3.95519 7.36016 3.96852 7.17178 4.16843L3.80795 7.66682C3.71376 7.76011 3.66667 7.88672 3.66667 8.01333C3.66667 8.13994 3.71376 8.25988 3.80795 8.35983Z" fill="var(--in-game-secondary-text-color)" />
    </svg>
`,Bi=D`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.37746 8C8.37746 8.12661 8.33037 8.24655 8.23618 8.34651L4.87234 11.8449C4.67724 12.0448 4.36104 12.0515 4.15921 11.8649C3.95738 11.6716 3.95065 11.3585 4.13903 11.1585L7.17321 8.00666L4.13903 4.85478C3.94392 4.65487 3.95738 4.34168 4.15921 4.14844C4.36104 3.95519 4.68397 3.96852 4.87234 4.16843L8.23618 7.66682C8.33037 7.76011 8.37746 7.88672 8.37746 8.01333L8.37746 8ZM12.1921 7.64017L8.82822 4.1551C8.63311 3.95519 8.31691 3.94853 8.11508 4.13511C7.91325 4.32835 7.90652 4.64154 8.0949 4.84145L11.1291 7.99334L8.0949 11.1452C7.8998 11.3451 7.91325 11.6583 8.11508 11.8516C8.31691 12.0448 8.63984 12.0315 8.82822 11.8316L12.1921 8.33318C12.2862 8.23989 12.3333 8.11328 12.3333 7.98667C12.3333 7.86006 12.2862 7.74012 12.1921 7.64017Z" fill="var(--in-game-secondary-text-color)" />
    </svg>
`,Fi=class{constructor(t,e){this.host=t,this._getRowElement=e,this.index=0,this.animating=!1,this.rowHeight=0,this._length=0,this._timer=0,this._snap=0,this._paused=!1,t.addController(this)}get currentIndex(){return this.index<this._length?this.index:0}get style(){return`transform: translateY(-${this.index*this.rowHeight}px);transition: ${this.animating?"transform 550ms cubic-bezier(.55,.05,.25,1)":"none"};`}reset(t){this._destroy(),this._length=t,this.index=0,this.animating=!1,this._run()}goTo(t){t<0||t>=this._length||t===this.index||(this._destroy(),this.animating=!1,this.index=t,this.host.requestUpdate(),this._run())}pause(){this._paused||(this._paused=!0,clearInterval(this._timer),this._timer=0)}resume(){this._paused&&(this._paused=!1,this._run())}hostConnected(){this._run()}hostDisconnected(){this._destroy()}hostUpdated(){const t=this._getRowElement()?.offsetHeight||0;t&&t!==this.rowHeight&&(this.rowHeight=t,this.host.requestUpdate())}_run(){this._paused||this._length>1&&!this._timer&&(this._timer=setInterval(()=>this._next(),1e4))}_destroy(){clearInterval(this._timer),this._timer=0,clearTimeout(this._snap),this._snap=0}_next(){this.animating=!0,this.index++,this.index===this._length||this.index,this.index===this._length&&(this._snap=setTimeout(()=>{this.animating=!1,this.index=0,this.host.requestUpdate()},580)),this.host.requestUpdate()}},Ni=class extends mt{static properties={isOpen:{type:Boolean},mobile:{type:Boolean},TabIcon:{attribute:!1},tabName:{type:String},items:{attribute:!1},onTabClick:{attribute:!1},paused:{type:Boolean},renderContent:{attribute:!1},selectedCurrentId:{type:String},contentItems:{attribute:!1},translations:{attribute:!1}};static elementStyles=ji;constructor(){super(),this.isOpen=!1,this.mobile=!1,this.tabName="",this.items=[],this.onTabClick=()=>{},this.paused=!1,this.renderContent=null,this.selectedCurrentId=null,this.translations={},this._flip=new Fi(this,()=>this.renderRoot.querySelector(".ticker-row"))}_onVisibilityChange=()=>Yt(this._flip,this.selectedCurrentId,this.paused);connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibilityChange)}willUpdate(t){const{_flip:e,paused:i,items:a,selectedCurrentId:n}=this;if(t.has("items")&&e.reset(a?.length||0),t.has("paused")&&(i||n?e.pause():e.resume()),(t.has("selectedCurrentId")||t.has("items"))&&null!=n&&a?.length){const t=a.findIndex(t=>t.id===n);t>=0&&e.goTo(t)}}render(){const{onTabClick:t,tabName:e,mobile:i,isOpen:a,items:n,TabIcon:o,_flip:s,contentItems:r,renderContent:l,selectedCurrentId:c,translations:d}=this;if(!n?.length)return V;const h=n.length>1?[...n,n[0]]:n;return D`
        <div class="button-wrapper flex align-center"
             @click=${()=>t(e,!1,n[s.currentIndex]?.id)}>
            <div class="img-wrapper">
                <img alt="#" draggable="false" class="img" src=${o}/>
            </div>

            <div class="collapsible">
                <div class="collapsible-inner">
                    <div class="ticker-strip" style="height:${s.rowHeight||0}px">
                        <div class="ticker" style=${s.style}>
                            ${ee(h,(t,e)=>`${t.id}-${e}`,t=>{const{name:e,prizePool:i,amountSymbol:a}=t;return D`
                                            <div class="ticker-row flex align-center"
                                            >
                                                <div class="flex name-amount-wrapper align-center direction-column">
                                                    <span class="name caption-xs">${e}</span>

                                                    ${l?l({item:t,id:t.id,contentItems:r,selectedCurrentId:c,translations:d}):D`
                                                                <span class="amount title-sm">
                                          ${Gt(i,a)}
                                        </span>
                                                            `}
                                                </div>
                                            </div>
                                        `})}
                        </div>
                    </div>
                </div>
            </div>

            <div class="tab-icon-wrapper">
                ${i?a?D`${Ei}`:D`${Pi}`:V}
            </div>
        </div>
    `}};customElements.define("tab-button",Ni);var Zi=o`
    :host {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        overflow: hidden;
    }

    .chevron {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 100%;
        box-sizing: border-box;
        cursor: pointer;
        flex-shrink: 0;
    }

    .chevron svg {
        display: block;
        width: 20px;
        height: 20px;
        margin: 0 auto;
    }
`;customElements.define("panel-chevron",class extends mt{static properties={view:{type:String,reflect:!0},onToggle:{attribute:!1}};static elementStyles=Zi;constructor(){super(),this.view=ft,this.onToggle=()=>{}}_onClick=t=>{t.stopPropagation(),this.onToggle()};render(){const t=this.view===ft;return D`
        <div class="chevron"
             title=${t?"Expand":"Collapse"}
             @click=${this._onClick}>
            ${t?Ui:Bi}
        </div>
    `}});var Hi=o`
    :host {
        display: flex;
    }

    .flip-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        box-sizing: border-box;
        cursor: pointer;
        overflow: hidden;
        background-color: var(--in-game-collapsed-widget-surface-color);
        border-radius: var(--border-radius-md);
    }

    .flip-strip {
        width: 100%;
        min-height: 42px;
        overflow: hidden;
    }

    .flip {
        width: 100%;
        will-change: transform;
    }

    .flip-row {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 42px;
    }

    .flip-img {
        width: 32px;
        height: 32px;
    }
`,zi=class extends mt{static properties={items:{attribute:!1},onSelect:{attribute:!1},paused:{type:Boolean}};static elementStyles=Hi;constructor(){super(),this.items=[],this.onSelect=()=>{},this.paused=!1,this._flip=new Fi(this,()=>this.renderRoot.querySelector(".flip-row"))}_onVisibilityChange=()=>Yt(this._flip,null,this.paused);connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibilityChange)}willUpdate(t){t.has("items")&&t.get("items")?.length!==this.items.length&&this._flip.reset(this.items?.length||0),t.has("paused")&&(this.paused?this._flip.pause():this._flip.resume())}_onClick=()=>{const t=this.items[this._flip.currentIndex];t&&this.onSelect(t.tab,t.id)};render(){const{items:t,_flip:e}=this;return t?.length?D`
        <div class="flip-icon" @click=${this._onClick}>
            <div class="flip-strip" style="height:${e.rowHeight||0}px">
                <div class="flip" style=${e.style}>
                    ${ee(t,(t,e)=>`${t.tab}-${e}`,t=>D`
                                <div class="flip-row flex align-center justify-center">
                                    <img alt="#" draggable="false" class="flip-img" src=${t.icon}/>
                                </div>
                            `)}
                </div>
            </div>
        </div>
    `:V}};customElements.define("flip-icon",zi);var Ri=o`
    :host {
        all: initial;
        display: inline-block;
        contain: layout paint;
        width: 100%;
        height: 100%;
    }

    .wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: var(--in-game-expanded-widget-surface-color);
        border-radius: var(--border-radius-lg);
        height: 100%;
        width: 100%;
    }

    :host([mobile]) .wrapper {
        padding: 4px;
        gap: 4px;
    }

    .circle {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    :host([mobile]) .circle {
        width: 32px;
        height: 32px;
    }

    .lines {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 110px;
        flex: 1;
    }

    :host([mobile]) .lines {
        gap: 4px;
        min-width: 90px;
    }

    .line {
        height: 10px;
        border-radius: 4px;
        width: 100%;
    }

    :host([mobile]) .line {
        height: 8px;
    }

    .circle, .line {
        background: linear-gradient(
                90deg,
                var(--skeleton-base, rgba(255, 255, 255, 0.06)) 25%,
                var(--skeleton-highlight, rgba(255, 255, 255, 0.16)) 37%,
                var(--skeleton-base, rgba(255, 255, 255, 0.06)) 63%
        );
        background-size: 400% 100%;
        animation: shimmer 1.6s linear infinite;
        will-change: background-position;
    }

    @keyframes shimmer {
        0% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0 50%;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .circle, .line {
            animation: none;
        }
    }
`,Oi=class extends mt{static properties={icon:{type:Boolean,reflect:!0},lines:{type:Number},mobile:{type:Boolean,reflect:!0}};static elementStyles=Ri;constructor(){super(),this.icon=!1,this.lines=2,this.mobile=!1,this._lineNodes=[]}willUpdate(t){if(t.has("lines")){const t=Math.max(0,0|this.lines),e=new Array(t);for(let i=0;i<t;i++)e[i]=D`<div class="line"></div>`;this._lineNodes=e}}render(){return D`
      <div class="wrapper" aria-hidden="true">
        ${this.icon?D`<div class="circle"></div>`:null}
        <div class="lines">${this._lineNodes}</div>
      </div>
    `}};customElements.define("skeleton-custom",Oi);var Di=o`
    :host {
        display: flex;
        position: relative;
        flex-shrink: 0;
    }
    .bell-button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 42px;
        cursor: pointer;
        color: var(--in-game-text-color);
        background-color: var(--in-game-collapsed-widget-surface-color);
        border-radius: var(--border-radius-md);
        box-sizing: border-box;
        flex-shrink: 0;
        gap: 4px;
    }
    :host([mobile]) .bell-button {
        width: 32px;
        height: 36px;
        border-radius: var(--border-radius-xs);
    }
    .badge {
        position: absolute;
        top: 4px;
        right: 4px;
        min-width: 12px;
        height: 12px;
        background-color: #E35656;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 1;
        box-sizing: border-box;
        pointer-events: none;
    }

    .notificationIndicator {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #E35656;
    }
`,Ji=class extends mt{static properties={mobile:{type:Boolean,reflect:!0},hasUnreadNotifications:{type:Boolean},onTabClick:{attribute:!1},isOpen:{type:Boolean}};static elementStyles=Di;constructor(){super(),this.mobile=!1,this.hasUnreadNotifications=!1,this.isOpen=!1,this.onTabClick=()=>{}}_onClick=()=>{this.onTabClick(bt,!1,null)};render(){const{hasUnreadNotifications:t}=this;return D`
      <div class="bell-button" @click=${this._onClick}>
        ${Lt}
        ${t?D`<div class="notificationIndicator" />`:V}
      </div>
    `}};customElements.define("notification-tab-button",Ji);var Vi=class extends mt{static properties={config:{type:Object},activeTab:{attribute:!1},mobile:{type:Boolean,reflect:!0},open:{type:Boolean,reflect:!0},view:{type:String,reflect:!0},jackpots:{attribute:!1},tournaments:{attribute:!1},jackpotLoading:{type:Boolean},jackpotAmountsLoading:{type:Boolean},tournamentLoading:{type:Boolean},onTabClick:{attribute:!1},onViewChange:{attribute:!1},jackpotsAmounts:{attribute:!1},selectedTournamentId:{attribute:!1},selectedJackpotId:{attribute:!1},tournamentsPositionAndScore:{attribute:!1},tournamentTranslations:{attribute:!1},tournamentIconUrl:{attribute:!1},jackpotIconUrl:{attribute:!1},showNotifications:{type:Boolean},hasUnreadNotifications:{type:Boolean}};static elementStyles=Ai;constructor(){super(),this.config=null,this.activeTab=null,this.tournamentIconUrl=null,this.jackpotIconUrl=null,this._drag=null,this.open=!1,this.mobile=!1,this.view=ft,this.onTabClick=()=>{},this.onViewChange=()=>{},this.jackpots=[],this.tournaments=[],this.jackpotLoading=!1,this.jackpotAmountsLoading=!1,this.tournamentLoading=!1,this.jackpotsAmounts={},this.tournamentsPositionAndScore={},this.tournamentTranslations={},this._flipItems=[],this.showNotifications=!1,this.hasUnreadNotifications=!1}_onFlipSelect=(t,e)=>this.onTabClick(t,!1,e);disconnectedCallback(){super.disconnectedCallback(),this._detachDrag()}firstUpdated(){this._initDrag()}willUpdate(){this._flipItems=(t=>{const{config:e,jackpots:i,tournaments:a,jackpotsAmounts:n,jackpotIconUrl:o,tournamentIconUrl:s}=t;if(!e)return[];const r=[];return e.showJackpots&&i.length&&Object.keys(n).length&&r.push({tab:gt,icon:o,id:i[0]?.id}),e.showTournaments&&a.length&&r.push({tab:Ct,icon:s,id:a[0]?.id}),r})(this)}updated(t){t.has("mobile")&&(this.mobile?this._detachDrag():this._initDrag())}_initDrag(){if(this.mobile||this._drag)return;const t=this.renderRoot.querySelector(".drag-handle");t&&(this._drag=new Ti(t,this.parentElement),this._drag.attach())}_detachDrag(){this._drag?.detach(),this._drag=null}render(){const t=this.config;if(!t)return V;const{mobile:e,jackpots:i,activeTab:a,open:n,tournaments:o,onTabClick:s,onViewChange:r,view:l,jackpotLoading:c,jackpotAmountsLoading:d,tournamentLoading:h,selectedTournamentId:p,selectedJackpotId:u,tournamentIconUrl:m,jackpotIconUrl:g,tournamentsPositionAndScore:C,tournamentTranslations:b,showNotifications:v,hasUnreadNotifications:f}=this,y=t.showJackpots&&i.length&&Object.keys(this.jackpotsAmounts).length,x=t.showTournaments&&o.length,w=!e&&"icon"===l,_=n||w;return D`
        <div class="tabs-root flex align-center">
            <div class="surface drag-handle flex align-center">
                ${e?V:D`
        <panel-chevron
                .view=${l}
                .onToggle=${()=>r(w?"minimized":ft)}>
        </panel-chevron>`}
                ${v&&w&&f?D`<div class="notificationIndicator" />`:V}

                <div class="icon-layer flex align-center">
                    <flip-icon
                            .items=${this._flipItems}
                            .onSelect=${this._onFlipSelect}
                            ?paused=${!w}>
                    </flip-icon>
                </div>

                <div class="bar-layer flex align-center">
                    <div class="buttons-wrapper flex align-center">
                        ${c||d?D`
                                    <skeleton-custom
                                            icon
                                            .lines=${2}
                                            ?mobile=${e}>
                                    </skeleton-custom>`:y?D`
                                    <tab-button
                                            tabName=${gt}
                                            ?mobile=${e}
                                            .TabIcon=${g}
                                            .items=${i}
                                            .onTabClick=${s}
                                            .isOpen=${a===gt}
                                            ?paused=${_}
                                            .selectedCurrentId=${u}
                                            .renderContent=${Si}
                                            .contentItems=${this.jackpotsAmounts}
                                    ></tab-button>`:V}


                        ${h?D`
                                    <skeleton-custom
                                            icon
                                            .lines=${2}
                                            ?mobile=${e}>
                                    </skeleton-custom>`:x?D`
                                    <tab-button
                                            tabName=${Ct}
                                            ?mobile=${e}
                                            .TabIcon=${m}
                                            .items=${o}
                                            .onTabClick=${s}
                                            .isOpen=${a===Ct}
                                            .contentItems=${C}
                                            .renderContent=${Mi}
                                            .selectedCurrentId=${p}
                                            .translations=${b}
                                            ?paused=${_}
                                    ></tab-button>`:V}
                        
                        ${v?D`
                                    <notification-tab-button
                                            ?mobile=${e}
                                            .hasUnreadNotifications=${f}
                                            .onTabClick=${s}
                                            .isOpen=${a===bt}
                                    ></notification-tab-button>`:V}
                    </div>
                </div>
            </div>
        </div>
    `}};customElements.define("tabs-wrapper",Vi);var Gi=()=>window.matchMedia("(orientation: landscape)").matches,Wi=(t,e,i)=>{Gi()&&i&&i(),"flex"===window.getComputedStyle(document.body).display&&(document.body.style.display="block");const a=document.getElementsByTagName("iframe");for(let n=0;n<a.length;n++){const i=a[n].id;let o=e[i];if(void 0===o){if(""!==a[n].style.height.trim())o=a[n].style.height.trim();else for(const t of document.styleSheets)try{for(const e of t.cssRules)e.selectorText===`#${i}`&&""!==e.style.height&&(o=e.style.height)}catch(ve){}o||(o=null!==a[n].getAttribute("height")?a[n].getAttribute("height"):window.getComputedStyle(a[n]).height),e[i]=o}o=isNaN(Number(`${o}`))?o:o+"px",a[n].style.height=`calc(${o} - ${t}px)`}},qi=t=>{t.sort((t,e)=>t.order-e.order)},Ki=class extends mt{static properties={config:{type:Object},jackpotTranslations:{type:Object},tournamentTranslations:{type:Object},notificationTranslations:{type:Object},mobile:{type:Boolean,reflect:!0},open:{type:Boolean,reflect:!0},expandedFrom:{state:!0},baseFetch:{attribute:!1},partnerId:{attribute:!1},providerId:{attribute:!1},playerCurrencyId:{attribute:!1},partnerIdentity:{attribute:!1},gameId:{attribute:!1},languageId:{attribute:!1},tournamentLoading:{state:!0},jackpotsAmounts:{state:!0},joinedTournamentIds:{state:!0},tournamentsPositionAndScore:{state:!0},activeTab:{state:!0},selectedJackpotId:{state:!0},selectedTournamentId:{state:!0},jackpots:{state:!0},tournaments:{state:!0},jackpotLoading:{state:!0},jackpotAmountsLoading:{state:!0},isChangedFrame:{state:!0},hasUnreadNotifications:{type:Boolean}};static elementStyles=ht;constructor({testPreview:t}){super(),this.config=null,this.jackpotTranslations={},this.isNotPreview=null==t,this.tournamentTranslations={},this.notificationTranslations={},this.mobile=!1,this.open=!1,this.expandedFrom=ft,this.activeTab=null,this.selectedJackpotId=null,this.selectedTournamentId=null,this.jackpots=[],this.tournaments=[],this.jackpotLoading=!0,this.jackpotAmountsLoading=!0,this.isChangedFrame=!1,this.tournamentLoading=!1,this.jackpotsAmounts={},this.baseFetch=null,this.partnerId=null,this.providerId=null,this.languageId=null,this.partnerIdentity=null,this.gameId=null,this.playerCurrencyId=null,this.joinedTournamentIds=[],this.tournamentsPositionAndScore={},this.jackpotManager=new pi(()=>this._getJackpotsAmounts(),vt),this.tournamentManager=new pi(()=>this._getTournamentPositionAndScore(),vt),this.notificationManager=new pi(()=>this._getHasUnreadNotifications(),vt),this.hasUnreadNotifications=!1,this.tempIframeHeights={}}_handleUnreadNotificationsCountFetching=()=>{this.config?.showNotifications&&"notifications"!==this.activeTab?this.notificationManager.isRunning||this.notificationManager.start():this.notificationManager.destroy()};async _getHasUnreadNotifications(){try{const t=await(async({baseFetch:t})=>t({method:"GET",url:"inGameWidget/CheckNewNotification"}))({baseFetch:this.baseFetch});!1===t?.hasError&&(this.hasUnreadNotifications=t.data?.hasNewNotification)}catch(ve){console.log("InGamePanel: _getHasUnreadNotifications failed",ve)}}_onVisibilityChange=()=>{const t="hidden"===document.visibilityState,{showJackpots:e,showTournaments:i}=this.config??{};if(t)return e&&this.jackpotManager.pause(),void(i&&this.tournamentManager.pause());e&&this.jackpotManager.resume(),i&&this.tournamentManager.resume()};_manageIframeClickBlocker=t=>{const e=document.getElementsByTagName("iframe");for(let i=0;i<e.length;i++)e[i].style.pointerEvents=t?"none":""};_resetHasUnreadNotifications=()=>{this.hasUnreadNotifications=!1};async connectedCallback(){super.connectedCallback(),null!==this.config?.deviceType?this.mobile=2===this.config.deviceType:this.hasAttribute("mobile")||(this.mobile=window.matchMedia("(max-width: 767px)").matches),document.addEventListener("click",this._onDocumentClick,!0),document.addEventListener("visibilitychange",this._onVisibilityChange),this.notificationManager.runImmediately();const{showJackpots:t,showTournaments:e}=this.config??{};if(!t&&!e)return this.jackpotLoading=!1,void(this.jackpotAmountsLoading=!1);t?this._initJackpotFlow():(this.jackpotLoading=!1,this.jackpotAmountsLoading=!1),e&&this._loadTournaments()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocumentClick,!0),document.removeEventListener("visibilitychange",this._onVisibilityChange),window.removeEventListener("resize",this._onDocumentResizeFrameHeight),this.jackpotManager.destroy(),this.tournamentManager.destroy(),this.notificationManager.destroy()}updated(t){(t.has("open")||t.has("activeTab"))&&this._handleUnreadNotificationsCountFetching()}async _initJackpotFlow(){await this._loadJackpots()?(this._getJackpotsAmounts(),this.jackpotManager.start()):this.jackpotAmountsLoading=!1}async _getJackpotsAmounts(){try{const t=await(async t=>{const{baseFetch:e,partnerId:i,partnerIdentity:a,playerCurrencyId:n,currentGameId:o,gameCategoryId:s,gameSubCategoryId:r,providerId:l}=t;return e({method:"POST",url:"inGameWidget/GetJackpotAmount",data:{partnerId:i,providerId:l,partnerIdentity:a,playerCurrencyId:n,currentGameId:o,gameCategoryId:s,gameSubCategoryId:r}})})({baseFetch:this.baseFetch,partnerId:this.partnerId,partnerIdentity:this.partnerIdentity,currentGameId:this.gameId,playerCurrencyId:this.playerCurrencyId,gameCategoryId:this.config.categoryId,gameSubCategoryId:this.config.subCategory,providerId:this.providerId});!1===t?.hasError&&(this.jackpotsAmounts=((t,e)=>{const i={};for(const a of t)i[a.groupId]=a.levels,!i[a.groupId]&&e[a.groupId]&&(i[a.groupId]=e[a.groupId]);return i})(t.data.amounts,this.jackpotsAmounts))}catch(ve){console.error("InGamePanel: _getJackpotsAmounts failed",ve)}this.jackpotAmountsLoading=!1,this.jackpots.length&&Object.keys(this.jackpotsAmounts).length||this.jackpotManager.destroy()}async _loadJackpots(){try{const t=this.config.categoryId,e=this.config.subCategory,i=await(async t=>{const{baseFetch:e,partnerIdentity:i,playerCurrencyId:a,gameId:n,providerId:o,gameCategoryId:s,gameSubCategoryId:r}=t;return e({method:"GET",url:`inGameWidget/gmc/GetJackpotInfo/${i}/${a}/${o}/${n}/${s}/${r}`,hasLanguageIdInPath:!0})})({baseFetch:this.baseFetch,partnerIdentity:this.partnerIdentity,playerCurrencyId:this.playerCurrencyId,gameId:this.gameId,providerId:this.providerId,gameCategoryId:t,gameSubCategoryId:e});if(!1===i?.hasError){if(!1===i.data.isPartnerHasInGameJackpot)return this.jackpotManager.destroy(),this.jackpotLoading=!1,!1;const t=i?.data?.currencySymbol??null,e=i?.data?.jackpots||[];return this.jackpots=e.map(e=>({...e,currencySymbol:e?.currencySymbol??t})),this.jackpotLoading=!1,!0}return this.jackpotManager.destroy(),this.jackpotLoading=!1,!1}catch(ve){return console.error("InGamePanel: _loadJackpots failed",ve),this.jackpotManager.destroy(),this.jackpotLoading=!1,!1}}async _loadTournaments(){this.tournamentLoading=!0;try{const t=await(async t=>{const{baseFetch:e,partnerIdentity:i,gameId:a,providerId:n,categoryId:o,subCategory:s,playerCurrencyId:r}=t;return e({method:"GET",url:`inGameWidget/gmc/getPublicTournamentExpandedList/${i}/${n}/${a}/${o}/${s}/${r}`,hasLanguageIdInPath:!0})})({baseFetch:this.baseFetch,partnerIdentity:this.partnerIdentity,gameId:this.gameId,providerId:this.providerId,categoryId:this.config.categoryId,subCategory:this.config.subCategory,playerCurrencyId:this.playerCurrencyId});if(!1!==t?.hasError||!t.data.isPartnerHasInGameTournament)return this.tournamentManager.destroy(),this.tournaments=[],void(this.tournamentLoading=!1);let e=t.data.tournaments??[];const i=await(async(t,e,i,a,n)=>t({method:"GET",url:`inGameWidget/getPrivateTournamentExpandedList/${i}/${e}/${a}/${n}`}))(this.baseFetch,this.gameId,this.providerId,this.config.categoryId,this.config.subCategory);if(!1===i?.hasError){const{playerJoinedTournamentIds:t,tournaments:a}=i.data;this.joinedTournamentIds=t,e=(({joinedIds:t,privateTournaments:e,tournaments:i})=>{const a=new Set(t),n=i.length,o=[...i,...e],s=[],r=[],l={3:1,2:2,4:3};for(let c=0;c<o.length;c++){const t=a.has(o[c].id),e=o[c].status,i={...o[c],joinedStatus:t?1:2,order:l[e]??4};c>=n&&(i.isPrivate=!0),(t?s:r).push(i)}return qi(s),qi(r),[...s,...r]})({joinedIds:t,privateTournaments:a,tournaments:e}),t.length&&await this._getTournamentPositionAndScore(),e.length&&this.tournamentManager.start()}this.tournaments=e}catch(ve){console.error("InGamePanel: _loadTournaments failed",ve)}this.tournamentLoading=!1}async _getTournamentPositionAndScore(){try{const e=await(t=this.baseFetch,t({method:"GET",url:"inGameWidget/getPlayerJoinedTournamentsInfo"}));!1===e?.hasError&&(this.tournamentsPositionAndScore=(t=>{const e={};for(const i of t)e[i.id]={position:i.position,score:i.score};return e})(e.data))}catch(ve){console.error("InGamePanel: _getTournamentPositionAndScore failed",ve)}var t}_onChangeJoinedStatus=t=>{this.joinedTournamentIds=[...this.joinedTournamentIds,t],this.tournaments=((t,e)=>t.map(t=>t.id===e?{...t,joinedStatus:1}:t))(this.tournaments,t)};_onDocumentClick=t=>{this.mobile&&this.open&&!this.contains(t.target)&&this._onSidebarClose()};_onDocumentResizeFrameHeight=()=>{Wi(44,this.tempIframeHeights,this._onSidebarClose)};_setExpandedFrom=t=>{this.mobile||(this.expandedFrom=t)};_onTabClick=(t,e,i)=>{this.isNotPreview&&this.mobile&&Gi()||this.activeTab===t&&!e?this._onSidebarClose():(this.mobile&&this._manageIframeClickBlocker(!0),this.activeTab=t,this.open=!0,"jackpots"===t?(this.selectedJackpotId=i||this.jackpots[0]?.id,this.config?.showJackpots&&!this.jackpotManager.isRunning&&this.jackpotManager.start(),this.mobile||this.tournamentManager.destroy()):"tournaments"===t&&(this.selectedTournamentId=i,this.tournamentManager.destroy(),this.mobile||this.jackpotManager.destroy()))};_onSidebarClose=async()=>{this._manageIframeClickBlocker(!1),this.activeTab=null,this.open=!1,this.selectedJackpotId=null,this.selectedTournamentId=null;const{showJackpots:t,showTournaments:e}=this.config??{};try{e&&this.tournaments.length&&(await this._getTournamentPositionAndScore(),this.tournamentManager.start()),t&&this.jackpotManager.start()}catch(ve){console.error("InGamePanel: _onSidebarClose failed",ve)}};onSelectedJackpotOrTournamentIdChange=(t,e)=>{this[t]=e};willUpdate(t){if(!1===this.isChangedFrame&&(t.has("jackpots")||t.has("tournaments"))&&(this.jackpots.length>0||this.tournaments.length>0)){const{showJackpots:t,showTournaments:e}=this.config??{};(t||e)&&this.mobile&&(this.isChangedFrame=!0,Wi(44,this.tempIframeHeights,this._onSidebarClose),window.addEventListener("resize",this._onDocumentResizeFrameHeight))}}render(){const t=this.jackpots.length>0&&Object.keys(this.jackpotsAmounts).length>0,e=this.tournaments.length>0,i=this.config?.showNotifications;if(!this.config||!t&&!e&&!i)return V;const{config:a,activeTab:n,open:o,mobile:s,selectedJackpotId:r,selectedTournamentId:l,_onSidebarClose:c,_onTabClick:d,jackpots:h,tournaments:p,jackpotLoading:u,jackpotAmountsLoading:m,tournamentLoading:g,jackpotsAmounts:C,onSelectedJackpotOrTournamentIdChange:b,baseFetch:v,_onChangeJoinedStatus:f,partnerIdentity:y,gameId:x,providerId:w,tournamentsPositionAndScore:_,tournamentManager:$,_getTournamentPositionAndScore:k,jackpotTranslations:I,tournamentTranslations:L,notificationTranslations:T,hasUnreadNotifications:A,playerCurrencyId:S,languageId:M,_setExpandedFrom:j,expandedFrom:E}=this;return D`
        <div class="panel">
            <sidebar-wrapper
                    .activeTab=${n}
                    ?open=${o}
                    ?mobile=${s}
                    .onSelectedJackpotOrTournamentIdChange=${b}
                    .onClose=${c}
                    .onTabClick=${d}
                    .jackpotGameThumbnailType=${a.jackpotGameThumbnailType}
                    .tournamentGameThumbnailType=${a.tournamentGameThumbnailType}
                    .tournamentsPanelList=${p}
                    .tournamentRedirectionUrl=${a.redirectionUrl}
                    .jackpots=${h}
                    .jackpotsAmounts=${C}
                    .selectedJackpotId=${r}
                    .selectedTournamentId=${l}
                    .tournamentsPositionAndScore=${_}
                    .baseFetch=${v}
                    .languageId=${M}
                    .partnerIdentity=${y}
                    .gameId=${x}
                    .categoryId=${a.categoryId}
                    .subCategory=${a.subCategory}
                    .providerId=${w}
                    ._onChangeJoinedStatus=${f}
                    .tournamentManager=${$}
                    ._getTournamentPositionAndScore=${k}
                    .jackpotTranslations=${I}
                    .tournamentTranslations=${L}
                    .playerCurrencyId=${S}
                    .tournamentIconUrl=${a.tournamentIconUrl}
                    .jackpotIconUrl=${a.jackpotIconUrl}
                    .showNotifications=${i}
                    .notificationTranslations=${T}
                    .hasUnreadNotifications=${A}
                    .onResetHasUnreadNotifications=${this._resetHasUnreadNotifications}
            ></sidebar-wrapper>

            <tabs-wrapper
                    .config=${a}
                    .activeTab=${n}
                    ?open=${o}
                    ?mobile=${s}
                    .view=${E}
                    .onTabClick=${d}
                    .onViewChange=${j}
                    .jackpots=${h}
                    .tournaments=${p}
                    .jackpotLoading=${u}
                    .jackpotAmountsLoading=${m}
                    .tournamentLoading=${g}
                    .jackpotsAmounts=${C}
                    .tournamentsPositionAndScore=${_}
                    .selectedJackpotId=${r}
                    .selectedTournamentId=${l}
                    .tournamentTranslations=${L}
                    .tournamentIconUrl=${a.tournamentIconUrl}
                    .jackpotIconUrl=${a.jackpotIconUrl}
                    .showNotifications=${i}
                    .hasUnreadNotifications=${A}
            ></tabs-wrapper>
        </div>
    `}};customElements.define("in-game-panel",Ki);var Yi={"primary-color":"--in-game-primary-color","background-color":"--in-game-background-color","collapsed-widget-surface-color":"--in-game-collapsed-widget-surface-color","expanded-widget-surface-color":"--in-game-expanded-widget-surface-color","text-color":"--in-game-text-color","button-text-color":"--in-game-button-text-color","amount-color":"--in-game-amount-color","secondary-text-color":"--in-game-secondary-text-color","border-color":"--in-game-border-color"},Xi={"positive-state-color":"--in-game-positive-state-color","info-state-color":"--in-game-info-state-color","negative-state-color":"--in-game-negative-state-color","inactive-state-color":"--in-game-inactive-state-color"},Qi={showJackpots:!1,jackpotSet:null,jackpotIconUrl:null,jackpotGameThumbnailType:2,tournamentGameThumbnailType:2,showTournaments:!1,suggestTournamentFromGame:!1,tournamentRedirectionUrl:null,tournamentIconUrl:null,themeType:1,options:null,deviceType:null,showNotifications:!1,inGameWidgetTranslations:[]},ta=[{themeType:1,colors:[{property:"primary-color",value:"#46FDAB"},{property:"background-color",value:"#FFFFFF"},{property:"collapsed-widget-surface-color",value:"#EFEFEF"},{property:"expanded-widget-surface-color",value:"#EFEFEF"},{property:"text-color",value:"#15141A"},{property:"button-text-color",value:"#000000"},{property:"amount-color",value:"#15141A"}],additionalColors:[{property:"positive-state-color",value:"#46FDAB"},{property:"info-state-color",value:"#FF914D"},{property:"negative-state-color",value:"#707070"},{property:"inactive-state-color",value:"#F13232"}]}],ea=[{themeType:2,colors:[{property:"primary-color",value:"#46FDAB"},{property:"background-color",value:"#22232B"},{property:"collapsed-widget-surface-color",value:"#2B2D38"},{property:"expanded-widget-surface-color",value:"#2B2D38"},{property:"text-color",value:"#FFFFFF"},{property:"button-text-color",value:"#000000"},{property:"amount-color",value:"#FFFFFF"}],additionalColors:[{property:"positive-state-color",value:"#46FDAB"},{property:"info-state-color",value:"#FF914D"},{property:"negative-state-color",value:"#707070"},{property:"inactive-state-color",value:"#F13232"}]}],ia=class{#i=null;constructor({panel:t}){this.#i=t}setColorsWithType(t,e){const i=(t=>void 0===t||1===t?ta:ea)(e),a=t?.length?t:i;if(a?.length){const t=a.find(t=>t.type===e)??a[0];t?.colors?.length&&t.colors.forEach(t=>{"text-color"===t.property&&(Wt({host:this.#i,variableName:"--in-game-secondary-text-color",color:t,percentage:60}),Wt({host:this.#i,variableName:"--in-game-border-color",color:t,percentage:10}));const e=Yi[t.property];this.#i.style.setProperty(e,t.value)}),(t?.additionalColors?.length?t?.additionalColors:i[0]?.additionalColors??[]).forEach(t=>{const e=Xi[t.property];this.#i.style.setProperty(e,t.value)})}}},aa=class{#a=null;#i=null;#n=Qi;constructor(t){this.#i=t}setConfig(t){this.#a={...this.#n,...t}}getConfig(){return this.#a??{...this.#n}}get(t){return this.#a?.[t]??this.#n[t]}},na=class{#i=null;#o=null;#s=[];constructor(t,e,i){this.#i=t,this.#o=e,this.#s=i??[]}async setTranslations(t){if(this.#i)try{if(this.#s){const t={};for(const e of this.#s)t[e.TranslationId]=e.Text;this.#i.notificationTranslations=t}const e=await(async(t,e)=>t({method:"GET",url:`inGameWidget/gmc/Translations/${e}`,hasLanguageIdInPath:!0}))(t,this.#o);if(!1===e?.hasError){const{jackpotTranslations:t=[],tournamentTranslations:i=[]}=e.data,a={};for(const e of t)a[e.translationKey]=e.text;const n={};for(const e of i)n[e.translationKey]=e.text;this.#i.jackpotTranslations=a,this.#i.tournamentTranslations=n}else console.error("TranslationManager: failed to load translations")}catch(ve){console.error("TranslationManager: unexpected error",ve)}else console.error("Translations: InGamePanel not found.")}},oa=["selector","token"],sa=class{#r=null;#l=null;#c=null;constructor(t,e,i){this.#r=t,this.#l=`${e}`.toLowerCase(),i&&(this.#c=i)}clearToken(){this.#r=null}baseFetch=t=>{let{url:e}=t;const{method:i,data:a={},signal:n=null,hasLanguageIdInPath:o=!1,hasLanguageIdInBody:s=!1}=t;return s&&(a.LanguageId=this.#l),o&&(e+=`/${this.#l}`),this.#c?(console.log(e),Promise.resolve(this.#c[e]??{})):fetch(`https://rl-gamification-widget-api.provdigi.net/${e}`,{method:i,signal:n,cache:"no-cache",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.#r}`,LanguageId:this.#l},..."GET"!==i&&{body:JSON.stringify(a)}}).then(async t=>{if([200,400].includes(t.status))return t.json();throw new Error(t.statusText)}).catch(t=>{if(String(t).includes("AbortError"))return console.log("Request was cancelled")})}};"undefined"!=typeof window&&(window.InitManager=class{#d=null;#h=null;#p=null;#u=null;#m=null;#g=null;#a=null;#C=null;#r=null;#b=null;#l="en";#v=null;#o=null;#f=null;#y=null;#x=null;#c=null;constructor(t){try{const{token:e,selector:i,partnerId:a,partnerIdentity:n,gameId:o,playerCurrencyId:s,providerId:r,testPreviewData:l,...c}=t,{widgetColors:d,themeType:h,languageId:p,...u}=c.widgetSettings;this.#r=e,this.#d=i,this.#v=a,this.#o=n,this.#f=o,this.#g=d,this.#a=u,this.#C=h,this.#l=p,this.#y=r,this.#x=s,this.#c=l}catch(ve){console.error("InitManager: invalid config",ve)}}checkRequiredFieldsBeforeInit(t){const e=[];if(oa.forEach(i=>{t[i]||e.push(i)}),e.length>0)throw new Error(`InitManager: missing required field(s): ${e.join(", ")}`)}loadPanel(){if(this.#h)return void console.log("InitManager: panel is already loaded.");try{this.checkRequiredFieldsBeforeInit({selector:this.#d,token:this.#r})}catch(ve){return void console.log(ve.message)}const t=async()=>{const t=document.querySelector(this.#d);if(t)try{this.#h=new Ki({testPreview:this.#c}),this.#h.providerId=this.#y,this.#h.partnerId=this.#v,this.#h.gameId=this.#f,this.#h.partnerIdentity=this.#o,this.#h.playerCurrencyId=this.#x,this.#h.languageId=this.#l,this.#b=new sa(this.#r,this.#l,this.#c),this.#h.baseFetch=this.#b.baseFetch,this.#p=new ia({panel:this.#h}),this.#p.setColorsWithType(this.#g,this.#C),this.#u=new aa(this.#h),this.#u.setConfig(this.#a),this.#h.config=this.#u.getConfig();const{showJackpots:e,showTournaments:i,inGameWidgetTranslations:a}=this.#h.config;if(!e&&!i)return console.log("InitManager: both showJackpots and showTournaments are false, panel not mounted."),void(this.#h=null);console.log("config",this.#h.config),this.#m=new na(this.#h,this.#o,a),await this.#m.setTranslations(this.#b.baseFetch),t.appendChild(this.#h),console.log("InitManager: panel loaded.")}catch(ve){console.log("InitManager: failed to create panel",ve)}else console.log(`InitManager: selector "${this.#d}" not found.`)};"loading"===document.readyState?document.addEventListener("DOMContentLoaded",t,{once:!0}):t()}setTheme(t){this.#p.setColorsWithType(this.#g,t)}removePanel(){this.#h?(this.#h.remove(),this.#h=null,this.#p=null,this.#u=null,this.#m=null,this.#b?.clearToken(),this.#b=null,this.#r=null,console.log("InitManager: panel removed.")):console.log("InitManager: no panel to remove.")}})}();