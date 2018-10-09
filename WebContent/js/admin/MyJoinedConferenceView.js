/**
 * @author: YHZ
 * @class MyJoinedConferenceView
 * @extends Ext.Panel
 * @description 我已参加会议查询
 * @company 捷达世深圳软件
 * @createtime:2010-10-11 PM
 */
MyJoinedConferenceView = Ext.extend(Ext.Panel, {
	// 搜索
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
		MyJoinedConferenceView.superclass.constructor.call(this, {
					id : 'MyJoinedConferenceView',
					title : '我发起的会议',
					iconCls : 'menu-conference_myjoined',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		
		var today =  new Date();
		var systemDate = document.getElementById('systemDate').value;
		today = Date.parseDate(systemDate,'Y-m-d h:i:s');
		
		// start of this searchPanel
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			frame : true,
			items : [{
				layout : 'column',
				items : [{
							columnWidth : 0.5,
							layout : 'form',
							items : [{
										fieldLabel : '会议议题',
										xtype : 'textfield',
										name : 'Q_confTopic_S_LK',
										maxLength : 256,
										maxLengthText : '会议议题输入长度不能超过256个字符！',
										width : 160
										
									}, {
										fieldLabel : '会议开始时间',
										xtype : 'datefield',
										name : 'Q_startTime_D_GE',
										format : 'Y-m-d',
										width : 160									
									}]
						}, {
							columnWidth : 0.5,
							layout : 'form',
							items : [{
								xtype : 'combo',								
								hiddenName : 'Q_roomId_L_EQ',
								width : 160,								
								fieldLabel : '会议室名称',
								valueField : 'roomId',
								id : 'myJoined.roomId',
								displayField : 'roomName',
								mode : 'local',
								editable : false,
								emptyText : '--请选择会议室--',
								triggerAction : 'all',
								store : new Ext.data.SimpleStore({
									url : __ctxPath
											+ '/admin/getBoardrooConference.do?',
									// method:'post',
									autoLoad : true,
									fields : ['roomId', 'roomName'],

									listeners : {
										scope : this,
										load : function() {
											var cmp = Ext
													.getCmp('myJoined.roomId');
											if (cmp.hiddenField.value)
												cmp
														.setValue(cmp.hiddenField.value);
										}
									}

								})
							}, {
								fieldLabel : '会议结束时间',
								id : 'endTimeMyJoined',
								xtype : 'datefield',
								name : 'Q_endTime_DG_LE',
								format : 'Y-m-d',
								width : 160
								
							}]
						}]
			},{			
				layout : 'hbox',
				region : 'center',
				border : false,
				layoutConfig : {
					padding : '5px',
					align : 'center'
				},
				defaults : {
					xtype : 'button'
					/*margins : {
						left : 4,
						top : 0,
						right : 4,
						bottom : 0
					}*/
				},
				items : [{
							xtype : 'label',
							style : 'padding-left:40%;',
							text : ' '
						}, {
						iconCls : 'search',
						text : '查询',
						scope : this,
						style : 'width: 30px; margin-right: 55%;',
						handler : this.search.createCallback(this)
					}, {
						iconCls : 'btn-reset',
						//style : 'width: 30px;padding-right: 20%;',
						style : 'width: 30px;padding-right: 0%;',
						text : '重置',
						scope : this,
						handler : this.reset.createCallback(this)
					}]			
			}]
		}); // end of this superSearchPanel
		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/admin/myJoinedConference.do",
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'confId',
								type : 'int'
							}, 'confTopic', 'compereName', 'roomName','contUser',
							'roomLocation', 'attendUsersName', 'checkName',
							'applyStatus', 'startTime', 'endTime', 'status','bookType','isLong']
				});
		this.store.setDefaultSort('startTime', 'desc');
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

