/**
 * @author:
 * @class OrderDetailView
 * @extends Ext.Panel
 * @description [OrderDetail]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
OrderDetailView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				OrderDetailView.superclass.constructor.call(this, {
							id : 'OrderDetailView',
							title : '[OrderDetail]管理',
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
									fieldLabel:'orderid',
									name : 'Q_orderid_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'productno',
									name : 'Q_productno_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'price',
									name : 'Q_price_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																													 								 								{
									fieldLabel:'quantity',
									name : 'Q_quantity_N_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'notes',
									name : 'Q_notes_S_EQ',
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
									text : '添加[OrderDetail]',
									xtype : 'button',
									scope : this,
									handler : this.createRs
								}, {
									iconCls : 'btn-del',
									text : '删除[OrderDetail]',
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
					id:'OrderDetailGrid',
					url : __ctxPath + "/sales/listOrderDetail.do",
					fields : [{
									name : 'detailid',
									type : 'int'
								}
																																																	,'orderid'
																																										,'productno'
																																										,'price'
																																										,'quantity'
																																										,'notes'
																																			],
					columns:[
								{
									header : 'detailid',
									dataIndex : 'detailid',
									hidden : true
								}
																																																								,{
																	header : 'orderid',
																	dataIndex : 'orderid'
								}
																																																,{
																	header : 'productno',
																	dataIndex : 'productno'
								}
																																																,{
																	header : 'price',
																	dataIndex : 'price'
								}
																																																,{
																	header : 'quantity',
																	dataIndex : 'quantity'
								}
																																																,{
																	header : 'notes',
																	dataIndex : 'notes'
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
					new OrderDetailForm({detailid:rec.data.detailid}).show();
				});
			},
			//创建记录
			createRs : function() {
				new OrderDetailForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/sales/multiDelOrderDetail.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
					url:__ctxPath + '/sales/multiDelOrderDetail.do',
					grid:this.gridPanel,
					idName:'detailid'
				});
			},
			//编辑Rs
			editRs : function(record) {
				new OrderDetailForm({
					detailid : record.data.detailid
				}).show();
			},
			//行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this,record.data.detailid);
						break;
					case 'btn-edit' :
						this.editRs.call(this,record);
						break;
					default :
						break;
				}
			}
});
