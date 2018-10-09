/**
 * @author: YHZ
 * @class MyJoinConferenceView
 * @extends Ext.Panel
 * @description 待我参加会议查询
 * @company 捷达世深圳软件有限公司
 * @createtime:2010-10-11 PM
 */
MyJoinConferenceView = Ext.extend(Ext.Panel, {
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
		MyJoinConferenceView.superclass.constructor.call(this, {
					id : 'MyJoinConferenceView',
					iconCls : 'menu-conference_myjoin',
					title : '我的会议',
					region : 'center',
					layout : 'form',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		// start of this searchPanel

		var dataStatus = [['2', '待我参加'], ['-1', '我已参加']];

		this.searchPanel = new Ext.FormPanel({
			layout : 'form',
			region : 'north',
			width : '98%',
			height : 100,
			frame : true,
			keys : {
				key : Ext.EventObject.ENTER,
				fn : this.search.createCallback(this),
				scope : this
			},
			items : [{
				layout : 'column',
				// columnWidth : 1,
				border : false,
				defaults : {
					border : false,
					width : 300

				},
				items : [{
					layout : 'form',
					columnWidth : .25,

					items : [{
								fieldLabel : '会议议题',
								xtype : 'textfield',
								name : 'Q_confTopic_S_LK',
								width : 160,
								maxLength : 256,
								maxLengthText : '会议标题输入长度不能超过256个字符！'
							}, {

								// width : '20%',
								xtype : 'combo',
								hiddenName : 'Q_applyStatus_SN_EQ',
								fieldLabel : '参加状态',
								valueField : 'applyStatus',
								displayField : 'applyStatusName',
								mode : 'local',
								width : 160,
								editable : false,
								triggerAction : 'all',
								forceSelection : true,
								store : new Ext.data.SimpleStore({
									// url : __ctxPath +
									// '/admin/getBoardrooConference.do',
									// autoLoad : true,
									fields : ['applyStatus', 'applyStatusName'],
									data : dataStatus
								})

							}]

				}, {
					layout : 'form',
					columnWidth : .25,
					items : [{

						xtype : 'combo',
						// xtype : 'textfield',
						// hiddenName : 'conference.roomId',
						hiddenName : 'Q_roomId_L_EQ',
						width : 160,
						fieldLabel : '会议室名称',
						valueField : 'roomId',
						id : 'myJoin.roomId',
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
													.getCmp('myJoin.roomId');
											if (cmp.hiddenField.value)
												cmp
														.setValue(cmp.hiddenField.value);
										}
									}

								})
					}]
				}, {
					layout : 'form',
					columnWidth : .25,
					items : [{
						fieldLabel : '会议开始时间',
						xtype : 'datefield',
						name : 'Q_startTime_D_GE',
						format : 'Y-m-d'
							// width : '10%'
						}]

				}, {

					layout : 'form',
					columnWidth : .25,
					items : [{
						fieldLabel : '会议结束时间',
						id : 'endTimeMyJoin',
						xtype : 'datefield',
						name : 'Q_endTime_DG_LE',
						format : 'Y-m-d'
							// width : '10%'
						}]

				}]
			},/*
				 * { border : false, layout : 'hbox', region : 'center',
				 * layoutConfg : { align : 'left' }, defaults : { xtype :
				 * 'label', margins : { left : 4, right : 4, top : 0, bottom : 0 } },
				 * items : [ { text : '会议室名称：' },{ xtype : 'textfield', name :
				 * 'Q_roomName_S_LK', width : '20%', maxLength : 156,
				 * maxLengthText : '会议室输入字符不能超过156长度！' } ] },{ layout : 'hbox',
				 * region : 'center', border : false, layoutConfig : { padding :
				 * '5px', align : 'center' }, defaults : { xtype : 'label',
				 * margins : { left : 4, top : 0, right : 4, bottom : 0 } },
				 * items : [{ style : 'padding-right:15px;', text : '会议时间:' },{
				 * xtype : 'datefield', name : 'Q_startTime_D_GE', format :
				 * 'Y-m-d', width : '10%' },{ text : '至' },{ id:'endTime', xtype :
				 * 'datefield', name : 'Q_endTime_D_LE', format : 'Y-m-d', width :
				 * '10%' }] },
				 */{
				layout : 'hbox',
				region : 'center',
				border : false,
				layoutConfig : {
					padding : '5px',
					align : 'center'
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
							style : 'padding-left:40%;',
							text : ' '
						}, {
							iconCls : 'search',
							text : '查询',
							//style : 'padding-left:40%;',
							handler : this.search.createCallback(this)
						}, {
							iconCls : 'btn-reset',
							//style : 'padding-right:40%;',
							text : '重置',
							handler : this.reset.createCallback(this)
						}]
			}

			]
		}); // end of this superSearchPanel

		// 加载数据至store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + "/admin/myJoinConference.do",
					root : 'result',
					totalProperty : 'totalCounts',
					remoteSort : true,
					fields : [{
								name : 'confId',
								type : 'int'
							}, 'confTopic', 'compereName', 'roomName',
							'roomLocation', 'attendUsersName', 'checkName',
							'startTime', 'endTime', 'status', 'applyStatus','isLong']
				});
		this.store.setDefaultSort('confId', 'desc');
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

		this.rowActions = new Ext.ux.grid.RowActions({
					header : '管理',
					width : 80,
					actions : [{
								iconCls : 'btn-showDetail',
								qtip : '查看',
								style : 'margin:0 3px 0 3px'
							}/*,{
								iconCls : 'btn-save',
								qtip : '创建会议纪要',
								style : 'margin:0 3px 0 3px'
							
								
							}*/]
				});

		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
								header : 'confId',
								dataIndex : 'confId',
								hidden : true
							},{
							    header : 'isLong',
								dataIndex : 'isLong',
								hidden : true
							
							}, {
								header : '会议议题',
								dataIndex : 'confTopic'
							},/*
								 * { header : '主持人', dataIndex : 'compereName' }, {
								 * header : '与会人员', dataIndex :
								 * 'attendUsersName' }, { header : '审批人',
								 * dataIndex : 'checkName' },
								 */{
								header : '开始时间',
								dataIndex : 'startTime'
							}, {
								header : '结束时间',
								dataIndex : 'endTime'
							}, {
								header : '会议室名称',
								dataIndex : 'roomName'
							}, {
								header : '状态',
								dataIndex : 'applyStatus',
								renderer : function(value) {
									if (value == 2) {
										return "<span>待我参加</span>";

									} else if (value == -1) {

										return "<span>我已参加</span>";

									}

								}

							},this.rowActions, {	header : '新建会议纪要',
												dataIndex : 'status',
												width : 80,
												sortable : false,
												renderer : function(value,
														metadata, record,
														rowIndex, colIndex) {													
													var applyStatus1 = record.data.applyStatus;
													var status1 = record.data.status;
													var confId2= record.data.confId;
													var confTopic2= record.data.confTopic;

													var str = '';
													if(status1==0 && applyStatus1 ==-1){
													//未删除并且是已经完成的会议可以创建会议纪要
										    	str = '<button title="创建" value=" " class="btn-save" onclick="MyJoinConferenceView.openSummaryAdd('+ confId2 + ','+"'"+confTopic2+"'"+')">&nbsp;</button>';
                                                       
													}
												
													return str;
												}
											
							
							
							}/*
								 * { header : '会议地址', dataIndex :
								 * 'conference.roomLocation' },
								*/ 
								 ],
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
					items : []
				});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'MyJoinConferenceGrid',
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
					plugins : this.rowActions,
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

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
			
			
					grid.getSelectionModel().each(function(rec) {
								// ConferenceDetailForm.show(rec.data.confId);					
						new ConferenceEditForm({
											// 已审核的数据不可以进行编辑
											statusVal2 : '0',
											confId : rec.data.confId,
											ifIsLong:rec.data.isLong
										}).show();
							});
				});
		this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()

	/**
	 * 搜索
	 */
	search : function(self) {
		/*
		 * var endTime =
		 * Ext.util.Format.date(Ext.getCmp('endTimeMyJoin').getValue(),'Y-m-d
		 * H:i:s'); //var
		 * date1=Ext.util.Format.date((Ext.getCmp('endTime').getValue())+1,'Y-m-d
		 * H:i:s'); if(endTime!=null && endTime!=''){ var d3 =
		 * endTime.replace(/\-/g,'\/'); var date3 = new Date(d3);
		 * date3.setDate(date3.getDate()+1); date3.setMonth(date3.getMonth()+1);
		 * var dd3 = date3.getFullYear() + "-" + date3.getMonth() + "-" +
		 * date3.getDate(); var d3 = dd3.replace(/\-/g,'\/'); var lastDate = new
		 * Date(d3); //alert(endTime.getDate()+1); //alert(date1);
		 * Ext.getCmp('endTime').setValue(lastDate); } else
		 * Ext.getCmp('endTimeMyJoin').setValue(endTime);
		 */

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
	 * 查看详细信息
	 * 
	 * @param {}
	 *            confId
	 */
	showDetail : function(record) {
		// ConferenceDetailForm.show(confId);
		var confId = record.data.confId;	
		var record11=record.data.isLong;
		new ConferenceEditForm({
					// 已审核的数据不可以进行编辑
					statusVal2 : '0',
					confId : confId,
					ifIsLong:record11  
				}).show();

	},
	
	/**
	 * 管理列中的事件处理
	 */
	onRowAction : function(gridPanel, record, action, row, col) {
		
		
		switch (action) {
			case 'btn-showDetail' :
				this.showDetail(record);
				break;
			/*case 'btn-save' :
				this.openSummaryAdd(record);
				break;*/
		}
		
		/*if(record.data.status==4){
		
		
		}*/
	}
});

MyJoinConferenceView.openSummaryAdd=function(confId2,confTopic2){
	/*new AddConfSummaryForm({
	    confId : record.data.confId,
	    confTopic:record.data.confTopic
	
	}).show();
	*/

	new AddConfSummaryForm({
	    confId : confId2,
	    confTopic:confTopic2
	
	}).show();
	
	}
