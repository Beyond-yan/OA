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
			width : 900,
			autoHeight : true,
			maximizable : true,
			buttonAlign : 'center',
			buttons : this.buttons
		});
	},
	initUIComponents : function() {
		var docDirectoryId=this.id;
		var isSendDir=this.isSendDir;
		var depId=this.depId;
		var dirYear=this.dirYear;
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
											isSendDir:isSendDir,
											depId:depId,
											dirYear:dirYear
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
											Ext.getCmp('DocDirectoryDetailPanel').load({
													url : __ctxPath
														+ '/pages/doc/DocDirectoryDetail.jsp?directoryId='+docDirectoryId,
													nocache : true
											});
										 	Ext.getCmp('DocDirectoryDetailGrid').getStore().reload();
										}
							});
						}
					});
					}
					}, {
						xtype : 'button',
						iconCls : 'excel-cls',
						style : 'padding-left:10px;',
						text : '导出Excel',
						scope : this,
					    handler : function() {
					    	var url = __ctxPath
								+ '/flow/docFilesToExcelDownLoad.do?docDirId='+docDirectoryId;
								url = encodeURI(url);
								url = encodeURI(url);
								window.location.href = url;
						}
					}, {
						xtype : 'button',
						iconCls : 'menu-archive-handout',
						style : 'padding-left:10px;',
						text : '重设行号',
						scope : this,
					    handler : function() {
					    	var grid = Ext.getCmp("DocDirectoryDetailGrid");
							var selectRecords = grid.getSelectionModel().getSelections();
							if (selectRecords.length == 0) {
								Ext.ux.Toast.msg("信息","请选择要重设行号的文件！");
								return;
							}else if(selectRecords.length > 1){
								Ext.ux.Toast.msg("信息","请选择一个文件进行重设行号！");
								return;
							}else{
								var fileValue=selectRecords[0].data.id;
					    		new RowNumberResetForm({
					    			docFileId:fileValue,
					    			directoryId:docDirectoryId
					    		}).show();
							}
						}
					}]
	});

			var store = new Ext.data.JsonStore({
				url : __ctxPath + '/system/listDocFiles.do?isRowNumberSort=true&Q_docDirectory.id_L_EQ='+this.id,
				root : 'result',
				totalProperty : 'totalCounts',
				fields : [ 'id', 'fileName', 'fileNo',
						'fileIssup', 'pageCount',
						'fileType', 'dutyPerson',
						'secretLevel', 'fileDate', 'fileYear',
						'retentionYear', 'retention', 'remark',
						'createUser', 'createDate', 'updateUser',
						'updateDate','archives','fileNumber','rowNumber','sourceType', 'totalBytes']
			});
			store.setDefaultSort('rowNumber', 'asc');
			store.load();
			var record_start = 0;
			var sm = new Ext.grid.CheckboxSelectionModel();
			var cm = new Ext.grid.ColumnModel(
					{
						columns : [sm,new Ext.grid.RowNumberer({
									  header : "序号",
									  width : 35,
									  renderer:function(value,metadata,record,rowIndex){
									   return record_start + 1 + rowIndex;
									  }
								}),
								{
									header : "id",
									dataIndex : 'id',
									id : 'filesId',
									hidden : true
								},{
									header : "件号",
									dataIndex : 'fileNumber',
									width : 30
								},
								{
									header : "责任者",
									dataIndex : 'fileIssup',
									width : 150
								},
								/*{
									header : "文件类型",
									dataIndex : 'fileType',
									width : 50,
									renderer : function(value) {
										if (value == '0') {
											return "<span>发文</span>";
										} else if(value == '1'){
											return "<span>收文</span>";
										}
									}
								},*/
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
									header : "文件大小",
									dataIndex : 'totalBytes',
									width : 50,
									renderer : function(value) {
										return (value / (1024 * 1024)).toFixed(2) + ' MB';
									}
								},
								{
									header : "题名",
									dataIndex : 'fileName',
									width : 180,
									renderer:function(value, metadata, record, rowIndex,
											colIndex){
										var docFilesId=record.data.id;
										var archives = record.data.archives;
										var runId = null;
										if(null != archives){
											var processRun = archives.processRun;
											if(null != processRun){
												runId = processRun.runId;
												var pro = processRun.proDefinition;
												if(null != pro){
													var defId = pro.defId
												}
											}
										}
										var str = '';
										str+='<a href="#"  onclick="DocDirectoryDetailForm.detail('
											+ docFilesId+ ',' + runId + ',' + defId +')">'+value+'</a>';
										return str;
								}
								}, {
									header : '管理',
									width : 50,
									sortable : false,
									renderer : function(value,metadata, record,rowIndex, colIndex) {
										var str="";
										var sourceType=record.data.sourceType;
										var archives=record.data.archives;
										if(sourceType!=1&&archives!=null){
											var archivesId=record.data.archives.archivesId;
											var fileType=record.data.fileType;
											var defId=record.data.archives.processRun.proDefinition.defId;
											var runId=record.data.archives.processRun.runId;
											str = '&nbsp;<button title="原件" value=" " class="btn-search" onclick="DocDirectoryDetailForm.archiveDetail('
												+ archivesId+','+fileType+','+defId+','+runId
												+ ')"></button>原件';
										}
										return str;
									}
								}],
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
					emptyMsg : "当前没有记录",
					doLoad : function(start){
				   		  record_start = start;
				          var o = {}, pn = this.getParams();
				          o[pn.start] = start;
				          o[pn.limit] = this.pageSize;
				          this.store.load({params:o});
					}
				})
			});

	}
});
DocDirectoryDetailForm.detail=function(docFilesId, runId, defId) {
	if(null != runId){
		new DocFilesAndProcessDetailForm({
			freshId:'DocDirectoryDetailGrid',
			id:docFilesId,
			runId : runId,
			defId : defId
		}).show();
	} else {
		new DocFilesDetailForm({
			freshId:'DocDirectoryDetailGrid',
			id:docFilesId,
			defId : defId
		}).show();
	}
}
DocDirectoryDetailForm.archiveDetail= function(archivesId,fileType,defId,runId) {
	new JwArchivesDetail({
		archivesId:archivesId,
		fileType:fileType,
		defId:defId,
		runId:runId
	}).show();
};