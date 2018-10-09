DocDirectoryDetailForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	displayPanel : null,
	gridPanel:null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DocDirectoryDetailForm.superclass.constructor.call(this, {
			id:'DocDirectoryDetailForm',
			layout : 'form',
			items : [this.displayPanel, this.gridPanel],
			modal : true,
			height : 650,
			title : '归档文件目录',
			width : 700,
			autoHeight : true,
			maximizable : true,
			buttonAlign : 'center',
			buttons : this.buttons
		});
	},
	initUIComponents : function() {
		var docDirectoryId=this.id;
		var isSendDir=this.isSendDir;
		this.displayPanel = new Ext.Panel({
			id : 'DocDirectoryDetailPanel',
			autoScroll : true,
			autoHeight : true,
			border : false,
			autoLoad : {
				url : __ctxPath
						+ '/pages/doc/DocDirectoryDetail.jsp?directoryId='+this.id,
				nocache : true
			}
		});
		var topbar = new Ext.Toolbar({
			items : [{
					   iconCls : 'btn-add',
					   text : '添加文件',
					   xtype : 'button',
					   scope : this,
					   handler : function() {
						   new ToBeDocFilesForm({
											id:docDirectoryId,
											isSendDir:isSendDir
											}).show();
						}
					},{
						iconCls : 'btn-del',
						text : '移除文件',
						xtype : 'button',
						scope : this,
						handler : function() {
							var grid = Ext.getCmp("DocDirectoryDetailGrid");
							var selectRecords = grid.getSelectionModel()
												.getSelections();
							if (selectRecords.length == 0) {
									Ext.ux.Toast.msg("信息",
													"请选择要移除的文件！");
											return;
								}
							Ext.Msg.confirm('信息确认', '您确认要从档案中移除所选文件吗？', function(btn) {
						if (btn == 'yes') {
							var ids = Array();
							for ( var i = 0; i < selectRecords.length; i++) {
									ids.push(selectRecords[i].data.id);
								}
							Ext.Ajax.request({
								url : __ctxPath+ '/system/unbindDirectoryDocFiles.do',
								params : {
										'docFilesIds' : ids,
										'docDirectoryId' : docDirectoryId
										},
								method : 'post',
								success : function(response, options) {
											Ext.ux.Toast.msg('操作信息', '移除成功！');
											
										}
									});
							Ext.getCmp('DocDirectoryDetailPanel').load({
								url : __ctxPath
									+ '/pages/doc/DocDirectoryDetail.jsp?directoryId='+docDirectoryId,
								nocache : true
						});
						 Ext.getCmp('DocDirectoryDetailGrid').getStore().reload();
						}
					});
					}
					}]
	});

			var store = new Ext.data.JsonStore({
				url : __ctxPath + '/system/listDocFiles.do?Q_docDirectory.id_L_EQ='+this.id,
				root : 'result',
				totalProperty : 'totalCounts',
				fields : [ 'id', 'fileName', 'fileNo',
						'department.depName', 'pageCount',
						'fileType', 'dutyPerson',
						'secretLevel', 'fileDate', 'fileYear',
						'retentionYear', 'retention', 'remark',
						'createUser', 'createDate', 'updateUser',
						'updateDate' ]
			});
			store.setDefaultSort('id', 'desc');
			store.load();

			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel(
					{
						columns : [
								sm,
								new Ext.grid.RowNumberer(),
								{
									header : "id",
									dataIndex : 'id',
									id : 'filesId',
									hidden : true
								},
								{
									header : "所属部门",
									dataIndex : 'department.depName',
									width : 40
								},
								{
									header : "文件类型",
									dataIndex : 'fileType',
									width : 30,
									renderer : function(value) {
										if (value == '0') {
											return "<span>发文</span>";
										} else if(value == '1'){
											return "<span>收文</span>";
										}
									}
								},
								{
									header : "日期",
									dataIndex : 'fileDate',
									width : 60
								},
								{
									header : "文号",
									dataIndex : 'fileNo',
									width : 70
								},
								{
									header : "标题",
									dataIndex : 'fileName',
									width : 180,
									renderer:function(value, metadata, record, rowIndex,
											colIndex){
										var docFilesId=record.data.id;
										var str = '';
										str+='<a href="#"  onclick="DocDirectoryDetailForm.detail('
											+ docFilesId+')">'+value+'</a>';
										return str;
								}
								} ],
						defaults : {
							sortable : true,
							menuDisabled : true,
							width : 100
						},
						listeners : {
							hiddenchange : function(cm, colIndex,
									hidden) {
								saveConfig(colIndex, hidden);
							}
						}
					});

		
			this.gridPanel = new Ext.grid.GridPanel({
				tbar : topbar,
				region : 'center',
				id : 'DocDirectoryDetailGrid',
				height : 400,
				width : '100%',
				title : '文件列表',
				store : store,
				shim : true,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				cm : cm,
				sm : sm,
				viewConfig : {
					forceFit : true,
					enableRowBody : false,
					showPreview : false
				},
				bbar : new Ext.PagingToolbar({
					pageSize : 25,
					store : store,
					displayInfo : true,
					displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
					emptyMsg : "当前没有记录"
				})
			});

	}
});
DocDirectoryDetailForm.detail= function(docFilesId) {
	new DocFilesDetailForm({
		freshId:'DocDirectoryDetailGrid',
		id:docFilesId
	}).show();
};