/*		this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 120,
					actions : [{
								iconCls : 'btn-del',
								text : '取消',
								qtip : '取消',
								style : 'margin:0 3px 0 3px'
							}, {
								iconCls : 'btn-edit',
								text : '编辑',
								qtip : '编辑',
								style : 'margin:0 3px 0 3px'
							}, {
								iconCls : 'btn-end',
								text : '结束',
								qtip : '结束',
								style : 'margin:0 3px 0 3px'
							}]
				});*/

		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
								header : 'confId',
								dataIndex : 'confId',
								hidden : true
							}, {
								header : '会议议题',
								dataIndex : 'confTopic',
								renderer : function(value, metadata, record, rowIndex,colIndex){
									var confId = record.data.confId;
									var str='';
									var str = '<a href="#" style="text-decoration:none;color:#0358A3" onMouseOver = "this.style.color =\'red\'" onMouseOut = "this.style.color=\'#0358A3\'" onclick="MyJoinedConferenceView.edit('+confId+')">'+value+'</a>';
									return str;
								}
							},{
								header : '开始时间',
								dataIndex : 'startTime'
							}, {
								header : '结束时间',
								dataIndex : 'endTime'
							}, {
								header : '会议室名称',
								dataIndex : 'roomName'
							},{
								header : '申请类型',
								dataIndex : 'bookType',
								renderer:function(value){
								if(value==1)
								return "<font color=\"#800000\">按每周一预定</font>";
								if(value==2)
								return "<font color=\"#800000\">按每周二预定</font>";
								if(value==3)
								return "<font color=\"#800000\">按每周三预定</font>";
								if(value==4)
								return "<font color=\"#800000\">按每周四预定</font>";
								if(value==5)
								return "<font color=\"#800000\">按每周五预定</font>";
								if(value==6)
								return "<font color=\"#800000\">按每周六预定</font>";
								if(value==7)
								return "<font color=\"#800000\">按每周日预定</font>";
								if(value==8)
								return "<font color=\"#800000\">按天数预定</font>";
								else{	
								return "<font color=\"#000000\">非长期预定</font>";									
								}								
							  }
							},{							
								hidden : true,
								dataIndex:'isLong',
								header : 'isLong'							
							},{
								id : 'MyJoinedConferenceView.applyStatus',
								header : '状态',
								name : 'applyStatus',
								dataIndex : 'applyStatus',
								renderer : function(value) {
									if (value == 1)
										return "<span>申请中</span>";
									else if (value == 2)
										return "<span>审核通过</span>";
									else if (value == 3)
										return "<span>退回</span>";
									else if (value == 4)
										return "<span>取消</span>";
									else if (value == -1)
										return "<span>会议已完成</span>";

								}
							}, {
								header : '短信发送',
								width : 40,
								sortable : false,
								renderer : function(value, metadata, record, rowIndex,
									colIndex) {
										var confId = record.data.confId;
										var applyStatus = record.data.applyStatus;
										var startTime = Date.parseDate(record.data.startTime+":00","Y-m-d h:i:s");
										var roomName= record.data.roomName;
										var str = '';
										var depName = record.data.contUser.department.depName;
										var mobileContent = Ext.util.Format.date(startTime,'Y年m月d日  H时i分')+ '，在'+roomName+
										'，由'+ depName+ '，召开关于'+record.data.confTopic+'，请阅示。';
										if (2 == applyStatus) {
											str = '<a href="#" style="text-decoration:none;color:blue " title="发送短信" value=" " onclick="MyJoinedConferenceView.send('
													+ "'" +mobileContent + "'" + "," + confId + ')">发送短信</a>';
			
										}
										return str;
									}
							}, {
								header : '管理',
								width : 120,
								sortable : false,
								renderer : function(value, metadata, record, rowIndex,
									colIndex) {
										var confId = record.data.confId;
										var startTime = record.data.startTime;
										var applyStatus = record.data.applyStatus;
										var endTime = record.data.endTime;
										var str = '';
//										if(startTime > today.format("Y-m-d H:i")){
											str = '<a href="#" style="text-decoration:none;color:#3D3D3D" title="取消" value=" " class="btn-del" onclick="MyJoinedConferenceView.remove('
												+ confId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消</a>';
//										}
//										if(startTime > today.format("Y-m-d H:i") && (1 == applyStatus || 2 == applyStatus) ){
											str += '&nbsp;<a href="#" style="text-decoration:none;color:#3D3D3D" title="编辑" value=" " class="btn-edit" onclick="MyJoinedConferenceView.edit('
												+ confId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编辑</a>';
//										}
										if(today.format("Y-m-d H:i") > startTime && today.format("Y-m-d H:i") < endTime){
											str += '&nbsp;<a href="#" style="text-decoration:none;color:#3D3D3D" title="结束" value=" " class="btn-end" onclick="MyJoinedConferenceView.end('
												+ confId + ')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束</a>';
										}
										return str;
									}
							}/*this.rowActions*/],
					defaults : {
						sortable : true,
						menuDisabled : true,
						width : 100
					}
				});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar({
					height : 30,
					bodyStyle : 'text-align:left',
					items : [{
								iconCls : 'btn-del',
								text : '删除',
								xtype : 'button',
								handler : this.delRecords,
								scope : this
							}]
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'MyJoinedConferenceGrid',
					region : 'center',
					stripeRows : true,
					tbar : this.topbar,
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
//					plugins : this.rowActions,
					viewConfig : {
						forceFit : true,
						autoFill : true
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

		/*this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
						new ConferenceEditForm({
									// 查看数据不可以进行编辑
									statusVal2 : '0',
									confId : rec.data.confId
								}).show();
							// ConferenceDetailForm.show(rec.data.confId);
						});
				});*/
//		this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()

	/**
	 * 搜索
	 */
	search : function(self) {	

		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
						searchPanel : self.searchPanel,
						gridPanel : self.gridPanel
					});
		}
	},

	/**
	 * 清空
	 */
	reset : function(self) {
		self.searchPanel.getForm().reset();
	},

	/**
	 * 添加记录
	 */
	createRecord : function() {
		new ConferenceForm().show();
	},

	/**
	 * 按IDS取消记录
	 */
	delByIds : function(ids) {
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
					if (btn == 'yes') {
						Ext.Ajax.request({
									url : __ctxPath
											+ '/admin/multiDelConference.do',
									params : {
										ids : ids
									},
									method : 'POST',
									success : function(response, options) {
										Ext.ux.Toast.msg('操作信息', '成功删除该会议信息！');
										Ext.getCmp('MyJoinedConferenceGrid')
												.getStore().reload();
									},
									failure : function(response, options) {
										Ext.Msg.alert('操作信息', '操作出错，请联系管理员！');
									}
								});
					}
				});// end of comfirm
	},

	/**
	 * 取消多条记录
	 */
	delRecords : function() {
		var gridPanel = Ext.getCmp('MyJoinedConferenceGrid');
		var selectRecords = gridPanel.getSelectionModel().getSelections();
		if (selectRecords.length == 0) {
			Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
			return;
		}
		var ids = Array();
		for (var i = 0; i < selectRecords.length; i++) {
			if (selectRecords[i].data.startTime > new Date()) {
				Ext.ux.Toast.msg("信息", "删除失败，选择记录中包含已开始的会议！");
				return;
			}
			ids.push(selectRecords[i].data.confId);
		}
		this.delByIds(ids);
	},

	/**
	 * 查看详细信息
	 * 
	 * @param {}
	 *            confId
	 */
	showDetail : function(confId) {
		var grid = Ext.getCmp('MyJoinedConferenceGrid');
		var selectRecords = grid.getSelectionModel().getSelections();
		// for ( var i = 0; i < selectRecords.length; i++)
		var value1 = selectRecords[0].data.applyStatus;
		var ifIsLong=selectRecords[0].data.isLong;	
		if (value1 == 1) {
			new ConferenceEditView({
						// 申请中的数据可以进行编辑
						statusVal2 : '1',
						confId : confId,
						ifIsLong:ifIsLong//判断是否可以显示长期会议室日期,0是非长期，1是长期子笔，其他（2）：是长期父笔
					}).show();
		} else {
			new ConferenceEditView({
						// 已审核的数据不可以进行编辑
						statusVal2 : '0',
						confId : confId,
						ifIsLong:ifIsLong

					}).show();
		}		
	},
	
	endConference : function(confId,startTime,endTime) {
		if(new Date().format("Y-m-d H:i") > startTime && new Date().format("Y-m-d H:i") < endTime){
			var applyStatus1 = '-1';
			Ext.Msg.confirm('信息确认', '您确认要结束所选会议吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
						url : __ctxPath
								+ '/admin/changeStatusConference.do',
						params : {
							applyStatus : applyStatus1,
							confId : confId
						},
						method : 'POST',
						success : function(response, options) {
							Ext.ux.Toast.msg('操作信息', '成功结束该会议！');
							Ext.getCmp('MyJoinedConferenceGrid')
									.getStore().reload();
						},
						failure : function(response, options) {
							Ext.Msg.alert('操作信息', '操作出错，请联系管理员！');
						}
					});
				}
			});
		}else{
			Ext.ux.Toast.msg("信息", "结束失败，该会议未开始或已结束！");
			return false;
		}
	},

	/**
	 * 管理列中的事件处理
	 */
	onRowAction : function(gridPanel, record, action, row, col) {
		switch (action) {
			case 'btn-edit' :
				this.showDetail(record.data.confId);
				break;
			case 'btn-del' :
				if (record.data.startTime < new Date().format("Y-m-d H:i")) {
					Ext.ux.Toast.msg("信息", "取消失败，不能取消已开始的会议！");
				}

				else {
					this.delByIds(record.data.confId)
				}
				break;
				case 'btn-end' :
					this.endConference(record.data.confId,record.data.startTime,record.data.endTime)
				break;
		}
	}
});

