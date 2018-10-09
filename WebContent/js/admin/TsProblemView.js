/**
 * @author:
 * @class TsProblemView
 * @extends Ext.Panel
 * @description [TsProblem]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
 
function TsProblemViewProcess(runId, defId, piId, subject) {	
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, subject);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
}

/*
 * 故障处理流程终止
 */
function stopTsProblemProcess(id, piId){	
	Ext.Msg.confirm('提示', '确定终止该流程？', function(btn, text){
	    if (btn == 'yes'){	        
			//终止流程		
			Ext.Ajax.request({
				url : __ctxPath + '/flow/stopProcessRun.do',
				params:{
					'piId':piId
				},
				success : function(resp, options){
					Ext.ux.Toast.msg('操作信息','操作成功');		
					Ext.getCmp('TsProblemGrid').getStore().reload();
				},
				failure : function(response) {
						Ext.Msg.alert("提示", "终止失败！");
				}
			});		
			//修改数据库的审核状态		
			Ext.Ajax.request({
				url : __ctxPath + '/admin/saveTsProblem.do',
				params:{
					'tsProblem.id':id,						
					'tsProblem.proStatus':3,
					'tsProblem.updateBy':new Date().dateFormat('Y-m-d H:i:s')
				},
				success : function(resp, options){
					Ext.getCmp('TsProblemGrid').getStore().reload();		
				}
			});
	    }
	});	
}

