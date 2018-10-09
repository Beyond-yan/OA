/**
 * @author 
 * @createtime 
 * @class PersonnelEmployeeForm
 * @extends Ext.Window
 * @description PersonnelEmployee表单
 * @company 捷达世软件
 */
PersonnelEmployeeForm = Ext.extend(Ext.Window,
{
	//构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		//必须先初始化组件
		this.initUIComponents();
		PersonnelEmployeeForm.superclass.constructor.call(this,
		{
			id : 'PersonnelEmployeeFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '[PersonnelEmployee]详细信息',
			buttonAlign : 'center',
			buttons : [
			{
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
	},//end of the constructor
	//初始化组件
	initUIComponents : function()
	{
		this.formPanel = new Ext.FormPanel(
		{
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			//id : 'PersonnelEmployeeForm',
			defaults :
			{
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [
			{
				name : 'personnelEmployee.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			},
			{
				fieldLabel : 'USER_ID',
				name : 'personnelEmployee.userId',
				allowBlank : false,
				xtype : 'numberfield'
			},
			{
				fieldLabel : 'EMP_CODE',
				name : 'personnelEmployee.empCode',
				allowBlank : false,
				maxLength : 30
			},
			{
				fieldLabel : 'OFFICE_PHONE',
				name : 'personnelEmployee.officePhone',
				maxLength : 30
			},
			{
				fieldLabel : 'SHORT_PHONE',
				name : 'personnelEmployee.shortPhone',
				maxLength : 30
			},
			{
				fieldLabel : 'IMAGE_SOURCE',
				name : 'personnelEmployee.imageSource',
				maxLength : 150
			},
			{
				fieldLabel : 'IS_LEAVING',
				name : 'personnelEmployee.isLeaving',
				allowBlank : false,
				xtype : 'numberfield'
			},
			{
				fieldLabel : 'BEFORE_SENIORITY',
				name : 'personnelEmployee.beforeSeniority',
				maxLength : 3
			},
			{
				fieldLabel : 'LEAVE_DATE',
				name : 'personnelEmployee.leaveDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			},
			{
				fieldLabel : 'TOTAL_SENIORITY',
				name : 'personnelEmployee.totalSeniority',
				maxLength : 3
			},
			{
				fieldLabel : 'REMARK',
				name : 'personnelEmployee.remark',
				xtype : 'textarea',
				maxLength : 400
			},
			{
				fieldLabel : 'CREATE_DATE',
				name : 'personnelEmployee.createDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			},
			{
				fieldLabel : 'CREATE_BY',
				name : 'personnelEmployee.createBy',
				maxLength : 50
			},
			{
				fieldLabel : 'UPDATE_DATE',
				name : 'personnelEmployee.updateDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			},
			{
				fieldLabel : 'UPDATE_BY',
				name : 'personnelEmployee.updateBy',
				maxLength : 50
			},
			{
				fieldLabel : 'EXT',
				name : 'personnelEmployee.ext',
				maxLength : 10
			},
			{
				fieldLabel : 'ROOM',
				name : 'personnelEmployee.room',
				maxLength : 50
			} ]
		});
		//加载表单对应的数据	
		if (this.id != null && this.id != 'undefined')
		{
			this.formPanel.loadData(
			{
				url : __ctxPath + '/personal/getPersonnelEmployee.do?id='
						+ this.id,
				root : 'data',
				preName : 'personnelEmployee'
			});
		}

	},//end of the initcomponents

	/**
	 * 重置
	 * @param {} formPanel
	 */
	reset : function()
	{
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * @param {} window
	 */
	cancel : function()
	{
		this.close();
	},
	/**
	 * 保存记录
	 */
	save : function()
	{
		$postForm(
		{
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/personal/savePersonnelEmployee.do',
			callback : function(fp, action)
			{
				var gridPanel = Ext.getCmp('PersonnelEmployeeGrid');
				if (gridPanel != null)
				{
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}//end of save

});