/**
 * 集成软航Office在线编辑控件
 * @param {} conf
 * @return {}
 */
NtkOfficePanel=function(conf){
	var isFileOpen=false;
	conf.doctype=conf.doctype?conf.doctype:'doc';
	var fileId=conf.fileId?conf.fileId:'';
	var status=conf.status;
	var tempPath=conf.tempPath;
	var usetemplate=conf.usetemplate?conf.usetemplate:0;
	var deftemplatekey=conf.deftemplatekey?conf.deftemplatekey:'';
	var officeObj = document.createElement('object');
	
	var p=document.createElement("param");
	p.setAttribute('name','Caption');
	p.setAttribute('value','捷达世软件(深圳)有限公司在线Office文档');
	officeObj.appendChild(p);

	p=document.createElement('param');
	p.setAttribute('name','MakerCaption');
	p.setAttribute('value','广州宏天软件有限公司');
	officeObj.appendChild(p);
	
	p=document.createElement('param');
	p.setAttribute('name','MakerKey');
	p.setAttribute('value','CF4960BFDB79D36ADDC5493B116D39D6A4E335D9');
	officeObj.appendChild(p);
	
	p=document.createElement('param');
	p.setAttribute('name','ProductCaption');
	p.setAttribute('value','office');
	officeObj.appendChild(p);
	
	p=document.createElement('param');
	p.setAttribute('name','ProductKey');
	p.setAttribute('value','5A03AF5166D313E4E8FEA7A7B132433246CABE08');
	officeObj.appendChild(p);
	
	p=document.createElement('param');
	p.setAttribute('name','TitlebarColor');
	p.setAttribute('value','14402205');
	officeObj.appendChild(p);

	officeObj.width = "100%";
	officeObj.height = "100%";

	officeObj.classid= "clsid:A39F1330-3322-4a1d-9BF0-0BA2BB90E970"; 
	officeObj.codebase = __ctxPath+'/js/core/ntkoffice/OfficeControl.cab#version=5,0,1,0';//weboffice_V6.0.4.6.cab#V6,0,4,6
	
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
		
		var obj=Ext.util.JSON.decode(result);
		if(obj && obj.success){
			fileId=obj.fileId;
		}else{
			obj={success:false};
		}
		return obj;
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
		
		if(conf.doctype=='doc'){
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
		if(conf.doctype=='doc'){
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
		
		if(conf.doctype=='doc'){
			buttons.push({
		            text:'模板套红',
					iconCls:'',
					scope:this,
					handler:function(){
						if(isFileOpen){
							new PaintTemplateSelector({callback:function(name,path){
							    this.close();
							    if(path!=''){
							    	//var headFileURL=__ctxPath+'/attachFiles/'+path;
							    	var headFileURL = path;
								    if(officeObj.doctype!=1){return;}//OFFICE_CONTROL_OBJ.doctype=1为word文档
									try{
										//选择对象当前文档的所有内容
										var curSel = officeObj.ActiveDocument.Application.Selection;
										curSel.WholeStory();
										curSel.Cut();
										//插入模板
										officeObj.AddTemplateFromURL(headFileURL);
										var BookMarkName = "content";
										if(!officeObj.ActiveDocument.BookMarks.Exists(BookMarkName)){
											alert("Word 模板中不存在名称为：\""+BookMarkName+"\"的书签！");
											return;
										}
										var bkmkObj = officeObj.ActiveDocument.BookMarks(BookMarkName);	
										var saverange = bkmkObj.Range
										saverange.Paste();
										officeObj.ActiveDocument.Bookmarks.Add(BookMarkName,saverange);		
										
									}catch(err){
										alert("错误：" + err.number + ":" + err.description);
									}
							    }
							}}).show();
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
		
		if(false&&conf.doctype=='doc'||conf.doctype=='xls'){
			buttons.push({
			        text:'盖章',
					iconCls:'',
					scope:this,
					handler:function(){
						new SealSelector({callback:function(name,signUrl,belongName){
							this.close();
							if(signUrl!=''){
								//var signUrl=__ctxPath+'/attachFiles/'+path;
								if(officeObj.doctype==1||officeObj.doctype==2){
									try{
										officeObj.AddSecSignFromURL(curUserInfo.fullname,//印章的用户名
										signUrl,//印章所在服务器相对url
										0,//left
										0,//top
										1,//relative
										2,  //print mode 2
										false,//是是否使用证书，true或者false，
										1);
									}catch(error){
									
									}
								}
							}
						}}).show();
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
			if(/(msie\s|trident.*rv:)([\w.]+)/.test(navigator.userAgent.toLowerCase())){
				if (!officeObj.hasOwnProperty("OpenFromURL")) {
					Ext.Msg.alert('提示',
						'您尚未安装office在线控件，请点击<a href="' + __ctxPath + '/downFile/NtkoControlSetup.zip" >这里</a>下载安装');
				}
			}else{
				Ext.Msg.confirm('提示', '请使用IE8或以上版本浏览器操作此功能,确定下载IE8.0?',function(btn, text){
		    		if (btn == 'yes'){		
			    		window.open(__ctxPath + "/downFile/IE8-WindowsXP-x86-CHS.zip");		
			    	}
				});
			}
		},500,officeObj);
	});
	panel.on('afterrender',function(){
			panel.body.appendChild(officeObj);
			//若使用了模板，则缺省打开模板
			if(fileId){
				try{
					officeObj.OpenFromURL(__ctxPath+'/file-download?fileId='+fileId);
					isFileOpen=true;
					officeObj.ActiveDocument.Application.UserName=curUserInfo.fullname;
					if(status.indexOf("生成电子公文")!=-1){
					officeObj.ActiveDocument.TrackRevisions=true;
					officeObj.ActiveDocument.ShowRevisions=false;
					}else{
						officeObj.ActiveDocument.TrackRevisions=true;
					}
					with (officeObj.ActiveDocument.ActiveWindow.View){  //显示最终状态
						ShowRevisionsAndComments = false;
						RevisionsView =0;
					}
					/*setTimeout(function(){
						officeObj.FullScreenMode=true;
					},400,officeObj);*/
					
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
			return saveFn(config);
		},
		closeDoc:function(){
			isFileOpen=false;
			officeObj.Close();
		}
	};

};
