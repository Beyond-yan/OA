/**
 * @author : Donald Su
 * @class : OutResearchApplyView
 * @extends : Ext.Panel
 * @description : 调研申请管理
 * @company : 深圳捷达世软件有限公司
 * @createtime : 2011-06-04
 */
function rowMgmtRenderer(val, p, record){
	// 查看申请明细
	var reHtml = '<img src="images/btn/showDetail.png" style="cursor: pointer" onclick="showOutResearchApplyDetail('+ record.data.id +')" qtip="查看申请明细" />';
	// 查看流程状态
	reHtml += '   <img src="images/btn/flow/view.png" style="cursor: pointer" onclick="viewOutResearchApplyProcess('+ record.data.runId +','+ record.data.defId +',\''+ record.data.piId +'\',\''+ record.data.subject +'\')" qtip="查看流程状态" />';
	// 终止流程
	//if(record.data.applyState == 1){
	if((record.data.runStatus !=2 )&& (record.data.runStatus!=3)){
		reHtml += '   <img src="images/menus/task/depplan.png" style="cursor: pointer" onclick="stopOutResearchApplyProcess('+ record.data.id +',\''+ record.data.piId +'\')" qtip="终止流程" />';
	}
	return reHtml;
};

// 查看申请明细
function showOutResearchApplyDetail(id) {
	new OutResearchDetailForm({
		outResearchApplyId : id
	}).show();
};

// 查看流程状态
function viewOutResearchApplyProcess(runId, defId, piId, subject) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, subject);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};

// 终止流程
function stopOutResearchApplyProcess(id, piId){	
	Ext.Msg.confirm('提示', '确定终止该流程？', function(btn, text){
	    if (btn == 'yes'){
			// 终止流程		
			Ext.Ajax.request({
				url : __ctxPath + '/flow/stopProcessRun.do',
				params:{
					piId : piId
				},
				success : function(resp, options){
					Ext.ux.Toast.msg('操作信息','操作成功');
				},
				failure : function(response) {
					Ext.Msg.alert("提示", "终止失败！");
				}
			});
			
			// 修改数据库的审批状态
			Ext.Ajax.request({
				url : __ctxPath + '/admin/saveOutResearchApply.do',
				params:{
					'outResearchApply.id' : id,
					'outResearchApply.applyState' : 4,
					// 避免空指针异常
					'outResearchApply.isChangedApplicant' : 0,
					'outResearchApply.isChangedParticipant' : 0
				},
				success : function(resp, options){
					Ext.getCmp('OutResearchApplyGridPanel').getStore().reload();		
				}
			});
	    }
	});	
};

