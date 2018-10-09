/**
 * @author:
 * @class ExpenseAccountCompanyView
 * @extends Ext.Panel
 * @description [ExpenseAccountCompany]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
ExpenseAccountCompanyView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ExpenseAccountCompanyView.superclass.constructor.call(this, {
					id : 'ExpenseAccountCompanyView',
					title : '公司费用报销管理',
					region : 'center',
					layout : 'fit',
					items : [this.searchPanel, this.gridPanel]
				});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		
	var dataStatus = [['0', '报销申请中'], ['1', '运营公司签核中'],['2','总公司签核中'],['3','签核结束'],['','全部']];	

		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel({
					layout : 'form',
					region : 'north',
					colNums : 3,
					items : [ /*
								 * { fieldLabel : 'applicantId', name :
								 * 'Q_applicantId_L_EQ', flex : 1, xtype :
								 * 'numberfield' },
								 */{
								fieldLabel : '申请日期',
								name : 'Q_applyDate_D_EQ',
								flex : 1,
								xtype : 'datefield',
								format : 'Y-m-d',
								width:200
							
							},/*,{
								fieldLabel : '预算项目代码',
								name : 'Q_budgetProjectCode_S_LK',
								flex : 1,
								xtype : 'textfield',
								width:200
							}*//*
								 * { fieldLabel : 'depId', name :
								 * 'Q_depId_L_EQ', flex : 1, xtype :
								 * 'numberfield' }, { fieldLabel :
								 * 'applyReason', name : 'Q_applyReason_S_EQ',
								 * flex : 1, xtype : 'textfield' },
								 */ /*{
								fieldLabel : '收款单位代码',
								name : 'Q_outerCompanyCode_S_LK',
								flex : 1,
								xtype : 'textfield',
								width:200
							},*/ /*
								 * { fieldLabel : 'budgetType', name :
								 * 'Q_budgetType_SN_EQ', flex : 1, xtype :
								 * 'numberfield' },
								 */{
								fieldLabel : '合同编号',
								name : 'Q_compactId_S_LK',
								flex : 1,
								xtype : 'textfield',
								width:200
							}, {
								fieldLabel : '预算项目名称',
								name : 'Q_budgetProjectName_S_LK',
								flex : 1,
								xtype : 'textfield',
								width:200
							}, /*
								 * { fieldLabel : 'budgetProjectAccount', name :
								 * 'Q_budgetProjectAccount_S_EQ', flex : 1,
								 * xtype : 'textfield' }, { fieldLabel :
								 * 'usedAccount', name : 'Q_usedAccount_S_EQ',
								 * flex : 1, xtype : 'textfield' }, { fieldLabel :
								 * 'planPayment', name : 'Q_planPayment_S_EQ',
								 * flex : 1, xtype : 'textfield' }, { fieldLabel :
								 * 'paymentType', name : 'Q_paymentType_S_EQ',
								 * flex : 1, xtype : 'textfield' }, { fieldLabel :
								 * 'applyAccount', name : 'Q_applyAccount_S_EQ',
								 * flex : 1, xtype : 'textfield' },
								 */{
								fieldLabel : '收款单位名称',
								name : 'Q_outerCompanyName_S_LK',
								flex : 1,
								xtype : 'textfield',
								width:200
							},/*{
								fieldLabel : '月度基金计划序号',
								name : 'Q_monthAccountId_L_LK',
								flex : 1,
								xtype : 'numberfield',
								width:200
							},*/{			
				xtype : 'combo',
				hiddenName : 'Q_status_SN_EQ',
				fieldLabel : '签核状态',
				valueField : 'value1',
				displayField : 'name1',
				mode : 'local',
				width : 160,
				editable : false,
				triggerAction : 'all',
				forceSelection : true,
				store : new Ext.data.SimpleStore({
					// url : __ctxPath +
					// '/admin/getBoardrooConference.do',
					// autoLoad : true,
					fields : ['value1', 'name1'],
					data : dataStatus
				})
		
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
								iconCls : 'btn-add',
								text : '添加',
								xtype : 'button',
								scope : this,
								handler : this.createRs
							}, {
								iconCls : 'btn-del',
								text : '删除',
								xtype : 'button',
								scope : this,
								handler : this.removeSelRs
							}]
				});

		this.gridPanel = new HT.GridPanel({
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'ExpenseAccountCompanyGrid',
			url : __ctxPath + "/admin/listExpenseAccountCompany.do",

			fields : [{
						name : 'id',
						type : 'int'
					},'applyName','applyId','compactId', 'applyDate', 'department.depName', 'compactId','budgetProjectName','budgetProjectAccount',
					'usedAccount','applyAccount','outerCompanyCode','outerCompanyName','status','createDate',
					'expenseCompanyFiles'],
			columns : [{
						header : 'id',
						dataIndex : 'id',
						hidden : true
					}, /*{
						header : '经办人',
						dataIndex : 'appUser',
						renderer:function(appUser){
						return   "<span>"+appUser.fullname +"("+appUser.username +")"  +"</span>";
						
						
						}
					},*/{
					header : '经办人代码',
					dataIndex : 'applyId'
										
					},{
					header : '经办人姓名',
					dataIndex : 'applyName'
				/*	renderer:function(applyName){
					return   "<span>"+applyName +"("+Ext.getCmp('') +")"  +"</span>";
					}	*/				
					}, {
						header : '申请日期',
						dataIndex : 'applyDate',
						format:'yyyy-mm-dd'
					}, {
						header : '申请付款部门',
						dataIndex : 'department.depName'
					/*	renderer:function(value){
						    if(value!=null){
						    alert("--value---"+value);
						    	return "<span>"+ department.depName+ "</span>"
						    }
						
						
						}*/
					},/* {
						header : '事由',
						dataIndex : 'applyReason'
					}, */{
						header : '合同编号',
						dataIndex : 'compactId'
					},/* {
						header : '月度基金计划序号',
						dataIndex : 'monthAccountId'
					}, {
						header : '预算性质',
						dataIndex : 'budgetType'
					}, {
						header : '预算项目代码',
						dataIndex : 'budgetProjectCode'
					},*/ {
						header : '预算项目名称',
						dataIndex : 'budgetProjectName'
					}, /*{
						header : '项目预算金额',
						dataIndex : 'budgetProjectAccount'
					}, {
						header : '累计已用金额',
						dataIndex : 'usedAccount'
					},  {
						header : '预付款金额',
						dataIndex : 'planPayment'
					},{
						header : '付款方式',
						dataIndex : 'paymentType'
					},*/ {
						header : '本次申请金额',
						dataIndex : 'applyAccount'
					},{
				header : '预算性质',
				dataIndex : 'budgetType',
				renderer : function(value) {
									if (value == 1) {
										return "<font color=\"#000000\">预算内</font>";
									}
									else {
										return "<font color=\"#000000\">预算外</font>";
									}
								}
			},/* {
						header : '收款单位代码',
						dataIndex : 'outerCompanyCode'
					},*/ {
						header : '收款单位名称',
						dataIndex : 'outerCompanyName'
					}, /*{
						header : '开户银行',
						dataIndex : 'bankName'
					}, {
						header : '银行账号',
						dataIndex : 'bankCode'
					}, {
						header : '授权范围',
						dataIndex : 'power'
					}, {
						header : '备注',
						dataIndex : 'remark'
					},*/ {
						header : '签核状态',
						dataIndex : 'status',
							renderer:function(value){
						if(value==0){
					return "<font color=\"#000000\">报销申请中</font>";						
				}
				if(value==3){
					
					return "<font color=\"#800000\">签核结束</font>";
				}
				if(value==1){
					return "<font color=\"#000000\">运营公司签核中</font>";
					
				}
				else{
					
					return "<font color=\"#000000\">总公司签核中</font>";
				}
						
					}
					}, /*{
					}
					
						header : 'isDeleted',
						dataIndex : 'isDeleted'
					}, {
						header : '创建日期',
						dataIndex : 'createDate',
						format:'yyyy-mm-dd h:i:s'
					},*/ new Ext.ux.grid.RowActions({
								header : '管理',
								width : 100,
								actions : [{
											iconCls : 'btn-del',
											qtip : '删除',
											style : 'margin:0 3px 0 3px'
										}, {
											iconCls : 'btn-edit',
											qtip : '编辑',
											style : 'margin:0 3px 0 3px'
										}],
								listeners : {
									scope : this,
									'action' : this.onRowAction
								}
							})]
				// end of columns
			});

		this.gridPanel.addListener('rowdblclick', this.rowClick);

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
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
					new ExpenseAccountCompanyForm({
								id : rec.data.id
							}).show();
				});
	},
	// 创建记录
	createRs : function() {
	
		new ExpenseAccountCompanyForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel({
					url : __ctxPath + '/admin/multiDelExpenseAccountCompany.do',
					ids : id,
					grid : this.gridPanel
				});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs({
					url : __ctxPath + '/admin/multiDelExpenseAccountCompany.do',
					grid : this.gridPanel,
					idName : 'id'
				});
	},
	// 编辑Rs
	editRs : function(record) {
		var docId=record.data.expenseCompanyFiles;
		var id = record.data.id;
		
			new ExpenseAccountCompanyForm({
			id:record.data.id
			
			}).show();
	/*	new ExpenseAccountCompanyForm({
					id : record.data.id,
					docId:docId
				}).show();*/
		
	//ExpenseCompanyDetail.show(id);
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
			case 'btn-del' :
				this.removeRs.call(this, record.data.id);
				break;
			case 'btn-edit' :
				this.editRs.call(this, record);
				break;
			default :
				break;
		}
	}
});
