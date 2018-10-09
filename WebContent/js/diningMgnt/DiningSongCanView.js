/**
 * @author:
 * @class DiaryView
 * @extends Ext.Panel
 * @description [Diary]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
function searchSong() {
	var grid = this.gridPanel;
	if (this.searchPanel.getForm().isValid()) {
		this.searchPanel
				.getForm()
				.submit(
						{
							waitMsg : '正在提交查询',
							url : __ctxPath + '/diningMgnt/songCanlist2DiningBooking.do',
							success : function(formPanel,
									action) {
								var result = Ext.util.JSON
										.decode(action.response.responseText);
								grid.getStore().loadData(
										result);
							}
						});
	}
}
function $postConfirm(conf) {
	if (conf.isOutRange == 1) {
		Ext.MessageBox.show( {
			title : '警告',
			msg : '您好，您只能对当天及当天以前的订餐进行送餐确认！',
			buttons : Ext.MessageBox.OK,
			icon : 'ext-mb-warning'
		});
		return;
	}
	Ext.Msg.confirm('信息确认', '确认记录会引起计费和扣费，您确认要确认所选记录吗？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request( {
				url : conf.url,
				params : {
					'Q_diningBooking.menudate_D_EQ' : conf.menudate,
					'Q_diningBooking.diningroom_S_EQ' : conf.dineroom,
					'Q_diningBooking.dineplace_S_EQ' : conf.dineplace,
					'Q_diningBooking.deptid_L_EQ' : conf.deptid,
					'Q_diningBooking.mealtypeid_L_EQ' : conf.mealtype
				},
				method : 'POST',
				success : function(response, options) {
					Ext.ux.Toast.msg('操作信息', '成功确认该记录！');
					if (conf.callback) {
						conf.callback.call(this);
						return;
					}
					if (conf.grid) {
						// conf.grid.getStore().reload();
						// alert("click search button");
						// Ext.getCmp('btnSearchSongCan').click(this,);
						var myButton = Ext.getCmp('btnSearchSongCan');
						myButton.handler.call(myButton.scope, myButton, Ext.EventObject);	
			}
		},
		failure : function(response, options) {
			Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
		}
			});
		}
	});
}
function $confirmGridRs(conf) {
	var ids = $getGdSelectedIds(conf.grid, conf.idName);
	if (ids.length == 0) {
		Ext.ux.Toast.msg("操作信息", "请选择要确认的记录！");
		return;
	}
	var params = {
		url : conf.url,
		ids : ids,
		grid : conf.grid
	};
	// $postDel(params);
}

DiningSongCanView = Ext
		.extend(
				Ext.Panel,
				{
					// 构造函数
					constructor : function(_cfg) {
						Ext.applyIf(this, _cfg);
						// 初始化组件
						this.initUIComponents();
						// 调用父类构造
						DiningSongCanView.superclass.constructor.call(this, {
							id : 'DiningSongCanView',
							title : '送餐汇总表',
							region : 'center',
							layout : 'border',
							items : [ this.searchPanel, this.gridPanel ]
						});
					},// end of constructor
					// 初始化组件
					initUIComponents : function() {
						var combomealtype = new Ext.form.ComboBox(
								{
									fieldLabel : '订餐类别:',
									hiddenName : 'diningBooking.mealtypeid',
									id : 'DBSendmealtypeid',
									flex : 1,
									width : 150,
									xtype : 'combo',
									editable : false,
									allowBlank : true,
									triggerAction : 'all',
									displayField : 'typename',
									valueField : 'id',
									mode : 'local',
									store : new Ext.data.SimpleStore(
											{
												autoLoad : true,
												url : __ctxPath + '/diningMgnt/comboDiningMealtype.do',
												fields : [ 'id', 'typename' ]
											})
								});
						// 初始化搜索条件Panel
						this.searchPanel = new HT.SearchPanel(
								{
									layout : 'form',
									id : 'DiningSongCanForm',
									region : 'north',
									colNums : 3,
									items : [
											{
												fieldLabel : '订餐日期',
												name : 'menudate',
												id : 'DiningSendmenudate',
												flex : 1,
												xtype : 'datefield',
												format : 'Y-m-d',
												editable : false,
												value : new Date(),
												width : 130
											},
											{
												fieldLabel : '供餐食堂:',
												hiddenName : 'diningroom',
												id : 'DBSenddiningroom',
												flex : 1,
												width : 150,
												xtype : 'combo',
												editable : false,
												allowBlank : true,
												triggerAction : 'all',
												displayField : 'configname',
												valueField : 'configname',
												mode : 'local',
												store : new Ext.data.SimpleStore(
														{
															autoLoad : true,
															url : __ctxPath + '/diningMgnt/getDiningRoomComboDiningBooking.do',
															fields : [
																	'configname',
																	'configname' ]
														})
											}, combomealtype
									/*
									 * { xtype : 'radiogroup', fieldLabel :
									 * '类别', width : 500, flex:1, items : [{
									 * boxLabel : '早餐', name : 'mealtypeid',
									 * inputValue : 10, checked : true }, {
									 * boxLabel : '午餐', name : 'mealtypeid',
									 * inputValue : 11 }, { boxLabel : '晚餐',
									 * name : 'mealtypeid', inputValue : 12 }, {
									 * boxLabel : '夜宵', name : 'mealtypeid',
									 * inputValue : 13 }, { boxLabel : '其他',
									 * name : 'mealtypeid', inputValue : 15 }] }
									 */],
									buttons : [ {
										text : '查询',
										scope : this,
										iconCls : 'btn-search',
										id : 'btnSearchSongCan',
										handler : searchSong
									}, {
										text : '重置',
										scope : this,
										iconCls : 'btn-reset',
										handler : this.reset
									} ]
								});// end of searchPanel

						this.topbar = new Ext.Toolbar( {
							items : [ {
								iconCls : 'btn-add',
								text : '导出Excel',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							} ]
						});

						// 查询列表
						this.gridPanel = new HT.GridPanel(
								{
									region : 'center',
									tbar : this.topbar,
									// 使用RowActions
									rowActions : true,
									id : 'DiaryGrid',
									url : __ctxPath
											+ "/diningMgnt/songCanlist2DiningBooking.do",
									fields : [ 'dineplace', 'sitename',
											'deptid', 'depname', 'mealtypeid',
											'typeName', {
												name : 'totalamount',
												type : 'int'
											}, 'menudate', 'diningroom',
											'isSent', 'isOutRange' ],
									columns : [/*
												 * { header : 'diaryId',
												 * dataIndex : 'diaryId', hidden :
												 * true },
												 */
											{
												header : 'mealtypeid',
												dataIndex : 'mealtypeid',
												hidden : true
											},
											{
												header : 'deptid',
												dataIndex : 'deptid',
												hidden : true
											},
											{
												header : '站点名称',
												dataIndex : 'dineplace',
												sortable : true
											},
											{
												header : '供餐食堂',
												dataIndex : 'diningroom'
											},
											{
												header : '部门名称',
												dataIndex : 'depname'
											},
											{
												header : '类别',
												dataIndex : 'typeName'
											},
											{
												header : '数量',
												dataIndex : 'totalamount'
											},
											{
												header : '订餐日期',
												dataIndex : 'menudate'
											},
											{
												header : '状态',
												dataIndex : 'isSent',
												hidden : true
											},
											{
												header : '以后日期',
												dataIndex : 'isOutRange',
												hidden : true
											},
											{
												header : '状态',
												dataIndex : 'isSent',
												renderer : function(value) {
													if (value == '0') {
														return '<a style="color:red;">未送餐</a>';
													} else {
														return '<a style="color:green;">已送餐</a>';
													}
												}
											},
											new Ext.ux.grid.RowActions(
													{
														header : '',
														width : 100,
														actions : [
																{
																	iconCls : 'btn-showDetail',
																	qtip : '查看订餐明细',
																	style : 'margin:0 3px 0 3px'
																},
																{
																	iconCls : 'btn-ok',
																	qtip : '送餐确认',
																	style : 'margin:0 3px 0 3px',
																	hideIndex : 'isSent'
																} ],
														listeners : {
															scope : this,
															'action' : this.onRowAction
														}
													}) ]
								// end of columns
								});

					},// end of the initComponents()

					// 重置查询表单
					reset : function() {
						this.searchPanel.getForm().reset();
					},
					// GridPanel行点击处理事件
					rowClick : function(grid, rowindex, e) {
						grid.getSelectionModel().each(function(rec) {
							new DiaryForm( {
								diaryId : rec.data.diaryId
							}).show();
						});
					},
					// 创建记录
					createRs : function() {

						var recordCount = this.gridPanel.getStore().getCount();
						if (recordCount > 0) {
							// 导出Excel
							Ext.Ajax
									.request( {
										url : __ctxPath + '/diningMgnt/songCanlistDiningBooking.do',
										success : function(response) {
											// 重新加载数据源
											var result = Ext.util.JSON
													.decode(response.responseText);
											importResult = '<br/><br/><center><A href='
													+ __ctxPath
													+ '/excel/'
													+ result.downLoadPath
													+ '>下载</A></center>'
											Ext.Msg.alert("提示",
													"文件导出成功，请点击下面的链接下载！"
															+ importResult);
										},
										failure : function(response) {
											Ext.Msg.alert("提示", "导出失败！");
										},
										params : {
											'menudate' : Ext.util.Format
													.date(
															Ext
																	.getCmp(
																			'DiningSendmenudate')
																	.getValue(),
															'Y-m-d'),
											'mealtypeid' : Ext.getCmp(
													'DBSendmealtypeid')
													.getValue()
										}
									});
						} else {
							Ext.Msg.alert("提示", "没有数据需要导出！")
						}

					},
					// 按ID删除记录
					removeRs : function(id) {
						$postDel( {
							url : __ctxPath + '/system/multiDelDiary.do',
							ids : id,
							grid : this.gridPanel
						});
					},
					// 把选中ID删除
					removeSelRs : function() {
						$delGridRs( {
							url : __ctxPath + '/system/multiDelDiary.do',
							grid : this.gridPanel,
							idName : 'diaryId'
						});
					},

					// 确认送餐
					confirmRs : function(record) {
						$postConfirm( {
							url : __ctxPath + '/diningMgnt/multiConfirmDiningBookingDetail.do',
							menudate : record.data.menudate,
							dineroom : record.data.diningroom,
							dineplace : record.data.dineplace,
							deptid : record.data.deptid,
							mealtype : record.data.mealtypeid,
							grid : this.gridPanel,
							isOutRange : record.data.isOutRange
						});
					},
					// 确认多个送餐记录
					confirmSelRs : function() {
						$confirmGridRs( {
							url : __ctxPath + '/system/multiConfirm.do',
							guid : this.gridPanel,
							menudate : record.data.menudate,
							dineroom : record.data.diningroom,
							dineplace : record.data.dineplace,
							deptid : record.data.deptid,
							mealtype : record.data.mealtypeid
						});
					},

					// 显示对应的订餐记录

					showdetail : function(record) {
						new DiningBookingDtlSongCan( {
							menudate : record.data.menudate,
							dineroom : record.data.diningroom,
							dineplace : record.data.dineplace,
							deptid : record.data.deptid,
							mealtype : record.data.mealtypeid
						}).show();
					},

					// 编辑Rs
					editRs : function(record, startTime, endTime) {
						new DiaryForm( {
							diaryId : record.data.diaryId,
							startTime : startTime,
							endTime : endTime
						}).show();
					},
					// 行的Action
					onRowAction : function(grid, record, action, row, col) {
						switch (action) {
						case 'btn-del':
							this.removeRs.call(this, record.data.diaryId);
							break;
						case 'btn-edit':
							var startTime = grid.getStore().getAt(row).get(
									'onDutyTime');
							var endTime = grid.getStore().getAt(row).get(
									'offDutyTime');
							this.editRs.call(this, record, startTime, endTime);
							break;
						case 'btn-showDetail':
							this.showdetail.call(this, record);
							break;
						case 'btn-ok':
							this.confirmRs.call(this, record);
							break;
						default:
							break;
						}
					}
				});
