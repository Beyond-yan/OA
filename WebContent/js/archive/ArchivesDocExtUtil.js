Ext.ns('ArchivesDocExtUtil');

var ArchivesDocExtUtil = function(conf){
	conf.gridId = conf.panelId + '.docGridPanel';
	
	return {
//		testFun : function(){
//			alert('This is ArchivesDocExtUtil.test function!'+conf.archivesId);
//		},
		getGridPanelWithFullTools : function(){
			var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
			
			var store = new Ext.data.JsonStore({
				url : __ctxPath + '/archive/listArchivesDocExt.do?archivesId='+conf.archivesId + '&docType='+conf.docType,
				root : 'result',
				totalProperty : 'totalCounts',
				remoteSort : true,
				fields : ['docId','fileId', 'docName', 'curVersion', 'docPath','isFinish',{
					name:'sources',mapping:'archives.sources'},{
					name:'tid',mapping:'archTypeId'
				},{name:'ano',mapping:'archives.archivesNo'},{name:'did',mapping:'archives.isComSetting'}
				 ,{name:'dt',mapping:'archives.signDate'},{name:'issueDep',mapping:'archives.issueDep'},{name:'sendTo',mapping:'archives.ccTo'}]
			});
			store.setDefaultSort('docId', 'desc');
			if (conf.archivesId) {
				store.load();
			}
			
			var gridPanel = new Ext.grid.GridPanel({
				title : conf.title ? conf.title :'公文正文',
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
									document.getElementById(conf.panelId +'iframe').contentDocument.getElementsByName('file')[0].click();
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
									ArchivesDocExtUtil.download(conf.gridId);
								}
							}/*, '-', {
								text : '在线查阅',
								iconCls : 'menu-archive-issue-manage',
								scope : this,
								handler : function(){
									ArchivesDocExtUtil.detail(conf.gridId);
								}
							}*/] 
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
							ArchivesDocExtUtil.doFileUpload(conf,fd.getElementsByName('fileForm')[0]);
						}
					}
				},
				sm : sm,
				//autoExpandColumn : conf.panelId+'.docPath',
				columns : [new Ext.grid.RowNumberer(), sm, {
							dataIndex : 'docName',
							width : 150,
							header : '文档名称'
						}, {
							dataIndex : 'docPath',
							id:conf.panelId+'.docPath',
							hidden : true
							//header : '文档路径'
						}, {
							dataIndex : 'curVersion',
							width : 80,
							header : '当前版本',
							renderer : function(v, m, r, i,c) {
								if(r.data.isFinish==1){
									return '最终版';
								}else{
									return '第' + v + '版';
								}
							}
						}, {
							header : '管理',
							width : 250,
							dataIndex : 'docId',
							sortable : false,
							renderer : function(v, m, r, i,c) {
								var str = '';
								//if(!conf.isStart){
									str = '<button title="编辑" value=" " class="btn-archive-copy div_button" onclick="ArchivesDocExtUtil.edit('
									+ i + ',\''+conf.gridId+'\',\''+conf.archivesId+'\',\''+conf.panelId
									+'\')">编辑</button><button title="历史" value=" " class="btn-archive-history div_button" onclick="ArchivesDocExtUtil.attach('
									+ i + ',\''+conf.gridId+'\')">历史</button>';
								//}
								var name = Ext.getCmp(conf.panelId).activityName;
								name = name?(/^.*生成.*$/gi.test(name)&&/^.*电子.*$/gi.test(name)||/^.*校对.*$/gi.test(name)):false;
								if(name){
									//str +='<button title="最终版确认" value=" " class="btn-archive-white-word" onclick="ArchivesDocExtUtil.finish('
										//+ i + ',\''+conf.gridId+'\')">&nbsp;&nbsp;&nbsp;&nbsp;最终版确认</button>';
									  str += '<a href="#"  title="最终版确认" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'3D3D3D\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesDocExtUtil.finish('
										+ i + ',\''+conf.gridId+'\')"><img src="'+ __ctxPath
										+ '/images/btn/archive/white_word.png" />最终版确认</a>'
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
					url : __ctxPath + '/archive/listArchivesDocExt.do?archivesId='+conf.archivesId + '&docType='+conf.docType,
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					autoLoad:true,
					fields : [{
								name : 'docId',
								type : 'int'
							},'fileId', 'docName', 'curVersion', 'docPath', 'updatetime', 'docType']
				}),
				columns : [new Ext.grid.RowNumberer(), {
							dataIndex : 'docName',
							width : 150,
							header : '文档名称'
						}, {
							dataIndex : 'docPath',
							header : '文档路径',
							width : 200
						}, {
							dataIndex : 'curVersion',
							header : '当前版本',
							width : 80,
							renderer : function(v) {
								return '第' + v + '版';
							}
						}, {
							header : '管理',
							width : 120,
							dataIndex : 'docId',
							sortable : false,
							renderer : function(v, m, r, i,c) {
								 str = '<button title="查看" value=" " class="menu-archive-issue-manage" onclick="this.detail('
									+ i + ',\''+conf.gridId+'\')">&nbsp;&nbsp;</button>';
								str += '&nbsp;&nbsp;&nbsp;&nbsp;<button title="历史" value=" " class="btn-archive-history" onclick="ArchivesDocExtUtil.attach('
									+ i + ',\''+conf.gridId+'\')">&nbsp;&nbsp;</button>';
								str += '&nbsp;&nbsp;&nbsp;&nbsp;<button title="编辑" value=" " class="btn-archive-copy" onclick="ArchivesDocExtUtil.edit('
									+ i + ',\''+conf.gridId+'\')">&nbsp;&nbsp;</button>';
								return str;
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
							var callback = function(archivesDoc) {
								ArchivesDocExtUtil.insertNewDoc(store, archivesDoc, conf);
							};
							new ArchivesDocForm({
										fileId : fileId,
										docPath : tempPath,
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

			var docId = record.data.docId;
			if (docId == 0) {
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
													+ '/archive/multiDelArchivesDocExt.do',
											params : {
												ids : docId
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

ArchivesDocExtUtil.insertNewDoc = function(store, archivesDoc, conf) {
	if (store.recordType) {
		var orec = new store.recordType();
		orec.data = {};
		orec.data['docId'] = archivesDoc.docId;
		orec.data['fileId'] = archivesDoc.fileId;
		orec.data['docPath'] = archivesDoc.docPath;
		orec.data['docName'] = archivesDoc.docName;
		orec.data['curVersion'] = archivesDoc.curVersion
				? archivesDoc.curVersion
				: 1;
		orec.data['docType'] = conf.docType;
		orec.data.newRecord = true;
		orec.commit();
		store.add(orec);
	}
}

ArchivesDocExtUtil.detail = function(gridId) {
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
		title:record.data.docName,
		height : 540,
		width : 800,
		items:[ntkOfficePanel.panel]
	}).show();
}

ArchivesDocExtUtil.download = function(gridId) {
	var selectRecords = Ext.getCmp(gridId).getSelectionModel().getSelections();
	if (selectRecords.length == 0) {
		Ext.Msg.alert("信息", "请选择要下载的文档！");
		return;
	}
	var record = selectRecords[0];
	window.open(__ctxPath+'/pages/downFile.jsp?fileId='+record.data.fileId);
}

ArchivesDocExtUtil.attach = function(rowIndex,gridId) {
	var store = Ext.getCmp(gridId).getStore();
	var record = store.getAt(rowIndex);
	
	// 返回文档附加记录
	new ArchivesDocHistoryWin({
				docId : record.get('docId'),
				onlyCloseButton:true,
				callback : function(archivesDoc) {
					/*store.remove(record);
					ArchivesDocExtUtil.insertNewDoc(store, archivesDoc);*/
				}
			}).show();
}
/**
 * 正文文档是否是最终版
 */
ArchivesDocExtUtil.finish = function(rowIndex,gridId) {
	var store = Ext.getCmp(gridId).getStore();
	var record = store.getAt(rowIndex);
	Ext.Ajax.request({
		url : __ctxPath + '/archive/finishArchivesDocExt.do',
		params : {
			docId : record.get('docId')
		},
		success : function(r, options){
			store.load();
		},
		failure : function(){
			Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
		}
	});
}

ArchivesDocExtUtil.edit = function(rowIndex,gridId,archivesId,panelId) {
	var store = Ext.getCmp(gridId).getStore();
	var record = store.getAt(rowIndex);
	var an = Ext.getCmp(panelId).activityName;
	an = an?(/^.*生成.*$/gi.test(an)&&/^.*电子.*$/gi.test(an)):false;
	var t = record.data.sources;t=t=='上行文'?1:(t=='下行文'||t=='平行文')?2:0;
	var tid = record.data.tid;
	//var dt = record.data.dt;dt = dt?('签发日期：'+new Date(dt).format('Y年m月d日')):null;
	var dt = record.data.dt;dt = dt?(new Date(dt).format('Y年m月d日')+'印发'):null;
	var issueDep=record.data.issueDep;
	var sendTo=record.data.sendTo;
	// 返回文档附加记录
	new ArchivesDocForm({
			docId : record.data.docId,
			docPath : record.data.docPath,
			fileId : record.data.fileId,
			docName :record.data.docName,
			status: Ext.getCmp(panelId).activityName,
			idoc: (an && record.data.did!=1)?{
				t : ((tid&&tid==13)?3:t),
				no: (record.data.ano),
				dt: dt,
				issueDep:issueDep,
				sendTo : sendTo,
				cu:'签发人：许仁安'
			}:null,
			callback : function(archivesDoc) {
				if (archivesId) {
					store.load();
				}
			}
	}).show();
	
	
}


ArchivesDocExtUtil.attachEdit = function(fileId,fileName) {
	var docPanel = new NtkOfficePanel({
		showToolbar : true,
		unshowMenuBar:false,
		height : 900,
		//autoHeight : true,
		defaults : {
			anchor : '100%,100%'
		},
		fileId:fileId
	});
	
	var win = new Ext.Window({
		title:fileName,
		model:true,
		maximized: true,
		height : 600,
		width : 800,
		items:[docPanel.panel],
		buttonAlign:'center',
		buttons:[{
			text:'保存',
			iconCls : 'btn-save',
			handler:function(){
				var obj = docPanel.saveDoc({
							fileId : fileId,
							docName : fileName,
							doctype : 'doc'
						});
				if (obj && obj.success) {
					fileId = obj.fileId;
				   	docPath = obj.filePath;
				    //this.formPanel.getCmpByName('archivesDoc.docPath').setValue(docPath);
				   	win.close();
				} else {
					Ext.ux.Toast.msg('操作信息', '保存文档出错！');
					return;
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


ArchivesDocExtUtil.doFileUpload = function(conf,form){
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
				
				var docObj = {
					docId : 0,
					fileId : jr.fileId,
					docPath : jr.filePath,
					docName : jr.fileName,
					curVersion : 1,
					docType : conf.docType
				};
				
				if (conf.archivesId) {
					Ext.Ajax.request({
						url : __ctxPath + '/archive/addDocExtArchArchives.do',
						params : {
							archivesId:conf.archivesId,
							doc : Ext.util.JSON.encode(docObj)
						},
						success : function(r, options){
							var res = Ext.util.JSON.decode(r.responseText);
							//alert(r.responseText);
							ArchivesDocExtUtil.insertNewDoc(Ext.getCmp(conf.gridId).getStore(), Ext.apply(docObj,{docId:res.archivesDocId}), conf);
						},
						failure : function(){
							Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
						}
					});
				}else{
					ArchivesDocExtUtil.insertNewDoc(Ext.getCmp(conf.gridId).getStore(), docObj, conf);
				}
				if(conf.isStart){
					var docgrid=Ext.getCmp(conf.gridId);
					if(docgrid.getStore().getCount()!=0){
						var docNameSearch="";
						var i=0;
						Ext.getCmp(conf.gridId).getStore().each(function(record) {
						    docNameSearch+=record.get('docName')+" ";
						});
						Ext.getCmp('SearchDocNames').setValue(docNameSearch);
						Ext.getCmp('ProcessStartOASearchGrid').getStore().baseParams = {
							'subject' : Ext.getCmp('SearchSubject').getValue(),
							'archType': Ext.getCmp('archivesArchType').getValue(),
							'docName' : Ext.getCmp('SearchDocNames').getValue(),
							'fileName': Ext.getCmp('SearchFileNames').getValue()
						};
						Ext.Ajax.request({
								url : __ctxPath + '/archive/oaSearchListArchives.do',
								params : {
									'archType': conf.archType,
									'docName': docNameSearch,
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
			},
			failure : function(){
				Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
			}
		});
}
