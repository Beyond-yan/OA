Ext.ns('ArchivesDraftWin');
/**
 * @description 公文拟稿发文界面
 * @class ArchivesDraftWin
 * @extends Ext.Panel
 */
RedHeadArticleDraftWin = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		RedHeadArticleDraftWin.superclass.constructor.call(this, {
					title : '发文修改',
					id : 'RedHeadArticleDraftWin',
					iconCls : 'menu-archive-draft',
					layout : 'form',
					defaults : {
						border : false,
						autoScroll : true,
						anchor : '97%,97%'
					},
					width : 800,
					autoHeight : true,
					buttonAlign : 'center',
					buttons : [{
								text : '保存',
								iconCls : 'btn-save',
								handler : this.onSend,
								scope : this
							}, {
								text : '关闭',
								iconCls : 'btn-del',
								handler : this.closePanel,
								scope : this
							}],
					items : [this.formPanel]
				});
	},
	/**
	 * 关闭Panel
	 */
	closePanel : function() {
		this.close();
	},
	/**
	 * 保存公文的方法,传入公文状态作为参数
	 * 
	 * @param {}
	 *            _status
	 */
	onSave : function(win) {

		if (this.formPanel.getForm().isValid()) {

			// 发文的文档附件
			var docParams = [];

			for (var i = 0, cnt = this.store.getCount(); i < cnt; i++) {
				docParams.push(this.store.getAt(i).data);
			}

			var detailPanel = this.detailPanel;

			this.formPanel.getForm().submit({
						method : 'POST',
						waitMsg : '正在提交数据...',
						params : {
							docs : Ext.encode(docParams)
						},
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存信息！');
							if (detailPanel != null
									&& detailPanel != 'undefined') {
								detailPanel.getUpdater().refresh();
							}
							win.close();
							// TODO
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
	},
	/**
	 * 拟搞完成,发送给指定的人员核稿
	 */
	onSend : function() {
		this.onSave(this);
	},
	/**
	 * 添加附件文档
	 */
	addArchiveDoc : function() {
		// 判断是否选择了文档分类
		var archiveTypeId = Ext.getCmp('archiveTypeId');
		new ArchTemplateSelector({
					callback : function(fileId, tempPath) {
						// alert('tempPath:' + tempPath);
						var store = Ext.getCmp('archiveDocGrid').getStore();
						var curView = Ext.getCmp('RedHeadArticleDraftWin');
						// 返回文档附加记录
						var callback = function(archivesDoc) {
							// alert('coming in callback.' + archivesDoc);
							curView.insertNewDoc(store, archivesDoc);
						};
						new ArchivesDocForm({
									fileId : fileId,
									docPath : tempPath,
									callback : callback
								}).show();
					}
				}).show();

	},
	/**
	 * 插入附加文件记录
	 * 
	 * @param {}
	 *            store
	 * @param {}
	 *            archivesDoc
	 */
	insertNewDoc : function(store, archivesDoc) {
		var orec;
		if (store.recordType) {
			orec = new store.recordType();
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
	},

	/**
	 * 添加新的公文文档，以一个空白的文档开始
	 */
	addNewArchiveDoc : function() {
		var store = this.store;
		var curView = this;
		// 返回文档附加记录
		var callback = function(archivesDoc) {
			curView.insertNewDoc(store, archivesDoc);
		};
		new ArchivesDocForm({
					callback : callback
				}).show();
	},
	/**
	 * 上传附件
	 */
	uploadArchiveDoc : function() {
		var store = this.store;
		var curView = this;
		var callback = function(data) {
			for (var i = 0; i < data.length; i++) {
				var archivesDoc = {
					docId : 0,// 用于标记尚未持久化的记录
					fileId : data[i].fileId,
					docPath : data[i].filepath,
					docName : data[i].filename,
					curVersion : 1
				};
				curView.insertNewDoc(store, archivesDoc);
			}
		};
		var dialog = App.createUploadDialog({
					file_cat : 'archive',
					callback : callback
				});
		dialog.show();
	},
	/**
	 * 删除公文附件
	 */
	deleteArchiveDoc : function() {
		var grid = Ext.getCmp("archiveDocGrid");

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
						store.remove(record);
					});// end of comfirm
		} else {
			Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
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
											// Ext.getCmp('ArchivesGrid').getStore().reload();
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
	},
	/**
	 * 查看公文附件
	 */
	detailArchivesDoc : function() {
		var grid = Ext.getCmp("archiveDocGrid");

		var selectRecords = grid.getSelectionModel().getSelections();

		if (selectRecords.length == 0) {
			Ext.Msg.alert("信息", "请选择要查看的文档！");
			return;
		}
		var record = selectRecords[0];
		var path = record.data.docPath;
		var docId = record.data.docId;
		var fileId = null;
		if (record.data.fileAttach) {
			fileId = record.data.fileAttach.fileId;
		} else {
			fileId = record.data.fileId;
		}
		var store = grid.getStore();
		var curView = Ext.getCmp('RedHeadArticleDraftWin');
		// 返回文档附加记录
		var callback = function(archivesDoc) {
			store.remove(record);
			curView.insertNewDoc(store, archivesDoc);
		};
		new ArchivesDocForm({
					fileId : fileId,
					docId : docId,
					docPath : path,
					callback : callback
				}).show();
	},

	/**
	 * init the components
	 */
	init : function() {
		// 加载数据至store TODO change the archiveIds
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + '/archive/listArchivesDoc.do?archivesId='
							+ this.archivesId,
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'docId',
								type : 'int'
							}, 'fileAttach', 'creator', 'creatorId',
							'menderId', 'mender', 'docName', 'docStatus',
							'curVersion', 'docPath', 'updatetime', 'createtime']
				});
		this.store.setDefaultSort('docId', 'desc');
		if (this.archivesId != null && this.archivesId != ''
				&& this.archivesId != 'undefined') {
			this.store.load();
		}
		this.toolbar = new Ext.Toolbar({
					height : 30,
					items : [{
								text : '按模板在线添加',
								iconCls : 'menu-archive-template',
								handler : this.addArchiveDoc,
								scope : this
							}, '-', {
								text : '在线添加',
								iconCls : 'btn-edit-online',
								handler : this.addNewArchiveDoc,
								scope : this
							}, '-', {
								text : '上传文档',
								iconCls : 'btn-upload',
								handler : this.uploadArchiveDoc,
								scope : this
							}, '-', {
								text : '删除附件文档',
								iconCls : 'btn-del',
								scope : this,
								handler : this.deleteArchiveDoc
							}, '-', {
								text : '查看修改文档',
								iconCls : 'menu-archive-issue-manage',
								scope : this,
								handler : this.detailArchivesDoc
							}]
				});

		var sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : true
				});
		// 初始化附件文档
		this.docGridPanel = new Ext.grid.EditorGridPanel({
			title : '公文正文',
			iconCls : 'menu-attachment',
			columnWidth : .96,
			border : true,
			id : 'archiveDocGrid',
			autoHeight : true,
			store : this.store,
			tbar : this.toolbar,
			sm : sm,
			columns : [new Ext.grid.RowNumberer(), sm, {
						dataIndex : 'docId',
						hidden : true
					}, {
						dataIndex : 'fileAttach',
						hidden : true,
						renderer : function(value) {
							// return value.fileId;
						}
					}, {
						dataIndex : 'docStatus',
						hidden : true
					}, {
						dataIndex : 'menderId',
						hidden : true
					}, {
						dataIndex : 'creatorId',
						hidden : true
					}, {
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
						renderer : function(value) {
							return '第' + value + '版';
						}
					}, {
						header : '管理',
						width : 100,
						dataIndex : 'docId',
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var str = '';
							str += '<button title="历史版本" value=" " class="btn-archive-history" onclick="RedHeadArticleDraftWin.attach('
									+ value + ')">&nbsp;&nbsp;</button>';
							return str;
						}
					}]
		});
		// 初始化表单
		this.formPanel = new Ext.FormPanel({
			columnWidth : .96,
			layout : 'form',
			autoHeight : true,
			style : 'padding:6px 6px 16px 5%',
			url : __ctxPath + '/archive/saveNormalArchives.do',
			// id : 'ArchivesForm',
			defaults : {
				anchor : '96%,96%'
			},
			reader : new Ext.data.JsonReader({
						root : 'data'
					}, [{
								name : 'archives.archviesId',
								mapping : 'archivesId'
							}, {
								name : 'archives.privacyLevel',
								mapping : 'privacyLevel'
							}, {
								name : 'archives.urgentLevel',
								mapping : 'urgentLevel'
							}, {
								name : 'archives.subject',
								mapping : 'subject'
							}, {
								name : 'archives.issueDep',
								mapping : 'issueDep'
							}, {
								name : 'archives.depId',
								mapping : 'depId'
							}, {
								name : 'archives.shortContent',
								mapping : 'shortContent'
							}, {
								name : 'archives.fileCounts',
								mapping : 'fileCounts'
							}, {
								name : 'archives.recDepIds',
								mapping : 'recDepIds'
							}, {
								name : 'archives.recDepNames',
								mapping : 'recDepNames'
							}, {
								name : 'archives.issuerId',
								mapping : 'issuerId'
							}, {
								name : 'archives.issuer',
								mapping : 'issuer'
							}, {
								name : 'archives.issueDate',
								mapping : 'issueDate'
							}, {
								name : 'ccIds',
								mapping : 'ccIds'
							}, {
								name : 'ccNames',
								mapping : 'ccNames'
							}]),
			items : [{
						name : 'archives.archivesId',
						id : 'RedHeadArticleDraftWin.archivesId',
						xtype : 'hidden',
						value : this.archivesId == null ? '' : this.archivesId
					}, {
						name : 'archives.issuerId',
						xtype : 'hidden'
					}, {
						name : 'archives.depId',
						id : 'RedHeadArticleDraftWin.depId',
						xtype : 'hidden'
					}, {
						xtype : 'hidden',
						name : 'archives.isArchive',
						value : 0
					}, {
						layout : 'form',
						border : false,
						style : 'padding:0px 0px 7px 0px;',
						defaults : {
							anchor : '96%,96%'
						},
						items : [{
							layout : 'column',
							border : false,
							defaults : {
								border : false
							},
							items : [

							{
								layout : 'form',
								columnWidth : 0.6,
								items : [/*
											 * { xtype : 'container', layout :
											 * 'column', style :
											 * 'padding-left:0px;margin-left:0px;',
											 * height : 30, defaults : { border :
											 * false }, items : [{ xtype :
											 * 'label', text : '拟稿单位:', style :
											 * 'padding:0px 0px 0px 0px;', width :
											 * 104 }, { // columnWidth:.4, name :
											 * 'archives.issueDep', id :
											 * 'RedHeadArticleDraftWin.issueDep',
											 * xtype : 'textfield', value :
											 * curUserInfo.depName, allowBlank :
											 * false, readOnly : true, width :
											 * 140 }, { xtype : 'button',
											 * iconCls : 'menu-department', text :
											 * '选择部门', handler : function() {
											 * DepSelector3.getView(
											 * function(depId, depName) { Ext
											 * .getCmp('RedHeadArticleDraftWin.issueDep')
											 * .setValue(depName); Ext
											 * .getCmp('RedHeadArticleDraftWin.depId')
											 * .setValue(depId); },
											 * true).show(); } }] },
											 */{
											fieldLabel : "拟稿单位",
											name : 'archives.issueDep',
											id : 'RedHeadArticleDraftWin.issueDep',
											xtype : 'textfield',
											allowBlank : false,
											readOnly : true,
											width : 140
										}, {
											xtype : "datefield",
											name : "archives.issueDate",
											format : "Y-m-d",
											fieldLabel : "拟稿时间",
											width : 140
										}]
							}, {
								layout : 'form',
								columnWidth : 0.4,
								items : [{
											xtype : "textfield",
											name : "archives.issuer",
											fieldLabel : "拟稿人",
											allowBlank : false,
											readOnly : true,
											width : 140
										}, {
											fieldLabel : '秘密等级',
											name : 'archives.privacyLevel',
											id : 'RedHeadArticleDraftWin.privacyLevel',
											triggerAction : 'all',
											lazyRender : true,
											editable : false,
											allowBlank : false,
											emptyText : '选择秘密等级',
											xtype : 'combo',
											store : ['普通', '秘密', '机密', '绝密'],
											width : 140
										}]
							}]

						}]
					}, {
						xtype : 'fieldset',
						title : '发文设置',
						border : true,
						defaults : {
							anchor : '98%,98%'
						},
						items : [/*
									 * { layout : 'form', // columnWidth : .4,
									 * border : false, items : { fieldLabel :
									 * '文件编号', name : 'archives.archivesNo', id :
									 * 'RedHeadArticleDraftWin.archivesNo',
									 * xtype : 'textfield', allowBlank : false,
									 * anchor : '100%' } },
									 */{
									fieldLabel : '标题',
									name : 'archives.subject',
									id : 'RedHeadArticleDraftWin.subject',
									xtype : 'textfield',
									allowBlank : false,
									width : '60%'
								}, {
									xtype : 'container',
									layout : 'column',
									style : 'padding:0px 0px 8px 0px;margin-left:0px;',
									defaults : {
										border : false
									},
									items : [{
												xtype : 'label',
												style : 'padding:0px 0px 0px 0px;',
												text : '主送:',
												width : 105
											}, {
												// columnWidth:.6,
												xtype : 'textfield',
												name : 'archives.recDepNames',
												width : '67%',
												readOnly : true,
												id : 'RedHeadArticleDraftWin.recDepNames'
											}, {
												xtype : 'hidden',
												name : 'archives.recDepIds',
												id : 'RedHeadArticleDraftWin.recDepIds'
											}, {
												xtype : 'button',
												iconCls : 'menu-department',
												text : '选择部门',
												handler : function() {
													var depIdsTemp = Ext
															.getCmp('RedHeadArticleDraftWin.recDepIds')
															.getValue();
													var depNamesTemp = Ext
															.getCmp('RedHeadArticleDraftWin.recDepNames')
															.getValue();
													var array1 = [];
													var array2 = [];

													var m = new Map();
													if (depIdsTemp != null
															&& depIdsTemp != '') {
														array1 = depIdsTemp
																.split(',');
														array2 = depNamesTemp
																.split(',');
														for (var i = 0; i < array1.length; i++) {
															m.put(array1[i],
																	array2[i]);
														}
													}

													DepSelector3.getView(
															function(depIds,
																	depNames) {
																Ext
																		.getCmp('RedHeadArticleDraftWin.recDepIds')
																		.setValue(depIds);
																Ext
																		.getCmp('RedHeadArticleDraftWin.recDepNames')
																		.setValue(depNames);
															}, false, m).show();
												}
											}]
								}, {
									xtype : 'container',
									layout : 'column',
									style : 'padding:0px 0px 8px 0px;margin-left:0px;',
									defaults : {
										border : false
									},
									items : [{
												xtype : 'label',
												style : 'padding:0px 0px 0px 0px;',
												text : '抄报:',
												width : 105
											}, {
												// columnWidth:.6,
												xtype : 'textfield',
												name : 'ccNames',
												width : '67%',
												readOnly : true,
												id : 'RedHeadArticleDraftWin.ccNames'
											}, {
												xtype : 'hidden',
												name : 'ccIds',
												id : 'RedHeadArticleDraftWin.ccIds'
											}, {
												xtype : 'button',
												iconCls : 'menu-department',
												text : '选择抄报人',
												handler : function() {
													var userIdsTemp = Ext
															.getCmp('RedHeadArticleDraftWin.ccIds')
															.getValue();
													var fullnamesTemp = Ext
															.getCmp('RedHeadArticleDraftWin.ccNames')
															.getValue();
													var array1 = [];
													var array2 = [];

													var m = new Map();
													if (userIdsTemp != null
															&& fullnamesTemp != '') {
														array1 = userIdsTemp
																.split(',');
														array2 = fullnamesTemp
																.split(',');
														for (var i = 0; i < array1.length; i++) {
															m.put(array1[i],
																	array2[i]);
														}
													}
													DeptOfUserSelector.getView(
															function(userIds,
																	fullnames) {
																Ext
																		.getCmp('RedHeadArticleDraftWin.ccIds')
																		.setValue(userIds);
																Ext
																		.getCmp('RedHeadArticleDraftWin.ccNames')
																		.setValue(fullnames);
															}, false, false,
															16, m).show();
												}
											}]
								},/*
									 * { fieldLabel : '主题词', name :
									 * 'archives.keywords', id :
									 * 'InnerWorkConnSendInitView.keywords',
									 * xtype : 'textfield' },
									 */
								{
									name : 'archives.fileCounts',
									id : 'RedHeadArticleDraftWin.fileCounts',
									xtype : 'hidden',
									value : '0'
								}]
						// end of the field set items
					},// end of fieldset
					this.docGridPanel]
		});
		// 加载表单对应的数据
		if (this.archivesId != null && this.archivesId != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/archive/getIssueArchives.do?archivesId='
						+ this.archivesId,
				waitMsg : '正在载入数据...',
				success : function(form, action) {

				},
				failure : function(form, action) {
				}
			});
		}
	}// end of init
});

RedHeadArticleDraftWin.attach = function(value) {
	var grid = Ext.getCmp("archiveDocGrid");
	var selectRecords = grid.getSelectionModel().getSelections();

	if (selectRecords.length == 0) {
		Ext.Msg.alert("信息", "请选择要查看的文档！");
		return;
	}
	var record = selectRecords[0];
	var curView = Ext.getCmp('RedHeadArticleDraftWin');
	var store = grid.getStore();
	// 返回文档附加记录
	var callback = function(archivesDoc) {
		store.remove(record);
		curView.insertNewDoc(store, archivesDoc);
	};
	new ArchivesDocHistoryWin({
				docId : value,
				callback : callback
			}).show();
}