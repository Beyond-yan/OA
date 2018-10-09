/**
 * 集成软航Office在线编辑控件
 * @param {} conf
 * @return {}
 */
var present;//当前的ext面板
var win;//当前打开的窗口
var officeObj;//当前的officeObj对象
var BookMarkName = "content";//套红书签名
var state=0;//临时状态、
var archives;
/*
谷歌浏览器事件接管
*/
function OnComplete2(type,code,html){//这里是回调函数定义
	var obj=Ext.util.JSON.decode(html);
	if(present==null){
		if (obj && obj.success) {
			fileId = obj.fileId;
		   	docPath = obj.filePath;
		   	win.close();
		} else {
			Ext.ux.Toast.msg('操作信息', '保存文档出错！');
			return;
		}
	}else{
		if (obj && obj.success) {
			fileId = obj.fileId;
		   	docPath = obj.filePath;
		   	present.formPanel.getCmpByName('archivesDoc.docPath').setValue(docPath);
		} else {
			Ext.ux.Toast.msg('操作信息', '保存文档出错！！！');
			return;
		}
		present.formPanel.getForm().submit({
			method : 'POST',
			// waitMsg : '正在提交数据...',
			params : {
				docPath : docPath,
				fileId : fileId
			},
			success : function(fp, action) {
				Ext.ux.Toast.msg('操作信息', '成功保存附加文档！');
				var result = Ext.util.JSON.decode(action.response.responseText);
				// 把添加的文档记录实体返回
				if(present.callback){
					present.callback.call(present, result.data);
				}					
				present.close();
			},
			failure : function(fp, action) {
				Ext.MessageBox.show({
							title : '操作信息',
							msg : '信息保存出错，请联系管理员！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
	}
}

/**
 * 非ie文件打开回调函数
 */
function OnComplete3(str,doc){
	if(state!=0){
		with(officeObj.ActiveDocument.Application.Options){
			LineSpacingRule = 'wdLineSpaceExactly';
			LineSpacing = '29.7';
			//PasteFormatBetweenDocuments = 0;
			//PasteFormatBetweenStyledDocuments=0;
		}//这里是套红的代码。
		officeObj.ActiveDocument.Application.Selection.GoTo(-1,0,0,'content')  //将光标定位到书签处
		officeObj.ActiveDocument.Application.Selection.PasteAndFormat(16);   //粘贴复制的内容
		var number=officeObj.GetBookmarkValue('number');
		var number1=archives.archivesNo;
		//	var length=(number.length-number1.length-archives.issuer.length)/2+3;
		var num=archives.archivesNo.split("〕")[1];
		var num1=num.substr(0,num.length-1);
		var length=28-number1.length-archives.issuer.length;
		length=length+parseInt(num1.length/2);
		if(length<=4){
			for(var i=1;i<length;i++ ){
				number1+=" ";
			}
		}else if (length<=10){
			for(var i=3;i<length;i++ ){
				number1+="  ";
			}
		}else{
			for(var i=4;i<length;i++ ){
				number1+="  ";
			}
		}
		
		officeObj.SetBookmarkValue('name',archives.issuer)  //设置指定书签的值
		var date=new Date(archives.writtenDate);
		var d2 = date.getFullYear() + "年"+ (date.getMonth() + 1) +"月"+ date.getDate() +"日";
		officeObj.SetBookmarkValue('date',d2)  //设置指定书签的值
/*		var dep=officeObj.GetBookmarkValue('department');
		var dep1=archives.issueDep;
		var depLength=(dep.length-dep1.length)/2;
		for(var i=0;i<depLength;i++ ){
			dep1+="	";
		}
		officeObj.SetBookmarkValue('department',dep1)  //设置指定书签的值
*/		officeObj.SetBookmarkValue('number',number1)  //设置指定书签的值
		state=0;
	}
	
}
function OnComplete4(type,code,html){//这里是回调函数定义
	
}

NtkOfficePanel=function(conf){
	var isFileOpen=false;
	conf.doctype=conf.doctype?conf.doctype:'doc';
	var suffix =conf.docName.split(".")[1].toLowerCase();
	var fileId=conf.fileId?conf.fileId:'';
	var status=conf.status;
	var tempPath=conf.tempPath;
	archives=conf.archives;
	var usetemplate=conf.usetemplate?conf.usetemplate:0;
	var deftemplatekey=conf.deftemplatekey?conf.deftemplatekey:'';
	officeObj = document.createElement('object');
	officeObj.id='officeObj';
	var p=document.createElement("param");
	//
	var userAgent = navigator.userAgent, 
	rMsie = /(msie\s|trident.*rv:)([\w.]+)/, 
	rFirefox = /(firefox)\/([\w.]+)/, 
	rOpera = /(opera).+version\/([\w.]+)/, 
	rChrome = /(chrome)\/([\w.]+)/, 
	rSafari = /version\/([\w.]+).*(safari)/;
	var browser;
	var version;
	var ua = userAgent.toLowerCase();
	function uaMatch(ua) {
		var match = rMsie.exec(ua);
		if (match != null) {
			return { browser : "IE", version : match[2] || "0" };
		}
		var match = rFirefox.exec(ua);
		if (match != null) {
			return { browser : match[1] || "", version : match[2] || "0" };
		}
		var match = rOpera.exec(ua);
		if (match != null) {
			return { browser : match[1] || "", version : match[2] || "0" };
		}
		var match = rChrome.exec(ua);
		if (match != null) {
			return { browser : match[1] || "", version : match[2] || "0" };
		}
		var match = rSafari.exec(ua);
		if (match != null) {
			return { browser : match[2] || "", version : match[1] || "0" };
		}
		if (match != null) {
			return { browser : "", version : "0" };
		}
	}
	var browserMatch = uaMatch(userAgent.toLowerCase());
	if (browserMatch.browser) {
		browser = browserMatch.browser;
		version = browserMatch.version;
	}

	var classidx64="A64E3073-2016-4baf-A89D-FFE1FAA10EE0";
	var classid="A64E3073-2016-4baf-A89D-FFE1FAA10EC0";
	var codebase=__ctxPath+'/js/core/officecontrol/OfficeControl.cab#version=5,0,3,9';
	var codebase64=__ctxPath+'/js/core/officecontrol/OfficeControlX64.cab#version=5,0,3,9';
	officeObj.width = "100%";
	officeObj.height = "100%";
	if (browser == "IE") {
		if (window.navigator.platform == "Win32") {
			p.setAttribute('name','IsUseUTF8URL');
			p.setAttribute('value','-1');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','IsUseUTF8Data');
			p.setAttribute('value','-1');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','BorderStyle');
			p.setAttribute('value','1');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','BorderColor');
			p.setAttribute('value','14402205');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','TitlebarColor');
			p.setAttribute('value','15658734');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','ekeytype');
			p.setAttribute('value','14');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MakerCaption');
			p.setAttribute('value','');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MakerKey');
			p.setAttribute('value','');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','ProductCaption');
			p.setAttribute('value','重庆交通办公自动化平台');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','ProductKey');
			p.setAttribute('value','E01C4871EE25AF4B5AD9EF0337B6153BEA455FC7');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MakerCaption');
			p.setAttribute('value','');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','TitlebarTextColor');
			p.setAttribute('value','0');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MenubarColor');
			p.setAttribute('value','14402205');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MenuButtonColor');
			p.setAttribute('value','16180947');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MenuBarStyle');
			p.setAttribute('value','3');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MenuButtonStyle');
			p.setAttribute('value','7');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','WebUserName');
			p.setAttribute('value',curUserInfo.fullname);
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','Caption');
			p.setAttribute('value','在线文档编辑器');
			officeObj.appendChild(p);
			/*p=document.createElement('script');
			p.setAttribute('for','officeObj');
			p.setAttribute('event','AfterPublishAsPDFToURL(ret,code)');
			officeObj.appendChild(p);*/
			officeObj.classid= "clsid:"+classid; 
			officeObj.codebase = codebase;
		}
		if (window.navigator.platform == "Win64") {
			p.setAttribute('name','IsUseUTF8URL');
			p.setAttribute('value','-1');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','IsUseUTF8Data');
			p.setAttribute('value','-1');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','BorderStyle');
			p.setAttribute('value','1');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','BorderColor');
			p.setAttribute('value','14402205');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','TitlebarColor');
			p.setAttribute('value','15658734');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','isoptforopenspeed');
			p.setAttribute('value','0');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','TitlebarTextColor');
			p.setAttribute('value','0');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MakerCaption');
			p.setAttribute('value','');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MakerKey');
			p.setAttribute('value','');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','ProductCaption');
			p.setAttribute('value','重庆交通办公自动化平台');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','ProductKey');
			p.setAttribute('value','E01C4871EE25AF4B5AD9EF0337B6153BEA455FC7');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MenubarColor');
			p.setAttribute('value','14402205');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MenuButtonColor');
			p.setAttribute('value','16180947');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MenuBarStyle');
			p.setAttribute('value','3');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','MenuButtonStyle');
			p.setAttribute('value','7');
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','WebUserName');
			p.setAttribute('value',curUserInfo.fullname);
			officeObj.appendChild(p);
			p=document.createElement('param');
			p.setAttribute('name','Caption');
			p.setAttribute('value','在线文档编辑器');
			officeObj.appendChild(p);
			officeObj.classid= "clsid:"+classidx64; 
			officeObj.codebase = __ctxPath+codebase64;
		}
	} else if (browser == "firefox") {
		officeObj.type= "application/ntko-plug"; 
		officeObj.setAttribute("codebase", __ctxPath+codebase);
		officeObj.setAttribute("ForOnSaveToURL","OnComplete2");	 
		officeObj.setAttribute("ForOndocumentopened","OnComplete3");
		officeObj.setAttribute("ForOpenFromURL","OnComplete4");
		officeObj.setAttribute("ForOnPublishAsPDFToURL","OnComplete2");//这里是火狐定义的回调	
		officeObj.setAttribute("_IsUseUTF8URL","-1");
		officeObj.setAttribute("_MakerCaption","");
		officeObj.setAttribute("_MakerKey","");
		officeObj.setAttribute("_ProductCaption","重庆交通办公自动化平台");
		officeObj.setAttribute("_ProductKey","E01C4871EE25AF4B5AD9EF0337B6153BEA455FC7"); 
		officeObj.setAttribute("_IsUseUTF8Data","-1");
		officeObj.setAttribute("_BorderStyle","1");
		officeObj.setAttribute("_BorderColor","14402205");
		officeObj.setAttribute("_MenubarColor","14402205");
		officeObj.setAttribute("_MenuButtonColor","16180947");
		officeObj.setAttribute("_MenuBarStyle","3");
		officeObj.setAttribute("_MenuButtonStyle","7");
		officeObj.setAttribute("_WebUserName",curUserInfo.fullname);
		officeObj.setAttribute("_Caption","在线文档编辑器");
		officeObj.setAttribute("clsid",'{' + classid + '}');
		p=document.createElement('SPAN');
		p.setAttribute('STYLE','color:red');
		p.innerHTML='尚未安装跨浏览器插件。请点击<a href="'+__ctxPath+'/downFile/重庆交通办公自动化平台.exe">安装组件</a>';
		officeObj.appendChild(p);
	} else if (browser == "chrome") {
			officeObj.setAttribute("clsid",'{' + classid + '}');
			officeObj.setAttribute("ForOnSaveToURL","OnComplete2");	 
			officeObj.setAttribute("ForOndocumentopened","OnComplete3");
			officeObj.setAttribute("ForOnpenFromURL","OnComplete4");
			officeObj.setAttribute("ForOnPublishAsPDFToURL","OnComplete2");	
			officeObj.setAttribute("codebase", codebase);
			officeObj.type= "application/ntko-plug"; 
			officeObj.setAttribute("_MakerCaption","");
			officeObj.setAttribute("_MakerKey","");
			officeObj.setAttribute("_ProductCaption","重庆交通办公自动化平台");
			officeObj.setAttribute("_ProductKey","E01C4871EE25AF4B5AD9EF0337B6153BEA455FC7"); 
			officeObj.setAttribute("_IsUseUTF8URL","-1");
			officeObj.setAttribute("_IsUseUTF8Data","-1");
			officeObj.setAttribute("_BorderStyle","1");
			officeObj.setAttribute("_BorderColor","14402205");
			officeObj.setAttribute("_MenubarColor","14402205");
			officeObj.setAttribute("_MenuButtonColor","16180947");
			officeObj.setAttribute("_MenuBarStyle","3");
			officeObj.setAttribute("_MenuButtonStyle","7");
			officeObj.setAttribute("_WebUserName",curUserInfo.fullname);
			officeObj.setAttribute("_Caption","在线文档编辑器");
			p=document.createElement('SPAN');
			p.setAttribute('STYLE','color:red');
			p.innerHTML='尚未安装跨浏览器插件。请点击<a href="'+__ctxPath+'/downFile/重庆交通办公自动化平台.exe">安装组件</a>';
			officeObj.appendChild(p);
	} else if (Sys.opera) {
		alert("sorry,ntko web印章暂时不支持opera!");
	} else if (Sys.safari) {
		alert("sorry,ntko web印章暂时不支持safari!");
	}
	var panelConf={border:false,layout:'fit'};

	/**
	 * 保存文档
	 */
	var saveFn=function(config){		
		fileId=config.fileId?config.fileId:'';
		var docName=config.docName?config.docName:'未命名';
		officeObj.IsUseUTF8URL=true;
     	officeObj.IsUseUTF8Data=true;
		//var result= officeObj.SaveToURL(__fullPath + '/file-upload',"document/saveOnlineManage","fileId="+fileId+'&&file_cat=document/saveOnlineManage',docName+'.'+conf.doctype,0);
     	var result= officeObj.SaveToURL(__fullPath + '/file-upload',"document/saveOnlineManage","fileId="+fileId+'&&file_cat=document/saveOnlineManage',docName,0);
		if(browser == "IE"){
			var obj=Ext.util.JSON.decode(result);
			if(obj && obj.success){
				fileId=obj.fileId;
			}else{
				obj={success:false};
			}
			return obj;
		}
	};
	/**
	 * 将word转换为pdf
	 */
	var wordToPDF=function(config){		
		fileId=config.fileId?config.fileId:'';
		var docName=config.docName?config.docName:'未命名';
		officeObj.IsUseUTF8URL=true;
     	officeObj.IsUseUTF8Data=true;
		//var result= officeObj.SaveToURL(__fullPath + '/file-upload',"document/saveOnlineManage","fileId="+fileId+'&&file_cat=document/saveOnlineManage',docName+'.'+conf.doctype,0);
		officeObj.PublishAsPDFToURL(__fullPath + '/file-upload',"document/saveOnlineManage","fileId="+fileId+'&&file_cat=document/saveOnlineManage',docName,0);
	};
	/**
	 * 是否显示菜单
	 */
	if(conf.unshowMenuBar==undefined ||conf.unshowMenuBar==null){
		conf.unshowMenuBar=true;
	}
	if(conf.unshowMenuBar){
	    officeObj.Menubar=false; // 控制菜单栏
	    officeObj.IsShowEditMenu=false;
	    officeObj.FileNew=false;
	    officeObj.FileOpen=false;
	    officeObj.FileSave=false;
	    officeObj.FileSaveAs=false;
	    officeObj.Titlebar=false; // 控制标题栏
	}
	
	
	if(conf.showToolbar){
		var buttons=[];
		
		if(ntkoSaveTrace&&conf.doctype=='doc'){
            buttons.push({
		               text : '保留修改痕迹',
							iconCls : 'btn-archive-save-trace',
							handler : function() {
								if(isFileOpen){
									officeObj.ActiveDocument.Application.UserName=curUserInfo.fullname;
									officeObj.ActiveDocument.TrackRevisions=true;
							    }
						}
            });
            buttons.push('-');
		}
		if(ntkoCancelTrace&&conf.doctype=='doc'){
		   buttons.push({
						text : '取消保留痕迹',
						iconCls : 'btn-archive-cancel-trace',
						handler : function() {
							if(isFileOpen){
								officeObj.ActiveDocument.TrackRevisions=false;
							}
						}
					});
			buttons.push('-');
		}
		if(false && conf.doctype=='doc'){
		   buttons.push({
			   	    text : '清除痕迹',
					iconCls : 'btn-archive-eraser',
					handler : function() {
						if(isFileOpen){
							officeObj.ActiveDocument.AcceptAllRevisions();
						}
					}
			   });
			buttons.push('-');
		}
		//是否为报文并且未完成套红  
		if(archives!=null&&archives.archType==3&&ntkoRedPath!=""){
			buttons.push({
		            text:'模板套红',
					iconCls:'menu-template',
					scope:this,
					handler:function(){
						if(isFileOpen){
							 // if(ntkoRedPath!=""){
							    	//var headFileURL=__ctxPath+'/attachFiles/'+path;
							    	var headFileURL = __ctxPath + "/attachFiles/"+ ntkoRedPath;
								    if(officeObj.doctype!=1){return;}//OFFICE_CONTROL_OBJ.doctype=1为word文档
									//try{
										//选择对象当前文档的所有内容
										var curSel = officeObj.ActiveDocument.Application.Selection;
										curSel.WholeStory();									 //选中全文
										officeObj.ActiveDocument.Application.Selection.Copy();  //复制选中的
										officeObj.OpenFromURL(headFileURL);//打开模板文件 
										if(browser == "IE"){
											with(officeObj.ActiveDocument.Application.Options){
												LineSpacingRule = 'wdLineSpaceExactly';
												LineSpacing = '29.7';
												//PasteFormatBetweenDocuments = 0;
											//	PasteFormatBetweenStyledDocuments=0;
											}
											officeObj.ActiveDocument.Application.Selection.GoTo(-1,0,0,'content')  //将光标定位到书签处
											officeObj.ActiveDocument.Application.Selection.PasteAndFormat(16);   //粘贴复制的内容
											var number=officeObj.GetBookmarkValue('number');
											var number1=archives.archivesNo;
											var length=(number.length-number1.length-archives.issuer.length)/2+3;
											for(var i=0;i<length;i++ ){
												number1+="	";
											}
											officeObj.SetBookmarkValue('name',archives.issuer)  //设置指定书签的值
											var date=new Date(archives.writtenDate);
											var d2 = date.getFullYear() + "年"+ (date.getMonth() + 1) +"月"+ date.getDate() +"日";
											officeObj.SetBookmarkValue('date',d2)  //设置指定书签的值
											/*var dep=officeObj.GetBookmarkValue('department');
											var dep1=archives.issueDep;
											alert(dep.length+"--"+dep1.length);
											var depLength=(dep.length-dep1.length)/2;
											for(var i=0;i<depLength;i++ ){
												dep1+="	";
											}
											officeObj.SetBookmarkValue('department',dep1)  //设置指定书签的值
*/											officeObj.SetBookmarkValue('number',number1)  //设置指定书签的值
											
										}else{
											state=1;
										}
										ntkoTemplate=false;
							  //  }
							/*//密码验证
							new PaintTemplateSelector({callback:function(name,path){
							    this.close();
							  
							}}).show();*/
						}
						
					}
			});
			buttons.push('-');
		}
		
		if(false&&conf.doctype=='doc'||conf.doctype=='xls'){
		   buttons.push({
		     		text:'手写签名',
					iconCls:'',
					scope:this,
					handler:function(){
						if(isFileOpen){
							try {
							   officeObj.DoHandSign2(
										"ntko",//手写签名用户名称
										"ntko",//signkey,DoCheckSign(检查印章函数)需要的验证密钥。
										0,//left
										0,//top
										1,//relative,设定签名位置的参照对象.0：表示按照屏幕位置插入，此时，Left,Top属性不起作用。1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落（为兼容以前版本默认方式）
										100);
							}catch(err){
							}
						}
					}
		   });
			buttons.push('-');
		}
		//是否为报文并且未完成盖章	
		if(archives!=null&&archives.archType==3&&ntkoSealPath!=""){
			buttons.push({
			        text:'盖章',
					iconCls:'menu-seal',
					scope:this,
					handler:function(){
						if(ntkoSealPath!=''){
							//var signUrl=__ctxPath+'/attachFiles/'+path;
							if(officeObj.doctype==1||officeObj.doctype==2){
								try{
									officeObj.AddPicFromURL( __ctxPath + "/attachFiles/"+ntkoSealPath,
											true,//是否浮动图片
											0,//如果是浮动图片，相对于左边的Left 单位磅
											0,//如果是浮动图片，相对于当前段落Top
											1, //当前光标处
											116,//100 无缩放
											1 //文字上方
											);
									ntkoSeal=false;
									//ntkoSealPath="";
								}catch(error){
								
								}
							}
						}
						/*new SealSelector({callback:function(signUrl){
							this.close();
							
						}}).show();						*/
					}
				});
				buttons.push('-');
		}

		if(ntkoSealPath!=""&&ntkoRedPath!=""){
			   buttons.push({
			     		text:'生成二维码',
						iconCls:'',
						scope:this,
						handler:function(){
							if(isFileOpen){
								try {
									//console.log(archives);
									var data = "\n标题:"+archives.subject;
									    data += "\n文号:"+archives.archivesNo;
									    data += "\n发文单位:"+archives.issueDep;
									    data += "\n发文日期:"+archives.writtenDate;
									    data += "\n";
									//console.log(data);
									officeObj.Add2DCodePic(1, data, true, 300, 10, 1, 100, 1, true);	
								}catch(err){
								}
							}
						}
			   });
				buttons.push('-');
			}
		buttons.push({
	        text:'全屏',
			iconCls:'',
			scope:this,
			handler:function(){
				officeObj.FullScreenMode=true;
			}
		});
		
		panelConf.tbar=new Ext.Toolbar({
			items:buttons
		});
	}
	
	Ext.applyIf(panelConf,conf);

	var panel=new Ext.Panel(panelConf);
	panel.on('render', function() {
		setTimeout(function(){
			officeObj.ActiveDocument.Application.UserName=curUserInfo.fullname;
			officeObj.ActiveDocument.TrackRevisions=true;
		},500,officeObj);
	});
	panel.on('afterrender',function(){
			panel.body.appendChild(officeObj);
			//若使用了模板，则缺省打开模板
			if(fileId){
				try{
					officeObj.OpenFromURL(__ctxPath+'/file-download?fileId='+fileId);
					isFileOpen=true;
 					if(suffix=='pdf'){
						officeObj.AddDocTypePlugin(".pdf","PDF.NtkoDocument","4.0.0.0","./NTKOOleDocAll.dll",51,true);
					}
					with (officeObj.ActiveDocument.ActiveWindow.View){  //显示最终状态
						ShowRevisionsAndComments = false;
						RevisionsView =0;
					}
					if(conf.idoc){
						var doc = officeObj.ActiveDocument;
						with(conf.idoc){
							with(doc.Application.Selection) {
								Font.NameFarEast = "方正仿宋_GBK";
								Font.Size = 16;
							}
							doc.Application.Selection.ParagraphFormat.Alignment=t==3?2:1;
							doc.activewindow.selection.TypeText("\n\n\n\n\n\n\n"+(t==1?(no+'                  '+cu):no)+"\n\n");
							doc.activewindow.Selection.TypeParagraph();
							doc.Application.Selection.ParagraphFormat.Alignment = 0;
							if(dt){
								doc.Application.Selection.WholeStory();
								doc.Application.Selection.EndKey(6, 0);
								doc.activewindow.Selection.TypeParagraph();
								doc.activewindow.Selection.TypeParagraph();
								doc.activewindow.Selection.TypeParagraph();
								var tableform=doc.Application.Selection.Tables.Add (doc.Application.Selection.Range, 2,1);
								tableform.Rows.Height =19; //设置行高
								tableform.Borders(-1).LineStyle=1;  //-1上、-2左、-3下、-4右、-5横、-6竖
								tableform.Borders(-1).LineWidth = 1.5; //边框粗细
								tableform.Borders(-3).LineStyle=1;  //-1上、-2左、-3下、-4右、-5横、-6竖
								tableform.Borders(-3).LineWidth = 1.5; //边框粗细
								tableform.Borders(-5).LineStyle=1;  //-1上、-2左、-3下、-4右、-5横、-6竖
								tableform.Cell(1,1).range.Text="	抄送："+sendTo;
								tableform.Cell(2,1).range.Text="	"+issueDep+"							"+dt;
								tableform.Cell(1,1).TopPadding  = 3;
								tableform.Cell(2,1).TopPadding  = 3;
							}
						}
					}
					
				}catch(err){}
			}else if(usetemplate==1 && deftemplatekey!=''){
				Ext.Ajax.request({
					url:__ctxPath+'/document/getByKeyPaintTemplate.do',
					params:{
						method:'post',
						templateKey:deftemplatekey
					},
					success:function(response,options){
						var result=Ext.decode(response.responseText);
						if(result.data){
							var templateFileURL=__ctxPath+'/attachFiles/'+result.data.path;
							officeObj.OpenFromURL(templateFileURL);
							isFileOpen=true;
						}else{
							officeObj.CreateNew(fileType);
							isFileOpen=true;
						}
					}
				});
				
			}else if(tempPath){//直接按路径打开
				//var templateFileURL=__ctxPath+'/attachFiles/'+result.data.path;
				officeObj.OpenFromURL(tempPath);
			}else{
				var fileType='';
				switch (conf.doctype)
				{
					case 'doc':
						fileType = "Word.Document";
						fileTypeSimple = "wrod";
						break;
					case 'xls':
						fileType = "Excel.Sheet";
						fileTypeSimple="excel";
						break;
					case 'ppt':
						fileType = "PowerPoint.Show";
						fileTypeSimple = "ppt";
						break;
					case 4:
						fileType = "Visio.Drawing";
						break;
					case 5:
						fileType = "MSProject.Project";
						break;
					case 6:
						fileType = "WPS Doc";
						break;
					case 7:
						fileType = "Kingsoft Sheet";
						break;
					default :
						fileType = "Word.Document";
				}
				try{
					officeObj.CreateNew(fileType);
					isFileOpen=true;
				}catch(err){}
				
			}
			panel.doLayout();
	});
   //默认保留痕迹  ie
/*	officeObj.ActiveDocument.Application.UserName=curUserInfo.fullname;
	officeObj.ActiveDocument.TrackRevisions=true;*/
	noumenon=officeObj;//保留一份文件对象
	//对外公共方法
	return {
		panel:panel,
		officeObj:officeObj,
		openDoc:function(inFileId){
			fileId=inFileId;
			officeObj.OpenFromURL(__ctxPath+'/file-download?fileId='+fileId);
		},
		setReadOnly:function(){
		   officeObj.SetReadOnly(true,'');
		},
		openDoc2:function(fileId,fileUrl){
		    fileId=fileId;
		    try{
		    officeObj.OpenFromURL(__ctxPath+'/attachFiles/'+fileUrl);
		    isFileOpen=true;
			}catch(err){
				isFileOpen=false;
			}
		},
		/**
		 * return json result is format as below:
		 * {sucess:false} or 
		 * {success:true,fileId:73,fileName:'myDoc.doc',filePath:'others/2010/aaa0393304.doc',message:'upload file success(10229 bytes)'}
		 */
		saveDoc:function(config){
			win=config.win;
			present=config.present;
			return saveFn(config);
		},
		wordToPDF:function(config){
			win=config.win;
			present=config.present;
			wordToPDF(config);
		},
		closeDoc:function(){
			isFileOpen=false;
			officeObj.Close();
		}
	};
	
};
