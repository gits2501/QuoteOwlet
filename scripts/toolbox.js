/* Defining utility functions and modules: 

 whenReady() - description
 addEvent()- -//-
 textContent() - 
 formEncode
*/  
if(typeof _pS_.modulMgr ==="object" && _pS_.modulMgr !== null){ // checking to see if modulMgr exists as object
 var mgr = _pS_.modulMgr;

 mgr.define("whenReady",[], function whenReady(){ 
                                    // "name_of_a_modul_or_function", ["dependancy"], function (dependancy)
                                    // are arguments that define() takes.
         var ready = false;

         var funcs = [];
         function handler(ev){ 
             if(ready) return; 
             
             if(ev.type === "readystatechange" && document.readyState !== "complete"){
                return;
             }

             for(var i = 0; i < funcs.length; i++){
                 funcs[i].call(document) // not sure why whould you envoke funs on documnet
             }
           ready = true;
           funcs = null; // ready for garabge colection 
         }
 
         if(document.addEventListener){
            document.addEventListener("DOMContentLoaded", handler ,false) // After all deffer-ed script finished
            //document.addEventListener("readystatechange", handler, false) // For IE events.
           // window.addEventListener("load", handler ,false);            // when all scripts finished.
         }
         else if(document.attachEvent){  // for IE < 9
             document.attachEvent("onreadystatechange", handler);
             window.attachEvent("onload", handler);
             
         }

     return function(fn){
          if(ready) fn.call(document);  // USE .apply(document, arguments)   wtf!
          else {funcs.push(fn);}
         
     }
 }) 


 mgr.define("addEvent",[],function addEvent(target, type, handler ,flg){
         var captOption = false; // for older browsers support, we always need a boolean value for this option
         if(flg) captOption = true;  

         if(target.addEventListener){
            target.addEventListener(type, handler, captOption ); // flg for setting the capturing event handler
         }
         else if(target.attachEvent){ // for IE < 9 , events registered with attachEvent are executed in context                                      // of global window object(in them "this = window") insted of target 
                                      // element.
              target.attachEvent("on"+type, function handl(event){
                  event = event || window.event;  // for IE < 9
                  return handler.call(target, event);
              })
 
            return handl ;  // when registering event handler in IE return wrapper handl so it can be removed
                            // with removeEvent()
         }
 }, true)
 
 mgr.define("textContent",[],function textContent(element,value){// One argument = get text, 
                                                                 // two arguments = set text. 
    var text = element.textContent; // If its defined and doesnt have any character set 
                                    // it HAS an empty string ("") by default DOM setting.
    if(value === undefined){        // If its not defined engine returns undefined 
        if(text !== undefined) return text;
        else return element.innerText;   // then it must mean that its an IE < 9, so return the innerText prop'.
    }
    else
    {
         if(text !== undefined){
         element.textContent = value;
         }
         else element.innerText = value;
    }
 }, true)

 mgr.define("formEncode",[],function formEncode(dataObj, spaces){
       var pairs = [];
       var value;
       var key;
       var type;
        for(var name in dataObj){
            type = typeof dataObj[name];
             if(dataObj.hasOwnProperty(name) && type !== "function" && type !== "null"){ // only props 
                                                                                           // in dataObj 
                  key = encodeURIComponent(name);

                  if(type === 'object'){                         
                     value = formEncode(dataObj[name], spaces); // form encode object
                     value = encodeURIComponent(value)          // since return value is string, uri encode it
                  }                      
                  else value = encodeURIComponent(dataObj[name]) // property is not object, just uri encode it
                  
                  if(!spaces){
                     key = key.replace(/%20/g, "+") 
                     value = value.replace(/%20/g, "+"); // substitute space encoding for +
                  }
                 
                  pairs.push(key + "=" + value)                 
             }
        }

      return pairs.join("&");
 }, true);

 mgr.define("percentEncode",[], function(str){
   
     return encodeURIComponent(str).replace(/[!'()*]/g, function(c){ // percent encodes unsafe chars, then
                                                                     // it follows RFC3986 and percent encodes
                                                                     // reserved characters in sqere brackets.
         return '%' + c.charCodeAt(0).toString(16);   // takes binary representation of every reserved char
                                                      // , coverts it to hex string char and appends to "%".
     });
 
 }, true);


 mgr.define("classList",[], function classList(){ // function that simulates HTML5 classList property of Element
                                                   // It uses behaviour delegation pattern with private vars as
  // explained here -> https://stackoverflow.com/questions/32748078/variable-privacy-in-javascripts-behaviour-delegation-pattern/43476020#43476020
    
      var cssClassList = {};
      cssClassList.messages = {
          invalidClsName:"Class name invalid ",
          existClsName: "Class name already exist ",
          doesntExistClsname: "Class name doesn't exists "
      };
      cssClassList.init = function(e){      
        this.e = e; 
        
      };
      cssClassList.contains = function(clsName, pocket){ // Checks of for existance of class name,
                                                        // returns true or false
        if(clsName.length === 0 || clsName.indexOf(" ") != -1){// Throw error if its illegal css class name
                throw new Error(this.messages.invalidClsName + " " + clsName);
        }
        if(this.e.className === clsName) return true; // Return true if its exact match
        
        pocket.regexpS = new RegExp("\\b" + clsName + "\\b", "g"); // Search whole words only
        return pocket.regexpS.test(this.e.className);
      };   

      cssClassList.add = function(clsName){
        if(this.contains(clsName)){
               console.log(this.messages.existClsName);
               return;
        }
         
        var clss = this.e.className;
        if(clss && clss[clss.lenght-1] !== " "){ // If there is any class name and last sign is not a space,
             clsName = " " + clsName;   // append it in front of one we want to add.
             
        }
       
        this.e.className += clsName;      
      };
     
      cssClassList.remove = function(clsName, pocket){
          
          pocket.regexpRm = new RegExp("\\b" + clsName + "\\b\\s*", "g") // For removal, whole words plus any
                                                                         //  trailing white space.
          console.log("to Remove: "+clsName); 
          if(this.contains(clsName)){ // on false this.contains() throws an error.
                this.e.className = this.e.className.replace(pocket.regexpRm, "");
               console.log(this.e.className);
          }
          else console.log(this.messages.desntExistClsName + " " + clsName)
      };
      cssClassList.toggle = function(clsName){ // on-off switch
          if(this.contains(clsName)){ // if exists remove it
             this.remove(clsName);
             return false; // false is to notify "turn of"   
          }
          else {
             this.add(clsName);  // doesn't exists so add it.
             return true;
          }
      };

      cssClassList.toString = function(){
            return this.e.className;
      };
 
   return function(e){
     if(e.classList) return e.classList; // If there already is HTML5 classList support, just return it. 
        
     function attachPocket(cList){  

        var funcsForPocket = Array.prototype.slice.call(arguments,1); // take arguments after cList
        var len = funcsForPocket.length;
      
        var pocket = {}; // object for placing private properties (not exposed directly to outside scopes
        var instance = Object.create(cList);

        for (var i = 0; i < len; i++){
           (function(){
                var func = funcsForPocket[i];
              
                instance[func] = function(){
                     var args = Array.prototype.slice.call(arguments);
                     args = args.concat([pocket]); // append pocket to arguments

                     return cList[func].apply(this, args);
                }
            })()
         }
 
         instance.init(e);
         return instance;
      }
     
  
      return attachPocket(cssClassList,"contains","remove");
      
   }
 })

 mgr.define('cssClassMgr',['classList'], function(classList){

     var cssClassMgr =  {}; // manipulates with css class names of an element

     cssClassMgr.initClass = function(element){

       if(typeof element === "string") this.el = document.getElementsByClassName(element)[0]
       else this.el = element;
       this.cssList = classList(this.el); // Using classList, module that emulates HTML5 classList property
                           
    }
    cssClassMgr.addClass = function(clsName){
       this.cssList.add(clsName);        // Adding css class name to the html element
    
    }
    cssClassMgr.removeClass = function(clsName){
   
       this.cssList.remove(clsName); 
    } 
    cssClassMgr.toggleClass = function(clsName){
       this.cssList.toggle(clsName);
    }
    cssClassMgr.toString = function(){
       return this.cssList.toString();
    }
  
    return function(){
       return inst = Object.create(cssClassMgr);

    }
 })
 mgr.define('cssEventMgr',['cssClassMgr','addEvent'], function(cssClassMgr,addEvent){ // making object that manages css classes on Events 
     var cssEventMgr = Object.create(cssClassMgr());  // (link to the cssClassMgr Object)
 
     cssEventMgr.initEvent = function(className, classToManage, eventDesc){ // manages element's css classes 
                                                                            // on events
        this.element = document.getElementsByClassName(className)[0] // gets element with css selector specified
        this.initClass(this.element);                                // Initiate element's css class menager
        var evt ,    // event type we want to subscribe to (click, mousedown ect..)
          action,    // what we want to do with classToManage (add, remove,toggle)
          delay;     // delay we want to pass before managing css class
     
        for(var i = 0; i < eventDesc.events.length; i++){  
           evtType = eventDesc.events[i];
           action = eventDesc.actions[i];
           console.log("evtType:"+ evtType)
           delay =  eventDesc.delays ? eventDesc.delays[i] : "";

           addEvent(this.element, evtType, this[action].bind(this, classToManage, delay))
        }
                                                                        
     }
     cssEventMgr.add = function(classToAdd, delay){ // adds css class (from stylesheet) to element's class list
                                                  
        if(delay) setTimeout(function(){ this.elementCss.addClass(classToAdd) }, delay);
        this.addClass(classToAdd); 
     }
  
     cssEventMgr.remove = function(classToRemove, delay){ // removes css class form element's css class list
    
        if(delay) setTimeout(function(){ this.elementCss.removeClass(classToRemove) }, delay);
        this.removeClass(classToRemove);
     }

     return function(){
         return Object.create(cssEventMgr);
     }
 })
 mgr.define("styleRulesMgr",[], function(){
        
        var styleRulesUtils = {};  // object use css selector syntax to find rules
        styleRulesUtils.findRule = function(ruleName){ // returns rule object or undefined
              var len = this.rules.length; 
              for(var i = 0; i < len; i++){
                 if (this.rules[i].selectorText === ruleName) return this.rules[i];
                 
              }
              
         }

        var styleRules = Object.create(styleRulesUtils);
         styleRules.messages = {
              provideRuleName: "You must provide a rule name when calling this function.",
              invalidRuleName : "Rule name is invalid",
              ruleDoesntExist: "Rule doesn't exist" 
         };
         styleRules.returnRuleOrPrintMsg = function(ruleName,msg){ // prints message if rule doesnt exist or 
                                                                   // returns rule.
               var rule = this.contains(ruleName);
               if(!rule){
                console.log(msg + ": " + ruleName);
                return;
               }

               return rule;
         }
         styleRules.initStyleSheet = function(styleSheet){
             this.styleSheet = styleSheet || document.styleSheets[0]; // Use passed or first stylesheet in doc.
             this.rules = this.styleSheet.cssRules ? this.styleSheet.cssRules : this.styleSheet.rules; // IE has
                                                                                                      // "rules" 
         }
         styleRules.contains = function (ruleName){ 
            if(ruleName.length === 0){
                throw new Error(this.messages.provideRuleName);
            }
            return this.findRule(ruleName); // returns style object or undefined
         }
         styleRules.addStyle = function(ruleName, cssPropName, propValue){
            var rule = this.returnRuleOrPrintMsg(ruleName, this.messages.ruleDoesntExist);
            if(rule) rule.style[cssPropName] = propValue;  // set provided css property and value for that rule  
         }
         styleRules.removeStyle = function(ruleName, cssPropName){
                var rule = this.returnRuleOrPrintMsg(ruleName, this.messages.ruleDoesntExist);
                if(rule) rule.style[cssPropName] = "";                 
                console.log(""+rule.selectorText+"["+ cssPropName+"]="+ rule[cssPropName])
         }


        
       return function(){
          return Object.create(styleRules);
       }

 }) 
 

 mgr.define("addPrefixedAnimationEvent",["addEvent"], function(addEvent, element, type, handler, flg){ 
                                                            // this function expects CamelCased animation type 
                                                            // values like: "AnimationStart".
      var pref = ["","moz","webkit","o","MS"]; // prefixes
      var len = pref.length;

      for(var i = 0; i < len; i++){
           if(!pref[i]) type = type.toLowerCase(); // when prefix is "" toLowerCase the event type.
    
             addEvent(element, type, handler,flg);
            
      }

 }, true)

 mgr.define("Rusha",[], function () {  // SHA1 func, courtecy of author here -> https://github.com/srijs/rusha
    var util = {
        getDataType: function (data) {
            if (typeof data === 'string') {
                return 'string';
            }
            if (data instanceof Array) {
                return 'array';
            }
            if (typeof global !== 'undefined' && global.Buffer && global.Buffer.isBuffer(data)) {
                return 'buffer';
            }
            if (data instanceof ArrayBuffer) {
                return 'arraybuffer';
            }
            if (data.buffer instanceof ArrayBuffer) {
                return 'view';
            }
            if (data instanceof Blob) {
                return 'blob';
            }
            throw new Error('Unsupported data type.');
        }
    };
    function Rusha(chunkSize) {
        'use strict';
        var // Private object structure.
        self$2 = { fill: 0 };
        var // Calculate the length of buffer that the sha1 routine uses
        // including the padding.
        padlen = function (len) {
            for (len += 9; len % 64 > 0; len += 1);
            return len;
        };
        var padZeroes = function (bin, len) {
            var h8 = new Uint8Array(bin.buffer);
            var om = len % 4, align = len - om;
            switch (om) {
            case 0:
                h8[align + 3] = 0;
            case 1:
                h8[align + 2] = 0;
            case 2:
                h8[align + 1] = 0;
            case 3:
                h8[align + 0] = 0;
            }
            for (var i$2 = (len >> 2) + 1; i$2 < bin.length; i$2++)
                bin[i$2] = 0;
        };
        var padData = function (bin, chunkLen, msgLen) {
            bin[chunkLen >> 2] |= 128 << 24 - (chunkLen % 4 << 3);
            // To support msgLen >= 2 GiB, use a float division when computing the
            // high 32-bits of the big-endian message length in bits.
            bin[((chunkLen >> 2) + 2 & ~15) + 14] = msgLen / (1 << 29) | 0;
            bin[((chunkLen >> 2) + 2 & ~15) + 15] = msgLen << 3;
        };
        var // Convert a binary string and write it to the heap.
        // A binary string is expected to only contain char codes < 256.
        convStr = function (H8, H32, start, len, off) {
            var str = this, i$2, om = off % 4, lm = (len + om) % 4, j = len - lm;
            switch (om) {
            case 0:
                H8[off] = str.charCodeAt(start + 3);
            case 1:
                H8[off + 1 - (om << 1) | 0] = str.charCodeAt(start + 2);
            case 2:
                H8[off + 2 - (om << 1) | 0] = str.charCodeAt(start + 1);
            case 3:
                H8[off + 3 - (om << 1) | 0] = str.charCodeAt(start);
            }
            if (len < lm + om) {
                return;
            }
            for (i$2 = 4 - om; i$2 < j; i$2 = i$2 + 4 | 0) {
                H32[off + i$2 >> 2] = str.charCodeAt(start + i$2) << 24 | str.charCodeAt(start + i$2 + 1) << 16 | str.charCodeAt(start + i$2 + 2) << 8 | str.charCodeAt(start + i$2 + 3);
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = str.charCodeAt(start + j + 2);
            case 2:
                H8[off + j + 2 | 0] = str.charCodeAt(start + j + 1);
            case 1:
                H8[off + j + 3 | 0] = str.charCodeAt(start + j);
            }
        };
        var // Convert a buffer or array and write it to the heap.
        // The buffer or array is expected to only contain elements < 256.
        convBuf = function (H8, H32, start, len, off) {
            var buf = this, i$2, om = off % 4, lm = (len + om) % 4, j = len - lm;
            switch (om) {
            case 0:
                H8[off] = buf[start + 3];
            case 1:
                H8[off + 1 - (om << 1) | 0] = buf[start + 2];
            case 2:
                H8[off + 2 - (om << 1) | 0] = buf[start + 1];
            case 3:
                H8[off + 3 - (om << 1) | 0] = buf[start];
            }
            if (len < lm + om) {
                return;
            }
            for (i$2 = 4 - om; i$2 < j; i$2 = i$2 + 4 | 0) {
                H32[off + i$2 >> 2 | 0] = buf[start + i$2] << 24 | buf[start + i$2 + 1] << 16 | buf[start + i$2 + 2] << 8 | buf[start + i$2 + 3];
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = buf[start + j + 2];
            case 2:
                H8[off + j + 2 | 0] = buf[start + j + 1];
            case 1:
                H8[off + j + 3 | 0] = buf[start + j];
            }
        };
        var convBlob = function (H8, H32, start, len, off) {
            var blob = this, i$2, om = off % 4, lm = (len + om) % 4, j = len - lm;
            var buf = new Uint8Array(reader.readAsArrayBuffer(blob.slice(start, start + len)));
            switch (om) {
            case 0:
                H8[off] = buf[3];
            case 1:
                H8[off + 1 - (om << 1) | 0] = buf[2];
            case 2:
                H8[off + 2 - (om << 1) | 0] = buf[1];
            case 3:
                H8[off + 3 - (om << 1) | 0] = buf[0];
            }
            if (len < lm + om) {
                return;
            }
            for (i$2 = 4 - om; i$2 < j; i$2 = i$2 + 4 | 0) {
                H32[off + i$2 >> 2 | 0] = buf[i$2] << 24 | buf[i$2 + 1] << 16 | buf[i$2 + 2] << 8 | buf[i$2 + 3];
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = buf[j + 2];
            case 2:
                H8[off + j + 2 | 0] = buf[j + 1];
            case 1:
                H8[off + j + 3 | 0] = buf[j];
            }
        };
        var convFn = function (data) {
            switch (util.getDataType(data)) {
            case 'string':
                return convStr.bind(data);
            case 'array':
                return convBuf.bind(data);
            case 'buffer':
                return convBuf.bind(data);
            case 'arraybuffer':
                return convBuf.bind(new Uint8Array(data));
            case 'view':
                return convBuf.bind(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
            case 'blob':
                return convBlob.bind(data);
            }
        };
        var slice = function (data, offset) {
            switch (util.getDataType(data)) {
            case 'string':
                return data.slice(offset);
            case 'array':
                return data.slice(offset);
            case 'buffer':
                return data.slice(offset);
            case 'arraybuffer':
                return data.slice(offset);
            case 'view':
                return data.buffer.slice(offset);
            }
        };
        var // Precompute 00 - ff strings
        precomputedHex = new Array(256);
        for (var i = 0; i < 256; i++) {
            precomputedHex[i] = (i < 16 ? '0' : '') + i.toString(16);
        }
        var // Convert an ArrayBuffer into its hexadecimal string representation.
        hex = function (arrayBuffer) {
            var binarray = new Uint8Array(arrayBuffer);
            var res = new Array(arrayBuffer.byteLength);
            for (var i$2 = 0; i$2 < res.length; i$2++) {
                res[i$2] = precomputedHex[binarray[i$2]];
            }
            return res.join('');
        };
        var ceilHeapSize = function (v) {
            // The asm.js spec says:
            // The heap object's byteLength must be either
            // 2^n for n in [12, 24) or 2^24 * n for n ≥ 1.
            // Also, byteLengths smaller than 2^16 are deprecated.
            var p;
            if (// If v is smaller than 2^16, the smallest possible solution
                // is 2^16.
                v <= 65536)
                return 65536;
            if (// If v < 2^24, we round up to 2^n,
                // otherwise we round up to 2^24 * n.
                v < 16777216) {
                for (p = 1; p < v; p = p << 1);
            } else {
                for (p = 16777216; p < v; p += 16777216);
            }
            return p;
        };
        var // Initialize the internal data structures to a new capacity.
        init = function (size) {
            if (size % 64 > 0) {
                throw new Error('Chunk size must be a multiple of 128 bit');
            }
            self$2.offset = 0;
            self$2.maxChunkLen = size;
            self$2.padMaxChunkLen = padlen(size);
            // The size of the heap is the sum of:
            // 1. The padded input message size
            // 2. The extended space the algorithm needs (320 byte)
            // 3. The 160 bit state the algoritm uses
            self$2.heap = new ArrayBuffer(ceilHeapSize(self$2.padMaxChunkLen + 320 + 20));
            self$2.h32 = new Int32Array(self$2.heap);
            self$2.h8 = new Int8Array(self$2.heap);
            self$2.core = new Rusha._core({
                Int32Array: Int32Array,
                DataView: DataView
            }, {}, self$2.heap);
            self$2.buffer = null;
        };
        // Iinitializethe datastructures according
        // to a chunk siyze.
        init(chunkSize || 64 * 1024);
        var initState = function (heap, padMsgLen) {
            self$2.offset = 0;
            var io = new Int32Array(heap, padMsgLen + 320, 5);
            io[0] = 1732584193;
            io[1] = -271733879;
            io[2] = -1732584194;
            io[3] = 271733878;
            io[4] = -1009589776;
        };
        var padChunk = function (chunkLen, msgLen) {
            var padChunkLen = padlen(chunkLen);
            var view = new Int32Array(self$2.heap, 0, padChunkLen >> 2);
            padZeroes(view, chunkLen);
            padData(view, chunkLen, msgLen);
            return padChunkLen;
        };
        var // Write data to the heap.
        write = function (data, chunkOffset, chunkLen, off) {
            convFn(data)(self$2.h8, self$2.h32, chunkOffset, chunkLen, off || 0);
        };
        var // Initialize and call the RushaCore,
        // assuming an input buffer of length len * 4.
        coreCall = function (data, chunkOffset, chunkLen, msgLen, finalize) {
            var padChunkLen = chunkLen;
            write(data, chunkOffset, chunkLen);
            if (finalize) {
                padChunkLen = padChunk(chunkLen, msgLen);
            }
            self$2.core.hash(padChunkLen, self$2.padMaxChunkLen);
        };
        var getRawDigest = function (heap, padMaxChunkLen) {
            var io = new Int32Array(heap, padMaxChunkLen + 320, 5);
            var out = new Int32Array(5);
            var arr = new DataView(out.buffer);
            arr.setInt32(0, io[0], false);
            arr.setInt32(4, io[1], false);
            arr.setInt32(8, io[2], false);
            arr.setInt32(12, io[3], false);
            arr.setInt32(16, io[4], false);
            return out;
        };
        var // Calculate the hash digest as an array of 5 32bit integers.
        rawDigest = this.rawDigest = function (str) {
            var msgLen = str.byteLength || str.length || str.size || 0;
            initState(self$2.heap, self$2.padMaxChunkLen);
            var chunkOffset = 0, chunkLen = self$2.maxChunkLen;
            for (chunkOffset = 0; msgLen > chunkOffset + chunkLen; chunkOffset += chunkLen) {
                coreCall(str, chunkOffset, chunkLen, msgLen, false);
            }
            coreCall(str, chunkOffset, msgLen - chunkOffset, msgLen, true);
            return getRawDigest(self$2.heap, self$2.padMaxChunkLen);
        };
        // The digest and digestFrom* interface returns the hash digest
        // as a hex string.
        this.digest = this.digestFromString = this.digestFromBuffer = this.digestFromArrayBuffer = function (str) {
            return hex(rawDigest(str).buffer);
        };
        this.resetState = function () {
            initState(self$2.heap, self$2.padMaxChunkLen);
            return this;
        };
        this.append = function (chunk) {
            var chunkOffset = 0;
            var chunkLen = chunk.byteLength || chunk.length || chunk.size || 0;
            var turnOffset = self$2.offset % self$2.maxChunkLen;
            var inputLen;
            self$2.offset += chunkLen;
            while (chunkOffset < chunkLen) {
                inputLen = Math.min(chunkLen - chunkOffset, self$2.maxChunkLen - turnOffset);
                write(chunk, chunkOffset, inputLen, turnOffset);
                turnOffset += inputLen;
                chunkOffset += inputLen;
                if (turnOffset === self$2.maxChunkLen) {
                    self$2.core.hash(self$2.maxChunkLen, self$2.padMaxChunkLen);
                    turnOffset = 0;
                }
            }
            return this;
        };
        this.getState = function () {
            var turnOffset = self$2.offset % self$2.maxChunkLen;
            var heap;
            if (!turnOffset) {
                var io = new Int32Array(self$2.heap, self$2.padMaxChunkLen + 320, 5);
                heap = io.buffer.slice(io.byteOffset, io.byteOffset + io.byteLength);
            } else {
                heap = self$2.heap.slice(0);
            }
            return {
                offset: self$2.offset,
                heap: heap
            };
        };
        this.setState = function (state) {
            self$2.offset = state.offset;
            if (state.heap.byteLength === 20) {
                var io = new Int32Array(self$2.heap, self$2.padMaxChunkLen + 320, 5);
                io.set(new Int32Array(state.heap));
            } else {
                self$2.h32.set(new Int32Array(state.heap));
            }
            return this;
        };
        var rawEnd = this.rawEnd = function () {
            var msgLen = self$2.offset;
            var chunkLen = msgLen % self$2.maxChunkLen;
            var padChunkLen = padChunk(chunkLen, msgLen);
            self$2.core.hash(padChunkLen, self$2.padMaxChunkLen);
            var result = getRawDigest(self$2.heap, self$2.padMaxChunkLen);
            initState(self$2.heap, self$2.padMaxChunkLen);
            return result;
        };
        this.end = function () {
            return hex(rawEnd().buffer);
        };
    }
    ;
    // The low-level RushCore module provides the heart of Rusha,
    // a high-speed sha1 implementation working on an Int32Array heap.
    // At first glance, the implementation seems complicated, however
    // with the SHA1 spec at hand, it is obvious this almost a textbook
    // implementation that has a few functions hand-inlined and a few loops
    // hand-unrolled.
    Rusha._core = function RushaCore(stdlib, foreign, heap) {
        'use asm';
        var H = new stdlib.Int32Array(heap);
        function hash(k, x) {
            // k in bytes
            k = k | 0;
            x = x | 0;
            var i = 0, j = 0, y0 = 0, z0 = 0, y1 = 0, z1 = 0, y2 = 0, z2 = 0, y3 = 0, z3 = 0, y4 = 0, z4 = 0, t0 = 0, t1 = 0;
            y0 = H[x + 320 >> 2] | 0;
            y1 = H[x + 324 >> 2] | 0;
            y2 = H[x + 328 >> 2] | 0;
            y3 = H[x + 332 >> 2] | 0;
            y4 = H[x + 336 >> 2] | 0;
            for (i = 0; (i | 0) < (k | 0); i = i + 64 | 0) {
                z0 = y0;
                z1 = y1;
                z2 = y2;
                z3 = y3;
                z4 = y4;
                for (j = 0; (j | 0) < 64; j = j + 4 | 0) {
                    t1 = H[i + j >> 2] | 0;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | ~y1 & y3) | 0) + ((t1 + y4 | 0) + 1518500249 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[k + j >> 2] = t1;
                }
                for (j = k + 64 | 0; (j | 0) < (k + 80 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | ~y1 & y3) | 0) + ((t1 + y4 | 0) + 1518500249 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                for (j = k + 80 | 0; (j | 0) < (k + 160 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 ^ y2 ^ y3) | 0) + ((t1 + y4 | 0) + 1859775393 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                for (j = k + 160 | 0; (j | 0) < (k + 240 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | y1 & y3 | y2 & y3) | 0) + ((t1 + y4 | 0) - 1894007588 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                for (j = k + 240 | 0; (j | 0) < (k + 320 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 ^ y2 ^ y3) | 0) + ((t1 + y4 | 0) - 899497514 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                y0 = y0 + z0 | 0;
                y1 = y1 + z1 | 0;
                y2 = y2 + z2 | 0;
                y3 = y3 + z3 | 0;
                y4 = y4 + z4 | 0;
            }
            H[x + 320 >> 2] = y0;
            H[x + 324 >> 2] = y1;
            H[x + 328 >> 2] = y2;
            H[x + 332 >> 2] = y3;
            H[x + 336 >> 2] = y4;
        }
        return { hash: hash };
    };
    if (// If we'e running in Node.JS, export a module.
        typeof module !== 'undefined') {
        module.exports = Rusha;
    } else if (// If we're running in a DOM context, export
        // the Rusha object to toplevel.
        typeof window !== 'undefined') {
        return Rusha;  // initialy author set this line to "window.Rusha = Rusha;"
    }
    if (// If we're running in a webworker, accept
        // messages containing a jobid and a buffer
        // or blob object, and return the hash result.
        typeof FileReaderSync !== 'undefined') {
        var reader = new FileReaderSync();
        var hashData = function hash(hasher, data, cb) {
            try {
                return cb(null, hasher.digest(data));
            } catch (e) {
                return cb(e);
            }
        };
        var hashFile = function hashArrayBuffer(hasher, readTotal, blockSize, file, cb) {
            var reader$2 = new self.FileReader();
            reader$2.onloadend = function onloadend() {
                var buffer = reader$2.result;
                readTotal += reader$2.result.byteLength;
                try {
                    hasher.append(buffer);
                } catch (e) {
                    cb(e);
                    return;
                }
                if (readTotal < file.size) {
                    hashFile(hasher, readTotal, blockSize, file, cb);
                } else {
                    cb(null, hasher.end());
                }
            };
            reader$2.readAsArrayBuffer(file.slice(readTotal, readTotal + blockSize));
        };
        self.onmessage = function onMessage(event) {
            var data = event.data.data, file = event.data.file, id = event.data.id;
            if (typeof id === 'undefined')
                return;
            if (!file && !data)
                return;
            var blockSize = event.data.blockSize || 4 * 1024 * 1024;
            var hasher = new Rusha(blockSize);
            hasher.resetState();
            var done = function done$2(err, hash) {
                if (!err) {
                    self.postMessage({
                        id: id,
                        hash: hash
                    });
                } else {
                    self.postMessage({
                        id: id,
                        error: err.name
                    });
                }
            };
            if (data)
                hashData(hasher, data, done);
            if (file)
                hashFile(hasher, 0, blockSize, file, done);
        };
    }
})

mgr.define("HmacSha1",["Rusha"], function(Rusha){ 
  "use strict" 

  var sha = new Rusha();   // this is where we make an "instance" of sha1 function
                           // You can use whatever library you choose for sha1,
                           // here we used Rusha.js
  var sha1 = sha.digest;   
  
  function HmacSha1(){
     this.blocksize = 64; // 64 when using these hash functions: SHA-1, MD5, RIPEMD-128/160 .
    
     var opad = 0x5c; // outer padding  constant = (0x5c) . And 0x5c is just hexadecimal for backward slash "\" 
     var ipad = 0x36; // inner padding contant = (0x36). And 0x36 is hexadecimal for char "6".
                      // We made both constants private.
     
     this.digest =  function (key, baseString){ // the actual hmac_sha1 function
      
       var opad_key = ""; // outer padded key
       var ipad_key = ""; // inner padded key
       var kLen = this.byteLength(key); // length of key in bytes;
     
       if(kLen < this.blocksize){  
          var diff = this.blocksize - kLen; // diff is how mush  blocksize is bigger then the key
       }
      
       if(kLen > this.blocksize){ 
          key = this.hexToString(sha1(key)); // The hash of 40 hex chars(40bytes) convert to exact char mappings,
                                           // each char has codepoint from 0x00 to 0xff.Produces string of 20 bytes.
         
          var hashedKeyLen =  this.byteLength(key); // take the length of key
       }
      
    
       (function applyXor(){   // Reads one char, at the time, from key and applies XOR constants on it
                               // acording to the byteLength of the key.
         var o_zeroPaddedCode; // result from opading the zero byte
         var i_zeroPaddedCode; // res from ipading the zero byte
         var o_paddedCode;     // res from opading the char from key
         var i_paddedCode;     // res from ipading the char from key
       
         var char;     // Plaseholder for one char from key 
         var charCode; // Code, numeric represantation of char 
        
         for(var j = 0; j < this.blocksize; j++){ 
               
             if(diff && (j+diff) >= this.blocksize || j >= hashedKeyLen){ // if diff exists (key is shorter then
                                                        // blocksize) and if we are at boundry where we should
                                                        // be, apply XOR on zero byte and constants, result put
                                                        // in corresponding padding key. Or the key was too long
                                                        // and was hashed, then also we need to do same thing.
                o_zeroPaddedCode = 0x00 ^ opad;  //XOR the zero byte with outer padding constant 
                opad_key += String.fromCharCode(o_zeroPaddedCode); // convert result back to string
                 
                i_zeroPaddedCode = 0x00 ^ ipad;
                ipad_key += String.fromCharCode(i_zeroPaddedCode);
              }
              else {
                char = this.oneByteCharAt(key,j);     // take char from key, only one byte char
                 charCode = char.codePointAt(0); // convert that char to number
                  
                 o_paddedCode =  charCode ^ opad; // XOR the char code with outer padding constant (opad)
                 opad_key += String.fromCharCode(o_paddedCode); // convert back code result to string
                  
                 i_paddedCode = charCode ^ ipad;  // XOR with the inner padding constant (ipad)
                 ipad_key += String.fromCharCode(i_paddedCode);
               
              }
            
  
              
          }
       //   console.log("opad_key: ", "|"+opad_key+"|", "\nipad_key: ", "|"+ipad_key+"|"); // Prints opad and
                                                                                // ipad key, line can be deleted.
       }.bind(this))() // binding "this" reference in applyXor to each "instance" of HmacSha1  
   
         return sha1(opad_key + this.hexToString(sha1(ipad_key + baseString))) ;
      
     }
  }
  
  HmacSha1.prototype.byteLength  = function (str){  // Counts characters only 1byte in length, of a string.
                                                    // Very similar to oneByteChar().
                                                    // For clarity 2 funtions are made.
      var len = str.length;
      var i = 0;
      var byteLen = 0; // string byte lenght
      
      for (i; i < len; i++){
        var code = str.charCodeAt(i);              // Take single character from string
        if(code >= 0x0 && code <= 0xff) byteLen++; // Check that it is only 1byte in length and increase counter
        else{
           throw new Error("More the 1 byte code detected, byteLength functon aborted.");
           return;
        }
        
      }
      
      return byteLen;
    
  }
  
  HmacSha1.prototype.oneByteCharAt = function (str,idx){
       var code = str.codePointAt(idx);
       if(code >= 0x00 && code <= 0xff){ // we are interested at reading only one byte
          return str.charAt(idx); // return char.
       }    
       else{ 
          throw new Error("More then 1byte character detected, |oneByteCharAt()| function  is aborted.")
       }
    
  };
  
  HmacSha1.prototype.hexToString = function (sha1Output){ // Converts every pair of hex CHARS to their character
                                                          // conterparts.
                                                          // example1: "4e" is converted to char "N" 
                                                          // example2: "34" is converted to char "4"
      
    var l;        // char at "i" place, left
    var lcode;    // code parsed from left char
    var shiftedL; // left character shifted to the left 
      
    var r;        // char at "i+1" place, right
    var rcode;    // code parsed from right char
    
    var bin;      // code from bitwise OR operation
    var char;     // one character
    var result = ""; // result string 
      
   for (var i = 0; i < sha1Output.length; i+=2){ // in steps by 2
           l = sha1Output[i]; // take "left" char
           
           if(typeof l === "number") lcode = parseInt(l); // parse the number
           else if(typeof l === "string") lcode = parseInt(l,16); // take the code if char letter is hex number
                                                                  // in set (a...f)
           
            shiftedL = lcode << 4 ; // shift it to left 4 places, gets filled in with 4 zeroes from the right
            r = sha1Output[i+1];    // take next char
           
           if(typeof r === "number") rcode = parseInt(r); // parse the number
           else if(typeof r === "string") rcode = parseInt(r,16); 
           
            bin = shiftedL | rcode; // 
            char = String.fromCharCode(bin);
            result += char;
     
            
    }
    // console.log("|"+result+"|", result.length); // prints info, line can be deleted
     
    return result;
  }

  return HmacSha1;  // returns function that can be used in constructor calls, with 'new'

 });

 mgr.define("request", ["formEncode"], function(formEncode){

    var request = {};

    request.messages = {
      cbAlreadyCalled: "Callback function has already been called.",
      cbWasNotCalled: "Calback function provided was not called.",
      urlNotSet: "You must provide url for the reqest you make.",
      callbackNotProvided: "Callback function was not provided.",
      encodingNotSupported: "Encoding you provided is not supported"
    };

    request.initRequest = function(args){ // Propertie names, in args object, that this function supports are:
                                          //  url, queryParams, callback, httpMethod, body, beforeSend
      this.request = this.createRequest(); // Creates XMLHttpRequest object
      this.temp;                           // Temporary place holder
      
      for(var prop in args){           // iterates trough every argument provided
         temp = args[prop];         
         switch(prop){
            case "url":
              this.setUrl(temp);        // sets the reqest url
            break;
            case "queryParams":
              this.setQuery(temp);      // Makes query string for url
            break;
            case "callback":
              this.addListener(temp);   // Adds listener for succesful data retrieval and invokes callback
            break;
            case "method":
              this.method = temp.toUpperCase() || "GET" // request method
            break;
            case "body":  console.log("has DATA");
              this.body = temp;          // add body for request
            break;
            case "parse":
              this.parse = temp;
            break; 
            case "encoding":
              this.encoding = temp;
            case "beforeSend":
              this.beforeSend = temp // For instance, if we need to set additonal request specific headers 
                                     // this.beforeSend is invoked before sending the request, but afther open()
                                     // is called. Here we have created new property.
            break;
         }    
      }
 
      if(!this.url) throw new Error(this.messages.urlNotSet); // Throw error if url was not provided in args
      if(!this.method) this.method = "GET"; // Defaults to "GET" method if one was not provided in args object
      if (!this.request.onreadystatechange) throw new Error(this.messages.callbackNotProvided); // cb missing
      
           
      console.log(args);
      this.sendRequest();     // Makes the actual http request

    }; 
 
    request.createRequest = function(){
        try{
            return new XMLHttpRequest(); // standard
        }
        catch(e){  console.log(e);
            try{ 
                return new ActiveXObject("Microsoft.XMLHTTP");  // IE specific ...
            }
            catch(e){
                return new ActiveXObject("Msxml12.XMLHTTP");
            }
        }
    }
    request.setUrl = function(url){
      if(!this.url) this.url = url;
      else this.url = url + this.url;  // if setQueryParams() run before set url, we already have query string
                                       //  in "this.url". So "url" needs to go first.
    };

    request.setQuery = function(queryParams){
      this.queryString = formEncode(queryParams); // Function uses form-url-encoded scheme to return query string
      if(this.url.indexOf("?") === -1) this.url+="?"; // if doesnt have query delimiter add it. 
      this.url+= this.queryString; // Adds query string to url 

    };
   
    request.addListener = function(callback) {
      var alreadyCalled = false;

      this.request.onreadystatechange = function(){
          
         if(this.request.readyState === 4 && this.request.status === 200){
              if(alreadyCalled){
                  console.log(this.messages.cbAlreadyCalled);
                  return;
              }
              else alreadyCalled = true;
              
              var type = this.request.getResponseHeader("Content-type"); // Get the response's content type
             
              switch(type){
                 case "application/json":   
                   try{
                      if(this.parse) callback(JSON.parse(data)); // parse json data and send it as argument
                      else callback(data);
                   }
                   catch(e){
                      console.log(this.messages.cbWasNotCalled + " \n"+ e); // if parsing failed note it
                   }
                 break;
                 case "application/xml":
                   callback(this.request.responseXML); // responceXML already parsed as a DOM object
                 break;
                 default:
                   callback(this.request.responseText);// text/html , text/css and others are treated as text
              }
         }   
      }.bind(this); // Async functions lose -this- context because they start executing when functions that 
                    // invoked them already finished their execution. Here we pass whatever "this" references 
                    // in the moment addListener() is invoked. Meaning, "this" will repesent each 
                    // instance of request, see return function below. 
    };

    request.setHeader = function(header, value){    // set the request header 
       this.request.setRequestHeader(header, value);  
    };

    request.setBody = function(){ // sets Content-Type encoding and encode the body of a request
               console.log("In setBody")
        if(this.body){     // check for data payload 
          
          if(!this.encoding){                       // If there is no string that indicates encoding
            this.setHeader("Content-Type", "text/plain"); // default to text, set the content type (was formEnc)
          }
          else {
              switch(this.encoding.toLowerCase()){      // when there is encoding string
                    case "form":
                      this.body = formEncode(this.body) // encode the body
                      this.setHeader("Content-Type", "application/x-www-url-formencoded"); // set header
                    break;
                    case "json":
                      this.body = JSON.stringify(this.body)  
                      this.setHeader("Content-Type", "application/json");
                    case "text":
                       this.setHeader("Content-Type", 'text/plain');
                    break;
                    default:
                      throw new Error(this.messages.encodingNotSupported);
               }
          }
        }
        else { 
           this.body.data = null; // set the body to null
        } 

 
    };
    request.sendRequest = function(){

      if(this.request.readyState == "0") this.request.open(this.method, this.url);// "0" means open() not called
      if(this.beforeSend) this.beforeSend(this.request) // if user supplied beforeSend() func, call it.
        console.log("This before setBody!", "req state:"+ this.request.readyState);
      
      if(this.body) this.setBody();
      else if(this.method === "POST") this.body = null; // set it to 'null' if there is no body and method 
                                                        //is POST. This is just xmlhttp request spec.
      
      if(this.method === "GET") this.request.send(null);
      if(this.method === "POST") this.request.send(this.body); 
       
    };    
   
    return function(args){  // modul returns this function as API

       var r = Object.create(request); // behavior delegation link
     
       if(args) r.initRequest(args); // Initialise request and sends it, if args are provided
       else {                        // if not , then return the object that indirectly, through closures,
                                     // have access to prototype chain of request API. That is it has acess to 
                                     // an instance of request API (here it is "r").
          return phantomHead = {
             initRequest: r.initRequest.bind(r) // "borrow" method from instance, bind it to instance
          } 
       }
    }

 });

 mgr.define("twtOAuth",["HmacSha1","percentEncode", "request", "formEncode"], function(HmacSha1, percentEncode, request, formEncode) {
   'use strict' 

   function twtOAuth (args){ 
      var vault = {               // this is vault, for storing sensitive information
        "consumer_key": "",
        "consumer_secret":"",
        "user_key": ""
      }
      this.leg = ["request_token","authorize","access_token"] // Names of each leg (step) in 3-leg authentication
                                                             // to twitter. Names are also url path ends:
                                                             // http://api.twitter.com/oauth/request_token
      
      this.httpMethods = {}   // This is the current sequence of http methods we use in 3-leg authentication 
      this.httpMethods[this.leg[0]] = "POST"
      this.httpMethods[this.leg[1]] = "GET"                                          
      this.httpMethods[this.leg[2]] = "POST" 
      
      this.twtUrl = {            // Parts of twitter api url
           "protocol": "https://",
           "domain": "api.twitter.com",
           "path": "/oauth/",    // 'path' is actualy just part of complete path, used in 3-leg dance 
           "api_path": "/1.1/"   // api path for calls afther authorization/access_token
      }  
     
      this.apiUrl =  this.twtUrl.protocol + this.twtUrl.domain + this.twtUrl.path; // here we store absolute url                                                                                   // without leg.
 
      this.absoluteUrls = {}    // here we put together the complete url for each leg (step) in authentication
      this.absoluteUrls[this.leg[0]] = this.apiUrl + this.leg[0]; 
      this.absoluteUrls[this.leg[1]] = this.apiUrl + this.leg[1];
      this.absoluteUrls[this.leg[2]] = this.apiUrl + this.leg[2];

      this.lnkLabel = {  // link label, used to make url sufficiently unique
          name : '__lance',
          data : {
            'id' : 'he who dares '
          }
      } 
       
      this.prefix = "oauth_";  // prefix for each oauth key in a http request
      this.leadPrefix = "OAuth "     // leading string afther all key-value pairs go. Notice space at the end. 
      this.signatureBaseString = ""; // The string HMAC-SHA1 uses as second argument.
      
      this.oauth = {}                                // Holds parameters that are used to generate SBS and AH
      this.oauth[ this.prefix + 'consumer_key'] = "";// This is very sensitive data. Server sets the value.
      this.oauth[ this.prefix + 'signature'] = "";   // This value also sets the server.
      this.oauth[ this.prefix + 'nonce'] =  "";    // Session id, twitter api uses this to determines duplicates
      this.oauth[ this.prefix + 'signature_method'] = ""; // Signature method we are using
      this.oauth[ this.prefix + 'timestamp'] = "";   // Unix epoch timestamp
      this.oauth[ this.prefix + 'version'] = ""      // all request use ver 1.0
      
      this[this.leg[0]] = {}; 
      this[this.leg[0]][ this.prefix + 'callback'] = ""; // User is return to this link, if approval is confirmed 
      this[this.leg[1]] = {}                             // Creating object for params used in 'authorize' leg
      this[this.leg[1]][ this.prefix + 'token'] = '';  
      this[this.leg[1]][ this.prefix + 'verifier'] = '';

      this[this.leg[2]] = {}                          // Creating 'access_token' object for that step params
      this[this.leg[2]][ this.prefix + 'token'] = ''; // we need just oauth_token param
      
      this.params = function(action, o1, o2){
          Object.getOwnPropertyNames(o2)
                  .map(function(key, i){
                       if(action === 'add') o1[key] = o2[key]; // add property name and value from o2 to o1
                       else delete o1[key];                    // removes property name we found in o2 from o1 
                   })
      }

      this.alreadyCalled = false; // Control flag. Protection against multiple calls to twitter from same 
                                  // instance
      // first part (maybe call it UserAuthorization)
      this.getRequestToken = function(args){  // Add leg argument check to see which leg, act acording
         
         if(this.alreadyCalled) return;       // Just return, in case of subsequent call.
         else this.alreadyCalled = true;      
        
         var resolve;
         var promised;
         
         console.log("v: "+ vault)
         this.params('add', this.oauth, this[this.leg[0]]) // add oauth param (callback) for reqest_token step
         this.setUserParams(args, vault);       // Sets user supplied parameters like: 'redirection_url' ...
         this.setNonUserParams();               // Sets non user-suppliead params: timestamp, nonce, sig. method
         this.appendToCallback(this.lnkLabel.data, this.lnkLabel.name); // adds uniqueness to url
         this.genSignatureBaseString(vault,this.leg[0]);    // Generates signature base string
         if(this.newWindow){                    // Checking for user supplied newWindow preference
            this.openWindow();                  // Opens new window.  
       //  if(Promise) promised = new Promise(function(rslv, rjt){ resolve = rslv; }) // if can, make a Promise
                                                                                      // remember it's resolve
         }
         //this.genSignature(vault);            // Generates signature
          console.log('authorize FUNC: ', this.authorize);
         this.sendRequest(this.redirection.bind(this,resolve), this.leg[0]);// Sends request to twitter,resolves
                                                                            // promise if present 
         if(promised) return promised;                    
      }
        // this is the second part
      this.getSessionData = function(){
         
         if(!this.wasParsed) this.parseAuthorizationLink(window.location.href); // parse returned data
         
         if(!this.authorized) return;                       // return if no tokens

         if(!this.authorized.data){                         // return if no session data
            console.log(this.messages.noSessionData);
            return; 
         }                          
          
          this.sessionData = this.parseSessionData(this.authorized.data) // further parsing of session data
          console.log(this.sessionData);
          return this.sessionData;
      }

      this.accessTwitter = function(options){ // Exchanges token and verifier for access_token
          this.userOptions = options; // Create new property and put user suppliead options in. This is used 
                                      // when we acquire access token (next step)         
          this.server_url = this.userOptions.server_url; // we need only server_url from user for this step
          
          if(!this.wasParsed) this.parseAuthorizationLink(window.location.href);
 
          if(!this.authorized) {
            console.log(this.meassages.linkNotAuthorized);
            return;                                       // print info and return if no tokens or label incore
          } 

          
          this.oauth[this.prefix + 'verifier'] = this.authorized.oauth_verifier // Put authorized verifier
          this.oauth[this.prefix + 'token'] = this.authorized.oauth_token;      // Authorized token
          this.params('remove', this.oauth, this[this.leg[0]]);       // Remove params not needed for this step
          this.setNonUserParams(); 
          this.genSignatureBaseString(vault,this.leg[2]);   // generate SBS // check if you really need the vault here
       
 
          this.sendRequest(this.accessToken.bind(this), this.leg[2]);  
      }
   }
   twtOAuth.prototype.parseAuthorizationLink = function(url){ // parses data in url 

      var str = this.parse(url, /\?/g, /#/g); // parses query string

      var qp = this.parseQueryParams(str); // parse parameters from query string
      var obj = this.objectify(qp);        // makes an object from query string parametars
      console.log(obj.__lance);
      if(obj.oauth_token && obj.oauth_verifier && obj.__lance){ // check to see we have needed tokens 
         this.authorized  = obj;           // make new variable;                     
      }
      this.wasParsed = true;               // indicate that the url was already parsed  
   }
  
   twtOAuth.prototype.parseSessionData = function(str){
       if(/%[0-9][0-9]/g.test(str))                       // See if there are percent encoded chars
       str = decodeURIComponent(decodeURIComponent(str)); // Decoding twice, since it was encoded twice
                                                          // (by OAuth 1.0a specification). See SBS function.
       var parsed = this.parseQueryParams(str);           // Parse key-value pairs  
       return this.objectify(parsed);                     // Making an object from parsed key/values.
   }
  
   twtOAuth.prototype.parseQueryParams = function (str){
      var arr  = [];
      if(!str){
         console.log(this.messages.noStringProvided);
         return;
      }  

      if(str[0] === "?") str = str.substring(1); // remove "?" if we have one at beggining

      arr = str.split('&')                       // make new array element on each "&" 
            .map( function(el, i){ 
                 var arr2 =  el.split("=");      // for each element make new array element on each "=" 
                 return arr2;   

             });
     
      console.log(arr);
      return arr;   // arr is now array of arrays
   }

   twtOAuth.prototype.objectify = function(array){ // makes new object with props and values from array's 
                                                   // elements
      var data = {};
      var len = array.length;
      
      for(var i = 0; i < len; i++){
            var arr = array[i];
            for(var j = 0; j < arr.length; j++){   // iterating though each of arrays in parsed
               if(j == 0) data[arr[j]] = arr[j+1]; // if we are at element that holds name of property, 
                                                   // make property with that name in data object, set it's
                                                   //  value of next element (j+1)
          }
      } 
      
      return data;
   } 
   
   twtOAuth.prototype.accessToken = function(sentData){ // should be done by server
       console.log('acessTokenData: '+ sentData);
       var qp = this.parseQueryParams(sentData);
       var parsed = this.objectify(qp)
       console.log('parsedParams: ', parsed);
       
       this.params('remove', this.oauth, this[this.leg[1]]);  // Remove params needed for previous step
      
       this.params('add', this.oauth, this.userOptions.params)// params needed for api call (raw values) 
                                                    // ADD this.oauth to this.userParams 
       this.oauth.oauth_token = parsed.oauth_token  // setting access_token in oauth_token 
                                                    // only for testing purposes , this will do server logic
       this.genSignatureBaseString({}, this.userOptions);  // add vault or remove this obeject as first arg 
       console.log("SBS (api call): ", this.signatureBaseString)
       
       var options =  {
          url: this.userOptions.server_url,        
          method: this.httpMethods[this.leg[2]], // method for access_token leg
          queryParams: {
            host: this.twtUrl.protocol + this.twtUrl.domain,            
            path: this.twtUrl.api_path + this.userOptions.path + '?'+ formEncode(this.userOptions.params, true),
            method: this.userOptions.method      // method user supplied
          },
          body: this.signatureBaseString,
          beforeSend: this.setAuthorizationHeader.bind(this)
         
       }
       console.log("All Options", options);
       this.sendRequest( function(sentData){console.log("API CALL data: ", sentData)}, options ); // api call 

   }

   twtOAuth.prototype.setUserParams = function(args, vault){ // sets user suplied parametars 
         var temp; 
         for(var prop in args){    // iterate trough any user params
            temp = args[prop];

            switch(prop){
               case "server_url":       // where the server code runs 
                 this.server_url = temp;
               break;
               case "redirection_url": // this is the url to which user gets redirected by twiiter api, 
                 this.oauth[ this.prefix + 'callback'] = temp;
               break; 
               case "new_window":      // object that holds properties for making new window(tab/popup)
                 this.newWindow = {};
                 for(var data in temp){
                    switch(data){
                       case "name":
                         this.newWindow[data] = temp[data];
                       break;
                       case "features":
                         this.newWindow[data] = temp[data];
                       break;
                    }
                 } 
               break;
               case 'callback_func':    // user supplied callback function (called if Promise is not available)
                 this.callback_func = temp;
               break;
               case "session_data":
                 this.session_data = temp;
               break;
               case "csecret":
                 vault.consumer_secret = temp;  // placing sensitive data to variables formed in closures
               break;
               case "ckey":
                 vault.consumer_key = temp;
               break;
               case "usecret":
                 vault.user_key = temp; 
               break;
               case "version":
                 this.oauth.version(temp);
               break;
               case "urls":              // when we get urls object, we check for urls provided
                                         // for each leg (part) of the 3-leg authentication.
                 for(var leg in temp){
                   switch(leg){
                     case "request_token":
                       this.absoluteUrls[leg] = temp[leg]; // if leg is request_token, update with new url    
                     break;
                     case "authorize":
                       this.absoluteUrls[leg] = temp[leg];
                     break;
                     case "access_token":
                       this.absoluteUrls[leg] = temp[leg];
                     break;
                   } 
                 }
                case "methods":
                  for(var leg in temp){           // check for legs in provided 'methods' object
                    switch(leg){
                      case "request_token":       // if leg is request, update with the new http method
                        this.httpMethods[leg] = temp[leg];
                      break;
                      case "authorize":          
                        this.httpMethods[leg] = temp[leg];
                      break;
                      case "access_token":         
                        this.httpMethods[leg] = temp[leg];
                      break;
                    } 
                  }
            }
         }

         this.checkRequestTokenCallback();   // checks for callback, throws error if not set
         this.checkConsumerSecret(vault);    // checks secret,
         
   }
   
   twtOAuth.prototype.genSignatureBaseString = function(vault, leg){ // generates SBS  
         this.signatureBaseString = '';
         var a = [];
         for(var name in this.oauth){ // takes every oauth params name
            a.push(name);             // and pushes them to array
         } 
     
         a.sort();  // sorts alphabeticaly

         var keyValue;
         var key;
         var value;    
                                              // Collects oauth params
         for(var i = 0; i < a.length; i++){   // Percent encodes every key value, puts "=" between those, and
                                              // between each pair of key/value it puts "&" sign.
            key = a[i];                       // Thakes key that was sorted alphabeticaly
            switch(key){                      // In case of consumer and user keys we leave them to server logic
              case "oauth_callback":   // Callback url to which users are redirected by twitter         
                                       // Check to see if there is data to append to calback as query string:
                value = this.session_data ? this.appendToCallback(this.session_data) : 
                                                this.oauth[this.prefix + 'callback']; 
              break; 
              case "oauth_consumer_key":
                value = "";         // Sensitive data we leave for server to add
              break;   
              case "oauth_user_key":
                value = ""; 
              break;
          /*    case "oauth_token":    // Needs to be present for api calls but not for access token step 
                value = "";            // since we need oauth_token and oauth_verifier for that.
              break;
           */
              case "oauth_signature":
                continue;           // We dont add signature to singatureBaseString at all (server does that)
              break;
              default:
                value = this.oauth[key];          // Takes value of that key
            }
            keyValue = percentEncode(key) + "=" + percentEncode(value); // Encodes key value and inserts "="
          console.log(keyValue)                                         // in between.
            if(i !== a.length - 1) keyValue += "&"; // Dont append "&" on last pair    
            this.signatureBaseString += keyValue;   // Add pair to SBS
         } 

         var method;  // Collecting the reqest method and url
         var url;

         if(typeof leg === 'string'){            // we are in 3-leg dance, take well known params
           method = this.httpMethods[leg]        // Get the method for this leg
           method = method.toUpperCase() + "&";  // upercase the method, add "&"

           url = this.absoluteUrls[leg];         // Get the absoute url for this leg of authentication
           url = percentEncode(url) + "&";       // Encode the url, add "&".
         }
         else {                                      // 'leg' is the options object user provided     
           method = leg.method.toUpperCase() + "&";  // Upercase the method, add "&"
           url = this.twtUrl.protocol + this.twtUrl.domain + this.twtUrl.api_path + leg.path;     
                                                     // Get the absoute url for api call + user provided path
           url = percentEncode(url) + "&";           // Encode the url, add "&".
         }
         // Finaly we assemble the sbs string. PercentEncoding again the signature base string.
         this.signatureBaseString = method + url + percentEncode(this.signatureBaseString);
         console.log("SBS string: "+ this.signatureBaseString); 
   }
   twtOAuth.prototype.openWindow = function(){ // opens pop-up and puts in under current window
        console.log("==== POP-UP =====");
      this.newWindow.window = window.open("", this.newWindow.name, this.newWindow.features);
      console.log("this.newWindow: ", this.newWindow.window ); 
   }
   twtOAuth.prototype.genSignature = function(vault){ 
         // put here if request leg, athorization leg ...
      var hmacSha1 = new HmacSha1();
      var key = this.genSigningKey(vault); // signing key uses consumer secret, NOT consumer key
      console.log("signing KEY: " + key); 
      this.oauth.signature = hmacSha1.digest(key,this.signatureBaseString); // Produces hex string
      this.oauth.signature = hmacSha1.hexToString(this.oauth.signature);    // Converts to string, for btoa()                                                                
      this.oauth.signature = btoa(this.oauth.signature);                    // Converting to base64
                                                                            // We percent encode it in 
                                                                            // sendRequest function
      console.log("oauth_sig: " + this.oauth.signature);                       
   }

   twtOAuth.prototype.messages = {
      callbackNotSet: "You must provide a callback url to which users are redirected.",
      consumerKeyNotSet: "You must provide consumer KEY that indetifies your app.",
      consumerSecretNotSet: "You must provede consumer SECRET that indentifies your app",
      userKey: "You must provide user secret that intentifies user in which name your app makes request.",
      noStringProvided: "You must provide a string for parsing." ,
      noSessionData: "No session data was found.",
      linkNotAuthorized: "Appears that obtained url doesn't have necessary data."
   };

   twtOAuth.prototype.appendToCallback = function(data, name){ // appends data object as querystring to                                                                        // callback url. 
    console.log('Data: ==> ', data)
      if(!name) name = "data";
      var callback = this.oauth[ this.prefix + 'callback'];
      var fEncoded = formEncode(data, true);
      console.log(fEncoded);
      var queryString = name + '=' + percentEncode(fEncoded); // Make string from object then                                                                                 // percent encode it.  
    console.log("queryString: ", queryString)
      if(!/\?/.test(callback)) callback += "?";               // Add "?" if one not exist
      else queryString =  '&' + queryString                   // other queryString exists, so add '&' to this qs
      this.oauth[ this.prefix + 'callback'] = callback + queryString;           // Add queryString to callback
                                                     
       console.log("OAUTH CALLBACK: "+this.oauth[ this.prefix + 'callback'])
      return this.oauth[ this.prefix + 'callback'];
   };

   twtOAuth.prototype.checkConsumerSecret = function(vault){ // checks if consumer secret is set 
      if(!vault.consumer_secret) throw new Error(this.messages.consumerSecretNotSet);
      if(!vault.consumer_key) throw new Error(this.messages.consumerKeyNotSet)
   }
   twtOAuth.checkUserSecret = function(vault){  // check if user secret is set
      if(!vault.user_key) throw new Error(this.messages.userKeyNotSet);
   }
   twtOAuth.prototype.checkRequestTokenCallback = function (){ // checks for the url user is returned to
      if(!this.oauth[ this.prefix + 'callback']) throw new Error(this.messages.callbackNotSet);
                                                                // throw an error if one is not set
   }
    
   twtOAuth.prototype.sendRequest = function(cb, leg){     // was (vault, resolve, leg) 
      console.log('request SENT +')
      var options;

      if(typeof leg === 'string'){            // we are in 3-leg dance
        options = {                           // seting params for http request
         "method": this.httpMethods[leg], // take http method for this leg
         "url": this.server_url,   // was 'http://localhost:5000',
         "queryParams": { 
            "host": this.twtUrl.domain,
            "path": this.twtUrl.path + leg,
            "method": this.httpMethods[leg],
          },
         "body": this.signatureBaseString,     // Payload of the request we send
         "encoding": "text",                   // encoding of the body
         "beforeSend": this.setAuthorizationHeader.bind(this),// Before sending we add Authorization 
                                                              // header to http request
         "callback": cb                        // Afther successfull responce, 
                                               // this callback function is invoked
        }
      }
      else {                             // 'leg' is object with provided options
          leg.callback = cb; // set callback 
          options = leg;
      }   
    

      request(options);  
   }
   
   twtOAuth.prototype.redirection = function(resolve, sentData){ // Callback function for 2nd step
                                                  
       console.log("From twitter request_token: " + sentData);
       this.oauth_token = this.parse(sentData,/oauth_token/g, /&/g);// parses oauth_token 
                                                                    // from string twitter sent
       this.redirect(resolve);  // redirect user to twitter for authorization 
   };

   twtOAuth.prototype.parse = function(str, delimiter1, delimiter2){ // parses substring of a string (str) 
                                                                     
       if(!str){ 
          console.log(this.messages.noStringProvided);
          return;
       }
       var start = str.search(delimiter1);   // calculate from which index to take 
       var end ; 
       if(!delimiter2 || str.search(delimiter2) === -1) end = str.length;// if del2 was not passed as argument
                                                                         // or we didnt find it, then end index
                                                                         // is length of the string.
       else end = str.search(delimiter2);    // calcualte to which index to take                                                             
       console.log(str); 
       return str.substring(start, end);     // return substring
            
   };

   twtOAuth.prototype.redirect = function(resolve){ // redirects user to twitter for authorization   
     console.log('RESOLVE : ', resolve);
      var openedWindow;      
      var url =  this.absoluteUrls[this.leg[1]] + "?" + this.oauth_token; // assemble url for second leg

      if(!this.newWindow){
         window.location = url; // redirect current window if no newWindow; 
         return;
      }                         
      
      openedWindow = this.newWindow.window;           
      openedWindow.location = url;

      if(resolve) resolve(openedWindow);       // if promise is there, resolve it with a window reference
      else if (this.callback_func) this.callback_func(openedWindow); // if not invoke user callback function
      
      
   };

   twtOAuth.prototype.setAuthorizationHeader = function(request){
      request.setRequestHeader("Authorization", this.genHeaderString());
   }
   twtOAuth.prototype.genHeaderString = function(vault){
      var a = [];
       
      for(var name in this.oauth){
          a.push(name);
      }
      console.log("a; "+ a);
      a.sort();                           // Aphabeticaly sort array of property names

      var headerString = this.leadPrefix; // Adding "OAuth " in front everthing
      var key;                            // Temp vars
      var value;
      var keyValue;
    
      for(var i = 0; i < a.length; i++){  // iterate oauth  
         
          key = a[i];                                    // Take the key name (sorted in a)

         // if(key === "consumer_key") value = vault.consumer_key; // get value from vault
         // else
          value = this.oauth[key];   // Get it from oauth object
      
          key = percentEncode(key);  // Encode the key
          value = "\"" + percentEncode(value) + "\"";    // Adding double quotes to value
          
          keyValue = key + "=" + value;                  // Adding "=" between
          if(i !== (a.length - 1)) keyValue = keyValue + ", " // Add trailing comma and space, until end

          headerString += keyValue;       
      } 
      console.log("header string: " + headerString); 
      return headerString;
   }

   twtOAuth.prototype.setNonUserParams = function(){ // sets all "calculated" oauth params 
      this.setSignatureMethod();
      this.setNonce();
      this.setTimestamp();
      this.setVersion();
   }
   
   twtOAuth.prototype.genSigningKey = function(vault){ // generates signing keys used by hmacSha1 function
      var key = "";
      key += percentEncode(vault.consumer_secret) + "&"; // percent encode SECRET , add "&"
      if(vault.user_key) key += percentEncode(vault.user_key)     // check this in docs
      // if step where user key required check vor usr key  
      return key; 
   }
   twtOAuth.prototype.setSignatureMethod = function(method){
      this.oauth[this.prefix + 'signature_method'] = method || "HMAC-SHA1";
   }

   twtOAuth.prototype.setVersion = function(version){ 
      this.oauth[ this.prefix + 'version'] =  version || "1.0";
   }
   twtOAuth.prototype.setNonce = function(){ // Generates string from random sequence of 32 numbers, 
                                          // then returns base64 encoding of that string, striped of "=" sign.
      var seeds = "AaBb1CcDd2EeFf3GgHh4IiJjK5kLl6MmN7nOo8PpQqR9rSsTtU0uVvWwXxYyZz"; 
      var nonce = "";
  
      for(var i = 0; i < 31; i++){
        nonce += seeds[Math.round(Math.random() * (seeds.length - 1))];// pick a random ascii from seeds string
      }
    
      nonce = btoa(nonce).replace(/=/g,""); // encode to base64 and strip the "=" sign
      console.log("nonce: " + nonce)
      this.oauth[ this.prefix + 'nonce'] = nonce;            // set twitter session identifier (nonce)
   }

   twtOAuth.prototype.setTimestamp = function(){
      this.oauth[ this.prefix + 'timestamp'] = (Date.now() / 1000 | 0) + 1;// cuting off decimal part by 
                                                   // converting it to 32 bit integer in bitwise OR operation. 
   }

   return function(){
      var r = new twtOAuth(); 
      
      return {
          getRequestToken : r.getRequestToken.bind(r),
          getSessionData: r.getSessionData.bind(r),
          accessTwitter: r.accessTwitter.bind(r)
      } 
   }
 });


}



