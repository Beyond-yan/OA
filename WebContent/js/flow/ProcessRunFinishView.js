Ext.ns('ProcessRunFinishView');
/**
 * 我的任务流程 
 */
ProcessRunFinishView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	searchPanel:null,
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
		ProcessRunFinishView.superclass.constructor.call(this, {
					id : 'ProcessRunFinishView',
					title : '已完成的电子申请单',
					iconCls:'menu-flowEnd',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel,this.gridPanel]
				});
	},// end of constructor

	// 初始化组件
	initUIComponents : function() {
		this.searchPanel=new HT.SearchPanel({
							layout : 'form',
							region : 'north',
							id:'ProcessRunFinishSearchForm',
							colNums:1,
							items:[{
								xtype : 'container',
								layout : 'column',
								style : 'padding-left:0px;margin-bottom:4px;',
								items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '流程名称:',
									width : 70
								},{								
									hiddenName : 'proTypeId',
									width : 150,
									xtype : 'combo',
									// xtype : 'numberfield',
									mode : 'local',
									editable : false,
									triggerAction : 'all',
									displayField : 'name',
									valueField : 'defId',
									store : new Ext.data.SimpleStore(
									{
										autoLoad : true,
										url : __ctxPath + '/flow/comProDefinition.do',
										fields : [ 'defId','name' ]
										           }
									   )
								},{
									xtype : 'label',
									style : 'padding-left:20px;',
									text : '标题:',
									width : 60
								},{
									xtype : 'textfield',
									name : 'Q_subject_S_LK'
								},{
									xtype : 'label',
									style : 'padding-left:20px;',
									text : '时间:',
									width : 60
								},{xtype:'datefield',name:'from',format:'Y-m-d',width : 130},
								{
									xtype : 'label',
									style : 'padding-left:3px;',
									text : '至',
									width : 20
								},{xtype:'datefield',name:'to',format:'Y-m-d',width : 130},
								{
									xtype : 'button',
									text : '查询',
									iconCls : 'search',
									style : 'padding-left:50px;',
									handler : function() {
										var searchPanel = Ext.getCmp('ProcessRunFinishSearchForm');
										var gridPanel = Ext.getCmp('ProcessRunFinishGrid');
										if (searchPanel.getForm().isValid()) {
											$search({
												searchPanel : searchPanel,
												gridPanel : gridPanel
											});
										}
									}
								},{
									xtype : 'button',
									style : 'padding-left:10px;',
									text : '重置',
									iconCls : 'btn-reset',
									handler : function() {
										Ext.getCmp('ProcessRunFinishSearchForm').getForm().reset();
									}
								}]
							}]
		});// end of searchPanel
				
		// 加载数据至store
		this.store = new Ext.data.Store({  
	       proxy : new Ext.data.HttpProxy({
						url : __ctxPath + '/flow/listProcessRun.do?Q_runStatus_SN_EQ=2'
					}),
			reader : new Ext.data.JsonReader({
						root : 'result',
						totalProperty : 'totalCounts',
						id : 'id',
						fields : [{
									name : 'runId',
									type : 'int'
								}, 'subject','createtime',
								'defId', 'piId','runStatus','proDefName']
					}),
			remoteSort : true
	    });  
	    this.store.setDefaultSort('runId', 'desc');
		// 加载数据
		this.store.load({
					params : {
						start : 0,
						limit : 25
					}
				});

		var ProRunMap = new Map();
		//文件会签
		ProRunMap.put(FlowDefIdPro.FileHuiQianId,'/report/archivesFileHuiQianReport.do');
		
		//经营班子会及材料审批
		ProRunMap.put(FlowDefIdPro.JingYingBanZiHuiId,'/report/archivesJingYingBanZiHuiReport.do');
		
		//内部工作联系单
		ProRunMap.put(FlowDefIdPro.InnerWorkConnId,'/report/archivesInnerWorkConnReport.do');
		
		//内部工作联系单收文
		ProRunMap.put(FlowDefIdPro.InnerWorkConnReceiveId,'/report/archivesInnerWorkReceiveConnReport.do');
		//文本评审
		ProRunMap.put(FlowDefIdPro.FilePingShenId,'/report/archivesDocumentReviewReport.do');
		
		
		//运营公司外收文
		ProRunMap.put(FlowDefIdPro.ArchivesReceiveOutsideId,'/report/archivesReceiveOutsideReport.do');
		
		//红头文件
		ProRunMap.put(FlowDefIdPro.RedHeadId,'/report/archivesRedHeadReport.do');
		//运营公司发总公司文(请示)
		ProRunMap.put(FlowDefIdPro.ReportToConComId,'/report/archivesRedHeadQingShiReport.do');
		
		//运营公司对总公司发文(工作联系单)
		ProRunMap.put(FlowDefIdPro.OuterWorkConnId,'/report/archivesWorkConnReport.do');
		
		//-------------------------------------------------------V1.0---------------------------------------------------------------
		//文件会签单-发文V1.0
		ProRunMap.put(FlowDefIdPro.FileHuiQianId_V1,'/report/archivesFileHuiQianV1Report.do');
		//文本评审单-发文V1.0
		ProRunMap.put(FlowDefIdPro.FilePingShenId_V1,'/report/archivesDocumentReviewV1Report.do');
		//红头文件-会议纪要_V1.0
		ProRunMap.put(FlowDefIdPro.RedHeadIdHYJY_V1,'/report/archivesRedHeadHYJYReport.do');
		//红头文件-运营公司内发文_V1.0
		ProRunMap.put(FlowDefIdPro.RedHeadIdNFW_V1,'/report/archivesRedHeadNFWReport.do');
		//红头文件-请示_V1.0
		ProRunMap.put(FlowDefIdPro.RedHeadIdQS_V1,'/report/archivesRedHeadQSReport.do');
		//红头文件-运营公司外发文__V1.0
		ProRunMap.put(FlowDefIdPro.RedHeadIdWFW_V1,'/report/archivesRedHeadWFWReport.do');
		//报运营会议材料审批_V1.0
		ProRunMap.put(FlowDefIdPro.JingYingBanZiHuiId_V1,'/report/archivesJingYingBanZiHuiV1Report.do');
		//运营公司报总公司上会材料审批_V1.0
		ProRunMap.put(FlowDefIdPro.YyToCenterCompanyId_V1,'/report/archivesYyToCenterCompanyV1Report.do');
		//内部工作联系单-发文V1.0
		ProRunMap.put(FlowDefIdPro.InnerWorkConnId_V1,'/report/archivesInnerWorkConnReport.do');
		//内部工作联系单-收文V1.0
		ProRunMap.put(FlowDefIdPro.InnerWorkConnReceiveId_V1,'/report/archivesInnerWorkReceiveConnReport.do');
		//运营公司对外单位工作联系单_V1.0
		ProRunMap.put(FlowDefIdPro.OuterWorkConnId_V1,'/report/archivesWorkConnV1Report.do');	
		//运营公司外收文_V1.0
		ProRunMap.put(FlowDefIdPro.ArchivesReceiveOutsideId_V1,'/report/archivesReceiveOutsideReport.do');
		
		// 初始化ColumnModel
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'runId',
						dataIndex : 'runId',
						hidden : true
					}, {
						header:'流程名称',
						dataIndex:'proDefName',
						width:60
					},{
						header : '标题',
						dataIndex : 'subject'
					},{
						header : '时间',
						sortable:false,
						dataIndex : 'createtime',
						width:60
					},{
						header : '管理',
						sortable:false,
						dataIndex : 'runId',
						width : 50,
						renderer : function(value, metadata, record, rowIndex,colIndex) {
							var runId = record.data.runId;
							var defId=record.data.defId;
							var piId=record.data.piId;
							var subject=record.data.subject;
							var str = '<a href="#"  onclick="ProcessRunFinishView.detail('+
								runId+','+defId+',\''+ piId + '\',\''+ subject + '\')">审批明细</a>&nbsp;&nbsp;';
							var postUrl = ProRunMap.get(defId);
							if (postUrl != "" && postUrl != undefined) {
								str += '<a href="' + __ctxPath +postUrl+'?runId='+runId+'" target="_blank">打印</a>';
							}
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'ProcessRunFinishGrid',
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
					viewConfig : {
						forceFit : true,
						autoFill : true, // 自动填充
						forceFit : true
						// showPreview : false
					},
					bbar : new HT.PagingBar({
								store : this.store
							})
				});
				
		this.gridPanel.addListener('rowdblclick', function(gridPanel,
						rowindex, e) {
					gridPanel.getSelectionModel().each(function(rec) {
							ProcessRunFinishView.detail(rec.data.runId,rec.data.defId,rec.data.piId,rec.data.subject);
					});
			});

	}

});

/**
 * 显示明细
 * @param {} runId
 * @param {} name
 */
ProcessRunFinishView.detail=function(runId,defId,piId,name){
	var contentPanel=App.getContentPanel();
	var detailView=contentPanel.getItem('ProcessRunDetail'+runId);
	
	if(detailView==null){
		detailView=new ProcessRunDetail(runId,defId,piId,name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};