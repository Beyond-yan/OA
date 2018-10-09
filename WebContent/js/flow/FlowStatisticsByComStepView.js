/**
 * 
 * @class FlowStatisticsByComStepView
 * @extends Ext.Panel
 * @description 流程超时统计报表
 * 
 */


FlowStatisticsByComStepView = Ext
		.extend(
				Ext.Panel,
				{
					store : null,
					picPanel : null,
					searchPanel : null,
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 初始化组件
						this.initUIComponents();
						// 调用父类构造
						FlowStatisticsByComStepView.superclass.constructor.call(this,
								{
									id : 'FlowStatisticsByComStepView',
									title : '超时统计报表',
									region : 'center',
									layout : 'border',
									items : [ this.searchPanel, this.picPanel ]
								});
					},// end of constructor
					// 初始化组件
					initUIComponents : function() {

						var lastMonth = new Date();
						lastMonth.setMonth(lastMonth.getMonth() - 1);// 显示上一个月
						lastMonth.setDate(1);
						
						// 初始化搜索条件Panel
						this.searchPanel = new HT.SearchPanel( {
							layout : 'form',
							region : 'north',
							items : [{
			                    xtype : 'container',
			                    style : 'padding-left:0px;margin-bottom:4px;',
			                    layout : 'column',
			                    items : [{
			                        xtype : 'label',
			                        text : '开始日期:',
			                        style : 'padding-left:50px;',
			                        width : 140
			                        },
			                        {
										name : 'comStepCulReport.beginDate',
										id:'comStepCulReport.beginDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										anchor : '98%',
										value : lastMonth,
										readOnly:true
			                        },{
			                        xtype : 'label',
			                        text : '结束日期:',
			                        style : 'padding-left:85px;',
			                        width : 165
			                        },
			                        {
			                        	name : 'comStepCulReport.endDate',
			                        	id:'comStepCulReport.endDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										anchor : '98%',
										value : new Date(),
										readOnly:true
			                        }]
			                    }],
							buttons : [ {
								iconCls : 'search',
								text : '查询',
								handler : this.search.createCallback(this)
							}, {
								iconCls : 'btn-reset',
								// style : 'padding-right:40%;',
								text : '重置',
								handler : this.reset.createCallback(this)
							}, {
								iconCls : 'excel-cls',
								// style : 'padding-right:40%;',
								text : '导出Excel',
								handler : this.tableToExcel.createCallback(this)
							}]
						});// end of searchPanel



															

						this.store = new Ext.data.JsonStore( {							
							proxy: new Ext.data.HttpProxy({ 
								url : __ctxPath + '/flow/getReportByComStepFlowStatisticsReport.do',
					            timeout : 5*1000*60								
					        }),
					        method : 'post',
								root : 'result',
								totalProperty : 'totalCounts',
								remoteSort : true,
								autoLoad : false ,
							fields : [ 'depName', 'sendFinish',
									'sendNotFinish1',
									'sendTotal', 'recFinish',
									'recNotFinish1', 'recTotal']
						});
						this.store.on("load", function(store, record, opts) {
								html = getHtml(store);								
								var fm = Ext.getCmp('picPanel1');
								fm.update(html);

							});
						


						this.picPanel = new Ext.Panel( {
							height : 480,
							id : 'picPanel1',
							region : 'center',
							// store : this.store,
							html : '',
							autoScroll : true,
							nocache:true
						});
						
						function right(mainStr,lngLen) { 
							if (mainStr.length-lngLen>=0 && mainStr.length>=0 && mainStr.length-lngLen<=mainStr.length) { 
							return mainStr.substring(mainStr.length-lngLen,mainStr.length)} 
							else{return null;} 
							}; 						

						function getHtml(store) {
							var beginDate = Ext.util.Format.date(Ext.getCmp('comStepCulReport.beginDate').getValue(),'Y/m/d');
							var endDate = Ext.util.Format.date(Ext.getCmp('comStepCulReport.endDate').getValue(),'Y/m/d');
							var staticsDate = Ext.util.Format.date(new Date(),'Y/m/d');
							var html = "<table id=\'QryTable\' cellspacing='1' border='0' bgcolor='#000000' width=\'100%\'>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'50\'><td colspan=\'7\' width=\'100%\' align=\'center\'><h1 style=\'font-size:20px;\'>公司级：公文处理情况汇总表</h1></td></tr>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'20\'>" +
									"<td width=\'15%\' align=\'center\'></td>" +
									"<td width=\'42.5%\' align=\'center\' colspan=\'3\'>起始时间"+beginDate+"&nbsp;&nbsp;&nbsp;&nbsp;截止时间:"+endDate+"</td>" +
									"<td width=\'42.5%\' align=\'right\' colspan=\'3\'>统计时间:"+staticsDate+"</td>" +
							        "</tr>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'30\'>" +
							"<td width=\'15%\' rowspan=\'2\' align=\'center\'>部门</td>" +
							"<td width=\'42.5%\' align=\'center\' colspan=\'3\'>发文</td>" +
							"<td width=\'42.5%\' align=\'center\' colspan=\'3\'>收文</td>" +
					        "</tr>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'30\'>" +
							"<td width=\'8.5%\' align=\'center\'>超过3天(工作日)已完成</td>" +
							"<td width=\'8.5%\' align=\'center\'>超过3天(工作日)未完成</td>" +
							"<td width=\'8.5%\' align=\'center\'>合计</td>" +
							"<td width=\'8.5%\' align=\'center\'>超过3天(工作日)已完成</td>" +
							"<td width=\'8.5%\' align=\'center\'>超过3天(工作日)未完成</td>" +
							"<td width=\'8.5%\' align=\'center\'>合计</td>" +
					        "</tr>";
							for(var i=0;i<store.getTotalCount();i++)
							{								
								if(i%2==0){
									html+="<tr bgcolor=\'#FFFFFF\' width=\'100%\' height=\'20\'>" ;
								}else{
									html+="<tr bgcolor=\'#B1CDCC\' width=\'100%\' height=\'20\'>" ;
								}
								html+="<td width=\'9.09%\' align=\'center\'>"+store.getAt(i).get("depName")+"</td>" +
								"<td width=\'9.09%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsByComStepView.sendDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "1\",\"" +beginDate+ "\",\""+endDate+  "\",\"\")\'"     + ">"+store.getAt(i).get("sendFinish")+"</a></td>" +
								"<td width=\'9.09%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsByComStepView.sendDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "2\",\"" +beginDate+ "\",\""+endDate+  "\",\"\")\'"     + ">"+store.getAt(i).get("sendNotFinish1")+"</a></td>" +
								"<td width=\'9.09%\' align=\'center\'>"+store.getAt(i).get("sendTotal")+"</td>" +
								"<td width=\'9.09%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsByComStepView.recDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "1\",\"" +beginDate+ "\",\""+endDate+  "\",\"\")\'"     + ">"+store.getAt(i).get("recFinish")+"</a></td>" +
								"<td width=\'9.09%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsByComStepView.recDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "2\",\"" +beginDate+ "\",\""+endDate+  "\",\"\")\'"     + ">"+store.getAt(i).get("recNotFinish1")+"</a></td>" +
								"<td width=\'9.09%\' align=\'center\'>"+store.getAt(i).get("recTotal")+"</td>" +
						        "</tr>";
							}
							
							html += "</table>";		
							html +="<BR>";
							html +="<BR>";
							html +="<BR>";html +="<BR>";html +="<BR>";
							
							
							return html;
						};

					},// end of the initComponents()
					search : function(self) {
						if (self.searchPanel.getForm().isValid()) {// 如果合法
						var myMask = new Ext.LoadMask(Ext.getBody(), {
	                        msg: '正在提交处理，请稍等！',
	                        removeMask: true //完成后移除
	                    });
						myMask.show();
						self.store.load({		
							params : {
							'beginDate' : Ext.util.Format.date(Ext.getCmp('comStepCulReport.beginDate').getValue(),'Y/m/d'),
							'endDate' : Ext.util.Format.date(Ext.getCmp('comStepCulReport.endDate').getValue(),'Y/m/d')
							},
							callback :function(store, record, opts) {
								myMask.hide();
							}
						});
						
						}
					},

					
					/**
					 * 清空
					 */
					reset : function(self) {
						self.searchPanel.getForm().reset();
					},
					//把表格导出到Excel
					tableToExcel:function (self) {
						var recordCount = self.store.getCount();
						if (recordCount > 0) {
							window.location.href =__ctxPath + '/flow/comStepToExcelDownLoad.do?beginDate='+Ext.util.Format.date(Ext.getCmp('comStepCulReport.beginDate').getValue(),'Y/m/d')+'&endDate='+Ext.util.Format.date(Ext.getCmp('comStepCulReport.endDate').getValue(),'Y/m/d')+'&staticsDate='+Ext.util.Format.date(new Date(),'Y/m/d');
							// 导出Excel
							/*Ext.Ajax.request( {
										url : __ctxPath + '/flow/companyRepToExcelDownLoad.do',
										success : function(response) {
											
										},
										failure : function(response) {
											Ext.Msg.alert("提示", "导出失败！");
										},
										params : {
											'beginDate' : Ext.util.Format.date(Ext.getCmp('comStepCulReport.beginDate').getValue(),'Y/m/d'),
											'endDate' : Ext.util.Format.date(Ext.getCmp('comStepCulReport.endDate').getValue(),'Y/m/d')
										}
									});*/
						} else {
							Ext.Msg.alert("提示", "没有数据需要导出！")
						}
					} 

				});
