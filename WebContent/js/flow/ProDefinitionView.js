Ext.ns('ProDefinitionView');
/**
 * 流程列表，可管理
 * 
 * @param isManager
 *            是否可管理
 */
var ProDefinitionView = function(isManager) {
	this.isManager = isManager;
};

ProDefinitionView.prototype.setTypeId = function(typeId) {
	this.typeId = typeId;
	Ext.getCmp("ProDefinitionView.typeId").setValue(typeId);
	ProDefinitionView.typeId = typeId;
	this.gridPanel.getStore().baseParams={
		typeId : typeId
	}
}

ProDefinitionView.prototype.getView = function() {
	var typeId = this.typeId;
	var formPanel = new Ext.FormPanel({
		height : 40,
		frame : false,
		border : false,
		layout : 'hbox',
		layoutConfig : {
			padding : '5',
			pack:'left',
			align : 'middle'
		},
		defaults : {
			margins : '4 4 4 4'
		},
		items : [{
					xtype : 'label',
					text : '请输入查询条件:'
				}, {
					text : '流程的名称',
					xtype:'label'
				}, {
					xtype : 'textfield',
					name : 'Q_name_S_LK',
					width:300
				}, {
					xtype : 'button',
					text : '查询',
					iconCls : 'search',
					scope : this,
					handler : function() {
						var gridPanel = this.gridPanel;
						if (formPanel.getForm().isValid()) {
							$search({
								searchPanel :formPanel,
								gridPanel : gridPanel
							});
						}

					}
				},{
					xtype : 'button',
					text : '重置',
					iconCls : 'btn-reset',
					handler : function() {
						formPanel.getForm().reset();
					}
				},{
					xtype:'hidden',
					name:'typeId',
					id:'ProDefinitionView.typeId'
				}]
	});
	this.gridPanel = this.setup();
	
	return new Ext.Panel({
				title : '流程列表',
				layout:'anchor',
				region : 'center',
				autoScroll : true,
				items : [formPanel, this.gridPanel]
			});
};

/**
 * 建立视图
 */
ProDefinitionView.prototype.setup = function() {
	var isManager = this.isManager;
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer(), {
					header : 'defId',
					dataIndex : 'defId',
					hidden : true
				}, {
					header : '分类名称',
					dataIndex : 'proType',
					renderer : function(value) {
						if (value != null)
							return value.typeName;
					}
				}, {
					header : '流程的名称',
					dataIndex : 'name'
				}, {
					header : '描述',
					dataIndex : 'description'
				},
//				{
//					header:'序号',
//					dataIndex:'sequence'
//				},
//				{
//					header : '创建时间',
//					dataIndex : 'createtime'
//				}, 
				{
					header : '工作流id',
					dataIndex : 'deployId',
					hidden : 'true'
				}, {
					header : '管理',
					dataIndex : 'defId',
					renderer : function(value, metadata, record, rowIndex,
							colIndex) {
						var defId = record.data.defId;
						var name = record.data.name;
						var deployId = record.data.deployId;
						var str = '';
						if (isManager) {
							if (isGranted('_FlowDel')) {
								str = '<button title="删除" value=" " class="btn-del" onclick="ProDefinitionView.remove('
										+ defId + ')"></button>';
							}
							if (isGranted('_FlowEdit')) {
								str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="ProDefinitionView.edit('
										+ defId + ')"></button>';
							}
						}
						str += '&nbsp;<a  href="#"    onclick="ProDefinitionView.newFlow('
							+ '' + defId + ',\'' + name + '\')">启动</a>';
						if (deployId != null) {
							str += '&nbsp;<a href="#"  onclick="ProDefinitionView.view('
									+ defId + ',\'' + name + '\')">查看</a>';
							if (isManager) {
								if (isGranted('_FlowSetting')) {
									str += '&nbsp;<button title="流程设置" class="btn-setting" onclick="ProDefinitionView.setting('
											+ ''
											+ defId
											+ ',\''
											+ name
											+ '\')"></button>';
								}
							}
						}
						
						return str;
					}
				}],
		defaults : {
			sortable : true,
			menuDisabled : false
		}
	});

	var tbar = isManager ? this.topbar() : null;
	var store = this.store();
	store.load({
				params : {
					start : 0,
					limit : 25
				}
			});
	var grid = new Ext.grid.GridPanel({
				layout:'fit',
				id : 'ProDefinitionGrid' + (isManager ? '' : '0'),
				tbar : tbar,
				store : store,
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
			});

	grid.addListener('rowdblclick', function(grid, rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
							if (isManager) {
								if (isGranted('_FlowEdit')) {
									ProDefinitionView.edit(rec.data.defId);
								}
							}
						});
			});
	
	
	//加载公用js
