Ext.ns('MeetingNoticeUtil');

var MeetingNoticeUtil = function(conf){
	conf.gridId = conf.panelId + '.docGridPanel';
	if(conf.isStart==null||conf.isStart=='undefined'){
		conf.isStart=true;
	}
	return {
//		testFun : function(){
//			alert('This is MeetingNoticeUtil.test function!'+conf.archivesId);
//		},
		getGridPanelWithFullTools : function(){
			var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
			
			var store = new Ext.data.JsonStore({
				url : __ctxPath + '/meetingNotice/getDocsMeetingNotice.do?noticeId='+conf.noticeId,
				root : 'result',
				totalProperty : 'totalCounts',
				remoteSort : true,
				fields : ['fileId', 'fileName', 'filePath']
			});
			store.setDefaultSort('fileId', 'desc');
			if (conf.noticeId) {
				store.load();
			}
			
			var gridPanel = new Ext.grid.GridPanel({
				title : '公文正文',
				iconCls : 'menu-attachment',
				border : true,
				id : conf.gridId,
				height : 240,
				store : store,
				tbar : new Ext.Toolbar({
					height : 30,
					items : [{
								text : '上传文档',
								iconCls : 'btn-upload',
								handler : function(){
									document.getElementById(conf.panelId +'iframe').contentDocument.getElementsByName('file')[0].click();
								},
								scope : this
							}, '-', {
								text : '删除附件文档',
								iconCls : 'btn-del',
								hidden: !conf.isStart,
								handler : this.deleteArchiveDoc,
								scope : this
							}, '-', {
								text : '在线查阅',
								iconCls : 'menu-archive-issue-manage',
								scope : this,
								handler : function(){
									MeetingNoticeUtil.download(conf.gridId);
								}
							}] 
				}),
				listeners:{
					render : function(){
						Ext.getCmp(conf.panelId).store = this.getStore();
						var fileAttachIframe = Ext.DomHelper.append(this.getEl(),'<iframe id="'+conf.panelId +'iframe" src="about:blank" style="display:none;width:0px;height:0px;"><form name="fileForm" action="'+__ctxPath+'/file-upload" method="post"><input type="file" '
									+' name="file"/></form></iframe>');
						var fd = fileAttachIframe.contentDocument;
						fd.write("<div>.</div>");
						fd.body.innerHTML='<form name="fileForm" action="'+__ctxPath+'/file-upload" method="post"><input type="file" name="file"/></form>';
						fd.getElementsByName('file')[0].onchange = function(){
							MeetingNoticeUtil.doFileUpload(conf,fd.getElementsByName('fileForm')[0]);
						}
					}
				},
				sm : sm,
				//autoExpandColumn : conf.panelId+'.filePath',
				columns : [new Ext.grid.RowNumberer(), sm, {
							dataIndex : 'fileName',
							width : 500,
							header : '文档名称'
						}, {
							dataIndex : 'filePath',
							id:conf.panelId+'.filePath',
							hidden : true
							//header : '文档路径'
						}]
			});
			return gridPanel;
		},
		deleteArchiveDoc : function() {
			var grid = Ext.getCmp(conf.gridId);
			var selectRecords = grid.getSelectionModel().getSelections();
			if (selectRecords.length == 0) {
				Ext.Msg.alert("信息", "请选择要删除的文档！");
				return;
			}

			var record = selectRecords[0];
			var store = grid.getStore();

			var fileId = record.data.fileId;
			if (fileId == 0) {
				Ext.Msg.confirm('信息确认', '您确认要删除所选文档吗？', function(btn) {
							if (btn == 'yes') {
								store.remove(record);
							}
						});// end of comfirm
			} else {
				Ext.Msg.confirm('信息确认', '您确认要删除所选文档吗？', function(btn) {
							if (btn == 'yes') {
								Ext.Ajax.request({
											url : __ctxPath
													+ '/meetingNotice/multiDelDocMeetingNotice.do',
											params : {
												ids : fileId,
											},
											method : 'POST',
											success : function(response, options) {
												Ext.ux.Toast.msg('操作信息',
														'成功删除该文档附件！');
												store.remove(record);
											},
											failure : function(response, options) {
												Ext.ux.Toast.msg('操作信息',
														'操作出错，请联系管理员！');
											}
										});
							}
						});// end of comfirm
			}
		}
	}
};

MeetingNoticeUtil.insertNewDoc = function(store, archivesDoc) {
	if (store.recordType) {
		var orec = new store.recordType();
		orec.data = {};
		orec.data['fileId'] = archivesDoc.fileId;
		orec.data['fileId'] = archivesDoc.fileId;
		orec.data['filePath'] = archivesDoc.filePath;
		orec.data['fileName'] = archivesDoc.fileName;
		orec.data.newRecord = true;
		orec.commit();
		store.add(orec);
	}
}

