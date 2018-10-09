/**
 * @author:cxt
 * @class VPersonalcardinfoView
 * @extends Ext.Panel
 * @description 餐卡查询
 * @company 深圳捷达世软件有限公司
 * @createtime:2012-05-28
 */
VPersonalcardinfoView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		VPersonalcardinfoView.superclass.constructor.call(this, {
			id : 'VPersonalcardinfoView',
			title : '餐卡查询',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel]
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
						name : 'Q_useTime_D_GE',						
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
						name : 'Q_useTime_DG_LE',						
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
											url : __ctxPath + '/personal/shPercardinfoVPersonlcard.do',
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
			items : [ {/*
				iconCls : 'btn-add',
				text : '设置代办',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			*/}]
		});
	 
	 	
//查询列表
		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			//rowActions : true,		
			url : __ctxPath + "/personal/shPercardinfoVPersonlcard.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'username', 'fullname', 'dep', 'useType','useTime','xfposmoney','xfcardmoney'],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '员工工号',
				dataIndex : 'username',
				sortable: true
			}, {
				header : '姓名',
				dataIndex : 'fullname'
			},{
				header : '部门名称',
				dataIndex : 'dep'
			},{
				header : '类别（充值/消费）',
				dataIndex : 'useType'
			},{
				header : '时间（充值/消费）',
				dataIndex : 'useTime'
			},{
				header : '金额（充值/消费）',
				dataIndex : 'xfposmoney'
			},{
				header : '余额',
				dataIndex : 'xfcardmoney'
			}/*, new Ext.ux.grid.RowActions( {
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
			}) */]
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