//	if(!ArchivesUtilJsLoaded){
//		$ImportSimpleJs([__ctxPath + '/js/archive/ArchivesUtil.js',
//		                 __ctxPath + '/js/archive/ArchivesDocForm.js',
//		         		__ctxPath + '/js/archive/ArchivesDocForm.js',
//		         		__ctxPath + '/js/archive/ArchivesDocHistoryWin.js',
//		         		__ctxPath + '/js/archive/ArchiveTypeTempView.js',
//		         		__ctxPath + '/js/archive/ArchTemplateView.js',
//		         		__ctxPath + '/js/archive/ArchTemplateForm.js',
//		         		__ctxPath + '/js/archive/OfficeTemplateView.js',
//		         		__ctxPath + '/js/archive/ArchTemplateSelector.js'],function(){
//			ArchivesUtilJsLoaded = true;
//		});
//	}
	
	return grid;

};

/**
 * 初始化数据
 */
ProDefinitionView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/flow/listProDefinition.do',
							params : {
								typeId : this.typeId == null ? 0 : this.typeId
							}
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'defId',
										type : 'int'
									}, 'proType', 'name', 'description',
									'createtime', 'deployId','sequence']
						}),
				remoteSort : true
			});
//	store.setDefaultSort('defId', 'desc');
	return store;
};

/**
 * 建立操作的Toolbar
 */
ProDefinitionView.prototype.topbar = function() {

	var toolbar = new Ext.Toolbar({
				height : 30,
				//bodyStyle : 'text-align:left',
				items : []
			});

	toolbar.add(new Ext.Button({
				iconCls : 'btn-flow-design',
				text : '设计新流程',
				handler : function() {
					new FlowDesignerWindow().show();
				}
			}));

	if (isGranted('_FlowAdd')) {
		toolbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '发布流程',
					handler : function() {

						new ProDefinitionForm(null, ProDefinitionView.typeId);
					}
				}));
	}
	if (isGranted('_FlowDel')) {
		toolbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除流程',
					handler : function() {

						var grid = Ext.getCmp("ProDefinitionGrid");
						var selectRecords = grid.getSelectionModel()
								.getSelections();

						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.defId);
						}

						ProDefinitionView.remove(ids);
					}
				}));
	}
	return toolbar;
};

/**
 * 删除单个记录
 */
ProDefinitionView.remove = function(id) {
	var grid = Ext.getCmp("ProDefinitionGrid");
	Ext.Msg.confirm('信息确认', '注意：删除该流程定义，该流程下的所有相关数据也一并删除，\n并不能恢复，您确认要删除该记录吗？',
			function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath
										+ '/flow/multiDelProDefinition.do',
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
 * 
 */
ProDefinitionView.edit = function(id) {
	new ProDefinitionForm(id);
};
/**
 * 流程信息查看
 * 
 * @param {}
 *            id
 * @param {}
 *            name
 * @param {}
 *            deployId
 */
ProDefinitionView.view = function(defId, name) {
	var contentPanel = App.getContentPanel();
	var detail = contentPanel.getItem('ProDefinitionDetail' + defId);

	if (detail == null) {
		detail = new ProDefinitionDetail(defId, name);
		contentPanel.add(detail);
	}
	contentPanel.activate(detail);
};
/**
 * 流程人员设置
 * 
 * @param {}
 *            id
 */
ProDefinitionView.setting = function(defId, name) {
	var contentPanel = App.getContentPanel();
	var settingView = contentPanel.getItem('ProDefinitionSetting' + defId);
	if (settingView == null) {
		settingView = new ProDefinitionSetting(defId, name);
		contentPanel.add(settingView);
	}
	contentPanel.activate(settingView);
};

/**
 * 新建流程
 * 
 * @param {}
 *            defId
 * @param {}
 *            name
 */
ProDefinitionView.newFlow = function(defId, name) {
	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);

	if (startForm == null) {
		startForm = new ProcessRunStart({
					id : 'ProcessRunStart' + defId,
					defId : defId,
					flowName : name
				});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
};
