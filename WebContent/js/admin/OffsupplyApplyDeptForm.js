/**
 * @author
 * @createtime
 * @class OffsupplyApplyDeptForm
 * @extends Ext.Window
 * @description OffsupplyApplyDept表单
 * @company 捷达世软件
 */
OffsupplyApplyDeptForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		OffsupplyApplyDeptForm.superclass.constructor.call(this, {
			id : 'OffsupplyApplyDeptFormWin',
			layout : 'fit',
			items : this.gridPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '督办申请管理详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, {
				text : '重置',
				iconCls : 'btn-reset',
				scope : this,
				handler : this.reset
			}, {
				text : '取消',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		alert(this.deptId);
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'OffsupplyApplyDeptForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'offsupplyApplyDept.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : 'DEPT_ID',
				name : 'offsupplyApplyDept.deptId',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : 'APPLY_TIME',
				name : 'offsupplyApplyDept.applyTime',
				allowBlank : false,
				maxLength : 30
			}, {
				fieldLabel : 'FEE_AMOUNT',
				name : 'offsupplyApplyDept.feeAmount',
				maxLength : 18
			}, {
				fieldLabel : 'REMARK',
				name : 'offsupplyApplyDept.remark',
				xtype : 'textarea',
				maxLength : 400
			}, {
				fieldLabel : 'IS_DELETED',
				name : 'offsupplyApplyDept.isDeleted',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : 'PROCESS_INS_ID',
				name : 'offsupplyApplyDept.processInsId',
				xtype : 'numberfield'
			}, {
				fieldLabel : 'CREATE_DATE',
				name : 'offsupplyApplyDept.createDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : 'CREATE_BY',
				name : 'offsupplyApplyDept.createBy',
				maxLength : 50
			}, {
				fieldLabel : 'UPDATE_DATE',
				name : 'offsupplyApplyDept.updateDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : 'UPDATE_BY',
				name : 'offsupplyApplyDept.updateBy',
				maxLength : 50
			}, {
				fieldLabel : 'APPLY_STATE',
				name : 'offsupplyApplyDept.applyState',
				allowBlank : false,
				xtype : 'numberfield'
			} ]
		});
		this.topbar = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-add',
				text : '汇总',
				xtype : 'button',
				scope : this,
				handler : this.createRs
			} ]
		});
		var time = new Date();  
		var year="";
   		var month="";
   		year = time.getYear()+1900;
   		month = time.getMonth() + 1;
		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			tbar : this.topbar,
			// 使用RowActions
			rowActions : true,
			id : 'OffsupplyApplyOneGrid',
			url : __ctxPath + "/admin/list2OffsupplyApplyOne.do?year="+year+"&applyTime="+month+"&Q_department.depId_L_EQ="+this.deptId,
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'applicantId', 'applyTime', {
				name : 'feeAmount',
				type : 'int'
			}, 'remark', 'belongDeptId', 'createDate', 'createBy',
					'updateDate', 'updateBy', {
						name : 'depName',
						mapping : 'appUser.department.depName'
					} ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '申请人ID',
				dataIndex : 'applicantId'
			}, {
				header : '申请日期',
				dataIndex : 'applyTime'
			}, {
				header : '总额',
				dataIndex : 'feeAmount'
			}, {
				header : '备注',
				dataIndex : 'remark'
			}, {
				header : '所属部门',
				dataIndex : 'depName'
			}, {
				header : 'createDate',
				dataIndex : 'createDate'
			}, {
				header : 'createBy',
				dataIndex : 'createBy'
			}, {
				header : 'updateDate',
				dataIndex : 'updateDate'
			}, {
				header : 'updateBy',
				dataIndex : 'updateBy'
			}, new Ext.ux.grid.RowActions( {
				header : '管理',
				width : 100,
				actions : [ {
					iconCls : 'btn-del',
					qtip : '删除',
					style : 'margin:0 3px 0 3px'
				}, {
					iconCls : 'btn-edit',
					qtip : '编辑',
					style : 'margin:0 3px 0 3px'
				} ],
				listeners : {
					scope : this,
					'action' : this.onRowAction
				}
			}) ]
		// end of columns
				});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/admin/getOffsupplyApplyDept.do?id='
						+ this.id,
				root : 'data',
				preName : 'offsupplyApplyDept'
			});
		}

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
			url : __ctxPath + '/admin/saveOffsupplyApplyDept.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('OffsupplyApplyDeptGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	},// end of save
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.id);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		default:
			break;
		}
	},
	editRs : function(record) {
		new OffsupplyApplyOneVForm( {
			id : record.data.id
		}).show();
	}

});