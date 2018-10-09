/**
 * @author:
 * @class MonitorParticipantView
 * @extends Ext.Panel
 * @description [MonitorParticipant]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
MonitorParticipantView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		MonitorParticipantView.superclass.constructor.call(this, {
			id : 'MonitorParticipantView',
			title : '我的督办任务',
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
			items : [ {
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
		    	    	text : '截止日期：',
		    	    	width : 60,
		    	    	style : 'margin:0 0 0 20px'
		    	    },
					{
						name : 'Q_monitorApply.finishDt_D_EQ',
						flex : 1,
						xtype : 'datefield',
						editable:false,
						format : 'Y-m-d',
						width:130
					} 
		    	]}],
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
			items : [/* {
				iconCls : 'btn-add',
				text : '添加[MonitorParticipant]',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}, {
				iconCls : 'btn-del',
				text : '删除[MonitorParticipant]',
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
			id : 'MonitorParticipantGrid',
			url : __ctxPath + "/admin/listMonitorParticipant.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'type', 'mtrApplyId', 'userId', 'role', 'createDate',
					'createBy', 'updateDate', 'updateBy',{name:'topic',mapping:'monitorApply.topic'},{name:'userName',mapping:'appUser.fullname'},
					{name:'finishDt',mapping:'monitorApply.finishDt'}],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, /*{
				header : 'type',
				dataIndex : 'type'
			}, {
				header : 'mtrApplyId',
				dataIndex : 'mtrApplyId'
			},*/{
				header : '督办主题',
				dataIndex : 'topic'
			},/* {
				header : 'userId',
				dataIndex : 'userId'
			},*/{
				header : '责任人',
				dataIndex : 'userName'
			}, /*{
				header : 'role',
				dataIndex : 'role'
			},*/{
				header : '类型',
				dataIndex : 'type',
				renderer:function(val,metadata, record){
					var roleType = record.data.type;
					if(roleType == '1'){
						return '责任人';
					}else if(roleType == '2'){
						return '配合人';
					}
				}
			},{
				header : '截止日期',
				dataIndex : 'finishDt'
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
					iconCls : 'btn-showDetail',
					qtip : '查看',
					style : 'margin:0 3px 0 3px'
				} ],
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
			new MonitorParticipantForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new MonitorParticipantForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/admin/multiDelMonitorParticipant.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/admin/multiDelMonitorParticipant.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new MonitorParticipantForm( {
			id : record.data.id
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.id);
			break;
		case 'btn-showDetail':
			this.editRs.call(this, record);
			break;
		default:
			break;
		}
	}
});
