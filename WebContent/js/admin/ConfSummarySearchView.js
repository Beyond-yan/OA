/**
 * @author: YHZ
 * @class ConfSummarySearchView
 * @extends Ext.Panel
 * @description 会议纪要管理
 * @company 捷达世（深圳）有限公司
 * @createtime:2010-10-11
 */
ConfSummarySearchView = Ext
		.extend(
				Ext.Panel,
				{
					// 条件搜索Panel
					searchPanel : null,
					// 数据展示Panel
					gridPanel : null,
					// GridPanel的数据Store
					store : null,
					// 头部工具栏
				//	topbar : null,
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 初始化组件
						this.initUIComponents();
						// 调用父类构造
						ConfSummarySearchView.superclass.constructor.call(this, {
							id : 'ConfSummarySearchView',
							title : '会议纪要查询',
							iconCls : 'menu-conf-summary',
							region : 'center',
							bodyStyle : 'padding : 5px 5px 5px 5px',
							layout : 'border',
							items : [ this.searchPanel, this.gridPanel ]
						});
					},// end of constructor

					// 初始化组件
					initUIComponents : function() {
						this.searchPanel = new Ext.FormPanel({
						    //id : 'ConfSummary.searchPanel',
							id : 'ConfSummarySearchView.searchPanel',							
							layout : 'form',
							region : 'north',
							width :'98%',
							height : 110,
							frame:true,
							keys : {
								key : Ext.EventObject.ENTER,
								fn : this.search.createCallback(this),
								scope : this
							},
							
								      
							items : [{	layout:'column',
								autoHeight : true,
								items:[{
								layout : 'form',
								columnWidth:0.33,
						
								items : [{
									fieldLabel:'会议议题',
									width : 160,
									name : 'Q_confId.confTopic_S_LK',
									xtype : 'textfield',
									maxLength : 156,
									maxLengthText : '会议议题输入字符不能超过156个长度！'
								}]
								
							},{
								layout : 'form',
								columnWidth:0.33,
						
								items : [{
									fieldLabel:'创建纪要时间范围',
									width : 160,
									xtype : 'datetimefield',
									name : 'Q_createtime_D_GE',
									format : 'Y-m-d'
								}]
							},{
								

								layout : 'form',
								columnWidth:0.3,
						
								items : [{
									fieldLabel:'至',
									width : 160,
									xtype : 'datetimefield',
									name : 'Q_createtime_DG_LE',
									format : 'Y-m-d'
								}]
								
							}]
							},{
								layout : 'hbox',
								region : 'center',
								border : false,
								layoutConfig : {
									padding : '5px',
									align : 'middle'
								},
								defaults : {
									xtype : 'button',
									margins : {
										left : 4,
										top : 0,
										right : 4,
										bottom : 0
									}
								},
								items : [{
									xtype : 'label',
									text : ' ',
									style : 'padding-left:40%;'
								},{
									text : '查询',
									iconCls : 'search',
									handler : this.search.createCallback(this)
								},{
									text : '重置',
									iconCls : 'btn-reset',
									handler : function() {
										Ext.getCmp('ConfSummarySearchView.searchPanel').getForm().reset();
									}
								}]
							}]
						});
						

						// 加载数据至store
						this.store = new Ext.data.JsonStore( {
							url : __ctxPath + "/admin/listConfSummary.do",
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							fields : [ {
								name : 'sumId',
								type : 'int'
							}, 'confId', 'createtime', 'creator', 'sumContent',
									'status' ]
						});
						this.store.setDefaultSort('sumId', 'desc');
						// 加载数据
						this.store.load( {
							params : {
								start : 0,
								limit : 25
							}
						});


						// 初始化ColumnModel
						var sm = new Ext.grid.CheckboxSelectionModel();
						var cm = new Ext.grid.ColumnModel( {
							columns : [
									sm,
									new Ext.grid.RowNumberer(),
									{
										header : 'sumId',
										dataIndex : 'sumId',
										hidden : true
									},
									{
										header : '会议议题',
										dataIndex : 'confId',
										renderer : function(value) {
											return value == null ? '为空'
													: value.confTopic;
										}
									}, {
										header : '创建日期',
										dataIndex : 'createtime'
									}, {
										header : '纪要人',
										dataIndex : 'creator'
									}, {
										header : '纪要内容',
										dataIndex : 'sumContent'
									} ],
							defaults : {
								sortable : true,
								menuDisabled : true,
								width : 100
							}
						});
			/*			// 初始化工具栏
						this.topbar = new Ext.Toolbar( {
							height : 30,
							bodyStyle : 'text-align:left',
							items : [ {
								iconCls : 'btn-del',
								text : '删除',
								xtype : 'button',
								handler : this.delRecords,
								scope : this
							},{
								iconCls : 'btn-edit',
								text : '编辑',
								xtype : 'button',
								handler : this.edit,
								scope : this
							} ]
						});*/

						this.gridPanel = new Ext.grid.GridPanel( {
							id : 'ConfSummaryGrid',
							region : 'center',
							stripeRows : true,
							//tbar : this.topbar,
							store : this.store,
							trackMouseOver : true,
							disableSelection : false,
							loadMask : true,
							autoHeight : true,
							cm : cm,
							sm : sm,
						//plugins : this.rowActions,
							viewConfig : {
								forceFit : true,
								autoFill : true
							},
							bbar : new Ext.PagingToolbar( {
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
						});

						this.gridPanel.addListener('rowdblclick', function(
								grid, rowindex, e) {
							grid.getSelectionModel().each(function(rec) {
								if(rec.data.status==1){
									Ext.MessageBox.show({
										title : '操作提示',
										msg : '对不起，该数据已经发送，不可以编辑，请谅解！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
									return ;
								}
								new ConfSummaryForm( {
									sumId : rec.data.sumId,
									valueTemp:0//用于动态设置附件框的。0表示去掉删除以及上传的控件
								}).show();
							});
						});
						//this.rowActions.on('action', this.onRowAction, this);
					},// end of the initComponents()

					/**
					 * 
					 * @param {}
					 *            self 当前窗体对象
					 */
					search : function(self) {
						if (self.searchPanel.getForm().isValid()) {// 如果合法
							self.searchPanel.getForm().submit(
											{
												waitMsg : '正在提交查询',
												url : __ctxPath + '/admin/searchJoinMeConfSummary.do',
												
												success : function(formPanel,
														action) {
													var result = Ext.util.JSON
															.decode(action.response.responseText);
													self.gridPanel.getStore()
															.loadData(result);
												}
											});
						}
					},

					/**
					 * 添加记录
					 */
					createRecord : function() {
						new ConfSummaryForm().show();
					},
					/**
					 * 按IDS删除记录
					 * 
					 * @param {}
					 *            ids
					 */
					delByIds : function(ids) {
						Ext.Msg.confirm('信息确认','您确认要删除所选记录吗？',
							function(btn) {
								if (btn == 'yes') {
									Ext.Ajax.request( {
										url : __ctxPath + '/admin/multiDelConfSummary.do',
										params : {
											ids : ids
										},
										method : 'POST',
										success : function(response,options) {
											Ext.ux.Toast.msg('操作信息','成功删除该会议纪要信息 ！');
											Ext.getCmp('ConfSummaryGrid').getStore().reload();
										},
										failure : function(response,options) {
											Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
										}
								});
							}
						});// end of comfirm
					},
					/**
					 * 删除多条记录
					 */
					delRecords : function() {
						var gridPanel = Ext.getCmp('ConfSummaryGrid');
						var selectRecords = gridPanel.getSelectionModel()
								.getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for ( var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.sumId);
						}
						this.delByIds(ids);
					},
					
					/**
					 * 编辑
					 */
					edit : function(){
						var gridPanel = Ext.getCmp('ConfSummaryGrid');
						var selectRecords = gridPanel.getSelectionModel()
								.getSelections();
						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要编辑的记录！");
							return;
						}
						if(selectRecords[0].data.status==1){
							Ext.MessageBox.show( {
								title : '操作信息',
								msg : '对不起，该数据已经发送，不可以编辑，请原谅！',
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
							return ;
						}
						new ConfSummaryForm({
							sumId : selectRecords[0].data.sumId
						}).show();
					},
					
					/**
					 * 编辑记录,查看
					 * 
					 * @param {}
					 *            record
					 */
					editRecord : function(record) {
						if(record.data.status==1){
							Ext.MessageBox.show({
								title : '操作提示',
								msg : '对不起，该数据已经发送，不可以编辑，请谅解！',
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
							return ;
						}
						new ConfSummaryForm( {
							sumId : record.data.sumId
						}).show();
					},
					/**
					 * 展示详细信息
					 */
					showDetail : function(sumId) {
						ConfSummaryDetailForm.show(sumId);
					},
					/**
					 * 管理列中的事件处理
					 * 
					 * @param {}
					 *            grid
					 * @param {}
					 *            record
					 * @param {}
					 *            action
					 * @param {}
					 *            row
					 * @param {}
					 *            col
					 */
					onRowAction : function(gridPanel, record, action, row, col) {
						switch (action) {
						case 'btn-del':
							this.delByIds(record.data.sumId);
							break;
						case 'btn-showDetail':
							this.showDetail(record.data.sumId);
							break;
						case 'btn-edit':
							this.editRecord(record);
							break;
						default:
							break;
						}
					}
				});
