Ext.ns('BoardrooView');
/**
 * @author:
 * @class BoardrooView
 * @extends Ext.Panel
 * @description [Boardroo]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
BoardrooView = Ext.extend(Ext.Panel, {	
	//---CXT
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
				BoardrooView.superclass.constructor.call(this, {
							id : 'BoardrooView',
							title : '会议室管理',
							region : 'center',
							layout : 'border',
							items : [this.searchPanel, this.gridPanel]
						});			
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				
			var boardRooStore=	new Ext.data.SimpleStore({
				url : __ctxPath + '/admin/getBoardrooConference.do?', 
				//method:'post',
				autoLoad : true,
				fields : ['roomId', 'roomName'],													
				listeners:{
									scope:this,
									load:function(){
										var cmp=Ext.getCmp('BoardrooView.roomId');
										if(cmp.hiddenField.value)
										cmp.setValue(cmp.hiddenField.value);
									}
								}																	
			});
			boardRooStore.load();
				
				// 初始化搜索条件Panel
			//	this.searchPanel=new Ext.FormPanel( {
				var dataStatus = [['1', '有'], ['0', '无'],['','全部']];	
				this.searchPanel=new  HT.SearchPanel({
					id : 'BoardrooSearchForm',		
					layout : 'form',
							region : 'north',
							width : '100%',
							height : 300,
							frame : true,
							keys : {
								key : Ext.EventObject.ENTER,
								fn : this.search.createCallback(this),
								scope : this
							},							
							items : [ {								
								layout : 'column',								
								autoHeight : true,
								items : [ {
									columnWidth : 0.5,
									layout : 'form',
									items : [ {											   
												xtype : 'combo',												
												hiddenName:'Q_roomId_L_EQ',
												width:160,
												fieldLabel : '会议室名称',
												valueField : 'roomId',
												id:'BoardrooView.roomId',
												displayField : 'roomName',
												mode : 'local',
												editable : false,
												emptyText : '--请选择会议室--',
												triggerAction : 'all',
												store:boardRooStore,
												listeners:{
													load : function() {
														var cmp = Ext
																.getCmp('BoardrooView.roomId');
														if(cmp.hiddenField.value =='--请选择会议室--') cmp.setValue('');
														if (cmp.hiddenField.value && cmp.hiddenField.value !='--请选择会议室--')
															cmp.setValue(cmp.hiddenField.value);
														
													}
												  }
												}												
											},{
												xtype : 'textfield',
												name : 'Q_location_S_LK',
												//id:'Q_location_S_LK',
												fieldLabel : '位置',
												width : 160,
												blankText : '请输入位置！',
												maxlength : 50,
												maxLengthText : '您输入的会议室位置信息不能超过25个字！'
											} ]
								},

								{
									columnWidth : 0.5,
									layout : 'form',
									items : [{
												xtype : 'textfield',
												name : 'Q_containnum_SN_GE',												
												fieldLabel : '容纳人数>=',
												width : 160,											
												maxlength : 4,
												maxLengthText : '会议室容量不能超过一千人！'
											}, /*{

												xtype : 'radiogroup',
												width:160,
												id:'Q_projector_SN_EQ',
												fieldLabel : '是否有投影仪',
												items : [ {
													boxLabel : '是',
													name : 'Q_projector_SN_EQ',
													//name:'rb-auto',
													inputValue : 1,
													checked : true
													
												}, {
													boxLabel : '否',
													//name:'rb-auto1',
													name : 'Q_projector_SN_EQ',
													inputValue : 0
													//style:'pandding: 0,0px,3,100px'
												}]
											}*/ {												
												xtype : 'combo',
												hiddenName : 'Q_projector_SN_EQ',
												fieldLabel : '投影仪',
												valueField : 'value1',
												displayField : 'name1',
												mode : 'local',
												width : 160,
												editable : false,
												triggerAction : 'all',
												forceSelection : true,
												store : new Ext.data.SimpleStore({													
													fields : ['value1', 'name1'],
													data : dataStatus
												})
											}]
								}]
							} ],
							buttons:[ {
												text : '查询',
												iconCls : 'btn-search',
												xtype : 'button',
												handler : this.search.createCallback(this),
												style : 'margin:0 0px 0 20px'
											},{
												text : '重置',
												xtype : 'button',
												iconCls : 'btn-reset',
												handler : this.reset,
												style : 'margin:0 3px 0 0px'

											}]
							});
							
				this.store = new Ext.data.Store( {
					proxy : new Ext.data.HttpProxy( {
						url : __ctxPath + '/admin/listBoardroo.do'
						//params:{ 'boardroo.projector':Ext.encode(boardroo.projector)}
					}),
					reader : new Ext.data.JsonReader( {
						root : 'result',
						totalProperty : 'totalCounts',
						id : 'id',
						fields : [ {
							name : 'roomId',
							type : 'int'
						}, 'code','roomname', 'roomdesc', 'containnum','location','projector' ]
					}),
					remoteSort : false
				});			
				this.store.setDefaultSort('containnum', 'ASC');
				this.store.load( {
					params : {
						start : 0,
						limit : 25							
					}
				});

				this.rowActions = new Ext.ux.grid.RowActions( {
					header : '管理',
					width : 80,
					actions : [ {
						iconCls : 'btn-del',
						qtip : '删除',
						style : 'margin:0 3px 0 3px'
					}, {
						iconCls : 'btn-edit',
						qtip : '编辑',
						style : 'margin:0 3px 0 3px'
					} ]
				});
				var sm = new Ext.grid.CheckboxSelectionModel();
				var cm = new Ext.grid.ColumnModel( {
					columns : [ sm, new Ext.grid.RowNumberer(), {
						header : 'roomId',
						dataIndex : 'roomId',
						hidden : true
					}, {
						header : '会议室名称',
						dataIndex : 'roomname'
					},{
						header : '会议室编号',
						dataIndex : 'code'
					}, {
						header : '容纳人数(单位：个)',
						dataIndex : 'containnum'
					},{
						header : '位置',
						dataIndex : 'location'
					},{
						header : '投影仪',
						dataIndex : 'projector',
						renderer: function(value){
						if(value=='1'){
							return  "<span>有</span>";
						}
						else{
							return "<span>无</span>";
						}
					}
					},{
						header : '描述',
						dataIndex : 'roomdesc'
					},  this.rowActions ],
					defaults : {
						sortable : true,
						menuDisabled : true,
						width : 100
					}
				});// end of the cm

				this.topbar = new Ext.Toolbar( {
					id : 'BoardrootopBar',
					height : 30,
					bodyStyle : 'text-align:right',
					menuAlign : 'center',
					items : []
				});
				// 新增
				this.topbar.add(new Ext.Button( {
					iconCls : 'btn-add',
					text : '添加',
					handler : function() {
						new BoardrooForm().show();
					}
				}));
				// 删除
				this.topbar.add(new Ext.Button( {
					iconCls : 'btn-del',
					text : '删除',
					handler : function() {
						var grid = Ext.getCmp("BoardrooGrid");
						var selectRecords = grid.getSelectionModel().getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = new Array();
						for ( var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.roomId);
						}
						BoardrooView.remove(ids);
					}
				}));
				// 编辑
				/*this.topbar.add(new Ext.Button( {
					iconCls : 'btn-edit',
					text : '编辑',
					handler : function() {
						var grid = Ext.getCmp('BoardrooGrid');
						var selectRecords = grid.getSelectionModel().getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg('编辑提示', '请选择要修改的记录！');
							return;
						}
						new BoardrooForm( {
							roomid : selectRecords[0].data.roomId
						}).show();
					}
				}));*/
			
				// end of the topbar

				this.gridPanel = new HT.GridPanel( {
					id : 'BoardrooGrid',
					tbar : this.topbar,
					region : 'center',
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
					plugins : this.rowActions,
					viewConfig : {
						forceFit : true,
						autoFill : true
					}
//					bbar : new Ext.PagingToolbar( {
//						pageSize : 25,
//						store : this.store,
//						displayInfo : true,
//						displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
//						emptyMsg : "当前没有记录"
//					})
				});
				// end of the gridPanel

				this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
						if (isGranted('_BoardrooEdit')) {
							new BoardrooForm( {
								roomId : rec.data.roomId
							}).show();
						}
					});
				});
				this.rowActions.on('action', this.onRowAction, this);
			},// end of the initUIComponents
			
			onRowAction : function(gridPanel, record, action, row, col) {
				switch (action) {
				case 'btn-del':
					this.delByIds(record.data.roomId);
					break;
				case 'btn-edit':
					this.editRecord(record);
					break;
				default:
					break;
				}
			},
			/**
			 * 根据roomId删除数据
			 */
			delByIds : function(roomId) {
				var gd = Ext.getCmp("BoardrooGrid");
				Ext.MessageBox.confirm("操作提示", "您真的要删除这条数据吗？", function(btn) {
					if (btn == "yes") {
						Ext.Ajax.request( {
							url : __ctxPath + '/admin/multiDelBoardroo.do',
							method : 'post',
							params : {
							ids : roomId
							},
							success : function(response, options ) {
								var dbJson = response.responseText;
			                    dbJson = eval("("+ dbJson + ")");
								Ext.ux.Toast.msg("操作提示", dbJson.msg);
								gd.getStore().reload( {
									params : {
										start : 0,
										limit : 25
									}
								});
							},
							failure : function() {
								Ext.ux.Toast.msg('操作提示', '对不起，删除数据操作失败！');
							}
						});
					}
				});
			},
			/**
			 * 根据record编辑数据
			 */
			editRecord : function(record) {
				new BoardrooForm( {
					roomId : record.data.roomId
				}).show();
			},

			/**
			 * 重置
			 */
			reset : function() {
				Ext.getCmp('BoardrooSearchForm').getForm().reset();
			},

			/**
			 * 搜索
			 */
			search : function(self) {
				if (self.searchPanel.getForm().isValid()) {
					self.searchPanel.getForm().submit(
							{
								url : __ctxPath + '/admin/listBoardroo.do',
								method : 'post',
								waitMsg : '数据正在提交，请稍后...',
								success : function(fm, action) {
									var result = Ext.util.JSON
											.decode(action.response.responseText);
									self.gridPanel.getStore().loadData(result);
								},
								failure : function() {
									Ext.ux.Toast.msg('操作提示', '对不起，数据提交失败！');
								}
							});
				}
			}
			
		});

		/**
		 * @description 新增数据操作
		 */
//		BoardrooView.add = function(roomId) {
//			new BoardrooForm(
//					{roomId : record.data.roomId} //cxt20110509
//			).show();
//		};

		/**
		 * @description 删除数据操作
		 * @param roomid
		 *            会议室编号
		 */
		BoardrooView.remove = function(roomId) {
			if (roomId != "") {
				var gd = Ext.getCmp("BoardrooGrid");
				Ext.MessageBox.confirm("操作提示", "您真的要删除这条数据吗？", function(btn) {
					if (btn == "yes") {
						Ext.Ajax.request( {
							url : __ctxPath + '/admin/multiDelBoardroo.do',
							method : 'post',
							params : {
								ids : roomId
							},
							success : function(response, options ) {
								var dbJson = response.responseText;
			                    dbJson = eval("("+ dbJson + ")");
								Ext.ux.Toast.msg("操作提示", dbJson.msg);
								gd.getStore().reload( {
									params : {
										start : 0,
										limit : 25
									}
								});
							},
							failure : function() {
								Ext.ux.Toast.msg('操作提示', '对不起，数据删除失败！');
							}
						});
					}
				});
			} else {
				Ext.ux.Toast.msg("温馨提示", "对不起，请选择要删除的数据！");
			}
		};	