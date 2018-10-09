Ext.ns('ToBeDocFilesView');
ToBeDocFilesView = Ext.extend(Ext.Panel,{
		searchPanel : null,
		gridPanel : null,
		constructor : function(_cfg) {
			Ext.applyIf(this, _cfg);
			this.initUIComponents();
			ToBeDocFilesView.superclass.constructor.call(this, {
				id : 'ToBeDocFilesView',
				iconCls : 'menu-record',
				title : '待归档件',
				region : 'center',
				layout : 'border',
				items : [ this.searchPanel, this.gridPanel ]
			});
	    },// end of constructor
		initUIComponents : function() {
			var _url=__ctxPath + '/system/findBySchemaDepartment.do?depId=' + roleMap.get('DepartmentCommonId');;
			/*if (isGranted('_DepQuery2')) {
				_url = __ctxPath + '/system/listDepartment.do?opt=docFiles.department';
			}else{
				_url = __ctxPath + '/system/listByDepIdDepartment.do?depId='+curUserInfo.depId+'&opt=docFiles.department';
			}*/
			var	depSelector = new TreeSelector('ToBeDocFilesView.depTreeSelector', _url, '所属部门',
					'ToBeDocFilesView.depId', true);
			// 初始化搜索条件Panel
			this.searchPanel = new HT.SearchPanel({
				layout : 'form',
				region : 'north',
				frame : true,
				id : 'ToBeDocFilesView_searchPanel',
				items : [ {
							layout : 'column',
							items : [{
										columnWidth : 0.23,
										layout : 'form',
										items : [ {
												fieldLabel : '标题',
												xtype : 'textfield',
												id : 'ToBeDocFilesView.fileName',
												name : 'Q_fileName_S_LK',
												width : 100
												} ]
									 },{
										columnWidth : 0.3,
										layout : 'form',
										items : [{
												xtype : 'hidden',
												name : 'Q_department.depId_L_EQ',
												id : 'ToBeDocFilesView.depId'
										         }, depSelector ]
									 },{
										columnWidth : 0.23,
										layout : 'form',
										items : [ {
												fieldLabel : '文件日期',
												xtype : 'datefield',
												format : 'Y-m-d',
												id : 'ToBeDocFilesView.fileDate',
												name : 'Q_fileDate_D_EQ',
												width : 100
												} ]
									 },{
										columnWidth : 0.24,
										layout : 'form',
										items : [ {
											fieldLabel : '文件类型',
											xtype : 'combo',
											id : 'ToBeDocFilesView.fileType',
											hiddenName : 'Q_fileType_N_EQ',
											width : 140,
											mode : 'local',
											editable : false,
											triggerAction : 'all',
											store : [
													 [ '0', '发文' ],
													 [ '1', '收文' ]],
													emptyText : '---请选择文件类型---'
											}  ]
									}]
						}],
						buttons : [{
									text : '查询',
									scope : this,
									iconCls : 'btn-search',
									handler : function(node) {
											var searchPanel = Ext
															.getCmp('ToBeDocFilesView_searchPanel');
											var gridPanel = Ext
															.getCmp('ToBeDocFilesViewGrid');
											if (searchPanel.getForm().isValid()) {
												 $search({
															searchPanel : searchPanel,
															gridPanel : gridPanel
														});
												}
									}
								 },{
									text : '重置',
									scope : this,
									iconCls : 'btn-reset',
									handler : function() {
											Ext.getCmp('ToBeDocFilesView_searchPanel')
															.getForm().reset();
												}
								} ]
			});// end of searchPanel
						
				var topbar = new Ext.Toolbar({
						items : [{
								   iconCls : 'btn-add',
								   text : '添加',
								   xtype : 'button',
								   scope : this,
								   handler : function() {
									   new DocFilesForm({
														gridId : 'ToBeDocFilesViewGrid'
														}).show();
									}
								},{
									iconCls : 'btn-del',
									text : '删除',
									xtype : 'button',
									scope : this,
									handler : function() {
										var grid = Ext.getCmp("ToBeDocFilesViewGrid");
										var selectRecords = grid.getSelectionModel()
															.getSelections();
										if (selectRecords.length == 0) {
												Ext.ux.Toast.msg("信息",
																"请选择要删除的记录！");
														return;
											}
										var ids = Array();
										for ( var i = 0; i < selectRecords.length; i++) {
												ids.push(selectRecords[i].data.id);
											}
										ToBeDocFilesView.remove(ids);
									}
								}]
				});
				var store;
				if (isGranted('_DepQuery2')) {
					store = new Ext.data.JsonStore({
					url : __ctxPath + '/system/listDocFiles.do?Q_fileStatus_SN_EQ=0',
					root : 'result',
					totalProperty : 'totalCounts',
					fields : [ 'id', 'fileName', 'fileNo',
							'department.depName', 'pageCount',
							'fileType', 'dutyPerson',
							'secretLevel', 'fileDate', 'fileYear',
							'retentionYear', 'retention', 'remark',
							'createUser', 'createDate', 'updateUser',
							'updateDate' ,'archives','sourceType','fileNumber']
					});
				}else{
					store = new Ext.data.JsonStore({
						url : __ctxPath + '/system/listDocFiles.do?Q_fileStatus_SN_EQ=0&Q_department.depId_L_EQ='+curUserInfo.depId,
						root : 'result',
						totalProperty : 'totalCounts',
						fields : [ 'id', 'fileName', 'fileNo',
								'department.depName', 'pageCount',
								'fileType', 'dutyPerson',
								'secretLevel', 'fileDate', 'fileYear',
								'retentionYear', 'retention', 'remark',
								'createUser', 'createDate', 'updateUser',
								'updateDate' ,'archives','sourceType','fileNumber']
						});
				}
						store.setDefaultSort('fileDate', 'desc');
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
												header : "标题",
												dataIndex : 'fileName',
												width : 220,
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
													str+='<a href="#"  onclick="ToBeDocFilesView.detail('
														+ docFilesId+ ',' + runId + ',' + defId +')">'+value+'</a>';
													return str;
											}
											},{
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
												header : '管理',
												width : 60,
												sortable : false,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {
													var editId = record.data.id;
													var str = '';
													str = '<button title="删除" value=" " class="btn-del" onclick="ToBeDocFilesView.remove('
															+ editId
															+ ')"></button>删除';
													str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="ToBeDocFilesView.edit('
															+ editId
															+ ')"></button>编辑';
													var fileType=record.data.fileType;
													var archives=record.data.archives;
													var sourceType=record.data.sourceType;
													if(sourceType!=1){
													if(archives!=null&&archives!=''&&archives!=undefined){
														var archivesId=archives.archivesId;
														var defId=archives.processRun.proDefinition.defId;
														var runId=archives.processRun.runId;
														str += '&nbsp;<button title="原件" value=" " class="btn-search" onclick="ToBeDocFilesView.archiveDetail('
															+ archivesId+','+fileType+','+defId+','+runId
															+ ')"></button>原件';
													}
													}
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
							id : 'ToBeDocFilesViewGrid',
							height : 800,
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

					},
					reset : function() {
						this.searchPanel.getForm().reset();
					}
				});// end of the initComponents()