FlowStatisticsByComStepView.recDetail=function(depName,fileName,status,beginDate,endDate,overDateFlag){
	var title ="";
	if(status ==1) {
		title = depName+'--超过3天(工作日)已完成';
	}else if(status == 2){
		title = depName+'--超过3天(工作日)未完成';
	}	

	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('FlowStatisticsStepByReceiveView');
	if (startForm == null) {
		startForm = new FlowStatisticsStepByReceiveView({
					id : 'FlowStatisticsStepByReceiveView',
					depName :depName,
					fileName:fileName,
					status:status,
					beginDate:beginDate,
					endDate:endDate,
					overDateFlag:overDateFlag,
					title :title
				});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
};
FlowStatisticsByComStepView.sendDetail=function(depName,fileName,status,beginDate,endDate,overDateFlag){
	var title ="";
	if(status ==1) {
		title = depName+'--超过3天(工作日)已完成';
	}else if(status == 2){
		title = depName+'--超过3天(工作日)未完成';
	}
	

	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('FlowStatisticsStepBySendView');
	if (startForm == null) {
		startForm = new FlowStatisticsStepBySendView({
					id : 'FlowStatisticsStepBySendView',
					depName :depName,
					fileName:fileName,
					status:status,
					beginDate:beginDate,
					endDate:endDate,
					overDateFlag:overDateFlag,
					title :title
				});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
};