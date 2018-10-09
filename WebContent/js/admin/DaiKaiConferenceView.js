/**
 * @author: YHZ
 * @class DaiKaiConferenceView
 * @extends Ext.Panel
 * @description 待开会议查询
 * @company 广州宏天软件有限公司
 * @createtime:2010-10-11 PM
 */
DaiKaiConferenceView = Ext.extend(Ext.Panel, {
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
		DaiKaiConferenceView.superclass.constructor.call(this, {
			id : 'DaiKaiConferenceView',
			title : '待开会议查询',
			iconCls : 'menu-conference_daikai',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel,this.gridPanel ]
		});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		//start of this searchPanel
		this.searchPanel = new Ext.FormPanel({
			layout : 'form',
			region : 'north',
			width : '98%',
			height : 120,
			keys : {
				key : Ext.EventObject.ENTER,
				fn : this.search.createCallback(this),
				scope : this
			},
			items : [{
				border : false,
				layout : 'hbox',
				region : 'center',
				layoutConfig : {
					padding : '5',
					align : 'left'
				},
				defaults : {
					xtype : 'label',
					margins : {
						top : 0,
						right : 4,
						bottom : 0,
						left : 4
					}
				},
				items : [{
					style : 'padding-right:15px;',
					text : '会议标题:'
				},{
					xtype : 'textfield',
					name : 'Q_confTopic_S_LK',
					width : '20%',
					maxLength : 256,
					maxLengthText : '会议标题输入长度不能超过256个字符！'
				},{
					style : 'padding-right : 15px;',
					text : '会议类型：'
				},{
					width : '20%',
					xtype : 'combo',
					name : 'Q_confProperty_S_LK',
					fieldLabel : '会议类型',
					valueField : 'typeId',
					displayField : 'typeName',
					mode : 'local',
					editable : false,
					triggerAction : 'all',
					forceSelection : true,
					store : new Ext.data.SimpleStore({
								url : __ctxPath + '/admin/getTypeAllConference.do',
								autoLoad : true,
								fields : ['typeId', 'typeName']
					})
				},{
					style : 'padding-right : 5px;',
					text : '会议内容：'
				},{
					xtype : 'textfield',
					name : 'Q_confContent_S_LK',
					width : '20%',
					maxLength : 4000,
					maxLengthText : '会议内容长度不能超过4000个字符！'
				}]
			},{
				border : false,
				layout : 'hbox',
				region : 'center',
				layoutConfg : {
					align : 'left'
				},
				defaults : {
					xtype : 'label',
					margins : {
						left : 4,
						right : 4,
						top : 0,
						bottom : 0
					}
				},
				items : [
					{
						text : '会议室名称：'
					},{
						xtype : 'textfield',
						name : 'Q_roomName_S_LK',
						width : '20%',
						maxLength : 156,
						maxLengthText : '会议室输入字符不能超过156长度！'
					},{
						text : '会议室类型：'
					},{
						width : '20%',
						xtype : 'combo',
						hiddenName : 'Q_roomId_L_EQ',
						fieldLabel : '会议室类型',
						valueField : 'roomId',
						displayField : 'roomName',
						mode : 'local',
						editable : false,
						triggerAction : 'all',
						forceSelection : true,
						store : new Ext.data.SimpleStore({
							url : __ctxPath + '/admin/getBoardrooConference.do',
							autoLoad : true,
							fields : ['roomId', 'roomName']
						})
					},{
						text : '会议室地址:'
					},{
						width : '20%',
						xtype : 'textfield',
						name : 'Q_roomLocation_S_LK',
						maxLength : 156,
						maxLengthText : '会议室地址输入字符不能超过156个字符！'
					}				
				]
			},{
				layout : 'hbox',
				region : 'center',
				border : false,
				layoutConfig : {
					padding : '5px',
					align : 'center'
				},
				defaults : {
					xtype : 'label',
					margins : {
						left : 4,
						top : 0,
						right : 4,
						bottom : 0
					}
				},
				items : [{
					style : 'padding-right:15px;',
					text : '会议时间:'
				},{
					xtype : 'datefield',
					name : 'Q_startTime_D_GE',
					format : 'Y-m-d',
					width : '10%'
				},{
					text : '至'
				},{
					xtype : 'datefield',
					name : 'Q_endTime_D_LE',
					format : 'Y-m-d',
					width : '10%'
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
				},{
					iconCls : 'search',
					text : '搜索',
					handler : this.search.createCallback(this)
				},{
					iconCls : 'btn-reset',
					style : 'padding-right:40%;',
					text : '重置',
					handler : this.reset.createCallback(this)
				}]
			}]
		}); // end of this superSearchPanel
		// 加载数据至store
		this.store = new Ext.data.JsonStore( {
			url : __ctxPath + "/admin/daiKaiConference.do",
			root : 'result',
			totalProperty : 'totalCounts',
			remoteSort : true,
			fields : [ {
				name : 'confId',
				type : 'int'
			}, 'confTopic', 'compereName', 'roomName', 'roomLocation',
					'attendUsersName', 'checkName', 'startTime', 'endTime', 'status' ]
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
				iconCls : 'btn-showDetail',
				qtip : '查看',
				style : 'margin:0 3px 0 3px'
			} ]
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
				header : '审批人',
				dataIndex : 'checkName'
			}, {
				header : '开始时间',
				dataIndex : 'startTime'
			}, {
				header : '结束时间',
				dataIndex : 'endTime'
			}, {
				header : '会议室名称',
				dataIndex : 'roomName'
			}, {
				header : '会议地址',
				dataIndex : 'roomLocation'
			}, this.rowActions ],
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
			items : []
		});

		this.gridPanel = new Ext.grid.GridPanel( {
			id : 'DaiKaiConferenceGrid',
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
				ConferenceDetailForm.show(rec.data.confId);
			});
		});
		this.rowActions.on('action', this.onRowAction, this);
	},// end of the initComponents()

	/**
	 * 搜索
	 * @param {}
	 *            self 当前窗体对象
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
		new ConferenceForm().show();
	},

	/**
	 * 删除多条记录
	 */
	delRecords : function() {
		var gridPanel = Ext.getCmp('DaiKaiConferenceGrid');
		var selectRecords = gridPanel.getSelectionModel().getSelections();
		if (selectRecords.length == 0) {
			Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
			return;
		}
		var ids = Array();
		for ( var i = 0; i < selectRecords.length; i++) {
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
		ConferenceDetailForm.show(confId);
	},

	/**
	 * 管理列中的事件处理
	 */
	onRowAction : function(gridPanel, record, action, row, col) {
		switch (action) {
		case 'btn-showDetail':
			this.showDetail(record.data.confId);
			break;
		}
	}
});
