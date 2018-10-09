/**
 * @author:
 * @class DiaryView
 * @extends Ext.Panel
 * @description [Diary]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
DiaryView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		DiaryView.superclass.constructor.call(this, {
			id : 'DiaryView',
			title : '工作日志管理',
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
		    	    	text : '开始日期：',
		    	    	width : 60
		    	    },
		    	    {
						name : 'from',
						flex : 1,
						xtype : 'datefield',
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
						name : 'to',
						flex : 1,
						xtype : 'datefield',
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
					if (this.searchPanel.getForm()
							.isValid()) {
						this.searchPanel
								.getForm()
								.submit(
										{
											waitMsg : '正在提交查询',
											url : __ctxPath + '/system/searchDiary.do',
											success : function(
													formPanel,
													action) {
												var result = Ext.util.JSON
														.decode(action.response.responseText);
												grid
														.getStore()
														.loadData(
																result);
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
			} ]
		});
	 	function statusRender(value, metadata, record, rowIndex,colIndex) {
	 	  	var status =record.data.status;
	 	  	var str="";
	 	  	if(status == 0){
	 	  		str = '未审核';
	 	  	}else {
	 	  		str = '已审核';
	 	  	}
			return str;
		}
	 	function diaryTypeRender(value, metadata, record, rowIndex,colIndex) {
	 	  	var diaryType =record.data.diaryType;
			var str=""
			if(diaryType == 0){
	 	  		str = '个人日志';
	 	  	}else {
	 	  		str = '工作日志';
	 	  	}
			return str;
		}
//查询列表
		this.gridPanel = new HT.GridPanel( {
			
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'DiaryGrid',
			url : __ctxPath + "/system/listDiary.do",
			fields : [ {
				name : 'diaryId',
				type : 'int'
			}, 'userId', 'dayTime', 'workContent', 'diaryType', 'onDutyTime',
					'offDutyTime', 'taskName', 'comment', 'status',
					'commentUserId', 'completeStatus', 'unfinishedWork',
					'createDate', 'createBy', 'updateDate', 'updateBy' ],
			columns : [ {
				header : 'diaryId',
				dataIndex : 'diaryId',
				hidden : true
			}, {
				header : '日期',
				dataIndex : 'dayTime',
				sortable: true
			}, {
				header : '工作内容',
				dataIndex : 'workContent'
			}, {
				header : '日志类型',
				dataIndex : 'diaryType',
				renderer:diaryTypeRender
			}, {
				header : '上班时间',
				dataIndex : 'onDutyTime'
			}, {
				header : '下班时间',
				dataIndex : 'offDutyTime'
			}, {
				header : '任务名称',
				dataIndex : 'taskName'
			}, {
				header : '评论内容',
				dataIndex : 'comment'
			}, {
				header : '状态',
				dataIndex : 'status',
				renderer:statusRender
			}, {
				header : '完成百分比',
				dataIndex : 'completeStatus'
			}, new Ext.ux.grid.RowActions( {
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
				} ],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		// end of columns
				});

		//this.gridPanel.addListener('rowdblclick', this.rowClick);
		
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
		new DiaryForm({
			oper : 'add'
		}).show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/system/multiDelDiary.do',
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
			this.removeRs.call(this, record.data.diaryId);
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
