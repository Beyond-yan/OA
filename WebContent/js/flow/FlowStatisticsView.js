/**
 * 
 * @class FlowStatisticsView
 * @extends Ext.Panel
 * @description 流程统计报表
 * 
 */


FlowStatisticsView = Ext
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
						FlowStatisticsView.superclass.constructor.call(this,
								{
									id : 'FlowStatisticsView',
									title : '流程统计报表',
									region : 'center',
									layout : 'border',
									items : [ this.searchPanel, this.picPanel ]
								});
					},// end of constructor
					// 初始化组件
					initUIComponents : function() {

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
										name : 'comPanyReport.beginDate',
										id:'comPanyReport.beginDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										anchor : '98%',
										value : new Date()
			                        },{
			                        xtype : 'label',
			                        text : '结束日期:',
			                        style : 'padding-left:85px;',
			                        width : 165
			                        },
			                        {
			                        	name : 'comPanyReport.endDate',
			                        	id:'comPanyReport.endDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										anchor : '98%',
										value : new Date()
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
							url : __ctxPath + '/flow/getReportByCompanyFlowStatisticsReport.do',
							method : 'post',
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							autoLoad : false,					
							fields : [ {
								name : 'id',
								type : 'int'
							}, 'depName', 'finish',
									'notFinish1',
									'notFinsih2','notFinsih3', 'total', 'recFinish',
									'recNotFinish1', 'recNotFinish2','recNotFinish3',
									'recTotal']
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
							var beginDate = Ext.util.Format.date(Ext.getCmp('comPanyReport.beginDate').getValue(),'Y/m/d');
							var endDate = Ext.util.Format.date(Ext.getCmp('comPanyReport.endDate').getValue(),'Y/m/d');
							var staticsDate = Ext.util.Format.date(new Date(),'Y/m/d');
							var html = "<table id=\'QryTable\' cellspacing='1' border='0' bgcolor='#000000' width=\'100%\'>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'50\'><td colspan=\'13\' width=\'100%\' align=\'center\'><h1 style=\'font-size:20px;\'>公司级：公文处理情况汇总表</h1></td></tr>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'20\'>" +
									"<td width=\'16%\' align=\'center\'></td>" +
									"<td width=\'42%\' align=\'center\' colspan=\'6\'>起始时间"+beginDate+"&nbsp;&nbsp;&nbsp;&nbsp;截止时间:"+endDate+"</td>" +
									"<td width=\'42%\' align=\'right\' colspan=\'6\'>统计时间:"+staticsDate+"</td>" +
							        "</tr>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'30\'>" +
							"<td width=\'16%\' rowspan=\'2\' align=\'center\'>部门</td>" +
							"<td width=\'42%\' align=\'center\' colspan=\'6\'>发文</td>" +
							"<td width=\'42%\' align=\'center\' colspan=\'6\'>收文</td>" +
					        "</tr>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'30\'>" +
							"<td width=\'7%\' align=\'center\'>已完成</td>" +
							"<td width=\'7%\' align=\'center\'>进行中</td>" +
							"<td width=\'7%\' align=\'center\'>超过2天未完成</td>" +
							"<td width=\'7%\' align=\'center\'>超过3天未完成</td>" +
							"<td width=\'7%\' align=\'center\'>合计</td>" +
							"<td width=\'7%\' align=\'center\'>完成率</td>" +
							"<td width=\'7%\' align=\'center\'>已完成</td>" +
							"<td width=\'7%\' align=\'center\'>进行中</td>" +
							"<td width=\'7%\' align=\'center\'>超过2天未完成</td>" +
							"<td width=\'7%\' align=\'center\'>超过3天未完成</td>" +
							"<td width=\'7%\' align=\'center\'>合计</td>" +
							"<td width=\'7%\' align=\'center\'>完成率</td>" +
					        "</tr>";
							for(var i=0;i<store.getTotalCount();i++)
							{
								var sendFinshRate;
								if(store.getAt(i).get("total")==0){
									sendFinshRate = 0;
								}else {
									sendFinshRate = Ext.util.Format.round(store.getAt(i).get("finish")/store.getAt(i).get("total"),2);
									sendFinshRate = Ext.util.Format.round(sendFinshRate * 100,2) +"%";
								}
								var recFinshRate;
								if(store.getAt(i).get("recTotal")==0){
									recFinshRate = 0;
								}else {
									recFinshRate = Ext.util.Format.round(store.getAt(i).get("recFinish")/store.getAt(i).get("recTotal"),2);
									recFinshRate = Ext.util.Format.round(recFinshRate * 100,2) +"%";
								}
								if(i%2==0){
									html+="<tr bgcolor=\'#FFFFFF\' width=\'100%\' height=\'20\'>" ;
								}else{
									html+="<tr bgcolor=\'#B1CDCC\' width=\'100%\' height=\'20\'>" ;
								}
								html+="<td width=\'7.58%\' align=\'center\'>"+store.getAt(i).get("depName")+"</td>" +
								"<td width=\'7.58%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsView.sendDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "2\",\"" +beginDate+ "\",\""+endDate+  "\",\"\")\'"     + ">"+store.getAt(i).get("finish")+"</a></td>" +
								"<td width=\'7.58%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsView.sendDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "1\",\"" +beginDate+ "\",\""+endDate+  "\",\"\")\'"     + ">"+store.getAt(i).get("notFinish1")+"</a></td>" +
								"<td width=\'7.58%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsView.sendDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "1\",\"" +beginDate+ "\",\""+endDate+  "\",\"2\")\'"     + ">"+store.getAt(i).get("notFinsih2")+"</a></td>" +
								"<td width=\'7.58%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsView.sendDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "1\",\"" +beginDate+ "\",\""+endDate+  "\",\"1\")\'"     + ">"+store.getAt(i).get("notFinsih3")+"</a></td>" +
								"<td width=\'7.58%\' align=\'center\'>"+store.getAt(i).get("total")+"</td>" +
								"<td width=\'7.58%\' align=\'center\'>"+sendFinshRate+"</td>" +
								"<td width=\'7.58%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsView.recDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "2\",\"" +beginDate+ "\",\""+endDate+  "\",\"\")\'"     + ">"+store.getAt(i).get("recFinish")+"</a></td>" +
								"<td width=\'7.58%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsView.recDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "1\",\"" +beginDate+ "\",\""+endDate+  "\",\"\")\'"    + ">"+store.getAt(i).get("recNotFinish1")+"</a></td>" +
								"<td width=\'7.58%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsView.recDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "1\",\"" +beginDate+ "\",\""+endDate+  "\",\"2\")\'"     + ">"+store.getAt(i).get("recNotFinish2")+"</a></td>" +
								"<td width=\'7.58%\' align=\'center\'><a href=\'#\' onclick=\'FlowStatisticsView.recDetail(\""+store.getAt(i).get("depName")+  "\",\"\",\""+ "1\",\"" +beginDate+ "\",\""+endDate+  "\",\"1\")\'"     + ">"+store.getAt(i).get("recNotFinish3")+"</a></td>" +
								"<td width=\'7.58%\' align=\'center\'>"+store.getAt(i).get("recTotal")+"</td>" +
								"<td width=\'7.58%\' align=\'center\'>"+recFinshRate+"</td>" +
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
							'beginDate' : Ext.util.Format.date(Ext.getCmp('comPanyReport.beginDate').getValue(),'Y/m/d'),
							'endDate' : Ext.util.Format.date(Ext.getCmp('comPanyReport.endDate').getValue(),'Y/m/d')
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
							window.location.href =__ctxPath + '/flow/companyRepToExcelDownLoad.do?beginDate='+Ext.util.Format.date(Ext.getCmp('comPanyReport.beginDate').getValue(),'Y/m/d')+'&endDate='+Ext.util.Format.date(Ext.getCmp('comPanyReport.endDate').getValue(),'Y/m/d')+'&staticsDate='+Ext.util.Format.date(new Date(),'Y/m/d');
							// 导出Excel
							/*Ext.Ajax.request( {
										url : __ctxPath + '/flow/companyRepToExcelDownLoad.do',
										success : function(response) {
											
										},
										failure : function(response) {
											Ext.Msg.alert("提示", "导出失败！");
										},
										params : {
											'beginDate' : Ext.util.Format.date(Ext.getCmp('comPanyReport.beginDate').getValue(),'Y/m/d'),
											'endDate' : Ext.util.Format.date(Ext.getCmp('comPanyReport.endDate').getValue(),'Y/m/d')
										}
									});*/
						} else {
							Ext.Msg.alert("提示", "没有数据需要导出！")
						}
					} 

				});
				