Ext.ns('OutResearchApplyView');
OutResearchApplyView = Ext.extend(Ext.Panel, {
	
	// 构造函数 - 开始
	constructor : function(_cfg) {
	
		Ext.applyIf(this, _cfg);
		
		this.initUIComponents();
		
		OutResearchApplyView.superclass.constructor.call(this, {
			id : 'OutResearchApplyView',
			title : '调研申请管理',
			region : 'center',
			layout : 'border',
			items : [this.searchPanel, this.gridPanel]
		});
		
	},// 构造函数 - 结束

	// 初始化界面控件 - 开始
	initUIComponents : function() {
		
		// 取得外出调研申请流程的defId
		var outResearchApplyDefId = FlowDefIdPro.OutResearchApplyDefId;
		
		this.applyStateRenderer = function(val, p, record){
			if(val == 1){
				return '审批中';
			}
			else if(val == 2){
				return '审批通过';
			}
			else if(val == 3){
				return '流程终止';
				//return '重新申请';
			}
			/*else if(val == 4){
				return '流程终止';
			}*/
		};
		
		// Part1：查询表单部分
		this.searchPanel = new HT.SearchPanel({
			id : 'OutResearchApplySearchForm',
			region : 'north',
			width : '100%',
			height : 300,
			frame : true,
			layout : 'form',
			items : [
			    {
			    	layout : 'column',
			    	height : 30,
			    	items : [
			    	    {
			    	    	xtype : 'label',
			    	    	text : '调研主题：',
			    	    	width : 60
			    	    },
			    	    {
			    	    	xtype : 'textfield',
			    	    	id : 'OutResearchApplyView.topic',
							name : 'Q_topic_S_LK',
							width : '150',
							maxLength : 100,
							maxLengthText : '调研主题不能超过100个字符长度！'
			    	    },
			    	    {
							xtype : 'label',
			    	    	text : '调研日期：',
			    	    	width : 60,
			    	    	style : 'margin:0 0 0 20px'
			    	    },
			    	    {
			    	    	xtype : 'datetimefield',
							id : 'OutResearchApplyView.researchSDt',
							name : 'Q_researchSDt_D_GE',
							format : 'Y-m-d',
							width : 100,
							border : false
			    	    },
			    	    {
							xtype : 'label',
			    	    	text : '~',
			    	    	width : 25,
			    	    	style : 'text-align:center'
			    	    },
			    	    {
			    	    	xtype : 'datetimefield',
							id : 'OutResearchApplyView.researchEDt',
							name : 'Q_researchEDt_DG_LE',
							format : 'Y-m-d',
							width : 100,
							border : false
			    	    },
			    	    {
							xtype : 'label',
			    	    	text : '调研地点：',
			    	    	width : 60,
			    	    	style : 'margin:0 0 0 20px'
			    	    },
			    	    {
			    	    	xtype : 'textfield',
			    	    	id : 'OutResearchApplyView.site',
							name : 'Q_site_S_LK',
							width : '150',
							maxLength : 100,
							maxLengthText : '调研地点不能超过100个字符长度！'
			    	    },
			    	    {
							xtype : 'label',
			    	    	text : '审批状态：',
			    	    	width : 60,
			    	    	style : 'margin:0 0 0 20px'
			    	    },
			    	    {
			    	    	xtype : 'combo',
			    	    	id : 'OutResearchApplyView.applyState',
			    	    	//hiddenName : 'Q_applyState_SN_EQ',
			    	    	hiddenName : 'Q_processRun.runStatus_SN_EQ',
			    	    	width : 130,
							editable : false,
							mode : 'local',
							triggerAction : 'all',
							emptyText : '--请选择审批状态--',
							//store : [ [ '1', '审批中' ], [ '2', '审批通过' ], [ '3', '重新申请' ], [ '4', '流程终止' ] ]
							store : [ [ '1', '审批中' ], [ '2', '审批通过' ], [ '3', '流程终止' ]]

			    	    }
			    	]
			    }
		    ],
		    buttons : [
				{
					text : '查询',
					scope:this,
					iconCls : 'btn-search',
					handler : this.search.createCallback(this)
				},{
					text : '重置',
					scope:this,
					iconCls : 'btn-reset',
					style : 'margin:0 0 0 10px',
					handler : this.reset
				}							
			]
		});
		
		// Part2：Toolbar部分
		this.topbar = new Ext.Toolbar({
			id : 'OutResearchApplyTopBar',
			height : 30,
			bodyStyle : 'text-align:right',
			menuAlign : 'center'
		});
		
		this.topbar.add(new Ext.Button( {
			iconCls : 'btn-add',
			text : '添加',
		/*	handler : function() {
				new OutResearchApplyWinForm(
					{defId : outResearchApplyDefId}
				).show();
			}*/
			handler : function() {
				var defId = FlowDefIdPro.OutResearchApplyDefId;
				var flowName = FlowDefIdPro.OutResearchApplyDefName;							
				OutResearchApplyView.newFlow(defId, flowName);			
			}			
		}));
		
		/*this.topbar.add(new Ext.Button( {
			iconCls : 'btn-del',
			text : '终止申请流程',
			handler : function() {
			alert("终止申请流程");
				var grid = Ext.getCmp("BoardrooGrid");
				var selectRecords = grid.getSelectionModel().getSelections();
				if (selectRecords.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var ids = new Array();
				for ( var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.roomId);
				}
				BoardrooView.remove(ids);
			}
		}));*/
		
		// Part3：查询结果列表部分
		// 栏位架构部分
		this.rowActions = new Ext.ux.grid.RowActions({
			header : '管理',
			width : 80,
			actions : [ 
	            {
					iconCls : 'btn-del',
					qtip : '终止',
					style : 'margin:0 3px 0 3px'
				},
				{
					iconCls : 'btn-showDetail',
					qtip : '查看申请明细',
					style : 'margin:0 3px 0 3px'
				},
				{
					iconCls : 'btn-flowView',
					qtip : '查看流程状态',
					style : 'margin:0 3px 0 3px'
				}
			]
		});
		
		var sm = new Ext.grid.CheckboxSelectionModel();
		
		var cm = new Ext.grid.ColumnModel({
			columns : [ sm, new Ext.grid.RowNumberer(),
				{
					header : 'id',
					dataIndex : 'id',
					hidden : true
				},
				{
					header : '调研主题',
					dataIndex : 'topic'
				},
				{
					header : '调研地点',
					dataIndex : 'site'
				},
				{
					header : '开始时间',
					dataIndex : 'researchSDt',
					width:120
				},
				{
					header : '结束时间',
					dataIndex : 'researchEDt',
					width:120
				},
				{
					header : '费用总额(RMB)',
					dataIndex : 'feeAmount'
				},
				{
					header : '审批状态',
					//dataIndex : 'applyState',
					dataIndex : 'runStatus',					
					renderer : this.applyStateRenderer
				},
				/*this.rowActions*/
				{
					header : '管理',
					dataIndex : 'runId',
					renderer : rowMgmtRenderer
				}
			],
			defaults : {
				sortable : true,
				menuDisabled : true,
				width : 100
			}
		});
		
		// Grid内容部分
		this.store = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy( {
				url : __ctxPath + '/admin/listOutResearchApply.do'
			}),
			reader : new Ext.data.JsonReader( {
				root : 'result',
				idProperty : id,
				totalProperty : 'totalCounts',
				fields : [
				    {
						name : 'id',
						type : 'int'
					},
					{name:'runId',mapping:'processRun ? obj.processRun.runId : null'},
					{name:'defId',mapping:'processRun ? obj.processRun.proDefinition.defId : null'},
					{name:'piId',mapping:'processRun ? obj.processRun.piId : null'},
					{name:'subject',mapping:'processRun ? obj.processRun.subject : null'},
					'topic','site', 'researchSDt', 'researchEDt','feeAmount','applyState',
					{name:'runStatus',mapping:'processRun ? obj.processRun.runStatus : null'}
				]
			}),
			remoteSort : false
		});
		
		this.store.setDefaultSort('id', 'DESC');
		
		this.store.load( {
			params : {
				start : 0,
				limit : 25
			}
		});
		
		// 产生Grid部分
		this.gridPanel = new HT.GridPanel( {
			id : 'OutResearchApplyGridPanel',
			tbar : this.topbar,
			region : 'center',
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
			}
		});
		
		// 添加管理(删除、编辑)功能的操作
		this.rowActions.on('action', this.onRowAction, this);
		
		// 添加Grid列表双击功能
		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
			grid.getSelectionModel().each(function(rec) {
				new OutResearchDetailForm({
					outResearchApplyId : rec.data.id
				}).show();
			});
		});
				
	},// 初始化界面控件 - 结束
	
	// 按条件搜索
	search : function(self) {
		
		// 判断日期时间的正确性
		var fm = Ext.getCmp('OutResearchApplySearchForm');
		var nowDate = new Date();
		if(fm.getCmpByName('Q_researchSDt_D_GE').getValue() != '' && fm.getCmpByName('Q_researchEDt_DG_LE').getValue() != '') {
			if (fm.getCmpByName('Q_researchSDt_D_GE').getValue() > fm.getCmpByName('Q_researchEDt_DG_LE').getValue()) {
				Ext.ux.Toast.msg('操作信息', '调研开始日期不可大於调研结束日期！');
				fm.getCmpByName('Q_researchSDt_D_GE').focus(true);
				return;
			}
		}
		
		if (self.searchPanel.getForm().isValid()) {
			self.searchPanel.getForm().submit({
				url : __ctxPath + '/admin/listOutResearchApply.do',
				method : 'post',
				waitMsg : '数据正在提交，请稍后...',
				success : function(fm, action) {
					var result = Ext.util.JSON.decode(action.response.responseText);
					self.gridPanel.getStore().loadData(result);
				},
				failure : function() {
					Ext.ux.Toast.msg('操作提示', '对不起，数据提交失败！');
				}
			});
		}
		
	},
	
	// 重置查询表单
	reset : function() {
		
		Ext.getCmp('OutResearchApplySearchForm').getForm().reset();
		
	}/*,
	
	// 行管理(删除、编辑)功能的Action
	onRowAction : function(gridPanel, record, action, row, col) {
		
		switch (action) {
			case 'btn-del':
				alert("终止"+record.data.id);
				//this.removeRs.call(this, record.data.id);
				break;
			case 'btn-showDetail':
				this.showDetail(record);
				break;
			case 'btn-flowView' :
				this.viewProcess.call(this,record);
				break;
			default:
				break;
		}
		
	},
	showDetail : function(record) {
		
		new OutResearchDetailForm({
			outResearchApplyId : record.data.id
		}).show();

	},
	
	viewProcess : function(record) {
		
		var runId = record.data.runId;
		var defId = record.data.defId;;
		var piId = record.data.piId;
		var subject = record.data.subject;
		OutResearchApplyView.proDetail(runId, defId, piId, subject)
		
	}*/
	
});

/*OutResearchApplyView.proDetail = function(runId, defId, piId, name) {
	
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
	
};*/


/**
 * 新建流程
 * 
 * @param {}
 *            defId
 * @param {}
 *            name
 */
OutResearchApplyView.newFlow = function(defId, name) {
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