/**
 * @author 
 * @createtime 
 * @class AddrbookOuterForm
 * @extends Ext.Window
 * @description AddrbookOuter表单
 * @company 捷达世软件
 */
AddrbookOuterForm = Ext.extend(Ext.Window,
{
	//构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		//必须先初始化组件
		this.initUIComponents();
		AddrbookOuterForm.superclass.constructor.call(this,
		{
			id : 'AddrbookOuterFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '外部通讯录详细信息',
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
			//id : 'AddrbookOuterForm',
			defaults :
			{
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [
			{
				name : 'addrbookOuter.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			},
			{
				fieldLabel : '姓名',
				name : 'addrbookOuter.personName',
				allowBlank : false,
				maxLength : 50
			},
			{
				fieldLabel : '称呼',
				hiddenName : 'addrbookOuter.personSex',
				allowBlank : false,
				editable : false,
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				value : '1',
				store : [ [ '1', '先生' ], [ '2', '女士' ] ]
			},
			{
				fieldLabel : '公司',
				name : 'addrbookOuter.company',
				allowBlank : false,
				maxLength : 50
			},
			{
				fieldLabel : '部门',
				name : 'addrbookOuter.department',
				maxLength : 50
			},
			{
				fieldLabel : '科室',
				name : 'addrbookOuter.room',
				maxLength : 50
			},
			{
				fieldLabel : '办公电话',
				name : 'addrbookOuter.officePhone',
				xtype:'numberfield',
				maxLength : 20
			},
			{
				fieldLabel : '内线分机',
				name : 'addrbookOuter.ext',
				xtype:'numberfield',
				maxLength : 10
			},
			{
				fieldLabel : '手机',
				name : 'addrbookOuter.mobile',
				allowBlank:false,
				xtype:'numberfield',
				maxLength : 20
			},
			{
				fieldLabel : '短号',
				name : 'addrbookOuter.shortMobile',
				xtype:'numberfield',
				maxLength : 10
			},
			{
				fieldLabel : 'email',
				name : 'addrbookOuter.email',
				xtype:'textfield',
				maxLength : 30
			}]
		});
		//加载表单对应的数据	
		if (this.id != null && this.id != 'undefined')
		{
			this.formPanel
					.loadData(
					{
						url : __ctxPath + '/personal/getAddrbookOuter.do?id='
								+ this.id,
						root : 'data',
						preName : 'addrbookOuter'
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
			url : __ctxPath + '/personal/saveAddrbookOuter.do',
			callback : function(fp, action)
			{
				var gridPanel = Ext.getCmp('AddrbookOuterGrid');
				if (gridPanel != null)
				{
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}//end of save

});