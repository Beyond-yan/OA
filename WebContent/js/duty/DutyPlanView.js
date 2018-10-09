/**
 * @author:
 * @class DutyPlanView
 * @extends Ext.Panel
 * @description [CqDutyPlan]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
DutyPlanView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				DutyPlanView.superclass.constructor.call(this, {
							id : 'DutyPlanView',
							title : '值班安排',
							region : 'center',
							iconCls:'menu-signInOff',
							layout : 'form',
							items : [this.searchPanel, this.gridPanel]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				// 初始化搜索条件Panel
				this.searchPanel=new Ext.FormPanel({
					id : 'DutyArrangementSearchForm',
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
								text : '查询条件:'
							}, {
								text : '值班日期:'
							}, {
								xtype : 'datefield',
								format:'Y-m-d',
								width: 120,
								name : 'DA_startTime',
								editable: false
							}, {
								text : '到'
							}, {
								xtype : 'datefield',
								format:'Y-m-d',
								width: 120,
								name : 'DA_endTime',
								editable: false
							}, {
								xtype : 'button',
								text : '查询',
								iconCls : 'search',
								handler : function() {
									var searchPanel = Ext.getCmp('DutyArrangementSearchForm');
									var gridPanel = Ext.getCmp('DutyPlanGrid');
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
							  iconCls:'btn-reseted',
							  handler:function(){
							    var searchPanel = Ext.getCmp('DutyArrangementSearchForm');
								searchPanel.getForm().reset();
							  }
							}]
				});// end of searchPanel
//				this.rowActions = new Ext.ux.grid.RowActions({
//					header : '管理',
//					width : 80,
//					actions : [{
//						iconCls : 'btn-edit',
//						text : '编辑',
//						qtip : '编辑',
//						style : 'margin:2.5px 10px 2.5px 10px'
//					}]
//				});
				this.topbar = new Ext.Toolbar({
						height : 30,
						bodyStyle : 'text-align:left',
						items : [{
									iconCls : 'btn-add',
									text : '新建值班安排',
									xtype : 'button',
									handler : function() {
										new DutyPlanForm().show();
									}
						}]
				});
				var cm = new Ext.grid.ColumnModel({
				columns : [new Ext.grid.RowNumberer(), {
							header : 'id',
							dataIndex : 'id',
							hidden : true
						},{
							header:'planId',
							dataIndex:'planId',
							hidden:true
						},{
							header:'days',
							dataIndex: 'days',
							hidden: true
						},{
							header : '值班日期',
							dataIndex : 'dutyDate',
							renderer:function(value, metadata, record, rowIndex,colIndex){
								var days=record.data.days;
								var str="";
								switch(days){
									case 2:
									str="星期一";
									break;
									case 3:
									str="星期二";
									break;
									case 4:
									str="星期三";
									break;
									case 5:
									str="星期四";
									break;
									case 6:
									str="星期五";
									break;
									case 7:
									str="星期六";
									break;
									default:
									str="星期日";
									}
								return  value+"("+str+")";
							}
						},{
							header : '白天',
							dataIndex : 'amName'
						},{
							header:'晚上',
							dataIndex:'pmName'
						},{
							header : '管理',
							dataIndex : 'planId',
							sortable:false,
							width : 60,
							renderer : function(value, metadata, record, rowIndex,
									colIndex) {
								var str='';
								var planId = record.data.planId;
								if (isGranted('_DutyPlanEdit')){
									str +=  '<a href="#" style="text-decoration:none;color:#3D3D3D" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#3D3D3D\'" onclick="DutyPlanView.edit('
										+record.data.planId+')"><img src="'+__ctxPath +'/images/system/edit.gif" />编辑</a>&nbsp;';
								}
								return str;
							}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
	});

	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : __ctxPath + '/duty/listAllDutyStaff.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 'totalCounts',
							id : 'id',
							fields : [{
										name : 'id',
										type : 'int'
									}, 
 								    'amName','pmName','days',
									'dutyDate',{
												name:'planId',
												mapping:'dutyPlan.id'}]
						}),
				remoteSort : true
	});
	store.load({
				params : {
					start : 0,
					limit : 25
				}
			});
	this.gridPanel = new Ext.grid.GridPanel({
				id : 'DutyPlanGrid',
				tbar : this.topbar,
				store : store,
				trackMouseOver : true,
				disableSelection : false,loadMask : true,
				autoHeight : true,
				cm : cm,
				//plugins : this.rowActions,
				viewConfig : {
					forceFit : true,
					enableRowBody : false,
					showPreview : false
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 14,
							store : store,
							displayInfo : true,
							displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
							emptyMsg : "当前没有记录"
				})
			});
			this.gridPanel.addListener('rowdblclick',this.rowClick);
			//this.rowActions.on('action',this.onRowAction, this);
					
			},// end of the initComponents()
			//GridPanel行点击处理事件
			rowClick:function(grid,rowindex,record, e) {
				var selectgrid=grid.getSelectionModel().getSelections();
				var planId=selectgrid[0].get('planId');
				grid.getStore().each(function(rec) {
					if(rec.get('planId')==planId){
						var i = grid.getStore().indexOf(rec);
						//grid.getView().getCell(i,2).style.backgroundColor ='red';
						//grid.getView().getRow(i).style.backgroundColor ='red';
					}
				});
				new DutyPlanForm({
					planId:planId
				}).show();
			},
			//编辑Rs
			editRs : function(record) {
				new DutyPlanForm({planId:record.data.planId}).show();
			},
			//行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-edit' :
						this.editRs.call(this,record);
						break;
					default :
						break;
				}
			}
});
DutyPlanView.edit = function(planId) {
	new DutyPlanForm({planId: planId}).show();
}
