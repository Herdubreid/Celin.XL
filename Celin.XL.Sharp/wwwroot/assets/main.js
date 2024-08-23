!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).lib={})}(this,(function(e){"use strict";var t;!function(e){const t=[],n="__jsObjectId",o="__dotNetObject",r="__byte[]",s="__dotNetStream",i="__jsStreamReferenceLength";let a,c;class l{constructor(e){this._jsObject=e,this._cachedFunctions=new Map}findFunction(e){const t=this._cachedFunctions.get(e);if(t)return t;let n,o=this._jsObject;if(e.split(".").forEach((t=>{if(!(t in o))throw new Error(`Could not find '${e}' ('${t}' was undefined).`);n=o,o=o[t]})),o instanceof Function)return o=o.bind(n),this._cachedFunctions.set(e,o),o;throw new Error(`The value '${e}' is not a function.`)}getWrappedObject(){return this._jsObject}}const d=0,h={[d]:new l(window)};h[0]._cachedFunctions.set("import",(e=>("string"==typeof e&&e.startsWith("./")&&(e=new URL(e.substr(2),document.baseURI).toString()),import(e))));let u,f=1;function y(e){t.push(e)}function p(e){if(e&&"object"==typeof e){h[f]=new l(e);const t={[n]:f};return f++,t}throw new Error(`Cannot create a JSObjectReference from the value '${e}'.`)}function g(e){let t=-1;if(e instanceof ArrayBuffer&&(e=new Uint8Array(e)),e instanceof Blob)t=e.size;else{if(!(e.buffer instanceof ArrayBuffer))throw new Error("Supplied value is not a typed array or blob.");if(void 0===e.byteLength)throw new Error(`Cannot create a JSStreamReference from the value '${e}' as it doesn't have a byteLength.`);t=e.byteLength}const o={[i]:t};try{const t=p(e);o[n]=t[n]}catch(t){throw new Error(`Cannot create a JSStreamReference from the value '${e}'.`)}return o}function m(e,n){c=e;const o=n?JSON.parse(n,((e,n)=>t.reduce(((t,n)=>n(e,t)),n))):null;return c=void 0,o}function v(){if(void 0===a)throw new Error("No call dispatcher has been set.");if(null===a)throw new Error("There are multiple .NET runtimes present, so a default dispatcher could not be resolved. Use DotNetObject to invoke .NET instance methods.");return a}e.attachDispatcher=function(e){const t=new w(e);return void 0===a?a=t:a&&(a=null),t},e.attachReviver=y,e.invokeMethod=function(e,t,...n){return v().invokeDotNetStaticMethod(e,t,...n)},e.invokeMethodAsync=function(e,t,...n){return v().invokeDotNetStaticMethodAsync(e,t,...n)},e.createJSObjectReference=p,e.createJSStreamReference=g,e.disposeJSObjectReference=function(e){const t=e&&e[n];"number"==typeof t&&D(t)},function(e){e[e.Default=0]="Default",e[e.JSObjectReference=1]="JSObjectReference",e[e.JSStreamReference=2]="JSStreamReference",e[e.JSVoidResult=3]="JSVoidResult"}(u=e.JSCallResultType||(e.JSCallResultType={}));class w{constructor(e){this._dotNetCallDispatcher=e,this._byteArraysToBeRevived=new Map,this._pendingDotNetToJSStreams=new Map,this._pendingAsyncCalls={},this._nextAsyncCallId=1}getDotNetCallDispatcher(){return this._dotNetCallDispatcher}invokeJSFromDotNet(e,t,n,o){const r=m(this,t),s=J(b(e,o)(...r||[]),n);return null==s?null:O(this,s)}beginInvokeJSFromDotNet(e,t,n,o,r){const s=new Promise((e=>{const o=m(this,n);e(b(t,r)(...o||[]))}));e&&s.then((t=>O(this,[e,!0,J(t,o)]))).then((t=>this._dotNetCallDispatcher.endInvokeJSFromDotNet(e,!0,t)),(t=>this._dotNetCallDispatcher.endInvokeJSFromDotNet(e,!1,JSON.stringify([e,!1,S(t)]))))}endInvokeDotNetFromJS(e,t,n){const o=t?m(this,n):new Error(n);this.completePendingCall(parseInt(e,10),t,o)}invokeDotNetStaticMethod(e,t,...n){return this.invokeDotNetMethod(e,t,null,n)}invokeDotNetStaticMethodAsync(e,t,...n){return this.invokeDotNetMethodAsync(e,t,null,n)}invokeDotNetMethod(e,t,n,o){if(this._dotNetCallDispatcher.invokeDotNetFromJS){const r=O(this,o),s=this._dotNetCallDispatcher.invokeDotNetFromJS(e,t,n,r);return s?m(this,s):null}throw new Error("The current dispatcher does not support synchronous calls from JS to .NET. Use invokeDotNetMethodAsync instead.")}invokeDotNetMethodAsync(e,t,n,o){if(e&&n)throw new Error(`For instance method calls, assemblyName should be null. Received '${e}'.`);const r=this._nextAsyncCallId++,s=new Promise(((e,t)=>{this._pendingAsyncCalls[r]={resolve:e,reject:t}}));try{const s=O(this,o);this._dotNetCallDispatcher.beginInvokeDotNetFromJS(r,e,t,n,s)}catch(e){this.completePendingCall(r,!1,e)}return s}receiveByteArray(e,t){this._byteArraysToBeRevived.set(e,t)}processByteArray(e){const t=this._byteArraysToBeRevived.get(e);return t?(this._byteArraysToBeRevived.delete(e),t):null}supplyDotNetStream(e,t){if(this._pendingDotNetToJSStreams.has(e)){const n=this._pendingDotNetToJSStreams.get(e);this._pendingDotNetToJSStreams.delete(e),n.resolve(t)}else{const n=new _;n.resolve(t),this._pendingDotNetToJSStreams.set(e,n)}}getDotNetStreamPromise(e){let t;if(this._pendingDotNetToJSStreams.has(e))t=this._pendingDotNetToJSStreams.get(e).streamPromise,this._pendingDotNetToJSStreams.delete(e);else{const n=new _;this._pendingDotNetToJSStreams.set(e,n),t=n.streamPromise}return t}completePendingCall(e,t,n){if(!this._pendingAsyncCalls.hasOwnProperty(e))throw new Error(`There is no pending async call with ID ${e}.`);const o=this._pendingAsyncCalls[e];delete this._pendingAsyncCalls[e],t?o.resolve(n):o.reject(n)}}function S(e){return e instanceof Error?`${e.message}\n${e.stack}`:e?e.toString():"null"}function b(e,t){const n=h[t];if(n)return n.findFunction(e);throw new Error(`JS object instance with ID ${t} does not exist (has it been disposed?).`)}function D(e){delete h[e]}e.findJSFunction=b,e.disposeJSObjectReferenceById=D;class k{constructor(e,t){this._id=e,this._callDispatcher=t}invokeMethod(e,...t){return this._callDispatcher.invokeDotNetMethod(null,e,this._id,t)}invokeMethodAsync(e,...t){return this._callDispatcher.invokeDotNetMethodAsync(null,e,this._id,t)}dispose(){this._callDispatcher.invokeDotNetMethodAsync(null,"__Dispose",this._id,null).catch((e=>console.error(e)))}serializeAsArg(){return{[o]:this._id}}}e.DotNetObject=k,y((function(e,t){if(t&&"object"==typeof t){if(t.hasOwnProperty(o))return new k(t[o],c);if(t.hasOwnProperty(n)){const e=t[n],o=h[e];if(o)return o.getWrappedObject();throw new Error(`JS object instance with Id '${e}' does not exist. It may have been disposed.`)}if(t.hasOwnProperty(r)){const e=t[r],n=c.processByteArray(e);if(void 0===n)throw new Error(`Byte array index '${e}' does not exist.`);return n}if(t.hasOwnProperty(s)){const e=t[s],n=c.getDotNetStreamPromise(e);return new N(n)}}return t}));class N{constructor(e){this._streamPromise=e}stream(){return this._streamPromise}async arrayBuffer(){return new Response(await this.stream()).arrayBuffer()}}class _{constructor(){this.streamPromise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}function J(e,t){switch(t){case u.Default:return e;case u.JSObjectReference:return p(e);case u.JSStreamReference:return g(e);case u.JSVoidResult:return null;default:throw new Error(`Invalid JS call result type '${t}'.`)}}let A=0;function O(e,t){A=0,c=e;const n=JSON.stringify(t,R);return c=void 0,n}function R(e,t){if(t instanceof k)return t.serializeAsArg();if(t instanceof Uint8Array){c.getDotNetCallDispatcher().sendByteArray(A,t);const e={[r]:A};return A++,e}return t}}(t||(t={}));const n={blazorLib:null,dialog:null},o=e=>location.protocol+"//"+location.hostname+(location.port?":"+location.port:"")+`/assets/${e}.html`;function r(e,t){return!!Object.values(t).some((e=>null!==e))&&(Object.keys(e).forEach((n=>{if(console.log(n),null!==e[n])try{t[n]=e[n],console.log(t[n])}catch(e){}})),!0)}function s(e){let t=null==e?void 0:e.match(/(?:^'?([^']+)'?!)?(.*)$/);return{sheet:t?t[1]:null,cells:t?t[2]:null}}function i(e){return null==e||0===e.trim().length}Office.onReady((async e=>{delete history.pushState,delete history.replaceState}));const a={init:e=>{n.blazorLib=e},initCommandPrompt:e=>{document.getElementById(e).addEventListener("keydown",(function(e){"Enter"===e.key&&e.shiftKey&&e.preventDefault()}))},openEditorDlg:(e,t,r)=>{!function(e,t,r){Office.context.ui.displayDialogAsync(o("editor"),{height:40,width:40,displayInIframe:!0},(o=>{o.status===Office.AsyncResultStatus.Failed?console.error(`${o.error.code} ${o.error.message}`):(n.dialog=o.value,n.dialog.addEventHandler(Office.EventType.DialogMessageReceived,(async o=>{const s=JSON.parse(o.message);switch(!0){case s.loaded:n.dialog.messageChild(JSON.stringify({update:!0,title:t,doc:r}));break;case s.save:await n.blazorLib.invokeMethodAsync("UpdateDoc",e,s.doc);break;case s.cancel:n.dialog.close()}})),n.dialog.addEventHandler(Office.EventType.DialogEventReceived,(e=>{12006===e.error&&(n.blazorLib.invokeMethodAsync("CancelDlg"),n.dialog.close())})))}))}(e,t,r)},openLoginDlg:(e,t)=>{!function(e,t){Office.context.ui.displayDialogAsync(o("login"),{height:28,width:15,displayInIframe:!0},(o=>{o.status===Office.AsyncResultStatus.Failed?console.error(`${o.error.code} ${o.error.message}`):(n.dialog=o.value,n.dialog.addEventHandler(Office.EventType.DialogMessageReceived,(async o=>{const r=JSON.parse(o.message);switch(!0){case r.loaded:n.dialog.messageChild(JSON.stringify({username:t,title:e}));break;case r.ok:await n.blazorLib.invokeMethodAsync("Authenticate",r.username,r.password);break;case r.cancel:n.blazorLib.invokeMethodAsync("CancelDlg"),n.dialog.close()}})),n.dialog.addEventHandler(Office.EventType.DialogEventReceived,(e=>{12006===e.error&&(n.blazorLib.invokeMethodAsync("CancelDlg"),n.dialog.close())})))}))}(e,t)},messageDlg:e=>{!function(e){var t;null===(t=n.dialog)||void 0===t||t.messageChild(JSON.stringify({notice:e}))}(e)},closeDlg:()=>{var e;null===(e=n.dialog)||void 0===e||e.close()}},c={syncList:async(e,t,n)=>{let o=s(e),r=await Excel.run((async e=>{const r=i(o.sheet)?e.workbook.worksheets.getActiveWorksheet():e.workbook.worksheets.getItem(o.sheet),s=i(o.cells)?r.getUsedRange():r.getRange(o.cells);return function(e,t,n){e[t]=n}(s,t,n),await e.sync(),s.load(t),await e.sync(),function(e,t){return e[t]}(s,t)}));return r},syncRange:async(e,t)=>{let n=s(e);return await Excel.run((async e=>{const o=i(n.sheet)?e.workbook.worksheets.getActiveWorksheet():e.workbook.worksheets.getItem(n.sheet),s=i(n.cells)?o.getUsedRange():o.getRange(n.cells);return r(t,s)&&await e.sync(),s.load(),await e.sync(),s}))},syncSheet:async(e,t)=>await Excel.run((async n=>{const o=i(e)?n.workbook.worksheets.getActiveWorksheet():n.workbook.worksheets.getItem(e);return r(t,o)&&await n.sync(),o.load(),await n.sync(),o}))};e.app=a,e.xl=c}));
//# sourceMappingURL=main.js.map
