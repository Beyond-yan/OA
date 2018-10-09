Ext.ns('DocFilesView');
DocFilesView = Ext.extend(Ext.Panel,{
		searchPanel : null,
		gridPanel : null,
		constructor : function(_cfg) {
			Ext.applyIf(this, _cfg);
			this.initUIComponents();
			DocFilesView.superclass.constructor.call(this, {
				id : 'DocFilesView',
				iconCls : 'menu-record',
				title : '文件查询',
				region : 'center',
				layout : 'border',
				items : [ this.searchPanel, this.gridPanel ]
			});
	    },// end of constructor
		initUIComponents : function() {
			var nowYear = parseInt(new Date().format('Y'));
			var startYear  = nowYear -13;
			var _url;
			if (isGranted('_DepQuery3')) {
				_url = __ctxPath + '/system/findBySchemaDepartment.do?depId=' + roleMap.get('DepartmentCommonId');
			}else{
				_url = __ctxPath + '/system/findBySchemaDepartment.do?depId=' + roleMap.get('DepartmentCommonId');
			}
			var	depSelector = new TreeSelector('DocFilesView.depTreeSelector', _url, '所属部门',
					'DocFilesView.depId', true);
			var arr = [];
			for(var i = 0; i<=14; i++){
				arr[i] = startYear + i;
			}
			// 初始化搜索条件Panel
			this.searchPanel = new HT.SearchPanel({
				layout : 'form',
				region : 'north',
				frame : true,
				id : 'DocFilesView_searchPanel',
				items : [ {
							layout : 'column',
							items : [{
										columnWidth : 0.23,
										layout : 'form',
										items : [{
												fieldLabel : '标题',
												xtype : 'textfield',
												id : 'DocFilesView.fileName',
												name : 'Q_fileName_S_LK',
												width : 130
												},{
												fieldLabel : '文号',
												xtype : 'textfield',
												id : 'DocFilesView.fileNo',
												name : 'Q_fileNo_S_LK',
												width : 130
												}]
									 },{
										columnWidth : 0.31,
										layout : 'form',
										items : [{
													xtype : 'hidden',
													name : 'Q_department.depId_L_EQ',
													id : 'DocFilesView.depId'
												}, depSelector,
												{
													fieldLabel : '文件类型',
													xtype : 'combo',
													id : 'DocFilesView.fileType',
													hiddenName : 'Q_fileType_N_EQ',
													width : 165,
													mode : 'local',
													editable : false,
													triggerAction : 'all',
													store : [
															 [ '0', '发文' ],
															 [ '1', '收文' ],
															 [ '2', '督办件']]
													}]
									 },{
										columnWidth : 0.23,
										layout : 'form',
										items : [ {
												fieldLabel : '责任者',
												xtype : 'textfield',
												id : 'DocFilesView.dutyPerson',
												name : 'Q_archives.issueDep_S_LK',
												width : 130
											} ,{
												fieldLabel : '开始日期',
												xtype : 'datefield',
												format : 'Y-m-d',
												id : 'DocFilesView.startDate',
												name : 'Q_fileDate_D_GE',
												width : 130
												} ]
									 },{
										columnWidth : 0.23,
										layout : 'form',
										items : [ {
											id : 'DocFilesView.fileYear',
											fieldLabel : '年份',
											width : 130,
											hiddenName : 'Q_fileYear_S_EQ',
											xtype : 'combo',
											mode : 'local',
											editable : false,
											triggerAction : 'all',
											store : arr
										}, {
											fieldLabel : '截止日期',
											xtype : 'datefield',
											format : 'Y-m-d',
											id : 'DocFilesView.endDate',
											name : 'Q_fileDate_D_LE',
											width : 130
											} ]
									} ]
						} ],
						buttons : [{
									text : '查询',
									scope : this,
									iconCls : 'btn-search',
									handler : function(node) {
											var searchPanel = Ext
															.getCmp('DocFilesView_searchPanel');
											var gridPanel = Ext
															.getCmp('DocFilesViewGrid');
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
											Ext.getCmp('DocFilesView_searchPanel')
															.getForm().reset();
												}
								} ]
			});// end of searchPanel
						var store;
						if (isGranted('_DepQuery3')) {
							store= new Ext.data.JsonStore({
							url : __ctxPath + '/system/listDocFiles.do',
							root : 'result',
							totalProperty : 'totalCounts',
							fields : [ 'id', 'fileName', 'fileNo',
									'department.depName', 'pageCount',
									'fileType', 'dutyPerson',
									'secretLevel', 'fileDate', 'fileYear',
									'retentionYear', 'retention', 'remark',
									'createUser', 'createDate', 'updateUser',
									'updateDate','fileStatus','archives','sourceType']
							});
						}else{
							store= new Ext.data.JsonStore({
								url : __ctxPath + '/system/listDocFiles.do?Q_department.depId_L_EQ='+curUserInfo.depId,
								root : 'result',
								totalProperty : 'totalCounts',
								fields : [ 'id', 'fileName', 'fileNo',
										'department.depName', 'pageCount',
										'fileType', 'dutyPerson',
										'secretLevel', 'fileDate', 'fileYear',
										'retentionYear', 'retention', 'remark',
										'createUser', 'createDate', 'updateUser',
										'updateDate','fileStatus','archives','sourceType']
								});
						}
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
												header : "标题",
												dataIndex : 'fileName',
												width : 240,
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
													str+='<a href="#"  onclick="DocFilesView.detail('
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
												width : 40,
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
												width : 40
											},
											{
												header : "文号",
												dataIndex : 'fileNo',
												width : 100
											},
											{
												header : "文件状态",
												dataIndex : 'fileStatus',
												width : 40,
												renderer : function(value) {
													if (value == '0') {
														return "<span>待归档</span>";
													} else if(value == '1'){
														return "<span>已归档</span>";
													}
												}
											}, {
												header : '管理',
												width : 60,
												sortable : false,
												renderer : function(value,metadata, record,rowIndex, colIndex) {
													var str = '';
													var fileType=record.data.fileType;
													var archives=record.data.archives;
													var sourceType=record.data.sourceType;
													if(sourceType!=1){
													if(archives!=null&&archives!=''&&archives!=undefined){
														var archivesId=archives.archivesId;
														var defId=archives.processRun.proDefinition.defId;
														var runId=archives.processRun.runId;
														str = '&nbsp;<button title="原件" value=" " class="btn-search" onclick="DocFilesView.archiveDetail('
															+ archivesId+','+fileType+','+defId+','+runId
															+ ')"></button>原件';
													}
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
							region : 'center',
							id : 'DocFilesViewGrid',
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

					},// end of the initComponents()
					reset : function() {
						this.searchPanel.getForm().reset();
					}
				});
DocFilesView.detail=function(docFilesId, runId, defId) {
	if(null != runId){
		new DocFilesAndProcessDetailForm({
			freshId:'DocFilesViewGrid',
			id:docFilesId,
			runId : runId,
			defId : defId
		}).show();
	} else {
		new DocFilesDetailForm({
			freshId:'DocFilesViewGrid',
			id:docFilesId,
			defId : defId
		}).show();
	}
};
DocFilesView.archiveDetail= function(archivesId,fileType,defId,runId) {
	new JwArchivesDetail({
		archivesId:archivesId,
		fileType:fileType,
		defId:defId,
		runId:runId
	}).show();
};
