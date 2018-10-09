Ext.ns('DocFilesSearchView');

DocFilesSearchView = Ext.extend(Ext.Panel,{
					
					searchPanel : null,
					// 数据展示Panel
					gridPanel : null,
					
					topbar : null,
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 初始化组件
						this.initUIComponents();
						// 调用父类构造
						DocFilesSearchView.superclass.constructor.call(this, {
							id : 'DocFilesSearchView',
							title : '文件查询',
							iconCls:'menu-appuser',
							autoScroll : true,
							items : [ this.searchPanel, this.gridPanel ]
						});
					},// end of constructor

					// 初始化组件
					initUIComponents : function() {
						// 初始化搜索条件Panel
						this.searchPanel = new HT.SearchPanel({
							id : 'DocFilesSearchViewForm',
							region : 'north',
							layout : 'form',
							width : '98%',
							colNums : 3,
							items : [{
							    	    	fieldLabel : '文件题名：',
							    	    	flex : 1,
							    	    	xtype : 'textfield',
							    	    	id : 'DocFilesSearchViewForm.fileName',
											name : 'Q_fileName_S_LK'
							    	    }, {
							    	    	fieldLabel : '部　       门：',
							    	    	xtype : 'combo',
							    	    	id : 'DocFilesSearchViewForm.depId',
							    	    	hiddenName : 'Q_docDirectory.deptId_L_EQ',
							    	    	valueField : 'depid',
											displayField : 'depname',
											//style:'{width:30%;}',
											flex : 1,
											editable : false,
											typeAhead : true,
											triggerAction : 'all',
											emptyText : '--请选择部门--',
											store : new Ext.data.SimpleStore({
												url : __ctxPath + '/system/comboDep3Department.do', 
												autoLoad : true,
												fields : ['depid', 'depname'],
												listeners:{
													scope : this,
													load : function(){
														var cmp = Ext.getCmp('DocFilesSearchViewForm.depId');
														if(cmp.hiddenField.value) cmp.setValue(cmp.hiddenField.value);
													}
												}
											})
							    	    },{
											fieldLabel : '文　号：',
							    	    	xtype : 'textfield',
							    	    	id : 'DocFilesSearchViewForm.fileNo',
											name : 'Q_fileNo_S_LK',
											flex : 1
							    	    },{
											fieldLabel : '主 题 词：',
											flex : 1,
							    	    	xtype : 'textfield',
							    	    	id : 'DocFilesSearchViewForm.fileSbuject',
											name : 'Q_fileSbuject_S_LK'
							    	    },{
							    	    	fieldLabel : '文　    种：',
							    	    	flex : 1,
							    	    	xtype : 'combo',
							    	    	id : 'DocFilesSearchViewForm.fileType',
							    	    	hiddenName : 'Q_archivesType.typeId_L_EQ',
							    	    	valueField : 'typeId',
											displayField : 'typeName',
											editable : false,
											typeAhead : true,
											triggerAction : 'all',
											emptyText : '--请选择文种--',
											store : new Ext.data.SimpleStore({
												url : __ctxPath + '/archive/comboArchivesType.do', 
												autoLoad : true,
												fields : ['typeId', 'typeName'],
												listeners:{
													scope : this,
													load : function(){
														var cmp = Ext.getCmp('DocFilesSearchViewForm.fileType');
														if(cmp.hiddenField.value) cmp.setValue(cmp.hiddenField.value);
													}
												}
											})
							    	    },
							    	    {
											fieldLabel : '责任者：',
							    	    	flex : 1,
							    	    	xtype : 'textfield',
							    	    	id : 'DocFilesSearchViewForm.dutyPerson',
											name : 'Q_dutyPerson_S_LK'
							    	    },{
											fieldLabel : '年  　 度：',
							    	    	xtype : 'textfield',
							    	    	id : 'DocFilesSearchViewForm.fileYear',
											name : 'Q_fileYear_S_EQ',
											flex : 0.96
							    	    },{
											fieldLabel : '时间范围：',
							    	    	flex : 1,
							    	    	xtype : 'datefield',
											name : 'Q_fileDate_D_GE',
											format : 'Y-m-d',
											flex : 1,
											border : false
							    	    }, {
											fieldLabel : '至',
							    	    	xtype : 'datefield',
											name : 'Q_fileDate_D_LE',
											format : 'Y-m-d',
											flex : 1,
											border : false
							    	    }
						    ],
						    buttons : [
								{
									text : '查询',
									scope:this,
									iconCls : 'btn-search',
									handler :  function() {
										var searchPanel = Ext
										.getCmp('DocFilesSearchViewForm');
								var gridPanel = Ext
										.getCmp('DocFilesSearchGrid');
								if (searchPanel.getForm().isValid()) {
									$search({
										searchPanel : searchPanel,
										gridPanel : gridPanel
									});
								}
							}
								},{
									text : '重置',
									scope:this,
									iconCls : 'btn-reset',
									style : 'margin:0 0 0 10px',
									handler :  function() {
										Ext.getCmp('DocFilesSearchViewForm').getForm().reset();
									}
								}							
							]
						});
						var store = new Ext.data.JsonStore({
							url : __ctxPath + '/system/listDocFiles.do',
							root : 'result',
							totalProperty : 'totalCounts',
							fields : [ 'id', 'fileName', 'fileNo','depName',
									'pageCount', 'archivesType.typeName','docDirectory.deptId',
									'dutyPerson', 'secretLevel', 'fileDate',
									'fileYear', 'retentionYear','retention','remark','createUser','createDate', 'updateUser',
									'updateDate' ]
						});
						
						store.load();

						var sm = new Ext.grid.CheckboxSelectionModel();
						var cm = new Ext.grid.ColumnModel(
								{
									columns : [
											sm,
											new Ext.grid.RowNumberer(),
											{
												header : '文件题名',
												dataIndex : 'fileName'
											},
											{
												header : '部门',
												dataIndex : 'depName'
											},
											{
												header : '文号',
												dataIndex : 'fileNo'
											},
											{
												header : '文种类型',
												dataIndex : 'archivesType.typeName'
											},
											{
												header : "期限",
												dataIndex : 'retentionYear',
												width : 60,
												renderer : function(value) {
													if (value == '10') {
														return "<span>10年</span>";
													} else if(value == '30'){
														return "<span>30年</span>";
													} else {
														return "<span>永久</span>";
													}
												}
											},
											{
												header : '文件日期',
												dataIndex : 'fileDate'
											},
											{
												header : '限制日期',
												dataIndex : 'retention'
											},
											{
												header : '创建日期',
												dataIndex : 'createDate'
											},
											{
												header : '责任者',
												dataIndex : 'dutyPerson'
											},
											{
												header : '年度',
												dataIndex : 'fileYear'
											},
											{
												header : '管理',
												dataIndex : 'id',
												width : 50,
												sortable : false,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {
													var editId = record.data.id;
													var str = '';
													str = '<button title="删除" value=" " class="btn-del" onclick="DocFilesSearchView.remove('
															+ editId
															+ ')">&nbsp;&nbsp;</button>';
													str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="DocFilesSearchView.edit('
														+ editId
														+')">&nbsp;&nbsp;</button>';
													return str;
												}
											} ],
									defaults : {
										sortable : true,
										menuDisabled : false,
										width : 100
									}
								});

						this.topbar = new Ext.Toolbar({
							id : 'LawsFootBar',
							height : 30,
							bodyStyle : 'text-align:left',
							items : []
						});
//						this.topbar.add(new Ext.Button({
//							iconCls : 'btn-add',
//							text : '添加文件',
//							xtype : 'button',
//							handler : function() {
//								new LawsForm().show();
//							}
//						}));
						this.topbar
								.add(new Ext.Button(
										{
											iconCls : 'btn-del',
											text : '删除文件',
											xtype : 'button',
											handler : function() {

												var grid = Ext.getCmp("DocFilesSearchGrid");

												var selectRecords = grid
														.getSelectionModel()
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
												DocFilesSearchView.remove(ids);
											}
										}));

						this.gridPanel = new Ext.grid.GridPanel({
							id : 'DocFilesSearchGrid',
							tbar : this.topbar,
							region : 'center',
							store : store,
							title : '文件列表',
							trackMouseOver : true,
							disableSelection : false,
							loadMask : true,
							autoHeight : true,
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
						});// end of the gridPaenl
//						this.gridPanel.addListener('rowdblclick', function(
//								grid, rowindex, e) {
//							grid.getSelectionModel().each(function(rec) {
//								if (isGranted('_AllScheduleEdit')) {
//									DocFilesSearchView.edit(rec.data.Id);
//								}
//							});
//						});
					}// end of the initUIComponents
				});

/**
 * 删除单个记录
 */
DocFilesSearchView.remove = function(id) {
	var grid = Ext.getCmp("DocFilesSearchGrid");
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
/**
 * 编辑
 */
DocFilesSearchView.edit = function(fileId) {
	new DocFilesForm({
		fileId : fileId,
		gridId : 'DocFilesSearchGrid'
	}).show();
}
