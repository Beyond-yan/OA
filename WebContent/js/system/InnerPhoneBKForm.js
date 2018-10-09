InnerPhoneBKForm = Ext.extend(Ext.Window, {
	//构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		//必须先初始化组件
		this.initUIComponents();
		InnerPhoneBKForm.superclass.constructor.call(this, {
			id : 'InnerPhoneBKFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 430,
			width : 500,
			maximizable : true,
			title : '人员详细',
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
//			}
//			,
				{
				text : '取消',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},//end of the constructor
	//初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			autoScroll : true,
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ 
			{
				fieldLabel : 'id',
				name : 'pid',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, 
			         
			{
				fieldLabel : 'userID',
				name : 'personnelEmployee.userId',
				xtype : 'hidden'
			}, 
			{
				fieldLabel : '帐号',
				name:'personnelEmployee.appUser.username',
				disabled:'true'
			},
			{
				fieldLabel : '姓名',
				name:'personnelEmployee.appUser.fullname',
				disabled:'true'
			},
			{
				fieldLabel : '称呼',
				hiddenName : 'personnelEmployee.appUser.title',
				allowBlank : false,
				editable : false,
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				store : [ [ '1', '先生' ], [ '2', '女士' ] ],
				disabled:'true'
			},
			
			{
				fieldLabel : '所属部门',
				name:'personnelEmployee.appUser.department.depName',
				disabled:'true'
			},	
			{
				fieldLabel : '职位',
				name : 'personnelEmployee.appUser.position'
			},
			{
				fieldLabel : '处室',
				name:'personnelEmployee.room'
			},
			{
				fieldLabel : 'eMail',
				name:'personnelEmployee.appUser.email',
				vtype :'email'
			},
			{
				xtype:'numberfield',
				fieldLabel : '家庭电话',
				name:'personnelEmployee.appUser.phone'
					
			},	
			{
				xtype:'numberfield',
				fieldLabel : '办公电话',
				name:'personnelEmployee.officePhone'
			},	
			{
				xtype:'numberfield',
				fieldLabel : '内线分机',
				name:'personnelEmployee.ext'
			},	
			{
				xtype:'numberfield',
				fieldLabel : '移动电话',
				name:'personnelEmployee.appUser.mobile'
			},	
			{
				xtype:'numberfield',
				fieldLabel : '短号',
				name:'personnelEmployee.shortPhone'
			},
			{
				fieldLabel : '是否领导',
				hiddenName : 'personnelEmployee.isLeader',
				allowBlank : false,
				editable : false,
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				store : [ [ '1', '是' ], [ '0', '否' ] ]
			}
			,
			{
				fieldLabel : '是否值班电话',
				hiddenName : 'personnelEmployee.isWorktel',
				allowBlank : false,
				editable : false,
				xtype : 'combo',
				mode : 'local',
				triggerAction : 'all',
				store : [ [ '1', '是' ], [ '0', '否' ] ]
			}
			]
		});
		//加载表单对应的数据	
		if (this.id != null && this.id != 'undefined') 
		{		
			this.formPanel.loadData( {
				url : __ctxPath + '/personal/getPersonnelEmployee.do?pid=' + this.id,
				root : 'data',
				preName:'personnelEmployee'
			});
		}

	},//end of the initcomponents

	/**
	 * 重置
	 * @param {} formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * @param {} window
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
			url : __ctxPath + '/personal/savePersonnelEmployee.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('InnerAppUserGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}//end of save

});