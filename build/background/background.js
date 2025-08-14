chrome.runtime.onInstalled.addListener(()=>{console.log("YTweaks extension installed!")});chrome.runtime.onMessage.addListener((e,n,s)=>{console.log("Received message:",e),s({status:"ok"})});
