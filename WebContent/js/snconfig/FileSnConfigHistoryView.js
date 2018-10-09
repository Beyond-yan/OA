/**
 * @author:
 * @class FileSnConfigHistoryView
 * @extends Ext.Panel
 * @description [FileSnConfigHistory]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
FileSnConfigHistoryView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				FileSnConfigHistoryView.superclass.constructor.call(this, {
							id : 'FileSnConfigHistoryView',
							title : '[FileSnConfigHistory]管理',
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
									fieldLabel:'snId',
									name : 'Q_snId_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'snNumber',
									name : 'Q_snNumber_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'snFormat',
									name : 'Q_snFormat_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'snType',
									name : 'Q_snType_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'expirationDate',
									name : 'Q_expirationDate_D_EQ',
									flex:1,
																		xtype:'datefield',
									format:'Y-m-d'
																	}
																,
															 							 																																					 								{
									fieldLabel:'updateUser',
									name : 'Q_updateUser_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'updateDate',
									name : 'Q_updateDate_D_EQ',
									flex:1,
																		xtype:'datefield',
									format:'Y-m-d'
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
									text : '添加[FileSnConfigHistory]',
									xtype : 'button',
									scope : this,
									handler : this.createRs
								}, {
									iconCls : 'btn-del',
									text : '删除[FileSnConfigHistory]',
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
					id:'FileSnConfigHistoryGrid',
					url : __ctxPath + "/snconfig/listFileSnConfigHistory.do",
					fields : [{
									name : 'id',
									type : 'int'
								}
																																																	,'snId'
																																										,'snNumber'
																																										,'snFormat'
																																										,'snType'
																																										,'expirationDate'
																																										,'updateUser'
																																										,'updateDate'
																																			],
					columns:[
								{
									header : 'id',
									dataIndex : 'id',
									hidden : true
								}
																																																								,{
																	header : 'snId',
																	dataIndex : 'snId'
								}
																																																,{
																	header : 'snNumber',
																	dataIndex : 'snNumber'
								}
																																																,{
																	header : 'snFormat',
																	dataIndex : 'snFormat'
								}
																																																,{
																	header : 'snType',
																	dataIndex : 'snType'
								}
																																																,{
																	header : 'expirationDate',
																	dataIndex : 'expirationDate'
								}
																																																,{
																	header : 'updateUser',
																	dataIndex : 'updateUser'
								}
																																																,{
																	header : 'updateDate',
																	dataIndex : 'updateDate'
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
					new FileSnConfigHistoryForm({id:rec.data.id}).show();
				});
			},
			//创建记录
			createRs : function() {
				new FileSnConfigHistoryForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/snconfig/multiDelFileSnConfigHistory.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
					url:__ctxPath + '/snconfig/multiDelFileSnConfigHistory.do',
					grid:this.gridPanel,
					idName:'id'
				});
			},
			//编辑Rs
			editRs : function(record) {
				new FileSnConfigHistoryForm({
					id : record.data.id
				}).show();
			},
			//行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this,record.data.id);
						break;
					case 'btn-edit' :
						this.editRs.call(this,record);
						break;
					default :
						break;
				}
			}
});
