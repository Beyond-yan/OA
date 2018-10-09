Ext.ns('ToBeDocFilesForm');
ToBeDocFilesForm = Ext.extend(Ext.Window,{
		searchPanel : null,
		gridPanel : null,
		constructor : function(_cfg) {
			Ext.applyIf(this, _cfg);
			this.initUIComponents();
			ToBeDocFilesForm.superclass.constructor.call(this, {
				id : 'ToBeDocFilesForm',
				layout : 'form',
				items : [ this.searchPanel, this.gridPanel ],
				modal : true,
				height : 500,
				title : '待归档文件选择',
				width : 900,
				autoHeight : true,
				maximizable : true,
				buttonAlign : 'center',
				buttons : this.buttons
			});
	    },// end of constructor
		initUIComponents : function() {
			var docDirectoryId=this.id;
			var isSendDir=this.isSendDir;
			var depId=this.depId;
			var dirYear=this.dirYear;
			var url=__ctxPath + '/system/listDocFiles.do?Q_fileStatus_SN_EQ=0'
				  //+'&Q_fileType_N_EQ='+isSendDir
			      //+'&Q_department.depId_L_EQ='+depId
		          //+'&Q_department.parentId_L_EQ='+depId
			      +'&Q_fileYear_S_EQ='+dirYear;
			if(depId==curUserInfo.parentDepId){
				url+='&Q_department.parentId_L_EQ='+depId;
			}else{
				url+='&Q_department.depId_L_EQ='+depId;
			}
			// 初始化搜索条件Panel
			this.searchPanel = new HT.SearchPanel({
				layout : 'form',
				region : 'north',
				frame : true,
				id : 'ToBeDocFilesForm_searchPanel',
				items : [ {
					layout : 'column',
					items : [{
								columnWidth : 0.33,
								layout : 'form',
								items : [{
										fieldLabel : '标题',
										xtype : 'textfield',
										id : 'ToBeDocFilesForm.fileName',
										name : 'Q_fileName_S_LK',
										width : 100
										},{
										fieldLabel : '文号',
										xtype : 'textfield',
										id : 'ToBeDocFilesForm.fileNo',
										name : 'Q_fileNo_S_LK',
										width : 100
										}]
							 },{
								columnWidth : 0.33,
								layout : 'form',
								items : [{
										fieldLabel : '开始日期',
										xtype : 'datefield',
										format : 'Y-m-d',
										id : 'ToBeDocFilesForm.startDate',
										name : 'Q_fileDate_D_GE',
										width : 100
										}  ,{
											fieldLabel : '截止日期',
											xtype : 'datefield',
											format : 'Y-m-d',
											id : 'ToBeDocFilesForm.endDate',
											name : 'Q_fileDate_D_LE',
											width : 100
											}]
							 },{
								columnWidth : 0.33,
								layout : 'form',
								items : [ {
									fieldLabel : '责任人',
									xtype : 'textfield',
									id : 'ToBeDocFilesForm.dutyPerson',
									name : 'Q_dutyPerson_S_LK',
									width : 100
								} ]
							} ]
				}],
						buttons : [{
									text : '查询',
									scope : this,
									iconCls : 'btn-search',
									handler : function(node) {
											var searchPanel = Ext
															.getCmp('ToBeDocFilesForm_searchPanel');
											var gridPanel = Ext
															.getCmp('ToBeDocFilesFormGrid');
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
											Ext.getCmp('ToBeDocFilesForm_searchPanel')
															.getForm().reset();
												}
								} ]
			});// end of searchPanel
						
				var topbar = new Ext.Toolbar({
						items : [{
								   iconCls : 'btn-add',
								   text : '导入目录',
								   xtype : 'button',
								   scope : this,
								   handler : function() {
									   var grid = Ext.getCmp("ToBeDocFilesFormGrid");
										var selectRecords = grid.getSelectionModel()
															.getSelections();
										if (selectRecords.length == 0) {
												Ext.ux.Toast.msg("信息",
																"请选择要导入的文件！");
														return;
											}
										var ids = Array();
										for ( var i = 0; i < selectRecords.length; i++) {
												ids.push(selectRecords[i].data.id);
											}
										Ext.Ajax.request({
												url : __ctxPath+'/system/updateDirectoryDocFiles.do',
												params : {
														'docFilesIds' : ids,
														'docDirectoryId' : docDirectoryId
														},
												method : 'post',
												success : function(response, options) {
															Ext.ux.Toast.msg('操作信息', '导入成功！');
															Ext.getCmp('DocDirectoryDetailPanel').load({
																url : __ctxPath
																	+ '/pages/doc/DocDirectoryDetail.jsp?directoryId='+docDirectoryId,
																nocache : true
															});
															Ext.getCmp('DocDirectoryDetailGrid').getStore().reload();
															Ext.getCmp('ToBeDocFilesForm').close();
														}
													});
									}
								}]
				});

						var store = new Ext.data.JsonStore({
							url : url,
							root : 'result',
							totalProperty : 'totalCounts',
							fields : [ 'id', 'fileName', 'fileNo',
									'department.depName', 'pageCount',
									'fileType', 'dutyPerson',
									'secretLevel', 'fileDate', 'fileYear',
									'retentionYear', 'retention', 'remark',
									'createUser', 'createDate', 'updateUser',
									'updateDate' ,'archives','sourceType']
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
												width : 60
											},
											{
												header : "文件类型",
												dataIndex : 'fileType',
												width : 60,
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
												header : "保存期限",
												dataIndex : 'retentionYear',
												width : 60,
												renderer : function(value) {
													if (value == '10') {
														return "<span>10年</span>";
													} else if (value == '30') {
														return "<span>30年</span>";
													} else if(value == '1'){
														return "<span>待分类</span>";
													} else{
														return "<span>永久</span>";
													}
												}
											},
											{
												header : "标题",
												dataIndex : 'fileName',
												width : 300,
												renderer:function(value, metadata, record, rowIndex,
														colIndex){
													var docFilesId=record.data.id;
													var str = '';
													str+='<a href="#"  onclick="ToBeDocFilesForm.detail('
														+ docFilesId+')">'+value+'</a>';
													return str;
											}
											}, {
												header : '管理',
												width : 50,
												sortable : false,
												renderer : function(value,metadata, record,rowIndex, colIndex) {
													var str="";
													var fileType=record.data.fileType;
													var sourceType=record.data.sourceType;
													var archives=record.data.archives;
													if(sourceType!=null&&sourceType!=1&&archives!=null){
														var archivesId=record.data.archives.archivesId;
														var defId=record.data.archives.processRun.proDefinition.defId;
														var runId=record.data.archives.processRun.runId;
														str = '&nbsp;<button title="原件" value=" " class="btn-search" onclick="ToBeDocFilesForm.archiveDetail('
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
							id : 'ToBeDocFilesFormGrid',
							height : 500,
							width : '100%',
							title : '档案列表',
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
ToBeDocFilesForm.detail= function(docFilesId) {
	new DocFilesDetailForm({
		freshId:'ToBeDocFilesFormGrid',
		id:docFilesId
	}).show();
};
ToBeDocFilesForm.archiveDetail= function(archivesId,fileType,defId,runId) {
	new JwArchivesDetail({
		archivesId:archivesId,
		fileType:fileType,
		defId:defId,
		runId:runId
	}).show();
};