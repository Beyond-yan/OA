Ext.ns('DepWorkPlanView');
/**
 * 工作计划列表
 */
var DepWorkPlanView = function() {
	return new Ext.Panel({
		id : 'DepWorkPlanView',
		iconCls:'menu-depplan',
		title : '部门计划',
		autoScroll : true,
		items : [new Ext.FormPanel({
			id : 'DepWorkPlanSearchForm',
			height : 40,
			frame : false,
			border : false,
			layout : 'hbox',
			layoutConfig : {
				padding : '5',
				align : 'middle'
			},
			defaults : {
				xtype : 'label',
				margins : {
					top : 0,
					right : 4,
					bottom : 4,
					left : 4
				}
			},
			items : [{
						text : '计划名称:'
					}, {
						xtype : 'textfield',
						name : 'workPlan.planName'
					}, {
						text : '计划类型:'
					}, {
						xtype : 'textfield',
						hiddenName : 'workPlan.planType.typeId',
						xtype : 'combo',
						editable : false,
						triggerAction : 'all',
						displayField : 'name',
						width:80,
						valueField : 'id',
						mode : 'local',
						store : new Ext.data.SimpleStore({
									autoLoad : true,
									url : __ctxPath
											+ '/task/comboPlanType.do',
									fields : ['id', 'name']
								})
					},
					{
						text : '负责人:'
					}, {
						xtype : 'textfield',
						name : 'workPlan.principal'
					},{
						xtype : 'button',
						text : '查询',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext.getCmp('DepWorkPlanSearchForm');
							var gridPanel = Ext.getCmp('DepWorkPlanGrid');
							if (searchPanel.getForm().isValid()) {
								$search({
									searchPanel :searchPanel,
									gridPanel : gridPanel
								});
							}

						}
					},{
					 xtype:'button',
					 text:'重置',
					 iconCls:'btn-reset',
					 handler:function(){
					   var searchPanel = Ext.getCmp('DepWorkPlanSearchForm');
					   searchPanel.getForm().reset();
					 }
					}]
		}), this.setup()]
	});
};
/**
 * 建立视图
 */
DepWorkPlanView.prototype.setup = function() {
	return this.grid();
};
/**
 * 建立DataGrid
 */
DepWorkPlanView.prototype.grid = function() {
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer(), {
					header : 'planId',
					dataIndex : 'planId',
					hidden : true
				}, {
					header : '标识',
					dataIndex : 'icon',
					renderer:function(value){
					   return '<div class="'+value+'"></div>';
					}
				}, {
					header : '计划名称',
					dataIndex : 'planName'
				}, {
					header : '开始日期',
					dataIndex : 'startTime'
				}, {
					header : '结束日期',
					dataIndex : 'endTime'
				}, {
					header : '计划类型',
					dataIndex : 'typeName'
				}, {
					header : '创建人',
					dataIndex : 'userName'
				}, {
					header : '发布范围',
					dataIndex : 'issueScope'
				}, {
					header : '负责人',
					dataIndex : 'principal'
				},{
				   header:'是否生效',
				   dataIndex:'startTime',
				   renderer:function(value, metadata, record, rowIndex,
								colIndex){
					 var startTime=new Date(getDateFromFormat(value, "yyyy-MM-dd H:mm:ss"));				
				     var endTime=new Date(getDateFromFormat(record.data.endTime, "yyyy-MM-dd H:mm:ss"));
				      var today=new Date();
				       if(startTime>today){
				        return '<a style="color:blue;">未生效</a>';
				      }else if(startTime<=today&&endTime>=today){
				        return '<a style="color:green;">已生效</a>'; 
				      }else if(endTime<today){
				       return '<a style="color:red;">已失效</a>';
				      }
				   }
				},
				{
						header : '管理',
						dataIndex : 'planId',
						sortable:false,
						width : 60,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
						
							var str='';
							var planId = record.data.planId;
							var planName = record.data.planName
						
							str += '<button title="删除" value=" " class="btn-showDetail" onclick="DepWorkPlanView.detail('
											+ planId + ',\''+planName+'\')"></button>';
								
							
							return str;
						}
				}],
		defaults : {
			sortable : true,
			menuDisabled : false,
			width : 100
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
				id : 'DepWorkPlanGrid',
//				tbar : this.topbar(),
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
							DepWorkPlanView.detail(rec.data.planId,rec.data.planName);
						});
			});
	return grid;

};

/**
 * 初始化数据
 */
DepWorkPlanView.prototype.store = function() {
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/task/departmentWorkPlan.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'planId',
										type : 'int'
									}

									, 'planName', 'planContent', 'startTime',
									'endTime', {
									  name:'typeName',
									  mapping:'planType.typeName'
									}, {
									  name:'userName',
									  mapping:'appUser.fullname'
									},
									'issueScope', 'participants', 'principal',
									'note', 'status', 'isPersonal', 'icon']
						}),
				remoteSort : true
			});
	store.setDefaultSort('planId', 'desc');
	return store;
};

DepWorkPlanView.detail = function(id,name) {
	new WorkPlanDetail(id,name);
}