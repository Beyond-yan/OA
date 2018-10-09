/**
 * @author:
 * @class DiaryView
 * @extends Ext.Panel
 * @description [Diary]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
UserAgentView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		UserAgentView.superclass.constructor.call(this, {
			id : 'UserAgentView',
			title : '代办帐号管理',
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
			items : [    {
		    	layout : 'column',
		    	height : 30,
		    	border:false,
		    	items : [
					{
		    	    	xtype : 'label',
		    	    	text : '代理人姓名：',
		    	    	width : 80
		    	    },
		    	    {
						name : 'Q_grantFullname_S_LK',
						id : 'grantFullname',
						flex : 1,
						xtype : 'textfield',
						width:130
					},
		    		{
		    	    	xtype : 'label',
		    	    	text : '开始日期：',
		    	    	width : 60
		    	    },
		    	    {
						name : 'Q_grantFromDate_D_GE',
						id : 'grantFromDate',
						flex : 1,
						xtype : 'datetimefield',
						format : 'Y-m-d',
						width:130
					},
					{
		    	    	xtype : 'label',
		    	    	text : '结束日期：',
		    	    	width : 60,
		    	    	style : 'margin:0 0 0 20px'
		    	    },
		    	    {
						name : 'Q_grantToDate_D_LE',
						id : 'grantToDate',
						flex : 1,
						xtype : 'datetimefield',
						format : 'Y-m-d',
						width:130
					}
		    	]} ],
			buttons : [ {
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : function() {
					var grid =this.gridPanel;
					if (this.searchPanel.getForm().isValid()) {
						this.searchPanel
								.getForm()
								.submit(
										{
											waitMsg : '正在提交查询',
											url : __ctxPath + '/system/searchUserAgent.do',
											success : function(formPanel,action) {
												var result = Ext.util.JSON.decode(action.response.responseText);
												grid.getStore().loadData(result);
											}
										});
					}

				}
			}, {
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			} ]
		});// end of searchPanel

		this.topbar = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-add',
				text : '设置代办',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}]
		});
	 
	 	
//查询列表
		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'UserAgentGrid',
			url : __ctxPath + "/system/listMyselfUserAgent.do",
			fields : [ {
				name : 'grantId',
				type : 'int'
			}, 'userId', 'fullname', 'grantUId', 'grantFullname', 'grantTitle','grantFromDate','grantToDate'],
			columns : [ {
				header : 'grantId',
				dataIndex : 'grantId',
				hidden : true
			}, {
				header : '设置人姓名',
				dataIndex : 'fullname',
				sortable: true
			}, {
				header : '待办人姓名',
				dataIndex : 'grantFullname'
			},{
				header : '待办开始时间',
				dataIndex : 'grantFromDate'
			},{
				header : '待办结束时间',
				dataIndex : 'grantToDate'
			}, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ {
					iconCls : 'btn-del',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}/*, {
					iconCls : 'btn-edit',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px'
				}*/ ],
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
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new DiaryForm( {
				diaryId : rec.data.diaryId
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new MySelfUserAgentWindow( {
			userId : curUserInfo.userId,
			fullname : curUserInfo.fullname
		}).show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/system/multiDelUserAgent.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/system/multiDelDiary.do',
			grid : this.gridPanel,
			idName : 'diaryId'
		});
	},
	// 编辑Rs
	editRs : function(record,startTime,endTime) {
		new DiaryForm( {
			diaryId : record.data.diaryId,
			startTime:startTime,
			endTime:endTime
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			//alert( record.data.grantId);
			this.removeRs.call(this, record.data.grantId);
			break;
		case 'btn-edit':
			var startTime = grid.getStore().getAt(row).get('onDutyTime');
			var endTime =grid.getStore().getAt(row).get('offDutyTime');
			this.editRs.call(this, record,startTime,endTime);
			break;
		default:
			break;
		}
	}
});
