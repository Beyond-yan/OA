Ext.ns('InvitationContractView');

InvitationContractView = Ext.extend(Ext.Panel, {
	// 条件搜索Panel
	searchPanel : null,
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
		InvitationContractView.superclass.constructor.call(this, {
					id : 'InvitationContractView',
					title : '合同管理',
					iconCls : 'menu-Contract',
					region : 'center',
					layout : 'border',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	
	// 初始化组件
	initUIComponents : function() {
		var sumAlreadyPay ;
		var sumTotalAmount;
		var dataStatus = [['1', '是'], ['0', '否'],['','全部']];	
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
			id : 'ContractSearchForm',
			region : 'north',
			layout : 'form',
			frame:true,
			items : [{
				layout : 'column',
				items : [{
							columnWidth : 0.25,
							layout : 'form',
							items : [{
									    fieldLabel : '合同主题',
										xtype : 'textfield',
										width : 80,
										name : 'Q_contractTheme_S_LK'
									}, {
									    fieldLabel : '项目金额大于等于',
										xtype : 'textfield',
										width : 80,
										name : 'Q_contractMoney_BD_GE'
									}, {
									    fieldLabel : '采购平台',
										xtype : 'textfield',
										width : 80,
										name : 'Q_purPlatform_S_LK'
									}]
						}, {
							columnWidth : 0.25,
							layout : 'form',
							items : [{
									    fieldLabel : '项目主办部门',
										xtype : 'textfield',
										width : 80,
										name : 'Q_undertakerDepartment_S_LK'
									}, {
									    fieldLabel : '项目金额小于等于',
										xtype : 'textfield',
										width : 80,
										name : 'Q_contractMoney_BD_LE'
									}, {
									    fieldLabel : '合同经办人',
										xtype : 'textfield',
										width : 80,
										name : 'Q_draftsman_S_LK'
									}]
						}, {
							columnWidth : 0.25,
							layout : 'form',
							items : [/*{
 									    fieldLabel : '是否已执行完成',
										xtype : 'textfield',
										width : 80,
										name : 'Q_isFinished_S_LK'
									},*/ //20121115
								    {												
											xtype : 'combo',
											hiddenName : 'Q_isFinished_SN_EQ',
											fieldLabel : '是否已执行完成',
											valueField : 'value1',
											displayField : 'name1',
											mode : 'local',
											width : 80,
											editable : false,
											triggerAction : 'all',
											forceSelection : true,
											store : new Ext.data.SimpleStore({													
												fields : ['value1', 'name1'],
												data : dataStatus
											})
									},{
									   fieldLabel : '采购方式',
										xtype : 'textfield',
										width : 80,
										name : 'Q_purchaseType_S_LK'
									}, {
									    fieldLabel : '年份',
										xtype : 'textfield',
										width : 80,
										name : 'Q_year_S_LK'
									}]
						}, {
							columnWidth : 0.25,
							layout : 'form',
							items : [{
									  fieldLabel : '项目主办人',
										xtype : 'textfield',
										width : 80,
										name : 'Q_undertaker_S_LK'
									}, {
									    fieldLabel : '合同类别',
										xtype : 'textfield',
										width : 80,
										name : 'Q_contractType_S_LK'
									}, {
										xtype : 'button',
										text : '查询',
										iconCls : 'search',
										handler : function() {
											var searchPanel = Ext
													.getCmp('ContractSearchForm');
											var gridPanel = Ext
													.getCmp('InvitationContractGrid');
											if (searchPanel.getForm().isValid()) {
												$search({
															searchPanel : searchPanel,
															gridPanel : gridPanel
														});
											}

										}
									}]
						}]

			}]
		});// end of the searchPanel

		this.store = new Ext.data.JsonStore({
			url : __ctxPath + '/invitation/listInvitationContract.do'
			root : 'result',
			totalProperty : 'totalCounts',
			fields : [{
						name : 'contractId',
						type : 'int'
					}, 'contractNo', 'contractTheme',
					'contractType', 'draftsman',
					'undertaker', 'year', 'alreadyPay',
					'contractMoney','sumTotalAmount','sumAlreadyPay']
					remoteSort : true});// end of the store			
		this.store.setDefaultSort('contractId', 'desc');
		this.store.load();
		this.store.on('load', function(store, record, opts) {
					
					 var total = store.getTotalCount();
					    sumAlreadyPay =0;
		                sumTotalAmount=0;
		             if(total>0){		             	
		                 var record = store.getAt(0);
						 sumAlreadyPay = record.get('sumAlreadyPay');
						 sumTotalAmount = record.get('sumTotalAmount');						  		             	
		             }
		            /*
					for (var i = 0; i < total; i++) {
						var record = store.getAt(i);
						var alreadyPay = Number(record.get('alreadyPay'));
						var contractMoney = Number(record.get('contractMoney'));
						sumAlreadyPay = sumAlreadyPay + alreadyPay;
						sumTotalAmount = sumTotalAmount + contractMoney;
					}
					
					var s=String(sumTotalAmount);
					if(s.indexOf('.')!=-1){
					var sArray=(s.split('.'));
					  s=sArray[0]+'.'+sArray[1].substring(0,2);
					}
					var s2=String(sumAlreadyPay);
					if(s2.indexOf('.')!=-1){
					
					var s2Array=s2.split('.');
					  s2=s2Array[0]+'.'+s2Array[1].substring(0,2);					
					
					}
					*/			       
			        
			        
					Ext.getCmp('InvitationContractView.sumTotalAmount')
							.setValue(sumTotalAmount);
					Ext.getCmp('InvitationContractView.sumAlreadyPay')
							.setValue(sumAlreadyPay);
				});
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
			columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'contractId',
						dataIndex : 'contractId',
						hidden : true
					}, {
						header : '合同编号',
						dataIndex : 'contractNo'
					}, {
						header : '合同主题',
						dataIndex : 'contractTheme'
					}, {
						header : '合同类别',
						dataIndex : 'contractType'
					}, {
						header : '合同经办人',
						dataIndex : 'draftsman'
					}, {
						header : '项目主办人',
						dataIndex : 'undertaker'
					}, {
						header : '年份',
						dataIndex : 'year'
					}, {
						header : '已付款金额累计',
						dataIndex : 'alreadyPay'
					}, {
						header : '合同总价款',
						dataIndex : 'contractMoney'
					}, {
						header : '管理',
						dataIndex : 'year',
						width : 50,
						sortable : false,
						renderer : function(value, metadata, record, rowIndex,
								colIndex) {
							var editId = record.data.contractId;
							var str = '';
								str = '<button title="删除" value=" " class="btn-del" onclick="InvitationContractView.remove('
										+ editId + ')">&nbsp</button>';
								str += '&nbsp;<button title="编辑" value=" " class="btn-edit" onclick="InvitationContractView.edit('
										+ editId + ')">&nbsp</button>';
							return str;
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 100
			}
		});// end of the cm

		this.topbar = new Ext.Toolbar({
					id : 'ContractFootBar',
					height : 30,
					bodyStyle : 'text-align:left',
					items : []
				});
		// if (isGranted('_ContractAdd')) {
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '添加合同',
					handler : function() {
						new InvitationContractForm().show();
					}
				}));

		// };
		// if (isGranted('_ContractDel')) {
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-del',
					text : '删除合同',
					handler : function() {

						var grid = Ext.getCmp("InvitationContractGrid");

						var selectRecords = grid.getSelectionModel()
								.getSelections();

						if (selectRecords.length == 0) {
							Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
							return;
						}
						var ids = Array();
						for (var i = 0; i < selectRecords.length; i++) {
							ids.push(selectRecords[i].data.contractId);
						}

						InvitationContractView.remove(ids);
					}
				}));
		// };
		this.topbar.add(new Ext.form.Label({
					text : '合同总价合计:'
				}));
		this.topbar.add(new Ext.form.TextField({
					id : 'InvitationContractView.sumTotalAmount',
					readOnly : true,
					width : 120

				}));
		this.topbar.add(new Ext.form.Label({
					text : '  已付款金额合计:'
				}));
		this.topbar.add(new Ext.form.TextField({
					id : 'InvitationContractView.sumAlreadyPay',
					readOnly : true,
					width : 120
				}));

		// end of the topbar

		this.gridPanel = new Ext.grid.GridPanel({
					id : 'InvitationContractGrid',
					tbar : this.topbar,
					region : 'center',
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					autoHeight : true,
					cm : cm,
					sm : sm,
					viewConfig : {
						forceFit : true,
						enableRowBody : false,
						showPreview : false
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

		this.gridPanel.addListener('rowdblclick', function(grid, rowindex, e) {
					grid.getSelectionModel().each(function(rec) {
								if (isGranted('_ContractEdit')) {
									InvitationContractView
											.edit(rec.data.contractId);
								}
							});
				});
	}// end of the initUIComponents
});
/**
 * 删除单个记录
 */
InvitationContractView.remove = function(id) {
	var grid = Ext.getCmp("InvitationContractGrid");
	Ext.Msg
			.confirm(
					'信息确认',
					'删除标案，则标案下的<font color="red">附件</font>及<font color="red">相关信息</font>也删除，您确认要删除该记录吗？',
					function(btn) {
						if (btn == 'yes') {
							Ext.Ajax.request({
								url : __ctxPath
										+ '/invitation/multiDelInvitationContract.do',
								params : {
									ids : id
								},
								method : 'post',
								success : function() {
									Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
									grid.getStore().reload({
												params : {
													start : 0,
													limit : 25
												}
											});
								}
							});
						}
					});
};

/**
 * 
 */
InvitationContractView.edit = function(id) {
	new InvitationContractForm({
				contractId : id
			}).show();
};
