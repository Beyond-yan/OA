Ext.ns('ArchivesDraftWin');
/**
 * @description 公文拟稿发文界面
 * @class ArchivesDraftWin
 * @extends Ext.Panel
 */
WorkConnFormForConComDraftWin = Ext.extend(Ext.Window, {
	formPanel : null,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.init();
		WorkConnFormForConComDraftWin.superclass.constructor.call(this, {
					title : '发文修改',
					id : 'WorkConnFormForConComDraftWin',
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
						var curView = Ext.getCmp('WorkConnFormForConComDraftWin');
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
		var curView = Ext.getCmp('WorkConnFormForConComDraftWin');
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
			// columnWidth : .96,
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
						width : 300
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
							str += '<button title="历史版本" value=" " class="btn-archive-history" onclick="WorkConnFormForConComDraftWin.attach('
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
								name : 'archives.keywords',
								mapping : 'keywords'
							}, {
								name : 'archives.shortContent',
								mapping : 'shortContent'
							}, {
								name : 'archives.handlerUnames',
								mapping : 'handlerUnames'
							}, {
								name : 'archives.fileCounts',
								mapping : 'fileCounts'
							}, {
								name : 'archives.recDepIds',
								mapping : 'recDepIds'
							}, {
								name : 'archives.recDepNames',
								mapping : 'recDepNames'
							},{
								name : 'archives.issuerId',
								mapping : 'issuerId'
							}
							, {
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
						id : 'WorkConnFormForConComDraftWin.archivesId',
						xtype : 'hidden',
						value : this.archivesId == null ? '' : this.archivesId
					}, {
						name : 'archives.depId',
						xtype : 'hidden'
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
							items : [{
								layout : 'form',
								columnWidth : 0.6,
								items : [/*
											 * { xtype : 'label', text :
											 * '发文部门:', style : 'padding:0px 0px
											 * 0px 0px;', width : 104 }, { //
											 * columnWidth:.4, name :
											 * 'archives.issueDep', id :
											 * 'WorkConnFormForConComDraftWin.issueDep',
											 * xtype : 'textfield', width :
											 * '50%', value : '运营分公司',
											 * allowBlank : false, readOnly :
											 * true },
											 */{
											fieldLabel : '发文部门',
											name : 'archives.issueDep',
											id : 'WorkConnFormForConComDraftWin.issueDep',
											xtype : 'textfield',
											allowBlank : false,
											width : 140
										}]
							}, {
								layout : 'form',
								columnWidth : 0.4,
								items : [{
									fieldLabel : '急缓程度',
									width : 140,
									name : 'archives.urgentLevel',
									id : 'WorkConnFormForConComDraftWin.urgentLevel',
									triggerAction : 'all',
									lazyRender : true,
									editable : false,
									allowBlank : false,
									emptyText : '选择急缓程度',
									xtype : 'combo',
									store : ['正常', '急', '紧急']
								}]
							}]
						}]
					},/*
						 * { layout : 'column', border : false, items : [{
						 * columnWidth : .5, border : false, style :
						 * 'padding:0px 0px 0px 10px;', layout : 'form', items : {
						 * fieldLabel : '公文类型', hiddenName : 'archives.typeId',
						 * xtype : 'combo', allowBlank : false, editable :
						 * false, lazyInit : false, allowBlank : false,
						 * triggerAction : 'all', store : new
						 * Ext.data.SimpleStore({ autoLoad : true, url :
						 * __ctxPath +
						 * '/archive/getFlowByTypeOdFlowtype.do?flowType=1',
						 * fields : ['typeId', 'typeName'] }), displayField :
						 * 'typeName', valueField : 'typeId', listeners : {
						 * select : function(combo, record, index) {
						 * Ext.getCmp('WorkConnFormForConComDraftWin.typeName')
						 * .setValue(record.data.typeName); } } } }] },
						 */{
						xtype : 'fieldset',
						title : '发文设置',
						border : true,
						defaults : {
							anchor : '98%,98%'
						},
						items : [	{
							fieldLabel : '主送',
							name : 'archives.recDepNames',
							id : 'WorkConnFormForConComDraftWin.recDepNames',
							xtype : 'textfield',
							allowBlank : false
						},	{
							fieldLabel : '抄报',
							name : 'archives.handlerUnames',
							id : 'WorkConnFormForConComDraftWin.handlerUnames',
							xtype : 'textfield',
							allowBlank : true
						},/*
							 * { fieldLabel : '主题词', name : 'archives.keywords',
							 * id : 'WorkConnFormForConComDraftWin.keywords', xtype :
							 * 'textfield' },
							 */
						{
							fieldLabel : '标题',
							name : 'archives.subject',
							id : 'WorkConnFormForConComDraftWin.subject',
							xtype : 'textfield',
							allowBlank : false
						}, {
							fieldLabel : '联系事由',
							name : 'archives.shortContent',
							id : 'WorkConnFormForConComDraftWin.shortContent',
							xtype : 'textarea',
							maxLength:2000,
							height : 120
						}, /*
							 * { fieldLabel : '公文来源', name : 'archives.sources',
							 * id : 'WorkConnFormForConComDraftWin.sources', xtype :
							 * 'textfield' }, { fieldLabel : '拟办意见', name :
							 * 'archives.handleOpinion', id :
							 * 'WorkConnFormForConComDraftWin.handleOpinion', xtype :
							 * 'textarea' },
							 */{
							name : 'archives.fileCounts',
							id : 'WorkConnFormForConComDraftWin.fileCounts',
							xtype : 'hidden'
						}, /*
							 * { layout : 'form', items : [{ xtype :
							 * 'container', style : 'padding-top:1px;', layout :
							 * 'column', items : [{ xtype : 'label', text :
							 * '抄送:', width : 105 }, { xtype : 'textfield', name :
							 * 'out_wc_start.userName', id :
							 * 'out_wc_start.userName', readOnly : true, width :
							 * 292 }, { xtype : 'hidden', name :
							 * 'out_wc_start.userId', id : 'out_wc_start.userId' }, {
							 * xtype : 'button', text : '请选择', iconCls :
							 * 'btn-user-sel', handler : function() {
							 * UserSelector .getView( function( userId,
							 * fullName) { var fm = Ext
							 * .getCmp("out_wc_start.startpanel"); fm
							 * .getCmpByName('out_wc_start.userId')
							 * .setValue(userId); fm
							 * .getCmpByName('out_wc_start.userName')
							 * .setValue(fullName); }) .show(); } }] }] },
							 */
								{
									xtype : "textfield",
									name : "archives.issuer",
									fieldLabel : "经办人",
									allowBlank : false,
									readOnly : true,
									width : 240
								}, {
									name : 'archives.issuerid',
									xtype : 'hidden'
								}, {
									xtype : "datefield",
									name : "archives.issueDate",
									format : "Y-m-d",
									fieldLabel : "发文日期",
									width : 240
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

WorkConnFormForConComDraftWin.attach = function(value) {
	var grid = Ext.getCmp("archiveDocGrid");
	var selectRecords = grid.getSelectionModel().getSelections();

	if (selectRecords.length == 0) {
		Ext.Msg.alert("信息", "请选择要查看的文档！");
		return;
	}
	var record = selectRecords[0];
	var curView = Ext.getCmp('WorkConnFormForConComDraftWin');
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