ToBeDocFilesView.remove = function(id) {
	var grid = Ext.getCmp("ToBeDocFilesViewGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该文件吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath + '/system/multiDelDocFiles.do',
				params : {
					ids : id
				},
				method : 'post',
				success : function() {
					Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
					grid.getStore().reload({
						params : {
							start : 0,
							limit : 25
						}
					});
				}
			});
		}
	});
};
ToBeDocFilesView.detail= function(docFilesId, runId, defId) {
	if(null != runId){
		new DocFilesAndProcessDetailForm({
			freshId:'ToBeDocFilesViewGrid',
			id:docFilesId,
			runId : runId,
			defId : defId
		}).show();
	} else {
		new DocFilesDetailForm({
			freshId:'ToBeDocFilesViewGrid',
			id:docFilesId,
			defId : defId
		}).show();
	}
};
/**
 * 编辑
 */
ToBeDocFilesView.edit = function(editId) {
	new DocFilesForm({
	freshId:'ToBeDocFilesViewGrid',
	fileId:editId
}).show();
};

ToBeDocFilesView.archiveDetail= function(archivesId,fileType,defId,runId) {
	new JwArchivesDetail({
		archivesId:archivesId,
		fileType:fileType,
		defId:defId,
		runId:runId
	}).show();
};
