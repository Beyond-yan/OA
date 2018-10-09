/**
 * @author:
 * @class SuperviseFinishedStatusReportView
 * @extends Ext.Panel
 * @description [MonitorParticipant]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
SuperviseFinishedStatusReportView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		SuperviseFinishedStatusReportView.superclass.constructor.call(this, {
					id : 'SuperviseFinishedStatusReportView',
					title : '督办事项完成情况统计报表',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel,this.report_ExcelPanel,this.reportPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		
		this.report_ExcelPanel = new Ext.Panel({
					height : 500,
					id : 'SuperviseFinishedStatusReportView.report_ExcelPanel',
					region : 'center',
					xtype:'hidden',
					html : '',
					autoScroll : true
				});
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
					frame : false,
					layout : 'form',
					region : 'north',
					colNums : 1,
					items : [ 
//
							{
								xtype : 'container',
								layout : 'column',
								style : 'padding-left:0px;margin-bottom:4px;',
								items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '部门:',
									width : 105
								},
										{
											xtype : 'textfield',
											name : 'strDepartment',
											id : 'SuperviseFinishedStatusReportView.txtDepartment',
											editable : false,
											readOnly : true,
											width : 320
										},
										{
											xtype : 'button',
											iconCls : 'btn-user-sel',
											text : '选择部门',
											handler : function() {
												if (curUserInfo.isAdmin == true){
													DepSelector3.getView(
															function(id, name) {
																Ext.getCmp('SuperviseFinishedStatusReportView.txtDepartment').setValue(name);
																Ext.getCmp('SuperviseFinishedStatusReportView.txtDepartmentId').setValue(id);
															},false).show();													
												}
												else if (curUserInfo.isDepMonitorAdmin == true){
													DepSelector.getView(
															function(id, name) {
																Ext.getCmp('SuperviseFinishedStatusReportView.txtDepartment').setValue(name);
																Ext.getCmp('SuperviseFinishedStatusReportView.txtDepartmentId').setValue(id);
															},false).show();													
												}
								 			}
										},
										{
											xtype : 'button',
											text : '清除记录',
											iconCls : 'reset',
											handler : function() {
												Ext.getCmp('SuperviseFinishedStatusReportView.txtDepartment').setValue('');
												Ext.getCmp('SuperviseFinishedStatusReportView.txtDepartmentId').setValue('');
											}
										} ]
							},{
									fieldLabel:'部门Id',
									name : 'strDepartmentId',
									id : 'SuperviseFinishedStatusReportView.txtDepartmentId',
									xtype : 'hidden',
									flex:1
//							  },{
//											fieldLabel : '时间',
//											id : 'SuperviseFinishedStatusReportView.txtDate',
//											name : 'strDate',
//											value:Ext.util.Format.date(new Date(),	'Y-m'),
//											flex : 1,
//											xtype : 'datefield',
//											format : 'Y-m',
//											width:100
								},{
									fieldLabel:'月 　份',
									name : 'strDate',
									id:'SuperviseFinishedStatusReportView.txtDate',
									xtype: 'monthfield',
									anchor : '22%',
									value : new Date(),
									allowBlank:false,
									editable:false
									}					 							 							 															
//
			
			

],
					buttons : [{
								text : '浏览',
								scope : this,
								iconCls : 'btn-search',
								handler : this.search
							}, /*{
								text : '重置',
								scope : this,
								iconCls : 'btn-reset',
								handler : this.reset
							},*/ {
								text : '导出Excel',
								scope : this,
								iconCls : 'btn-xls',
								handler : this.toExcel
							}, {
								text : '导出PDF',
								scope : this,
								iconCls : 'btn-pdf',
								handler : this.toPDF
							}]
				});//tableReportPanelsearchPanel

		this.reportPanel = new Ext.Panel({
					height : 500,
					id : 'SuperviseFinishedStatusReportView.reportPanel',
					region : 'center',
					// store : this.store,
					html : '',
					autoScroll : true
				});
 

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 导出EXCEL
	toExcel : function() { 
 		if (this.searchPanel.getForm().isValid()) {
     			var ram = Math.floor(Math.random()*100000);  
     		    var strYear=Ext.util.Format.date(Ext.getCmp("SuperviseFinishedStatusReportView.txtDate").getValue(),'Y'); 
				var strMonth=Ext.util.Format.date(Ext.getCmp("SuperviseFinishedStatusReportView.txtDate").getValue(),'m'); 

  				var strDepartment=Ext.getCmp("SuperviseFinishedStatusReportView.txtDepartmentId").getValue();

  			  //window.open(__ctxPath	+ "/admin/reportSuperviseFinishedStatusXLS.do");//?ram="	+ ram+"&strYear="+strYear+"&strMonth="+strMonth);
			//Ext.getCmp("searchCondition").collapse();
   				Ext.Ajax.request({
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
								+ "/admin/reportSuperviseFinishedStatusXLS.do?ram="
								+ ram
								+"&strYear="
								+strYear
								+"&strMonth="
								+strMonth
								+"&strDepartmentId="
								+strDepartment
								+ "' width='99%' frameborder='0' scrolling='no'  style='border:0px none; ' height='500' ></iframe>" 
								+"</td></tr>"
								+"</table>";
 			 					Ext.getCmp('SuperviseFinishedStatusReportView.report_ExcelPanel').update(report_ExcelPanelHtml);
			 				 	//Ext.getCmp('reportPanel').update(""); 

					}// success end;
				});// Ext.Ajax.request end;
 		} else {
			Ext.Msg.alert('错误', '请正确填写输入框！');
		}// if结束
		},
	// 导出pdf
	toPDF : function() { 
 		if (this.searchPanel.getForm().isValid()) {
     			var ram = Math.floor(Math.random()*100000);  
     		    var strYear=Ext.util.Format.date(Ext.getCmp("SuperviseFinishedStatusReportView.txtDate").getValue(),'Y'); 
				var strMonth=Ext.util.Format.date(Ext.getCmp("SuperviseFinishedStatusReportView.txtDate").getValue(),'m'); 

 				var strDepartment=Ext.getCmp("SuperviseFinishedStatusReportView.txtDepartmentId").getValue();

 				 
 				var strUrl=__ctxPath	+ "/admin/reportSuperviseFinishedStatusPDF.do?ram="	+ ram+"&strYear="
 				+strYear+"&strMonth="+strMonth
								+"&strDepartmentId="
								+strDepartment;
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
		},
	// 按条件搜索
/*	search : function() { 
 		if (this.searchPanel.getForm().isValid()) {
     			var ram = Math.floor(Math.random()*100000); 
				var reportPanelHtml = "";
 				var strYear = Ext.getCmp("SuperviseFinishedStatusReportView.txtYear").getValue();
 				var strMonth = Ext.getCmp("SuperviseFinishedStatusReportView.txtMonth").getValue();
  				Ext.Ajax.request({
					url : __ctxPath+'/admin/reportChartParticipant.do?ram='
							+ ram
							+ '',
					method : 'post',
 					params : {
						strYear : strYear,
						strMonth:strMonth
					}, 
					success : function(result, response) {
				 
   						 eval(" r=" + result.responseText + ";");
    						reportPanelHtml = r.mapMessage
								+ "<table width='98%' align='center' border='0' cellspacing='0' cellpadding='0'>" 
								+ "<tr><td>"
								+ "<iframe src='"
								+ __ctxPath
								+ "/admin/reportSuperviseFinishedStatus.do?ram="
								+ ram
								+"&strYear="
								+strYear
								+"&strMonth="
								+strMonth
								+ "' width='99%' frameborder='0' scrolling='auto'  style='border:0px none; ' height='450' ></iframe>" 
								+"</td></tr>"
								+"<tr><td  align='center' style='padding-top:0px'>"
								+"<img src='" + r.src
								+"' width='900' height='350' usemap='#map0'/>"
								+"</td></tr>" 
								+"</table>";
 						//Ext.getCmp("searchCondition").collapse();
 						Ext.getCmp('SuperviseFinishedStatusReportView.reportPanel').update(reportPanelHtml);
 						Ext.getCmp('SuperviseFinishedStatusReportView.report_ExcelPanel').update("");　
					}// success end;
				});// Ext.Ajax.request end;

				//Ext.getCmp("searchCondition").collapse();
				//Ext.getCmp('reportPanel').update(reportPanelHtml);
 		} else {
			Ext.Msg.alert('错误', '请正确填写输入框！');
		}// if结束
 
	}
	*/
		
		search : function() { 
 		if (this.searchPanel.getForm().isValid()) {
     			var ram = Math.floor(Math.random()*100000); 
				var reportPanelHtml = "";
     		    var strYear=Ext.util.Format.date(Ext.getCmp("SuperviseFinishedStatusReportView.txtDate").getValue(),'Y'); 
				var strMonth=Ext.util.Format.date(Ext.getCmp("SuperviseFinishedStatusReportView.txtDate").getValue(),'m'); 

 			    var strDepartment=Ext.getCmp("SuperviseFinishedStatusReportView.txtDepartmentId").getValue();

  							this.searchPanel.getForm().submit({
							waitMsg : '正在提交查询',
							url : __ctxPath  + '/system/submitReportTemplate.do',
							method : 'post',
							success : function(form, action) {
 								Ext.getCmp('SuperviseFinishedStatusReportView.reportPanel')
								.update('<iframe src="'
												+ __ctxPath
												+ '/admin/superviseFinishedStatus_chartAndReport.do?ram='
												+ ram
												+'&reportType=html'
												+'&strYear='
												+strYear
												+'&strMonth='
												+strMonth
												+"&strDepartmentId="
												+strDepartment
												+ '" height="98%" width="98%"  frameborder="0" scrolling="auto"></iframe>');
							},
							failure : function(form, action) {
							}
						});
 				
 				
 				
 				
 		} else {
			Ext.Msg.alert('错误', '请正确填写输入框！');
		}// if结束
 
	}
	
	
});

var timePanel = {
	xtype : 'panel',
	id : 'SuperviseFinishedStatusReportView.panel3',
	fieldLabel : '时　间',
	border : false,
	frame : false,
	layout : 'column',
	columnWidth : 2,
	width:200,
	items : [{
				xtype : 'numberfield',
				id : 'SuperviseFinishedStatusReportView.txtYear',
				style : 'text-align:center',
				name : 'strYear',
				allowBlank : false,
				allowNegative : false,
				allowDecimals : false,
				minValue : 1,
				maxValue : 5000,
				maskRe : /\d/,
				value : new Date().getFullYear(),
				width : 60
			}, {
				xtype : 'displayfield',
				value : '年 '
			}, {
				xtype : 'numberfield',
				id : 'SuperviseFinishedStatusReportView.txtMonth',
				name : 'strMonth',
				style : 'text-align:center',
				allowBlank : false,
				allowNegative : false,
				allowDecimals : false,
				minValue : 1,
				maxValue : 12,
				maskRe : /\d/,
				value : new Date().getMonth() + 1,
				width : 35
			}, {
				xtype : 'displayfield',
				value : '月'
			}]
}