/**
 * @author:
 * @class SuperviseTaskReportView
 * @extends Ext.Panel
 * @description SuperviseTaskReportView
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SuperviseTaskReportView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		SuperviseTaskReportView.superclass.constructor.call(this, {
					id : 'SuperviseTaskReportView',
					title : '督办任务分解报表',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel,this.report_ExcelPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		
		this.report_ExcelPanel = new Ext.Panel({
					height : 500,
					id : 'SuperviseTaskReportView_report_ExcelPanel',
					region : 'center',
					xtype:'hidden',
					html : '',
					autoScroll : true
				});
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
					layout : 'form',
					region : 'north',
					colNums : 3,
					items : [{
								fieldLabel : '开始时间',
								id : 'SuperviseTaskReportView_txtStartDate',
								xtype : 'datetimefield',
								name : 'strStartDate',
								format : 'Y-m-d',
								allowBlank : false,
								value : Ext.util.Format.date(new Date(),
										'Y-m-d'),
								width : 160,
								editable : false
							},{
								fieldLabel : '结束时间',
								id : 'SuperviseTaskReportView_txtEndDate',
								xtype : 'datetimefield',
								name : 'strEndDate',
								format : 'Y-m-d',
								allowBlank : false,
								value : Ext.util.Format.date(new Date(),
										'Y-m-d'),
								width : 160,
								editable : false
							}],
					buttons : [{
								text : '查询',
								scope : this,
								iconCls : 'btn-search',
								handler : this.search
							}, {
								text : '重置',
								scope : this,
								iconCls : 'btn-reset',
								handler : this.reset
							}]
				});// end of searchPanel

		this.topbar = new Ext.Toolbar({
					items : [{
								iconCls : 'btn-xls',
								text : '导出EXCEL',
								xtype : 'button',
								scope : this,
								handler : this.toExcel
							}, {
								text : '导出PDF',
								scope : this,
								iconCls : 'btn-pdf',
								handler : this.toPDF
							} ]
				});
 				
/*		var strStartDate =Ext.getCmp("SuperviseTaskReportView_txtStartDate").value; 
 		var strEndDate =Ext.getCmp("SuperviseTaskReportView_txtEndDate").value; */
 	    var strNowDate =Ext.util.Format.date(new Date(),'Y-m-d'); //&ini=1 该值用于初始化
		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			noSel:true,
			// 使用RowActions
			//rowActions : true,
			id : 'SuperviseTaskReportView_superviseTaskDetailsGrid',
			url : __ctxPath + "/admin/reportSuperviseTaskDetals.do?ini=1&strNowDate="+strNowDate ,
			fields : [ 'configname', 'topic','description', 'create_month', 'responsibility_depname',
					'responsibility_username', 'cooperate_depname','supervise_status','cur_sta_des', 'update_date'  ],
			columns : [ {
						header : '事项来源',
						dataIndex : 'configname' ,
						width:120
					},{
						header : '事项名称',
						dataIndex : 'topic',
						width:180
					}, {
						header : '事项内容',
						dataIndex : 'description',
						width:180
					}, {
						header : '月份',
						dataIndex : 'create_month'  ,
						width:50,
						renderer:function(value)
						{
							return value+'月';
						}
					}, {
						header : '责任部门',
						dataIndex : 'responsibility_depname' ,
						width:100
					}, {
						header : '责任人',
						dataIndex : 'responsibility_username' ,
						width:80
					}, {
						header : '配合部门',
						dataIndex : 'cooperate_depname' ,
						width:100
					}, {
						header : '状态',
						dataIndex : 'supervise_status' ,
						width:100
					}, {
						header : '现状说明',
						dataIndex : 'cur_sta_des' ,
						width:100
					}, {
						header : '完成时间',
						dataIndex : 'update_date' ,
						width:100
					}
				]
				// end of columns
		});

 
	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search({
					searchPanel : this.searchPanel,
					gridPanel : this.gridPanel
				});
	}, 
	// 导出EXCEL
	toExcel : function() { 
 		if (this.searchPanel.getForm().isValid()) {
     			var ram = Math.floor(Math.random()*100000)  
 				var strStartDate =Ext.getCmp("SuperviseTaskReportView_txtStartDate").value; 
 				var strEndDate =Ext.getCmp("SuperviseTaskReportView_txtEndDate").value; 
			Ext.Ajax.request({
					url : __ctxPath,
					method : 'post', 
					success : function(result, response) { 
						  	var report_ExcelPanelHtml="";
  			  				report_ExcelPanelHtml ="<table style='display:none;' width='98%' align='center' border='0' cellspacing='0' cellpadding='0'>" 
								+ "<tr><td>"
								+ "<iframe src='"
								+ __ctxPath
								+ "/admin/reportSuperviseTaskDetailsXLS.do?ram="
								+ ram
								+"&ini=2&strStartDate="
								+strStartDate
								+"&strEndDate="
								+strEndDate
								+ "' width='99%' frameborder='0' scrolling='no'  style='border:0px none; ' height='500' ></iframe>" 
								+"</td></tr>"
								+"</table>";
 			 					Ext.getCmp('SuperviseTaskReportView_report_ExcelPanel').update(report_ExcelPanelHtml);
 
					}// success end;
				});// Ext.Ajax.request end;
				
			//Ext.getCmp("searchCondition").collapse();
			//	 Ext.getCmp('reportPanel').update(reportPanelHtml);
 		} else {
			Ext.Msg.alert('错误', '请正确填写输入框！');
		}// if结束
		},
			// 导出pdf
	toPDF : function() { 
 		if (this.searchPanel.getForm().isValid()) {
     			var ram = Math.floor(Math.random()*100000);  
 				var strStartDate =Ext.getCmp("SuperviseTaskReportView_txtStartDate").value; 
 				var strEndDate =Ext.getCmp("SuperviseTaskReportView_txtEndDate").value; 
 				//window.location.target= "_blank "; 
 				//window.location.href=__ctxPath	+ "/admin/reportSuperviseTaskDetailsPDF.do?ram="	+ ram+"&strDate="+strDate;
 				var strUrl=__ctxPath	+ "/admin/reportSuperviseTaskDetailsPDF.do?ram="	
 				+ ram
				+"&ini=2&strStartDate="
				+strStartDate
				+"&strEndDate="
				+strEndDate;
				window.open(strUrl,"_blank") 

 /*   				Ext.Ajax.request({
					url : __ctxPath,
					method : 'post',
 					params : {
						strYear : strYear,
						strMonth:strMonth
					}, 
					success : function(result, response) {
 
						  　　var report_ExcelPanelHtml="";
  			  				report_ExcelPanelHtml ="<table style='display:none;' width='98%' align='center' border='0' cellspacing='0' cellpadding='0'>" 
								+ "<tr><td>"
								+ "<iframe src='"
								+ __ctxPath
								+ "/admin/reportSuperviseFinishedStatusPDF.do?ram="
								+ ram
								+"&strYear="
								+strYear
								+"&strMonth="
								+strMonth
								+ "' width='99%' frameborder='0' scrolling='no'  style='border:0px none; ' height='500' ></iframe>" 
								+"</td></tr>"
								+"</table>";
 			 					Ext.getCmp('report_ExcelPanel').update(report_ExcelPanelHtml);
			 				 	//Ext.getCmp('reportPanel').update(""); 
　
					}// success end;
				});// Ext.Ajax.request end;
*/ 		} else {
			Ext.Msg.alert('错误', '请正确填写输入框！');
		}// if结束
		}
});
