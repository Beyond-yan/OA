/**
 * @author:
 * @class MonitorStatisticReportView
 * @extends Ext.Panel
 * @description [MonitorParticipant]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
MonitorStatisticReportView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		MonitorStatisticReportView.superclass.constructor.call(this, {
					id : 'MonitorStatisticReportView',
					title : '督办事项统计报表',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel,this.report_ExcelPanel,this.reportPanel]
					//this.tableReportPanel,
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		
		this.report_ExcelPanel = new Ext.Panel({
					height : 500,
					id : 'MonitorStatisticReportView_report_ExcelPanel1',
					region : 'center',
					xtype:'hidden',
					html : '',
					autoScroll : true
				});
				
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {
			layout : 'form',
			region : 'north',
			colNums : 1,
			items : [ 	/* {
									fieldLabel : '部门',
									// columnWidth:.6,
									xtype : 'textarea',
									name : 'strDepartment',
								//	width : '65%'
									width:330,
									readOnly : true,
									allowBlank:false,
									id : 'MonitorStatisticReportView.txtDepartment'
								}, {
									xtype : 'hidden',
									name : 'strDepartmentId',
									id : 'MonitorStatisticReportView.txtDepartmentId'
								}, {
									xtype : 'button',
									iconCls : 'menu-department',
									text : '选择部门',
									width:100,
									handler : function() {}
								}, */
			
			
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
											id : 'MonitorStatisticReportView.txtDepartment',
											editable : false,
											readOnly : true,
											width : 320
										},
										{
											xtype : 'button',
											iconCls : 'btn-user-sel',
											text : '选择部门',
											handler : function() {
												DepSelector
														.getView(
																function(id, name) {
																	Ext.getCmp('MonitorStatisticReportView.txtDepartment').setValue(name);
																	Ext.getCmp('MonitorStatisticReportView.txtDepartmentId').setValue(id);
																},false).show();
									/*	DepSelector.getView(
												function(depIds, depNames) {
													Ext
															.getCmp('MonitorStatisticReportView.txtDepartmentId')
															.setValue(depIds);
													Ext
															.getCmp('MonitorStatisticReportView.txtDepartment')
															.setValue(depNames)
															alert(Ext
															.getCmp('MonitorStatisticReportView.txtDepartment')+" : "+ Ext
															.getCmp('MonitorStatisticReportView.txtDepartmentId'));;
													var imstore = new Ext.data.JsonStore(
															{
																url : __ctxPath
																		+ '/system/getInterManagerAppUser.do?depIds='
																		+ depIds,
																autoLoad : true,
																root : 'result',
																totalProperty : 'totalCounts',
																idProperty : 'userId',
																fields : [
																		{
																			name : 'userId',
																			type : 'int'
																		},
																		'username',
																		'fullname']
															});
													imstore.on('load',
															function(store,
																	record,
																	opts) {
																var total = store
																		.getTotalCount();
																var userIds = new Array();
																for (var i = 0; i < total; i++) {
																	var record = store
																			.getAt(i);
																	var uId = record
																			.get('userId');
																	userIds
																			.push(uId);
																}
																Ext
																		.getCmp('userIds')
																		.setValue(userIds);
															});
												}, false).show();
									*/
												
												/*
												UserSelector
														.getView(
																function(id, name) {
																	Ext.getCmp('tsProblemView.userName').setValue(name);
																	Ext.getCmp('tsProblemView_applyUserId').setValue(id);
																},true,true).show();
											
											
											*/}
										},
										{
											xtype : 'button',
											text : '清除记录',
											iconCls : 'reset',
											handler : function() {
												Ext.getCmp('MonitorStatisticReportView.txtDepartment').setValue('');
												Ext.getCmp('MonitorStatisticReportView.txtDepartmentId').setValue('');
											}
										} ]
							},{
									fieldLabel:'部门Id',
									name : 'strDepartmentId',
									id : 'MonitorStatisticReportView.txtDepartmentId',
									xtype : 'hidden',
									flex:1
							  },{
									fieldLabel:'月 　份',
									name : 'strDate',
									id:'MonitorStatisticReportView.txtDate',
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
		});// end of searchPanel
	 

	
		this.reportPanel = new Ext.Panel({
					height : 500,
					id : 'MonitorStatisticReportView_reportPanel1',
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
     		    var strYear=Ext.util.Format.date(Ext.getCmp("MonitorStatisticReportView.txtDate").getValue(),'Y'); 
				var strMonth=Ext.util.Format.date(Ext.getCmp("MonitorStatisticReportView.txtDate").getValue(),'m'); 
  				var strDepartment=Ext.getCmp("MonitorStatisticReportView.txtDepartmentId").getValue();
				
				//var strYear = Ext.getCmp("MonitorStatisticReportView_txtYear").getValue();
 				//var strMonth = Ext.getCmp("MonitorStatisticReportView_txtMonth").getValue();
  			 // window.open(__ctxPath	+ "/admin/reportSuperviseFinishedStatusXLS.do?ram="	+ ram+"&strYear="+strYear+"&strMonth="+strMonth);
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
								+ "/admin/reportSuperviseAffairXLS.do?ram="
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
 			 					Ext.getCmp('MonitorStatisticReportView_report_ExcelPanel1').update(report_ExcelPanelHtml);
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
     		    var strYear=Ext.util.Format.date(Ext.getCmp("MonitorStatisticReportView.txtDate").getValue(),'Y'); 
				var strMonth=Ext.util.Format.date(Ext.getCmp("MonitorStatisticReportView.txtDate").getValue(),'m'); 
				var strDepartment=Ext.getCmp("MonitorStatisticReportView.txtDepartmentId").getValue();
				//var strYear = Ext.getCmp("MonitorStatisticReportView_txtYear").getValue();
 				//var strMonth = Ext.getCmp("MonitorStatisticReportView_txtMonth").getValue();
  			   //window.open(__ctxPath	+ "/admin/reportSuperviseFinishedStatusPDF.do?ram="	+ ram+"&strYear="+strYear+"&strMonth="+strMonth);
 				var strUrl=__ctxPath	+ "/admin/reportSuperviseAffairPDF.do?ram="	+ ram+"&strYear="
 				+strYear+"&strMonth="+strMonth+"&strDepartmentId="+strDepartment;
  				window.open(strUrl,"_blank") 

    /*				Ext.Ajax.request({
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
								+ "/admin/reportSuperviseAffairPDF.do?ram="
								+ ram
								+"&strYear="
								+strYear
								+"&strMonth="
								+strMonth
								+ "' width='99%' frameborder='0' scrolling='no'  style='border:0px none; ' height='500' ></iframe>" 
								+"</td></tr>"
								+"</table>";
 			 					Ext.getCmp('report_ExcelPanel1').update(report_ExcelPanelHtml);
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
 				var strYear = Ext.getCmp("MonitorStatisticReportView_txtYear").getValue();
 				var strMonth = Ext.getCmp("MonitorStatisticReportView_txtMonth").getValue();
  				Ext.Ajax.request({
					url : __ctxPath+'/admin/reportChartSuperviseAffair.do?ram='
							+ ram
							+ '',
					method : 'post',
 					params : {
						strYear : strYear,
						strMonth:strMonth
					}, 
					success : function(result, response) {
						//myMask.hide();
  						 eval(" r=" + result.responseText + ";");
    						reportPanelHtml = r.mapMessage
								+ "<table width='98%' align='center' border='0' cellspacing='0' cellpadding='0'>" 
								+ "<tr><td>"
								+ "<iframe src='"
								+ __ctxPath
								+ "/admin/reportSuperviseAffairHTML.do?ram="
								+ ram
								+"&strYear="
								+strYear
								+"&strMonth="
								+strMonth
								+ "' width='99%' frameborder='0' scrolling='no'  style='border:0px none; ' height='550' ></iframe>" 
						 
								+"</table>";
 						//Ext.getCmp("searchCondition").collapse();
 						Ext.getCmp('MonitorStatisticReportView_reportPanel1').update(reportPanelHtml);
					}// success end;
				});// Ext.Ajax.request end;

				//Ext.getCmp("searchCondition").collapse();
				//Ext.getCmp('reportPanel').update(reportPanelHtml);
 		} else {
			Ext.Msg.alert('错误', '请正确填写输入框！');
		}// if结束 
	}
	*/
	// 按条件搜索
	search : function() { 
 		if (this.searchPanel.getForm().isValid()) {
     			var ram = Math.floor(Math.random()*100000); 
				var reportPanelHtml = "";
     		    var strYear=Ext.util.Format.date(Ext.getCmp("MonitorStatisticReportView.txtDate").getValue(),'Y'); 
				var strMonth=Ext.util.Format.date(Ext.getCmp("MonitorStatisticReportView.txtDate").getValue(),'m'); 
				var strDepartment=Ext.getCmp("MonitorStatisticReportView.txtDepartmentId").getValue();
				//var strYear = Ext.getCmp("MonitorStatisticReportView_txtYear").getValue();
 				//var strMonth = Ext.getCmp("MonitorStatisticReportView_txtMonth").getValue();
						this.searchPanel.getForm().submit({
							waitMsg : '正在提交查询',
							url : __ctxPath  + '/system/submitReportTemplate.do',
							method : 'post',
							success : function(form, action) {
								//var object = Ext.util.JSON.decode(action.response.responseText)
								//var temp = Ext.getCmp('reportTemp' + reportId);
								Ext.getCmp('MonitorStatisticReportView_reportPanel1')
								.update('<iframe src="'
												+ __ctxPath
												+ '/admin/superviseAffairReport.do?ram='
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
				//Ext.getCmp("searchCondition").collapse();
				//Ext.getCmp('reportPanel').update(reportPanelHtml);
 		} else {
			Ext.Msg.alert('错误', '请正确填写输入框！');
		}// if结束 
	}
	
});




	
var timePanel = {
	xtype : 'panel',
	id : 'MonitorStatisticReportView_panel3',
	fieldLabel : '时　间',
	border : false,
	frame : false,
	layout : 'column',
	columnWidth : 2,
	width:200,
	items : [{
				xtype : 'numberfield',
				id : 'MonitorStatisticReportView_txtYear',
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
				id : 'MonitorStatisticReportView_txtMonth',
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