MeetingNoticeUtil.detail = function(gridId) {
	var selectRecords = Ext.getCmp(gridId).getSelectionModel().getSelections();
	if (selectRecords.length == 0) {
		Ext.Msg.alert("信息", "请选择要查看的文档！");
		return;
	}
	var record = selectRecords[0];
	
	var ntkOfficePanel = new NtkOfficePanel({
		showToolbar : false,
		fileId : record.data.fileId,
		height : 500,
		width : 780
	});
	
	new Ext.Window({
		title:record.data.fileName,
		height : 540,
		width : 800,
		items:[ntkOfficePanel.panel]
	}).show();
}

MeetingNoticeUtil.download = function(gridId) {
	var selectRecords = Ext.getCmp(gridId).getSelectionModel().getSelections();
	if (selectRecords.length == 0) {
		Ext.Msg.alert("信息", "请选择要下载的文档！");
		return;
	}
	var record = selectRecords[0];
	window.open(__ctxPath+'/pages/downFile.jsp?fileId='+record.data.fileId);
}

MeetingNoticeUtil.attach = function(rowIndex,gridId) {
	var store = Ext.getCmp(gridId).getStore();
	var record = store.getAt(rowIndex);
	
	// 返回文档附加记录
	new ArchivesDocHistoryWin({
				fileId : record.get('fileId'),
				onlyCloseButton:true,
				callback : function(archivesDoc) {
					/*store.remove(record);
					MeetingNoticeUtil.insertNewDoc(store, archivesDoc);*/
				}
			}).show();
}

MeetingNoticeUtil.attachEdit = function(fileId,fileName) {
	var docPanel = new NtkOfficePanel({
		showToolbar : true,
		unshowMenuBar:false,
		height : 900,
		defaults : {
			anchor : '100%,100%'
		},
		fileName:fileName,
		fileId:fileId
	});
	
	var win = new Ext.Window({
		title:fileName,
		model:true,
		maximized: true,
		width : window.innerWidth,
		items:[docPanel.panel],
		buttonAlign:'center',
		buttons:[{
			text:'保存',
			iconCls : 'btn-save',
			handler:function(){
				var obj = docPanel.saveDoc({
							fileId : fileId,
							fileName : fileName,
							doctype : 'doc',
							present:null,
							win:win
						});
				if(obj!=null){
					if (obj && obj.success) {
						fileId = obj.fileId;
					   	filePath = obj.filePath;
					    //this.formPanel.getCmpByName('archivesDoc.filePath').setValue(filePath);
					   	win.close();
					} else {
						Ext.ux.Toast.msg('操作信息', '保存文档出错！');
						return;
					}
			}
			}
		},{
			text:'取消',
			iconCls : 'btn-cancel',
			handler:function(){
				win.close();
			}
		}]
	}).show();
	
}


MeetingNoticeUtil.doFileUpload = function(conf,form){
	Ext.Ajax.request({
			form : form,
			params : {
				file_cat:'others',
				judge_size:'no',
				file_single : 'false'
			},
			method : "POST",
			isUpload : true,
			success : function(response, options) {
				var rt = response.responseText;
				var filter = rt.match(/^<[^>]+>((?:.|\n)*)<\/[^>]+>$/);
				if (filter) {
					rt = filter[1];
				}
				var jr = Ext.util.JSON.decode(rt);
				if(!jr.success){
					Ext.ux.Toast.msg('操作信息',jr.message);
				}else{
				var docObj = {
					fileId : 0,
					fileId : jr.fileId,
					filePath : jr.filePath,
					fileName : jr.fileName
				};
				
				MeetingNoticeUtil.insertNewDoc(Ext.getCmp(conf.gridId).getStore(), docObj);
				
				if(conf.isStart){
					var docgrid=Ext.getCmp(conf.gridId);
					if(docgrid.getStore().getCount()!=0){
						var fileNameSearch="";
						var i=0;
						Ext.getCmp(conf.gridId).getStore().each(function(record) {
						    fileNameSearch+=record.get('fileName')+" ";
						});
						Ext.getCmp('SearchfileNames').setValue(fileNameSearch);
						Ext.getCmp('ProcessStartOASearchGrid').getStore().baseParams = {
							'subject' : Ext.getCmp('SearchSubject').getValue(),
							'archType': Ext.getCmp('archivesArchType').getValue(),
							'fileName' : Ext.getCmp('SearchfileNames').getValue(),
							'fileName': Ext.getCmp('SearchFileNames').getValue()
						};
						Ext.Ajax.request({
								url : __ctxPath + '/archive/oaSearchListArchives.do',
								params : {
									'archType': conf.archType,
									'fileName': fileNameSearch,
									'subject' : Ext.getCmp('SearchSubject').getValue(),
									'fileName': Ext.getCmp('SearchFileNames').getValue()
								},
								method:'post',
								success : function(response, options) {
									var data=Ext.util.JSON.decode(response.responseText)
									if(Ext.getCmp('ProcessStartOASearchGrid')!=null){
										Ext.getCmp('ProcessStartOASearchGrid').getStore().loadData(data);
									}
								}
						});
					}
				}
			}
			},
			failure : function(){
				Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
			}
		});
}
