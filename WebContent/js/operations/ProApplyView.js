/**
 * @author:
 * @class ProApplyView
 * @extends Ext.Panel
 * @description 宿舍申退管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ProApplyView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProApplyView.superclass.constructor.call(this, {
			id : 'ProApplyView',
			title : '宿舍申退管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {

			id : 'CarSearchForm',
			height : 40,
			frame : false,
			region : 'north',
			border : false,
			layout : 'hbox',
			layoutConfig : {
				padding : '5',
				align : 'middle'
			},
			defaults : {
				xtype : 'label',
				margins : {
					top : 0,
					right : 4,
					bottom : 4,
					left : 4
				}
			},
			items : [ {
				text : '用户名'
			}, {
				xtype : 'textfield',
				name : 'Q_appUser.fullname_S_LK'
			}, {
				text : '工号'
			}, {
				xtype : 'textfield',
				name : 'Q_appUser.username_S_LK'
			}, {
				text : '申请类型'
			}, {
				hiddenName : 'Q_applyType_SN_EQ',
				xtype : 'combo',
				anchor : '95%',
				mode : 'local',
				editable : true,
				triggerAction : 'all',
				store : [ [ '1', '<font color="green">住宿</font>' ], [ '2', '<font color="red">退宿</font>' ], [ '3', '换宿舍' ] ]
			},{
				text : '审批状态'
			}, {
				hiddenName : 'Q_status_SN_EQ',
				xtype : 'combo',
				anchor : '95%',
				mode : 'local',
				editable : true,
				triggerAction : 'all',
				store : [ [ '1', '<font color="green">审批中</font>' ], [ '2', '<font color="red">审批通过</font>' ]
				                                                       , [ '3', '终止' ]]
			},

			{
				xtype : 'button',
				text : '查询',
				iconCls : 'search',
				handler : function() {
					var searchPanel = Ext.getCmp('CarSearchForm');
					var gridPanel = Ext.getCmp('ProApplyGrid');
					if (searchPanel.getForm().isValid()) {
						$search( {
							searchPanel : searchPanel,
							gridPanel : gridPanel
						});
					}

				}
			} ]

		});// end of searchPanel

		this.topbar = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-add',
				text : '添加申宿申请',
				xtype : 'button',
				scope : this,
				handler : this.viewProcess
			}, {
				iconCls : 'btn-add',
				text : '添加退宿申请',
				xtype : 'button',
				scope : this,
				handler : this.viewProcess1
			}, {
				iconCls : 'btn-add',
				text : '添加换宿申请',
				xtype : 'button',
				scope : this,
				handler : this.viewProcess2
			}
//			, {
//				iconCls : 'btn-del',
//				text : '删除',
//				xtype : 'button',
//				scope : this,
//				handler : this.removeSelRs
//			} 
			]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ProApplyGrid',
			url : __ctxPath + "/operations/listProApply.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, {
				name : 'fullname',
				mapping : 'appUser.fullname'
			}, {
				name : 'username',
				mapping : 'appUser.username'
			} 
			,{name:'runId',mapping:'processRun ? obj.processRun.runId : null'}
			,{name:'defId',mapping:'processRun ? obj.processRun.proDefinition.defId : null'}
			,{name:'piId',mapping:'processRun ? obj.processRun.piId : null'}
			,{name:'subject',mapping:'processRun ? obj.processRun.subject : null'}
			,
			'userCode', 'applyType', 'applyReason', 'processInstanceId',
					'status', 'workPosition', 'age', 'createDate', 'createBy',
					'updateDate', 'updateBy', 'userId', 'homeAddress',
					'contactPhone', 'urgentPerson', 'urgentPhone',
					'fitCondition' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '用户名',
				dataIndex : 'fullname'
			}, {
				header : '工号',
				dataIndex : 'username'
			}, {
				header : '申请类型',
				dataIndex : 'applyType',
				renderer : function(value) {
					if (value == '1') {
						return '<font color="green">住宿</font>';
					}
					if (value == '2') {
						return '<font color="red">退宿</font>';
					}
					if (value == '3') {
						return '换宿舍';
					}
				}
			}, {
				header : '原因',
				dataIndex : 'applyReason'
			}, {
				header : '审批状态',
				dataIndex : 'status',
				renderer : function(value) {
					if (value == '1') {
						return '<font color="green">审批中</font>';
					}
					if (value == '2') {
						return '<font color="red">审批通过</font>';
					}
					if (value == '3') {
						return '终止';
					}
				}
			}, {
				header : '岗位',
				dataIndex : 'workPosition'
			}, {
				header : '年龄',
				dataIndex : 'age'
			}, {
				header : '家庭住址',
				dataIndex : 'homeAddress'
			}, {
				header : '联系方式',
				dataIndex : 'contactPhone'
			}, {
				header : '紧急联系人',
				dataIndex : 'urgentPerson'
			}, {
				header : '紧急联系电话',
				dataIndex : 'urgentPhone'
			}, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 0,
				
				actions : [
				 {
				 iconCls : 'btn-stop',
				 qtip : '终止流程',
				 style : 'margin:0 3px 0 3px'
				 },
//				{
				// iconCls : 'btn-edit',
				// qtip : '编辑',
				// style : 'margin:0 3px 0 3px'
				// }
				{
				 iconCls : 'btn-flowView',
				 qtip : '查看',
				 style : 'margin:0 3px 0 3px'
				 }
				],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		// end of columns
				});

//		this.gridPanel.addListener('rowdblclick', this.rowClick);

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
			new ProApplyForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new ProApplyForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/operations/multiDelProApply.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/operations/multiDelProApply.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new ProApplyForm( {
			id : record.data.id
		}).show();
	},
	viewProcess : function() {
		var defId = FlowDefIdPro.proApplyId;
		var flowName = FlowDefIdPro.proApplyName;
		ProApplyView.applyNewFlow(defId, flowName);
	},
	viewProcess1 : function() {
		var defId = FlowDefIdPro.proOutId;
		var flowName = FlowDefIdPro.proOutName;
		ProApplyView.applyNewFlow(defId, flowName);
	},
	viewProcess2 : function() {
		var defId = FlowDefIdPro.proChangeId;
		var flowName = FlowDefIdPro.proChangeName;
		ProApplyView.applyNewFlow(defId, flowName);
	},
	
	showProcess :function(record) {
		var runId = record.data.runId;
		var defId = record.data.defId;;
		var piId = record.data.piId;
		var subject = record.data.subject;
		ProApplyView.proDetail(runId, defId, piId, subject)
	},
	
	endSealed:function(id, piId) {
		Ext.Msg.confirm('提示', '确定终止该流程？', function(btn, text){
			if (btn == 'yes'){
				// 修改数据库的审核状态
				Ext.Ajax.request( {
					url : __ctxPath + '/flow/stopProcessRun.do',
					params : {
						'piId' : piId
					},
					success : function(resp, options) {
						Ext.ux.Toast.msg('操作信息', '操作成功');
						Ext.getCmp('ProApplyGrid').getStore().reload();
					},
					failure : function(response) {
						Ext.Msg.alert("提示", "终止失败！");
					}
				});
				Ext.Ajax.request( {
					url : __ctxPath + '/operations/saveProApply.do',
					params : {
						'proApply.id' : id,
						'proApply.status' : 3
					},
					success : function(resp, options) {
						Ext.getCmp('ProApplyGrid').getStore().reload();
					}
				});
			}
		});
		
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-stop':
			if(record.data.status!=1){
				Ext.MessageBox.show( {
					title : '操作信息',
					msg : '注意:<font color="red">审批中</font>的流程才能终止！',
					buttons : Ext.MessageBox.OK,
					icon : 'ext-mb-error'
				});
				break;
			}
			this.endSealed.call(this, record.data.id,record.data.piId);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		case 'btn-flowView':
			this.showProcess.call(this, record);
			break;	
		default:
			break;
		}
	}

});

/**
 * 显示明细
 * 
 * @param {}
 *            runId
 * @param {}
 *            name
 */
ProApplyView.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};



ProApplyView.applyNewFlow = function(defId, name) {
	// alert(defId);
	// alert(name);
	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);
	if (startForm == null) {
		startForm = new ProcessRunStart( {
			id : 'ProcessRunStart' + defId,
			defId : defId,
			flowName : name
		});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
};
