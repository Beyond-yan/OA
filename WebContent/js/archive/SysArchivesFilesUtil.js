Ext.ns('SysArchivesFilesUtil');

var SysArchivesFilesUtil = function(conf){
	conf.gridId = conf.panelId + '.docGridPanel';
	
	return {
//		testFun : function(){
//			alert('This is SysArchivesFilesUtil.test function!'+conf.dataId);
//		},
		getGridPanelWithFullTools : function(){
			var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
			var store = new Ext.data.JsonStore({
				url : __ctxPath + '/system/listSysArchivesFiles.do?id='+conf.dataId +'&fileType='+conf.fileType,
				root : 'result',
				totalProperty : 'totalCounts',
				remoteSort : true,
				fields : ['id', 'sysDataTransfer','fileType','fileVersion', 'fileName',  'filePath', 'fileSize', 'fileByteSize', 'fileExtType', 'fileDate']
			});
			store.setDefaultSort('id', 'desc');
			if (conf.dataId) {
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
					items : [/*{
								text : '按模板在线添加',
								iconCls : 'menu-archive-template',
								handler : this.addArchiveDoc,
								scope : this
							}, '-', {
								text : '在线添加',
								iconCls : 'btn-edit-online',
								handler : this.addNewArchiveDoc,
								scope : this
							}, '-',*/ {
								text : '上传文档',
								iconCls : 'btn-upload',
								handler : function(){
									document.getElementById('fileAttachIframe').contentDocument.getElementsByName('file')[0].click();
								},
								scope : this
							}, '-', {
								text : '删除附件文档',
								iconCls : 'btn-del',
								//hidden: !conf.isStart,
								handler : this.deleteArchiveDoc,
								scope : this
							}, '-', {
								text : '在线查阅',
								iconCls : 'menu-archive-issue-manage',
								scope : this,
								handler : function(){
									SysArchivesFilesUtil.detail(conf.gridId);
								}
							}] 
				}),
				listeners:{
					render : function(){
						Ext.getCmp(conf.panelId).store = this.getStore();
						//公文上传，印章，默认记录公文修改痕迹
						var fileAttachIframe = Ext.DomHelper.append(this.getEl(),'<iframe id="fileAttachIframe" src="about:blank" style="display:none;width:0px;height:0px;"><form name="fileForm" action="'+__ctxPath+'/file-upload" method="post"><input type="file" '
									+' name="file"/></form></iframe>');
//						setTimeout(function(){
//							fileAttachIframe.src = "";
//						},2000);
						
						var fd = fileAttachIframe.contentDocument;
						fd.write("<div>.</div>");
						fd.body.innerHTML='<form name="fileForm" action="'+__ctxPath+'/file-upload" method="post"><input type="file" name="file"/></form>';
						fd.getElementsByName('file')[0].onchange = function(){
							SysArchivesFilesUtil.doFileUpload(conf,fd.getElementsByName('fileForm')[0]);
						}
					}
				},
				sm : sm,
				autoExpandColumn : conf.panelId+'.filePath',
				columns : [new Ext.grid.RowNumberer(), sm, {
							dataIndex : 'fileName',
							width : 150,
							header : '文档名称'
						}, {
							dataIndex : 'filePath',
							id:conf.panelId+'.filePath',
							header : '文档路径'
						}, {
							dataIndex : 'fileVersion',
							width : 80,
							header : '当前版本',
							renderer : function(v) {
								v = v == null ? 0 : v;
								return '第' + v + '版';
							}
						}, {
							header : '管理',
							width : 120,
							dataIndex : 'id',
							sortable : false,
							renderer : function(v, m, r, i,c) {
								var str = '';
								if(!conf.isStart){
									str = '<button title="编辑" value=" " class="btn-archive-copy" onclick="SysArchivesFilesUtil.edit('
									+ i + ',\''+conf.gridId+'\',\''+conf.dataId+'\')">&nbsp;&nbsp;</button>编辑&nbsp;&nbsp;&nbsp;&nbsp;<button title="历史" value=" " class="btn-archive-history" onclick="SysArchivesFilesUtil.attach('
									+ i + ',\''+conf.gridId+'\')">&nbsp;&nbsp;</button>历史';
								}
								return str;
							}
						}]
			});
			return gridPanel;
		},
		getGridPanel : function(){
			return new Ext.grid.GridPanel({
				title : '公文正文',
				iconCls : 'menu-attachment',
				border : true,
				id : conf.gridId,
				autoScroll : true,
				height : 240,
				store : new Ext.data.JsonStore({
					url : __ctxPath + '/system/listSysArchivesFiles.do?id='+conf.dataId +'&fileType='+1,
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					autoLoad:true,
					fields : [{
								name : 'id',
								type : 'long'
							},'sysDataTransfer','fileType','fileVersion', 'fileName',  'filePath', 'fileSize', 'fileByteSize', 'fileExtType', 'fileDate']
				}),
				columns : [new Ext.grid.RowNumberer(), {
							dataIndex : 'fileName',
							width : 150,
							header : '文档名称'
						}, {
							dataIndex : 'filePath',
							header : '文档路径',
							width : 200
						}, {
							dataIndex : 'fileVersion',
							header : '当前版本',
							width : 80,
							renderer : function(v) {
								return '第' + v + '版';
							}
						}, {
							header : '管理',
							width : 120,
							dataIndex : 'id',
							sortable : false,
							renderer : function(v, m, r, i,c) {
								return str = '<button title="查看" value=" " class="menu-archive-issue-manage" onclick="this.detail('
									+ i + ',\''+conf.gridId+'\')">&nbsp;&nbsp;</button>';
								str += '&nbsp;&nbsp;&nbsp;&nbsp;<button title="历史" value=" " class="btn-archive-history" onclick="SysArchivesFilesUtil.attach('
									+ i + ',\''+conf.gridId+'\')">&nbsp;&nbsp;</button>';
								str += '&nbsp;&nbsp;&nbsp;&nbsp;<button title="编辑" value=" " class="btn-archive-copy" onclick="SysArchivesFilesUtil.edit('
									+ i + ',\''+conf.gridId+'\')">&nbsp;&nbsp;</button>';
							}
						}]
			});
		},
		addArchiveDoc : function() {
			// 判断是否选择了文档分类
			var store = Ext.getCmp(conf.gridId).getStore();
			new ArchTemplateSelector({
						callback : function(fileId, tempPath) {
							// 返回文档附加记录
							var callback = function(sysArchivesFiles) {
								SysArchivesFilesUtil.insertNewDoc(store, sysArchivesFiles);
							};
							new ArchivesDocForm({
										fileId : fileId,
										filePath : tempPath,
										callback : callback
									}).show();
						}
					}).show();

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

			var id = record.data.id;
			if (id == 0) {
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
													+ '/system/multiDelSysArchivesFiles.do',
											params : {
												ids : id
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
}

SysArchivesFilesUtil.insertNewDoc = function(store, sysArchivesFiles) {
	if (store.recordType) {
		var orec = new store.recordType();
		orec.data = {};
		orec.data['id'] = sysArchivesFiles.id;
		orec.data['fileId'] = sysArchivesFiles.fileId;
		orec.data['filePath'] = sysArchivesFiles.filePath;
		orec.data['fileName'] = sysArchivesFiles.fileName;
		orec.data['fileVersion'] = sysArchivesFiles.fileVersion
				? sysArchivesFiles.fileVersion
				: 1;
		orec.data.newRecord = true;
		orec.commit();
		store.add(orec);
	}
}

SysArchivesFilesUtil.detail = function(gridId) {
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

SysArchivesFilesUtil.attach = function(rowIndex,gridId) {
	var store = Ext.getCmp(gridId).getStore();
	var record = store.getAt(rowIndex);
	
	// 返回文档附加记录
	new ArchivesDocHistoryWin({
				id : record.get('id'),
				onlyCloseButton:true,
				callback : function(sysArchivesFiles) {
					/*store.remove(record);
					SysArchivesFilesUtil.insertNewDoc(store, sysArchivesFiles);*/
				}
			}).show();
}

SysArchivesFilesUtil.edit = function(rowIndex,gridId,dataId) {
	var store = Ext.getCmp(gridId).getStore();
	var record = store.getAt(rowIndex);
	
	// 返回文档附加记录
	new ArchivesDocForm({
			id : record.data.id,
			filePath : record.data.filePath,
			fileId : record.data.fileId,
			fileName :record.data.fileName,
			callback : function(sysArchivesFiles) {
				if (dataId) {
					store.load();
				}
			}
	}).show();
	
	
}

SysArchivesFilesUtil.doFileUpload = function(conf,form){
	Ext.Ajax.request({
			form : form,
			params : {
				file_cat:'others/'+curUserInfo.ownerSchema,
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
				
				var docObj = {
					id : 0,
					fileId : jr.fileId,
					filePath : jr.filePath,
					fileName : jr.fileName,
					fileVersion : 1
				};
				
				/*if (conf.dataId) { 
					Ext.Ajax.request({
						url : __ctxPath + '/system/addDocFilesSysDataTransfer.do',
						params : {
							id:conf.dataId,
							doc : Ext.util.JSON.encode(docObj)
						},
						success : function(r, options){
							var res = Ext.util.JSON.decode(r.responseText);
							//alert(r.responseText);
							SysArchivesFilesUtil.insertNewDoc(Ext.getCmp(conf.gridId).getStore(), Ext.apply(docObj,{id:res.archivesDocId}));
						},
						failure : function(){
							Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
						}
					});
				}else{*/
					SysArchivesFilesUtil.insertNewDoc(Ext.getCmp(conf.gridId).getStore(), docObj);
//				}
			},
			failure : function(){
				Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
			}
		});
}





//领导角色id
SysArchivesFilesUtil.Role_Leaders = '100152,100156'; //100152:处长/主任;100156:副处长/副主任
SysArchivesFilesUtil.Role_Leader0 = '100175';//交委领导
SysArchivesFilesUtil.NeiQing = '1201163';

//发文单位
SysArchivesFilesUtil.IssueDepData = ['重庆市交通委员会',
	'中共重庆市交通委员会', '中共重庆市交通委员会机关党委',
	'中共重庆市交通纪律检查委员会', '共青团重庆市交通委员会',
	'重庆市交通委员会直属机关工会'];

SysArchivesFilesUtil.DepId = '100130'; //重庆市交通委员会
SysArchivesFilesUtil.DepId0 = '100131'; //办公室




