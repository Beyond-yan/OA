/**
 * @author
 * @createtime
 * @class ProcessReportForm
 * @extends Ext.Window
 * @description ProcessReport表单
 * @company 捷达世软件
 */
// var ProcessRunDetail=function(runId,defId,piId,name){
// this.runId=runId;
// this.defId=defId;
// this.piId=piId;
// //this.piId=(piId=='null' || piId==null)? null :piId;
// this.name=name;
// return this.setup();
// };
//
// ProcessRunDetail.prototype.setup=function(){
// var piId=this.piId;
// var defId=this.defId;
// var leftPanel=new Ext.Panel({
// title:'流程示意图',
// width:500,
// autoScroll:true,
// height:800,
// split:true,
// collapsible: true,
// /*collapsed:true,*/
// region:'west',
// margin:'5 5 5 5',
// html:'<img src="'+__ctxPath+
// '/jbpmImage?piId='+piId+'&defId='+defId+'&rand='+ Math.random()+'"/>'
// });
// 	
// var rightPanel=this.getRightPanel(this.piId,this.runId);
// 	
// var toolbar=new Ext.Toolbar({
// height:28,
// items:[
// {
// text:'刷新',
// iconCls:'btn-refresh',
// handler:function(){
// leftPanel.body.update('<img src="'+__ctxPath+
// '/jbpmImage?piId='+piId+'&defId='+defId+'&rand='+ Math.random()+'"/>');
// rightPanel.doAutoLoad();
// }
// }
// ]
// });
// 	
// var topPanel=new Ext.Panel({
// id:'ProcessRunDetail'+this.runId,
// title:'流程详细－'+this.name,
// iconCls:'menu-flowEnd',
// layout:'border',
// tbar:toolbar,
// autoScroll:true,
// items:[
// leftPanel,rightPanel
// ]
// });
// return topPanel;
// };
//
// ProcessRunDetail.prototype.getRightPanel=function(piId,runId){
// var panel=new Ext.Panel({
// title:'流程审批信息',
// region:'center',
// width:400,
// autoScroll:true,
// autoLoad:{
// url:__ctxPath+'/flow/processRunDetail.do?piId='+piId + "&runId="+ runId
// }
// });
// return panel;
// };
// *****************************************************************************************
ProcessReportForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ProcessReportForm.superclass.constructor.call(this, {
			id : 'ProcessReportFormWin',
			layout : 'fit',
			items : this.tabForm,
			modal : true,
			height : 550,
			width : 700,
			autoScroll : true,
			maximizable : true,
			title : '流程审批信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '关闭',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		


		// 审批信Panel begin (包括发文审批信息和收文审批信息默认只有发文审批)
		this.tabForm = new Ext.TabPanel( {
			width : 450,
			activeTab : 0,
			frame : true,
			autoHeight:true,
			//height:200,
			autoScroll : true,
			/*html: '<iframe scrolling="yes" height="200" src="'+  __ctxPath + '/flow/processRunDetail.do?piId='
							+ this.piid + "&runId=" + this.runid + "&random="
							+ Math.random() +'">'*/
			items : [ {
				title : '发文审批信息',
				autoLoad : {
					url : __ctxPath + '/flow/processRunDetail.do?piId='
							+ this.piid + "&runId=" + this.runid + "&random="
							+ Math.random()
				},callback: function(){
					Ext.getCmp('ProcessReportFormWin').add(this.tabForm);
					Ext.getCmp('ProcessReportFormWin').doLayout(true);
				}
				
			} ]
		});
		// 审批信Panel end

		// 注意：只有满足如下条件的流程（即有收文的流程）才需加入收文审批信息panel
		if (this.defid == FlowDefIdPro.FileHuiQianId_V1
				|| this.defid == FlowDefIdPro.FilePingShenId_V1
				|| this.defid == FlowDefIdPro.InnerWorkConnId_V1
				|| this.defid == FlowDefIdPro.RedHeadIdNFW_V1
				|| this.defid == FlowDefIdPro.ArchivesReceiveOutsideId_V1
				|| this.defid == FlowDefIdPro.RedHeadIdHYJY_V1
				|| this.defid == FlowDefIdPro.RedHeadId
				|| this.defid == FlowDefIdPro.InnerWorkConnId
				|| this.defid == FlowDefIdPro.FileHuiQianId
				|| this.defid == FlowDefIdPro.FilePingShenId
				|| this.defid == FlowDefIdPro.ArchivesReceiveOutsideId
				) {
			// 收文审批信息数据源 begin
			var b = new Ext.data.Store( {
				proxy : new Ext.data.HttpProxy( {
					url : __ctxPath + '/flow/listReceiveProcessRunDetail.do?piId='
							+ this.piid + "&runId=" + this.runid
				}),
				reader : new Ext.data.JsonReader( {
					root : "result",
					totalProperty : "totalCounts",
					id : "id",
					fields : [ "recDepName", "status", "nextPerson", "taskName",
							"detail" ]
				}),
				remoteSort : true
			});
			b.load( {
				params : {
					start : 0,
					limit : 25
				}
			});

			// 定义收文审批详细信息扩展组件 begin
			var e = new Ext.ux.grid.RowExpander( {
				tpl : new Ext.Template('{detail}')
			});
			// 定义收文审批详细信息扩展组件 end

			// 收文审批信息grid begin
			var d = new Ext.grid.CheckboxSelectionModel();
			var a = new Ext.grid.ColumnModel( {
				columns : [ new Ext.grid.RowNumberer(), e, {
					header : "收文部门名称",
					dataIndex : "recDepName",
					width : 100
				}, {
					header : "状态",
					dataIndex : "status",
					width : 100,
					renderer : function(f) {
						return f.substring(0, 10);
					}
				}, {
					header : "下一步执行人",
					dataIndex : "nextPerson",
					width : 100
				}, {
					header : "任务名称",
					dataIndex : "taskName",
					width : 150
				} ],
				defaults : {
					sortable : true,
					menuDisabled : false,
					width : 100
				}
			});

			var c = new Ext.grid.GridPanel( {
				id : "ReceiveDetailGrid",
				store : b,
				autoScroll :true,
				trackMouseOver : true,
				disableSelection : false,
				loadMask : true,
				height : 450,
				plugins : e,
				region : "center",
				cm : a,
				sm : d,
				viewConfig : {
					forceFit : true,
					enableRowBody : false,
					showPreview : false
				},
				bbar : new HT.PagingBar( {
					store : b
				})
			});
			// 收文审批信息grid end
			// 收文审批信息数据源 end
			this.tabForm.add( {
				title : "收文审批信息",
				items : [ c ]
			});
		}

		/*
		 * this.tabForm = new Ext.FormPanel({ id: 'vehicles-form', frame: true,
		 * labelAlign: 'left', bodyStyle:'padding:5px', width: 900, layout:
		 * 'column', // Specifies that the items will now be arranged in columns
		 * height:300,
		 * 
		 * items:[{ layout:'form', bodyStyle:'padding-bottom:5px', items: [{
		 * xtype:'tabpanel', activeTab: 0, defaults:{ autoHeight:true,
		 * bodyStyle:'padding:10px'}, items:[this.formPanel] } ] }]
		 * 
		 * });//form结束
		 */},// end of the initcomponents

	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function() {
		this.close();
	}

});