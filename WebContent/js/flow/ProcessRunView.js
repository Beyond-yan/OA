Ext.ns('ProcessRunView');
/**
 * 我的任务流程 
 */
ProcessRunView = Ext.extend(Ext.Panel, {
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
		ProcessRunView.superclass.constructor.call(this, {
					id : 'ProcessRunView',
					title : '我申请的电子申请单',
					iconCls:'menu-flowMine',
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
							id:'ProcessRunSearchForm',
							colNums:1,
							items:[{
								xtype : 'container',
								layout : 'column',
								style : 'padding-left:0px;margin-bottom:4px;',
								items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '流程名称:',
									width : 80
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
									width : 80
								},{
									xtype : 'textfield',
									name : 'Q_subject_S_LK'
								},{
									xtype : 'label',
									style : 'padding-left:30px;',
									text : '时间:',
									width : 80
								},{xtype:'datefield',name:'Q_createtime_D_GT',format:'Y-m-d',width : 130},
								{
									xtype : 'label',
									style : 'padding-left:5px;',
									text : '至',
									width : 20
								},{xtype:'datefield',name:'Q_createtime_D_LT',format:'Y-m-d',width : 130}]
							},{
								xtype : 'container',
								layout : 'column',
								style : 'padding-left:0px;margin-bottom:4px;',
								items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '状态:',
									width : 80
								},{									
								   	xtype:'combo',
								   	width:150,
								   	hiddenName:'Q_runStatus_SN_EQ',
								   	editable:false,
								   	mode:'local',
								   	triggerAction : 'all',
								   	store :[['1','正在运行'],['2','结束']]							   	
								},
								{
									xtype : 'button',
									text : '查询',
									iconCls : 'search',
									style : 'padding-left:80px;',
									handler : function() {
										var searchPanel = Ext.getCmp('ProcessRunSearchForm');
										var gridPanel = Ext.getCmp('ProcessRunGrid');
										if (searchPanel.getForm().isValid()) {
											$search({
												searchPanel :searchPanel,
												gridPanel : gridPanel
											});
										}
			
									}
								}]
							}]
		});// end of searchPanel
				
		// 加载数据至store
		this.store = new Ext.data.Store({  
	       proxy : new Ext.data.HttpProxy({
						url : __ctxPath + '/flow/listProcessRun.do'
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
					},  {
						header:'流程状态',
						dataIndex:'runStatus',
						width:60,
						renderer:function(val){
							if(val==0){
								return '<font color="red">草稿</font>';
							}else if(val==1){
								return '<font color="green">正在运行</font>';
							}else if(val==2){
								return '<font color="gray">结束</font>';
							}else if(val==3){
								return '<font color="red">已终止</font>';
							}
						}
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
							var runStatus=record.data.runStatus
							var str="";
							//runId,defId,piId,name
							if(piId!=null && piId!=undefined && piId!=''){		
								str += '&nbsp;<a  href="#"  value=" "  onclick="ProcessRunView.detail('+
								runId+','+defId+',\''+ piId + '\',\''+ subject + '\')">审批明细</a>';
							}
							if(runStatus!=2 && runStatus!=3){
								if(piId!=null && piId!=undefined && piId!=''){		
									str += '&nbsp;<a href="#"  onclick="ProcessRunView.stop(\''+ piId + '\')">终止</a>';
								}
							}
							
							//若流程尚未结束，可进行编辑,及删除
							if(runStatus==0){
								str+='&nbsp;<button title="编辑" class="btn-edit" onclick="ProcessRunView.edit('+runId+',\''+subject+'\')"></button>';
								str+= '&nbsp;<button title="删除" value=" " class="btn-del" onclick="ProcessRunView.remove('+ runId + ')"></button>';
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
					id : 'ProcessRunGrid',
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
							ProcessRunView.detail(rec.data.runId,rec.data.defId,rec.data.piId,rec.data.subject);
					});
			});

	}

});

/**
 * 删除单个记录
 */
ProcessRunView.remove = function(id) {
	var grid = Ext.getCmp("ProcessRunGrid");
	Ext.Msg.confirm('信息确认', '您确认要删除该记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
								url : __ctxPath + '/flow/multiDelProcessRun.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
									grid.getStore().reload({params : {start : 0,limit : 25}});
								}
							});
				}
			});
};

/**
 * 
 */
ProcessRunView.edit = function(runId,name) {
	var contentPanel=App.getContentPanel();
	var startForm=contentPanel.getItem('ProcessRunStart'+runId);
	if(startForm==null){
		startForm=new ProcessRunStart(null,name,runId);
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
}
/**
 * 显示明细
 * @param {} runId
 * @param {} name
 */
ProcessRunView.detail=function(runId,defId,piId,name){
	var contentPanel=App.getContentPanel();
	var detailView=contentPanel.getItem('ProcessRunDetail'+runId);
	
	if(detailView==null){
		detailView=new ProcessRunDetail(runId,defId,piId,name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};

/**
 * 终止流程
 * @param {} runId
 * @param {} name
 */
ProcessRunView.stop=function(piId){
	var grid = Ext.getCmp("ProcessRunGrid");
	Ext.Msg.confirm('信息确认', '您确认要终止该流程吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath + '/flow/stopProcessRun.do',
				params : {
					piId : piId
				},
				method : 'post',
				success : function() {
					Ext.ux.Toast.msg("信息提示", "成功终止流程！");
					grid.getStore().reload({params : {start : 0,limit : 25}});
				}
			});
		}
	});
};