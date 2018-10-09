
OfficePanel=function(conf){
	var filePath=conf.filePath?conf.filePath:'';
	
	var officeObj = document.createElement('object');
	officeObj.width = "100%";
	officeObj.height = "100%";
	officeObj.classid= "clsid:E77E049B-23FC-4DB8-B756-60529A35FAD5"; 
	officeObj.codebase = __ctxPath+'/js/core/weboffice/WebOffice.ocx';//weboffice_V6.0.4.6.cab#V6,0,4,6
	
	var panelConf={border:false,layout:'fit'};
	
	/**
	 * 保存文档
	 */
	var saveFn=function(config){
				config=config||{};
				config.fileCat=config.fileCat?config.fileCat:'archIssue';
				officeObj.HttpInit();
				officeObj.HttpAddPostString('file_cat', config.fileCat);
				var docPath=null;
				if(config.docPath){
					docPath=config.docPath;
				}else if(filePath){
					docPath=filePath;
				}
				
				//overwrite file path
				if(docPath){
					officeObj.HttpAddPostString('file_path', docPath);
				}
				officeObj.HttpAddPostCurrFile('AipFile','');	
				var url=config.url ? config.url: __fullPath + '/file-upload';
				// 提交上传文件
				returnValue = officeObj.HttpPost(url);
				var obj;
				eval('obj='+returnValue+";");
				filePath=obj.filePath;
				return obj;
	};
	
	if(conf.showToolbar){
		panelConf.tbar=new Ext.Toolbar({
			items:[
				{
					text : '保留修改痕迹',
					iconCls : 'btn-archive-save-trace',
					handler : function() {
						officeObj.SetTrackRevisions(1);
						officeObj.SetCurrUserName(curUserInfo.fullname);
					}
				}, '-', {
					text : '取消保留痕迹',
					iconCls : 'btn-archive-cancel-trace',
					handler : function() {
						officeObj.SetTrackRevisions(0);
					}
				}, '-',{
					text : '清除痕迹',
					iconCls : 'btn-archive-eraser',
					handler : function() {
						officeObj.SetTrackRevisions(4);
					}
				}, '-',{
					text:'加入套红模板',
					iconCls:'',
					scope:this,
					handler:function(){
						new ArchTemplateSelector({
								callback : function(tempPath) {
									var result=saveFn();
									filePath=result.filePath;
									officeObj.LoadOriginalFile(__fullPath+"/attachFiles/" + tempPath,'doc');
									officeObj.SetFieldValue("contents",__fullPath+"/attachFiles/" + filePath, "::FILE::");
									//officeObj.SetFieldValue("red_header","","::ADDMARK::");
									//officeObj.SetFieldValue("red_header",__fullPath+"/attachFiles/" + tempPath, "::FILE::");
								}
							}
						).show();
					}
				},'-',{
					text:'保存至服务器',
					iconCls:'btn-save',
					scope:this,
					handler:function(){
						var result=saveFn();
						Ext.ux.Toast.msg('操作信息','成功保存~');
					}
				},'-',{
					text:'套打',
					scope:this,
					handler:function(){
							var bkCounts = officeObj.GetBookMarkCount();
							for(var i = 1; i <= bkCounts; i++){
								
								var vName =officeObj.GetBookMarkInfo(i,0 ); 
								
								if(vName.indexOf('BK_')==0){
									officeObj.HideAreaWithoutResize('BK_',1,0);
								}
								
							}
							//显示对话框打印
							var result=officeObj.printDoc(true);
							
							//打印完成后，则需要重新打开在原来标签显示的内容
							
							for(var j = 1; j <= bkCounts; j++){
								var vName =officeObj.GetBookMarkInfo(j,0 ); 
								if(vName.indexOf('BK_')==0){
									officeObj.HideAreaWithoutResize('BK_',1,1);
								}
							}
							
					}
				}
			]
		});
	}
	
	Ext.applyIf(panelConf,conf);

	var panel=new Ext.Panel(panelConf);
	panel.on('afterrender',function(){
			panel.body.appendChild(officeObj);
			panel.doLayout();
			var fullPath=filePath?__fullPath+'/attachFiles/'+filePath:'';
			var docType=conf.docType?conf.docType:'doc';
			officeObj.LoadOriginalFile(fullPath,'doc');
			panel.doLayout();
			
	});
	panel.on('destroy',function(){
		try {
				officeObj.Close();
			} catch (ex) {}
	});
	
	window.onunload=function(){
		try {
				officeObj.Close();
			} catch (ex) {}
	};
	
	//对外公共方法
	return {
		panel:panel,
		officeObj:officeObj,
		filePath:filePath,
		openDoc:function(path,type){
			var vType='doc';
			if(type){
				vType=type;
			}
			officeObj.LoadOriginalFile(path,type);
		},
		saveDoc:function(config){
			return saveFn(config);
		}
	};
};

//Ext.reg('officepanel',OfficePanel);