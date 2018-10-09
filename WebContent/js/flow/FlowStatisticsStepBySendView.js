/**
 * 
 * @class FlowStatisticsStepBySendView
 * @extends Ext.Panel
 * @description 收文统计报表
 * 
 */
// 日期计算函数

// 日期计算函数-结束

FlowStatisticsStepBySendView = Ext
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
						FlowStatisticsStepBySendView.superclass.constructor.call(this,
								{
									//id : 'FlowStatisticsStepBySendView',
									title : this.title,
									region : 'center',
									layout : 'border',
									items : [ this.searchPanel, this.picPanel ]
								});
					},// end of constructor
					// 初始化组件
					initUIComponents : function() {
						/*var depStore = new Ext.data.SimpleStore({
							proxy : new Ext.data.HttpProxy({
										url : __ctxPath + '/system/comboDep3WithAllDepartment.do'
									}),
									fields : [ 'depid',
           									'depname' ],
							remoteSort : true
						}); 
						depStore.load();
						var proDefStore = new Ext.data.SimpleStore({
							proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/flow/comRecvProDefinition.do'
									}),
									fields : [ 'depid',
           									'name' ],
							remoteSort : true
						}); 
						proDefStore.load();*/

						// 初始化搜索条件Panel
						this.searchPanel = new HT.SearchPanel( {
							layout : 'form',
							region : 'north',
							colNums : 3,
							items : [/*
			                        {
			                        	fieldLabel:'开始日期',
										name : 'receiveReport.beginDate',
										id:'receiveReport.beginDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										anchor : '98%',
										value : new Date()
			                        },
			                        {
			                         	fieldLabel:'结束日期',
			                        	name : 'receiveReport.endDate',
			                        	id:'receiveReport.endDate',
										xtype : 'datefield',
										format : 'Y-m-d',
										anchor : '98%',
										value : new Date()
			                        },{
				                    	fieldLabel:'部门名称:',
			            				hiddenName : 'Q_issueDep_S_EQ',
			            				id : 'receiveReport.depName',
			            				flex : 1,
			            				width : 130,
			            				xtype : 'combo',
			            				editable : true,
			            				allowBlank : true,
			            				triggerAction : 'all',
			            				displayField : 'depname',
			            				valueField : 'depname',
			            				mode : 'local',
			            				store : depStore	
			            			}, {
			            				fieldLabel:'流程名称',
			            				hiddenName : 'proTypeId',
			            				id : 'receiveReport.proDefName',
			            				width : 150,
			            				xtype : 'combo',
			            				mode : 'local',
			            				editable : false,
			            				triggerAction : 'all',
			            				displayField : 'name',
			            				valueField : 'name',
			            				store :proDefStore		
			            			},{
			            				fieldLabel : '流程状态:',
			            				xtype : 'combo',
			            				hiddenName : 'receiveReport.status',
			            				id : 'receiveReport.status',
			            				mode : 'local',
			            				editable : false,
			            				value:'0',
			            				triggerAction : 'all',
			            				store :[['0','全部'],['1','未完成'],['2','已完成']]
			            			}*/],
			                    
							buttons : [ /*{
								iconCls : 'search',
								text : '查询',
								handler : this.search.createCallback(this)
							}, {
								iconCls : 'btn-reset',
								// style : 'padding-right:40%;',
								text : '重置',
								handler : this.reset.createCallback(this)
							}, */{
								iconCls : 'excel-cls',
								// style : 'padding-right:40%;',
								text : '导出Excel',
								handler : this.tableToExcel.createCallback(this)
							}]
						});// end of searchPanel

						//combobox默认选项配置
					  /*depStore.on('load',function(store,record,opts){  
					     var combo = Ext.getCmp("receiveReport.depName");  
					     var firstValue = store.getAt(0).get('depid');//获得第一项的值
					     combo.setValue(firstValue);
					   });
					 proDefStore.on('load',function(store,record,opts){  
						     var combo = Ext.getCmp("receiveReport.proDefName");  
						     var firstValue = store.getAt(0).get('depid');//获得第一项的值
						     combo.setValue(firstValue);
						 });*/

						this.store = new Ext.data.JsonStore( {
							proxy: new Ext.data.HttpProxy({ 
								url : __ctxPath + '/flow/getReportStepBySendFlowStatisticsReport.do',
					            timeout : 5*1000*60								
					        }),		
							method : 'post',
							root : 'result',
							totalProperty : 'totalCounts',
							remoteSort : true,
							autoLoad : false,					
							fields : [ 'sendDep', 'name','subject',
									'sender', 'sendTime', 'stepDealer',
									'stepFinishTime', 'preStepFinishTime',
									'status','setpTime']
						});
						var myMask = new Ext.LoadMask(Ext.getBody(), {
	                        msg: '正在提交处理，请稍等！',
	                        removeMask: true //完成后移除
	                    });
						myMask.show();
						this.store.load({
							params : {
							'beginDate' : this.beginDate,
							'endDate' : this.endDate,
							'depName':this.depName,
							'flowName':this.fileName,
							'status':this.status,
							'overDateFlag':this.overDateFlag
							},
							callback :function(store, record, opts) {
								myMask.hide();
							}
						});
						this.store.on("load", function(store, record, opts) {
								html = getHtml(store);								
								var fm = Ext.getCmp('picPanel3');
								fm.update(html);

							});
						


						this.picPanel = new Ext.Panel( {
							height : 480,
							id : 'picPanel3',
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
							var beginDate = this.beginDate;
							var endDate = this.endDate;
						function getHtml(store) {
							
							var staticsDate = Ext.util.Format.date(new Date(),'Y/m/d');
							var html = "<table id=\'QryTable\' cellspacing='1' border='0' bgcolor='#000000' width=\'100%\'>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'50\'><td colspan=\'10\' width=\'100%\' align=\'center\'><h1 style=\'font-size:20px;\'>发文报表统计</h1></td></tr>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'20\'>" +
									"<td width=\'10%\' align=\'center\'></td>" +
									"<td width=\'10%\' align=\'center\'></td>" +
									"<td width=\'10%\' align=\'center\'></td>" +
									"<td width=\'10%\' align=\'center\'></td>" +
									"<td width=\'40%\' align=\'center\' colspan=\'4\'>起始时间"+beginDate+"&nbsp;&nbsp;&nbsp;&nbsp;截止时间:"+endDate+"</td>" +
									"<td width=\'40%\' align=\'right\' colspan=\'2\'>统计时间:"+staticsDate+"&nbsp;&nbsp;</td>" +
							        "</tr>";
							html+="<tr bgcolor=\'#ffffe0\' width=\'100%\' height=\'30\'>" +
							"<td width=\'9.8%\' align=\'center\'>发文部门</td>" +
							"<td width=\'9.8%\' align=\'center\'>流程名称</td>" +
							"<td width=\'9.8%\' align=\'center\'>主题</td>" +
							"<td width=\'9.8%\' align=\'center\'>发文人</td>" +
							"<td width=\'9.8%\' align=\'center\'>发文时间</td>" +
							"<td width=\'9.8%\' align=\'center\'>超时处理人</td>" +
							"<td width=\'9.8%\' align=\'center\'>处理时间</td>" +
							"<td width=\'9.8%\' align=\'center\'>上一步处理时间</td>" +
							"<td width=\'9.8%\' align=\'center\'>状态</td>" +
							"<td width=\'9.8%\' align=\'center\' nowrap=\'true\'>处理时长(天)</td>" +
					        "</tr>";
							var count = 0;
							var recDep =null;
							for(var i=0;i<store.getTotalCount();i++)
							{
								if(i%2==0){
									html+="<tr bgcolor=\'#FFFFFF\' width=\'100%\' height=\'20\'>" ;
								}else{
									html+="<tr bgcolor=\'#B1CDCC\' width=\'100%\' height=\'20\'>" ;
								}								
																
								html+="<td width=\'9.8%\' align=\'center\'>"+store.getAt(i).get("sendDep")+"</td>" +
								"<td width=\'10%\' align=\'left\'>"+store.getAt(i).get("name")+"</td>" +
								"<td width=\'9.8%\' align=\'center\'>"+store.getAt(i).get("subject")+"</td>" +
								"<td width=\'9.8%\' align=\'center\'>"+store.getAt(i).get("sender")+"</td>" +
								"<td width=\'9.8%\' align=\'center\'>"+store.getAt(i).get("sendTime")+"</td>" +
								"<td width=\'9.8%\' align=\'center\'>"+store.getAt(i).get("stepDealer")+"</td>" +
								"<td width=\'9.8%\' align=\'center\'>"+store.getAt(i).get("stepFinishTime")+"</td>" +
								"<td width=\'9.8%\' align=\'center\'>"+store.getAt(i).get("preStepFinishTime")+"</td>" +
								"<td width=\'9.8%\' align=\'center\'>"+store.getAt(i).get("status")+"</td>" +
								"<td width=\'9.8%\' align=\'center\'>"+store.getAt(i).get("setpTime")+"</td>" +
						        "</tr>";
							}

							html += "</table>";	
							html +="<BR>";
							html +="<BR>";
							html +="<BR>";html +="<BR>";html +="<BR>";
							return html;
						};

					},// end of the initComponents()
					search : function(self) {/*
						if (self.searchPanel.getForm().isValid()) {// 如果合法
						var myMask = new Ext.LoadMask(Ext.getBody(), {
	                        msg: '正在提交处理，请稍等！',
	                        removeMask: true //完成后移除
	                    });
						myMask.show();
						self.store.load({
							params : {
							'beginDate' : Ext.util.Format.date(Ext.getCmp('receiveReport.beginDate').getValue(),'Y/m/d'),
							'endDate' : Ext.util.Format.date(Ext.getCmp('receiveReport.endDate').getValue(),'Y/m/d'),
							'depName':Ext.getCmp('receiveReport.depName').getValue(),
							'flowName':Ext.getCmp('receiveReport.proDefName').getValue(),
							'status':Ext.getCmp('receiveReport.status').getValue()
							},
							callback :function(store, record, opts) {
								myMask.hide();
							}
						});
						
						}
					*/},

					
					/**
					 * 清空
					 */
					reset : function(self) {
						self.searchPanel.getForm().reset();
					},
					//把表格导出到Excel
					tableToExcel:function (self) {
						var depName =encodeURI(encodeURI(self.depName));
						var flowName =encodeURI(encodeURI(self.fileName));
						var status =self.status;
						
					/*alert(self.beginDate);
						alert(self.endDate);
						alert(depName);
						alert(self.depName);
						alert(self.fileName);
						alert(self.status);*/
						var recordCount = self.store.getCount();
						if (recordCount > 0) {
							window.location.href =__ctxPath + '/flow/sendRepStepToExcelDownLoad.do?depName='+depName+'&flowName='+flowName+'&status='+status+'&beginDate='+self.beginDate+'&endDate='+self.endDate+'&staticsDate='+Ext.util.Format.date(new Date(),'Y/m/d')+'&overDateFlag='+self.overDateFlag;
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