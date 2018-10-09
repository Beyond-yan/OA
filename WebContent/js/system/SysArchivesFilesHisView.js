/**
 * @author:
 * @class SysArchivesFilesHisView
 * @extends Ext.Panel
 * @description [SysArchivesFilesHis]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SysArchivesFilesHisView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SysArchivesFilesHisView.superclass.constructor.call(this, {
							id : 'SysArchivesFilesHisView',
							title : '[SysArchivesFilesHis]管理',
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
									fieldLabel:'hisId',
									name : 'Q_hisId_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'dataId',
									name : 'Q_dataId_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'fileType',
									name : 'Q_fileType_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'fileVersion',
									name : 'Q_fileVersion_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'fileName',
									name : 'Q_fileName_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'filePath',
									name : 'Q_filePath_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'fileSize',
									name : 'Q_fileSize_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'fileByteSize',
									name : 'Q_fileByteSize_L_EQ',
									flex:1,
																		xtype:'numberfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'fileExtType',
									name : 'Q_fileExtType_S_EQ',
									flex:1,
																		xtype : 'textfield'
																	}
																,
															 							 																																					 								{
									fieldLabel:'fileDate',
									name : 'Q_fileDate_D_EQ',
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
									text : '添加[SysArchivesFilesHis]',
									xtype : 'button',
									scope : this,
									handler : this.createRs
								}, {
									iconCls : 'btn-del',
									text : '删除[SysArchivesFilesHis]',
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
					id:'SysArchivesFilesHisGrid',
					url : __ctxPath + "/system/listSysArchivesFilesHis.do",
					fields : [{
									name : 'id',
									type : 'int'
								}
																																																	,'hisId'
																																										,'dataId'
																																										,'fileType'
																																										,'fileVersion'
																																										,'fileName'
																																										,'filePath'
																																										,'fileSize'
																																										,'fileByteSize'
																																										,'fileExtType'
																																										,'fileDate'
																																			],
					columns:[
								{
									header : 'id',
									dataIndex : 'id',
									hidden : true
								}
																																																								,{
																	header : 'hisId',
																	dataIndex : 'hisId'
								}
																																																,{
																	header : 'dataId',
																	dataIndex : 'dataId'
								}
																																																,{
																	header : 'fileType',
																	dataIndex : 'fileType'
								}
																																																,{
																	header : 'fileVersion',
																	dataIndex : 'fileVersion'
								}
																																																,{
																	header : 'fileName',
																	dataIndex : 'fileName'
								}
																																																,{
																	header : 'filePath',
																	dataIndex : 'filePath'
								}
																																																,{
																	header : 'fileSize',
																	dataIndex : 'fileSize'
								}
																																																,{
																	header : 'fileByteSize',
																	dataIndex : 'fileByteSize'
								}
																																																,{
																	header : 'fileExtType',
																	dataIndex : 'fileExtType'
								}
																																																,{
																	header : 'fileDate',
																	dataIndex : 'fileDate'
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
					new SysArchivesFilesHisForm({id:rec.data.id}).show();
				});
			},
			//创建记录
			createRs : function() {
				new SysArchivesFilesHisForm().show();
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/system/multiDelSysArchivesFilesHis.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
					url:__ctxPath + '/system/multiDelSysArchivesFilesHis.do',
					grid:this.gridPanel,
					idName:'id'
				});
			},
			//编辑Rs
			editRs : function(record) {
				new SysArchivesFilesHisForm({
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
