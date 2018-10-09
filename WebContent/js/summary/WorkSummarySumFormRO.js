/**
 * @author
 * @createtime
 * @class WorkSummarySumFormRO
 * @extends Ext.Window
 * @description WorkSummarySum表单
 * @company 捷达世软件
 */



function $leadtoword(conf){
	var worksummarysumid = conf.sumid;
	window.open(conf.url+"?sumid="+conf.sumid);	
}

function $posthurry(conf){
	Ext.Ajax.request({
		url:conf.url,
		params:{'id':conf.id,'content':'管理员提示：请尽快提交您部门的工作总结。'},
		method:'POST',
		success:function(response,options){
			Ext.ux.Toast.msg('操作信息','成功发送催办通知！');
		},
		failure : function(response,options) {
			Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
		}
	});
}

var wssid;
WorkSummarySumFormRO = Ext
		.extend(
				Ext.Window,
				{
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 必须先初始化组件
						this.initUIComponents();
						WorkSummarySumFormRO.superclass.constructor.call(this, {
							id : 'WorkSummarySumFormROWin',
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 500,
							width : 850,
							maximizable : true,
							title : '工作总结汇总详细信息',
							buttonAlign : 'center',
							buttons : [{
								text : '取消',
								iconCls : 'btn-cancel',
								scope : this,
								handler : this.cancel
							} ]
						});
					},// end of the constructor
					// 初始化组件
					initUIComponents : function() {
						var sumidnew = this.sumid;
						this.gridPanelSummary = new HT.GridPanel(
								{
									region : 'center',
									tbar : this.topbar,
									// 使用RowActions
									rowActions : true,
									id : 'WSSFrmROSummaryGrid',
									url : __ctxPath
											+ "/summary/listdeptWorkSummary.do?sumid="
											+ (sumidnew != null
													&& sumidnew != 'undefined' ? sumidnew
													: '0'),
									fields : [ {
										name : 'summaryid',
										type : 'int'
									}, 'depname', 'depid', {
										name : 'summarydate',
										mapping : 'summarydate'
									}, 'summarytype','title', 'completestate',
											'deptstate', 'trouble',
											'jobanalysis', 'jobplan',
											'comment', 'createid',
											'createtime', 'lasteditid',
											'lastedittime' /* ,'appUser.username','appUser2.username' */],
									columns : [ {
										header : 'summaryid',
										dataIndex : 'summaryid',
										hidden : true
									},{
										header : 'depid',
										dataIndex : 'depid',
										hidden : true
									},  {
										header : '部门名称',
										dataIndex : 'depname'
									}, {
										header : '总结日期',
										dataIndex : 'summarydate'
									}, {
										header : '总结类型',
										dataIndex : 'summarytype'
									}, {
										header : '总结标题',
										dataIndex : 'title'
									}, {
										header : '主要工作完成状况',
										dataIndex : 'completestate',
										hidden:true
									}, {
										header : '部门工作概况',
										dataIndex : 'deptstate',
										hidden:true
									}, {
										header : '存在工作难点',
										dataIndex : 'trouble',
										hidden:true
									}, {
										header : '不足分析和改善措施',
										dataIndex : 'jobanalysis',
										hidden:true
									}, {
										header : '下(月)工作计划',
										dataIndex : 'jobplan',
										hidden:true
									}, {
										header : '备注',
										dataIndex : 'comment',
										hidden:true
									}, /*
										 * { header : '创建总结用户', dataIndex :
										 * 'appUser.username' },
										 */{
										header : '创建日期',
										dataIndex : 'createtime'
									}, /*
										 * { header : '最后更新用户', dataIndex :
										 * 'appUser2.username' },
										 */{
										header : '最后更新日期',
										dataIndex : 'lastedittime'
									},  new Ext.ux.grid.RowActions( {
										header : '催办',
										width : 100,
										actions : [ {
											iconCls : 'btn-hurry',
											qtip : '催办',
											style : 'margin:0 3px 0 3px'
										} ],
										listeners : {
											scope : this,
											'action' : this.onRowAction
										}
									}) ]
								// end of columns
								});

						this.gridPanelSummary.addListener('rowdblclick',
								this.rowClick);

						var comboSType = new Ext.form.ComboBox( {
							fieldLabel : '总结类型',
							hiddenName : 'workSummarySum.type',
							id : 'WSSFrmROcomboType',
							allowBlank : false,
							editable : false,
							triggerAction : 'all',
							store : [ '周', '月', '季', '年' ],
							maxLength : 10,
							anchor : '30%',
							disabled:true
						});

						var storeTypeNo = new Ext.data.SimpleStore( {
							fields : [ 'value', 'text' ],
							data : []
						});

						var comboSTypeNo = new Ext.form.ComboBox( {
							fieldLabel : '总结类型周期数',
							hiddenName : 'workSummarySum.typeNo',
							id : 'WSSFrmROcomboTypeno',
							allowBlank : false,
							editable : false,
							mode : 'local',
							triggerAction : 'all',
							valueField : 'value',
							displayField : 'text',
							store : storeTypeNo,
							anchor : '30%',
							disabled:true
						});
						comboSType.on('select', function(comboBox) {
							var typevalue = comboBox.getValue();

							if (typevalue == '年') {
								storeTypeNo.loadData(listYear);
							} else if (typevalue == '季') {
								// alert(typevalue);
								// alert(listSeasons);
								storeTypeNo.loadData(listSeasons);
							} else if (typevalue == '月') {
								storeTypeNo.loadData(listMonths);
							} else if (typevalue == '周') {
								storeTypeNo.loadData(listWeeks);
							}
							comboSTypeNo.setValue('1');
						});
						var listYear = [ [ '1', '1' ] ];
						var listSeasons = [ [ '1', '1' ], [ '2', '2' ],
								[ '3', '3' ], [ '4', '4' ] ];
						var listMonths = [ [ '1', '1' ], [ '2', '2' ],
								[ '3', '3' ], [ '4', '4' ], [ '5', '5' ],
								[ '6', '6' ], [ '7', '7' ], [ '8', '8' ],
								[ '9', '9' ], [ '10', '10' ], [ '11', '11' ],
								[ '12', '12' ] ];
						var listWeeks = [ [ '1', '1' ], [ '2', '2' ],
								[ '3', '3' ], [ '4', '4' ], [ '5', '5' ],
								[ '6', '6' ], [ '7', '7' ], [ '8', '8' ],
								[ '9', '9' ], [ '10', '10' ], [ '11', '11' ],
								[ '12', '12' ], [ '13', '13' ], [ '14', '14' ],
								[ '15', '15' ], [ '16', '16' ], [ '17', '17' ],
								[ '18', '18' ], [ '19', '19' ], [ '20', '20' ],
								[ '21', '21' ], [ '22', '22' ], [ '23', '23' ],
								[ '24', '24' ], [ '25', '25' ], [ '26', '26' ],
								[ '27', '27' ], [ '28', '28' ], [ '29', '29' ],
								[ '30', '30' ], [ '31', '31' ], [ '32', '32' ],
								[ '33', '33' ], [ '34', '34' ], [ '35', '35' ],
								[ '36', '36' ], [ '37', '37' ], [ '38', '38' ],
								[ '39', '39' ], [ '40', '40' ], [ '41', '41' ],
								[ '42', '42' ], [ '43', '43' ], [ '44', '44' ],
								[ '45', '45' ], [ '46', '46' ], [ '47', '47' ],
								[ '48', '48' ], [ '49', '49' ], [ '50', '50' ],
								[ '51', '51' ], [ '52', '52' ], [ '53', '53' ] ];
						var yearnoStore = new Ext.data.SimpleStore( {
							fields : [ 'value', 'text' ],
							data : []
						});
						var yearnoSelect=new Ext.form.ComboBox({
							fieldLabel : '年度',
							store : yearnoStore,
							name:'workSummarySum.yearNo',
							editable : false,
							triggerAction : 'all',
							valueField : 'value',
							displayField : 'text',
							mode : 'local'
						});
						//初始化年份
						Ext.Ajax.request({
							url : __ctxPath + "/summary/searchYearWorkSummary.do",
							success : function(response, options) {
								 var data = response.responseText;
						         data = eval("("+ data + ")");
						         nowYear=data.year;
						         var yearList="";
						         for(var i=nowYear-10;i<nowYear+1;i++){
						        	 yearList+=",['"+i+"','"+i+"']";
						         }
						         yearList=yearList.substring(1);
						         yearList="["+yearList+"]";
						         yearList=eval(yearList);
						         yearnoStore.loadData(yearList);
							},
							failure : function(response) {
								Ext.Msg.alert("提示", "初始化失败！");
							}
						});		
						this.formPanel = new Ext.FormPanel( {
							layout : 'form',
							bodyStyle : 'padding:10px',
							border : false,
							autoScroll : true,
							// id : 'WorkSummarySumFormRO',
							defaults : {
								anchor : '96%,96%'
							},
							defaultType : 'textfield',
							items : [ {
								name : 'workSummarySum.sumid',
								id : 'WSSFrmROhidenSumid',
								xtype : 'hidden',
								value : this.sumid == null ? '' : this.sumid,
								disabled:true
							}, {
								name : 'Q_yearNo_N_EQ',
								xtype : 'hidden',
								id : 'WSSFrmROqyear'
							}, {
								name : 'Q_deptid_L_EQ',
								xtype : 'hidden',
								id : 'WSSFrmROqdept'
							}, {
								name : 'Q_summarytype_S_EQ',
								xtype : 'hidden',
								id : 'WSSFrmROqtype'
							}, {
								name : 'Q_typeNo_N_EQ',
								xtype : 'hidden',
								id : 'WSSFrmROqtypeno'
							}, {
								fieldLabel : '汇总人',
								name : 'workSummarySum.createUserName',
								id : 'WSSFrmROCreateuserName',
								allowBlank : false,
								value : curUserInfo.fullname,
								anchor : '30%',
								disabled:true
							},

							{
								fieldLabel : '年度',
								name : 'workSummarySum.yearNo',
								id : 'WSSFrmROsummaryyear',
								allowBlank : false,
								xtype : 'datefield',
								format : 'Y',
								anchor : '30%',
								disabled:true
							}, comboSType, comboSTypeNo, {
								fieldLabel : '总结标题',
								name : 'workSummarySum.title',
								allowBlank : false,
								maxLength : 100,
								disabled:true
							}, {
								fieldLabel : '筛选',
								id : 'WSSFrmRObtnfilter',
								text : '筛选',
								iconCls : 'add16',
								scope : this,
								handler : this.filter,
								xtype : 'button',
								style : 'width :120px;height:12px;align:right',
								anchor : '20%'
							}, this.gridPanelSummary, {
								fieldLabel : '汇总',
								text : '汇总',
								iconCls : 'add16',
								scope : this,
								handler : this.sum,
								xtype : 'button',
								style : 'width :120px;height:12px;align:right',
								anchor : '20%',
								disabled:true								
							}, {
								fieldLabel : '总结汇总',
								name : 'workSummarySum.sumcontent',
								id : 'WSSFrmROsumcontent',
								xtype : 'fckeditor',
								height : 180,
								width : 670,
								allowBlank : true,
								readOnly:true
							},{
								fieldLabel : '导出',
								id : 'WSSFrmbtnfilter',
								text : '导出Word文件',
								iconCls : 'add16',
								scope : this,
								handler : this.leadtoword,
								xtype : 'button',
								style : 'width :120px;height:12px;align:right',
								anchor : '20%',
								hidden: (sumidnew==null || sumidnew=='undefined')?true:false
							} ]
						});
						// 加载表单对应的数据
						if (this.sumid != null && this.sumid != 'undefined') {
							this.formPanel
									.loadData( {
										url : __ctxPath
												+ '/summary/getWorkSummarySum.do?sumid='
												+ this.sumid,
										root : 'data',
										preName : 'workSummarySum'
									});
							wssid=this.sumid;
						}
						// Ext.getCmp('WSSFrmROCreateuserName').setValue('');
					},// end of the initcomponents

					/**
					 * 重置
					 * 
					 * @param {}
					 *            formPanel
					 */
					reset : function() {
						this.formPanel.getForm().reset();
					},
					/**
					 * 取消
					 * 
					 * @param {}
					 *            window
					 */
					cancel : function() {
						this.close();
					},
					/**
					 * 保存记录
					 */
					save : function() {
						$postForm( {
							formPanel : this.formPanel,
							scope : this,
							url : __ctxPath + '/summary/saveWorkSummarySum.do',
							callback : function(fp, action) {
								var gridPanel = Ext
										.getCmp('WorkSummarySumGrid');
								if (gridPanel != null) {
									gridPanel.getStore().reload();
								}
								this.close();
							}
						});
					}// end of save
					,
					sum : function() {
						// alert('开始汇总！');
						Ext.getCmp('WSSFrmROqyear').setValue('');
						Ext.getCmp('WSSFrmROqtype').setValue('');
						Ext.getCmp('WSSFrmROqtypeno').setValue('');
						// Ext.getCmp('WSSFrmROqdept').setValue(Ext.getCmp('departmentcombo').getValue());
						// alert(Ext.getCmp('WSSFrmROqyear').getValue() + ',' +
						// Ext.getCmp('WSSFrmROqtype').getValue() + ','+
						// Ext.getCmp('WSSFrmROqtypeno').getValue() + ','+
						// Ext.getCmp('WSSFrmROqdept').getValue());
						var conf = {
							url : __ctxPath + '/summary/sumWorkSummarySum.do',
							grid : this.gridPanelSummary,
							idName : 'summaryid'
						};
						var ids = $getGdSelectedIds(conf.grid, conf.idName);
						if (ids.length == 0) {
							Ext.ux.Toast.msg("操作信息", "请选择要汇总的记录！");
							return;
						}
						var params = {
							url : conf.url,
							ids : ids,
							grid : conf.grid
						};
						Ext.Ajax.request( {
							url : params.url,
							params : {
								ids : params.ids
							},
							method : 'POST',
							success : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '成功汇总记录！');
								var resultObj = Ext.util.JSON
										.decode(response.responseText);
								Ext.getCmp('WSSFrmROsumcontent').setValue(
										resultObj.result);
								if (params.callback) {
								}
							},
							failure : function(response, options) {
								Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
							}
						});

						// $postForm({
						// formPanel : this.gridPanelSummary,
						// grid:this.gridPanelSummary,
						// idName : 'summaryid',
						// url : __ctxPath + '/summary/sumWorkSummarySum.do',
						// callback : function(fp, action) {
						// var resultObj =
						// Ext.util.JSON.decode(action.response.responseText);
						// Ext.getCmp('WSSFrmROsumcontent').setValue(resultObj.result);
						// }
						// });

					},
					filter : function() {

						Ext.getCmp('WSSFrmROqyear').setValue(
								new Date(Ext.getCmp('WSSFrmROsummaryyear').getValue())
										.getFullYear());
						Ext.getCmp('WSSFrmROqtype').setValue(
								Ext.getCmp('WSSFrmROcomboType').getValue());
						Ext.getCmp('WSSFrmROqtypeno').setValue(
								Ext.getCmp('WSSFrmROcomboTypeno').getValue());
						// Ext.getCmp('WSSFrmROqdept').setValue(Ext.getCmp('departmentcombo').getValue());
						$search( {
							searchPanel : this.formPanel,
							gridPanel : this.gridPanelSummary
						});

					},
					leadtoword:function(){
						//导出Word文档
						$leadtoword({
							sumid:wssid,
							url:__ctxPath + '/summary/leadtowordWorkSummarySum.do'
							});
					},
					// 重置查询表单
					resetgrid : function() {
						this.formPanel.getForm().reset();
					},
					// 按条件搜索
					search : function() {
						$search( {
							searchPanel : this.searchPanel,
							gridPanel : this.gridPanelSummary
						});
					},
					// GridPanel行点击处理事件
					rowClick : function(grid, rowindex, e) {
						grid.getSelectionModel().each(function(rec) {
							new WorkSummaryFormRO( {
								summaryid : rec.data.summaryid
							}).show();
						});
					},
					// 创建记录
					createRs : function() {
						new WorkSummaryForm().show();
					},
					// 按ID删除记录
					removeRs : function(id) {
						$postDel( {
							url : __ctxPath + '/summary/multiDelWorkSummary.do',
							ids : id,
							grid : this.gridPanelSummary
						});
					},
					// 把选中ID删除
					removeSelRs : function() {
						$delGridRs( {
							url : __ctxPath + '/summary/multiDelWorkSummary.do',
							grid : this.gridPanelSummary,
							idName : 'summaryid'
						});
					},
					// 编辑Rs
					editRs : function(record) {
						new WorkSummaryForm( {
							summaryid : record.data.summaryid
						}).show();
					},
					//催办
					hurryRs:function(record){
						$posthurry({
							url:__ctxPath + '/summary/hurryWorkSummary.do',
							id:record.data.depid
						});
					},					
					// 行的Action
					onRowAction : function(grid, record, action, row, col) {
						switch (action) {
						case 'btn-del':
							this.removeRs.call(this, record.data.summaryid);
							break;
						case 'btn-edit':
							this.editRs.call(this, record);
							break;
						case 'btn-hurry':
							this.hurryRs.call(this,record);
							break;							
						default:
							break;
						}
					}
				});

// WorkSummarySumFormRO.prototype.store = function(){
// var store = new Ext.data.Store({
// proxy : new Ext.data.HttpProxy({
// url : __ctxPath + '/summary/listDeptWorkSummarySum.do'
// }),
// reader : new Ext.data.JsonReader({
// root : 'result',
// totalProperty : 'totalCounts',
// id : 'id',
// fields : [ {
// name : 'summaryid',
// type : 'int'
// }, 'deptid', 'summarydate', 'summarytype', 'title',
// 'completestate', 'deptstate', 'trouble', 'jobanalysis',
// 'jobplan', 'comment', 'createid', 'createtime',
// 'lasteditid', 'lastedittime','depname'
// /*,'appUser.username','appUser2.username'*/]
// })
// });
// return store;
// };
