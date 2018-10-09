Ext.ns('VehicleUsingView');

/**
 * @author:
 * @class CarDistributionView
 * @extends Ext.Panel
 * @description 车辆分配列表
 * @company 广州宏天软件有限公司
 * @createtime:2010-04-12
 */
VehicleUsingView = Ext.extend(Ext.Panel, {
			// 条件搜索Panel
			searchPanel : null,
			// 数据展示Panel
			gridPanel : null,
			// GridPanel的数据Store
			store : null,
			// 头部工具栏
			topbar : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				VehicleUsingView.superclass.constructor.call(this, {
							id : 'VehicleUsingView',
							title : '车辆使用情况',
							iconCls : 'menu-car_apply',
							region : 'center',
							layout : 'border',
							items : [this.searchPanel, this.gridPanel]
						});
			},// end of constructor

			// 初始化组件
			initUIComponents : function() {
				// 初始化搜索条件Panel
				this.searchPanel = new Ext.FormPanel({
							id : 'VehicleUsingAssignForm',
							height : 40,
							region : 'north',
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
										text : '车牌号'
									}, {
										xtype : 'textfield',
										name : 'carNo'
									}, {
										text : '开始时间'
									}, {
										xtype : 'datefield',
										format : 'Y-m-d',
										name : 'startDate'
									},{
										text : '结束时间'
									}, {
										xtype : 'datefield',
										format : 'Y-m-d',
										name : 'endDate'
									}, {
										xtype : 'button',
										text : '查询',
										iconCls : 'search',
										handler : function() {
											var searchPanel = Ext
													.getCmp('VehicleUsingAssignForm');
											var grid = Ext
													.getCmp('VehicleUsingAssignGrid');
											if (searchPanel.getForm().isValid()) {
												$search({
															searchPanel : searchPanel,
															gridPanel : grid
														});
											}

										}
									}, {
										xtype : 'button',
										text : '重置',
										iconCls : 'btn-reset',
										handler : function() {
											var searchPanel = Ext
													.getCmp('VehicleUsingAssignForm');
											searchPanel.getForm().reset();
										}
									},{
										xtype : 'hidden',
										name : 'userId',
										value:curUserInfo.userId
									},{
										xtype : 'hidden',
										name : 'status2',
										value:2
									},{
										xtype : 'hidden',
										name : 'status',
										value:1
									}, {
										xtype : 'hidden',
										name : 'operatorId',
										value:curUserInfo.userId
									}]
						});// end of the searchPanel

				this.store = new Ext.data.Store({
							proxy : new Ext.data.HttpProxy({
										url : __ctxPath
												+ '/admin/uselistCarApply.do'
									}),
							baseParams : {
								start : 0,
								limit : 25,
								userId:curUserInfo.userId,
								status:1,
								status2:2,
								operatorId:curUserInfo.userId
							},
							reader : new Ext.data.JsonReader({
										root : 'result',
										totalProperty : 'totalCounts',
										id : 'id',
										fields : [{
													name : 'applyId',
													type : 'int'
												}, 'userFullname', 'reason','department',
												'toSite', 'startTime','driver',
												'endTime','carNo', 'drivrids', 'status']
									}),
							remoteSort : true
						});
				this.store.setDefaultSort('applyId', 'desc');
				this.store.load();

				var sm = new Ext.grid.CheckboxSelectionModel();
				var cm = new Ext.grid.ColumnModel({
							columns : [sm, new Ext.grid.RowNumberer(), {
										header : 'applyId',
										dataIndex : 'applyId',
										hidden : true
									}, {
										header : '用车时间',
										dataIndex : 'startTime'
									}, {
										header : '结束时间',
										dataIndex : 'endTime'
									}, 	{
						header : '状态',
						dataIndex : 'status',
						renderer : function(value) {
							if (value == '1') {
								return '预订';
							}
							if (value == '2') {
								return '开始';
							}
							if (value == '0') {
								return '已结束';
							}

						}
					}, {
										header : '用车人',
										dataIndex : 'userFullname'
									}, {
										header : '车牌号码',
										dataIndex : 'carNo'
									}, {
										header : '驾驶员',
										dataIndex : 'driver'
									}, {
										header : '用车部门',
										dataIndex : 'department'
									}, {
										header : '到达地点',
										dataIndex : 'toSite'
									}, {
										header : '用车事由',
										dataIndex : 'reason',
										renderer : function(value, metadata, record, rowIndex,
												colIndex) {
											var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="VehicleUsingView.detail('
													+ record.data.applyId
                                                    + ')">'
													+ value
													+ '</a>';
											return str;
										}
									}],
							defaults : {
								sortable : true,
								menuDisabled : false,
								width : 100
							}
						});// end of the cm
				this.gridPanel = new Ext.grid.GridPanel({
							id : 'VehicleUsingAssignGrid',
							tbar : this.topbar,
							region : 'center',
							store : this.store,
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
										store : this.store,
										displayInfo : true,
										displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
										emptyMsg : "当前没有记录"
									})
						});
			}// end of the initUIComponents
		});
VehicleUsingView.detail = function(id) {
	var caragain='edits'
	if(curUserInfo.isCarAdmin||curUserInfo.isAdmin){caragain='using'}
	new CarApplyEditForm({applyId:id,tag:caragain}).show();
}