MyJoinedConferenceView.send = function(mobileContent, confId) {
	new ConferenceSmsMobileForm({
			isInner : true,
			mobileContent:mobileContent
		}).show();
};

MyJoinedConferenceView.remove = function(confId){
	Ext.Msg.confirm('信息确认', '您确认要取消所选记录吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
						url : __ctxPath
								+ '/admin/multiDelConference.do',
						params : {
							ids : confId
						},
						method : 'POST',
						success : function(response, options) {
							Ext.ux.Toast.msg('操作信息', '成功取消该会议信息！');
							Ext.getCmp('MyJoinedConferenceGrid')
									.getStore().reload();
						},
						failure : function(response, options) {
							Ext.Msg.alert('操作信息', '操作出错，请联系管理员！');
						}
					});
		}
	});
}

MyJoinedConferenceView.edit = function(confId){
	var grid = Ext.getCmp('MyJoinedConferenceGrid');
	var selectRecords = grid.getSelectionModel().getSelections();
	// for ( var i = 0; i < selectRecords.length; i++)
	var value1 = selectRecords[0].data.applyStatus;
	var startTime = selectRecords[0].data.startTime;
	var ifIsLong=selectRecords[0].data.isLong;	
//	if ((value1 == 1 || 2 == value1) && startTime > today.format("Y-m-d H:i")) {
		new ConferenceEditView({
					// 申请中的数据可以进行编辑
					statusVal2 : '1',
					confId : confId,
					ifIsLong:ifIsLong//判断是否可以显示长期会议室日期,0是非长期，1是长期子笔，其他（2）：是长期父笔
				}).show();
	/*} else {
		new ConferenceEditView({
					// 已审核的数据不可以进行编辑
					statusVal2 : '0',
					confId : confId,
					ifIsLong:ifIsLong
				}).show();
	}*/
}

MyJoinedConferenceView.end = function(confId){
	var applyStatus1 = '-1';
	Ext.Msg.confirm('信息确认', '您确认要结束所选会议吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath
						+ '/admin/changeStatusConference.do',
				params : {
					applyStatus : applyStatus1,
					confId : confId
				},
				method : 'POST',
				success : function(response, options) {
					Ext.ux.Toast.msg('操作信息', '成功取消该会议信息！');
					Ext.getCmp('MyJoinedConferenceGrid')
							.getStore().reload();
				},
				failure : function(response, options) {
					Ext.Msg.alert('操作信息', '操作出错，请联系管理员！');
				}
			});
		}
	});
}