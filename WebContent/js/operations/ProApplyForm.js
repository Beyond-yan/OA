/**
 * @author
 * @createtime
 * @class ProApplyForm
 * @extends Ext.Window
 * @description ProApply表单
 * @company 捷达世软件
 */
ProApplyForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ProApplyForm.superclass.constructor.call(this, {
			id : 'ProApplyFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '[ProApply]详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, 
//			{
//				text : '重置',
//				iconCls : 'btn-reset',
//				scope : this,
//				handler : this.reset
//			}, 
			{
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
			// id : 'ProApplyForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'proApply.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '员工工号',
				name : 'proApply.userCode',
				maxLength : 30
			}, {
				fieldLabel : '年龄',
				name : 'proApply.age',
				xtype : 'numberfield'
			}, {
				fieldLabel : '岗位',
				name : 'proApply.workPosition',
				maxLength : 50
			},  {
//				fieldLabel : 'USER_ID',
				id:'proApply.userId',
				name : 'proApply.userId',
				xtype : 'hidden'
			}, {
				fieldLabel : '家庭住址',
				name : 'proApply.homeAddress',
				maxLength : 200
			}, {
				fieldLabel : '联系电话',
				name : 'proApply.contactPhone',
				maxLength : 30
			}, {
				fieldLabel : '紧急联系人电话',
				name : 'proApply.urgentPerson',
				maxLength : 100
			}, {
				fieldLabel : '紧急联系电话',
				name : 'proApply.urgentPhone',
				maxLength : 30
			}, {
				fieldLabel : '符合条件选择',
				hiddenName : 'proApply.fitCondition',
				xtype : 'combo',
				mode : 'local',
				editable : false,
				allowBlank : false,
				triggerAction : 'all',
				value : '1',
				store : [
						[ '1', '单身' ],
						[ '2', '配偶不在深圳工作' ],
						[ '3','特殊情况说明' ] ]
			}, {
				fieldLabel : '特殊情况说明',
				name : 'proApply.applyReason',
				xtype : 'textarea',
				maxLength : 400
			}, {
				fieldLabel : '申请类型',
				hiddenName : 'proApply.applyType',
				xtype : 'combo',
				mode : 'local',
				editable : false,
				allowBlank : false,
				readOnly:true,
				triggerAction : 'all',
				value : '1',
				store : [
						[ '1', '住宿' ],
						[ '2', '退宿' ],
						[ '3','换宿' ] ]
			}  ]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/operations/getProApply.do?id=' + this.id,
				root : 'data',
				preName : 'proApply'
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
			url : __ctxPath + '/operations/saveProApply.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('ProApplyGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});