/**
 * @author:
 * @class MonitorDealHistoryView
 * @extends Ext.Panel
 * @description [MonitorDealHistory]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
MonitorDealHistoryView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		MonitorDealHistoryView.superclass.constructor.call(this, {
			id : 'MonitorDealHistoryView',
			title : '督办事项查询与管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {
			layout : 'form',
			region : 'north',
			width : '100%',
			items : [{

		    	layout : 'column',
		    	height : 30,
		    	border:false,
		    	items : [
		    		{
		    	    	xtype : 'label',
		    	    	text : '督办主题：',
		    	    	width : 60
		    	    },
		    	    {
						name : 'Q_monitorApply.topic_S_LK',
						flex : 1,
						xtype : 'textfield',
						width:130
					},
					{
		    	    	xtype : 'label',
		    	    	text : '处理人：',
		    	    	width : 60,
		    	    	style : 'margin:0 0 0 20px'
		    	    },
		    	    {
						name : 'Q_appUser.fullname_S_LK',
						flex : 1,
						xtype : 'textfield',
						width:130
					}
		    	]
			}
			        , {
				fieldLabel : '部门ID',
				name : 'Q_department.deptId_L_EQ',
				flex : 1,
				value:curUserInfo.depId,
				xtype : 'hidden',
				width:130
			}/*, {
				fieldLabel : '责任人ID',
				name : 'Q_userId_L_EQ',
				flex : 1,
				xtype : 'numberfield'
			},*/ /*{
				fieldLabel : '处理日期',
				name : 'Q_dealDate_D_EQ',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				fieldLabel : '状态',
				name : 'Q_curStatus_L_EQ',
				flex : 1,
				xtype : 'numberfield'
			}*//*, {
				fieldLabel : 'curStaDes',
				name : 'Q_curStaDes_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : 'createDate',
				name : 'Q_createDate_D_EQ',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				fieldLabel : 'createBy',
				name : 'Q_createBy_S_EQ',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : 'updateDate',
				name : 'Q_updateDate_D_EQ',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d'
			}, {
				fieldLabel : 'updateBy',
				name : 'Q_updateBy_S_EQ',
				flex : 1,
				xtype : 'textfield'
			} */],
			buttons : [ {
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			}, {
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			} ]
		});// end of searchPanel

		this.topbar = new Ext.Toolbar( {
			items : [ /*{
				iconCls : 'btn-add',
				text : '添加',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}, {
				iconCls : 'btn-del',
				text : '删除',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			} */]
		});
		
		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'MonitorDealHistoryGrid',
			url : __ctxPath + "/admin/list2MonitorDealHistory.do?Q_department.deptId_L_EQ="+curUserInfo.depId,
			/*fields : [ {
				name : 'id',
				type : 'int'
			}, 'mtrApplyId', 'deptId', 'userId', 'dealDate', 'curStatus',
					'curStaDes', 'createDate', 'createBy', 'updateDate',
					'updateBy',{name : 'userName',mapping : 'appUser.fullname'},{name : 'depName',mapping : 'department.depName'},
					{name : 'topic',mapping : 'monitorApply.topic'},{name:'curStatus',mapping:'monitorStatusConf.confName'}],*/
					fields : [ {
						name : 'id',
						type : 'int'
					}, 'mtrApplyId', 'deptId', 'userId', 'dealDate', 'curStatus',
							'curStaDes',{name : 'userName',mapping : 'appUser.fullname'},{name : 'depName',mapping : 'department.depName'},
							{name : 'topic',mapping : 'monitorApply.topic'},{name:'confName',mapping:'monitorStatusConf.confName'},{name : 'applyState',mapping : 'monitorApply.applyState'}],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '督办事项ID',
				dataIndex : 'mtrApplyId',
				hidden : true
			},{
				header : '督办主题',
				dataIndex : 'topic'
			}, {
				header : '责任部门ID',
				dataIndex : 'deptId',
				hidden : true
			},{
				header : '责任部门',
				dataIndex : 'depName'
			}, {
				header : '处理人ID',
				dataIndex : 'userId',
				hidden : true
			},{
				header : '处理人',
				dataIndex : 'userName'
			},{
				header : '处理日期',
				dataIndex : 'dealDate'
			}, {
				header : '最新状态',
				dataIndex : 'confName'
			}, {
				header : '现状说明',
				dataIndex : 'curStaDes'
			}/*, {
				header : 'createDate',
				dataIndex : 'createDate'
			}, {
				header : 'createBy',
				dataIndex : 'createBy'
			}, {
				header : 'updateDate',
				dataIndex : 'updateDate'
			}, {
				header : 'updateBy',
				dataIndex : 'updateBy'
			}*/, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ {
					iconCls : 'btn-del',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-edit',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px'
				},{
					iconCls : 'btn-detail',
					qtip : '详细',
					style : 'margin:0 3px 0 3px'
				}],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		// end of columns
				});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search( {
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new MonitorDealHistoryForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new MonitorDealHistoryForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/admin/multiDelMonitorDealHistory.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/admin/multiDelMonitorDealHistory.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		if(record.data.applyState==2){
			Ext.MessageBox.alert('警告','该督办任务审核已经结束，不能编辑',function(btn){
				
			});
			return;
		}
		if(record.data.applyState==3){
			Ext.MessageBox.alert('警告','该督办任务审核已被終止，不能编辑',function(btn){
				
			});
			return;
		}
		new MonitorDealHistoryForm( {
			id : record.data.id
		}).show();
	},
	// 详细Rs
	detailRs : function(record) {
		new MoniDealHisDetailForm( {
			mtrApplyId : record.data.mtrApplyId,
			userId:record.data.userId
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.id);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		case 'btn-detail':
			this.detailRs.call(this, record);
			break;
		default:
			break;
		}
	}
});
