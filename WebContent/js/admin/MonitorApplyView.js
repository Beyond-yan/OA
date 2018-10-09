
function manageRender(val, p, record){
		
		var editId = record.data.id;
		var runId = record.data.runId;
		var defId = record.data.defId;;
		var piId = record.data.piId;
		var subject = record.data.subject;
		var topic = record.data.topic;
		var finishDt=record.data.finishDt;
		//alert(defId);
		var str='';
		str += '<button title="查看" value=" " class="btn-showDetail" onclick="editRs('
											+ editId + ')"></button>';
		str += '&nbsp;<button title="审批状态" value=" " class="btn-flowView" onclick="proDetail('+ runId +','+ defId +',\''+ piId +'\',\''+ subject +'\')"></button>';
		str += '&nbsp;<button title="催办" value=" " class="btn-remind" onclick="MonitorApplyView.showHasten('+ editId +',\''+ topic +'\',\''+ finishDt +'\')"></button>';
		if(record.data.runStatus == 1){
			str += '&nbsp;<button title="终止流程" value=" " class="btn-stop" onclick="MonitorApplyView.stop('+ editId +',\''+ piId +'\')"></button>';
		}
	
		return str;

};
function editRs (id) {
	new MonitorApplyForm( {
		id : id
	}).show();
};

function proDetail(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};

/**
 * @author:
 * @class MonitorApplyView
 * @extends Ext.Panel
 * @description [MonitorApply]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
MonitorApplyView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		MonitorApplyView.superclass.constructor.call(this, {
			id : 'MonitorApplyView',
			title : '督办申请管理',
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
			items : [  {
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
							name : 'Q_topic_S_LK',
							flex : 1,
							xtype : 'textfield',
							width:130
						},
						{
			    	    	xtype : 'label',
			    	    	text : '完成日期：',
			    	    	width : 60,
			    	    	style : 'margin:0 0 0 20px'
			    	    },
						{
						name : 'Q_finishDt_D_EQ',
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
				handler : this.search
			}, {
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			} ]
		});// end of searchPanel

		this.topbar = new Ext.Toolbar( {
			height : 30,
			bodyStyle : 'text-align:left',
			items : [ {
				iconCls : 'btn-add',
				text : '添加',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			} /*{
				iconCls : 'btn-del',
				text : '删除督办',
				xtype : 'button',
				scope : this,
				handler : this.removeSelRs
			}*/ ]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'MonitorApplyGrid',
			url : __ctxPath + "/admin/listMonitorApply.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}
			,{name:'runId',mapping:'processRun ? obj.processRun.runId : null'}
			,{name:'defId',mapping:'processRun ? obj.processRun.proDefinition.defId : null'}
			,{name:'piId',mapping:'processRun ? obj.processRun.piId : null'}
			,{name:'subject',mapping:'processRun ? obj.processRun.subject : null'},
			'applicantId','type','sourceType','topic','description','remark','finishDt',
			{name:'depName',mapping:'appUser.department.depName'},'applyState',
			{name:'runStatus',mapping:'processRun.runStatus'}],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			},/* {
				header : 'applicantId',
				dataIndex : 'applicantId'
			},*/ {
				header : '督办类型',
				dataIndex : 'type',
				renderer:function(val,metadata, record){
				
				var typeId = record.data.type;
				if(typeId == '1'){
					return '公司重大责任目标';
				}else if(typeId == '2'){
					return '周重点工作';
				}else if(typeId == '3'){
					return '会议决策事项';
				}else if(typeId == '4'){
					return '领导批示及交办事项';
				}else {
					return '公文督办';
				}
				}
			}/*, {
				header : '督办来源',
				dataIndex : 'sourceType',
				renderer:function(val,metadata, record){
					var sourceType = record.data.sourceType;
					if(sourceType == '1'){
						return '督办管理';
					}else if(sourceType == '2'){
						return '公文管理';
					}
				}
			}*/, /*{
				header : 'sourceId',
				dataIndex : 'sourceId'
			},*/ {
				header : '督办主题',
				dataIndex : 'topic'
			}, {
				header : '督办内容说明',
				dataIndex : 'description'
			}, {
				header : '申请日期',
				dataIndex : 'finishDt'
			}, {
				header : '备注',
				dataIndex : 'remark'
			}/*,{
				header : '督办层级',
				dataIndex : 'level'
			}*/, {
				header : '申请部门',
				dataIndex : 'depName'
			},{
				header : '审批状态',
				dataIndex : 'runStatus',
				renderer:function(val,metadata, record){
				var applyState = record.data.runStatus;
				if(applyState == '1'){
					return '审批中';
				}else if(applyState == '2'){
					return '审批结束';
				}else if(applyState == '3'){
					return '终止';
				}
			}
			},{
				header : '管理',
				dataIndex : 'runId',
				renderer : manageRender
			}
			/*, {
				header : 'isDeleted',
				dataIndex : 'isDeleted'
			}
			, {
				header : 'processInsId',
				dataIndex : 'processInsId'
			}, {
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
			}*/
			, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				hidden:true,
				actions : [  {
					iconCls : 'btn-showDetail',
					qtip : '查看',
					style : 'margin:0 3px 0 3px'
				},  {
					 iconCls : 'btn-remind',
					 qtip : '催办',
					 xtype : 'button'
				}, {
					 iconCls : 'btn-stop',
					 qtip : '终止流程',
					 xtype : 'button'
					 }],
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
			new MonitorApplyForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		//new MonitorApplyForm().show();
		var defId = FlowDefIdPro.MonitorApplydefId;
		var flowName = FlowDefIdPro.MonitorApplyFlowName;
		MonitorApplyView.newFlow(defId,flowName);
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/admin/multiDelMonitorApply.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/admin/multiDelMonitorApply.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new MonitorApplyForm( {
			id : record.data.id
		}).show();
	},
	showProcess :function(record) {
		var runId = record.data.runId;
		var defId = record.data.defId;;
		var piId = record.data.piId;
		var subject = record.data.subject;
		MonitorApplyView.proDetail(runId, defId, piId, subject)
	},
	// 显示催办窗口
	showHasten : function(record) {
		new MonitorHastenForm( {
			id : record.data.id,
			topic : record.data.topic,
			finishDt:record.data.finishDt
		}).show();
	},
	stop : function(record) {
	var id=record.data.id;
	var piId = record.data.piId;
	//修改数据库的审核状态		
	Ext.Ajax.request({
		url : __ctxPath + '/flow/stopProcessRun.do',
		params:{
			'piId':piId
		},
		success : function(resp, options){
			Ext.ux.Toast.msg('操作信息','操作成功');		
			Ext.getCmp('MonitorApplyGrid').getStore().reload()
		},
		failure : function(response) {
				Ext.Msg.alert("提示", "终止失败！");
		}
	});		
		Ext.Ajax.request({
					url : __ctxPath + '/admin/updateApplyStateMonitorApply.do',
					params:{'monitorApply.id':id,
					'monitorApply.applyState':3,
					'monitorApply.updateBy':new Date().dateFormat('Y-m-d H:i:s')},
					method : 'POST',
					async : false,
					success : function(response, opts) {
						Ext.getCmp('MonitorApplyGrid').getStore().reload()
					},
					failure : function(response, opts) {
						
					}
				
				});
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
		case 'btn-flowView':
			this.showProcess.call(this, record);
			break;
		case 'btn-remind':
			this.showHasten.call(this, record);
			break;
		case 'btn-stop':
			this.stop.call(this, record);
			break;
		default:
			break;
		}
	}

});
MonitorApplyView.newFlow = function(defId, name) {

	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);

	if (startForm == null) {
		startForm = new ProcessRunStart({
					id : 'ProcessRunStart' + defId,
					defId : defId,
					flowName : name
				});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
};

