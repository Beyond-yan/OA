/**
 * @author:Ropen
 * @class ArchivesDocWin
 * @extends Ext.Panel
 * @description [ArchDispatch]管理
 */
ArchivesDocWin = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	displayPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ArchivesDocWin.superclass.constructor.call(this, {
					id : 'ArchivesDocWinWin',
					iconCls : 'menu-attachment',
					layout : 'form',
					items : [this.docGridPanel],
					modal : true,
					height : 400,
					width : 600,
					maximizable : true,
					title : '公文正文',
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		//初始化formpanel
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
								text : '删除附件文档',
								iconCls : 'btn-del',
								scope : this,
								handler : this.deleteArchiveDoc
							},'-', {
								text : '查看修改文档',
								iconCls : 'menu-archive-issue-manage',
								scope : this,
								handler : this.detailArchivesDoc
							}]
				});

		var sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : true
				});
		this.docGridPanel = new Ext.grid.EditorGridPanel({
					columnWidth : .96,
					border : true,
					id : 'archiveDocGridPanel',
					autoHeight : true,
					store : this.store,
					tbar : this.toolbar,
					sm : sm,
					columns : [new Ext.grid.RowNumberer(), sm, {
								dataIndex : 'docId',
								hidden : true
							},  {
								dataIndex : 'fileAttach',
								hidden : true,
								renderer : function(value) {
									 return value.fileName;
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
								header : '文档路径' ,
								width : 300
							}, {
								dataIndex : 'curVersion',
								header : '当前版本',
								renderer : function(value){
									return '第' + value + '版'; 
								}
							}
					]
				});
		// 初始化功能按钮
		this.buttons = [
				{
					text : '关闭',
					iconCls : 'btn-cancel',
					handler : this.cancel.createCallback(this)
				}];
		
	},// end of the initcomponents
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function(window) {
		window.close();
	},
	/**
	 * 删除公文附件
	 */
	deleteArchiveDoc : function() {
		var grid = Ext.getCmp("archiveDocGridPanel");

		var selectRecords = grid.getSelectionModel().getSelections();

		if (selectRecords.length == 0) {
			Ext.Msg.alert("信息", "请选择要查看的文档！");
			return;
		}

		var record = selectRecords[0];
		var store = grid.getStore();

		var docId = record.data.docId;

		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
							url : __ctxPath + '/archive/multiDelArchivesDoc.do',
							params : {
								ids : docId
							},
							method : 'POST',
							success : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '成功删除该文档附件！');
								// Ext.getCmp('ArchivesGrid').getStore().reload();
								store.remove(record);
							},
							failure : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
							}
						});
			}
		});// end of comfirm
		
	},
	/**
	 * 查看公文附件
	 */
	detailArchivesDoc : function() {
		var grid = Ext.getCmp("archiveDocGridPanel");

		var selectRecords = grid.getSelectionModel().getSelections();

		if (selectRecords.length == 0) {
			Ext.Msg.alert("信息", "请选择要查看的文档！");
			return;
		}
		var record = selectRecords[0];
		var fileId=record.data.fileAttach.fileId;
		
		var path = record.data.docPath;
		var docId = record.data.docId;

		var store = grid.getStore();
		//var curView = Ext.getCmp('ArchivesDraftView');
		// 返回文档附加记录
		var callback = function(archivesDoc) {
			store.reload();
			//curView.insertNewDoc(store, archivesDoc);
		};
		new ArchivesDocFullForm({
					docId : docId,
					fileId:fileId,
					docPath : path,
					callback : callback
				}).show();
	}
});