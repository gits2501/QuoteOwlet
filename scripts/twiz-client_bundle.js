!function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){return o(e[i][1][r]||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}({1:[function(require,module,exports){var OAuth=require("twiz-client-oauth"),deliverData=require("twiz-client-redirect").prototype.deliverData;function AccessToken(){OAuth.call(this),this.name=this.leg[2],this.redirectionUrlParsed,this.redirectionData,this.loadedRequestToken,this.authorized,this.winLoc=window.location.href,this.addCustomErrors({verifierNotFound:'"oauth_verifier" string was not found in redirection(callback) url.',tokenNotFound:'"oauth_token" string was not found in redirection(callback) url.',tokenMissmatch:"Request token and token from redirection(callback) url do not match",requestTokenNotSet:"Request token was not set",requestTokenNotSaved:"Request token was not saved. Check that page url from which you make request match your redirection_url.",noRepeat:"Cannot make another request with same redirection(callback) url",urlNotFound:"Current window location (url) not found",noSessionData:"Unable to find session data in current url",spaWarning:"Authorization data not found in url"})}(AccessToken.prototype=Object.create(OAuth.prototype)).setAuthorizedTokens=function(){this.parseRedirectionUrl(this.winLoc),this.isAuthorizationDataInURL()&&(this.authorize(this.redirectionData),this.oauth[this.prefix+"verifier"]=this.authorized.oauth_verifier,this.oauth[this.prefix+"token"]=this.authorized.oauth_token)},AccessToken.prototype.parseRedirectionUrl=function(url){var str=this.parse(url,/\?/g,/#/g);this.redirectionData=this.parseQueryParams(str),this.redirectionUrlParsed=!0},AccessToken.prototype.parse=function(str,delimiter1,delimiter2){if(!str)throw this.CustomError("urlNotFound");var end,start=str.search(delimiter1);return end=delimiter2&&-1!==str.search(delimiter2)?str.search(delimiter2):str.length,str.substring(start,end)},AccessToken.prototype.parseQueryParams=function(str){var arr;return"?"===str[0]&&(str=str.substring(1)),arr=str.split("&").map(function(el){return el.split("=")}),this.objectify(arr)},AccessToken.prototype.objectify=function(array){for(var data={},len=array.length,i=0;i<len;i++)for(var arr=array[i],j=0;j<arr.length;j++)0==j&&(data[arr[j]]=arr[j+1]);return data},AccessToken.prototype.isAuthorizationDataInURL=function(){if(this.redirectionData.oauth_token||this.redirectionData.oauth_verifier)return!0;throw this.CustomError("spaWarning")},AccessToken.prototype.authorize=function(sent){if(this.isRequestTokenUsed(window.localStorage))throw this.CustomError("noRepeat");if(!sent.oauth_verifier)throw this.CustomError("verifierNotFound");if(!sent.oauth_token)throw this.CustomError("tokenNotFound");if(this.loadRequestToken(window.localStorage,sent),sent.oauth_token!==this.loadedRequestToken)throw this.CustomError("tokenMissmatch");return this.authorized=sent},AccessToken.prototype.isRequestTokenUsed=function(storage){return"null"===storage.requestToken_},AccessToken.prototype.loadRequestToken=function(storage){if(!storage.hasOwnProperty("requestToken_"))throw this.CustomError("requestTokenNotSaved");if(this.loadedRequestToken=storage.requestToken_,storage.requestToken_=null,!this.loadedRequestToken)throw this.CustomError("requestTokenNotSet")},AccessToken.prototype.getSessionData=function(){if(this.redirectionUrlParsed||this.parseRedirectionUrl(window.location.href),this.redirectionData.data)return this.sessionData=this.parseSessionData(this.redirectionData.data),this.sessionData;console.warn(this.messages.noSessionData)},AccessToken.prototype.parseSessionData=function(str){return/%[0-9A-Z][0-9A-Z]/g.test(str)&&(str=decodeURIComponent(decodeURIComponent(str))),this.parseQueryParams(str)},AccessToken.prototype.deliverData=deliverData,module.exports=AccessToken},{"twiz-client-oauth":2,"twiz-client-redirect":4}],2:[function(require,module,exports){var btoa,Options=require("twiz-client-options"),percentEncode=require("twiz-client-utils").percentEncode,formEncode=require("twiz-client-utils").formEncode;function OAuth(){Options.call(this),this.leadPrefix="OAuth ",this.prefix="oauth_",this.oauth={},this.oauth[this.prefix+"consumer_key"]="",this.oauth[this.prefix+"signature"]="",this.oauth[this.prefix+"nonce"]="",this.oauth[this.prefix+"signature_method"]="",this.oauth[this.prefix+"timestamp"]="",this.oauth[this.prefix+"version"]="",this[this.leg[0]]={},this[this.leg[0]][this.prefix+"callback"]="",this[this.leg[2]]={},this[this.leg[2]][this.prefix+"token"]="",this[this.leg[2]][this.prefix+"verifier"]="",this.apiCall={},this.apiCall[this.prefix+"token"]="",this.OAuthParams=function(action,o1,o2){return Object.getOwnPropertyNames(o2).map(function(key){"add"===action?o1[key]=o2[key]:delete o1[key]}),o1}}btoa="object"==typeof window&&null!=window?window.btoa:require("btoa"),(OAuth.prototype=Object.create(Options.prototype)).setNonUserParams=function(){this.setSignatureMethod(),this.setNonce(),this.setTimestamp(),this.setVersion()},OAuth.prototype.setSignatureMethod=function(method){this.oauth[this.prefix+"signature_method"]=method||"HMAC-SHA1"},OAuth.prototype.setVersion=function(version){this.oauth[this.prefix+"version"]=version||"1.0"},OAuth.prototype.setNonce=function(){for(var seeds="AaBb1CcDd2EeFf3GgHh4IiJjK5kLl6MmN7nOo8PpQqR9rSsTtU0uVvWwXxYyZz",nonce="",i=0;i<31;i++)nonce+=seeds[Math.round(Math.random()*(seeds.length-1))];nonce=btoa(nonce).replace(/=/g,""),this.oauth[this.prefix+"nonce"]=nonce},OAuth.prototype.setTimestamp=function(){this.oauth[this.prefix+"timestamp"]=1+(Date.now()/1e3|0)},OAuth.prototype.addQueryParams=function(phase,leg){this.options.queryParams[phase+"Host"]=this.twtUrl.domain,this.options.queryParams[phase+"Path"]="leg"===phase?this.twtUrl.path+leg:this.twtUrl.api_path+this.UserOptions.path+this.UserOptions.paramsEncoded,this.options.queryParams[phase+"Method"]="leg"===phase?this.httpMethods[leg]:this.UserOptions.method,this.options.queryParams[phase+"SBS"]=this.genSignatureBaseString(leg),this.options.queryParams[phase+"AH"]=this.genHeaderString()},OAuth.prototype.genSignatureBaseString=function(leg){this.signatureBaseString="";var pair,key,value,method,url,a=[];for(var name in this.oauth)this.oauth.hasOwnProperty(name)&&a.push(name);a.sort();for(var i=0;i<a.length;i++){switch(key=a[i]){case"oauth_callback":value=this.session_data?this.appendToCallback(this.session_data):this.oauth[this.prefix+"callback"];break;case"oauth_consumer_key":value="";break;case"oauth_signature":continue;default:value=this.oauth[key]}pair=percentEncode(key)+"="+percentEncode(value),i!==a.length-1&&(pair+="&"),this.signatureBaseString+=pair}return"string"==typeof leg?(method=(method=this.httpMethods[leg]).toUpperCase()+"&",url=this.absoluteUrls[leg]):(method=leg.method.toUpperCase()+"&",url=this.twtUrl.protocol+this.twtUrl.domain+this.twtUrl.api_path+leg.path),url=percentEncode(url)+"&",this.signatureBaseString=method+url+percentEncode(this.signatureBaseString),this.signatureBaseString},OAuth.prototype.genHeaderString=function(){var a=[];for(var name in Object.getOwnPropertyNames(this.oauth).forEach(function(el){/^oauth/.test(el)||delete this[el]},this.oauth),this.oauth)a.push(name);a.sort();for(var key,value,pair,headerString=this.leadPrefix,i=0;i<a.length;i++)key=a[i],value=this.oauth[key],pair=(key=percentEncode(key))+"="+(value='"'+percentEncode(value)+'"'),i!==a.length-1&&(pair+=", "),headerString+=pair;return headerString},OAuth.prototype.appendToCallback=function(data,name){name||(name="data");var callback=this.oauth[this.prefix+"callback"],fEncoded=formEncode(data,!0),queryString=name+"="+percentEncode(fEncoded);return/\?/.test(callback)?queryString="&"+queryString:callback+="?",this.oauth[this.prefix+"callback"]=callback+queryString,this.oauth[this.prefix+"callback"]},module.exports=OAuth},{btoa:void 0,"twiz-client-options":3,"twiz-client-utils":7}],3:[function(require,module,exports){var utils=require("twiz-client-utils"),formEncode=utils.formEncode,CustomError=(utils.request,utils.CustomError);function Options(){this.leg=["request_token","authorize","access_token"],this.httpMethods={},this.httpMethods[this.leg[0]]="POST",this.httpMethods[this.leg[1]]="GET",this.httpMethods[this.leg[2]]="POST",this.twtUrl={protocol:"https://",domain:"api.twitter.com",path:"/oauth/",api_path:"/1.1/"},this.apiUrl=this.twtUrl.protocol+this.twtUrl.domain+this.twtUrl.path,this.absoluteUrls={},this.absoluteUrls[this.leg[0]]=this.apiUrl+this.leg[0],this.absoluteUrls[this.leg[1]]=this.apiUrl+this.leg[1],this.absoluteUrls[this.leg[2]]=this.apiUrl+this.leg[2],this.lnkLabel={name:"twiz_",data:{id:"he who dares "}},this.UserOptions={host:"",path:"",method:"",params:"",paramsEncoded:"",SBS:"",AH:"",body:"",encoding:""},this.options={},this.options.url="",this.options.method="",this.options.queryParams={legHost:"",legPath:"",legMethod:"",legSBS:"",legAH:""},this.options.body="",this.options.encoding="",this.options.beforeSend="",this.options.callback="",this.options.chunked="",this.options.parse=!0,CustomError.call(this),this.addCustomErrors({redirectionUrlNotSet:"You must provide a redirection_url to which users will be redirected.",noStringProvided:"You must provide a string as an argument.",serverUrlNotSet:"You must proivide server url to which request will be sent",optionNotSet:"Check that 'method' and 'path' are set."})}Options.prototype.setUserParams=function(args){var temp;for(var prop in args)switch(temp=args[prop],prop){case"server_url":this.server_url=temp;break;case"redirection_url":this[this.leg[0]].oauth_callback=temp;break;case"method":this.method=temp;break;case"new_window":for(var data in this.newWindow={},temp)if(temp.hasOwnProperty(data))switch(data){case"name":case"features":this.newWindow[data]=temp[data]}break;case"callback":this.callback_func=temp;break;case"session_data":this.session_data=temp;break;case"stream":this.options.queryParams.stream=temp;break;case"options":for(var opt in temp)switch(opt){case"method":case"path":this.UserOptions[opt]=temp[opt];break;case"params":this.UserOptions[opt]=temp[opt],this.UserOptions.paramsEncoded="?"+formEncode(temp[opt],!0);break;case"body":case"encoding":case"beforeSend":case"chunked":this.UserOptions[opt]=temp[opt]}break;case"endpoints":for(var leg in temp)switch(leg){case"request_token":case"authorize":case"access_token":this.absoluteUrls[leg]=this.apiUrl+temp[leg]}}},Options.prototype.checkUserParams=function(leg){if(!this.server_url)throw this.CustomError("serverUrlNotSet");leg===this.leg[0]&&this.checkRedirectionCallback(),this.checkApiOptions()},Options.prototype.checkRedirectionCallback=function(){if(!this[this.leg[0]].oauth_callback)throw this.CustomError("redirectionUrlNotSet")},Options.prototype.checkApiOptions=function(){for(var opt in this.UserOptions)if(("path"===opt||"method"==opt)&&!this.UserOptions[opt])throw this.CustomError("optionNotSet")},Options.prototype.setRequestOptions=function(leg){this.options.url=this.server_url,this.options.method=this.method||this.httpMethods[leg],this.options.body=this.UserOptions.body,this.options.encoding=this.UserOptions.encoding,this.options.beforeSend=this.UserOptions.beforeSend,this.options.chunked=this.UserOptions.chunked},module.exports=Options},{"twiz-client-utils":7}],4:[function(require,module,exports){var CustomError=require("twiz-client-utils").CustomError,throwAsyncError=require("twiz-client-utils").throwAsyncError;function Redirect(args){this.newWindow=args.newWindow,this.url=args.redirectionUrl,this.callback_func=args.callback_func,this.reject=args.reject,this.requestToken,CustomError.call(this),this.addCustomErrors({noCallbackFunc:"You must specify a callback function",callbackURLnotConfirmed:"Redirection(callback) url you specified wasn't confirmed by Twitter"})}Redirect.prototype.redirection=function(resolve,res){!(this.res=res).error&&res.data.oauth_token?(this.requestToken=res.data,this.confirmCallback(res.data),this.saveRequestToken(window.localStorage,res.data.oauth_token),this.redirect(resolve)):this.deliverData(resolve,res)},Redirect.prototype.deliverData=function(resolve,res){resolve?resolve(res):this.callback_func?this.callback_func(res):this.throwAsyncError(this.CustomError("noCallbackFunc"))},Redirect.prototype.throwAsyncError=throwAsyncError,Redirect.prototype.confirmCallback=function(sent){"true"!==sent.oauth_callback_confirmed&&this.throwAsyncError(this.CustomError("callbackURLnotConfirmed"))},Redirect.prototype.saveRequestToken=function(storage,token){storage.requestToken_=null,storage.requestToken_=token},Redirect.prototype.redirect=function(resolve){var url=this.url+"?oauth_token="+this.requestToken.oauth_token;this.adjustResponse(this.res),this.newWindow?this.site(resolve,url):this.SPA(resolve,url)},Redirect.prototype.adjustResponse=function(res){res.data=""},Redirect.prototype.SPA=function(resolve,url){function redirectCurrentWindow(){window.location=url}return this.res.redirection=!0,resolve?(resolve(this.res),void Promise.resolve().then(function(){redirectCurrentWindow()})):this.callback_func?(this.callback_func(this.res),void setTimeout(function(){redirectCurrentWindow()},0)):void this.throwAsyncError(this.CustomError("noCallbackFunc"))},Redirect.prototype.site=function(resolve,url){var opened=this.openWindow();opened.location=url,this.res.window=opened,this.deliverData(resolve,this.res)},Redirect.prototype.openWindow=function(){return this.newWindow.window=window.open("",this.newWindow.name,this.newWindow.features),this.newWindow.window},module.exports=Redirect},{"twiz-client-utils":7}],5:[function(require,module,exports){var CustomError=require("twiz-client-utils").CustomError,formEncode=require("twiz-client-utils").formEncode,throwAsyncError=require("twiz-client-utils").throwAsyncError,request=function(){var request={};return CustomError.call(request),request.addCustomErrors({cbAlreadyCalled:"Callback function has already been called.",cbWasNotCalled:"Calback function provided was not called.",urlNotSet:"You must provide url for the request you make",callbackNotProvided:"Callback function was not provided.",notJSON:"Received data not in JSON format",encodingNotSupported:"Encoding you provided is not supported",noContentType:"Failed to get content-type header from response. Possible CORS restrictions or header missing.",methodMustBePOST:"If request has body, method must be POST",chunkedResponseWarning:"Stream is consumed chunk by chunk in xhr.onprogress(..) callback"}),request.initRequest=function(args){var temp;for(var prop in this.request=this.createRequest(),args)if(args.hasOwnProperty(prop))switch(temp=args[prop],prop){case"url":this.setUrl(temp);break;case"queryParams":this.setQuery(temp);break;case"callback":this.addListener(temp);break;case"method":this.method=temp.toUpperCase()||"GET";break;case"body":this.body=temp;break;case"parse":this.parse=temp;break;case"encoding":this.encoding=temp;break;case"beforeSend":this.beforeSend=temp;break;case"chunked":this.chunked=temp;break;case"reject":this.reject=temp}if(!this.url)throw this.CustomError("urlNotSet");if(this.method||(this.method="GET"),!this.request.onreadystatechange)throw this.CustomError("callbackNotProvided");this.sendRequest()},request.createRequest=function(){try{return new XMLHttpRequest}catch(e){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){return new ActiveXObject("Msxml12.XMLHTTP")}}},request.setUrl=function(url){this.url?this.url=url+this.url:this.url=url},request.setQuery=function(queryParams){this.queryString=formEncode(queryParams),-1===this.url.indexOf("?")&&(this.url+="?"),this.url+=this.queryString},request.addListener=function(callback){var alreadyCalled=!1;this.request.onreadystatechange=function(){if(4===this.request.readyState){alreadyCalled&&this.throwAsyncError(this.CustomError("cbAlreadyCalled")),alreadyCalled=!0;var statusCode=this.request.status,contentType=this.request.getResponseHeader("Content-type");this.invokeCallback(statusCode,contentType,callback)}}.bind(this)},request.throwAsyncError=throwAsyncError,request.invokeCallback=function(statusCode,contentType,callback){var err,data,temp;if(this.chunked)this.throwAsyncError(this.CustomError("chunkedResponseWarning"));else{if(!contentType)throw this.throwAsyncError(this.CustomError("noContentType"));switch(contentType=contentType.split(";")[0]){case"application/json":try{temp=this.parse?JSON.parse(this.request.responseText):this.request.responseText}catch(e){this.throwAsyncError(this.CustomError("notJSON"))}break;case"application/xml":temp=this.request.responseXML;break;case"application/x-www-url-formencoded":temp={},this.request.responseText.trim().split("&").forEach(function(el){var pairs=el.split("="),name=decodeURIComponent(pairs[0].replace(/\+/g," ")),value=decodeURIComponent(pairs[1].replace(/\+/g," "));temp[name]=value},temp);break;default:temp=this.request.responseText}200!==statusCode?err={statusCode:statusCode,statusText:this.request.statusText,data:temp}:data=temp,callback({error:err,data:data,xhr:this.request})}},request.setHeader=function(header,value){this.request.setRequestHeader(header,value)},request.setBody=function(){if("GET"===this.method)throw this.CustomError("methodMustBePOST");if(this.encoding)switch(this.encoding.toLowerCase()){case"form":this.body=formEncode(this.body),this.setHeader("Content-Type","application/x-www-url-formencoded;charset=utf-8");break;case"json":this.body=JSON.stringify(this.body),this.setHeader("Content-Type","application/json;charset=utf-8");break;case"text":this.setHeader("Content-Type","text/plain;charset=utf-8");break;default:throw this.CustomError("encodingNotSupported")}else this.setHeader("Content-Type","text/plain")},request.sendRequest=function(){"0"==this.request.readyState&&this.request.open(this.method,this.url),this.beforeSend&&this.beforeSend(this.request),this.body?this.setBody():this.body=null,this.request.send(this.body)},function(args){var r=Object.create(request);if(!args)return{initRequest:r.initRequest.bind(r)};r.initRequest(args)}}();module.exports=request},{"twiz-client-utils":7}],6:[function(require,module,exports){var OAuth=require("twiz-client-oauth");function RequestToken(){OAuth.call(this),this.name=this.leg[0]}RequestToken.prototype=Object.create(OAuth.prototype),module.exports=RequestToken},{"twiz-client-oauth":2}],7:[function(require,module,exports){"use strict";function percentEncode(str){return encodeURIComponent(str).replace(/[!'()*]/g,function(c){return"%"+c.charCodeAt(0).toString(16)})}module.exports={percentEncode:percentEncode,formEncode:function formEncode(dataObj,spaces){var value,key,type,pairs=[];for(var name in dataObj)type=typeof dataObj[name],dataObj.hasOwnProperty(name)&&"function"!==type&&"null"!==dataObj[name]&&(key=percentEncode(name),value=percentEncode("object"===type?value=formEncode(dataObj[name],spaces):dataObj[name]),spaces||(key=key.replace(/%20/g,"+"),value=value.replace(/%20/g,"+")),pairs.push(key+"="+value));return pairs.join("&")},CustomError:function(){this.messages={},this.addCustomErrors=function(errors){Object.getOwnPropertyNames(errors).map(function(name){this.messages[name]=errors[name]},this)},this.CustomError=function(name){var err=Error(this.messages[name]);return err.name=name,err}},throwAsyncError:function(error){if(Promise)return this.reject(error);throw error}}},{}],8:[function(require,module,exports){"use strict";!function(){var RequestToken=require("twiz-client-requesttoken"),Redirect=require("twiz-client-redirect"),AccessToken=require("twiz-client-accesstoken"),request=require("twiz-client-request");function buildOAuthLeg(leg_){function OAuthLegBuilder(){leg_.call(this),this.legParams=this[this.name],this.phases={leg:"",api:"",other:""};var setOAuthLeg=function(args){this.setUserParams(args),this.checkUserParams(this.name),this.setNonUserParams(),this.OAuthParams("add",this.oauth,this.legParams),this.specificAction&&this.specificAction(),this.setRequestOptions(this.name),this.addQueryParams(this.phases.leg.toString(),this.name)}.bind(this);setOAuthLeg.toString=function(){return"leg"};var setAPI=function(){this.OAuthParams("remove",this.oauth,this.legParams),this.OAuthParams("add",this.oauth,this.apiCall),this.UserOptions.params&&(this.oauth=this.OAuthParams("add",this.UserOptions.params,this.oauth)),this.addQueryParams(this.phases.api.toString(),this.UserOptions)}.bind(this);setAPI.toString=function(){return"api"},this.phases.leg=setOAuthLeg,this.phases.api=setAPI}return(OAuthLegBuilder.prototype=Object.create(leg_.prototype)).OAuthLegPlus=function(args,resolve,reject){this.reject=reject,this.phases.leg(args),this.phases.api(),this.phases.other&&this.phases.other(),this.send(this.options,this.callback.bind(this,resolve))},OAuthLegBuilder.prototype.send=function(options,cb){options.callback=cb,options.reject=this.reject,request(options)},new OAuthLegBuilder}function twizClient(){this.OAuth=function(args){if(Promise)return this.promised(args,this.RequestTokenLeg());this.RequestTokenLeg().OAuthLegPlus(args)},this.finishOAuth=function(args){if(Promise)return this.promised(args,this.AccessTokenLeg());this.AccessTokenLeg().OAuthLegPlus(args)},this.promised=function(args,leg){return new Promise(function(resolve,reject){leg.OAuthLegPlus(args,resolve,reject)})},this.getSessionData=function(){return this.accessTokenLeg=this.accessTokenLeg||this.AccessTokenLeg(),this.accessTokenLeg.getSessionData()},this.RequestTokenLeg=function(){var requestTokenLeg=buildOAuthLeg(RequestToken);return requestTokenLeg.phases.other=function(){this.setUserParams({options:{path:"account/verify_credentials.json",method:"GET",params:{include_entities:!1,skip_status:!0,include_email:!0},paramsEncoded:""}}),this.oauth=this.OAuthParams("add",this.UserOptions.params,this.oauth),this.addQueryParams("ver",this.UserOptions)}.bind(requestTokenLeg),requestTokenLeg.callback=function(resolve,res){new Redirect({newWindow:this.newWindow,redirectionUrl:this.absoluteUrls[this.leg[1]],callback_func:this.callback_func,reject:this.reject}).redirection(resolve,res)},requestTokenLeg},this.AccessTokenLeg=function(){var accessTokenLeg=buildOAuthLeg(AccessToken);return accessTokenLeg.specificAction=function(){this.setAuthorizedTokens()},accessTokenLeg.callback=function(resolve,res){this.deliverData(resolve,res)},accessTokenLeg}}function twiz(){var r=new twizClient;return{OAuth:r.OAuth.bind(r),finishOAuth:r.finishOAuth.bind(r),getSessionData:r.getSessionData.bind(r)}}"object"==typeof window&&"null"!==window?window.twizClient=twiz:"object"==typeof module&&"null"!==module&&(module.exports=twiz)}()},{"twiz-client-accesstoken":1,"twiz-client-redirect":4,"twiz-client-request":5,"twiz-client-requesttoken":6}]},{},[8]);