// 查看
MonitorApplyView.editRs = function(editId) {
	new MonitorApplyForm( {
			id : editId
		}).show();
};

// 显示催办窗口
MonitorApplyView.showHasten =function(id,topic,finishDt) {
		new MonitorHastenForm( {
			id : id,
			topic : topic,
			finishDt:finishDt
		}).show();
	};
MonitorApplyView.stop = function(id,piId) {
	Ext.Msg.confirm('提示', '确定终止该流程？', function(btn, text){
	 if (btn == 'yes'){	    
	 	//修改数据库的审核状态		
	Ext.Ajax.request({
		url : __ctxPath + '/flow/stopProcessRun.do',
		params:{
			'piId':piId
		},
		success : function(resp, options){
			Ext.Ajax.request({
							url : __ctxPath + '/admin/updateApplyStateMonitorApply.do',
							params:{'monitorApply.id':id,'monitorApply.applyState':3},
							method : 'POST',
							async : false,
							success : function(response, opts) {},
							failure : function(response, opts) {
		
								
							}
						
						});
			Ext.ux.Toast.msg('操作信息','操作成功');		
			Ext.getCmp('MonitorApplyGrid').getStore().reload()
		},
		failure : function(response) {
				Ext.Msg.alert("提示", "终止失败！");
		}
	});		
		Ext.Ajax.request({
					url : __ctxPath + '/admin/updateApplyStateMonitorApply.do',
					params:{'monitorApply.id':id,
					'monitorApply.applyState':3,
					'monitorApply.updateBy':new Date().dateFormat('Y-m-d H:i:s')},
					method : 'POST',
					async : false,
					success : function(response, opts) {
						Ext.getCmp('MonitorApplyGrid').getStore().reload()
					},
					failure : function(response, opts) {
						
					}
				
				});
	 }
	});
	
		};

