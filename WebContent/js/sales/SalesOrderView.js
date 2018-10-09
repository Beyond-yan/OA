/**
 * @author:
 * @class SalesOrderView
 * @extends Ext.Panel
 * @description [SalesOrder]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SalesOrderView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SalesOrderView.superclass.constructor.call(this, {
							id : 'SalesOrderView',
							title : '[SalesOrder]管理',
							region : 'center',
							layout : 'border',
							items : [this.searchPanel, this.gridPanel]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				// 初始化搜索条件Panel
				this.searchPanel=new HT.SearchPanel({
							layout : 'form',
							region : 'north',
							colNums:3,
							items:[
																					 																																					 								{
									fieldLabel:'userid',
									name : 'Q_userid_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'orderno',
									name : 'Q_orderno_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'createtime',
									name : 'Q_createtime_D_EQ',
									flex:1,
																		xtype:'datefield',
									format:'Y-m-d'
																	}
																,
															 							 																																					 								{
									fieldLabel:'total',
									name : 'Q_total_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
															 							 							 															],
								buttons:[
									{
										text:'查询',
										scope:this,
										iconCls:'btn-search',
										handler:this.search
									},{
										text:'重置',
										scope:this,
										iconCls:'btn-reset',
										handler:this.reset
									}							
								]	
				});// end of searchPanel

				this.topbar = new Ext.Toolbar({
						items : [{
									iconCls : 'btn-add',
									text : '添加[SalesOrder]',
									xtype : 'button',
									scope : this,
									handler : this.createRs
								}, {
									iconCls : 'btn-del',
									text : '删除[SalesOrder]',
									xtype : 'button',
									scope:this,
									handler : this.removeSelRs
								}]
				});
	
				this.gridPanel=new HT.GridPanel({
					region:'center',
					tbar:this.topbar,
					//使用RowActions
					rowActions:true,
					id:'SalesOrderGrid',
					url : __ctxPath + "/sales/listSalesOrder.do",
					fields : [{
									name : 'orderid',
									type : 'int'
								}
																																																	,'userid'
																																										,'orderno'
																																										,'createtime'
																																										,'total'
																																			],
					columns:[
								{
									header : 'orderid',
									dataIndex : 'orderid',
									hidden : true
								}
																																																								,{
																	header : 'userid',
																	dataIndex : 'userid'
								}
																																																,{
																	header : 'orderno',
																	dataIndex : 'orderno'
								}
																																																,{
																	header : 'createtime',
																	dataIndex : 'createtime'
								}
																																																,{
																	header : 'total',
																	dataIndex : 'total'
								}
																																								, new Ext.ux.grid.RowActions({
									header:'管理',
									width:100,
									actions:[{
											 iconCls:'btn-del',qtip:'删除',style:'margin:0 3px 0 3px'
										},{
											 iconCls:'btn-edit',qtip:'编辑',style:'margin:0 3px 0 3px'
										}
									],
									listeners:{
										scope:this,
										'action':this.onRowAction
									}
								})
					]//end of columns
				});
				
				this.gridPanel.addListener('rowdblclick',this.rowClick);
					
			},// end of the initComponents()
			//重置查询表单
			reset : function(){
				this.searchPanel.getForm().reset();
			},
			//按条件搜索
			search : function() {
				$search({
					searchPanel:this.searchPanel,
					gridPanel:this.gridPanel
				});
			},
			//GridPanel行点击处理事件
			rowClick:function(grid,rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
					new SalesOrderForm({orderid:rec.data.orderid}).show();
				});
			},
			//创建记录
			createRs : function() {
				new SalesOrderForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/sales/multiDelSalesOrder.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
					url:__ctxPath + '/sales/multiDelSalesOrder.do',
					grid:this.gridPanel,
					idName:'orderid'
				});
			},
			//编辑Rs
			editRs : function(record) {
				new SalesOrderForm({
					orderid : record.data.orderid
				}).show();
			},
			//行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this,record.data.orderid);
						break;
					case 'btn-edit' :
						this.editRs.call(this,record);
						break;
					default :
						break;
				}
			}
});