FlowStatisticsView.recDetail=function(depName,fileName,status,beginDate,endDate,overDateFlag){
	var title ="";
	if(status ==1) {
		title = fileName =="" ? depName+'--所有未结束流程':depName +"("+fileName +')--所有未结束流程';
		if(overDateFlag == 1){
			title = fileName =="" ? depName+'--超过3天未完成的流程':depName +"("+fileName +')--超过3天未完成的流程';
		}else if(overDateFlag == 2){
			title = fileName =="" ? depName+'--超过2天未完成的流程':depName +"("+fileName +')--超过2天未完成的流程';
		}
	}else if(status == 2){
		title = fileName =="" ? depName+'--所有已完成流程':depName +"("+fileName +')--所有已完成流程';
	}
	

	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('FlowStatisticsRecDepAllNoEndView');
	if (startForm == null) {
		startForm = new FlowStatisticsRecDepAllNoEndView({
					id : 'FlowStatisticsRecDepAllNoEndView',
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
FlowStatisticsView.sendDetail=function(depName,fileName,status,beginDate,endDate,overDateFlag){
	var title ="";
	if(status ==1) {
		title = fileName =="" ? depName+'--所有未结束流程':depName +"("+fileName +')--所有未结束流程';
		if(overDateFlag == 1){
			title = fileName =="" ? depName+'--超过3天未完成的流程':depName +"("+fileName +')--超过3天未完成的流程';
		}else if(overDateFlag == 2){
			title = fileName =="" ? depName+'--超过2天未完成的流程':depName +"("+fileName +')--超过2天未完成的流程';
		}
	}else if(status == 2){
		title = fileName =="" ? depName+'--所有已完成流程':depName +"("+fileName +')--所有已完成流程';
	}
	

	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('FlowStatisticsSendDepAllStaView');
	if (startForm == null) {
		startForm = new FlowStatisticsSendDepAllStaView({
					id : 'FlowStatisticsSendDepAllStaView',
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