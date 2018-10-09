/**
 * @author
 * @createtime
 * @class DiningReceptionForm
 * @extends Ext.Window
 * @description DiningReception表单
 * @company 捷达世软件
 */
DiningReceptionForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiningReceptionForm.superclass.constructor.call(this, {
			id : 'DiningReceptionFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '接待餐申请详细信息',
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
		
		var combodept = new Ext.form.ComboBox({
			fieldLabel : '申请部门',
			hiddenName : 'diningReception.department.depId',
			id : 'DiningRcptFdepartmentcombo',
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
								'depname' ],
						listeners : {
							load : function() {
								Ext.getCmp('DiningRcptFdepartmentcombo')
									.setValue(curUserInfo.depId);
							}
						}
					})
		});		
		
		var combomealtype = new Ext.form.ComboBox({
			fieldLabel : '用餐类别',
			hiddenName : 'diningReception.diningMealtype.id',
			id:'DiningRcptFmealtypeid',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			displayField : 'typename',
			valueField : 'id',
			mode : 'local',
			store : new Ext.data.SimpleStore(
					{
						autoLoad : true,
						url : __ctxPath + '/diningMgnt/comboDiningMealtype.do',
						fields : [ 'id','typename' ],
						listeners : {
							load : function() {
									Ext.getCmp('DiningRcptFmealtypeid')
										.setValue(Ext.getCmp('DiningRcptFmealtypeid').getValue());
							}
						}							
					})		
		});

		var foodtypestore = new Ext.data.SimpleStore(
				{
					autoLoad : true,
					url : __ctxPath + '/diningMgnt/comboDiningFoodtype.do',
					fields : [ 'id','foodtypename' ],
					listeners : {
						load : function() {
								Ext.getCmp('DiningRcptFfoodtypeid')
									.setValue(Ext.getCmp('DiningRcptFfoodtypeid').getValue());
						}
					}									
				});		
		var combofoodtype = new Ext.form.ComboBox({
			fieldLabel : '用餐级别',
			hiddenName : 'diningReception.diningFoodtype.id',
			id:'DiningRcptFfoodtypeid',
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
				'Q_category_S_EQ':'接待餐'}});
			combofoodtype.setValue('');
		});	
		
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'DiningReceptionForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'diningReception.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, combodept, {
				fieldLabel : '申请人',
				name : 'diningReception.appUser.userId',
				allowBlank : false,
				xtype : 'hidden',
				value : curUserInfo.userId
			}, {
				fieldLabel : '接待日期',
				name : 'diningReception.receptiondate',
				allowBlank : false,
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date(),
				editable:false
			},
			{
				fieldLabel : '供餐食堂',
				hiddenName : 'diningReception.diningroom',
				id:'diningReceptiondiningroom',
				flex : 1,
				width : 150,
				xtype : 'combo',
				editable : false,
				allowBlank : false,
				triggerAction : 'all',
				displayField : 'configname',
				valueField : 'configname',
				mode : 'local',
				store : new Ext.data.SimpleStore(
						{
							autoLoad : true,
							url : __ctxPath + '/diningMgnt/getDiningRoomComboDiningBooking.do',
							fields : [ 'configname','configname' ],
							listeners : {
							load : function() {
									Ext.getCmp('diningReceptiondiningroom')
										.setValue(Ext.getCmp('diningReceptiondiningroom').getValue());
								}
							}	
						})
			}
			,combomealtype, combofoodtype, {
				fieldLabel : '接待对象',
				name : 'diningReception.receptiontarget',
				allowBlank : false,
				maxLength : 100
			}, {
				fieldLabel : '接待事由',
				name : 'diningReception.receptionreason',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '订餐数量(桌)',
				name : 'diningReception.receptionnumber',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : '用餐地点',
				name : 'diningReception.receptionplace',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '实际消费',
				name : 'diningReception.costlevel',
				allowBlank : false,
				xtype : 'numberfield'
			} ]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/diningMgnt/getDiningReception.do?id='
						+ this.id,
				root : 'data',
				preName : 'diningReception'
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
			url : __ctxPath + '/diningMgnt/saveDiningReception.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('DiningReceptionGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});