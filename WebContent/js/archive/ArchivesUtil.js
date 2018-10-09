Ext.ns('ArchivesUtil');

var ArchivesUtil = function(conf){
	conf.gridId = conf.panelId + '.docGridPanel';
	if(conf.isStart==null||conf.isStart=='undefined'){
		conf.isStart=true;
	}
	return {
//		testFun : function(){
//			alert('This is ArchivesUtil.test function!'+conf.archivesId);
//		},
		getGridPanelWithFullTools : function(){
			var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
			
			var store = new Ext.data.JsonStore({
				url : __ctxPath + '/archive/listArchivesDoc.do?archivesId='+conf.archivesId,
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
									ArchivesUtil.download(conf.gridId);
								}
							}/*, '-', {
								text : '在线查阅',
								iconCls : 'menu-archive-issue-manage',
								scope : this,
								handler : function(){
									ArchivesUtil.detail(conf.gridId);
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
							ArchivesUtil.doFileUpload(conf,fd.getElementsByName('fileForm')[0]);
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
								var suffix = '';
								//console.log(r.json.docName);
								if(r.json!=null){
									suffix = r.json.docName.split(".")[1].toLowerCase();
								}
								if(suffix=='pdf'){
								 str = '<button title="查看" value="" class="menu-archive-issue-manage" onclick="ArchivesUtil.edit2('
										+ i + ',\''+conf.gridId+'\',\''+conf.archivesId+'\',\''+conf.panelId
										+'\')">&nbsp;&nbsp;&nbsp;查看</button>';
								}else{
									str = '<button title="编辑" value=" " class="btn-archive-copy div_button" onclick="ArchivesUtil.edit('
									+ i + ',\''+conf.gridId+'\',\''+conf.archivesId+'\',\''+conf.panelId
									+'\')">编辑</button><button title="历史" value=" " class="btn-archive-history div_button" onclick="ArchivesUtil.attach('
									+ i + ',\''+conf.gridId+'\')">历史</button>';
									var name = Ext.getCmp(conf.panelId).activityName;
									name = name?(/^.*生成.*$/gi.test(name)&&/^.*电子.*$/gi.test(name)||/^.*校对.*$/gi.test(name)):false;
									if(name){
										//str +='<button title="最终版确认" value=" " class="btn-archive-white-word" onclick="ArchivesUtil.finish('
											//+ i + ',\''+conf.gridId+'\')">&nbsp;&nbsp;&nbsp;&nbsp;最终版确认</button>';
										  str += '<a href="#"  title="最终版确认" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'3D3D3D\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="ArchivesUtil.finish('
											+ i + ',\''+conf.gridId+'\')"><img src="'+ __ctxPath
											+ '/images/btn/archive/white_word.png" />最终版确认</a>'
									}
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
					url : __ctxPath + '/archive/listArchivesDoc.do?archivesId='+conf.archivesId,
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					autoLoad:true,
					fields : [{
								name : 'docId',
								type : 'int'
							},'fileId', 'docName', 'curVersion', 'docPath', 'updatetime']
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
								str += '&nbsp;&nbsp;&nbsp;&nbsp;<button title="历史" value=" " class="btn-archive-history" onclick="ArchivesUtil.attach('
									+ i + ',\''+conf.gridId+'\')">&nbsp;&nbsp;</button>';
								str += '&nbsp;&nbsp;&nbsp;&nbsp;<button title="编辑" value=" " class="btn-archive-copy" onclick="ArchivesUtil.edit('
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
								ArchivesUtil.insertNewDoc(store, archivesDoc);
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
													+ '/archive/multiDelArchivesDoc.do',
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

ArchivesUtil.insertNewDoc = function(store, archivesDoc) {
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
		orec.data.newRecord = true;
		orec.commit();
		store.add(orec);
	}
}

ArchivesUtil.detail = function(gridId) {
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

ArchivesUtil.download = function(gridId) {
	var selectRecords = Ext.getCmp(gridId).getSelectionModel().getSelections();
	if (selectRecords.length == 0) {
		Ext.Msg.alert("信息", "请选择要下载的文档！");
		return;
	}
	var record = selectRecords[0];
	window.open(__ctxPath+'/pages/downFile.jsp?fileId='+record.data.fileId);
}

ArchivesUtil.attach = function(rowIndex,gridId) {
	var store = Ext.getCmp(gridId).getStore();
	var record = store.getAt(rowIndex);
	
	// 返回文档附加记录
	new ArchivesDocHistoryWin({
				docId : record.get('docId'),
				onlyCloseButton:true,
				callback : function(archivesDoc) {
					/*store.remove(record);
					ArchivesUtil.insertNewDoc(store, archivesDoc);*/
				}
			}).show();
}
/**
 * 正文文档是否是最终版
 */
