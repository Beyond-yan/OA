/**
 * 
 * @class ConfCompletedView
 * @extends Ext.Panel
 * @description 会议状态查询 
 * 
 */
ConfCompletedView = Ext.extend(Ext.Panel, {
	//搜索
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
		ConfCompletedView.superclass.constructor.call(this, {
			id : 'ConfCompletedView',
			title : '会议使用调整',
			iconCls : 'menu-confApply',
			region : 'center',
			layout : 'form',
			items : [ this.searchPanel,this.gridPanel ]
		});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {		
		//start of this searchPanel
		this.searchPanel = new Ext.FormPanel({
			layout : 'form',
			region : 'center',
			width : '98%',
			height : 130,			
			frame:true,
			keys : {
				key : Ext.EventObject.ENTER,
				fn : this.search.createCallback(this),
				scope : this
			},			
			items:[{
			layout : 'column',
		    	items : [{
		    	         layout : 'form',
		    	         columnWidth : .3,
								
				items : [{		xtype : 'combo',								
								hiddenName : 'Q_roomId_L_EQ',
								width : 130,
								fieldLabel : '会议室名称',
								valueField : 'roomId',
								id : 'confcom.roomId',
								displayField : 'roomName',
								mode : 'local',
								editable : false,
								emptyText : '--请选择会议室--',
								triggerAction : 'all',
								store : new Ext.data.SimpleStore({
									url : __ctxPath
											+ '/admin/getBoardrooConference.do?',									
									autoLoad : true,
									fields : ['roomId', 'roomName'],

									listeners : {
										scope : this,
										load : function() {
											var cmp = Ext
													.getCmp('confcom.roomId');
											if (cmp.hiddenField.value)
												cmp
														.setValue(cmp.hiddenField.value);
										}
									}

								})
							},
						{
						fieldLabel : '会议议题',
						xtype : 'textfield',
						name : 'Q_confTopic_S_LK',
						width : 130,
						maxLength : 156,
						maxLengthText : '会议议题输入字符不能超过156长度！'						
					}				
				]
			},{
				layout : 'form',
				columnWidth : .4,				
				items : [{
					fieldLabel:'会议开始时间',				
					xtype : 'datetimefield',
					name : 'Q_startTime_D_GE',
					format : 'Y-m-d',
					width : 140,
					editable : false
				},{
					fieldLabel:'会议结束时间',					
					xtype : 'datetimefield',				
					name : 'Q_endTime_DG_LE',
					format : 'Y-m-d',
					width : 140,
					editable : false
				}]
			},{
				layout : 'form',
				columnWidth : .2			
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
				     text : '查询',
					iconCls : 'search',
					xtype : 'button',	
					handler : this.search.createCallback(this)					
				}, {
					iconCls : 'btn-reset',					
					text : '重置',
					xtype : 'button',
					handler : this.reset.createCallback(this)
					//style : 'margin:0 3px 0 0px'
				}]			
			}]
		}); // end of this superSearchPanel
		
		// 加载数据至store
		this.store = new Ext.data.JsonStore( {
			url : __ctxPath + "/admin/listConference.do",
			root : 'result',
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : [ {
				name : 'confId',
				type : 'int'
			}, 'confTopic', 'compereName', 'roomName', 'roomLocation','confProperty',
					'attendUsersName', 'checkName','applyStatus','checkReason', 'startTime', 'endTime', 'status','isLong' ]
		});
		this.store.setDefaultSort('confId', 'desc');
		// 加载数据
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
			},{
				iconCls : 'btn-edit',
				qtip : '会议室调整',
				style : 'margin:0 3px 0 3px'
			},
			{
				iconCls : 'btn-showDetail',
				qtip : '再审核',
				style : 'margin:0 3px 0 3px'
			}]
		});

		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel( {
			columns : [ sm, new Ext.grid.RowNumberer(), {
				header : 'confId',
				dataIndex : 'confId',
				hidden : true
			}, {
				header : '会议议题',
				dataIndex : 'confTopic'
			}, {
				header : '主持人',
				dataIndex : 'compereName'
			}, {
				header : '与会人员',
				dataIndex : 'attendUsersName'
			}, {
				header : '会议室名称',
				dataIndex : 'roomName'
			}, {
				header : '会议类型',
				dataIndex : 'confProperty'
			}, {
				header : '审批人',
				dataIndex : 'checkName'
			},
			{
				header : '审核状态',
				dataIndex : 'applyStatus',
				renderer: function(value){
				if(value=='1'){
					return  "<span>待审核</span>";
				}
				else if(value=='2'){
					return "<span>通过</span>";
				}
				else if(value=='3'){
					return "<span>不通过</span>";
				}
				else if(value=='4'){
					return "<span>取消申请</span>";
				}				
			}
			},
			 {
				header : '审批描述',
				dataIndex : 'checkReason'
			},{
				header : '开始时间',
				dataIndex : 'startTime'
			}, {
				header : '结束时间',
				dataIndex : 'endTime'
			},{
				header : 'isLong',
				hidden : true,
				dataIndex : 'isLong'
			},this.rowActions ],
			defaults : {
				sortable : true,
				menuDisabled : true,
				width : 100
			}
		});
		// 初始化工具栏
		this.topbar = new Ext.Toolbar( {
			height : 30,
			bodyStyle : 'text-align:left',
			items : [ {
				text : '删除',
				iconCls : 'btn-del',
				xtype : 'button',
				handler : this.softDel
			} ]
		});

		this.gridPanel = new Ext.grid.GridPanel( {
			id : 'ConfCompletedViewGrid',
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
			bbar : new Ext.PagingToolbar( {
				pageSize : 25,
				store : this.store,
				displayInfo : true,
				displayMsg : '当前页记录索引{0}-{1}， 共{2}条记录',
				emptyMsg : "当前没有记录"
			})
		});

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
			grid.getSelectionModel().each(function(rec) {
				var confId = rec.data.confId;
				new ConfCompletedDetailForm({
					confId : confId
				}).show();				
			});
		});
		this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()

	/**
	 * 搜索
	 * @param {}
	 *  self 当前窗体对象
	 */
	search : function(self) {			
		if (self.searchPanel.getForm().isValid()) {// 如果合法
			$search({
				searchPanel :self.searchPanel,
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
		new ConfCompletedForm().show();
	},

	/**
	 * 删除多条记录
	 */
	softDel : function() {
		var gridPanel = Ext.getCmp('ConfCompletedViewGrid');
		var selectRecords = gridPanel.getSelectionModel().getSelections();
		if (selectRecords.length == 0) {
			Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
			return;
		}
		var ids = Array();
		for ( var i = 0; i < selectRecords.length; i++) {
			ids.push(selectRecords[i].data.confId);			
		}
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url : __ctxPath
							+ '/admin/softDelConference.do',
					params : {
						ids : ids
					},
					method : 'POST',
					success : function(response, options) {
						Ext.ux.Toast.msg('操作信息', '成功删除该会议信息！');
						Ext.getCmp('ConfCompletedViewGrid').getStore().reload();
					},
					failure : function(response, options) {
						Ext.Msg.alert('操作信息', '操作出错，请联系管理员！');
					}
				});
			}
		});// end of comfirm
	},
	
	/**
	 * 查看详细信息
	 */
	showDetail : function(record) {
		//ConferenceDetailForm.show(confId);
		var confId = record.data.confId;	
		var record11=record.data.isLong;		
		new ConfCompletedForm({
			confId : confId,
			btnV:'1' , //控制显示出退回的控件
			isLong11:record11
		}).show();
	},	
	/**
	 * 编辑记录,首先判断用户权限
	 */
	editRecord : function(record) {
		var confId = record.data.confId;
		var startTime = record.data.startTime;
		var endTime = record.data.endTime;
		var isLong=record.data.isLong;
		new ConfCompletedForm({
			confId : confId	,
			isLong11:isLong			
		}).show();			
	},
	
	/**
	 * 管理列中的事件处理
	 */
	onRowAction : function(gridPanel, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.softDel(record.data.confId);
			break;
		case 'btn-edit':
			this.editRecord(record);
			break;
		case 'btn-showDetail':
			this.showDetail(record);
			break;
		}
	}
});
