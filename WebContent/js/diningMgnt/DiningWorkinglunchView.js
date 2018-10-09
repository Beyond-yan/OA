/**
 * @author:
 * @class DiningWorkinglunchView
 * @extends Ext.Panel
 * @description [DiningWorkinglunch]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
DiningWorkinglunchView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		DiningWorkinglunchView.superclass.constructor.call(this, {
			id : 'DiningWorkinglunchView',
			title : '工作餐订餐管理',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化搜索条件Panel
		
		var combomealtype = new Ext.form.ComboBox({
			fieldLabel : '用餐类型',
			hiddenName : 'Q_diningMealtype.id_L_EQ',
			id:'DWLVmealtypeid',
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
						fields : [ 'id','typename' ]			
					})		
		});

		var foodtypestore = new Ext.data.SimpleStore(
				{
					autoLoad : true,
					url : __ctxPath + '/diningMgnt/comboDiningFoodtype.do',
					fields : [ 'id','foodtypename' ],
					listeners : {
						load : function() {
								Ext.getCmp('DWLVfoodtypeid')
									.setValue(Ext.getCmp('DWLVfoodtypeid').getValue());
						}
					}									
				});		
		var combofoodtype = new Ext.form.ComboBox({
			fieldLabel : '用餐类别:',
			hiddenName : 'Q_diningFoodtype.id_L_EQ',
			id:'DWLVfoodtypeid',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : true,
			triggerAction : 'all',
			displayField : 'foodtypename',
			valueField : 'id',
			mode : 'local',
			store : foodtypestore
		});
		
		combomealtype.on('select',function(combobox){
						
			foodtypestore.load({params:{
				'Q_diningMealtype.id_L_EQ':combobox.getValue(),
				'Q_category_S_EQ':'工作餐'}});
			combofoodtype.setValue('');
		});
				
		this.searchPanel = new HT.SearchPanel( {
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel : '申请部门',
				hiddenName : 'Q_department.depId_L_EQ',
				id : 'DWLVcombofoodtype',
				flex : 1,
				width : 200,
				xtype : 'combo',
				editable : false,
				allowBlank : true,
				triggerAction : 'all',
				displayField : 'depname',
				valueField : 'depid',
				mode : 'local',
				store : new Ext.data.SimpleStore(
						{
							autoLoad : true,
							url : __ctxPath + '/system/comboDepartment.do',
							fields : [ 'depid',
									'depname' ]
						})
			}, {
				fieldLabel : '申请人:',
				name : 'Q_appUser.fullname_S_LK',
				flex : 1,
				width:200,
				xtype : 'textfield'
			}, {
				fieldLabel : '用餐日期:',
				name : 'Q_dinedate_D_EQ',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d',
				width:200
			},  combomealtype, combofoodtype,
			{
				fieldLabel : '供餐食堂',
				hiddenName : 'Q_diningroom_S_EQ',
				id:'DiningReceptiondiningroom',
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
							fields : [ 'configname','configname' ]
						})
			}
			],
			buttons : [ {
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
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
				text : '添加',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			}
//			, {
//				iconCls : 'btn-del',
//				text : '删除',
//				xtype : 'button',
//				scope : this,
//				handler : this.removeSelRs
//			}
			]
		});

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'DiningWorkinglunchGrid',
			url : __ctxPath + "/diningMgnt/listDiningWorkinglunch.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}
			,{name:'runId',mapping:'processRun ? obj.processRun.runId : null'}
			,{name:'defId',mapping:'processRun ? obj.processRun.proDefinition.defId : null'}
			,{name:'piId',mapping:'processRun ? obj.processRun.piId : null'}
			,{name:'subject',mapping:'processRun ? obj.processRun.subject : null'}
			,
			'department.depName', 'appUser.fullname', 'dinedate', 'diningMealtype.typename',
					'diningFoodtype.foodtypename', 'dinetimes', 'dinereason', 'dinenumber',
					'dineplace', 'costlevel','status','diningroom' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '申请部门',
				dataIndex : 'department.depName'
			}, {
				header : '申请人',
				dataIndex : 'appUser.fullname'
			}, {
				header : '供餐食堂',
				dataIndex : 'diningroom'
			},{
				header : '用餐日期',
				dataIndex : 'dinedate'
			}, {
				header : '用餐类别',
				dataIndex : 'diningMealtype.typename'
			}, {
				header : '用餐级别',
				dataIndex : 'diningFoodtype.foodtypename'
			}, {
				header : '用餐次数',
				dataIndex : 'dinetimes'
			}, {
				header : '订工作餐事由',
				dataIndex : 'dinereason'
			}, {
				header : '用餐人数',
				dataIndex : 'dinenumber'
			}, {
				header : '用餐地点',
				dataIndex : 'dineplace'
			}, {
				header : '实际费用',
				dataIndex : 'costlevel'
			}
			, {
				header : '审批状态',
				dataIndex : 'status',
				renderer : function(value) {
					if (value == '1') {
						return '<font color="green">审批中</font>';
					}
					if (value == '2') {
						return '<font color="red">审批通过</font>';
					}
					if (value == '4') {
						return '终止';
					}
				}
			}
			, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ 
				{
					iconCls : 'btn-stop',
					qtip : '终止流程',
					style : 'margin:0 3px 0 3px'
				},{
					 iconCls : 'btn-flowView',
					 qtip : '查看',
					 style : 'margin:0 3px 0 3px'
					 }],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		// end of columns
				});

//		this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search( {
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new DiningWorkinglunchForm( {
				id : rec.data.id
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		var defId = FlowDefIdPro.diningworkingId;
		var flowName = FlowDefIdPro.diningworkingName;
		DiningWorkinglunchView.applyNewFlow(defId, flowName);
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/diningMgnt/multiDelDiningWorkinglunch.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/diningMgnt/multiDelDiningWorkinglunch.do',
			grid : this.gridPanel,
			idName : 'id'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new DiningWorkinglunchForm( {
			id : record.data.id
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.id);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		case 'btn-stop':
			if(record.data.status!=1){
				Ext.MessageBox.show( {
					title : '操作信息',
					msg : '注意:<font color="red">审批中</font>的流程才能终止！',
					buttons : Ext.MessageBox.OK,
					icon : 'ext-mb-error'
				});
				break;
			}
			this.endSealed.call(this, record.data.id,record.data.piId);
			break;
		case 'btn-flowView':
			this.showProcess.call(this, record);
			break;
			
		default:
			break;
		}
	},
	showProcess :function(record) {
		var runId = record.data.runId;
		var defId = record.data.defId;
		var piId = record.data.piId;
		var subject = record.data.subject;
		DiningWorkinglunchView.proDetail(runId, defId, piId, subject);
	},
	
	endSealed:function(id, piId) {
		Ext.Msg.confirm('提示', '确定终止该流程？', function(btn, text){
			if (btn == 'yes'){
				// 修改数据库的审核状态
				Ext.Ajax.request( {
					url : __ctxPath + '/flow/stopProcessRun.do',
					params : {
						'piId' : piId
					},
					success : function(resp, options) {
						Ext.ux.Toast.msg('操作信息', '操作成功');
//						Ext.getCmp('DiningWorkinglunchGrid').getStore().reload();
					},
					failure : function(response) {
						Ext.Msg.alert("提示", "终止失败！");
					}
				});
				Ext.Ajax.request( {
					url : __ctxPath + '/diningMgnt/saveDiningWorkinglunch.do',
					params : {
						'diningWorkinglunch.id' : id,
						'diningWorkinglunch.status' : 4
					},
					success : function(resp, options) {
						Ext.getCmp('DiningWorkinglunchGrid').getStore().reload();
					}
				});
			}
		});
		
	}
	
	
});
DiningWorkinglunchView.applyNewFlow = function(defId, name) {
//	 alert(defId);
//	 alert(name);
	var contentPanel = App.getContentPanel();
	var startForm = contentPanel.getItem('ProcessRunStart' + defId);
	if (startForm == null) {
		startForm = new ProcessRunStart( {
			id : 'ProcessRunStart' + defId,
			defId : defId,
			flowName : name
		});
		contentPanel.add(startForm);
	}
	contentPanel.activate(startForm);
};

/**
 * 显示明细
 * 
 * @param {}
 *            runId
 * @param {}
 *            name
 */
DiningWorkinglunchView.proDetail = function(runId, defId, piId, name) {
	var contentPanel = App.getContentPanel();
	var detailView = contentPanel.getItem('ProcessRunDetail' + runId);
	if (detailView == null) {
		detailView = new ProcessRunDetail(runId, defId, piId, name);
		contentPanel.add(detailView);
	}
	contentPanel.activate(detailView);
};
