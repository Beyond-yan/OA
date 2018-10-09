Ext.ns('ArchivesRecRecordView');
/**
 * 收文登记
 * @author Ropen
 * @date 2013.10.11
 */
var ArchivesRecRecordView = function() {
	return this.getView();
};

ArchivesRecRecordView.prototype.getView = function() {
	var formPanel = new Ext.FormPanel({
		height : 40,
		frame : false,
		id : 'ArchivesRecRecordSearchForm',
		border : false,
		layout : 'hbox',
		layoutConfig : {
			padding : '5',
			align : 'middle'
		},
		defaults : {
			margins : '4 4 4 4'
		},
		items : [{
					xtype : 'label',
					text : '请输入查询条件:'
				}, {
					text : '公文的名称',
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
					xtype:'button',
					text:'重置',
					iconCls:'btn-reseted',
					handler:function(){
					var searchPanel = Ext.getCmp('ArchivesRecRecordSearchForm');
						searchPanel.getForm().reset();
					}
				}]
	});
	this.gridPanel = this.setup();
	
	return new Ext.Panel({
				title : '收文登记',
				layout:'anchor',
				id : 'ArchivesRecRecordView',
				region : 'center',
				iconCls :'menu-arch-reg',
				autoScroll : true,
				items : [formPanel, this.gridPanel]
			});
};

/**
 * 建立视图
 */
ArchivesRecRecordView.prototype.setup = function() {
	var record_start = 0;
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer({
					  header : "序号",
					  width : 35,
					  renderer:function(value,metadata,record,rowIndex){
					   return record_start + 1 + rowIndex;
					  }
				}), {
					header : 'defId',
					dataIndex : 'defId',
					hidden : true
				},{
					header : '公文名称',
					dataIndex : 'name'
				}, {
					header : '公文描述',
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
						str += '&nbsp;<a  href="#"    onclick="ArchivesRecRecordView.newFlow('
							+ '' + defId + ',\'' + name + '\')">启动</a>';
						if (deployId != null) {
							str += '&nbsp;<a href="#"  onclick="ArchivesRecRecordView.view('
									+ defId + ',\'' + name + '\')">查看</a>';
						}
						return str;
					}
				}],
		defaults : {
			sortable : true,
			menuDisabled : false
		}
	});

	var store = this.store();
	store.load({
				params : {
					start : 0,
					limit : 25
				}
			});
	var grid = new Ext.grid.GridPanel({
				layout:'fit',
				id : 'ArchivesRecRecordGrid',
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

	return grid;

};

/**
 * 初始化数据
 */
ArchivesRecRecordView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/flow/listProDefinition.do?typeId=1205687'
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
 * 流程信息查看
 * 
 * @param {}
 *            id
 * @param {}
 *            name
 * @param {}
 *            deployId
 */
ArchivesRecRecordView.view = function(defId, name) {
	var contentPanel = App.getContentPanel();
	var detail = contentPanel.getItem('ProDefinitionDetail' + defId);

	if (detail == null) {
		detail = new ProDefinitionDetail(defId, name);
		contentPanel.add(detail);
	}
	contentPanel.activate(detail);
};

/**
 * 新建流程
 * 
 * @param {}
 *            defId
 * @param {}
 *            name
 */
ArchivesRecRecordView.newFlow = function(defId, name) {

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
