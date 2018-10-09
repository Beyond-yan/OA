/**
 * @author:
 * @class PersonnelEmployeeView
 * @extends Ext.Panel
 * @description [PersonnelEmployee]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
PersonnelEmployeeView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				PersonnelEmployeeView.superclass.constructor.call(this, {
							id : 'PersonnelEmployeeView',
							title : '[PersonnelEmployee]管理',
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
									fieldLabel:'userId',
									name : 'Q_userId_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'empCode',
									name : 'Q_empCode_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'officePhone',
									name : 'Q_officePhone_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'shortPhone',
									name : 'Q_shortPhone_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'imageSource',
									name : 'Q_imageSource_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'isLeaving',
									name : 'Q_isLeaving_SN_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'beforeSeniority',
									name : 'Q_beforeSeniority_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'leaveDate',
									name : 'Q_leaveDate_D_EQ',
									flex:1,
																		xtype:'datefield',
									format:'Y-m-d'
																	}
																,
															 							 																																					 								{
									fieldLabel:'totalSeniority',
									name : 'Q_totalSeniority_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'remark',
									name : 'Q_remark_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'createDate',
									name : 'Q_createDate_D_EQ',
									flex:1,
																		xtype:'datefield',
									format:'Y-m-d'
																	}
																,
															 							 																																					 								{
									fieldLabel:'createBy',
									name : 'Q_createBy_S_EQ',
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
																,
															 							 																																					 								{
									fieldLabel:'updateBy',
									name : 'Q_updateBy_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'ext',
									name : 'Q_ext_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'room',
									name : 'Q_room_S_EQ',
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
									text : '添加[PersonnelEmployee]',
									xtype : 'button',
									scope : this,
									handler : this.createRs
								}, {
									iconCls : 'btn-del',
									text : '删除[PersonnelEmployee]',
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
					id:'PersonnelEmployeeGrid',
					url : __ctxPath + "/personal/listPersonnelEmployee.do",
					fields : [{
									name : 'id',
									type : 'int'
								}
																																																	,'userId'
																																										,'empCode'
																																										,'officePhone'
																																										,'shortPhone'
																																										,'imageSource'
																																										,'isLeaving'
																																										,'beforeSeniority'
																																										,'leaveDate'
																																										,'totalSeniority'
																																										,'remark'
																																										,'createDate'
																																										,'createBy'
																																										,'updateDate'
																																										,'updateBy'
																																										,'ext'
																																										,'room'
																																			],
					columns:[
								{
									header : 'id',
									dataIndex : 'id',
									hidden : true
								}
																																																								,{
																	header : 'userId',
																	dataIndex : 'userId'
								}
																																																,{
																	header : 'empCode',
																	dataIndex : 'empCode'
								}
																																																,{
																	header : 'officePhone',
																	dataIndex : 'officePhone'
								}
																																																,{
																	header : 'shortPhone',
																	dataIndex : 'shortPhone'
								}
																																																,{
																	header : 'imageSource',
																	dataIndex : 'imageSource'
								}
																																																,{
																	header : 'isLeaving',
																	dataIndex : 'isLeaving'
								}
																																																,{
																	header : 'beforeSeniority',
																	dataIndex : 'beforeSeniority'
								}
																																																,{
																	header : 'leaveDate',
																	dataIndex : 'leaveDate'
								}
																																																,{
																	header : 'totalSeniority',
																	dataIndex : 'totalSeniority'
								}
																																																,{
																	header : 'remark',
																	dataIndex : 'remark'
								}
																																																,{
																	header : 'createDate',
																	dataIndex : 'createDate'
								}
																																																,{
																	header : 'createBy',
																	dataIndex : 'createBy'
								}
																																																,{
																	header : 'updateDate',
																	dataIndex : 'updateDate'
								}
																																																,{
																	header : 'updateBy',
																	dataIndex : 'updateBy'
								}
																																																,{
																	header : 'ext',
																	dataIndex : 'ext'
								}
																																																,{
																	header : 'room',
																	dataIndex : 'room'
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
					new PersonnelEmployeeForm({id:rec.data.id}).show();
				});
			},
			//创建记录
			createRs : function() {
				new PersonnelEmployeeForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/personal/multiDelPersonnelEmployee.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
					url:__ctxPath + '/personal/multiDelPersonnelEmployee.do',
					grid:this.gridPanel,
					idName:'id'
				});
			},
			//编辑Rs
			editRs : function(record) {
				new PersonnelEmployeeForm({
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
