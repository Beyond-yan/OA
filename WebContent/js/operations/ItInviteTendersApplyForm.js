/**
 * @author
 * @createtime
 * @class ItInviteTendersApplyForm
 * @extends Ext.Window
 * @description 招标管理表单
 * @company 捷达世软件
 */
ItInviteTendersApplyForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ItInviteTendersApplyForm.superclass.constructor.call(this, {
			id : 'ItInviteTendersApplyFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '招标详细信息',
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
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'ItInviteTendersApplyForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'itInviteTendersApply.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '招标名称',
				name : 'itInviteTendersApply.itName',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '招标类别',
				name : 'itInviteTendersApply.itType',
				xtype : 'numberfield'
			}, {
				fieldLabel : '招标金额',
				name : 'itInviteTendersApply.itAmount'
			}, {
				fieldLabel : '项目性质',
				name : 'itInviteTendersApply.projectNature',
				maxLength : 50
			}, {
				fieldLabel : '招标经办人',
				name : 'itInviteTendersApply.itOperator',
				maxLength : 50
			}, {
				fieldLabel : '招标编号',
				name : 'itInviteTendersApply.itCode',
				maxLength : 30
			}, {
				fieldLabel : '项目主办人',
				name : 'itInviteTendersApply.projectSponsor',
				maxLength : 50
			}, {
				fieldLabel : '合作方案',
				name : 'itInviteTendersApply.cooprateWay',
				maxLength : 50
			}, {
				fieldLabel : 'PROCESS_INSTANCE_ID',
				name : 'itInviteTendersApply.processInstanceId',
				xtype : 'numberfield'
			}, {
				fieldLabel : '创建日期',
				name : 'itInviteTendersApply.createDate',
				allowBlank : false,
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : '创建人员',
				name : 'itInviteTendersApply.createBy',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '更新日期',
				name : 'itInviteTendersApply.updateDate',
				allowBlank : false,
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : '更新人员',
				name : 'itInviteTendersApply.updateBy',
				allowBlank : false,
				maxLength : 50
			} ]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/operations/getItInviteTendersApply.do?id='
						+ this.id,
				root : 'data',
				preName : 'itInviteTendersApply'
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
			url : __ctxPath + '/operations/saveItInviteTendersApply.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('ItInviteTendersApplyGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});