TsProblemView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				TsProblemView.superclass.constructor.call(this, {
							id : 'TsProblemView',
							title : '故障申请管理',
							region : 'center',
							layout : 'border',
							items : [this.searchPanel, this.gridPanel]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				
				
				var problemTypeStore = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
						 url: __ctxPath + '/admin/listTsProblemType.do'					
					}),
					idProperty : 'id',
					reader : new Ext.data.JsonReader({
						root : 'result',
						fields : ['proTypeName','id']
					}),
					remoteSort : true
				});
				problemTypeStore.load();
				
				this.applyStateRenderer = function(val, p, record){    	
//					if(val == 0){
//						return '未处理';
//					}else if(val == 1){
//						return '处理中';
//					}else if(val == 2){
//						return '已处理';
//					}else if(val == 3){
//						return '终止';
//					}else if(val == 4){
//						return '退回';
//					}
					if(val == 1){
						return '处理中';
					}else if(val == 2){
						return '处理完成';
					}else if(val == 3){
						return '终止';
					}
				};
				
				//管理
				this.managerRenderer = function(val, p, record){    	
					var reHtml = '<img src="images/btn/flow/view.png" style="cursor: pointer" onclick="TsProblemViewProcess('+ record.data.runId +','+ record.data.defId +',\''+ record.data.piId +'\',\''+ record.data.subject +'\')" qtip="查看流程" />';
										
					//if(record.data.proStatus == 0 || record.data.proStatus == 1){
					if(record.data.runStatus == 1){
						reHtml += '   <img src="images/menus/task/depplan.png" style="cursor: pointer" onclick="stopTsProblemProcess('+ record.data.id +',\''+ record.data.piId +'\')" qtip="终止流程" />';
					}
					
					return reHtml;
				};
				
				// 初始化搜索条件Panel
				this.searchPanel=new HT.SearchPanel({
							layout : 'form',
							region : 'north',
							colNums:1,
							items:[{
								xtype : 'container',
								layout : 'column',
								style : 'padding-left:0px;margin-bottom:4px;',
								items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '申请人:',
									width : 105
								},
										{
											xtype : 'textfield',
											name : 'tsProblemView.userName',
											id : 'tsProblemView.userName',
											editable : false,
											readOnly : true,
											width : 320
										},
										{
											xtype : 'button',
											iconCls : 'btn-user-sel',
											text : '选择人员',
											handler : function() {
												UserSelector
														.getView(
																function(id, name) {
																	Ext.getCmp('tsProblemView.userName').setValue(name);
																	Ext.getCmp('tsProblemView_applyUserId').setValue(id);
																},true,false).show();
											}
										},
										{
											xtype : 'button',
											text : '清除记录',
											iconCls : 'reset',
											handler : function() {
												Ext.getCmp('tsProblemView.userName').setValue('');
												Ext.getCmp('tsProblemView_applyUserId').setValue('');
											}
										} ]
							},{
									fieldLabel:'申请人',
									name : 'Q_appUser.userId_L_EQ',
									id : 'tsProblemView_applyUserId',
									xtype : 'hidden',
									flex:1
										}
											,{							
								xtype : "combo",
								name : "problemQ_proTypeId_L_EQ",
								id : "problemQ_proTypeId_L_EQ",
								fieldLabel : "故障类型",
								valueField : 'id',
								displayField : 'proTypeName',
								mode : 'local',
								editable : true,
								typeAhead : true,
								triggerAction : 'all',
								forceSelection : true,
								width : 240,
								//allowBlank : false,
								store : problemTypeStore,
								listeners : {
									select : function(cbo, record, index) {
										Ext.getCmp('problimQ_proTypeId_L_EQ').setValue(cbo.getValue());
									}
								}		
							}, {
								name : 'Q_tsProblemType.id_L_EQ',
								id : 'problimQ_proTypeId_L_EQ',
								xtype : 'hidden'
							},
															 							 																																					 								{
									fieldLabel:'departmentId',
									name : 'Q_appUser.department.depId_L_EQ',
									id : 'Q_departmentId_L_EQ',
									flex:1,xtype:'hidden'
																	}
																,{
																	xtype : 'radiogroup',
																	fieldLabel : '处理状态',
																	width : 270,
																	flex:1,
																	items : [{
																		boxLabel : '所有',
																		//name : 'Q_proStatus_SN_EQ',
																		name : 'Q_processRun.runStatus_SN_EQ',
																		inputValue : null,
																		checked : true
																		}
//																	,{
//																				boxLabel : '未处理',
//																				name : 'Q_proStatus_SN_EQ',
//																				inputValue : 0
//																			}
																		 ,{
																				boxLabel : '处理中',
																				name : 'Q_processRun.runStatus_SN_EQ',
																				inputValue : 1
																			}, {
																				//boxLabel : '已处理',
																				boxLabel : '处理完成',
																				name : 'Q_processRun.runStatus_SN_EQ',
																				inputValue : 2
																			}, {
																				boxLabel : '终止',
																				name : 'Q_processRun.runStatus_SN_EQ',
																				inputValue : 3
																			}
//																			, {
//																				boxLabel : '退回',
//																				name : 'Q_proStatus_SN_EQ',
//																				inputValue : 4
//																			}
																			]
																}
															 							 							 															],
								buttons:[
									{
										text:'查询',
										scope:this,
										iconCls:'btn-search',
										handler:this.search
									},{
										text:'重置',
										scope:this,
										iconCls:'btn-reset',
										handler:this.reset
									}							
								]	
				});// end of searchPanel

				this.topbar = new Ext.Toolbar({
						items : [{
									iconCls : 'btn-add',
									text : '添加',
									xtype : 'button',
									scope : this,
									handler : this.createRs
								}]
				});
	
				this.gridPanel=new HT.GridPanel({
					region:'center',
					tbar:this.topbar,
					//使用RowActions
					rowActions:true,
					id:'TsProblemGrid',
					url : __ctxPath + "/admin/listTsProblem.do",
					fields : [{
									name : 'id',
									type : 'int'
								}
								,{name:'fullname',mapping:'appUser.fullname'}
								,{name:'department',mapping:'appUser.department.depName'}
								,{name:'tsProblemTypeName',mapping:'tsProblemType.proTypeName'}
								,{name:'dealingUserName',mapping:'dealingAppUser ? obj.dealingAppUser.fullname : null'}
								,{name:'runId',mapping:'processRun ? obj.processRun.runId : null'}
								,{name:'defId',mapping:'processRun ? obj.processRun.proDefinition.defId : null'}
								,{name:'piId',mapping:'processRun ? obj.processRun.piId : null'}
								,{name:'subject',mapping:'processRun ? obj.processRun.subject : null'}
								,{name:'runStatus',mapping:'processRun.runStatus'}
								,'proTypeId'
								,'proPlace'
								,'proDesc'
								,'proStatus'
								,'dealingResult'
								,'processInstanceId'
								,'ref1'
								,'ref2'
								,'ref3'
								,'createDate'
								,'createBy'
								,'updateDate'
								,'updateBy'
																																			],
					columns:[
								{
									header : 'id',
									dataIndex : 'id',
									hidden : true
								}, {
																	header : '申请人',
																	dataIndex : 'createBy'
								}, {
																	header : '申请部门',
																	dataIndex : 'department'
								}, {
																	header : '故障类型',
																	dataIndex : 'tsProblemTypeName'
								}, {
																	header : '地点',
																	dataIndex : 'proPlace'
								} , {
																	header : '处理状态',
																	//dataIndex : 'proStatus',
																	dataIndex : 'runStatus',
																	renderer : this.applyStateRenderer
								}, {
																	header : '处理人员',
																	dataIndex : 'dealingUserName'
								}, {
																	header : '申请时间',
																	dataIndex : 'createDate'
								},{
									header : '管理',
									dataIndex : 'planId',
									renderer : this.managerRenderer
								}
																																								, new Ext.ux.grid.RowActions({
									header:'管理',
									width:100,
									hidden:true,
									actions:[
											{
											 iconCls:'btn-flowView',qtip:'查看',style:'margin:0 10px 0 10px'
										}
									],
									listeners:{
										scope:this,
										'action':this.onRowAction
									}
								})
					]//end of columns
				});
				
				//this.gridPanel.addListener('rowdblclick',this.rowClick);
					
			},// end of the initComponents()
			//重置查询表单
			reset : function(){
				this.searchPanel.getForm().reset();
			},
			//按条件搜索
			search : function() {
				$search({
					searchPanel:this.searchPanel,
					gridPanel:this.gridPanel
				});
			},
			//GridPanel行点击处理事件
			rowClick:function(grid,rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
					new TsProblemForm({id:rec.data.id}).show();
				});
			},
			//创建记录
			createRs : function() {
				//new TsProblemForm().show();
				TsProblemView.newFlow(FlowDefIdPro.TsProblemApplydefId, FlowDefIdPro.TsProblemApplyFlowName)
			},
			//按ID删除记录
			removeRs : function(id) {
				$postDel({
					url:__ctxPath+ '/admin/multiDelTsProblem.do',
					ids:id,
					grid:this.gridPanel
				});
			},
			//把选中ID删除
			removeSelRs : function() {
				$delGridRs({
					url:__ctxPath + '/admin/multiDelTsProblem.do',
					grid:this.gridPanel,
					idName:'id'
				});
			},
			//编辑Rs
			editRs : function(record) {
				new TsProblemForm({
					id : record.data.id
				}).show();
			},
			viewProcess :function(record) {
				var runId = record.data.runId;
				var defId = record.data.defId;;
				var piId = record.data.piId;
				var subject = record.data.subject;
				TsProblemView.proDetail(runId, defId, piId, subject)
			},
			//行的Action
			onRowAction : function(grid, record, action, row, col) {
				switch (action) {
					case 'btn-del' :
						this.removeRs.call(this,record.data.id);
						break;
					case 'btn-edit' :
						this.editRs.call(this,record);
						break;
					case 'btn-flowView' :
						this.viewProcess.call(this,record);
						break;
					default :
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
TsProblemView.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};

/**
 * 新建流程
 * 
 * @param {}
 *            defId
 * @param {}
 *            name
 */
TsProblemView.newFlow = function(defId, name) {

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