ArchivesUtil.finish = function(rowIndex,gridId) {
	var store = Ext.getCmp(gridId).getStore();
	var record = store.getAt(rowIndex);
	Ext.Ajax.request({
		url : __ctxPath + '/archive/finishArchivesDoc.do',
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

ArchivesUtil.edit = function(rowIndex,gridId,archivesId,panelId) {
	if(ntkoSealPath!=""){
		 new passwordForm({
			   'ntkoSealPath':ntkoSealPath,
			   'callback':function(){
				   ArchivesUtil.edit2(rowIndex,gridId,archivesId,panelId);
			 }
		   }).show();
	}else{
		ArchivesUtil.edit2(rowIndex,gridId,archivesId,panelId);
	}
}



ArchivesUtil.edit2 = function(rowIndex,gridId,archivesId,panelId) {
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
		Ext.Ajax.request({
			url:__ctxPath+ "/archive/getArchives.do?archivesId="+archivesId,
			method : 'POST',
			success : function(fp, action) {
				var  archives = Ext.util.JSON.decode(fp.responseText).data;
				// 返回文档附加记录
					new ArchivesDocForm({
							docId : record.data.docId,
							docPath : record.data.docPath,
							fileId : record.data.fileId,
							docName :record.data.docName,
							status: Ext.getCmp(panelId).activityName,
							archives:archives,
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
		});
}


ArchivesUtil.attachEdit = function(fileId,fileName) {
	var docPanel = new NtkOfficePanel({
		showToolbar : true,
		unshowMenuBar:false,
		height : 900,
		defaults : {
			anchor : '100%,100%'
		},
		docName:fileName,
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
							docName : fileName,
							doctype : 'doc',
							present:null,
							win:win
						});
				if(obj!=null){
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


ArchivesUtil.doFileUpload = function(conf,form){
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
					docId : 0,
					fileId : jr.fileId,
					docPath : jr.filePath,
					docName : jr.fileName,
					curVersion : 1
				};
				
				if (conf.archivesId) {
					Ext.Ajax.request({
						url : __ctxPath + '/archive/addDoc2ArchArchives.do',
						params : {
							archivesId:conf.archivesId,
							doc : Ext.util.JSON.encode(docObj)
						},
						success : function(r, options){
							var res = Ext.util.JSON.decode(r.responseText);
							//alert(r.responseText);
							ArchivesUtil.insertNewDoc(Ext.getCmp(conf.gridId).getStore(), Ext.apply(docObj,{docId:res.archivesDocId}));
						},
						failure : function(){
							Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
						}
					});
				}else{
					ArchivesUtil.insertNewDoc(Ext.getCmp(conf.gridId).getStore(), docObj);
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
			}
			},
			failure : function(){
				Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
			}
		});
}

/**
 * 法规处审核退回，原因弹出框
 * 
 * @param formPanel
 * @param panel
 * @param signalName
 * @param activityName
 * @param destination
 */
ArchivesUtil.fgcReturnDetailForm = function(formPanel, panel, signalName, activityName, destination, msgPanel, archivesId){
	var win = new Ext.Window({
		title: '退回原因',
		iconCls : 'btn-edit',
		modal:true, //弹出之后背景变灰，不可编辑
		maximizable : true,
		buttonAlign : 'center',
		closeAction : 'hide',
		height : 300,
		width : 400,
		items: new Ext.FormPanel({
				layout : 'form',
				bodyStyle : 'padding:10px 10px 10px 10px',
				border : false,
				id : 'fgcReturnDetailForm',
				defaults : {
					anchor : '98%,98%',
				},
				height : 300,
				labelWidth : 15,
				defaultType : 'textfield',
				items : [{
							xtype : 'radiogroup',
							allowBlank : false,
							id: 'fgcReturnDetailForm.depOption',
							items : [{
								boxLabel : '不是规范性文件',
								name : 'depOption',
								checked : true,
								inputValue : 1,
								listeners : {
									'check' : function(checkbox, checked) {
										if (checked) {
											Ext.getCmp('fgcReturnDetailForm.returnReson').allowBlank = true;
											Ext.getCmp('fgcReturnDetailForm.returnReson').setValue('');
										}
									}
								}
							}, {
								boxLabel : '其他原因',
								name : 'depOption',
								inputValue : 2,
								listeners : {
									'check' : function(checkbox, checked) {
										if (checked) {
											Ext.getCmp('fgcReturnDetailForm.returnReson').allowBlank = false;
										}
									}
								}
							}],
							fieldLabel : ''
						}, {
							id : 'fgcReturnDetailForm.returnReson',
							name : 'returnReson',
							xtype : 'textarea',
							maxLength :500,
							width : 440,
							allowBlank:true,
							height:100
						}
	
				]
			}),
		buttonAlign:'center',
		buttons:[{
			text:'保存',
			iconCls : 'btn-save',
			handler:function(){
				var comments = "不是规范性文件";
				var depOption = Ext.getCmp('fgcReturnDetailForm').getCmpByName('depOption').getValue();
				if (depOption != 1) {
					comments = Ext.getCmp('fgcReturnDetailForm.returnReson').getValue();
				}
				if (!formPanel.getForm().isValid()){return false;}
				if (!Ext.getCmp('fgcReturnDetailForm').getForm().isValid()){return false;}
				Ext.Ajax.request({
					url : __ctxPath + '/flow/getPreviousStepProcessRun.do',
					params : {
						'taskId' : panel.taskId
					},
					method:'post',
					success : function(response, options) {
						var processForm = Ext.util.JSON.decode(response.responseText).data;
						var prevSignalName  = processForm[0].signalName;
						var prevDestName  = processForm[0].activityName;
						var prevFlowAssignId =  processForm[0].creatorId;
						formPanel.getForm().submit({
								url:__ctxPath+ "/flow/nextProcessActivity.do",
								method:'post',
								waitMsg:'正在提交处理，请稍等',
								scope:this,
								params:{
										taskId : panel.taskId,
										signalName : prevSignalName,
										activityName : activityName,
										comments : comments,
										destName : prevDestName,
										status : '已办理',
										sendMail : msgPanel.getCmpByName('sendMail').getValue(),
										sendMsg : msgPanel.getCmpByName('sendMsg').getValue(),
										sendInfo : msgPanel.getCmpByName('sendInfo').getValue(),
										//看是否指定了执行人员
										flowAssignId : prevFlowAssignId
								},
								success : function(fp, action) {
									if (depOption == 1) {
										// 如果不是规范性文件，需要修改archives表的字段：是否是规范性文件
										Ext.Ajax.request({
											url : __ctxPath + '/archive/changeStandardArchives.do',
											params : {
												'archivesId' : archivesId,
												'isStandard' : 0
											},
											method:'post',
											success : function(response, options) {
												Ext.ux.Toast.msg('操作信息','退回上一步成功！');
												AppUtil.removeTab('ProcessForm' + panel.taskId);
												win.close();
												refreshTaskPanelView();
											},
											failure : function(response, options) {
												Ext.ux.Toast.msg('操作信息', '修改状态出错，请联系管理员！');
											}	
										});
									} else {
										Ext.ux.Toast.msg('操作信息','退回上一步成功！');
										AppUtil.removeTab('ProcessForm' + panel.taskId);
										win.close();
										refreshTaskPanelView();
									}
								},
								failure : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
								}
							}
						
						);
					},
					failure : function(response, options) {
							Ext.ux.Toast.msg('操作信息', '撤回出错，请联系管理员！');
					}
				});
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



//领导角色id
ArchivesUtil.Role_Leaders = '100152,100156'; //100152:处长/主任;100156:副处长/副主任
ArchivesUtil.Role_Leader0 = '100175';//交委领导
ArchivesUtil.NeiQing = '1201163';
ArchivesUtil.Role_JWoffice = '1272407';

//发文单位
ArchivesUtil.IssueDepData = ['重庆市交通委员会',
	'中共重庆市交通委员会', '中共重庆市交通委员会机关党委',
	'中共重庆市交通纪律检查委员会', '共青团重庆市交通委员会',
	'重庆市交通委员会直属机关工会'];

ArchivesUtil.IssueDepData2 = ['重庆市交通委员会思想政治工作人员专业职务工作评定办公室',
    '重庆市交通委员会职称改革办公室'];

ArchivesUtil.SJYIssueDepData = ['重庆市交通规划勘察设计院','重庆市综合交通运输研究所办公室','重庆金路交通工程有限责任公司',
                                '重庆市知朗咨询有限责任公司','重庆市交通工程质量检测有限公司'];

ArchivesUtil.DepId0 = '100131'; //办公室




